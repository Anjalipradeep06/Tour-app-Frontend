import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";

import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}

        <div className="footer-section">

          <h2>MERIDIAN</h2>

          <p className="footer-tag">
            EST. ITINERARY 001
          </p>

          <p>
            Curating unforgettable journeys,
            luxury escapes, and authentic
            travel experiences across the
            world.
          </p>

        </div>

        {/* Explore */}

        <div className="footer-section">

          <h3>Explore</h3>

          <Link to="/">Home</Link>

          <Link to="/search">
            Tours
          </Link>

          <Link to="/profile">
            Profile
          </Link>

          <Link to="/login">
            Login
          </Link>

        </div>

        {/* Contact */}

        <div className="footer-section">

          <h3>Contact</h3>

          <p>
            <FaMapMarkerAlt />
            New York, USA
          </p>

          <p>
            <FaEnvelope />
            support@meridian.com
          </p>

        </div>

        {/* Social */}

        <div className="footer-section">

          <h3>Follow Us</h3>

          <div className="social-icons">

            <a href="https://maps.google.com/">
              <FaFacebookF />
            </a>

            <a href="https://maps.google.com/">
              <FaInstagram />
            </a>

            <a href="https://maps.google.com/">
              <FaTwitter />
            </a>

          </div>

        </div>

      </div>

      <div className="footer-bottom">

        © {new Date().getFullYear()} Meridian.
        Crafted for unforgettable journeys.

      </div>

    </footer>
  );
};

export default Footer;