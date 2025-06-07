// frontend/pages/register.js
import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("⚠️ Mật khẩu không khớp!");
      return;
    }

    // TODO: Xử lý đăng ký thật
    console.log("Register:", username, password);
    setError("");
    router.push("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.imageWrapper}>
        {/* <Image
          src="/assets/user-icon.svg"
          width={120}
          height={120}
          alt="User Icon"
          style={styles.image}
        /> */}
      </div>
      <form style={styles.form} onSubmit={handleRegister}>
        <h1 style={styles.title}>Register</h1>
        {error && <p style={styles.error}>{error}</p>}
        <input
          type="text"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Register
        </button>
        <p style={{ marginTop: "10px" }}>
          Already have an account?{" "}
          <a href="/login" style={styles.link}>
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#f9f9f9",
  },
  imageWrapper: {
    marginBottom: "20px",
  },
  image: {
    borderRadius: "50%",
  },
  form: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: "300px",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "24px",
    color: "#0070f3",
  },
  input: {
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  button: {
    background: "#0070f3",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
  link: {
    color: "#0070f3",
    textDecoration: "underline",
  },
  error: {
    color: "red",
    marginBottom: "10px",
    fontSize: "14px",
  },
};
