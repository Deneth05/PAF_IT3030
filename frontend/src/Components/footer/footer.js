import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-heading">LearnX</h3>
            <p className="footer-text">
              Connect, learn, and grow with our community of passionate learners and experts.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/browse" className="footer-link">Browse Skills</Link></li>
              <li><Link to="/teach" className="footer-link">Teach on SkillShare</Link></li>
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-links">
              <li><Link to="/help" className="footer-link">Help Center</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
              <li><Link to="/community" className="footer-link">Community Guidelines</Link></li>
              <li><Link to="/faq" className="footer-link">FAQs</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Contact Us</h3>
            <ul className="contact-info">
              <li className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Learning St, Knowledge City</span>
              </li>
              <li className="contact-item">
                <i className="fas fa-phone"></i>
                <span>+1 (123) 456-7890</span>
              </li>
              <li className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>support@learnXapp.com</span>
              </li>
              <li className="contact-item">
                <i className="fas fa-clock"></i>
                <span>Mon-Fri: 9AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} LearnX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;