import React, { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Giả lập auth: login thành công
    const mockToken = {
      token: "mock-token-abc123",
      role: username === "admin" ? "admin" : username, // tùy theo tên đăng nhập
    };

    // Lưu vào localStorage
    localStorage.setItem("auth_token", JSON.stringify(mockToken));

    // Redirect theo role
    if (mockToken.role === "consumer") router.push("/consumer");
    else if (mockToken.role === "seller") router.push("/seller");
    else if (mockToken.role === "producer") router.push("/producer");
    else if (mockToken.role === "admin") router.push("/admin");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login</h1>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Username"
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
        <p style={styles.link}>
          Don&apos;t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    animation: "fadeIn 1s ease-in",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 15px 25px rgba(0,0,0,0.2)",
    textAlign: "center",
    width: "300px",
    transition: "transform 0.3s ease",
    animation: "slideUp 0.8s ease-out",
  },
  title: {
    margin: "0 0 20px",
    fontSize: "28px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    position: "relative",
    marginBottom: "15px",
    transition: "transform 0.3s ease",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
    outline: "none",
    transition: "box-shadow 0.3s ease",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    border: "none",
    borderRadius: "4px",
    background: "#667eea",
    color: "white",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  link: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#555",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};
