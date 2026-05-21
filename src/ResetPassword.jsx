import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "https://toraja-backend.vercel.app";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("❌ Password baru tidak sama");
      return;
    }
    if (newPassword.length < 4) {
      setMessage("❌ Password minimal 4 karakter");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ " + data.message);
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } else {
        setMessage("❌ " + data.error);
      }
    } catch (err) {
      setMessage("❌ Gagal reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
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
          backgroundColor: "#FFFFFF",
          padding: "40px",
          borderRadius: "24px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          textAlign: "center",
          maxWidth: "450px",
          width: "100%",
        }}>
          <div style={{
            width: "60px",
            height: "60px",
            backgroundColor: "#FEF3E2",
            borderRadius: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: "30px",
          }}>
            ⚠️
          </div>
          <h3 style={{ color: "#1A1A1A", marginBottom: "16px", fontWeight: "600" }}>Token Tidak Valid</h3>
          <p style={{ color: "#666666", marginBottom: "24px", fontSize: "14px" }}>Link reset password mungkin sudah kadaluarsa atau tidak valid.</p>
          <Link to="/" style={{
            display: "inline-block",
            backgroundColor: "#D4AF37",
            color: "#1A1A1A",
            padding: "12px 28px",
            borderRadius: "40px",
            textDecoration: "none",
            fontWeight: "600",
            transition: "background 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#B8952E"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#D4AF37"}
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    );
  }

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
            TO MANGLA
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
            Reset Password
          </h2>

          {message && (
            <div style={{
              padding: "12px 16px",
              marginBottom: "24px",
              borderRadius: "12px",
              backgroundColor: message.includes("✅") ? "#E8F3E8" : "#FEF3E2",
              color: message.includes("✅") ? "#2E7D32" : "#D4830A",
              textAlign: "center",
              fontSize: "13px",
              fontWeight: "500",
              border: `1px solid ${message.includes("✅") ? "#A5D6A7" : "#FFE0B2"}`,
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                fontSize: "13px",
                color: "#1A1A1A",
              }}>
                Password Baru
              </label>
              <input
                type="password"
                placeholder="Minimal 4 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                Konfirmasi Password
              </label>
              <input
                type="password"
                placeholder="Ketik ulang password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Memproses..." : "Reset Password"}
            </button>
          </form>

          <div style={{ marginTop: "24px", textAlign: "center", borderTop: "1px solid #EEEEEE", paddingTop: "20px" }}>
            <Link to="/" style={{
              color: "#D4AF37",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: "500",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#B8952E"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#D4AF37"}
            >
              ◀ Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;