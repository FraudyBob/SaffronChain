from web3 import Web3
import json

# --- Setup ---
INFURA_URL = "https://sepolia.infura.io/v3/097a0b78634248f586f3f1ad17787690"
CONTRACT_ADDRESS = "0x8Ecd0dF47A9215f1f2f1c277ff74c66e06b813d1"
ABI_PATH = "artifacts/contracts/ProductRegistry.sol/ProductRegistry.json"

# --- Connect ---
w3 = Web3(Web3.HTTPProvider(INFURA_URL))

with open(ABI_PATH) as f:
    abi = json.load(f)["abi"]

contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)

# --- Test ABI compatibility ---
onchain_code = w3.eth.get_code(CONTRACT_ADDRESS)
if not onchain_code or onchain_code == b'':
    print("❌ Contract not found at this address (maybe wrong network or not deployed).")
else:
    print("✅ Contract code found at address!")
    print(f"🔹 Bytecode size: {len(onchain_code)} bytes")

# Check for expected functions
expected_functions = [
    "registerProduct",
    "getProduct",
    "getAllProductIds",
    "updateProductStatus",
    "addTraceRecord"
]

print("\n🔍 Checking function presence in ABI:")
abi_functions = [fn["name"] for fn in abi if fn.get("type") == "function"]
for fn in expected_functions:
    if fn in abi_functions:
        print(f"✅ {fn} found in ABI")
    else:
        print(f"❌ {fn} missing from ABI")
