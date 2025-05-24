# 📦 DevSecOps Blockchain App – Xác Thực Nguồn Gốc Sản Phẩm

## 🧱 Mô tả

Dự án xây dựng hệ thống xác thực nguồn gốc sản phẩm sử dụng Blockchain Ethereum testnet (Sepolia). Hệ thống áp dụng kiến trúc microservice và DevSecOps để dễ dàng triển khai CI/CD, tích hợp an ninh.

## 🔧 Tính năng chính

* ✨ Đăng ký sản phẩm lên blockchain
* ✅ Xác minh sản phẩm thông qua mã SP
* 📈 Cập nhật trạng thái (Vận chuyển, giao hàng, ...)
* 💼 Sinh mã QR truy vết theo chuỗi khối
* ⛏️ Docker hoá backend & frontend sẵn sàng CI/CD

## 📁 Cấu trúc thư mục

```
DevSecOps_Blockchain_App/
├── contracts/              # Smart contract
│   └── ProductRegistry.sol
├── scripts/                # Script deploy
│   └── deploy.js
├── backend/                # FastAPI API server
│   ├── main.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/               # Next.js app
│   ├── pages/
│   ├── components/
│   └── Dockerfile
├── docker-compose.yml      # Compose orchestration
├── hardhat.config.js       # Hardhat config
├── .env.example            # Biến môi trường mẫu
└── README.md
```

---

## 🚀 Cài đặt nhanh (Dev local)

```bash
cp .env.example .env   # Rồi điền INFURA, PRIVATE_KEY, CONTRACT_ADDRESS
npm install            # Cài Hardhat, dependencies
npx hardhat compile    # Compile smart contract
```

## 🚀 Deploy contract lên Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Copy địa chỉ contract vào file `.env`:

```
CONTRACT_ADDRESS=0x...
```

---

## 💡 Chạy với Docker Compose

```bash
docker-compose up --build
```

* [http://localhost:3000](http://localhost:3000) → Giao diện Next.js
* [http://localhost:8000/docs](http://localhost:8000/docs) → Swagger FastAPI

---

## 🔐 Biến môi trường `.env`

```env
INFURA_API_KEY=your_infura_id
PRIVATE_KEY=your_private_key (64 hex)
CONTRACT_ADDRESS=deployed_address
```

---

## 🧠 Sơ đồ hoạt động

1. Giao diện Next.js gửi request đến backend FastAPI
2. FastAPI sử dụng Web3.py kết nối Ethereum Sepolia
3. Smart contract lưu trữ thông tin sản phẩm
4. Giao diện truy xuất blockchain qua API và hiển thị QR

---

## 🧪 Kiểm thử API (Swagger)

Truy cập:

```
http://localhost:8000/docs
```

Test ngay trên giao diện swagger UI.

---

## 🚀 Triển khai thực tế

Kết hợp với repo DevSecOps CI/CD:
[https://github.com/Giabaoday/DevSecOps\_Project](https://github.com/Giabaoday/DevSecOps_Project)

Triển khai:

* Docker build backend/frontend
* Push image lên registry
* Dùng Jenkins/Jenkinsfile hoặc GitHub Actions tự động hoá

---

## 👤 Tác giả

Người thực hiện: Nguyen Dang Binh Minh - 22520871 | Tran Gia Bao - 22520120 \
Project: DevSecOps Blockchain App (NT548)

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

