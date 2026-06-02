import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
const API_URL = import.meta.env.VITE_API_URL || "https://toraja-backend.vercel.app";

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${API_URL}${image}`;
};

function ProductDetailPage({ addToCart, cart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [stockError, setStockError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/products/${id}`);
        const data = await res.json();
        setProduct(data);
        
        if (data.sizes && data.sizes.length > 0) {
          const sizeList = data.sizes.map(s => ({
            id: s.size.id,
            name: s.size.name,
            label: s.size.label,
            stock: s.stock
          }));
          setSizes(sizeList);
          if (sizeList.length > 0) {
            setSelectedSize(sizeList[0]);
          }
        }
        
        const allRes = await fetch(`${API_URL}/products`);
        const allData = await allRes.json();
        setRelatedProducts(allData.filter(p => p.id !== parseInt(id)).slice(0, 4));
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize) {
      setStockError("Silakan pilih ukuran terlebih dahulu!");
      return;
    }
    
    if (selectedSize.stock <= 0) {
      setStockError(`Maaf, ukuran ${selectedSize.name} sedang habis!`);
      return;
    }
    
    if (quantity > selectedSize.stock) {
      setStockError(`Stok ukuran ${selectedSize.name} hanya tersisa ${selectedSize.stock} pcs!`);
      return;
    }
    
    setStockError("");
    
    const productWithSize = {
      ...product,
      sizeId: selectedSize.id,
      sizeName: selectedSize.name
    };
    
    for (let i = 0; i < quantity; i++) {
      addToCart(productWithSize);
    }
    alert(`✅ ${quantity} ${product.name} (Ukuran ${selectedSize.name}) ditambahkan ke keranjang!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    if (!selectedSize) {
      setStockError("Silakan pilih ukuran terlebih dahulu!");
      return;
    }
    
    if (selectedSize.stock <= 0) {
      setStockError(`Maaf, ukuran ${selectedSize.name} sedang habis!`);
      return;
    }
    
    if (quantity > selectedSize.stock) {
      setStockError(`Stok ukuran ${selectedSize.name} hanya tersisa ${selectedSize.stock} pcs!`);
      return;
    }
    
    setStockError("");
    
    const productWithSize = {
      ...product,
      sizeId: selectedSize.id,
      sizeName: selectedSize.name
    };
    
    for (let i = 0; i < quantity; i++) {
      addToCart(productWithSize);
    }
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" style={{ color: "#D4AF37" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: "120px 0 60px", textAlign: "center" }}>
        <div style={{ background: "#F8F8F8", padding: "40px", borderRadius: "16px", border: "1px solid #EEEEEE" }}>
          <h4 style={{ color: "#1A1A1A" }}>Produk tidak ditemukan</h4>
          <Link to="/" className="btn" style={{ background: "#D4AF37", border: "none", color: "#1A1A1A", padding: "10px 30px", borderRadius: "40px", marginTop: "20px", textDecoration: "none" }}>Kembali ke Home</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* NAVBAR - SAMA SEPERTI DI TEMPLATE */}
      <nav className="navbar navbar-expand-lg fixed-top" style={{ background: "rgba(255, 255, 255, 0.98)", backdropFilter: "blur(10px)", borderBottom: "1px solid #EEEEEE", padding: "14px 0" }}>
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={logo} alt="Logo" style={{ height: "38px", marginRight: "10px", borderRadius: "50%" }} />
            <div>
              <span style={{ fontWeight: "600", fontSize: "16px", letterSpacing: "1px", color: "#1A1A1A" }}>TO MANGLA</span>
              <span style={{ fontSize: "9px", display: "block", color: "#D4AF37", letterSpacing: "2px" }}>TORAJA CLOTHING</span>
            </div>
          </Link>
          <Link to="/" className="btn" style={{ background: "transparent", border: "1.5px solid #1A1A1A", color: "#1A1A1A", borderRadius: "30px", padding: "6px 18px", fontSize: "13px", textDecoration: "none" }}>← KEMBALI</Link>
        </div>
      </nav>

      <div className="container" style={{ padding: "120px 0 60px" }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: "30px" }}>
          <ol style={{ display: "flex", gap: "10px", listStyle: "none", padding: 0, margin: 0 }}>
            <li><Link to="/" style={{ color: "#999999", textDecoration: "none" }}>Home</Link></li>
            <li style={{ color: "#999999" }}>/</li>
            <li style={{ color: "#D4AF37" }}>{product.name}</li>
          </ol>
        </nav>

        <div className="row">
          {/* GAMBAR PRODUK */}
          <div className="col-md-6">
            <div style={{ background: "#F8F8F8", borderRadius: "16px", overflow: "hidden", border: "1px solid #EEEEEE" }}>
              {product.image ? (
                <img 
                  src={getImageUrl(product.image)} 
                  className="card-img-top" 
                  alt={product.name}
                  style={{ width: "100%", height: "auto", maxHeight: "500px", aspectRatio: "1/1", objectFit: "cover" }}
                />
              ) : (
                <div 
                  className="d-flex align-items-center justify-content-center"
                  style={{ height: "500px", background: "#F0F0F0", color: "#999" }}
                >
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* INFO PRODUK */}
          <div className="col-md-6">
            <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#1A1A1A", marginBottom: "8px" }}>{product.name}</h1>
            <p style={{ color: "#999999", fontSize: "14px", marginBottom: "16px" }}>SKU: #{product.id}</p>
            
            <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#D4AF37", marginBottom: "24px" }}>Rp {product.price.toLocaleString()}</h2>
            
            <div style={{ marginBottom: "24px" }}>
              <h5 style={{ fontSize: "16px", fontWeight: "600", color: "#1A1A1A", marginBottom: "12px" }}>Deskripsi Produk:</h5>
              <p style={{ color: "#666666", fontSize: "15px", lineHeight: "1.6" }}>{product.description || "Tidak ada deskripsi untuk produk ini."}</p>
            </div>

            {/* PILIHAN UKURAN */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontWeight: "600", color: "#1A1A1A", marginBottom: "12px", display: "block" }}>
                Pilih Ukuran: <span style={{ color: "#D4AF37" }}>*</span>
              </label>
              
              {sizes.length === 0 ? (
                <p style={{ color: "#999999", fontSize: "14px" }}>Sedang memuat ukuran...</p>
              ) : (
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {sizes.map((size) => {
                    const isSelected = selectedSize?.id === size.id;
                    const isOutOfStock = size.stock <= 0;
                    
                    return (
                      <button
                        key={size.id}
                        onClick={() => !isOutOfStock && setSelectedSize(size)}
                        disabled={isOutOfStock}
                        style={{
                          minWidth: "55px",
                          padding: "10px 16px",
                          background: isSelected ? "#D4AF37" : "#FFFFFF",
                          border: isSelected ? "1px solid #D4AF37" : "1px solid #EEEEEE",
                          borderRadius: "10px",
                          color: isSelected ? "#1A1A1A" : (isOutOfStock ? "#CCCCCC" : "#1A1A1A"),
                          fontWeight: isSelected ? "600" : "500",
                          fontSize: "14px",
                          cursor: isOutOfStock ? "not-allowed" : "pointer",
                          opacity: isOutOfStock ? 0.5 : 1,
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          if (!isOutOfStock && !isSelected) {
                            e.currentTarget.style.borderColor = "#D4AF37";
                            e.currentTarget.style.background = "#F8F8F8";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isOutOfStock && !isSelected) {
                            e.currentTarget.style.borderColor = "#EEEEEE";
                            e.currentTarget.style.background = "#FFFFFF";
                          }
                        }}
                      >
                        {size.name}
                        {size.stock <= 5 && size.stock > 0 && (
                          <span style={{ 
                            display: "block", 
                            fontSize: "10px", 
                            color: isSelected ? "#1A1A1A" : "#D4830A",
                            marginTop: "2px"
                          }}>
                            Stok: {size.stock}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
              
              {selectedSize && selectedSize.stock > 0 && (
                <p style={{ marginTop: "12px", fontSize: "13px", color: "#666666" }}>
                  ✓ Stok tersedia: <strong>{selectedSize.stock}</strong> pcs untuk ukuran {selectedSize.name}
                </p>
              )}
              {stockError && (
                <p style={{ marginTop: "12px", fontSize: "13px", color: "#D4830A" }}>
                  ⚠️ {stockError}
                </p>
              )}
            </div>

            {/* JUMLAH */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontWeight: "600", color: "#1A1A1A", marginBottom: "8px", display: "block" }}>Jumlah:</label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <button 
                  style={{ background: "#F0F0F0", border: "none", width: "36px", height: "36px", borderRadius: "8px", fontSize: "18px", cursor: "pointer" }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span style={{ margin: "0 16px", minWidth: "40px", textAlign: "center", fontSize: "16px", fontWeight: "500" }}>{quantity}</span>
                <button 
                  style={{ background: "#F0F0F0", border: "none", width: "36px", height: "36px", borderRadius: "8px", fontSize: "18px", cursor: "pointer" }}
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={selectedSize && quantity >= selectedSize.stock}
                >
                  +
                </button>
              </div>
              {selectedSize && quantity >= selectedSize.stock && selectedSize.stock > 0 && (
                <p style={{ fontSize: "12px", color: "#D4830A", marginTop: "8px" }}>
                  Maksimal pembelian {selectedSize.stock} pcs karena stok terbatas.
                </p>
              )}
            </div>

            {/* TOMBOL AKSI */}
            <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
              <button 
                style={{ background: "#D4AF37", border: "none", color: "#1A1A1A", padding: "14px", borderRadius: "40px", fontWeight: "600", fontSize: "15px", cursor: "pointer" }}
                onClick={handleAddToCart}
                onMouseEnter={(e) => e.currentTarget.style.background = "#B8952E"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#D4AF37"}
              >
                🛒 TAMBAH KE KERANJANG
              </button>
              <button 
                style={{ background: "#1A1A1A", border: "none", color: "white", padding: "14px", borderRadius: "40px", fontWeight: "600", fontSize: "15px", cursor: "pointer" }}
                onClick={handleBuyNow}
                onMouseEnter={(e) => e.currentTarget.style.background = "#333333"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#1A1A1A"}
              >
                💳 BELI SEKARANG
              </button>
            </div>
          </div>
        </div>

        {/* PRODUK TERKAIT */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: "80px" }}>
            <h3 style={{ fontSize: "24px", fontWeight: "600", color: "#1A1A1A", marginBottom: "30px", textAlign: "center" }}>Produk Terkait</h3>
            <div className="row g-4">
              {relatedProducts.map(p => (
                <div key={p.id} className="col-md-3">
                  <div style={{ background: "#FFFFFF", border: "1px solid #EEEEEE", borderRadius: "12px", overflow: "hidden", transition: "all 0.3s ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.05)"; }}>
                    <Link to={`/product/${p.id}`} style={{ textDecoration: "none" }}>
                      {p.image ? (
                        <img 
                          src={getImageUrl(p.image)} 
                          alt={p.name}
                          style={{ width: "100%", height: "180px", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ height: "180px", background: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>No Image</div>
                      )}
                      <div style={{ padding: "12px" }}>
                        <h6 style={{ color: "#1A1A1A", fontWeight: "600", marginBottom: "8px", fontSize: "14px" }}>{p.name}</h6>
                        <p style={{ color: "#D4AF37", fontWeight: "600", fontSize: "14px", marginBottom: "0" }}>Rp {p.price.toLocaleString()}</p>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER - SAMA SEPERTI DI TEMPLATE */}
      <footer style={{ background: "#0D0D0D", padding: "40px 0 24px", marginTop: "40px" }}>
        <div className="container">
          <div className="text-center mb-3">
            <img src={logo} alt="Logo" style={{ height: "40px", borderRadius: "50%" }} />
          </div>
          <div className="text-center mb-3">
            <a href="https://www.instagram.com/to_manglaa?igsh=MXN5MmJhN256ZXpocw==" target="_blank" style={{ color: "#999999", margin: "0 12px", fontSize: "18px", textDecoration: "none" }}>📷</a>
            <a href="https://www.tiktok.com/@to_manglaa" target="_blank" style={{ color: "#999999", margin: "0 12px", fontSize: "20px", textDecoration: "none" }}>🎵</a>
            <a href="https://wa.me/6285397853625" target="_blank" style={{ color: "#999999", margin: "0 12px", fontSize: "18px", textDecoration: "none" }}>💬</a>
          </div>
          <p className="text-center" style={{ color: "#AAAAAA", fontSize: "12px", marginBottom: "4px" }}>© 2026 TO Mangla x TORAJA CLOTHING</p>
          <p className="text-center" style={{ color: "#BBBBBB", fontSize: "10px" }}>Mengangkat Budaya Toraja dalam setiap karya</p>
        </div>
      </footer>
    </>
  );
}

export default ProductDetailPage;