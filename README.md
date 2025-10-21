# 📦 Blockchain-Based Supply Chain Tracker

A modern, secure, and transparent supply chain tracking system built with blockchain technology. This application enables end-to-end product tracking from farm to store using Ethereum blockchain for immutable record keeping.

## 🌟 Features

### ✨ Core Functionality
- **Product Registration**: Register products on the blockchain with unique IDs
- **Real-time Verification**: Verify product authenticity via QR code scanning
- **Status Tracking**: Track products through supply chain stages (Farm → Factory → Store)
- **QR Code Generation**: Generate traceable QR codes for easy verification
- **Role-based Access**: Different user roles with appropriate permissions

### 🎨 Modern UI/UX
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Framer Motion Animations**: Smooth, professional animations throughout
- **Flowbite Components**: Professional UI components for tables, buttons, and forms
- **Real-time Notifications**: Toast notifications for user feedback

### 🔐 Security Features
- **JWT Authentication**: Secure token-based authentication
- **Role-based Authorization**: Admin, Producer, Seller, Consumer roles
- **Blockchain Immutability**: Tamper-proof product records
- **Input Validation**: Comprehensive validation on both frontend and backend
- **CORS Protection**: Secure API endpoints

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with Python 3.12
- **Blockchain Integration**: Web3.py for Ethereum interaction
- **Authentication**: JWT tokens with Argon2 password hashing
- **API Documentation**: Auto-generated Swagger docs
- **Logging**: Comprehensive logging for Web3 operations

### Frontend (Next.js)
- **Framework**: Next.js 15.5.6 with React 19
- **Styling**: Tailwind CSS with custom dark mode
- **UI Components**: Flowbite React components
- **Charts**: Chart.js for supply chain visualization
- **Animations**: Framer Motion for smooth interactions

### Blockchain Layer
- **Network**: Ethereum Sepolia testnet
- **Smart Contract**: Solidity 0.8.20 (`ProductRegistry.sol`)
- **Development**: Hardhat framework
- **Deployment**: Automated deployment scripts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.12+
- Git

### 1. Clone the Repository
```bash
git git clone https://github.com/FraudyBob/SpiceChainTracker.git
cd DevSecOps_Blockchain_App
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your values
# INFURA_API_KEY=your_infura_project_id
# PRIVATE_KEY=your_ethereum_private_key
# CONTRACT_ADDRESS=deployed_contract_address
```

### 3. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### 4. Deploy Smart Contract
```bash
# Compile contracts
npx hardhat compile

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# Copy the deployed contract address to .env
echo "CONTRACT_ADDRESS=0x..." >> .env
```

### 5. Run the Application

#### Option A: Docker Compose (Recommended)
```bash
docker-compose up --build
```

#### Option B: Manual Development
```bash
# Terminal 1: Backend
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 👥 User Roles & Permissions

### Demo Credentials
- **Admin**: `admin@example.com` / `password`
- **Producer**: `producer@example.com` / `password`
- **Seller**: `seller@example.com` / `password`
- **Consumer**: `consumer@example.com` / `password`

### Role Permissions
- **Admin**: Full access to all features
- **Producer**: Can register products and update status
- **Seller**: Can update product status
- **Consumer**: Can verify products and view information

## 📱 Usage Guide

### 1. Register a Product
1. Login with Producer/Admin account
2. Navigate to "Add Product"
3. Fill in product details (ID, name, batch, manufacturer)
4. Submit to register on blockchain

### 2. Track Product Status
1. Login with appropriate role
2. Go to "Update Status"
3. Enter product ID
4. Select new status from dropdown
5. Update status on blockchain

### 3. Verify Product
1. Enter product ID in verification page
2. View product details and blockchain information
3. Generate QR code for easy sharing

### 4. Generate QR Code
1. Login and navigate to QR Code generator
2. Enter product ID
3. Download or share QR code
4. QR code links directly to verification page

## 🔧 API Endpoints

### Authentication
- `POST /login` - User login
- `POST /register` - User registration

### Products
- `GET /verify/{product_id}` - Verify product
- `POST /register-product` - Register new product
- `POST /add-spice` - Alias for product registration
- `POST /update-status` - Update product status
- `POST /add-trace` - Add trace record

### QR Codes
- `POST /generate-qr` - Generate QR code for product

## 🛠️ Development

### Project Structure
```
DevSecOps_Blockchain_App/
├── contracts/              # Smart contracts
├── scripts/                # Deployment scripts
├── backend/                # FastAPI backend
│   ├── main.py            # Main application
│   ├── requirements.txt   # Python dependencies
│   └── Dockerfile         # Backend container
├── frontend/               # Next.js frontend
│   ├── src/app/           # App router pages
│   ├── src/components/     # React components
│   ├── package.json       # Node dependencies
│   └── Dockerfile         # Frontend container
├── docker-compose.yml      # Container orchestration
└── README.md              # This file
```

### Adding New Features
1. **Backend**: Add new endpoints in `main.py`
2. **Frontend**: Create new pages in `src/app/`
3. **Components**: Add reusable components in `src/components/`
4. **Styling**: Use Tailwind CSS classes
5. **Testing**: Test with demo credentials

### Environment Variables
```env
# Blockchain Configuration
INFURA_API_KEY=your_infura_project_id
PRIVATE_KEY=your_ethereum_private_key
CONTRACT_ADDRESS=deployed_contract_address

# Application Configuration
SECRET_KEY=your_jwt_secret_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🚀 Deployment

### Production Deployment
1. **Build Images**:
   ```bash
   docker build -t supply-chain-backend ./backend
   docker build -t supply-chain-frontend ./frontend
   ```

2. **Push to Registry**:
   ```bash
   docker tag supply-chain-backend your-registry/backend:latest
   docker tag supply-chain-frontend your-registry/frontend:latest
   docker push your-registry/backend:latest
   docker push your-registry/frontend:latest
   ```

3. **Deploy with Docker Compose**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### CI/CD Integration
This project is designed for DevSecOps practices:
- **Automated Testing**: Unit and integration tests
- **Security Scanning**: Dependency vulnerability checks
- **Container Scanning**: Docker image security analysis
- **Automated Deployment**: CI/CD pipeline integration

## 🔍 Troubleshooting

### Common Issues

1. **Contract Deployment Fails**:
   - Check Infura API key
   - Verify private key has Sepolia ETH
   - Ensure network connectivity

2. **Frontend Build Errors**:
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility
   - Verify environment variables

3. **Backend Connection Issues**:
   - Check if backend is running on port 8000
   - Verify CORS settings
   - Check API endpoint URLs

4. **Authentication Problems**:
   - Clear localStorage: `localStorage.clear()`
   - Check JWT token expiration
   - Verify user credentials

### Debug Mode
```bash
# Enable debug logging
export DEBUG=true
npm run dev
```

## 📊 Monitoring & Analytics

### Blockchain Monitoring
- **Etherscan**: Monitor transactions on Sepolia
- **Gas Usage**: Track transaction costs
- **Contract Events**: Monitor product registrations

### Application Monitoring
- **API Logs**: FastAPI request/response logging
- **Error Tracking**: Comprehensive error handling
- **Performance**: Response time monitoring





**Project**: DevSecOps Blockchain App 

## 🙏 Acknowledgments

- Ethereum Foundation for blockchain infrastructure
- FastAPI team for the excellent web framework
- Next.js team for the React framework
- Flowbite for beautiful UI components
- Framer Motion for smooth animations

---



