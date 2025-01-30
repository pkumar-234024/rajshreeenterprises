import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import LoginModal from "../common/LoginModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAdminClick = () => {
    setShowLoginModal(true);
    setIsMenuOpen(false);
  };

  const handleLoginResult = (success) => {
    setShowLoginModal(false);
    if (success) {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo">
            <span className="logo-text">RajShree</span>
            <span className="logo-text-accent">Press</span>
          </Link>

          <div className="hamburger" onClick={toggleMenu}>
            <span className={`bar ${isMenuOpen ? "active" : ""}`}></span>
            <span className={`bar ${isMenuOpen ? "active" : ""}`}></span>
            <span className={`bar ${isMenuOpen ? "active" : ""}`}></span>
          </div>

          <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            <ul>
              <li>
                <Link to="/" onClick={toggleMenu}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" onClick={toggleMenu}>
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={toggleMenu}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={toggleMenu}>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
          <button
            onClick={handleAdminClick}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginLeft: "15px",
            }}
          >
            Admin Panel
          </button>
        </div>
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginResult}
      />
    </>
  );
};

export default Navbar;
