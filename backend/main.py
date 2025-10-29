import os
import json
import jwt
import logging
import sqlite3
import qrcode
import io
import base64
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from passlib.context import CryptContext
from dotenv import load_dotenv
from web3 import Web3


# ─── Auth setup ───────────────────────────────
SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

security = HTTPBearer()

log_path = os.path.join(os.path.dirname(__file__), "app.log")
logging.basicConfig(
    filename=log_path,
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

load_dotenv()
app = FastAPI(title="Supply Chain Tracker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Blockchain setup
w3 = Web3(Web3.HTTPProvider(f"https://sepolia.infura.io/v3/{os.getenv('INFURA_API_KEY')}"))
if not w3.is_connected():
    raise Exception("❌ Web3 not connected! Check INFURA_API_KEY or network settings.")
else:
    logger.info("✅ Connected to Sepolia network successfully.")

private_key = os.getenv("PRIVATE_KEY")
account = w3.eth.account.from_key(private_key)
contract_address = os.getenv("CONTRACT_ADDRESS")
with open("artifacts/contracts/ProductRegistry.sol/ProductRegistry.json") as f:
    abi = json.load(f)["abi"]
contract = w3.eth.contract(address=contract_address, abi=abi)

# SQLite setup
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "products.db"))
def init_db():
    try:
        conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        c = conn.cursor()
        c.execute("""
            CREATE TABLE IF NOT EXISTS products (
                product_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                batch TEXT NOT NULL,
                manufacturer TEXT NOT NULL,
                turmeric_origin TEXT,
                harvest_date INTEGER,
                tx_hash TEXT
            )
        """)
        conn.commit()
        conn.close()
        logger.info(f"✅ Database initialized at {DB_PATH}")
    except Exception as e:
        logger.error(f"❌ Failed to initialize DB: {e}")
        raise

init_db()

def get_db_connection():
    try:
        conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn
    except Exception as e:
        logger.error(f"❌ Error connecting to DB: {e}")
        raise

# Auth setup
SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

fake_users_db = {
    "admin@example.com": {
        "username": "admin@example.com",
        "hashed_password": pwd_context.hash("admin"),
        "role": "admin"
    },
    "producer@example.com": {
        "username": "producer@example.com",
        "hashed_password": pwd_context.hash("producer"),
        "role": "producer"
    },
    "seller@example.com": {
        "username": "seller@example.com",
        "hashed_password": pwd_context.hash("seller"),
        "role": "seller"
    },
    "consumer@example.com": {
        "username": "consumer@example.com",
        "hashed_password": pwd_context.hash("consumer"),
        "role": "consumer"
    }
}

class User(BaseModel):
    email: str
    password: str

class SpiceProduct(BaseModel):
    product_id: str
    name: str
    batch: str
    manufacturer: str
    saffron_region: str
    harvest_season: int

class ProductResponse(BaseModel):
    product_id: str
    name: str
    batch: str
    manufacturer: str
    status: str
    timestamp: int
    saffron_region: str
    harvest_season: int

class UpdateStatusRequest(BaseModel):
    product_id: str = Field(..., description="Product ID to update")
    status: str = Field(..., description="New status (e.g. 'Processing', 'Distributor', 'Delivered')")

class QRCodeRequest(BaseModel):
    product_id: str = Field(..., description="Product ID for QR code")
    frontend_url: str = Field(default="http://localhost:3000", description="Frontend URL")
    target_url: str | None = Field(default=None, description="Optional explicit URL to encode in the QR (e.g., Etherscan tx URL)")

class QRCodeResponse(BaseModel):
    qr_code_data: str
    product_id: str
    verify_url: str



def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username not in fake_users_db:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return fake_users_db[username]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")


@app.on_event("startup")
async def startup_event():
    from dotenv import load_dotenv
     # Force-load the .env file from the same directory as main.py
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if not load_dotenv(env_path):
        print("⚠️ .env not loaded from", env_path)
    else:
        print("✅ .env loaded successfully from", env_path)

    # Check that the Infura key is actually loaded
    infura_key = os.getenv("INFURA_API_KEY")
    print("Loaded INFURA key:", infura_key)

    # Validate Web3 connection
    w3 = Web3(Web3.HTTPProvider(f"https://sepolia.infura.io/v3/{infura_key}"))

    if not w3.is_connected():
        print("❌ Web3 not connected! Check your INFURA_API_KEY or network.")
    else:
        print("✅ Connected to Sepolia network successfully.")



