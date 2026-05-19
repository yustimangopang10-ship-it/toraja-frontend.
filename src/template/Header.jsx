import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

function Header({ user, logout, cartCount, onNavigate, onCartClick }) {
  const [openedDrawer, setOpenedDrawer] = useState(false);

  return (
    <header>
      <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand" href="#" onClick={() => onNavigate("home")}>
            <FontAwesomeIcon icon={["fab", "bootstrap"]} className="ms-1" size="lg" />
            <span className="ms-2 h5">TGSKU</span>
          </a>

          <button className="navbar-toggler" type="button" onClick={() => setOpenedDrawer(!openedDrawer)}>
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${openedDrawer ? "show" : ""}`}>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={() => onNavigate("home")}>Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={() => onNavigate("terms")}>Syarat & Ketentuan</a>
              </li>
            </ul>
            
            <button className="btn btn-outline-dark me-2" onClick={onCartClick}>
              <FontAwesomeIcon icon={["fas", "shopping-cart"]} />
              <span className="ms-2 badge rounded-pill bg-dark">{cartCount}</span>
            </button>
            
            <div className="dropdown d-inline-block">
              <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <FontAwesomeIcon icon={["fas", "user-alt"]} className="me-1" />
                {user?.name}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;