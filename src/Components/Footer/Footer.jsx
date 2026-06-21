import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            MERIDIAN
          </Link>

          <p className="footer-description">
            Discover curated tours, immersive experiences, and unforgettable
            adventures across the world's most iconic destinations.
          </p>

          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Explore</h3>

          <Link to="/">Home</Link>
          <Link to="/search">Tours</Link>
          <Link to="/bookings">My Bookings</Link>
          <Link to="/profile">Profile</Link>
        </div>

        <div className="footer-links">
          <h3>Popular Destinations</h3>

          <Link to="/search?destination=dubai">Dubai</Link>
          <Link to="/search?destination=switzerland">
            Switzerland
          </Link>
          <Link to="/search?destination=japan">Japan</Link>
          <Link to="/search?destination=maldives">
            Maldives
          </Link>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>

          <p>
            <FaMapMarkerAlt />
            New York, USA
          </p>

          <p>
            <FaEnvelope />
            support@meridian.com
          </p>

          <p>
            <FaPhoneAlt />
            +1 (800) 555-0148
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Meridian. All rights reserved.
        </p>

        <div className="footer-bottom-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;