@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db_user = fake_users_db.get(form_data.username)
    if not db_user or not verify_password(form_data.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(
    data={"sub": form_data.username, "role": db_user["role"]}
)

    return {"access_token": access_token, "token_type": "bearer", "role": db_user["role"]}

@app.post("/add-spice")
def add_spice(product: SpiceProduct, user=Depends(get_current_user)):
    if user["role"] not in ["admin", "producer"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    try:
        nonce = w3.eth.get_transaction_count(account.address)
        txn = contract.functions.registerProduct(
            product.product_id,
            product.name,
            product.batch,
            product.manufacturer,
            product.saffron_region,
            product.harvest_season
        ).build_transaction({
            'chainId': 11155111,
            'gas': 300000,
            'gasPrice': w3.eth.gas_price,
            'nonce': nonce
        })
        logger.info(f"Nonce: {nonce}, Gas Price: {w3.eth.gas_price}")

        signed_txn = w3.eth.account.sign_transaction(txn, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction).hex()
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        if receipt.status == 0:
            raise Exception("Transaction failed")
        conn = get_db_connection()
        c = conn.cursor()
        c.execute("""
            INSERT OR REPLACE INTO products
            (product_id, name, batch, manufacturer, turmeric_origin, harvest_date, tx_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (product.product_id, product.name, product.batch, product.manufacturer,
              product.saffron_region, product.harvest_season, tx_hash))
        conn.commit()
        c.execute("SELECT product_id FROM products WHERE product_id = ?", (product.product_id,))
        if not c.fetchone():
            raise Exception("Failed to insert product ID into SQLite")
        conn.close()
        logger.info(f"✅ Product '{product.product_id}' inserted with tx_hash {tx_hash}")
        return {"tx_hash": tx_hash, "message": "Spice product registered successfully"}
    except Exception as e:
        import traceback
        logger.error(f"❌ Error inserting product: {e}")
        traceback.print_exc()     # <-- add this
        raise HTTPException(status_code=500, detail=f"Failed to add product: {str(e)}")



@app.post("/update-status")
def update_status(req: UpdateStatusRequest, user=Depends(get_current_user)):
    if user["role"] not in ["admin", "producer", "seller"]:
        raise HTTPException(status_code=403, detail="Only admin, producer, or seller can update status")
    try:
        logger.info(f"🔄 Updating status for product {req.product_id} to '{req.status}' by {user['username']}")
        
        nonce = w3.eth.get_transaction_count(account.address)
        txn = contract.functions.updateProductStatus(
            req.product_id, 
            req.status
        ).build_transaction({
            'chainId': 11155111,
            'gas': 300000,
            'gasPrice': w3.eth.gas_price,
            'nonce': nonce
        })

        signed_txn = w3.eth.account.sign_transaction(txn, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
        logger.info(f"✅ Status updated successfully for {req.product_id}. TX: {tx_hash.hex()}")
        
        return {
            "tx_hash": tx_hash.hex(),
            "product_id": req.product_id,
            "new_status": req.status,
            "message": "Product status updated successfully"
        }
    
    except Exception as e:
        logger.error(f"❌ Error updating product status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


from datetime import datetime, timedelta

@app.get("/get-traces/{product_id}")
def get_traces(product_id: str, user=Depends(get_current_user)):
    """
    Fetch all trace records for a given product from the blockchain.
    Automatically formats timestamps to IST date-time strings.
    """

    
    try:
        logger.info(f"📦 Fetching trace records for product: {product_id}")
        traces = contract.functions.getTraceRecords(product_id).call()

        trace_data = []
        for trace in traces:
            # Convert blockchain timestamp (UTC) → IST
            timestamp_utc = datetime.utcfromtimestamp(trace[3])
            timestamp_ist = timestamp_utc + timedelta(hours=5, minutes=30)
            formatted_time = timestamp_ist.strftime("%Y-%m-%d %H:%M:%S IST")

            trace_data.append({
                "stage": trace[0],
                "company": trace[1],
                "location": trace[2],
                "timestamp": trace[3],
                "formatted_time": formatted_time
            })

        logger.info(f"✅ Found {len(trace_data)} trace records for {product_id}")
        return {
            "product_id": product_id,
            "trace_count": len(trace_data),
            "traces": trace_data
        }

    except Exception as e:
        logger.error(f"❌ Error fetching traces for {product_id}: {str(e)}")
        raise HTTPException(status_code=404, detail="No trace records found or product does not exist.")


from pydantic import BaseModel, Field

class TraceRecord(BaseModel):
    product_id: str = Field(..., description="Product ID for trace record")
    stage: str = Field(..., description="Stage of the supply chain (e.g. Processing, Distribution, Retail)")
    company: str = Field(..., description="Company or entity responsible at this stage")
    location: str = Field(..., description="Location of the operation (e.g. Kerala, Chennai, Mumbai)")

@app.post("/add-trace")
def add_trace(trace: TraceRecord, user=Depends(get_current_user)):
    """
    Add a trace record to the blockchain for the specified product.
    Each trace stores stage, company, location, and a blockchain timestamp.
    """
    try:
        logger.info(f"🧩 Adding trace for {trace.product_id} → {trace.stage} at {trace.location}")

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
        logger.info(f"✅ Trace added successfully for {trace.product_id}. TX: {tx_hash.hex()}")

        return {
            "tx_hash": tx_hash.hex(),
            "product_id": trace.product_id,
            "stage": trace.stage,
            "company": trace.company,
            "location": trace.location,
            "message": "Trace record added successfully"
        }

    except Exception as e:
        logger.error(f"❌ Error adding trace record: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-qr", response_model=QRCodeResponse)
def generate_qr(request: QRCodeRequest, user=Depends(get_current_user)):
    try:
        logger.info(f"Generating QR code for product: {request.product_id}")
        
        # Create default verify URL (frontend verification page)
        default_verify_url = f"{request.frontend_url}/verify-product?product_id={request.product_id}"
        # Use explicit target_url if provided (e.g., an Etherscan transaction URL)
        target = request.target_url or default_verify_url
        
        # Generate QR code
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(target)
        qr.make(fit=True)
        
        # Create image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to base64 string
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        logger.info(f"✅ QR code generated successfully for product: {request.product_id}")
        return QRCodeResponse(
            qr_code_data=img_str,
            product_id=request.product_id,
            verify_url=target
        )
    except Exception as e:
        logger.error(f"❌ Error generating QR code: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/verify/all", response_model=list[ProductResponse])
def verify_all(user=Depends(get_current_user)):
    try:
        # Try blockchain first
        try:
            product_ids = contract.functions.getAllProductIds().call()
            logger.info(f"Fetched {len(product_ids)} product IDs from blockchain: {product_ids}")
        except Exception as e:
            logger.warning(f"Blockchain getAllProductIds failed: {str(e)}, falling back to SQLite")
            product_ids = []
        # Fallback to SQLite
        if not product_ids:
            conn = get_db_connection()
            c = conn.cursor()
            c.execute("SELECT product_id FROM products")
            product_ids = [row["product_id"] for row in c.fetchall()]
            conn.close()
            logger.info(f"Fetched {len(product_ids)} product IDs from SQLite: {product_ids}")
        if not product_ids:
            logger.info("No products found")
            return []
        products = []
        for pid in product_ids:
            try:
                product = contract.functions.getProduct(pid).call()
                products.append({
                    "product_id": pid,
                    "name": product[0],
                    "batch": product[1],
                    "manufacturer": product[2],
                    "status": product[3],
                    "timestamp": product[4],
                    "saffron_region": product[5],
                    "harvest_season": product[6]
                })
            except Exception as e:
                logger.error(f"Failed to fetch product {pid}: {str(e)}")
                continue
        logger.info(f"Returning {len(products)} products")
        return products
    except Exception as e:
        logger.error(f"❌ Verify all failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch products: {str(e)}")

@app.get("/verify/{product_id}", response_model=ProductResponse)
def verify_product(product_id: str, user=Depends(get_current_user)):
    try:
        product = contract.functions.getProduct(product_id).call()
        return {
            "product_id": product_id,
            "name": product[0],
            "batch": product[1],
            "manufacturer": product[2],
            "status": product[3],
            "timestamp": product[4],
            "saffron_region": product[5],
            "harvest_season": product[6]
        }
    except Exception as e:
        logger.error(f"❌ Error verifying product {product_id}: {str(e)}")
        raise HTTPException(status_code=404, detail="Product not found")

@app.get("/debug/get-all-ids")
def debug_get_all_ids():
    try:
        product_ids = contract.functions.getAllProductIds().call()
        return {"product_ids": product_ids}
    except Exception as e:
        logger.error(f"❌ Debug get-all-ids failed: {str(e)}")
        return {"error": str(e)}

@app.get("/ping")
def ping(): 
    return {"status": "ok"}