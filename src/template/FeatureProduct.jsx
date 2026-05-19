import { Link } from "react-router-dom";

function FeatureProduct({ product, addToCart }) {
  return (
    <div className="col">
      <div className="card shadow-sm h-100">
        <img
          className="card-img-top bg-dark cover"
          height="240"
          alt={product.name}
          src="https://placehold.co/600x400?text=Product"
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-center">{product.name}</h5>
          <p className="card-text text-center text-muted">Rp {product.price.toLocaleString()}</p>
          <div className="d-grid gap-2 mt-auto">
            <button className="btn btn-outline-dark" onClick={() => addToCart(product)}>
              <FontAwesomeIcon icon={["fas", "cart-plus"]} /> Tambah ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureProduct;