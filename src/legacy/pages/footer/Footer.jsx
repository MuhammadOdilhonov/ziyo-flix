import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BsFacebook,
  BsTwitter,
  BsInstagram,
  BsYoutube,
  BsLinkedin
} from 'react-icons/bs';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const navigateToSection = (path) => {
    navigate(path);
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Logo and Description */}
        <div className="footer__brand">
          <button onClick={() => navigateToSection('/')} className="footer__logo-link">
            <img src="/Ziyo-Flix-Logo.png" alt="ZiyoFlix" />
            <span className="footer__logo-text">ZiyoFlix</span>
          </button>
          <p className="footer__description">
            MediaHub - bu video kontentlar, kinolar va darsliklar uchun platforma. Biz bilan birga qoling!
          </p>
        </div>

        {/* Navigation Links */}
        <div className="footer__nav">
          <h4 className="footer__section-title">Navigatsiya</h4>
          <ul className="footer__nav-list">
            <li><button onClick={() => navigateToSection('/reels')} className="footer__nav-link">Reels</button></li>
            <li><button onClick={() => navigateToSection('/movies')} className="footer__nav-link">Kinolar</button></li>
            <li><button onClick={() => navigateToSection('/tutorials')} className="footer__nav-link">Video Darslik</button></li>
            <li><button onClick={() => navigateToSection('/about')} className="footer__nav-link">Biz haqimizda</button></li>
            <li><button onClick={() => navigateToSection('/contact')} className="footer__nav-link">Bog'lanish</button></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer__social">
          <h4 className="footer__section-title">Ijtimoiy tarmoqlar</h4>
          <div className="footer__social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">
              <BsFacebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">
              <BsTwitter size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">
              <BsInstagram size={24} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">
              <BsYoutube size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">
              <BsLinkedin size={24} />
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="footer__contact">
          <h4 className="footer__section-title">Bog'lanish</h4>
          <p>Email: ziyoflix@gmail.com</p>
          <p>Telefon: +998 (99) 123-45-67</p>
          <p>Manzil: Toshkent, Uzbekistan</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer__bottom">
        <div className="footer__bottom-container">
          <p className="footer__copyright">&copy; {currentYear} MediaHub. Barcha huquqlar himoyalangan.</p>
          <div className="footer__legal">
            <button onClick={() => navigateToSection('/privacy')} className="footer__legal-link">Maxfiylik siyosati</button>
            <button onClick={() => navigateToSection('/terms')} className="footer__legal-link">Foydalanish shartlari</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;