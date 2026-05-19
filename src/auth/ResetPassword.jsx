import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      const res = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Password berhasil direset! Silakan login.");
        setTimeout(() => navigate("/"), 3000);
      } else {
        setMessage("❌ " + (data.error || "Gagal reset password"));
      }
    } catch (err) {
      setMessage("❌ Gagal reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <div className="alert alert-danger">
          <h4>Token tidak valid</h4>
          <p>Link reset password sudah kadaluarsa atau tidak valid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h2 className="text-center mb-4">Reset Password</h2>
          {message && (
            <div className={`alert ${message.includes("✅") ? "alert-success" : "alert-danger"}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Password Baru</label>
              <input
                type="password"
                className="form-control"
                placeholder="Minimal 4 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Konfirmasi Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Ketik ulang password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-100" 
              disabled={loading}
            >
              {loading ? "Memproses..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;