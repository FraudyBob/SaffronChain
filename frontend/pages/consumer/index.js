import React, { useState } from "react";
import QRCodeDisplay from "../../components/QRCodeDisplay";
import { useRouter } from "next/router";
import axios from "axios";
import { getToken, getRole } from "../../utils/auth";
import { useEffect } from "react";

export default function ConsumerPage() {
  const [productCode, setProductCode] = useState("");
  const [verificationResult, setVerificationResult] = useState("");
  const router = useRouter();
  // Kiểm tra đăng nhập và quyền truy cập
  useEffect(() => {
    const token = getToken();
    const role = getRole();

    if (!token || role !== "consumer") {
      router.push("/login");
    }
  }, []);
  const handleVerify = async () => {
    const token = getToken();

    if (productCode.trim() === "") {
      setVerificationResult("⚠️ Vui lòng nhập mã sản phẩm!");
      return;
    }

    try {
      const response = await axios.post(
        "/api/register",
        {
          product_id: productCode,
          name: "Sản phẩm A",
          batch: "B123",
          manufacturer: "Nhà máy X",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVerificationResult(`✅ Mã ${productCode} đã đăng ký thành công.`);
    } catch (error) {
      console.error(error);
      setVerificationResult(
        "❌ Lỗi khi đăng ký sản phẩm. Vui lòng thử lại sau."
      );
    }
  };

  return (
    <div className="container fadeIn">
      <header className="header slideUp">
        <h1>Trang người tiêu dùng</h1>
        <nav className="nav">
          <a href="/">Trang chủ</a>
          <a href="/category">Danh mục</a>
          <a href="/verify">Kiểm tra sản phẩm</a>
          <a href="/about">Giới thiệu</a>
          <a href="/contact">Liên hệ</a>
        </nav>
      </header>

      <main className="main slideUp">
        <h2>Kiểm tra tính xác thực sản phẩm</h2>
        <p>Xác minh sản phẩm qua công nghệ Blockchain</p>

        <div className="inputSection">
          <input
            type="text"
            placeholder="Nhập mã sản phẩm (VD: SP-123....789-XYZ)"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
          />
          <button onClick={handleVerify}>Xác minh</button>
        </div>

        {verificationResult && (
          <div className="result fadeIn">
            <h3>Kết quả:</h3>
            <p>{verificationResult}</p>
          </div>
        )}

        <div className="qrSection fadeIn">
          <h3>Hoặc quét mã QR</h3>
          <button>Quét mã QR</button>
          <QRCodeDisplay />
        </div>
      </main>

      <style jsx>{`
        .container {
          font-family: Arial, sans-serif;
          background: #f9f9f9;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          animation: fadeIn 0.8s ease;
        }
        .header {
          background: #0070f3;
          color: white;
          padding: 15px 30px;
          animation: slideUp 0.6s ease;
        }
        .nav {
          display: flex;
          gap: 15px;
          margin-top: 10px;
        }
        .nav a {
          color: white;
          text-decoration: none;
          font-weight: bold;
        }
        .main {
          flex: 1;
          padding: 40px 20px;
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        .inputSection {
          margin-top: 20px;
          display: flex;
          gap: 10px;
          justify-content: center;
        }
        input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 15px;
          cursor: pointer;
          transition: transform 0.3s, background 0.3s;
        }
        button:hover {
          background: #005bb5;
          transform: scale(1.05);
        }
        .result {
          margin-top: 20px;
          background: #e0ffe0;
          border: 1px solid #b2ffb2;
          padding: 10px;
          border-radius: 4px;
          animation: fadeIn 0.5s ease;
        }
        .qrSection {
          margin-top: 30px;
          animation: fadeIn 0.8s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
