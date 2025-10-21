import os
import json
import jwt
import logging
import qrcode
import io
import base64
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from passlib.context import CryptContext
from dotenv import load_dotenv, find_dotenv
from web3 import Web3
from typing import Optional, List

# Load env
load_dotenv(find_dotenv())

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Supply Chain Tracker API", version="1.0.0")


app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:3000"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# Blockchain setup
w3 = Web3(Web3.HTTPProvider(f"https://sepolia.infura.io/v3/{os.getenv('INFURA_API_KEY')}"))
private_key = os.getenv("PRIVATE_KEY")
account = w3.eth.account.from_key(private_key)

contract_address = os.getenv("CONTRACT_ADDRESS")
with open("../artifacts/contracts/ProductRegistry.sol/ProductRegistry.json") as f:
    abi = json.load(f)["abi"]

contract = w3.eth.contract(address=contract_address, abi=abi)

# Auth setup
SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Fake DB
fake_users_db = {
    "consumer@example.com": {
        "username": "consumer@example.com",
        "hashed_password": pwd_context.hash("password"),
        "role": "consumer"
    },
    "seller@example.com": {
        "username": "seller@example.com",
        "hashed_password": pwd_context.hash("password"),
        "role": "seller"
    },
    "producer@example.com": {
        "username": "producer@example.com",
        "hashed_password": pwd_context.hash("password"),
        "role": "producer"
    },
    "admin@example.com": {
        "username": "admin@example.com",
        "hashed_password": pwd_context.hash("password"),
        "role": "admin"
    },
}

# Pydantic Models
class User(BaseModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=6, description="User password")

class UserResponse(BaseModel):
    access_token: str
    token_type: str
    role: str

class ProductRegistration(BaseModel):
    product_id: str = Field(..., description="Unique product identifier")
    name: str = Field(..., description="Product name")
    batch: str = Field(..., description="Batch number")
    manufacturer: str = Field(..., description="Manufacturer name")
    turmeric_origin: str = Field(..., description="Turmeric origin location")
    harvest_date: int = Field(..., description="Harvest date as Unix timestamp")

class SpiceProduct(BaseModel):
    product_id: str = Field(..., description="Unique product identifier")
    name: str = Field(..., description="Product name")
    batch: str = Field(..., description="Batch number")
    manufacturer: str = Field(..., description="Manufacturer name")
    turmeric_origin: str = Field(..., description="Turmeric origin location")
    harvest_date: int = Field(..., description="Harvest date as Unix timestamp")

class ProductResponse(BaseModel):
    name: str
    batch: str
    manufacturer: str
    status: str
    timestamp: int
    turmeric_origin: str
    harvest_date: int

class UpdateStatusRequest(BaseModel):
    product_id: str = Field(..., description="Product ID to update")
    status: str = Field(..., description="New status")

class TraceRecord(BaseModel):
    product_id: str = Field(..., description="Product ID")
    stage: str = Field(..., description="Supply chain stage")
    company: str = Field(..., description="Company name")
    location: str = Field(..., description="Location")

class QRCodeRequest(BaseModel):
    product_id: str = Field(..., description="Product ID for QR code")
    frontend_url: str = Field(default="http://localhost:3000", description="Frontend URL")

class QRCodeResponse(BaseModel):
    qr_code_data: str
    product_id: str
    verify_url: str

# Auth utils
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username not in fake_users_db:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return fake_users_db[username]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")

# API
@app.post("/register")
def register(user: User):
    if user.email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = pwd_context.hash(user.password)
    fake_users_db[user.email] = {
        "username": user.email,
        "hashed_password": hashed_password,
        "role": "consumer"  # default role
    }
    return {"msg": "User registered successfully"}

@app.post("/login")
def login(user: User):
    db_user = fake_users_db.get(user.email)
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    access_token = create_access_token(data={"sub": db_user["username"], "role": db_user["role"]})
    return {"access_token": access_token, "token_type": "bearer", "role": db_user["role"]}

@app.get("/verify/{product_id}", response_model=ProductResponse)
def verify_product(product_id: str, user=Depends(get_current_user)):
    try:
        logger.info(f"Verifying product: {product_id} for user: {user['username']}")
        product = contract.functions.getProduct(product_id).call()
        logger.info(f"Product found: {product[0]}")
        return ProductResponse(
            name=product[0],
            batch=product[1],
            manufacturer=product[2],
            status=product[3],
            timestamp=product[4],
            turmeric_origin=product[5],
            harvest_date=product[6]
        )
    except Exception as e:
        logger.error(f"Error verifying product {product_id}: {str(e)}")
        raise HTTPException(status_code=404, detail="Product not found")

