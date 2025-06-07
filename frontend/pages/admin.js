import React from "react";

export default function AdminPage() {
  return (
    <div className="container fadeIn">
      <header className="header slideUp">
        <h1>Giao diện quản trị</h1>
        <nav className="nav">
          <a href="/">Trang chủ</a>
          <a href="/users">Quản lý người dùng</a>
          <a href="/settings">Cài đặt</a>
        </nav>
      </header>

      <main className="main slideUp">
        <h2>Chào mừng Admin</h2>
        <p>Quản lý toàn bộ hệ thống và phân quyền người dùng</p>

        <div className="dashboard fadeIn">
          <h3>Dashboard</h3>
          <p>📊 Đang hoạt động tốt</p>
        </div>
      </main>

      <style jsx>{`
        .container { font-family: Arial, sans-serif; background: #f9f9f9; min-height: 100vh; }
        .header { background: #dc3545; color: white; padding: 15px 30px; }
        .nav { display: flex; gap: 15px; margin-top: 10px; }
        .nav a { color: white; text-decoration: none; font-weight: bold; }
        .main { padding: 40px 20px; max-width: 600px; margin: 0 auto; text-align: center; }
        .dashboard { margin-top: 20px; background: #fff; border: 1px solid #ddd; padding: 10px; border-radius: 4px; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .fadeIn { animation: fadeIn 0.8s ease; }
        .slideUp { animation: slideUp 0.6s ease; }
      `}</style>
    </div>
  );
}
