import React from 'react';
import './GlobalOutreach.css';

function GlobalOutreach() {
  const programs = [
    {
      country: 'Tanzania',
      flag: '🇹🇿',
      title: 'Mobile Spine Clinic',
      description: 'Bringing spine care to remote villages in Mbeya, Arusha, and Mwanza regions.',
      impact: '500+ patients treated',
      image: '🏥'
    },
    {
      country: 'Kenya',
      flag: '🇰🇪',
      title: 'Orthopedic Training Program',
      description: 'Training local surgeons in minimally invasive spine techniques.',
      impact: '15 surgeons trained',
      image: '📚'
    },
    {
      country: 'Uganda',
      flag: '🇺🇬',
      title: 'Spinal Deformity Campaign',
      description: 'Free scoliosis surgery for children in need.',
      impact: '50+ children helped',
      image: '👶'
    },
    {
      country: 'Rwanda',
      flag: '🇷🇼',
      title: 'Telemedicine Expansion',
      description: 'Setting up video consultation hubs in rural health centers.',
      impact: '20 centers established',
      image: '📡'
    }
  ];

  const initiatives = [
    {
      icon: '🎓',
      title: 'Scholarship Program',
      desc: 'Sponsoring East African medical students specializing in orthopedics'
    },
    {
      icon: '🔬',
      title: 'Research Grants',
      desc: 'Funding research on spine conditions prevalent in East Africa'
    },
    {
      icon: '🏗️',
      title: 'Infrastructure Support',
      desc: 'Equipping local hospitals with spine surgery equipment'
    },
    {
      icon: '🤝',
      title: 'Community Outreach',
      desc: 'Free spine health screenings and awareness campaigns'
    }
  ];

  return (
    <div className="outreach-container">
      {/* Hero Section */}
      <div className="outreach-hero">
        <div className="outreach-hero-content">
          <h1>🌍 Global Outreach Program</h1>
          <p>Bringing world-class spine care to underserved communities across East Africa and beyond</p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="mission-section">
        <div className="container">
          <h2>Our Mission</h2>
          <p>To provide life-changing spine treatments, share advanced surgical techniques, and build sustainable orthopedic care capacity in regions where access is limited.</p>
          <div className="mission-stats">
            <div className="stat">
              <div className="stat-number">10+</div>
              <div className="stat-label">Countries Served</div>
            </div>
            <div className="stat">
              <div className="stat-number">2,500+</div>
              <div className="stat-label">Patients Treated</div>
            </div>
            <div className="stat">
              <div className="stat-number">50+</div>
              <div className="stat-label">Surgeons Trained</div>
            </div>
            <div className="stat">
              <div className="stat-number">100+</div>
              <div className="stat-label">Free Surgeries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="programs-section">
        <div className="container">
          <h2>Active Programs</h2>
          <div className="programs-grid">
            {programs.map((program, index) => (
              <div key={index} className="program-card">
                <div className="program-flag">{program.flag}</div>
                <div className="program-icon">{program.image}</div>
                <h3>{program.title}</h3>
                <p className="program-country">{program.country}</p>
                <p className="program-desc">{program.description}</p>
                <div className="program-impact">
                  <strong>Impact:</strong> {program.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Initiatives */}
      <div className="initiatives-section">
        <div className="container">
          <h2>Key Initiatives</h2>
          <div className="initiatives-grid">
            {initiatives.map((initiative, index) => (
              <div key={index} className="initiative-card">
                <div className="initiative-icon">{initiative.icon}</div>
                <h3>{initiative.title}</h3>
                <p>{initiative.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="outreach-cta">
        <div className="container">
          <h2>Support Our Mission</h2>
          <p>Your donation helps us provide free spine surgeries to those who cannot afford them.</p>
          <button className="donate-btn">Donate Now</button>
        </div>
      </div>
    </div>
  );
}

export default GlobalOutreach;

