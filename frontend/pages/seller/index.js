import React, { use, useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getToken, getRole } from "../../utils/auth";

export default function SellerPage() {
  const [status, setStatus] = useState("Chưa có dữ liệu");
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const role = getRole();

    if (!token || role !== "seller") {
      router.push("/login");
    }
  }, []);
  const handleCheck = async () => {
    try {
      const token = getToken();
      const response = await axios.get("/api/verify/SP-001", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStatus(
        `✅ Sản phẩm: ${response.data.name}, Trạng thái: ${response.data.status}`
      );
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      setStatus("❌ Không thể xác minh sản phẩm!");
    }
  };

  return (
    <div className="container fadeIn">
      <header className="header slideUp">
        <h1>Giao diện người bán hàng</h1>
        <nav className="nav">
          <a href="/">Trang chủ</a>
          <a href="/orders">Đơn hàng</a>
          <a href="/inventory">Kho hàng</a>
          <a href="/blockchain">Blockchain</a>
        </nav>
      </header>

      <main className="main slideUp">
        <h2>Quản lý sản phẩm</h2>
        <p>Kiểm tra & xác minh các sản phẩm của bạn</p>

        <button onClick={handleCheck}>Kiểm tra trạng thái</button>

        <div className="result fadeIn">
          <h3>Kết quả:</h3>
          <p>{status}</p>
        </div>
      </main>

      <style jsx>{`
        .container {
          font-family: Arial, sans-serif;
          background: #f9f9f9;
          min-height: 100vh;
        }
        .header {
          background: #28a745;
          color: white;
          padding: 15px 30px;
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
          padding: 40px 20px;
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        button {
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 15px;
          cursor: pointer;
          transition: transform 0.3s, background 0.3s;
        }
        button:hover {
          background: #1e7e34;
          transform: scale(1.05);
        }
        .result {
          margin-top: 20px;
          background: #e0ffe0;
          border: 1px solid #b2ffb2;
          padding: 10px;
          border-radius: 4px;
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
        .fadeIn {
          animation: fadeIn 0.8s ease;
        }
        .slideUp {
          animation: slideUp 0.6s ease;
        }
      `}</style>
    </div>
  );
}
