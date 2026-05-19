import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

function CheckoutPage({ cart, total, proceedCheckout, user }) {
  // CEK LOGIN - jika belum login, redirect ke home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [shippingMethod, setShippingMethod] = useState("regular");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [selectedBank, setSelectedBank] = useState("bca");

  const shippingCost = shippingMethod === "regular" ? 10000 : 20000;
  const grandTotal = total + shippingCost;

  // Data rekening bank
  const bankAccounts = {
    bca: {
      name: "BCA",
      accountNumber: "1234567890",
      accountName: "TO Mangla x TORAJA CLOTHING"
    },
    mandiri: {
      name: "Mandiri",
      accountNumber: "9876543210",
      accountName: "TO Mangla x TORAJA CLOTHING"
    },
    bri: {
      name: "BRI",
      accountNumber: "5555555555",
      accountName: "TO Mangla x TORAJA CLOTHING"
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!customerName || !customerPhone || !customerAddress) {
      alert("Mohon isi semua data!");
      return;
    }

    if (paymentMethod === "transfer") {
      const bank = bankAccounts[selectedBank];
      const confirmMessage = `Silakan transfer ke rekening berikut:\n\n` +
        `Bank: ${bank.name}\n` +
        `No. Rekening: ${bank.accountNumber}\n` +
        `Atas Nama: ${bank.accountName}\n\n` +
        `Total: Rp ${grandTotal.toLocaleString()}\n\n` +
        `Setelah transfer, kirim bukti ke WhatsApp admin.`;
      
      if (window.confirm(confirmMessage + "\n\nSudah transfer? Klik OK.")) {
        proceedCheckout({
          customerName,
          customerPhone,
          customerAddress,
          shippingMethod,
          paymentMethod,
          selectedBank
        });
      }
    } else {
      proceedCheckout({
        customerName,
        customerPhone,
        customerAddress,
        shippingMethod,
        paymentMethod
      });
    }
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
            <Link to="/" className="btn" style={{ background: "transparent", border: "1.5px solid #1A1A1A", color: "#1A1A1A", borderRadius: "30px", padding: "6px 18px", fontSize: "13px", textDecoration: "none" }}>← KEMBALI KE BERANDA</Link>
          </div>
        </nav>
        <div className="container" style={{ padding: "120px 0 60px", textAlign: "center" }}>
          <div style={{ fontSize: "70px", marginBottom: "20px" }}>🛒</div>
          <h2 style={{ color: "#1A1A1A", marginBottom: "12px", fontWeight: "500" }}>Keranjang Kosong</h2>
          <Link to="/" className="btn" style={{ background: "#D4AF37", border: "none", color: "#1A1A1A", padding: "10px 30px", borderRadius: "40px", marginTop: "20px", textDecoration: "none", fontWeight: "500" }}>Belanja Sekarang</Link>
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
          <Link to="/" className="btn" style={{ background: "transparent", border: "1.5px solid #1A1A1A", color: "#1A1A1A", borderRadius: "30px", padding: "6px 18px", fontSize: "13px", textDecoration: "none" }}>
            ← KEMBALI KE BERANDA
          </Link>
        </div>
      </nav>

      <div className="container" style={{ padding: "120px 0 60px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "30px", color: "#1A1A1A" }}>📋 Checkout</h1>

        <div className="row">
          <div className="col-lg-7">
            <form onSubmit={handleSubmit}>
              {/* Informasi Pengiriman */}
              <div style={{ background: "#FFFFFF", borderRadius: "16px", border: "1px solid #EEEEEE", padding: "25px", marginBottom: "25px" }}>
                <h4 style={{ color: "#D4AF37", marginBottom: "20px", fontWeight: "600", fontSize: "18px" }}>Informasi Pengiriman</h4>
                
                <div className="mb-3">
                  <label style={{ color: "#666666", marginBottom: "8px", display: "block", fontSize: "13px" }}>Nama Penerima *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    style={{ background: "#FFFFFF", border: "1px solid #EEEEEE", color: "#1A1A1A", padding: "12px", borderRadius: "10px" }}
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>
                
                <div className="mb-3">
                  <label style={{ color: "#666666", marginBottom: "8px", display: "block", fontSize: "13px" }}>Nomor Telepon *</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    value={customerPhone} 
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    style={{ background: "#FFFFFF", border: "1px solid #EEEEEE", color: "#1A1A1A", padding: "12px", borderRadius: "10px" }}
                    placeholder="Contoh: 081234567890"
                  />
                </div>
                
                <div className="mb-3">
                  <label style={{ color: "#666666", marginBottom: "8px", display: "block", fontSize: "13px" }}>Alamat Lengkap *</label>
                  <textarea 
                    className="form-control" 
                    value={customerAddress} 
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    required
                    rows="3"
                    style={{ background: "#FFFFFF", border: "1px solid #EEEEEE", color: "#1A1A1A", padding: "12px", borderRadius: "10px" }}
                    placeholder="Masukkan alamat lengkap Anda (jalan, kecamatan, kota, kode pos)"
                  />
                </div>
              </div>

              {/* Metode Pengiriman */}
              <div style={{ background: "#FFFFFF", borderRadius: "16px", border: "1px solid #EEEEEE", padding: "25px", marginBottom: "25px" }}>
                <h4 style={{ color: "#D4AF37", marginBottom: "20px", fontWeight: "600", fontSize: "18px" }}>Metode Pengiriman</h4>
                
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input 
                      type="radio" 
                      name="shipping" 
                      value="regular" 
                      checked={shippingMethod === "regular"} 
                      onChange={(e) => setShippingMethod(e.target.value)}
                      style={{ accentColor: "#D4AF37" }}
                    />
                    <span style={{ color: "#1A1A1A" }}>📦 Reguler (3-5 hari) - Rp 10.000</span>
                  </label>
                  
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input 
                      type="radio" 
                      name="shipping" 
                      value="express" 
                      checked={shippingMethod === "express"} 
                      onChange={(e) => setShippingMethod(e.target.value)}
                      style={{ accentColor: "#D4AF37" }}
                    />
                    <span style={{ color: "#1A1A1A" }}>⚡ Express (1-2 hari) - Rp 20.000</span>
                  </label>
                </div>
              </div>

              {/* Metode Pembayaran */}
              <div style={{ background: "#FFFFFF", borderRadius: "16px", border: "1px solid #EEEEEE", padding: "25px" }}>
                <h4 style={{ color: "#D4AF37", marginBottom: "20px", fontWeight: "600", fontSize: "18px" }}>Metode Pembayaran</h4>
                
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "15px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={paymentMethod === "cod"} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ accentColor: "#D4AF37" }}
                    />
                    <span style={{ color: "#1A1A1A" }}>💵 COD (Bayar di Tempat)</span>
                  </label>
                  
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="transfer" 
                      checked={paymentMethod === "transfer"} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ accentColor: "#D4AF37" }}
                    />
                    <span style={{ color: "#1A1A1A" }}>🏦 Transfer Bank</span>
                  </label>
                </div>

                {/* Pilihan Bank - Muncul hanya jika pilih transfer bank */}
                {paymentMethod === "transfer" && (
                  <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #EEEEEE" }}>
                    <label style={{ color: "#D4AF37", marginBottom: "15px", display: "block", fontWeight: "500" }}>Pilih Bank:</label>
                    
                    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "10px 15px", background: selectedBank === "bca" ? "#D4AF37" : "#F8F8F8", borderRadius: "10px", border: "1px solid #EEEEEE" }}>
                        <input 
                          type="radio" 
                          name="bank" 
                          value="bca" 
                          checked={selectedBank === "bca"} 
                          onChange={(e) => setSelectedBank(e.target.value)}
                          style={{ accentColor: "#D4AF37" }}
                        />
                        <div>
                          <div style={{ fontWeight: "bold", color: selectedBank === "bca" ? "#1A1A1A" : "#1A1A1A" }}>BCA</div>
                          <small style={{ color: selectedBank === "bca" ? "#1A1A1A" : "#999999" }}>{bankAccounts.bca.accountNumber}</small>
                        </div>
                      </label>
                      
                      <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "10px 15px", background: selectedBank === "mandiri" ? "#D4AF37" : "#F8F8F8", borderRadius: "10px", border: "1px solid #EEEEEE" }}>
                        <input 
                          type="radio" 
                          name="bank" 
                          value="mandiri" 
                          checked={selectedBank === "mandiri"} 
                          onChange={(e) => setSelectedBank(e.target.value)}
                          style={{ accentColor: "#D4AF37" }}
                        />
                        <div>
                          <div style={{ fontWeight: "bold", color: selectedBank === "mandiri" ? "#1A1A1A" : "#1A1A1A" }}>Mandiri</div>
                          <small style={{ color: selectedBank === "mandiri" ? "#1A1A1A" : "#999999" }}>{bankAccounts.mandiri.accountNumber}</small>
                        </div>
                      </label>
                      
                      <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "10px 15px", background: selectedBank === "bri" ? "#D4AF37" : "#F8F8F8", borderRadius: "10px", border: "1px solid #EEEEEE" }}>
                        <input 
                          type="radio" 
                          name="bank" 
                          value="bri" 
                          checked={selectedBank === "bri"} 
                          onChange={(e) => setSelectedBank(e.target.value)}
                          style={{ accentColor: "#D4AF37" }}
                        />
                        <div>
                          <div style={{ fontWeight: "bold", color: selectedBank === "bri" ? "#1A1A1A" : "#1A1A1A" }}>BRI</div>
                          <small style={{ color: selectedBank === "bri" ? "#1A1A1A" : "#999999" }}>{bankAccounts.bri.accountNumber}</small>
                        </div>
                      </label>
                    </div>

                    {/* Informasi tambahan transfer */}
                    <div style={{ marginTop: "20px", padding: "15px", background: "#F8F8F8", borderRadius: "10px" }}>
                      <div style={{ color: "#D4AF37", marginBottom: "10px", fontWeight: "500" }}>📌 Instruksi Pembayaran:</div>
                      <ol style={{ color: "#666666", marginLeft: "20px", lineHeight: "1.8", fontSize: "13px" }}>
                        <li>Transfer sesuai total yang harus dibayar</li>
                        <li>Setelah transfer, simpan bukti transfer</li>
                        <li>Kirim bukti transfer ke WhatsApp admin</li>
                        <li>Pesanan akan diproses setelah pembayaran dikonfirmasi</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="col-lg-5">
            <div style={{ background: "#F8F8F8", borderRadius: "16px", padding: "25px", position: "sticky", top: "100px" }}>
              <h4 style={{ color: "#D4AF37", marginBottom: "20px", borderBottom: "1px solid #EEEEEE", paddingBottom: "10px", fontWeight: "600" }}>Ringkasan Pesanan</h4>
              
              {/* RINGKASAN PRODUK - UKURAN TAMPIL */}
              <div style={{ marginBottom: "15px" }}>
                {cart.map((item, idx) => {
                  // Ambil ukuran dari berbagai kemungkinan properti
                  const ukuran = item.sizeName || item.selectedSize?.name || item.size?.name || "";
                  
                  return (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                      <span style={{ color: "#666666", fontSize: "14px" }}>
                        {item.name} {ukuran && `(Ukuran: ${ukuran})`} x{item.qty}
                      </span>
                      <span style={{ color: "#1A1A1A", fontSize: "14px", fontWeight: "500" }}>Rp {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
              
              <div style={{ borderTop: "1px solid #EEEEEE", paddingTop: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ color: "#666666", fontSize: "14px" }}>Subtotal</span>
                  <span style={{ color: "#1A1A1A", fontSize: "14px", fontWeight: "500" }}>Rp {total.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ color: "#666666", fontSize: "14px" }}>Ongkos Kirim</span>
                  <span style={{ color: "#1A1A1A", fontSize: "14px", fontWeight: "500" }}>Rp {shippingCost.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #EEEEEE" }}>
                  <span style={{ fontWeight: "bold", color: "#D4AF37", fontSize: "16px" }}>Total</span>
                  <span style={{ fontWeight: "bold", color: "#D4AF37", fontSize: "20px" }}>Rp {grandTotal.toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                onClick={handleSubmit}
                style={{ background: "#D4AF37", border: "none", color: "#1A1A1A", width: "100%", padding: "14px", borderRadius: "40px", fontWeight: "600", fontSize: "14px", cursor: "pointer", marginTop: "25px" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#B8952E"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#D4AF37"}
              >
                ✅ Konfirmasi Pesanan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Contact Floating Button */}
      <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 1000 }}>
        <a 
          href="https://wa.me/628537853625" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "10px",
            background: "#25D366", 
            padding: "10px 18px", 
            borderRadius: "50px", 
            textDecoration: "none",
            color: "white",
            fontWeight: "500",
            fontSize: "13px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}
        >
          <span style={{ fontSize: "20px" }}>💬</span>
          <span>Chat Admin</span>
        </a>
      </div>
    </>
  );
}

export default CheckoutPage;