import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import Template from "./template/Template";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SuccessPage from "./pages/SuccessPage";

function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [pendingCheckoutData, setPendingCheckoutData] = useState(null);
  const [productSizes, setProductSizes] = useState({});

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedCart = localStorage.getItem("cart");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/products");
        const data = await res.json();
        setProducts(data);
        
        const sizesMap = {};
        for (const product of data) {
          const sizesRes = await fetch(`http://localhost:5000/products/${product.id}`);
          const productData = await sizesRes.json();
          if (productData.sizes) {
            sizesMap[product.id] = productData.sizes.map(s => ({
              id: s.size.id,
              name: s.size.name,
              label: s.size.label,
              stock: s.stock
            }));
          }
        }
        setProductSizes(sizesMap);
      } catch (err) {
        console.log("Error fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((item) => 
        item.id === product.id && item.sizeId === product.sizeId
      );
      if (exist) {
        return prev.map((item) =>
          item.id === product.id && item.sizeId === product.sizeId 
            ? { ...item, qty: item.qty + 1 } 
            : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id, sizeId) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.sizeId === sizeId)));
  };

  const updateQuantity = (productId, sizeId, newQty) => {
    if (newQty < 1) return;
    setCart(prev => prev.map(item => 
      item.id === productId && item.sizeId === sizeId 
        ? { ...item, qty: newQty } 
        : item
    ));
  };

  const updateSize = (productId, oldSizeId, newSizeId, newSizeName, newPrice) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId && item.sizeId === oldSizeId) {
        return {
          ...item,
          sizeId: newSizeId,
          sizeName: newSizeName,
          price: newPrice
        };
      }
      return item;
    }));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Cart kosong!");
      return;
    }
    window.location.href = "/checkout";
  };

  const processCheckout = async (addressData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired, silakan login ulang!");
      return;
    }
    if (cart.length === 0) {
      alert("Cart kosong!");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ 
          cart,
          customerName: addressData?.customerName,
          customerPhone: addressData?.customerPhone,
          customerAddress: addressData?.customerAddress,
          shippingMethod: addressData?.shippingMethod,
          paymentMethod: addressData?.paymentMethod
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Checkout berhasil! Pesanan Anda akan diproses.");
        localStorage.setItem("lastOrder", JSON.stringify(data.order));
        setCart([]);
        localStorage.removeItem("cart");
        window.location.href = "/success";
      } else {
        alert("❌ Checkout gagal: " + (data.message || "Terjadi kesalahan"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Gagal checkout");
    }
  };

  const proceedCheckout = (addressData) => {
    if (!user) {
      setPendingCheckoutData(addressData);
      setShowLogin(true);
      return;
    }
    processCheckout(addressData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setUser(null);
    setCart([]);
    setShowLogin(false);
    setPendingCheckoutData(null);
    window.location.href = "/";
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setShowLogin(false);
    if (pendingCheckoutData) {
      processCheckout(pendingCheckoutData);
      setPendingCheckoutData(null);
    }
  };

  const handleLoginFromNavbar = (loggedInUser) => {
    setUser(loggedInUser);
    window.location.href = "/"; // kembali ke beranda
  };

  if (showLogin) {
    return <Login onLogin={handleLoginSuccess} onCancel={() => setShowLogin(false)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <Template
              user={user}
              logout={logout}
              products={products}
              loading={loading}
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              total={total}
              onCheckout={handleCheckout}
              proceedCheckout={proceedCheckout}
              updateQuantity={updateQuantity}
              updateSize={updateSize}
              productSizes={productSizes}
            />
          } 
        />
        
        <Route 
          path="/cart" 
          element={
            <CartPage 
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              total={total}
              user={user}
              onCheckout={() => setShowLogin(true)}
              updateSize={updateSize}
              productSizes={productSizes}
            />
          } 
        />
        
        <Route 
          path="/checkout" 
          element={
            <CheckoutPage 
              cart={cart}
              total={total}
              proceedCheckout={proceedCheckout}
              user={user}
            />
          } 
        />

        <Route 
          path="/product/:id" 
          element={
            <ProductDetailPage 
              addToCart={addToCart}
              cart={cart}
            />
          } 
        />

        <Route 
          path="/reset-password" 
          element={<ResetPassword />} 
        />

        <Route 
          path="/success" 
          element={<SuccessPage />} 
        />

        <Route 
          path="/login" 
          element={
            <Login 
              onLogin={handleLoginFromNavbar} 
              onCancel={() => window.location.href = "/"} 
            />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;