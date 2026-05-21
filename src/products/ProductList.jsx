import { useEffect, useState } from "react";
import Product from "./Product";

const API_URL = import.meta.env.VITE_API_URL || "https://toraja-backend.vercel.app";

function ProductList() {
  const [products, setProducts] = useState([]);

  // FETCH DATA DARI BACKEND
  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // ADD TO CART (sementara alert dulu)
  const addToCart = (product) => {
    console.log("Add to cart:", product);
    alert(product.name + " ditambahkan ke keranjang");
  };

  return (
    <div className="container">
      <h2>Products</h2>

      <div className="row">
        {products.map((product) => (
          <Product
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList;