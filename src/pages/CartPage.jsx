import { Link, useNavigate } from "react-router-dom";
const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  const API_URL = import.meta.env.VITE_API_URL || "https://toraja-backend.vercel.app";
  return `${API_URL}${image}`;
};

function CartPage({ cart, updateQuantity, removeFromCart, total, user, onCheckout, updateSize, productSizes }) {
  const navigate = useNavigate();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const ongkir = 10000;
  const grandTotal = subtotal + ongkir;

  const handleCheckoutClick = () => {
    if (!user) {
      if (onCheckout) onCheckout();
    } else {
      navigate("/checkout");
    }
  };

  const handleUpdateQuantity = (item, newQty) => {
    if (newQty < 1) return;
    updateQuantity(item.id, item.sizeId, newQty);
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item.id, item.sizeId);
  };

  if (cart.length === 0) {
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

        <div className="container" style={{ padding: "120px 0 60px", textAlign: "center" }}>
          <div style={{ fontSize: "70px", marginBottom: "20px" }}>🛒</div>
          <h2 style={{ color: "#1A1A1A", marginBottom: "12px", fontWeight: "500" }}>Keranjang Kosong</h2>
          <p style={{ color: "#666666", marginBottom: "30px" }}>Yuk, tambahkan produk favorit Anda!</p>
          <Link to="/" className="btn" style={{ background: "#D4AF37", border: "none", color: "#1A1A1A", padding: "10px 30px", borderRadius: "40px", textDecoration: "none", fontWeight: "500" }}>Belanja Sekarang</Link>
        </div>
      </>
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
        <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "30px", color: "#1A1A1A" }}>🛒 Keranjang Belanja</h1>

        <div className="row">
          <div className="col-lg-8">
            <div style={{ background: "#FFFFFF", borderRadius: "16px", border: "1px solid #EEEEEE", overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "#FAFAFA", borderBottom: "1px solid #EEEEEE" }}>
                    <tr>
                      <th style={{ padding: "15px", textAlign: "left", color: "#1A1A1A", fontWeight: "600", fontSize: "13px" }}>Produk</th>
                      <th style={{ padding: "15px", textAlign: "left", color: "#1A1A1A", fontWeight: "600", fontSize: "13px" }}>Ukuran</th>
                      <th style={{ padding: "15px", textAlign: "left", color: "#1A1A1A", fontWeight: "600", fontSize: "13px" }}>Harga</th>
                      <th style={{ padding: "15px", textAlign: "left", color: "#1A1A1A", fontWeight: "600", fontSize: "13px" }}>Jumlah</th>
                      <th style={{ padding: "15px", textAlign: "left", color: "#1A1A1A", fontWeight: "600", fontSize: "13px" }}>Subtotal</th>
                      <th style={{ padding: "15px", textAlign: "center", color: "#1A1A1A", fontWeight: "600", fontSize: "13px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={`${item.id}-${item.sizeId}`} style={{ borderBottom: "1px solid #EEEEEE" }}>
                        <td style={{ padding: "15px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            {item.image ? (
                              <img 
                                src={getImageUrl(item.image)} 
                                alt={item.name} 
                                style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                              />
                            ) : (
                              <div style={{ width: "60px", height: "60px", background: "#F0F0F0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>No img</div>
                            )}
                            <div>
                              <h6 style={{ color: "#1A1A1A", marginBottom: "5px", fontWeight: "600", fontSize: "14px" }}>{item.name}</h6>
                              <small style={{ color: "#999999", fontSize: "11px" }}>{item.description?.substring(0, 50)}...</small>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "15px", color: "#1A1A1A", fontSize: "14px", fontWeight: "500" }}>
                          {productSizes && productSizes[item.id] ? (
                            <select
                              value={item.sizeId}
                              onChange={(e) => {
                                const newSizeId = parseInt(e.target.value);
                                const newSize = productSizes[item.id].find(s => s.id === newSizeId);
                                if (newSize && newSize.id !== item.sizeId) {
                                  updateSize(item.id, item.sizeId, newSize.id, newSize.name, item.price);
                                }
                              }}
                              style={{
                                padding: "6px 10px",
                                borderRadius: "8px",
                                border: "1px solid #D4AF37",
                                fontSize: "13px",
                                background: "#FFFFFF",
                                cursor: "pointer",
                                minWidth: "70px"
                              }}
                            >
                              {productSizes[item.id].map(size => (
                                <option key={size.id} value={size.id}>
                                  {size.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span style={{ background: "#F0F0F0", padding: "4px 10px", borderRadius: "20px", fontSize: "12px" }}>
                              {item.sizeName || item.selectedSize?.name || "M"}
                            </span>
                          )}
                         </td>
                        <td style={{ padding: "15px", color: "#D4AF37", fontWeight: "600", fontSize: "14px" }}>Rp {item.price.toLocaleString()}</td>
                        <td style={{ padding: "15px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <button 
                              onClick={() => handleUpdateQuantity(item, item.qty - 1)}
                              style={{ background: "#F0F0F0", border: "none", color: "#1A1A1A", width: "30px", height: "30px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
                            >-</button>
                            <span style={{ color: "#1A1A1A", minWidth: "30px", textAlign: "center", fontSize: "14px" }}>{item.qty}</span>
                            <button 
                              onClick={() => handleUpdateQuantity(item, item.qty + 1)}
                              style={{ background: "#F0F0F0", border: "none", color: "#1A1A1A", width: "30px", height: "30px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
                            >+</button>
                          </div>
                         </td>
                        <td style={{ padding: "15px", color: "#D4AF37", fontWeight: "600", fontSize: "14px" }}>Rp {(item.price * item.qty).toLocaleString()}</td>
                        <td style={{ padding: "15px", textAlign: "center" }}>
                          <button 
                            onClick={() => handleRemoveItem(item)}
                            style={{ background: "transparent", border: "none", color: "#999999", fontSize: "18px", cursor: "pointer" }}
                          >🗑️</button>
                         </td>
                       </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div style={{ background: "#F8F8F8", borderRadius: "16px", padding: "25px", position: "sticky", top: "100px" }}>
              <h4 style={{ color: "#D4AF37", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid #EEEEEE", fontWeight: "600" }}>Ringkasan Belanja</h4>
              
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <span style={{ color: "#666666", fontSize: "14px" }}>Subtotal ({cart.length} produk)</span>
                <span style={{ color: "#1A1A1A", fontSize: "14px", fontWeight: "500" }}>Rp {subtotal.toLocaleString()}</span>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <span style={{ color: "#666666", fontSize: "14px" }}>Ongkos Kirim</span>
                <span style={{ color: "#1A1A1A", fontSize: "14px", fontWeight: "500" }}>Rp {ongkir.toLocaleString()}</span>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px", paddingTop: "15px", borderTop: "1px solid #EEEEEE" }}>
                <span style={{ fontWeight: "bold", color: "#D4AF37", fontSize: "16px" }}>Total</span>
                <span style={{ fontWeight: "bold", color: "#D4AF37", fontSize: "20px" }}>Rp {grandTotal.toLocaleString()}</span>
              </div>
              
              <button 
                onClick={handleCheckoutClick}
                style={{ background: "#D4AF37", border: "none", color: "#1A1A1A", width: "100%", padding: "14px", borderRadius: "40px", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#B8952E"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#D4AF37"}
              >
                Lanjut ke Checkout →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartPage;