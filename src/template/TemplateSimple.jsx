function Template({ user, products, loading }) {
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Template Sederhana</h1>
      <p>User: {user?.name || "Belum login"}</p>
      <p>Jumlah produk: {products.length}</p>
    </div>
  );
}

export default Template;