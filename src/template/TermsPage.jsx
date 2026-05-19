// frontend/src/template/TermsPage.jsx
import { useState, useEffect } from "react";
import ScrollToTopOnMount from "./ScrollToTopOnMount";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function TermsPage() {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agreedTerms, setAgreedTerms] = useState([]);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/terms");
        const data = await res.json();
        setTerms(data);
        
        const saved = localStorage.getItem("agreedTerms");
        if (saved) setAgreedTerms(JSON.parse(saved));
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  const handleAgree = async (termId) => {
    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch(`http://localhost:5000/api/terms/${termId}/agree`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ termId }),
      });

      if (res.ok) {
        const updated = [...agreedTerms, termId];
        setAgreedTerms(updated);
        localStorage.setItem("agreedTerms", JSON.stringify(updated));
        alert("✅ Syarat berhasil disetujui!");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Gagal menyetujui syarat");
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTopOnMount />
      
      {/* Breadcrumb */}
      <div className="container mt-5 pt-3">
        <nav aria-label="breadcrumb" className="bg-custom-light rounded">
          <ol className="breadcrumb p-3 mb-0">
            <li className="breadcrumb-item">
              <a href="#" onClick={() => window.history.back()} className="text-decoration-none link-secondary">
                Back
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Syarat & Ketentuan
            </li>
          </ol>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="d-flex flex-column bg-white py-4">
        <h1 className="text-center mb-3">Syarat & Ketentuan</h1>
        <p className="text-center px-5 text-muted">TGSKU</p>
        <div className="d-flex justify-content-center">
          <div className="border-bottom w-25"></div>
        </div>
      </div>

      {/* Terms Cards */}
      <div className="container pb-5 px-lg-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 px-md-5">
          {terms.map((term, index) => (
            <div key={term.id} className="col">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title text-dark">
                      {index + 1}. {term.title}
                    </h5>
                    <span className="badge bg-dark">v{term.version}</span>
                  </div>
                  
                  <p className="card-text text-muted" style={{ minHeight: "120px" }}>
                    {term.content}
                  </p>
                  
                  {agreedTerms.includes(term.id) ? (
                    <div className="alert alert-success mt-3 mb-0 py-2 text-center">
                      ✅ Telah disetujui
                    </div>
                  ) : (
                    <div className="d-grid gap-2 mt-3">
                      <button 
                        className="btn btn-outline-dark"
                        onClick={() => handleAgree(term.id)}
                      >
                        Saya Setuju
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      {terms.length > 0 && (
        <div className="d-flex flex-column bg-white py-4">
          <h5 className="text-center mb-3">Progress Persetujuan</h5>
          <div className="container">
            <div className="progress" style={{ height: "10px" }}>
              <div 
                className="progress-bar bg-dark" 
                style={{ width: `${(agreedTerms.length / terms.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-center text-muted mt-2 mb-0">
              {agreedTerms.length} dari {terms.length} syarat telah disetujui
            </p>
          </div>
        </div>
      )}

      {/* Follow us section */}
      <div className="d-flex flex-column bg-white py-4">
        <h5 className="text-center mb-3">Follow us on</h5>
        <div className="d-flex justify-content-center">
          <a href="#!" className="me-3">
            <FontAwesomeIcon icon={["fab", "facebook"]} size="2x" />
          </a>
          <a href="#!">
            <FontAwesomeIcon icon={["fab", "instagram"]} size="2x" />
          </a>
          <a href="#!" className="ms-3">
            <FontAwesomeIcon icon={["fab", "twitter"]} size="2x" />
          </a>
        </div>
      </div>
    </>
  );
}

export default TermsPage;