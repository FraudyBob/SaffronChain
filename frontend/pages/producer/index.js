import React from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import { getToken, getRole } from "../../utils/auth";

export default function ProducerPage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const role = getRole();

    if (!token || role !== "producer") {
      router.push("/login");
    }
  }, []);
  // Hàm đăng ký sản phẩm mới
  const handleRegisterProduct = async () => {
    try {
      const token = getToken();
      const res = await axios.post(
        "/api/register",
        {
          product_id: "SP-002",
          name: "Sản phẩm mới",
          batch: "B456",
          manufacturer: "Nhà máy Y",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Đã đăng ký sản phẩm. Tx Hash: " + res.data.tx_hash);
    } catch (err) {
      alert("❌ Lỗi: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="container fadeIn">
      <header className="header slideUp">
        <h1>Giao diện nhà sản xuất</h1>
        <nav className="nav">
          <a href="/">Trang chủ</a>
          <a href="/production">Sản xuất</a>
          <a href="/reports">Báo cáo</a>
        </nav>
      </header>

      <main className="main slideUp">
        <h2>Quản lý sản xuất</h2>
        <button onClick={handleRegisterProduct}>Đăng ký sản phẩm mới</button>
        <p>Theo dõi tiến trình sản xuất và tình trạng Blockchain</p>

        <div className="status fadeIn">
          <h3>Trạng thái Blockchain:</h3>
          <p>🟢 Hoạt động tốt</p>
        </div>
      </main>

      <style jsx>{`
        .container {
          font-family: Arial, sans-serif;
          background: #f9f9f9;
          min-height: 100vh;
        }
        .header {
          background: #6f42c1;
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
        .status {
          margin-top: 20px;
          background: #eee;
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
