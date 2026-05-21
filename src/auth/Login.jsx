import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://toraja-backend.vercel.app";

function Login({ onLogin, onCancel }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isRegister
      ? `${API_URL}/auth/register`
      : `${API_URL}/auth/login`;

    const payload = isRegister
      ? { name, email, password }
      : { email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Terjadi kesalahan");
      }

      if (isRegister) {
        setError("✅ Register berhasil! Silakan login.");
        setIsRegister(false);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    const emailInput = prompt("Masukkan email Anda:");
    if (emailInput && emailInput.trim() !== "") {
      fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput })
      })
      .then(res => res.json())
      .then(data => alert(data.message || data.error))
      .catch(() => alert("Gagal mengirim link reset password"));
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#FAFAFA"
    }}>
      <div style={{
        backgroundColor: "#FFFFFF",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        width: "400px",
        border: "1px solid #EEEEEE"
      }}>
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "25px",
          color: "#1A1A1A",
          fontWeight: "600",
          fontSize: "22px"
        }}>
          {isRegister ? "📝 DAFTAR AKUN" : "🔐 LOGIN"}
        </h2>

        {error && (
          <div style={{
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "10px",
            backgroundColor: error.includes("✅") ? "#E8F3E8" : "#FEF3E2",
            color: error.includes("✅") ? "#2E7D32" : "#D4830A",
            textAlign: "center",
            fontSize: "13px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Nama Lengkap</label>
              <input
                type="text"
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #CCC" }}
                placeholder="Masukkan nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Email</label>
            <input
              type="email"
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #CCC" }}
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Password</label>
            <input
              type="password"
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #CCC" }}
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#D4AF37",
              color: "#1A1A1A",
              border: "none",
              borderRadius: "40px",
              fontWeight: "600",
              cursor: "pointer"
            }}
            disabled={loading}
          >
            {loading ? "PROSES..." : (isRegister ? "DAFTAR" : "LOGIN")}
          </button>
        </form>

        {!isRegister && (
          <div style={{ textAlign: "center", marginTop: "15px" }}>
            <button
              onClick={handleForgotPassword}
              style={{ background: "none", border: "none", color: "#999", cursor: "pointer", textDecoration: "underline" }}
            >
              Lupa Password?
            </button>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            style={{ background: "none", border: "none", color: "#D4AF37", cursor: "pointer" }}
          >
            {isRegister ? "◀ Sudah punya akun? Login" : "✨ Belum punya akun? Daftar di sini ✨"}
          </button>
        </div>

        {onCancel && (
          <div style={{ textAlign: "center", marginTop: "20px", borderTop: "1px solid #EEE", paddingTop: "15px" }}>
            <button
              onClick={onCancel}
              style={{ background: "none", border: "none", color: "#999", cursor: "pointer" }}
            >
              ◀ Kembali ke Belanja
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;