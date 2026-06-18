import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { useAuth } from './AuthContext';
import logoImage from './assets/images/logo.png';

function HomePage() {
  const [language, setLanguage] = useState('sw');
  const { user, logout } = useAuth();
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScrolling(window.scrollY > 50);
    });
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const content = {
    sw: {
      nav: {
        home: 'Mwanzo',
        treatments: 'Huduma',
        upload: 'Pakia Scan',
        video: 'Ushauri wa Video',
        global: 'Huduma za Kimataifa',
        about: 'Kuhusu Daktari',
        payment: 'Malipo',
        dashboard: 'Dashibodi Yangu'
      },
      hero: {
        title: 'Dk. Jimmy – Daktari wa Kimataifa wa Upasuaji wa Mifupa na Uti wa Mgongo',
        subtitle: 'Ukarabati wa mifupa ya binadamu, upasuaji wa uti wa mgongo, na huduma za mbali kwa wagonjwa wasioweza kufika kliniki',
        button1: 'Pakia Scan Yako',
        button2: 'Weka Namba ya Video'
      },
      services: {
        title: 'Huduma Zetu za Kitaalam',
        subtitle: 'Huduma kamili ya mifupa na uti wa mgongo, inayopatikana duniani kote',
        spine: 'Upasuaji wa Uti wa Mgongo',
        ortho: 'Upasuaji wa Mifupa',
        tele: 'Huduma za Mbali (Telemedicine)'
      },
      footer: {
        contact: 'Wasiliana Nasi',
        phone: 'Simu / WhatsApp',
        hours: 'Saa za Kazi',
        hoursDetail: 'Jumatatu hadi Ijumaa, Saa 8 asubuhi – 5 usiku',
        emergency: 'Hii si huduma ya dharura. Kama una maumivu makali, nenda hospitali ya karibu.'
      }
    },
    en: {
      nav: {
        home: 'Home',
        treatments: 'Treatments',
        upload: 'Upload Scan',
        video: 'Video Consult',
        global: 'Global Outreach',
        about: 'About Dr. Jimmy',
        payment: 'Payments',
        dashboard: 'My Dashboard'
      },
      hero: {
        title: 'Dr. Jimmy – International Orthopedic & Spine Surgeon',
        subtitle: 'Bone repair, spine surgery, and telemedicine for patients who cannot travel to the clinic',
        button1: 'Upload Your Scan',
        button2: 'Book Video Meeting'
      },
      services: {
        title: 'Our Expert Services',
        subtitle: 'Comprehensive orthopedic and spine care, now accessible worldwide',
        spine: 'Spinal Cord Surgery',
        ortho: 'Orthopedic Bone Repair',
        tele: 'Telemedicine Services'
      },
      footer: {
        contact: 'Contact Us',
        phone: 'Phone / WhatsApp',
        hours: 'Working Hours',
        hoursDetail: 'Monday to Friday, 8am – 5pm',
        emergency: 'This is not an emergency service. If you have severe pain, go to your nearest hospital.'
      }
    }
  };

  const t = content[language];

  return (
    <div className="homepage">
      {/* Top Title Bar - LEFT ALIGNED with ORANGE BACKGROUND */}
<div className="top-title-bar">
  <div className="title-container">
    {/* Left side: Logo and Text */}
    <div className="title-left">
      <img src={logoImage} alt="Dr. Jimmy Logo" className="title-logo" onError={(e) => { e.target.style.display = 'none'; }} />
      <div className="title-text">
        <h1 className="main-title">DR. JIMMY</h1>
        <p className="sub-title">Spine & Orthopedic Institute</p>
      </div>
    </div>

    {/* Right side: Buttons */}
    <div className="title-right">
      <button className="lang-btn" onClick={() => setLanguage(language === 'sw' ? 'en' : 'sw')}>
        {language === 'sw' ? 'English' : 'Kiswahili'}
      </button>
      <a href="/login" className="title-login-btn">Login / Register</a>
      <a href="/doctor-login" className="title-doctor-btn">👨‍⚕️ Doctor</a>
    </div>
  </div>
</div>

      {/* Navigation Bar */}
      <nav className={`navbar ${scrolling ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <ul className="nav-links">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>{t.nav.home}</a></li>
            <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>{t.nav.treatments}</a></li>
            <li><a href="/global-outreach">🌍 {t.nav.global}</a></li>
            <li><a href="/about">👨‍⚕️ {t.nav.about}</a></li>
            <li><a href="/upload">📤 {t.nav.upload}</a></li>
            <li><a href="/video-consult">🎥 {t.nav.video}</a></li>
            <li><a href="/payment">💳 {t.nav.payment}</a></li>
            
          </ul>
          <div className="nav-actions">
            <button className="lang-btn" onClick={() => setLanguage(language === 'sw' ? 'en' : 'sw')}>
              {language === 'sw' ? 'English' : 'Kiswahili'}
            </button>
            
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'white' }}>👋 {user.first_name || user.username}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logou
                </button>
              </div>
            ) : (
              <a href="/login" className="login-nav-btn">
                Login / Register
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with IMAGE BACKGROUND */}
      <section id="home" className="hero-section">
        <div className="hero-image-background">
          <img 
            src="https://images.pexels.com/photos/2380794/pexels-photo-2380794.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop" 
            alt="Dr. Jimmy Orthopedic Center" 
            className="hero-image" 
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">{t.hero.title}</h1>
          <p className="hero-subtitle">{t.hero.subtitle}</p>
          <div className="hero-buttons">
            <a href="/upload" className="btn-primary">📤 {t.hero.button1}</a>
            <a href="/video-consult" className="btn-secondary">🎥 {t.hero.button2}</a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <h2 className="section-title">{t.services.title}</h2>
          <p className="section-subtitle">{t.services.subtitle}</p>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🩻</div>
              <h3>{t.services.spine}</h3>
              <p>Matibabu ya hernia ya diski, mgongo uliojiunika, uvimbe, na magonjwa mengine ya uti wa mgongo.</p>
              <a href="/upload" className="service-link">Learn More →</a>
            </div>
            <div className="service-card">
              <div className="service-icon">🦴</div>
              <h3>{t.services.ortho}</h3>
              <p>Kurekebisha mifupa iliyovunjika, uingizaji wa viungo bandia, na matibabu ya majeraha ya michezo.</p>
              <a href="/upload" className="service-link">Learn More →</a>
            </div>
            <div className="service-card">
              <div className="service-icon">📹</div>
              <h3>{t.services.tele}</h3>
              <p>Ushauri wa video kwa wagonjwa wa mbali ambao hawawezi kusafiri kwenda kwa daktari.</p>
              <a href="/video-consult" className="service-link">Learn More →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🏥 Dr. Jimmy Orthopedic & Spine Center</h3>
            <p>International Orthopedic & Spine Surgeon</p>
            <p>Daktari wa Kimataifa wa Upasuaji wa Mifupa na Uti wa Mgongo</p>
          </div>
          <div className="footer-section">
            <h3>📞 {t.footer.contact}</h3>
            <p><strong>Phone/Call:</strong> +255 787 688 659</p>
            <p><strong>WhatsApp:</strong> +255 787 688 659</p>
            <p><strong>Email:</strong> info@drjimmy.com</p>
            <p><strong>Location:</strong> Dar es Salaam, Tanzania</p>
          </div>
          <div className="footer-section">
            <h3>🕒 {t.footer.hours}</h3>
            <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
            <p>Saturday: 9:00 AM - 1:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
          <div className="footer-section">
            <h3>🔗 Quick Links</h3>
            <p><a href="/upload">📤 Upload Scan</a></p>
            <p><a href="/video-consult">🎥 Video Consultation</a></p>
            <p><a href="/payment">💳 Make Payment</a></p>
            <p><a href="/about">👨‍⚕️ About Dr. Jimmy</a></p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>🚨 {t.footer.emergency}</p>
          <p>© 2024 Dr. Jimmy Orthopedic & Spine Center. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;