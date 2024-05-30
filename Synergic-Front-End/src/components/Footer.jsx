import React from "react";
import "../style/components-style/Footer.css"; // assuming you have a separate CSS file for styling
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="custom-footer">
      <div className="social-media">
        <div className="social-media-left">
          <span>Get connected with us on social networks:</span>
        </div>
        <div className="social-media-right">
          <a href="#" className="social-link">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="social-link">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="social-link">
            <i className="fab fa-google"></i>
          </a>
          <a href="#" className="social-link">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="social-link">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="#" className="social-link">
            <i className="fab fa-github"></i>
          </a>
        </div>
      </div>
      <div className="footer-links">
        <div className="footer-links-container">
          <div className="footer-links-column">
            <h6 className="footer-links-title">SYNERGIC.</h6>
            <p style={{ maxWidth: "400px" }}>
              Welcome to Synergic!Discover a world of possibilities with
              Synergic, where you can explore and access a diverse range of
              services offered by our vibrant community. Whether you're looking
              to learn something new, find professional help, or offer your own
              expertise
            </p>
          </div>

          <div className="footer-links-column">
            <h6 className="footer-links-title">Useful links</h6>
            <p>
              <Link to="/myprofile" className="footer-link">
                Your Account
              </Link>
            </p>
            <p>
              <Link to="/explore" className="footer-link">
                Expolre
              </Link>
            </p>
            <p>
              <Link to="/chats" className="footer-link">
                Chats
              </Link>
            </p>
          </div>
          <div className="footer-links-column">
            <h6 className="footer-links-title">Contact</h6>
            <p>
              <i className="fas fa-home mr-3"></i> New York, NY 10012, US
            </p>
            <p>
              <i className="fas fa-envelope mr-3"></i> info@example.com
            </p>
            <p>
              <i className="fas fa-phone mr-3"></i> + 01 234 567 88
            </p>
            <p>
              <i className="fas fa-print mr-3"></i> + 01 234 567 89
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
