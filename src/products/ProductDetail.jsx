import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  const API_URL = import.meta.env.VITE_API_URL || "https://toraja-backend.vercel.app";
  return `${API_URL}${image}`;
};

function ProductDetailPage({ addToCart, cart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/products/${id}`);
        const data = await res.json();
        setProduct(data);
        
        const allRes = await fetch("http://localhost:5000/products");
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
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    alert(`✅ ${quantity} ${product.name} ditambahkan ke keranjang!`);
    window.location.href = "/cart";  // ← PAKAI INI
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    window.location.href = "/cart";  // ← PAKAI INI
  };

  if (loading) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <div className="alert alert-danger">
          <h4>Produk tidak ditemukan</h4>
          <Link to="/" className="btn btn-primary mt-3">Kembali ke Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm">
            {product.image ? (
              <img 
                src={getImageUrl(product.image)} 
                className="card-img-top" 
                alt={product.name}
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
            ) : (
              <div 
                className="bg-secondary d-flex align-items-center justify-content-center"
                style={{ height: "400px" }}
              >
                <span className="text-white">No Image</span>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <h1 className="display-5 fw-bold">{product.name}</h1>
          <p className="lead text-muted">SKU: #{product.id}</p>
          
          <h2 className="text-primary mb-4">Rp {product.price.toLocaleString()}</h2>
          
          <div className="mb-4">
            <h5>Deskripsi Produk:</h5>
            <p className="text-muted">{product.description || "Tidak ada deskripsi untuk produk ini."}</p>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Jumlah:</label>
            <div className="d-flex align-items-center">
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="mx-3" style={{ minWidth: "40px", textAlign: "center" }}>{quantity}</span>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="d-grid gap-2">
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
            >
              🛒 Tambah ke Keranjang
            </button>
            <button 
              className="btn btn-outline-success btn-lg"
              onClick={handleBuyNow}
            >
              💳 Beli Sekarang
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-4">Produk Terkait</h3>
          <div className="row g-4">
            {relatedProducts.map(p => (
              <div key={p.id} className="col-md-3">
                <div className="card h-100 shadow-sm">
                  {p.image ? (
                    <img 
                      src={getImageUrl(p.image)} 
                      className="card-img-top" 
                      alt={p.name}
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="card-img-top bg-secondary d-flex align-items-center justify-content-center" style={{ height: "150px" }}>
                      <span className="text-white">No Image</span>
                    </div>
                  )}
                  <div className="card-body">
                    <h6 className="card-title">{p.name}</h6>
                    <p className="card-text text-primary fw-bold">Rp {p.price.toLocaleString()}</p>
                    <Link to={`/product/${p.id}`} className="btn btn-sm btn-outline-primary w-100">
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;