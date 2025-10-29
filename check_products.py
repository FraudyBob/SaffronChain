from web3 import Web3
import json

# Connect to Sepolia via Infura
INFURA_URL = "https://sepolia.infura.io/v3/097a0b78634248f586f3f1ad17787690"
CONTRACT_ADDRESS = "0x8Ecd0dF47A9215f1f2f1c277ff74c66e06b813d1"

# Load ABI
with open("artifacts/contracts/ProductRegistry.sol/ProductRegistry.json") as f:
    abi = json.load(f)["abi"]

# Create Web3 connection and contract object
w3 = Web3(Web3.HTTPProvider(INFURA_URL))
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)

# Now this will work
print(contract.functions.getAllProductIds().call())
