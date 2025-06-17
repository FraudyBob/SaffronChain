# 📦 DevSecOps Blockchain App – Product Provenance Verification

## 🧱 Description

This project builds a blockchain-based system for verifying product provenance using Ethereum testnet (Sepolia). It follows a microservices architecture and applies DevSecOps practices to enable secure, automated CI/CD deployment.

## 🔧 Key Features

* ✨ Register products on the blockchain  
* ✅ Verify products via product code  
* 📈 Track status (Shipping, Delivery, etc.)  
* 💼 Generate traceable QR codes on-chain  
* ⛏️ Dockerized backend & frontend ready for CI/CD integration

## 📁 Project Structure

```
DevSecOps_Blockchain_App/
├── contracts/ # Smart contracts
│ └── ProductRegistry.sol
├── scripts/ # Deployment scripts
│ └── deploy.js
├── backend/ # FastAPI backend API
│ ├── main.py
│ ├── Dockerfile
│ └── requirements.txt
├── docker-compose.yml # Orchestration with Docker Compose
├── hardhat.config.js # Hardhat configuration
├── .env.example # Sample environment variables
└── README.md
```

---

## 🚀 Quick setting (Dev local)

```bash
cp .env.example .env   # Then fill in INFURA_API_KEY, PRIVATE_KEY, CONTRACT_ADDRESS
npm install            # Install Hardhat and dependencies
npx hardhat compile    # Compile smart contracts
```

## 🚀 Deploy Smart Contract to Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Copy contract address to file `.env`:

```
CONTRACT_ADDRESS=0x...
```

---

## 💡 Run with Docker Compose

```bash
docker-compose up --build
```

* [http://localhost:3000](http://localhost:3000) → Frontend Next.js
* [http://localhost:8000/docs](http://localhost:8000/docs) → Swagger FastAPI

---

## 🔐 Environment Variables `.env`

```env
INFURA_API_KEY=your_infura_id
PRIVATE_KEY=your_private_key (64 hex)
CONTRACT_ADDRESS=deployed_address
```

---

## 🧠 Workflow Overview

1. Next.js Frontend send API request to the backend FastAPI
2. FastAPI connecting Ethereum Sepolia using Web3.py
3. Product information is stored on the blockchain via SmartContract
4. Frontend fetches on-chain data via API and renders QR codes

---

## 🧪 API Testing (Swagger)

Open:

```
http://localhost:8000/docs
```

Test on swagger UI frontend.

---

## 🚀 Production Deployment

Integrated with DevSecOps CI/CD repository:
[https://github.com/Giabaoday/DevSecOps\_Project](https://github.com/Giabaoday/DevSecOps_Project)

Steps:

* Docker build backend/frontend
* Push image to container registry
* Automate CI/CD using Jenkins or Github Actions

---

## 👤 Authors

Contributors: 
**Nguyen Dang Binh Minh - 22520871** 
**Tran Gia Bao - 22520120** 
Project: *DevSecOps Blockchain App (NT548)*

---

## ✅ License

MIT License

Copyright (c) \[2024] \

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

