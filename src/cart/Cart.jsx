import { useEffect, useState } from "react";

function Cart() {
  const [cart, setCart] = useState([]);

  // ================= LOAD CART =================
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // ================= REMOVE ITEM =================
  const removeItem = (id) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ================= CHANGE QTY =================
  const changeQty = (id, type) => {
    const updated = cart.map(item => {
      if (item.id === id) {
        return {
          ...item,
          qty:
            type === "inc"
              ? item.qty + 1
              : item.qty > 1
              ? item.qty - 1
              : 1
        };
      }
      return item;
    });

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ================= TOTAL =================
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>🛒 Cart</h2>

      {cart.length === 0 ? (
        <p>Cart kosong</p>
      ) : (
        cart.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              marginBottom: 10,
              padding: 10
            }}
          >
            <h3>{item.name}</h3>

            <p>Harga: Rp {item.price}</p>

            <p>
              Qty: {item.qty}
              <button onClick={() => changeQty(item.id, "inc")}>
                +
              </button>
              <button onClick={() => changeQty(item.id, "dec")}>
                -
              </button>
            </p>

            <p>Total: Rp {item.price * item.qty}</p>

            <button onClick={() => removeItem(item.id)}>
              Hapus
            </button>
          </div>
        ))
      )}

      <hr />

      <h3>Total Semua: Rp {total}</h3>
    </div>
  );
}

export default Cart;