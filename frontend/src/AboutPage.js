import React from 'react';
import './AboutPage.css';

function AboutPage() {
  const credentials = [
    { year: '2008', degree: 'MD - Doctor of Medicine', institution: 'University of Dar es Salaam' },
    { year: '2014', degree: 'Residency in Orthopedic Surgery', institution: 'Muhimbili Orthopedic Institute' },
    { year: '2018', degree: 'Fellowship in Spine Surgery', institution: 'Johns Hopkins Hospital, USA' },
    { year: '2020', degree: 'Minimally Invasive Spine Surgery', institution: 'University of Toronto, Canada' }
  ];

  const publications = [
    'Advances in Spinal Deformity Correction in East Africa (2023)',
    'Telemedicine for Spine Care: A Tanzanian Experience (2022)',
    'Minimally Invasive Spine Surgery in Resource-Limited Settings (2021)'
  ];

  const memberships = [
    'East African Spine Society (EASS)',
    'World Federation of Neurosurgical Societies (WFNS)',
    'International Society for the Advancement of Spine Surgery (ISASS)',
    'Tanzania Orthopedic Association (TOA)'
  ];

  return (
    <div className="about-container">
      {/* Hero */}
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>‍ About Dr. Jimmy</h1>
          <p>International Orthopedic & Spine Surgeon</p>
        </div>
      </div>

      <div className="about-content">
        <div className="container">
          {/* Bio Section */}
          <div className="bio-section">
            <div className="bio-image">
              <div className="placeholder-image">‍</div>
            </div>
            <div className="bio-text">
              <h2>Dr. Jimmy Mswima</h2>
              <p className="title">MBChB, MMed (Ortho), Spine Fellowship</p>
              <p>Dr. Jimmy is a board-certified orthopedic and spine surgeon with over 15 years of experience. He completed his spine surgery fellowship at Johns Hopkins Hospital and has performed over 2,000 successful spine surgeries.</p>
              <p>His mission is to bring world-class spine care to East Africa and beyond, specializing in minimally invasive techniques that reduce recovery time and improve outcomes.</p>
              <p>Dr. Jimmy is fluent in English, Swahili, and French, making him accessible to patients from across Africa and internationally.</p>
            </div>
          </div>

          {/* Credentials */}
          <div className="credentials-section">
            <h2>Education & Training</h2>
            <div className="timeline">
              {credentials.map((cred, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-year">{cred.year}</div>
                  <div className="timeline-content">
                    <h3>{cred.degree}</h3>
                    <p>{cred.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Publications */}
          <div className="publications-section">
            <h2> Selected Publications</h2>
            <ul>
              {publications.map((pub, index) => (
                <li key={index}>{pub}</li>
              ))}
            </ul>
          </div>

          {/* Memberships */}
          <div className="memberships-section">
            <h2> Professional Memberships</h2>
            <div className="memberships-grid">
              {memberships.map((membership, index) => (
                <div key={index} className="membership-card">
                  {membership}
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="languages-section">
            <h2> Languages</h2>
            <div className="languages">
              <span> English (Fluent)</span>
              <span> Swahili (Native)</span>
              <span> French (Conversational)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;




