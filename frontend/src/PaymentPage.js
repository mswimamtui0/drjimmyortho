import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentPage.css';

function PaymentPage() {
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState(50000);
  const [purpose, setPurpose] = useState('consultation');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const paymentOptions = {
    consultation: { amount: 50000, label: 'Video Consultation', currency: 'TZS' },
    followup: { amount: 30000, label: 'Follow-up Consultation', currency: 'TZS' },
    scan_review: { amount: 25000, label: 'Scan Review Only', currency: 'TZS' }
  };

  const handlePayment = async () => {
    if (paymentMethod === 'mpesa' && !phoneNumber) {
      setMessage({ type: 'error', text: 'Please enter your M-Pesa phone number' });
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8000/api/payment/initiate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_method: paymentMethod,
          phone_number: phoneNumber,
          amount: amount,
          purpose: purpose,
          user_id: user?.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: paymentMethod === 'mpesa' 
            ? '✅ Payment initiated! Check your phone for M-Pesa prompt and enter PIN.' 
            : '✅ Payment link generated! Check your email.' 
        });
        
        if (data.payment_link) {
          window.open(data.payment_link, '_blank');
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Payment failed. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Cannot connect to payment server.' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h1>💳 Make a Payment</h1>
        <p>Secure payment for Dr. Jimmy Orthopedic services</p>

        {/* Payment Purpose */}
        <div className="payment-section">
          <h3>Payment For</h3>
          <div className="purpose-options">
            <button 
              className={`purpose-btn ${purpose === 'consultation' ? 'active' : ''}`}
              onClick={() => { setPurpose('consultation'); setAmount(paymentOptions.consultation.amount); }}
            >
              🎥 Video Consultation<br/>
              <small>TZS 50,000</small>
            </button>
            <button 
              className={`purpose-btn ${purpose === 'followup' ? 'active' : ''}`}
              onClick={() => { setPurpose('followup'); setAmount(paymentOptions.followup.amount); }}
            >
              📝 Follow-up<br/>
              <small>TZS 30,000</small>
            </button>
            <button 
              className={`purpose-btn ${purpose === 'scan_review' ? 'active' : ''}`}
              onClick={() => { setPurpose('scan_review'); setAmount(paymentOptions.scan_review.amount); }}
            >
              🩻 Scan Review<br/>
              <small>TZS 25,000</small>
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="payment-section">
          <h3>Select Payment Method</h3>
          <div className="method-options">
            <label className="method-option">
              <input 
                type="radio" 
                name="payment" 
                value="mpesa" 
                checked={paymentMethod === 'mpesa'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>📱 M-Pesa</span>
            </label>
            <label className="method-option">
              <input 
                type="radio" 
                name="payment" 
                value="airtel_money" 
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>📱 Airtel Money</span>
            </label>
            <label className="method-option">
              <input 
                type="radio" 
                name="payment" 
                value="tigo_pesa" 
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>📱 Tigo Pesa</span>
            </label>
            <label className="method-option">
              <input 
                type="radio" 
                name="payment" 
                value="card" 
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>💳 Credit/Debit Card</span>
            </label>
          </div>
        </div>

        {/* M-Pesa Phone Number */}
        {paymentMethod === 'mpesa' && (
          <div className="payment-section">
            <h3>M-Pesa Phone Number</h3>
            <input 
              type="tel" 
              placeholder="e.g., 0712345678" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="phone-input"
            />
            <p className="hint">You will receive a prompt on this phone to enter your PIN</p>
          </div>
        )}

        {/* Amount Summary */}
        <div className="payment-summary">
          <div className="summary-row">
            <span>Service:</span>
            <strong>{paymentOptions[purpose].label}</strong>
          </div>
          <div className="summary-row">
            <span>Amount:</span>
            <strong>TZS {amount.toLocaleString()}</strong>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <strong>TZS {amount.toLocaleString()}</strong>
          </div>
        </div>

        {/* Payment Button */}
        <button 
          className="pay-btn"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? 'Processing...' : `Pay TZS ${amount.toLocaleString()}`}
        </button>

        {/* Message */}
        {message && (
          <div className={`payment-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Security Info */}
        <div className="security-info">
          <p>🔒 Secure payment powered by</p>
          <div className="payment-logos">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>M-Pesa</span>
            <span>Airtel Money</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;