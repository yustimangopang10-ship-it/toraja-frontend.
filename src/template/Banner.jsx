function Banner() {
  return (
    <div id="bannerIndicators" className="carousel slide" data-bs-ride="carousel" style={{ marginTop: "56px" }}>
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#bannerIndicators" data-bs-slide-to="0" className="active"></button>
        <button type="button" data-bs-target="#bannerIndicators" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#bannerIndicators" data-bs-slide-to="2"></button>
      </div>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <div className="ratio" style={{ "--bs-aspect-ratio": "50%", maxHeight: "460px" }}>
            <img src="https://placehold.co/1920x600?text=Banner+1" className="d-block w-100 h-100 bg-dark cover" alt="banner" />
          </div>
        </div>
        <div className="carousel-item">
          <div className="ratio" style={{ "--bs-aspect-ratio": "50%", maxHeight: "460px" }}>
            <img src="https://placehold.co/1920x600?text=Banner+2" className="d-block w-100 h-100 bg-dark cover" alt="banner" />
          </div>
        </div>
        <div className="carousel-item">
          <div className="ratio" style={{ "--bs-aspect-ratio": "50%", maxHeight: "460px" }}>
            <img src="https://placehold.co/1920x600?text=Banner+3" className="d-block w-100 h-100 bg-dark cover" alt="banner" />
          </div>
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#bannerIndicators" data-bs-slide="prev">
        <span className="carousel-control-prev-icon"></span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#bannerIndicators" data-bs-slide="next">
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  );
}

export default Banner;