import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function SuccessPage() {
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem("lastOrder");
    if (savedOrder) {
      setLastOrder(JSON.parse(savedOrder));
    }
  }, []);

  if (!lastOrder) {
    return (
      <div className="container" style={{ padding: "120px 0 60px", textAlign: "center" }}>
        <div style={{ background: "#F8F8F8", padding: "40px", borderRadius: "16px", border: "1px solid #EEEEEE" }}>
          <h4 style={{ color: "#1A1A1A" }}>Tidak ada pesanan</h4>
          <Link to="/" className="btn" style={{ background: "#D4AF37", border: "none", color: "#1A1A1A", padding: "10px 30px", borderRadius: "40px", marginTop: "20px", textDecoration: "none" }}>Belanja Sekarang</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top" style={{ background: "rgba(255, 255, 255, 0.98)", backdropFilter: "blur(10px)", borderBottom: "1px solid #EEEEEE", padding: "14px 0" }}>
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <div>
              <span style={{ fontWeight: "600", fontSize: "16px", letterSpacing: "1px", color: "#1A1A1A" }}>TO MANGLA</span>
              <span style={{ fontSize: "9px", display: "block", color: "#D4AF37", letterSpacing: "2px" }}>TORAJA CLOTHING</span>
            </div>
          </Link>
          <Link to="/" className="btn" style={{ background: "transparent", border: "1.5px solid #1A1A1A", color: "#1A1A1A", borderRadius: "30px", padding: "6px 18px", fontSize: "13px", textDecoration: "none" }}>← KEMBALI</Link>
        </div>
      </nav>

      <div className="container" style={{ padding: "120px 0 60px" }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #EEEEEE", borderRadius: "16px", textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "60px", marginBottom: "20px", color: "#D4AF37" }}>✓</div>
          <h1 style={{ fontSize: "28px", fontWeight: "600", color: "#1A1A1A", marginBottom: "12px" }}>Pesanan Berhasil!</h1>
          <p style={{ color: "#666666", marginBottom: "24px" }}>Terima kasih telah berbelanja di TORAJA CLOTHING</p>
          
          <div style={{ background: "#F8F8F8", borderRadius: "12px", padding: "20px", marginBottom: "24px", textAlign: "left" }}>
            <p><strong style={{ color: "#1A1A1A" }}>Nomor Pesanan:</strong> <span style={{ color: "#D4AF37" }}>#{lastOrder.id}</span></p>
            <p><strong style={{ color: "#1A1A1A" }}>Status:</strong> <span style={{ background: "#FEF3E2", color: "#D4830A", padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>Pending</span></p>
            <p><strong style={{ color: "#1A1A1A" }}>Total:</strong> <span style={{ color: "#D4AF37", fontWeight: "600" }}>Rp {lastOrder.total?.toLocaleString()}</span></p>
          </div>

          <Link to="/" className="btn" style={{ background: "#D4AF37", border: "none", color: "#1A1A1A", padding: "12px 32px", borderRadius: "40px", fontWeight: "600", textDecoration: "none" }}>
            Lanjut Belanja
          </Link>
        </div>
      </div>

      <footer style={{ background: "#FAFAFA", padding: "40px 0 24px", borderTop: "1px solid #EEEEEE", marginTop: "40px" }}>
        <div className="container">
          <p className="text-center" style={{ color: "#AAAAAA", fontSize: "12px", marginBottom: "4px" }}>© 2024 TO Mangla x TORAJA CLOTHING</p>
          <p className="text-center" style={{ color: "#BBBBBB", fontSize: "10px" }}>Mengangkat Budaya Toraja dalam setiap karya</p>
        </div>
      </footer>
    </>
  );
}

export default SuccessPage;