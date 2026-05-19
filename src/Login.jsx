import { useState } from "react";

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
      ? "http://localhost:5000/auth/register"
      : "http://localhost:5000/auth/login";

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
      fetch("http://localhost:5000/forgot-password", {
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
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        maxWidth: "450px",
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}>
        {/* Header Brand */}
        <div style={{
          background: "linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)",
          padding: "32px 24px",
          textAlign: "center",
          borderBottom: "3px solid #D4AF37",
        }}>
          <h1 style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: "600",
            letterSpacing: "1px",
            color: "#FFFFFF",
          }}>
            TO MANGLAA
          </h1>
          <p style={{
            margin: "8px 0 0",
            fontSize: "12px",
            color: "#D4AF37",
            letterSpacing: "2px",
          }}>
            TORAJA CLOTHING
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: "32px 28px" }}>
          <h2 style={{
            textAlign: "center",
            marginBottom: "24px",
            fontSize: "22px",
            fontWeight: "600",
            color: "#1A1A1A",
          }}>
            {isRegister ? "Buat Akun Baru" : "Selamat Datang Kembali"}
          </h2>

          {error && (
            <div style={{
              padding: "12px 16px",
              marginBottom: "24px",
              borderRadius: "12px",
              backgroundColor: error.includes("✅") ? "#E8F3E8" : "#FEF3E2",
              color: error.includes("✅") ? "#2E7D32" : "#D4830A",
              textAlign: "center",
              fontSize: "13px",
              fontWeight: "500",
              border: `1px solid ${error.includes("✅") ? "#A5D6A7" : "#FFE0B2"}`,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  fontSize: "13px",
                  color: "#1A1A1A",
                }}>
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1.5px solid #E0E0E0",
                    fontSize: "14px",
                    transition: "all 0.2s ease",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#D4AF37";
                    e.target.style.boxShadow = "0 0 0 3px rgba(212, 175, 55, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#E0E0E0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            )}

            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                fontSize: "13px",
                color: "#1A1A1A",
              }}>
                Email
              </label>
              <input
                type="email"
                placeholder="contoh@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1.5px solid #E0E0E0",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#D4AF37";
                  e.target.style.boxShadow = "0 0 0 3px rgba(212, 175, 55, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E0E0E0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                fontSize: "13px",
                color: "#1A1A1A",
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1.5px solid #E0E0E0",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#D4AF37";
                  e.target.style.boxShadow = "0 0 0 3px rgba(212, 175, 55, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E0E0E0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#D4AF37",
                color: "#1A1A1A",
                border: "none",
                borderRadius: "40px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#B8952E";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#D4AF37";
              }}
            >
              {loading ? "PROSES..." : (isRegister ? "DAFTAR" : "MASUK")}
            </button>
          </form>

          {!isRegister && (
            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <button
                onClick={handleForgotPassword}
                style={{
                  background: "none",
                  border: "none",
                  color: "#999999",
                  cursor: "pointer",
                  fontSize: "12px",
                  textDecoration: "underline",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#D4AF37"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#999999"}
              >
                Lupa Password?
              </button>
            </div>
          )}

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#D4AF37",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#B8952E"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#D4AF37"}
            >
              {isRegister
                ? "◀ Sudah punya akun? Login"
                : "✨ Belum punya akun? Daftar di sini ✨"}
            </button>
          </div>

          {onCancel && (
            <div style={{
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid #EEEEEE",
              textAlign: "center",
            }}>
              <button
                onClick={onCancel}
                style={{
                  background: "none",
                  border: "none",
                  color: "#999999",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#D4AF37"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#999999"}
              >
                ◀ Kembali ke Beranda
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;