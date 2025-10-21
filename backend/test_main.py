import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_login():
    """Test user login endpoint"""
    response = client.post("/login", json={
        "email": "admin@example.com",
        "password": "password"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "admin"

def test_login_invalid_credentials():
    """Test login with invalid credentials"""
    response = client.post("/login", json={
        "email": "invalid@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 400

def test_register():
    """Test user registration"""
    response = client.post("/register", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["msg"] == "User registered successfully"

def test_register_existing_user():
    """Test registration with existing email"""
    response = client.post("/register", json={
        "email": "admin@example.com",
        "password": "password123"
    })
    assert response.status_code == 400

def test_verify_product_unauthorized():
    """Test product verification without authentication"""
    response = client.get("/verify/TUR001")
    assert response.status_code == 401

def test_add_spice_unauthorized():
    """Test adding spice without authentication"""
    response = client.post("/add-spice", json={
        "product_id": "TUR001",
        "name": "Test Turmeric",
        "batch": "BATCH-001",
        "manufacturer": "Test Co",
        "turmeric_origin": "Kerala, India",
        "harvest_date": 1640995200
    })
    assert response.status_code == 401

def test_get_all_products_unauthorized():
    """Test getting all products without authentication"""
    response = client.get("/verify/all")
    assert response.status_code == 401

def test_get_traces_unauthorized():
    """Test getting traces without authentication"""
    response = client.get("/get-traces/TUR001")
    assert response.status_code == 401

def test_generate_qr_unauthorized():
    """Test QR generation without authentication"""
    response = client.post("/generate-qr", json={
        "product_id": "TUR001",
        "frontend_url": "http://localhost:3000"
    })
    assert response.status_code == 401

if __name__ == "__main__":
    pytest.main([__file__])
