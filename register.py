from web3 import Web3
import json

# --- Setup ---
INFURA_URL = "https://sepolia.infura.io/v3/097a0b78634248f586f3f1ad17787690"
PRIVATE_KEY = "0xa9ac2d9446ddce193bd8eb2ab67583384231fb1441adb7ee620fbf75e68244f3"  # your test wallet key
ACCOUNT_ADDRESS = Web3().eth.account.from_key(PRIVATE_KEY).address
CONTRACT_ADDRESS = "0xf039276b9748de36002ced6c47957546dCF05eB8"

# --- Connect ---
w3 = Web3(Web3.HTTPProvider(INFURA_URL))
with open("artifacts/contracts/ProductRegistry.sol/ProductRegistry.json") as f:
    abi = json.load(f)["abi"]
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)

# --- Build and send transaction ---
txn = contract.functions.registerProduct(
    "spice101",
    "Turmeric",
    "B001",
    "FarmY",
    "Kerala",
    1697059200
).build_transaction({
    'chainId': 11155111,  # Sepolia chain ID
    'from': ACCOUNT_ADDRESS,
    'nonce': w3.eth.get_transaction_count(ACCOUNT_ADDRESS),
    'gas': 300000,
    'gasPrice': w3.eth.gas_price
})

signed_txn = w3.eth.account.sign_transaction(txn, PRIVATE_KEY)
tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
print("✅ Transaction sent! Hash:", tx_hash.hex())

# --- Wait for confirmation (optional) ---
receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
print("🎉 Transaction confirmed in block:", receipt.blockNumber)

# --- Verify ---
print("Total products:", contract.functions.getProductCount().call())
print("All product IDs:", contract.functions.getAllProductIds().call())
