import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import heroBg from "../assets/hero-bg.jpeg";
import SettingsPage from "../pages/SettingsPage";
const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  const API_URL = import.meta.env.VITE_API_URL || "https://toraja-backend.vercel.app";
  return `${API_URL}${image}`;
};

function Template({
  user,
  logout,
  products,
  loading,
  cart,
  addToCart,
  removeFromCart,
  total,
  proceedCheckout,
  updateQuantity,    // ← TAMBAHKAN
  updateSize,        // ← TAMBAHKAN
  productSizes       // ← TAMBAHKAN
}) {
  const API_URL = import.meta.env.VITE_API_URL || "https://toraja-backend.vercel.app";
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("home");
  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // State untuk admin
  const [adminProducts, setAdminProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "", description: "" });
  const [imageFile, setImageFile] = useState(null);

  // State untuk user management
  const [users, setUsers] = useState([]);
  const [editingRoleUser, setEditingRoleUser] = useState(null);

  // State untuk order management
  const [orders, setOrders] = useState([]);
  const [showOrderDetail, setShowOrderDetail] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // State untuk terms management
  const [adminTerms, setAdminTerms] = useState([]);
  const [showTermForm, setShowTermForm] = useState(false);
  const [editingTerm, setEditingTerm] = useState(null);
  const [termForm, setTermForm] = useState({ title: "", content: "", category: "umum", version: 1, isActive: true });

  // State untuk dashboard
  const [dashboard, setDashboard] = useState({ totalOrders: 0, totalRevenue: 0, totalUsers: 0 });

  // State untuk admin tab
  const [adminTab, setAdminTab] = useState("dashboard");

  // State untuk sidebar cart
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  // Update quantity function

  // Fetch my orders
  useEffect(() => {
    if (currentPage === "myorders" && user) {
      const fetchOrders = async () => {
        try {
          setLoadingOrders(true);
          const token = localStorage.getItem("token");

          console.log("🔍 Fetching orders...");
          console.log("Token:", token);
          console.log("User:", user);

          const res = await fetch(`${API_URL}/api/orders/my-orders`, {
            headers: { Authorization: "Bearer " + token }
          });

          console.log("Response status:", res.status);

          const data = await res.json();
          console.log("📦 Data orders:", data);

          if (res.ok) {
            setMyOrders(data);
          } else {
            console.error("Error dari API:", data);
            setMyOrders([]);
          }
        } catch (err) {
          console.error("❌ Error fetch orders:", err);
          setMyOrders([]);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [currentPage, user]);

  // Fetch admin data
  useEffect(() => {
    if (isAdmin && currentPage === "admin") {
      const fetchAdminProducts = async () => {
        try {
          const res = await fetch(`${API_URL}/products`);
          const data = await res.json();
          if (Array.isArray(data)) {
            setAdminProducts(data);
          } else {
            console.error("❌ Products bukan array:", data);
            setAdminProducts([]);
          }
        } catch (err) { console.error("❌ Fetch products error:", err); setAdminProducts([]); }
      };

      const fetchUsers = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_URL}/api/admin/users`, {
            headers: { Authorization: "Bearer " + token }
          });
          const data = await res.json();
          if (Array.isArray(data)) {
            setUsers(data);
            setDashboard(prev => ({ ...prev, totalUsers: data.length }));
          } else {
            console.error("❌ Users bukan array:", data);
            setUsers([]);
          }
        } catch (err) { console.error("❌ Fetch users error:", err); setUsers([]); }
      };

      const fetchOrders = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_URL}/api/admin/orders`, {
            headers: { Authorization: "Bearer " + token }
          });
          const data = await res.json();
          if (Array.isArray(data)) {
            setOrders(data);
            let revenue = 0;
            data.forEach(o => { if (o.status === "delivered") revenue += o.total; });
            setDashboard(prev => ({
              ...prev,
              totalOrders: data.length,
              totalRevenue: revenue
            }));
          } else {
            console.error("❌ Orders bukan array:", data);
            setOrders([]);
          }
        } catch (err) { console.error("❌ Fetch orders error:", err); setOrders([]); }
      };

      const fetchTerms = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_URL}/api/admin/terms`, {
            headers: { Authorization: "Bearer " + token }
          });
          const data = await res.json();
          if (Array.isArray(data)) {
            setAdminTerms(data);
          } else {
            console.error("❌ Terms bukan array:", data);
            setAdminTerms([]);
          }
        } catch (err) { console.error("❌ Fetch terms error:", err); setAdminTerms([]); }
      };

      fetchAdminProducts();
      fetchUsers();
      fetchOrders();
      fetchTerms();
    }
  }, [isAdmin, currentPage]);

  // Fetch terms untuk halaman user (SYARAT)
  useEffect(() => {
    if (currentPage === "terms") {
      const fetchTerms = async () => {
        try {
          const res = await fetch(`${API_URL}/api/terms`);
          const data = await res.json();
          console.log("📦 Terms untuk user:", data);
          setAdminTerms(data);
        } catch (err) {
          console.error("Error fetch terms:", err);
        }
      };
      fetchTerms();
    }
  }, [currentPage]);

  const statusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "#FEF3E2", text: "#D4830A" },
      processed: { bg: "#E8F3E8", text: "#2E7D32" },
      shipped: { bg: "#E3F2FD", text: "#1565C0" },
      delivered: { bg: "#4CAF50", text: "#FFFFFF" },
      cancelled: { bg: "#FFEBEE", text: "#C62828" }
    };
    const config = statusConfig[status] || { bg: "#F0F0F0", text: "#666666" };
    return <span className="badge-status" style={{ background: config.bg, color: config.text, padding: "4px 12px", borderRadius: "30px", fontSize: "11px", fontWeight: "500" }}>{status}</span>;
  };

  // CRUD Functions
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("price", formData.price);
    formDataObj.append("description", formData.description);
    if (imageFile) formDataObj.append("image", imageFile);
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formDataObj
      });
      if (res.ok) {
        alert("✅ Produk berhasil ditambahkan!");
        setShowAddForm(false);
        setFormData({ name: "", price: "", description: "" });
        setImageFile(null);
        const fetchRes = await fetch(`${API_URL}/products`);
        const data = await fetchRes.json();
        setAdminProducts(data);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`❌ Gagal menambahkan produk: ${errorData.error || errorData.message || 'Unknown Error'}`);
      }
    } catch (err) {
      console.error(err);
      alert(`❌ Error: ${err.message}`);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("price", formData.price);
    formDataObj.append("description", formData.description);
    if (imageFile) formDataObj.append("image", imageFile);
    try {
      const res = await fetch(`${API_URL}/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { Authorization: "Bearer " + token },
        body: formDataObj
      });
      if (res.ok) {
        alert("✅ Produk berhasil diupdate!");
        setEditingProduct(null);
        setFormData({ name: "", price: "", description: "" });
        setImageFile(null);
        const fetchRes = await fetch(`${API_URL}/products`);
        const data = await fetchRes.json();
        setAdminProducts(data);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`❌ Gagal mengupdate produk: ${errData.error || errData.message || res.status}`);
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (res.ok) {
        alert("✅ Produk berhasil dihapus!");
        setAdminProducts(adminProducts.filter(p => p.id !== id));
      } else { alert("Gagal menghapus produk"); }
    } catch (err) { console.error(err); }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, price: product.price, description: product.description || "" });
    setImageFile(null);
  };

  // Terms CRUD
  const handleTermChange = (e) => {
    setTermForm({ ...termForm, [e.target.name]: e.target.value });
  };

  const handleTermCheckbox = (e) => {
    setTermForm({ ...termForm, isActive: e.target.checked });
  };

  const handleAddTerm = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/admin/terms`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(termForm)
      });
      if (res.ok) {
        alert("✅ Term berhasil ditambahkan!");
        setShowTermForm(false);
        setTermForm({ title: "", content: "", category: "umum", version: 1, isActive: true });
        const fetchRes = await fetch(`${API_URL}/api/admin/terms`, {
          headers: { Authorization: "Bearer " + token }
        });
        const data = await fetchRes.json();
        setAdminTerms(data);
      } else { alert("Gagal menambahkan term"); }
    } catch (err) { console.error(err); }
  };

  const handleEditTerm = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/admin/terms/${editingTerm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(termForm)
      });
      if (res.ok) {
        alert("✅ Term berhasil diupdate!");
        setEditingTerm(null);
        setTermForm({ title: "", content: "", category: "umum", version: 1, isActive: true });
        const fetchRes = await fetch(`${API_URL}/api/admin/terms`, {
          headers: { Authorization: "Bearer " + token }
        });
        const data = await fetchRes.json();
        setAdminTerms(data);
      } else { alert("Gagal mengupdate term"); }
    } catch (err) { console.error(err); }
  };

  const handleDeleteTerm = async (id) => {
    if (!confirm("Yakin ingin menghapus syarat ini?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/admin/terms/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (res.ok) {
        alert("✅ Term berhasil dihapus!");
        setAdminTerms(adminTerms.filter(t => t.id !== id));
      } else { alert("Gagal menghapus term"); }
    } catch (err) { console.error(err); }
  };

  const startEditTerm = (term) => {
    setEditingTerm(term);
    setTermForm({ title: term.title, content: term.content, category: term.category, version: term.version, isActive: term.isActive });
  };

  // User Management
  const handleChangeUserRole = async (userId, newRole) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        alert("✅ Role user berhasil diubah!");
        setUsers(users.map(u => String(u.id) === String(userId) ? { ...u, role: newRole } : u));
        setEditingRoleUser(null);
      } else { alert("Gagal mengubah role"); }
    } catch (err) {
      alert("❌ Error: " + err.message);
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (res.ok) {
        alert("✅ User berhasil dihapus!");
        setUsers(users.filter(u => String(u.id) !== String(userId)));
      } else { alert("Gagal menghapus user"); }
    } catch (err) {
      alert("❌ Error: " + err.message);
      console.error(err);
    }
  };

  // Order Management
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (updatingStatus) {
      alert("⏳ Masih ada proses update, tunggu sebentar...");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("❌ Token tidak ditemukan. Silakan login ulang.");
      return;
    }

    setUpdatingStatus(true);

    try {
      const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Status order berhasil diupdate!");
        setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (showOrderDetail && showOrderDetail.id === orderId) {
          setShowOrderDetail(prev => ({ ...prev, status: newStatus }));
        }
      } else {
        alert("❌ Gagal mengupdate status: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert("❌ Gagal mengupdate status");
    } finally {
      setUpdatingStatus(false);
    }
  };
  // Cart Sidebar Component
  const CartSidebar = () => {
    if (!isCartOpen) return null;

    return (
      <div style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "100%",
        maxWidth: "400px",
        height: "100vh",
        background: "white",
        boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
        zIndex: 1050,
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease"
      }}>
        <div style={{
          padding: "20px",
          borderBottom: "1px solid #EEEEEE",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h3 style={{ margin: 0, color: "#1A1A1A" }}>Keranjang Belanja</h3>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#666"
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {cart.length === 0 ? (
            <p style={{ textAlign: "center", color: "#999", marginTop: "40px" }}>Keranjang kosong</p>
          ) : (
            <>
              {cart.map((item) => {
                const availableSizes = productSizes[item.id] || [];

                return (
                  <div key={`${item.id}-${item.sizeId}`} style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "16px",
                    padding: "12px",
                    border: "1px solid #EEEEEE",
                    borderRadius: "8px"
                  }}>
                    <div style={{
                      width: "80px",
                      height: "80px",
                      background: "#F5F5F5",
                      borderRadius: "8px",
                      overflow: "hidden"
                    }}>
                      {item.image && (
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h6 style={{ margin: "0 0 8px 0", color: "#1A1A1A" }}>{item.name}</h6>
                      <p style={{ margin: "0 0 8px 0", color: "#D4AF37", fontWeight: "600" }}>
                        Rp {item.price.toLocaleString()}
                      </p>

                      {/* DROPDOWN GANTI UKURAN */}
                      {availableSizes.length > 0 && (
                        <div style={{ marginBottom: "8px" }}>
                          <select
                            value={item.sizeId}
                            onChange={(e) => {
                              const newSizeId = parseInt(e.target.value);
                              const newSize = availableSizes.find(s => s.id === newSizeId);
                              if (newSize && newSize.id !== item.sizeId) {
                                updateSize(item.id, item.sizeId, newSize.id, newSize.name, item.price);
                              }
                            }}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "1px solid #D4AF37",
                              fontSize: "12px",
                              background: "#FFFFFF",
                              cursor: "pointer",
                              width: "100%"
                            }}
                          >
                            {availableSizes.map(size => (
                              <option key={size.id} value={size.id}>
                                {size.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.sizeId, (item.qty || 1) - 1)}
                          style={{
                            width: "28px",
                            height: "28px",
                            border: "1px solid #DDD",
                            background: "white",
                            borderRadius: "4px",
                            cursor: "pointer"
                          }}
                        >
                          -
                        </button>
                        <span>{item.qty || 1}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.sizeId, (item.qty || 1) + 1)}
                          style={{
                            width: "28px",
                            height: "28px",
                            border: "1px solid #DDD",
                            background: "white",
                            borderRadius: "4px",
                            cursor: "pointer"
                          }}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id, item.sizeId)}
                          style={{
                            marginLeft: "auto",
                            background: "none",
                            border: "none",
                            color: "#DC3545",
                            cursor: "pointer",
                            fontSize: "20px"
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div style={{
          padding: "20px",
          borderTop: "1px solid #EEEEEE",
          background: "white"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
            fontSize: "18px",
            fontWeight: "600"
          }}>
            <span>Total:</span>
            <span style={{ color: "#D4AF37" }}>Rp {total.toLocaleString()}</span>
          </div>
          <button
            onClick={() => {
              if (!user) {
                proceedCheckout(null);
              } else {
                navigate("/checkout");
              }
            }}
            style={{
              width: "100%",
              padding: "12px",
              background: "#D4AF37",
              border: "none",
              borderRadius: "8px",
              color: "#1A1A1A",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            CHECKOUT
          </button>
        </div>
      </div>
    );
  };
  // HALAMAN HOME
  if (currentPage === "home") {
    return (
      <>
        <style>{`
          .navbar-premium {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            padding: 14px 0;
            transition: all 0.3s ease;
            box-shadow: 0 2px 20px rgba(0,0,0,0.05);
          }
          .hero-ornamen-left {
            position: absolute;
            left: 20px;
            top: 20%;
            width: 100px;
            opacity: 0.5;
            z-index: 1;
          }
          .hero-ornamen-right {
            position: absolute;
            right: 20px;
            bottom: 20%;
            width: 100px;
            opacity: 0.5;
            z-index: 1;
          }
          .hero-content {
            position: relative;
            z-index: 2;
            max-width: 800px;
            padding: 20px;
          }
          .hero-logo {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin-bottom: 20px;
            animation: fadeInUp 0.8s ease;
          }
          .hero-title {
            font-size: 48px;
            font-weight: 700;
            color: white;
            margin-bottom: 12px;
            letter-spacing: 4px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            animation: fadeInUp 0.8s ease 0.1s both;
          }
          .hero-subtitle {
            font-size: 20px;
            color: #D4AF37;
            margin-bottom: 20px;
            letter-spacing: 2px;
            animation: fadeInUp 0.8s ease 0.2s both;
          }
          .hero-description {
            color: rgba(255,255,255,0.9);
            margin-bottom: 32px;
            font-size: 16px;
            line-height: 1.6;
            animation: fadeInUp 0.8s ease 0.3s both;
          }
          .btn-hero-primary {
            background: #D4AF37;
            border: none;
            color: #1A1A1A;
            padding: 12px 32px;
            border-radius: 40px;
            font-weight: 600;
            transition: all 0.3s ease;
            animation: fadeInUp 0.8s ease 0.4s both;
          }
          .btn-hero-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(212,175,55,0.3);
          }
          .divider-gold {
            width: 60px;
            height: 3px;
            background: #D4AF37;
            margin: 16px auto;
          }
          .section-title {
            font-size: 32px;
            font-weight: 600;
            color: #1A1A1A;
            margin-bottom: 12px;
          }
          .section-subtitle {
            color: #666666;
            font-size: 14px;
          }
          .product-card {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }
          .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          }
          .product-image {
            width: 100%;
            height: 280px;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          .product-card:hover .product-image {
            transform: scale(1.05);
          }
          .product-badge {
            position: absolute;
            top: 12px;
            left: 12px;
            background: #D4AF37;
            color: #1A1A1A;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            z-index: 1;
          }
          .product-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #1A1A1A;
          }
          .product-price {
            color: #D4AF37;
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 0;
          }
          .btn-add-to-cart {
            width: 100%;
            background: #1A1A1A;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 40px;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          .btn-add-to-cart:hover {
            background: #D4AF37;
            color: #1A1A1A;
          }
          .footer-premium {
            background: #0D0D0D;
            padding: 40px 0;
            margin-top: 0;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @media (max-width: 768px) {
            .hero-title { font-size: 28px; letter-spacing: 2px; }
            .hero-subtitle { font-size: 14px; }
            .hero-description { font-size: 13px; }
            .section-title { font-size: 22px; }
            .product-image { height: 200px !important; }
            .product-title { font-size: 13px !important; }
            .product-price { font-size: 13px !important; }
            .btn-add-to-cart { font-size: 11px !important; padding: 8px 4px !important; }
            .card-body { padding: 10px 10px 4px 10px !important; }
          }
          @media (max-width: 480px) {
            .hero-title { font-size: 24px; }
            .product-image { height: 180px !important; }
            .product-title { font-size: 12px !important; }
            .product-price { font-size: 12px !important; }
          }
          .admin-layout {
            display: flex;
            min-height: 100vh;
            margin-top: 70px;
            background: #F5F5F5;
            flex-direction: row;
          }
          .admin-sidebar {
            width: 280px;
            background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%);
            min-height: 100vh;
            color: #FFFFFF;
            position: fixed;
            left: 0;
            top: 70px;
            bottom: 0;
            overflow-y: auto;
            z-index: 100;
            transition: all 0.3s ease;
          }
          .admin-content {
            margin-left: 280px;
            padding: 30px;
            width: calc(100% - 280px);
            min-height: 100vh;
            transition: all 0.3s ease;
          }
          @media (max-width: 991px) {
            .admin-layout {
              flex-direction: column !important;
            }
            .admin-sidebar {
              width: 100% !important;
              min-height: auto !important;
              position: static !important;
              padding-bottom: 20px;
            }
            .admin-content {
              margin-left: 0 !important;
              width: 100% !important;
              padding: 15px !important;
            }
          }
          /* ===== MOBILE FULL-SCREEN MENU OVERLAY ===== */
          .mobile-menu-overlay {
            display: none;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: #FFFFFF;
            z-index: 2000;
            flex-direction: column;
            padding: 0;
            overflow-y: auto;
          }
          .mobile-menu-overlay.open {
            display: flex;
          }
          .mobile-menu-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 18px 24px;
            border-bottom: 1px solid #EEEEEE;
          }
          .mobile-menu-close {
            background: none;
            border: none;
            font-size: 22px;
            cursor: pointer;
            color: #1A1A1A;
            padding: 4px;
            line-height: 1;
          }
          .mobile-menu-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 18px 24px;
            border-bottom: 1px solid #EEEEEE;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 1.5px;
            color: #1A1A1A;
            cursor: pointer;
            text-decoration: none;
            background: none;
            width: 100%;
            text-align: left;
            transition: background 0.15s ease;
          }
          .mobile-menu-item:hover { background: #FAFAFA; color: #1A1A1A; }
          .mobile-menu-item.gold { color: #D4AF37; }
          .mobile-menu-footer {
            padding: 20px 24px;
            margin-top: auto;
          }
          .mobile-menu-user {
            font-size: 13px;
            color: #999999;
            margin-bottom: 12px;
          }
          .mobile-menu-btns {
            display: flex;
            gap: 10px;
          }
          .mobile-menu-btns button {
            flex: 1;
            padding: 11px 8px;
            border-radius: 30px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            letter-spacing: 0.5px;
          }
          @media (min-width: 992px) {
            .mobile-menu-overlay { display: none !important; }
            .mobile-hambtn { display: none !important; }
          }
          @media (max-width: 991px) {
            .desktop-only { display: none !important; }
          }
        `}</style>

        {/* MOBILE FULL-SCREEN OVERLAY MENU */}
        <div className={`mobile-menu-overlay ${isNavbarOpen ? "open" : ""}`}>
          <div className="mobile-menu-header">
            <button className="mobile-menu-close" onClick={() => setIsNavbarOpen(false)}>✕</button>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button onClick={() => { setIsCartOpen(true); setIsNavbarOpen(false); }}
                style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer" }}>🛒</button>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <button className="mobile-menu-item" onClick={() => { setCurrentPage("home"); setIsNavbarOpen(false); }}>BERANDA</button>
            <button className="mobile-menu-item" onClick={() => { setCurrentPage("terms"); setIsNavbarOpen(false); }}>SYARAT</button>
            <button className="mobile-menu-item" onClick={() => { setCurrentPage("myorders"); setIsNavbarOpen(false); }}>PESANANKU</button>
            {isAdmin && <button className="mobile-menu-item gold" onClick={() => { setCurrentPage("admin"); setIsNavbarOpen(false); }}>ADMIN 👑</button>}
          </div>

          <div className="mobile-menu-footer">
            {user && <p className="mobile-menu-user">👋 {user.name}{isAdmin ? " 👑" : ""}</p>}
            <div className="mobile-menu-btns">
              {user ? (
                <button onClick={logout} style={{ background: "#1A1A1A", border: "none", color: "white" }}>KELUAR</button>
              ) : (
                <button onClick={() => { navigate("/login"); setIsNavbarOpen(false); }} style={{ background: "#1A1A1A", border: "none", color: "white" }}>MASUK</button>
              )}
            </div>
          </div>
        </div>

        {/* NAVBAR */}
        <nav className="navbar navbar-expand-lg navbar-premium fixed-top">
          <div className="container">
            <a className="navbar-brand d-flex align-items-center" href="#" onClick={() => setCurrentPage("home")}>
              <img src={logo} alt="Logo" style={{ height: "38px", marginRight: "10px", borderRadius: "50%" }} />
              <div>
                <span style={{ fontWeight: "600", fontSize: "16px", letterSpacing: "1px", color: "#1A1A1A" }}>TO MANGLA</span>
                <span style={{ fontSize: "9px", display: "block", color: "#D4AF37", letterSpacing: "2px" }}>TORAJA CLOTHING</span>
              </div>
            </a>
            {/* HAMBURGER - mobile only */}
            <button className="mobile-hambtn navbar-toggler" type="button" onClick={() => setIsNavbarOpen(true)}
              style={{ border: "none", background: "none", padding: "6px" }}>
              <span className="navbar-toggler-icon"></span>
            </button>
            {/* DESKTOP NAV */}
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-center">
                <li className="nav-item"><a className="nav-link" href="#" onClick={() => setCurrentPage("home")}>BERANDA</a></li>
                <li className="nav-item"><a className="nav-link" href="#" onClick={() => setCurrentPage("terms")}>SYARAT</a></li>
                <li className="nav-item"><a className="nav-link" href="#" onClick={() => setCurrentPage("myorders")}>PESANANKU</a></li>
                {isAdmin && <li className="nav-item"><a className="nav-link" href="#" onClick={() => setCurrentPage("admin")}>ADMIN</a></li>}
                <li className="nav-item"><span className="nav-link" style={{ color: "#D4AF37" }}>👋 {user?.name}{isAdmin && "👑"}</span></li>
                <li className="nav-item">
                  <button onClick={() => setIsCartOpen(true)} className="btn ms-2"
                    style={{ background: "transparent", border: "1.5px solid #D4AF37", color: "#D4AF37", borderRadius: "30px", padding: "6px 18px", fontSize: "13px", cursor: "pointer" }}>
                    🛒 CART ({cart.length})
                  </button>
                </li>
                <li className="nav-item">
                  {user ? (
                    <button className="btn ms-2" style={{ background: "#1A1A1A", border: "none", color: "white", borderRadius: "30px", padding: "6px 20px", fontSize: "13px" }} onClick={logout}>LOGOUT</button>
                  ) : (
                    <button className="btn ms-2" style={{ background: "#1A1A1A", border: "none", color: "white", borderRadius: "30px", padding: "6px 20px", fontSize: "13px" }} onClick={() => navigate("/login")}>MASUK</button>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <div style={{
          position: "relative",
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          background: `linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.4) 100%), url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          overflow: "hidden"
        }}>
          <div className="hero-ornamen-left">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 10 L60 30 L80 35 L65 50 L70 70 L50 60 L30 70 L35 50 L20 35 L40 30 L50 10Z" fill="#D4AF37" opacity="0.6" />
              <circle cx="50" cy="50" r="15" stroke="#D4AF37" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="hero-ornamen-right">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 10 L60 30 L80 35 L65 50 L70 70 L50 60 L30 70 L35 50 L20 35 L40 30 L50 10Z" fill="#D4AF37" opacity="0.6" />
              <circle cx="50" cy="50" r="15" stroke="#D4AF37" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="hero-ornamen-center"></div>

          <div className="hero-content">
            <img src={logo} alt="Logo" className="hero-logo" />
            <h1 className="hero-title">TORAJA CLOTHING</h1>
            <p className="hero-subtitle">TO MANGLA COLLECTION</p>
            <p className="hero-description">
              Mengangkat keindahan budaya Toraja ke dalam fashion modern.<br />
              Setiap karya adalah perpaduan tradisi dan gaya kontemporer.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <button className="btn-hero-primary" onClick={() => { document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
                ✨ JELAJAHI KOLEKSI
              </button>
            </div>
          </div>
        </div>

        {/* BRAND STORY SECTION */}
        <div style={{ padding: "80px 0", background: "#FFFFFF" }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h2 style={{ fontSize: "32px", fontWeight: "600", marginBottom: "20px", color: "#1A1A1A", letterSpacing: "-0.5px" }}>
                  <span style={{ color: "#D4AF37" }}>Warisan</span> Budaya<br />Dalam Setiap Jahitan
                </h2>
                <div className="divider-gold" style={{ margin: "0 0 24px 0" }}></div>
                <p style={{ color: "#666666", lineHeight: "1.7", marginBottom: "20px", fontSize: "15px" }}>
                  TO Mangla x TORAJA CLOTHING adalah brand fashion yang mengusung kearifan lokal Toraja dengan sentuhan modern.
                </p>
                <p style={{ color: "#666666", lineHeight: "1.7", fontSize: "15px" }}>
                  Kami percaya bahwa fashion bukan hanya tentang penampilan, tapi juga tentang bagaimana Anda menceritakan siapa diri Anda.
                </p>
              </div>
              <div className="col-md-6 text-center">
                <div style={{ background: "#F8F8F8", padding: "30px", borderRadius: "16px" }}>
                  <h4 style={{ color: "#D4AF37", marginBottom: "16px", fontSize: "18px" }}>✨ VISI KAMI</h4>
                  <p style={{ color: "#666666", fontSize: "14px" }}>Menjadi brand fashion Toraja yang mendunia dengan tetap mempertahankan nilai-nilai budaya leluhur.</p>
                  <h4 style={{ color: "#D4AF37", marginTop: "24px", marginBottom: "16px", fontSize: "18px" }}>🎯 MISI KAMI</h4>
                  <p style={{ color: "#666666", fontSize: "14px" }}>Memberikan produk berkualitas tinggi yang mencerminkan identitas Toraja modern.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT SECTION */}
        <div id="products-section" style={{ padding: "80px 0", background: "#FAFAFA" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <h2 className="section-title">Koleksi <span style={{ color: "#D4AF37" }}>Terbaru</span></h2>
              <div className="divider-gold"></div>
              <p className="section-subtitle">Temukan pilihan terbaik dari koleksi eksklusif kami</p>
            </div>

            <div className="row g-2 g-md-4">
              {products.map((p, index) => (
                <div key={p.id} className="col-6 col-md-4 col-lg-3">
                  <div className="product-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <Link to={`/product/${p.id}`} style={{ textDecoration: "none", color: "inherit", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ position: "relative", overflow: "hidden" }}>
                        {index % 2 === 0 && <span className="product-badge">PREMIUM</span>}
                        {p.image ? (
                          <img src={getImageUrl(p.image)} className="product-image" alt={p.name} style={{ height: "220px", objectFit: "cover", width: "100%" }} />
                        ) : (
                          <div style={{ height: "220px", background: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: "12px" }}>No Image</div>
                        )}
                      </div>
                      <div className="card-body" style={{ padding: "12px 12px 6px 12px", flex: 1 }}>
                        <h5 className="product-title" style={{ fontSize: "14px", marginBottom: "4px", lineHeight: "1.3" }}>{p.name}</h5>
                        <p className="card-text small" style={{ color: "#999999", fontSize: "11px", marginBottom: "6px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.description}</p>
                        <p className="product-price" style={{ fontSize: "14px", marginBottom: 0 }}>Rp {p.price.toLocaleString()}</p>
                      </div>
                    </Link>
                    <div style={{ padding: "8px 12px 12px 12px" }}>
                      <button className="btn-add-to-cart" style={{ fontSize: "12px", padding: "8px" }} onClick={() => addToCart(p)}>🛒 Keranjang</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA SECTION */}
        <div style={{ background: "#1A1A1A", padding: "60px 0", textAlign: "center" }}>
          <div className="container">
            <h2 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "12px", color: "white" }}>Temukan Gaya Toraja Modern Anda</h2>
            <p style={{ color: "#AAAAAA", maxWidth: "500px", margin: "0 auto 24px", fontSize: "14px" }}>Dapatkan penawaran eksklusif hanya untuk Anda.</p>
          </div>
        </div>

        {/* SOCIAL SECTION */}
        <div style={{ padding: "60px 0", background: "#FFFFFF" }}>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-3 mb-4">
                <div style={{ background: "#F8F8F8", padding: "25px 20px", borderRadius: "16px", textAlign: "center", height: "100%" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>📷</div>
                  <h5 style={{ color: "#1A1A1A", fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>INSTAGRAM</h5>
                  <p style={{ color: "#666666", fontSize: "13px", marginBottom: "16px" }}>Ikuti kami untuk update terbaru</p>
                  <a href="https://www.instagram.com/to_manglaa" target="_blank" className="btn" style={{ background: "#D4AF37", border: "none", color: "#1A1A1A", borderRadius: "30px", padding: "8px 20px", fontSize: "13px", textDecoration: "none", display: "inline-block" }}>@to_manglaa</a>
                </div>
              </div>

              <div className="col-12 col-md-3 mb-4">
                <div style={{ background: "#F8F8F8", padding: "25px 20px", borderRadius: "16px", textAlign: "center", height: "100%" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎵</div>
                  <h5 style={{ color: "#1A1A1A", fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>TIKTOK</h5>
                  <p style={{ color: "#666666", fontSize: "13px", marginBottom: "16px" }}>Tonton konten menarik kami</p>
                  <a href="https://www.tiktok.com/@to_manglaa" target="_blank" className="btn" style={{ background: "#010101", border: "none", color: "white", borderRadius: "30px", padding: "8px 20px", fontSize: "13px", textDecoration: "none", display: "inline-block" }}>@to_manglaa</a>
                </div>
              </div>

              <div className="col-12 col-md-3 mb-4">
                <div style={{ background: "#F8F8F8", padding: "25px 20px", borderRadius: "16px", textAlign: "center", height: "100%" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>💬</div>
                  <h5 style={{ color: "#1A1A1A", fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>WHATSAPP</h5>
                  <p style={{ color: "#666666", fontSize: "13px", marginBottom: "16px" }}>Hubungi admin untuk pemesanan</p>
                  <a href="https://wa.me/6285397853625" target="_blank" className="btn" style={{ background: "#25D366", border: "none", color: "white", borderRadius: "30px", padding: "8px 20px", fontSize: "13px", textDecoration: "none", display: "inline-block" }}>Chat Admin</a>
                </div>
              </div>

              <div className="col-12 col-md-3 mb-4">
                <div style={{ background: "#F8F8F8", padding: "25px 20px", borderRadius: "16px", textAlign: "center", height: "100%" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>📍</div>
                  <h5 style={{ color: "#1A1A1A", fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>LOKASI</h5>
                  <p style={{ color: "#666666", fontSize: "13px", marginBottom: "4px" }}>Toraja, Sulawesi Selatan</p>
                  <p style={{ color: "#999999", fontSize: "11px" }}>Buka Senin - Sabtu | 09:00 - 17:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="footer-premium">
          <div className="container">
            <div className="text-center mb-3"><img src={logo} alt="Logo" style={{ height: "40px", borderRadius: "50%" }} /></div>
            <div className="text-center mb-3">
              <a href="https://www.instagram.com/to_manglaa?igsh=MXN5MmJhN256ZXpocw==" target="_blank" style={{ color: "#999999", margin: "0 12px", fontSize: "18px", textDecoration: "none" }}>📷</a>
              <a href="https://www.tiktok.com/@to_manglaa" target="_blank" style={{ color: "#999999", margin: "0 12px", fontSize: "20px", textDecoration: "none" }}>🎵</a>
              <a href="https://wa.me/6285397853625" target="_blank" style={{ color: "#999999", margin: "0 12px", fontSize: "18px", textDecoration: "none" }}>💬</a>
            </div>
            <p className="text-center" style={{ color: "#AAAAAA", fontSize: "12px", marginBottom: "4px" }}>© 2024 TO Mangla x TORAJA CLOTHING</p>
            <p className="text-center" style={{ color: "#BBBBBB", fontSize: "10px" }}>Mengangkat Budaya Toraja dalam setiap karya</p>
          </div>
        </footer>

        {/* CART SIDEBAR */}
        <CartSidebar />
      </>
    );
  }

  // HALAMAN MYORDERS
  if (currentPage === "myorders") {
    return (
      <>
        <style>{`
          .navbar-premium {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            padding: 14px 0;
          }
        `}</style>
        <nav className="navbar navbar-expand-lg fixed-top" style={{ background: "rgba(255, 255, 255, 0.98)", backdropFilter: "blur(10px)", borderBottom: "1px solid #EEEEEE", padding: "14px 0" }}>
          <div className="container">
            <a className="navbar-brand d-flex align-items-center" href="#" onClick={() => setCurrentPage("home")}>
              <img src={logo} alt="Logo" style={{ height: "38px", marginRight: "10px", borderRadius: "50%" }} />
              <div><span style={{ fontWeight: "600", fontSize: "16px", color: "#1A1A1A" }}>TO MANGLA</span><span style={{ fontSize: "9px", display: "block", color: "#D4AF37" }}>TORAJA CLOTHING</span></div>
            </a>
            <button className="btn" style={{ background: "transparent", border: "1.5px solid #1A1A1A", color: "#1A1A1A", borderRadius: "30px", padding: "6px 18px", fontSize: "13px" }} onClick={() => setCurrentPage("home")}>← KEMBALI</button>
          </div>
        </nav>

        <div className="container" style={{ padding: "120px 0 60px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "30px", color: "#1A1A1A" }}>📦 Pesanan Saya</h1>

          {loadingOrders ? (
            <div className="text-center"><div className="spinner-border" style={{ color: "#D4AF37" }}></div></div>
          ) : myOrders.length === 0 ? (
            <div style={{ background: "#F8F8F8", border: "1px solid #EEEEEE", borderRadius: "12px", padding: "40px", textAlign: "center", color: "#666666" }}>
              Belum ada pesanan. Yuk belanja dulu!
            </div>
          ) : (
            <div className="table-responsive">
              <table style={{ width: "100%", background: "#FFFFFF", borderRadius: "12px", overflow: "hidden", borderCollapse: "collapse", border: "1px solid #EEEEEE" }}>
                <thead style={{ background: "#FAFAFA", borderBottom: "1px solid #EEEEEE" }}>
                  <tr>
                    <th style={{ padding: "14px 16px", textAlign: "left", color: "#1A1A1A", fontWeight: "600", fontSize: "13px" }}>ID</th>
                    <th style={{ padding: "14px 16px", textAlign: "left", color: "#1A1A1A", fontWeight: "600", fontSize: "13px" }}>Total</th>
                    <th style={{ padding: "14px 16px", textAlign: "left", color: "#1A1A1A", fontWeight: "600", fontSize: "13px" }}>Status</th>
                    <th style={{ padding: "14px 16px", textAlign: "left", color: "#1A1A1A", fontWeight: "600", fontSize: "13px" }}>Tanggal</th>
                    <th style={{ padding: "14px 16px", textAlign: "left", color: "#1A1A1A", fontWeight: "600", fontSize: "13px" }}>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {myOrders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: "1px solid #EEEEEE" }}>
                      <td style={{ padding: "12px 16px", color: "#1A1A1A", fontSize: "14px" }}>{order.id}</td>
                      <td style={{ padding: "12px 16px", color: "#D4AF37", fontWeight: "600", fontSize: "14px" }}>Rp {order.total?.toLocaleString()}</td>
                      <td style={{ padding: "12px 16px" }}>{statusBadge(order.status)}</td>
                      <td style={{ padding: "12px 16px", color: "#666666", fontSize: "13px" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          style={{ background: "#1A1A1A", border: "none", color: "white", padding: "6px 14px", borderRadius: "30px", fontSize: "12px", fontWeight: "500", cursor: "pointer" }}
                          onClick={() => alert(`Detail Order #${order.id}\nAlamat: ${order.customerAddress}\nTelepon: ${order.customerPhone}\nTotal: Rp ${order.total?.toLocaleString()}\nStatus: ${order.status}`)}
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>
    );
  }

  // HALAMAN TERMS
  if (currentPage === "terms") {
    return (
      <>
        <nav className="navbar navbar-expand-lg fixed-top" style={{ background: "rgba(255, 255, 255, 0.98)", backdropFilter: "blur(10px)", borderBottom: "1px solid #EEEEEE", padding: "14px 0" }}>
          <div className="container">
            <a className="navbar-brand d-flex align-items-center" href="#" onClick={(e) => { e.preventDefault(); setCurrentPage("home"); }}>
              <img src={logo} alt="Logo" style={{ height: "38px", marginRight: "10px", borderRadius: "50%" }} />
              <div><span style={{ fontWeight: "600", fontSize: "16px", color: "#1A1A1A" }}>TO MANGLA</span><span style={{ fontSize: "9px", display: "block", color: "#D4AF37" }}>TORAJA CLOTHING</span></div>
            </a>
            <button className="btn" style={{ background: "transparent", border: "1.5px solid #1A1A1A", color: "#1A1A1A", borderRadius: "30px", padding: "6px 18px", fontSize: "13px" }} onClick={() => setCurrentPage("home")}>← KEMBALI</button>
          </div>
        </nav>
        <div className="container" style={{ padding: "120px 0 60px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "30px", color: "#1A1A1A" }}>📜 Syarat & Ketentuan</h1>
          {!adminTerms || adminTerms.filter(t => t.isActive).length === 0 ? (
            <div style={{ background: "#F8F8F8", border: "1px solid #EEEEEE", borderRadius: "12px", padding: "40px", textAlign: "center", color: "#666666" }}>
              Belum ada syarat & ketentuan.
            </div>
          ) : (
            <div className="row">
              {adminTerms.filter(t => t.isActive).map(term => (
                <div key={term.id} className="col-md-6 mb-4">
                  <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid #EEEEEE", overflow: "hidden" }}>
                    <div style={{ background: "#FAFAFA", padding: "14px 20px", borderBottom: "1px solid #EEEEEE" }}>
                      <h5 style={{ margin: 0, color: "#D4AF37", fontSize: "16px", fontWeight: "600" }}>{term.title}</h5>
                      <small style={{ color: "#999999", fontSize: "11px" }}>Versi {term.version} - {term.category}</small>
                    </div>
                    <div style={{ padding: "20px" }}>
                      <p style={{ color: "#666666", lineHeight: "1.6", fontSize: "14px" }}>{term.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }
  // HALAMAN ADMIN
  if (currentPage === "admin" && isAdmin) {
    return (
      <>
        <style>{`
          .admin-layout {
            display: flex;
            min-height: 100vh;
            margin-top: 70px;
            background: #F5F5F5;
            flex-direction: row;
          }
          .admin-sidebar {
            width: 280px;
            background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%);
            min-height: 100vh;
            color: #FFFFFF;
            position: fixed;
            left: 0;
            top: 70px;
            bottom: 0;
            overflow-y: auto;
            z-index: 100;
            transition: all 0.3s ease;
          }
          .admin-content {
            margin-left: 280px;
            padding: 30px;
            width: calc(100% - 280px);
            min-height: 100vh;
            transition: all 0.3s ease;
          }
          @media (max-width: 991px) {
            .admin-layout {
              flex-direction: column !important;
            }
            .admin-sidebar {
              width: 100% !important;
              min-height: auto !important;
              position: static !important;
              padding-bottom: 20px;
            }
            .admin-content {
              margin-left: 0 !important;
              width: 100% !important;
              padding: 15px !important;
            }
          }
        `}</style>
        <nav className="navbar navbar-expand-lg fixed-top" style={{ background: "rgba(255, 255, 255, 0.98)", backdropFilter: "blur(10px)", borderBottom: "1px solid #EEEEEE", padding: "14px 0" }}>
          <div className="container">
            <a className="navbar-brand d-flex align-items-center" href="#" onClick={() => setCurrentPage("home")}>
              <img src={logo} alt="Logo" style={{ height: "38px", marginRight: "10px", borderRadius: "50%" }} />
              <div>
                <span style={{ fontWeight: "600", fontSize: "16px", letterSpacing: "1px", color: "#1A1A1A" }}>TO MANGLA</span>
                <span style={{ fontSize: "9px", display: "block", color: "#D4AF37", letterSpacing: "2px" }}>TORAJA CLOTHING</span>
              </div>
            </a>
            <button className="navbar-toggler" type="button" onClick={() => setIsNavbarOpen(!isNavbarOpen)}>
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse ${isNavbarOpen ? "show" : ""}`} id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-center">
                <li className="nav-item"><span className="nav-link" style={{ color: "#D4AF37" }}>👋 {user?.name}{isAdmin && "👑"}</span></li>
                <li className="nav-item"><button className="btn ms-2" style={{ background: "#1A1A1A", border: "none", color: "white", borderRadius: "30px", padding: "6px 20px", fontSize: "13px" }} onClick={() => { setCurrentPage("home"); setIsNavbarOpen(false); }}>← HOME</button></li>
              </ul>
            </div>
          </div>
        </nav>

        {/* LAYOUT ADMIN DENGAN SIDEBAR */}
        <div className="admin-layout">
          {/* SIDEBAR KIRI */}
          <div className="admin-sidebar">
            <div style={{ padding: "30px 20px" }}>
              <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "1px solid rgba(212,175,55,0.3)", paddingBottom: "20px" }}>
                <h3 style={{ margin: 0, color: "#D4AF37", fontSize: "20px" }}>ADMIN PANEL</h3>
                <p style={{ fontSize: "12px", color: "#AAAAAA", marginTop: "8px" }}>Kelola Toko Anda</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  onClick={() => setAdminTab("dashboard")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    background: adminTab === "dashboard" ? "#D4AF37" : "transparent",
                    color: adminTab === "dashboard" ? "#1A1A1A" : "#FFFFFF",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: adminTab === "dashboard" ? "600" : "400",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (adminTab !== "dashboard") e.currentTarget.style.background = "rgba(212,175,55,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    if (adminTab !== "dashboard") e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{ fontSize: "20px" }}>📊</span> Dashboard
                </button>

                <button
                  onClick={() => setAdminTab("products")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    background: adminTab === "products" ? "#D4AF37" : "transparent",
                    color: adminTab === "products" ? "#1A1A1A" : "#FFFFFF",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: adminTab === "products" ? "600" : "400",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (adminTab !== "products") e.currentTarget.style.background = "rgba(212,175,55,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    if (adminTab !== "products") e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{ fontSize: "20px" }}>👕</span> Produk
                </button>

                <button
                  onClick={() => setAdminTab("orders")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    background: adminTab === "orders" ? "#D4AF37" : "transparent",
                    color: adminTab === "orders" ? "#1A1A1A" : "#FFFFFF",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: adminTab === "orders" ? "600" : "400",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (adminTab !== "orders") e.currentTarget.style.background = "rgba(212,175,55,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    if (adminTab !== "orders") e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{ fontSize: "20px" }}>📦</span> Order
                </button>

                <button
                  onClick={() => setAdminTab("users")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    background: adminTab === "users" ? "#D4AF37" : "transparent",
                    color: adminTab === "users" ? "#1A1A1A" : "#FFFFFF",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: adminTab === "users" ? "600" : "400",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (adminTab !== "users") e.currentTarget.style.background = "rgba(212,175,55,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    if (adminTab !== "users") e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{ fontSize: "20px" }}>👥</span> User
                </button>

                <button
                  onClick={() => setAdminTab("terms")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    background: adminTab === "terms" ? "#D4AF37" : "transparent",
                    color: adminTab === "terms" ? "#1A1A1A" : "#FFFFFF",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: adminTab === "terms" ? "600" : "400",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (adminTab !== "terms") e.currentTarget.style.background = "rgba(212,175,55,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    if (adminTab !== "terms") e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{ fontSize: "20px" }}>📜</span> Terms
                </button>
              </div>
            </div>
          </div>

          {/* KONTEN UTAMA */}
          <div className="admin-content">
            {/* DASHBOARD */}
            {adminTab === "dashboard" && (
              <div>
                <h2 style={{ color: "#1A1A1A", fontSize: "24px", fontWeight: "600", marginBottom: "24px" }}>Dashboard Overview</h2>
                <div className="row g-4">
                  <div className="col-md-4">
                    <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "transform 0.2s ease" }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                        <span style={{ fontSize: "36px" }}>💰</span>
                        <span style={{ fontSize: "24px", color: "#D4AF37" }}>↑ 12%</span>
                      </div>
                      <h5 style={{ color: "#666666", fontSize: "14px", marginBottom: "8px" }}>Total Pendapatan</h5>
                      <h3 style={{ color: "#1A1A1A", fontSize: "28px", fontWeight: "600", margin: 0 }}>Rp {dashboard.totalRevenue.toLocaleString()}</h3>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "transform 0.2s ease" }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                        <span style={{ fontSize: "36px" }}>📦</span>
                      </div>
                      <h5 style={{ color: "#666666", fontSize: "14px", marginBottom: "8px" }}>Total Order</h5>
                      <h3 style={{ color: "#1A1A1A", fontSize: "28px", fontWeight: "600", margin: 0 }}>{dashboard.totalOrders}</h3>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "transform 0.2s ease" }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                        <span style={{ fontSize: "36px" }}>👥</span>
                      </div>
                      <h5 style={{ color: "#666666", fontSize: "14px", marginBottom: "8px" }}>Total User</h5>
                      <h3 style={{ color: "#1A1A1A", fontSize: "28px", fontWeight: "600", margin: 0 }}>{dashboard.totalUsers}</h3>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCTS */}
            {adminTab === "products" && (
              <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1px solid #EEEEEE", overflow: "hidden" }}>
                <div style={{ background: "#FAFAFA", padding: "16px 20px", borderBottom: "1px solid #EEEEEE", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h5 style={{ margin: 0, color: "#1A1A1A", fontSize: "16px", fontWeight: "600" }}>📦 Kelola Produk</h5>
                  <button className="btn btn-sm" style={{ background: "#D4AF37", color: "#1A1A1A", border: "none", padding: "8px 20px", borderRadius: "30px", fontSize: "13px", fontWeight: "500" }} onClick={() => setShowAddForm(!showAddForm)}>+ Tambah Produk</button>
                </div>
                <div style={{ padding: "20px" }}>
                  {showAddForm && (
                    <form onSubmit={handleAddProduct} style={{ marginBottom: "24px", padding: "20px", background: "#F8F8F8", borderRadius: "12px" }}>
                      <div className="row g-2">
                        <div className="col-md-4"><input type="text" name="name" className="form-control" placeholder="Nama" value={formData.name} onChange={handleInputChange} required style={{ border: "1px solid #EEEEEE", borderRadius: "10px", padding: "10px 14px" }} /></div>
                        <div className="col-md-2"><input type="number" name="price" className="form-control" placeholder="Harga" value={formData.price} onChange={handleInputChange} required style={{ border: "1px solid #EEEEEE", borderRadius: "10px", padding: "10px 14px" }} /></div>
                        <div className="col-md-3"><input type="file" className="form-control" accept="image/*" onChange={handleImageChange} style={{ border: "1px solid #EEEEEE", borderRadius: "10px", padding: "10px 14px" }} /></div>
                        <div className="col-md-3"><textarea name="description" className="form-control" placeholder="Deskripsi" value={formData.description} onChange={handleInputChange} style={{ border: "1px solid #EEEEEE", borderRadius: "10px", padding: "10px 14px" }}></textarea></div>
                      </div>
                      <div className="mt-3">
                        <button type="submit" className="btn btn-sm" style={{ background: "#28a745", border: "none", color: "white", padding: "8px 20px", borderRadius: "30px" }}>Simpan</button>
                        <button type="button" className="btn btn-sm ms-2" style={{ background: "#6c757d", border: "none", color: "white", padding: "8px 20px", borderRadius: "30px" }} onClick={() => setShowAddForm(false)}>Batal</button>
                      </div>
                    </form>
                  )}
                  {editingProduct && (
                    <form onSubmit={handleEditProduct} style={{ marginBottom: "24px", padding: "20px", background: "#FEF3E2", borderRadius: "12px", border: "1px solid #D4AF37" }}>
                      <h6 style={{ color: "#D4AF37", marginBottom: "16px", fontWeight: "600" }}>Edit Produk: {editingProduct.name}</h6>
                      <div className="row g-2">
                        <div className="col-md-4"><input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required style={{ border: "1px solid #EEEEEE", borderRadius: "10px", padding: "10px 14px" }} /></div>
                        <div className="col-md-2"><input type="number" name="price" className="form-control" value={formData.price} onChange={handleInputChange} required style={{ border: "1px solid #EEEEEE", borderRadius: "10px", padding: "10px 14px" }} /></div>
                        <div className="col-md-3"><input type="file" className="form-control" accept="image/*" onChange={handleImageChange} style={{ border: "1px solid #EEEEEE", borderRadius: "10px", padding: "10px 14px" }} /></div>
                        <div className="col-md-3"><textarea name="description" className="form-control" value={formData.description} onChange={handleInputChange} style={{ border: "1px solid #EEEEEE", borderRadius: "10px", padding: "10px 14px" }}></textarea></div>
                      </div>
                      <div className="mt-3">
                        <button type="submit" className="btn btn-sm" style={{ background: "#D4AF37", border: "none", color: "#1A1A1A", padding: "8px 20px", borderRadius: "30px", fontWeight: "500" }}>Update</button>
                        <button type="button" className="btn btn-sm ms-2" style={{ background: "#6c757d", border: "none", color: "white", padding: "8px 20px", borderRadius: "30px" }} onClick={() => { setEditingProduct(null); setFormData({ name: "", price: "", description: "" }); setImageFile(null); }}>Batal</button>
                      </div>
                    </form>
                  )}
                  <div className="table-responsive">
                    <table style={{ width: "100%", background: "#FFFFFF", borderRadius: "10px", borderCollapse: "collapse", border: "1px solid #EEEEEE" }}>
                      <thead style={{ background: "#1A1A1A", color: "#FFFFFF", borderBottom: "1px solid #EEEEEE" }}>
                        <tr>
                          <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>ID</th>
                          <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>Foto</th>
                          <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>Nama</th>
                          <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>Harga</th>
                          <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminProducts.map((p, idx) => (
                          <tr key={p.id} style={{ borderBottom: "1px solid #EEEEEE", background: idx % 2 === 0 ? "#FFFFFF" : "#F8F8F8" }}>
                            <td style={{ padding: "10px 16px", color: "#1A1A1A", fontSize: "13px" }}>{p.id}</td>
                            <td style={{ padding: "10px 16px" }}>{p.image ? <img src={getImageUrl(p.image)} width="40" height="40" style={{ objectFit: "cover", borderRadius: "8px" }} alt={p.name} /> : "-"}</td>
                            <td style={{ padding: "10px 16px", color: "#1A1A1A", fontSize: "13px" }}>{p.name}</td>
                            <td style={{ padding: "10px 16px", color: "#D4AF37", fontWeight: "600", fontSize: "13px" }}>Rp {p.price.toLocaleString()}</td>
                            <td style={{ padding: "10px 16px" }}>
                              <button className="btn btn-sm" style={{ background: "#ffc107", border: "none", color: "#1A1A1A", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", marginRight: "6px" }} onClick={() => startEdit(p)}>Edit</button>
                              <button className="btn btn-sm" style={{ background: "#dc3545", border: "none", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "11px" }} onClick={() => handleDeleteProduct(p.id)}>Hapus</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS */}
            {adminTab === "orders" && (
              <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1px solid #EEEEEE", overflow: "hidden" }}>
                <div style={{ background: "#FAFAFA", padding: "16px 20px", borderBottom: "1px solid #EEEEEE" }}>
                  <h5 style={{ margin: 0, color: "#1A1A1A", fontSize: "16px", fontWeight: "600" }}>📋 Manajemen Order</h5>
                </div>
                <div style={{ padding: "20px" }}>
                  <div className="table-responsive">
                    {orders.length === 0 ? (
                      <div style={{ padding: "40px", textAlign: "center", color: "#999", background: "#F8F8F8", borderRadius: "12px" }}>
                        📦 Belum ada order masuk
                      </div>
                    ) : (
                      <table style={{ width: "100%", background: "#FFFFFF", borderRadius: "10px", borderCollapse: "collapse", border: "1px solid #EEEEEE" }}>
                        <thead style={{ background: "#1A1A1A", color: "#FFFFFF", borderBottom: "1px solid #EEEEEE" }}>
                          <tr>
                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>ID</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>Customer</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>Total</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>Status</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>Tanggal</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((o, idx) => (
                            <tr key={o.id} style={{ borderBottom: "1px solid #EEEEEE", background: idx % 2 === 0 ? "#FFFFFF" : "#F8F8F8" }}>
                              <td style={{ padding: "10px 16px", color: "#1A1A1A", fontSize: "13px" }}>{o.id}</td>
                              <td style={{ padding: "10px 16px", color: "#1A1A1A", fontSize: "13px" }}>{o.customerName}<br /><small style={{ color: "#999999", fontSize: "11px" }}>{o.customerPhone}</small></td>
                              <td style={{ padding: "10px 16px", color: "#D4AF37", fontWeight: "600", fontSize: "13px" }}>Rp {o.total?.toLocaleString()}</td>
                              <td style={{ padding: "10px 16px" }}>{statusBadge(o.status)}</td>
                              <td style={{ padding: "10px 16px", color: "#666666", fontSize: "13px" }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                              <td style={{ padding: "10px 16px" }}>
                                <button className="btn btn-sm" style={{ background: "#1A1A1A", border: "none", color: "white", padding: "5px 14px", borderRadius: "20px", fontSize: "11px" }} onClick={() => setShowOrderDetail(o)}>
                                  Detail
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                  {/* MODAL DETAIL ORDER */}
                  {showOrderDetail && (
                    <div style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "rgba(0,0,0,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1100
                    }} onClick={() => setShowOrderDetail(null)}>
                      <div style={{
                        background: "white",
                        borderRadius: "16px",
                        maxWidth: "600px",
                        width: "90%",
                        maxHeight: "80vh",
                        overflow: "auto",
                        padding: "24px"
                      }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                          <h3 style={{ color: "#D4AF37" }}>Detail Order #{showOrderDetail.id}</h3>
                          <button onClick={() => setShowOrderDetail(null)} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>✕</button>
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                          <p><strong>Pelanggan:</strong> {showOrderDetail.customerName}</p>
                          <p><strong>Telepon:</strong> {showOrderDetail.customerPhone}</p>
                          <p><strong>Alamat:</strong> {showOrderDetail.customerAddress}</p>
                          <p><strong>Status:</strong> <span style={{ background: "#FEF3E2", padding: "4px 12px", borderRadius: "20px" }}>{showOrderDetail.status}</span></p>
                        </div>

                        <div className="mt-3" style={{ marginBottom: "16px" }}>
                          <label style={{ marginRight: "12px" }}>Update Status:</label>
                          <select value={showOrderDetail.status} onChange={(e) => handleUpdateOrderStatus(showOrderDetail.id, e.target.value)} disabled={updatingStatus} style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid #DDD" }}>
                            <option value="pending">Pending</option>
                            <option value="processed">Diproses</option>
                            <option value="shipped">Dikirim</option>
                            <option value="delivered">Selesai</option>
                            <option value="cancelled">Dibatalkan</option>
                          </select>
                          {updatingStatus && <span style={{ marginLeft: "8px", color: "#D4AF37" }}>Menyimpan...</span>}
                        </div>

                        <h4 style={{ marginTop: "20px", marginBottom: "12px" }}>Produk yang Dipesan:</h4>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ background: "#1A1A1A", color: "white" }}>
                              <th style={{ padding: "8px", textAlign: "left" }}>Produk</th>
                              <th style={{ padding: "8px", textAlign: "left" }}>Ukuran</th>
                              <th style={{ padding: "8px", textAlign: "center" }}>Jumlah</th>
                              <th style={{ padding: "8px", textAlign: "right" }}>Harga</th>
                              <th style={{ padding: "8px", textAlign: "right" }}>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {showOrderDetail.items?.map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: "1px solid #EEE" }}>
                                <td style={{ padding: "8px" }}>{item.product?.name || "-"}</td>
                                <td style={{ padding: "8px" }}>{item.size?.name || "-"}</td>
                                <td style={{ padding: "8px", textAlign: "center" }}>{item.qty}</td>
                                <td style={{ padding: "8px", textAlign: "right" }}>Rp {item.price?.toLocaleString()}</td>
                                <td style={{ padding: "8px", textAlign: "right" }}>Rp {(item.price * item.qty)?.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr style={{ background: "#F8F8F8" }}>
                              <td colSpan="4" style={{ padding: "12px", textAlign: "right", fontWeight: "bold" }}>TOTAL:</td>
                              <td style={{ padding: "12px", textAlign: "right", fontWeight: "bold", color: "#D4AF37" }}>
                                Rp {showOrderDetail.total?.toLocaleString()}
                              </td>
                            </tr>
                          </tfoot>
                        </table>

                        <div style={{ marginTop: "20px", textAlign: "center" }}>
                          <button onClick={() => setShowOrderDetail(null)} style={{ background: "#D4AF37", border: "none", padding: "10px 24px", borderRadius: "30px", cursor: "pointer" }}>
                            Tutup
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* USERS */}
            {adminTab === "users" && (
              <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1px solid #EEEEEE", overflow: "hidden" }}>
                <div style={{ background: "#FAFAFA", padding: "16px 20px", borderBottom: "1px solid #EEEEEE" }}>
                  <h5 style={{ margin: 0, color: "#1A1A1A", fontSize: "16px", fontWeight: "600" }}>👥 Manajemen User</h5>
                </div>
                <div style={{ padding: "20px" }}>
                  <div className="table-responsive">
                    {users.length === 0 ? (
                      <div style={{ padding: "40px", textAlign: "center", color: "#999", background: "#F8F8F8", borderRadius: "12px" }}>
                        👥 Belum ada data user
                      </div>
                    ) : (
                      <table style={{ width: "100%", background: "#FFFFFF", borderRadius: "10px", borderCollapse: "collapse", border: "1px solid #EEEEEE" }}>
                        <thead style={{ background: "#1A1A1A", color: "#FFFFFF", borderBottom: "1px solid #EEEEEE" }}>
                          <tr>
                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>ID</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>Nama</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>Email</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>Role</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((u, idx) => (
                            <tr key={u.id} style={{ borderBottom: "1px solid #EEEEEE", background: idx % 2 === 0 ? "#FFFFFF" : "#F8F8F8" }}>
                              <td style={{ padding: "10px 16px", color: "#1A1A1A", fontSize: "13px" }}>{u.id}</td>
                              <td style={{ padding: "10px 16px", color: "#1A1A1A", fontSize: "13px" }}>{u.name}</td>
                              <td style={{ padding: "10px 16px", color: "#1A1A1A", fontSize: "13px" }}>{u.email}</td>
                              <td style={{ padding: "10px 16px" }}>{u.role === "admin" ? <span style={{ background: "#D4AF37", padding: "4px 12px", borderRadius: "30px", fontSize: "11px", color: "#1A1A1A", fontWeight: "500" }}>Admin</span> : <span style={{ background: "#EEEEEE", padding: "4px 12px", borderRadius: "30px", fontSize: "11px", color: "#666666" }}>User</span>}</td>
                              <td style={{ padding: "10px 16px" }}>
                                {String(u.id) !== String(user?.id) && (
                                  <>
                                    {editingRoleUser !== null && String(editingRoleUser) === String(u.id) ? (
                                      <select className="form-select form-select-sm d-inline w-auto" style={{ width: "auto", background: "#FFFFFF", border: "1px solid #D4AF37", borderRadius: "20px", padding: "4px 10px", fontSize: "12px" }} value={u.role} onChange={(e) => handleChangeUserRole(u.id, e.target.value)}>
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                      </select>
                                    ) : (
                                      <button type="button" className="btn btn-sm" style={{ background: "#ffc107", border: "none", color: "#1A1A1A", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", marginRight: "6px" }} onClick={() => setEditingRoleUser(u.id)}>Ubah Role</button>
                                    )}
                                    {editingRoleUser !== null && String(editingRoleUser) === String(u.id) && (
                                      <button type="button" className="btn btn-sm" style={{ background: "#6c757d", border: "none", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", marginRight: "6px" }} onClick={() => setEditingRoleUser(null)}>Batal</button>
                                    )}
                                    <button type="button" className="btn btn-sm" style={{ background: "#dc3545", border: "none", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "11px" }} onClick={() => handleDeleteUser(u.id)}>Hapus</button>
                                  </>
                                )}
                                {String(u.id) === String(user?.id) && <span className="text-muted" style={{ color: "#999999", fontSize: "12px" }}>(Anda)</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* TERMS ADMIN */}
            {adminTab === "terms" && (
              <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1px solid #EEEEEE", overflow: "hidden" }}>
                <div style={{ background: "#FAFAFA", padding: "16px 20px", borderBottom: "1px solid #EEEEEE", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h5 style={{ margin: 0, color: "#1A1A1A", fontSize: "16px", fontWeight: "600" }}>📜 Kelola Syarat</h5>
                  <button className="btn btn-sm" style={{ background: "#D4AF37", color: "#1A1A1A", border: "none", padding: "8px 20px", borderRadius: "30px", fontSize: "13px", fontWeight: "500" }} onClick={() => setShowTermForm(!showTermForm)}>+ Tambah</button>
                </div>
                <div style={{ padding: "20px" }}>
                  {showTermForm && (
                    <form onSubmit={handleAddTerm} style={{ marginBottom: "24px", padding: "20px", background: "#F8F8F8", borderRadius: "12px" }}>
                      <div className="row g-2">
                        <div className="col-md-3"><input type="text" name="title" className="form-control" placeholder="Judul" value={termForm.title} onChange={handleTermChange} required style={{ border: "1px solid #EEEEEE", borderRadius: "10px", padding: "10px 14px" }} /></div>
                        <div className="col-md-5"><textarea name="content" className="form-control" placeholder="Isi" value={termForm.content} onChange={handleTermChange} required style={{ border: "1px solid #EEEEEE", borderRadius: "10px", padding: "10px 14px" }}></textarea></div>
                        <div className="col-md-2"><input type="text" name="category" className="form-control" placeholder="Kategori" value={termForm.category} onChange={handleTermChange} style={{ border: "1px solid #EEEEEE", borderRadius: "10px", padding: "10px 14px" }} /></div>
                        <div className="col-md-2"><input type="number" name="version" className="form-control" placeholder="Versi" value={termForm.version} onChange={handleTermChange} style={{ border: "1px solid #EEEEEE", borderRadius: "10px", padding: "10px 14px" }} /></div>
                      </div>
                      <div className="mt-2">
                        <label style={{ color: "#666666", fontSize: "13px" }}><input type="checkbox" checked={termForm.isActive} onChange={handleTermCheckbox} className="me-1" /> Aktif</label>
                      </div>
                      <div className="mt-3">
                        <button type="submit" className="btn btn-sm" style={{ background: "#28a745", border: "none", color: "white", padding: "8px 20px", borderRadius: "30px" }}>Simpan</button>
                        <button type="button" className="btn btn-sm ms-2" style={{ background: "#6c757d", border: "none", color: "white", padding: "8px 20px", borderRadius: "30px" }} onClick={() => setShowTermForm(false)}>Batal</button>
                      </div>
                    </form>
                  )}

                  {editingTerm && (
                    <form onSubmit={handleEditTerm} style={{ marginBottom: "24px", padding: "20px", background: "#FEF3E2", borderRadius: "12px", border: "1px solid #D4AF37" }}>
                      <h6 style={{ color: "#D4AF37", marginBottom: "16px", fontWeight: "600" }}>Edit Term: {editingTerm.title}</h6>
                      <div className="row g-2">
                        <div className="col-md-3"><input type="text" name="title" className="form-control" value={termForm.title} onChange={handleTermChange} required style={{ border: "1px solid #EEEEEE", borderRadius: "10px", padding: "10px 14px" }} /></div>
                        <div className="col-md-5"><textarea name="content" className="form-control" value={termForm.content} onChange={handleTermChange} required style={{ border: "1px solid #EEEEEE", borderRadius: "10px", padding: "10px 14px" }}></textarea></div>
                        <div className="col-md-2"><input type="text" name="category" className="form-control" value={termForm.category} onChange={handleTermChange} style={{ border: "1px solid #EEEEEE", borderRadius: "10px", padding: "10px 14px" }} /></div>
                        <div className="col-md-2"><input type="number" name="version" className="form-control" value={termForm.version} onChange={handleTermChange} style={{ border: "1px solid #EEEEEE", borderRadius: "10px", padding: "10px 14px" }} /></div>
                      </div>
                      <div className="mt-2">
                        <label style={{ color: "#666666", fontSize: "13px" }}><input type="checkbox" checked={termForm.isActive} onChange={handleTermCheckbox} className="me-1" /> Aktif</label>
                      </div>
                      <div className="mt-3">
                        <button type="submit" className="btn btn-sm" style={{ background: "#D4AF37", border: "none", color: "#1A1A1A", padding: "8px 20px", borderRadius: "30px", fontWeight: "500" }}>Update</button>
                        <button type="button" className="btn btn-sm ms-2" style={{ background: "#6c757d", border: "none", color: "white", padding: "8px 20px", borderRadius: "30px" }} onClick={() => { setEditingTerm(null); setTermForm({ title: "", content: "", category: "umum", version: 1, isActive: true }); }}>Batal</button>
                      </div>
                    </form>
                  )}

                  <div className="table-responsive">
                    {adminTerms.length === 0 ? (
                      <div style={{ padding: "40px", textAlign: "center", color: "#999", background: "#F8F8F8", borderRadius: "12px" }}>
                        ?? Belum ada syarat &amp; ketentuan
                      </div>
                    ) : (
                      <table style={{ width: "100%", background: "#FFFFFF", borderRadius: "10px", borderCollapse: "collapse", border: "1px solid #EEEEEE" }}>
                        <thead style={{ background: "#1A1A1A", color: "#FFFFFF", borderBottom: "1px solid #EEEEEE" }}>
                          <tr>
                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>ID</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>Judul</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>Kategori</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>Versi</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>Status</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF", fontWeight: "600", fontSize: "13px" }}>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminTerms.map((t, idx) => (
                            <tr key={t.id} style={{ borderBottom: "1px solid #EEEEEE", background: idx % 2 === 0 ? "#FFFFFF" : "#F8F8F8" }}>
                              <td style={{ padding: "10px 16px", color: "#1A1A1A", fontSize: "13px" }}>{t.id}</td>
                              <td style={{ padding: "10px 16px", color: "#1A1A1A", fontSize: "13px" }}>{t.title}</td>
                              <td style={{ padding: "10px 16px", color: "#1A1A1A", fontSize: "13px" }}>{t.category}</td>
                              <td style={{ padding: "10px 16px", color: "#1A1A1A", fontSize: "13px" }}>{t.version}</td>
                              <td style={{ padding: "10px 16px" }}>{t.isActive ? <span style={{ background: "#28a745", padding: "4px 12px", borderRadius: "30px", fontSize: "11px", color: "white" }}>Aktif</span> : <span style={{ background: "#EEEEEE", padding: "4px 12px", borderRadius: "30px", fontSize: "11px", color: "#666666" }}>Tidak</span>}</td>
                              <td style={{ padding: "10px 16px" }}>
                                <button className="btn btn-sm" style={{ background: "#ffc107", border: "none", color: "#1A1A1A", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", marginRight: "6px" }} onClick={() => startEditTerm(t)}>Edit</button>
                                <button className="btn btn-sm" style={{ background: "#dc3545", border: "none", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "11px" }} onClick={() => handleDeleteTerm(t.id)}>Hapus</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SETTINGS */}
            {adminTab === "settings" && <SettingsPage />}


          </div>
        </div>
      </>
    );
  }
}

export default Template;