@app.post("/register-product")
def register_product(product: ProductRegistration, user=Depends(get_current_user)):
    try:
        logger.info(f"Registering product: {product.product_id} by user: {user['username']}")
        nonce = w3.eth.get_transaction_count(account.address)
        txn = contract.functions.registerProduct(
            product.product_id, 
            product.name, 
            product.batch, 
            product.manufacturer,
            product.turmeric_origin,
            product.harvest_date
        ).build_transaction({
            'chainId': 11155111,
            'gas': 300000,
            'gasPrice': w3.eth.gas_price,
            'nonce': nonce
        })

        signed_txn = w3.eth.account.sign_transaction(txn, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
        logger.info(f"Product registered successfully. TX: {tx_hash.hex()}")
        return {"tx_hash": tx_hash.hex(), "message": "Product registered successfully"}
    except Exception as e:
        logger.error(f"Error registering product: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/add-spice")
def add_spice(product: ProductRegistration, user=Depends(get_current_user)):
    """Alias for register-product specifically for spices"""
    return register_product(product, user)

@app.post("/update-status")
def update_status(req: UpdateStatusRequest, user=Depends(get_current_user)):
    try:
        logger.info(f"Updating status for product: {req.product_id} to {req.status} by user: {user['username']}")
        nonce = w3.eth.get_transaction_count(account.address)
        txn = contract.functions.updateProductStatus(req.product_id, req.status).build_transaction({
            'chainId': 11155111,
            'gas': 300000,
            'gasPrice': w3.eth.gas_price,
            'nonce': nonce
        })

        signed_txn = w3.eth.account.sign_transaction(txn, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
        logger.info(f"Status updated successfully. TX: {tx_hash.hex()}")
        return {"tx_hash": tx_hash.hex(), "message": "Status updated successfully"}
    except Exception as e:
        logger.error(f"Error updating status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/add-trace")
def add_trace(trace: TraceRecord, user=Depends(get_current_user)):
    try:
        logger.info(f"Adding trace for product: {trace.product_id} at stage: {trace.stage}")
        nonce = w3.eth.get_transaction_count(account.address)
        txn = contract.functions.addTraceRecord(
            trace.product_id,
            trace.stage,
            trace.company,
            trace.location
        ).build_transaction({
            'chainId': 11155111,
            'gas': 300000,
            'gasPrice': w3.eth.gas_price,
            'nonce': nonce
        })

        signed_txn = w3.eth.account.sign_transaction(txn, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
        logger.info(f"Trace added successfully. TX: {tx_hash.hex()}")
        return {"tx_hash": tx_hash.hex(), "message": "Trace record added successfully"}
    except Exception as e:
        logger.error(f"Error adding trace: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-qr", response_model=QRCodeResponse)
def generate_qr(request: QRCodeRequest, user=Depends(get_current_user)):
    try:
        logger.info(f"Generating QR code for product: {request.product_id}")
        
        # Create verify URL
        verify_url = f"{request.frontend_url}/verify-product?product_id={request.product_id}"
        
        # Generate QR code
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(verify_url)
        qr.make(fit=True)
        
        # Create image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to base64
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        logger.info(f"QR code generated successfully for product: {request.product_id}")
        return QRCodeResponse(
            qr_code_data=img_str,
            product_id=request.product_id,
            verify_url=verify_url
        )
    except Exception as e:
        logger.error(f"Error generating QR code: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/add-spice")
def add_spice(product: SpiceProduct, user=Depends(get_current_user)):
    """Add spice product with turmeric focus"""
    try:
        logger.info(f"Adding spice product: {product.product_id} by user: {user['username']}")
        nonce = w3.eth.get_transaction_count(account.address)
        txn = contract.functions.registerProduct(
            product.product_id, 
            product.name, 
            product.batch, 
            product.manufacturer,
            product.turmeric_origin,
            product.harvest_date
        ).build_transaction({
            'chainId': 11155111,
            'gas': 300000,
            'gasPrice': w3.eth.gas_price,
            'nonce': nonce
        })

        signed_txn = w3.eth.account.sign_transaction(txn, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
        logger.info(f"Spice product added successfully. TX: {tx_hash.hex()}")
        return {"tx_hash": tx_hash.hex(), "message": "Spice product registered successfully"}
    except Exception as e:
        logger.error(f"Error adding spice product: {str(e)}")
        error_msg = str(e)
        if "Product already exists" in error_msg:
            raise HTTPException(status_code=400, detail="Product already exists")
        raise HTTPException(status_code=500, detail=error_msg)

@app.get("/verify/all")
def get_all_products(user=Depends(get_current_user)):
    """Get all products from blockchain"""
    try:
        logger.info(f"Fetching all products for user: {user['username']}")
        product_ids = contract.functions.getAllProductIds().call()
        products = []
        
        for product_id in product_ids:
            try:
                product_data = contract.functions.getProduct(product_id).call()
                products.append({
                    "id": product_id,
                    "name": product_data[0],
                    "batch": product_data[1],
                    "manufacturer": product_data[2],
                    "status": product_data[3],
                    "timestamp": product_data[4],
                    "turmeric_origin": product_data[5],
                    "harvest_date": product_data[6]
                })
            except Exception as e:
                logger.warning(f"Could not fetch product {product_id}: {str(e)}")
                continue
        
        return {"products": products, "count": len(products)}
    except Exception as e:
        logger.error(f"Error fetching all products: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get-traces/{product_id}")
def get_traces(product_id: str, user=Depends(get_current_user)):
    """Get trace records for a product"""
    try:
        logger.info(f"Fetching traces for product: {product_id}")
        traces = contract.functions.getTraceRecords(product_id).call()
        
        trace_data = []
        for trace in traces:
            trace_data.append({
                "stage": trace[0],
                "company": trace[1],
                "location": trace[2],
                "timestamp": trace[3]
            })
        
        return {"traces": trace_data, "count": len(trace_data)}
    except Exception as e:
        logger.error(f"Error fetching traces for {product_id}: {str(e)}")
        raise HTTPException(status_code=404, detail="Product not found or no traces available")
