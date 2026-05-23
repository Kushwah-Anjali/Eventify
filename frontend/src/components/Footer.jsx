import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaHome,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCode,
} from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer-wrap pt-5 pb-3">
      <Container>
        <Row className="gy-5 justify-content-between">

          {/* ── Brand ── */}
          <Col xs={12} md={4} className="text-center text-md-start">
            <h3 className="footer-brand">Eventify</h3>
            <p className="footer-tagline">
              Simplifying event management with innovation and seamless coordination.
            </p>
            <div className="footer-socials">
              {[
                { icon: FaFacebookF, color: "#1877F2", href: "#" },
                { icon: FaInstagram, color: "#E4405F", href: "#" },
                {
                  icon: FaLinkedinIn,
                  color: "#0A66C2",
                  href: "https://www.linkedin.com/in/anjali-kushwah-6384b5308/",
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-icon"
                    style={{ "--icon-color": item.color }}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </Col>

          {/* ── Quick Links ── */}
          <Col xs={12} sm={6} md={4} className="text-center text-md-start">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a
                  href="/"
                  className="footer-link-btn"
                  onClick={handleHomeClick}
                >
                  <FaHome className="footer-link-icon" />
                  Home
                </a>
              </li>
              <li>
                <Link to="/contact" className="footer-link-btn">
                  <FaEnvelope className="footer-link-icon" />
                  Contact
                </Link>
              </li>
            </ul>
          </Col>

          {/* ── Contact ── */}
          <Col xs={12} sm={6} md={4} className="text-center text-md-start">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-links">
              <li className="footer-contact-item">
                <FaEnvelope className="footer-link-icon flex-shrink-0" />
                <a
                  href="mailto:anjalikushwah8163@gmail.com"
                  className="footer-contact-text"
                >
                  anjalikushwah8163@gmail.com
                </a>
              </li>
              <li className="footer-contact-item">
                <FaPhone className="footer-link-icon flex-shrink-0" />
                <a
                  href="tel:+916398596448"
                  className="footer-contact-text"
                >
                  +91 6398596448
                </a>
              </li>
              <li className="footer-contact-item">
                <FaMapMarkerAlt className="footer-link-icon flex-shrink-0" />
                <span className="footer-contact-text">
                 St. John's College, Agra
                </span>
              </li>
            </ul>
          </Col>
        </Row>

        {/* ── Bottom Bar ── */}
        <div className="footer-bottom">
          <span>
            &copy; {new Date().getFullYear()} Eventify. Crafted with{" "}
            <FaCode className="mx-1" /> by <strong>Anjali Kushwah</strong>.
          </span>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;