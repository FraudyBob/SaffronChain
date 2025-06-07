import os
import json
import jwt
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from passlib.context import CryptContext
from dotenv import load_dotenv, find_dotenv
from web3 import Web3

# Load env
load_dotenv(find_dotenv())

app = FastAPI()

# Blockchain setup
w3 = Web3(Web3.HTTPProvider(f"https://sepolia.infura.io/v3/{os.getenv('INFURA_API_KEY')}"))
private_key = os.getenv("PRIVATE_KEY")
account = w3.eth.account.from_key(private_key)

contract_address = os.getenv("CONTRACT_ADDRESS")
with open("artifacts/contracts/ProductRegistry.sol/ProductRegistry.json") as f:
    abi = json.load(f)["abi"]

contract = w3.eth.contract(address=contract_address, abi=abi)

# Auth setup
SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
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

# Models
class User(BaseModel):
    email: str
    password: str

class UpdateStatusRequest(BaseModel):
    product_id: str
    status: str

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

@app.get("/verify/{product_id}")
def verify_product(product_id: str, user=Depends(get_current_user)):
    try:
        product = contract.functions.getProduct(product_id).call()
        return {
            "name": product[0],
            "batch": product[1],
            "manufacturer": product[2],
            "status": product[3],
            "timestamp": product[4]
        }
    except Exception:
        raise HTTPException(status_code=404, detail="Product not found")

@app.post("/register-product")
def register_product(product_id: str, name: str, batch: str, manufacturer: str, user=Depends(get_current_user)):
    try:
        nonce = w3.eth.get_transaction_count(account.address)
        txn = contract.functions.registerProduct(product_id, name, batch, manufacturer).build_transaction({
            'chainId': 11155111,
            'gas': 300000,
            'gasPrice': w3.eth.gas_price,
            'nonce': nonce
        })

        signed_txn = w3.eth.account.sign_transaction(txn, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
        return {"tx_hash": tx_hash.hex()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/update-status")
def update_status(req: UpdateStatusRequest, user=Depends(get_current_user)):
    try:
        nonce = w3.eth.get_transaction_count(account.address)
        txn = contract.functions.updateProductStatus(req.product_id, req.status).build_transaction({
            'chainId': 11155111,
            'gas': 300000,
            'gasPrice': w3.eth.gas_price,
            'nonce': nonce
        })

        signed_txn = w3.eth.account.sign_transaction(txn, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
        return {"tx_hash": tx_hash.hex()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
