import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Contact</h4>
          <p>raisingh862@gmail.com | +91 9415886175</p>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#" target="_blank" rel="noopener noreferrer">
              FB
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              TW
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              IN
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Your Company</p>
      </div>
    </footer>
  );
};

export default Footer;
