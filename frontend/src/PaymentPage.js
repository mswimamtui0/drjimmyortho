import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from './apiConfig';

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
      const response = await fetch(`${API_URL}/payment/initiate/`, {
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
            ? ' Payment initiated! Check your phone for M-Pesa prompt and enter PIN.' 
            : ' Payment link generated! Check your email.' 
        });
        
        if (data.payment_link) {
          window.open(data.payment_link, '_blank');
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Payment failed. Please try again.' });
      }
    } catch (error) {
      console.error('Payment error:', error);
      setMessage({ type: 'error', text: 'Cannot connect to payment server.' });
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '40px',
      maxWidth: '550px',
      width: '100%',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    title: {
      color: '#1976d2',
      marginTop: 0,
      textAlign: 'center'
    },
    subtitle: {
      textAlign: 'center',
      color: '#666',
      marginBottom: '30px'
    },
    section: {
      marginBottom: '25px'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '10px'
    },
    purposeOptions: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '15px'
    },
    purposeBtn: {
      padding: '15px',
      border: '2px solid #ddd',
      background: 'white',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    purposeBtnActive: {
      borderColor: '#1976d2',
      background: '#e3f2fd'
    },
    purposeBtnHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    },
    methodOptions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    methodOption: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px',
      border: '2px solid #ddd',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    methodOptionActive: {
      borderColor: '#1976d2',
      background: '#e3f2fd'
    },
    phoneInput: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '16px'
    },
    hint: {
      fontSize: '12px',
      color: '#999',
      marginTop: '5px'
    },
    summary: {
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '10px',
      marginBottom: '20px'
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 0',
      borderBottom: '1px solid #eee'
    },
    summaryTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
      fontWeight: 'bold',
      fontSize: '1.1em',
      borderTop: '2px solid #1976d2'
    },
    payBtn: {
      width: '100%',
      background: '#4caf50',
      color: 'white',
      padding: '15px',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1.1em',
      cursor: 'pointer',
      transition: 'background 0.3s'
    },
    payBtnDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    message: {
      marginTop: '20px',
      padding: '15px',
      borderRadius: '8px'
    },
    messageSuccess: {
      backgroundColor: '#d4edda',
      color: '#155724',
      borderLeft: '4px solid #4caf50'
    },
    messageError: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderLeft: '4px solid #f44336'
    },
    securityInfo: {
      marginTop: '20px',
      textAlign: 'center',
      color: '#666',
      fontSize: '14px'
    },
    paymentLogos: {
      display: 'flex',
      gap: '15px',
      justifyContent: 'center',
      marginTop: '10px',
      flexWrap: 'wrap'
    },
    logo: {
      background: '#f5f5f5',
      padding: '5px 15px',
      borderRadius: '5px',
      fontSize: '12px'
    }
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}> Make a Payment</h1>
        <p style={styles.subtitle}>Secure payment for Dr. Jimmy Orthopedic services</p>

        {/* Payment Purpose */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Payment For</h3>
          <div style={styles.purposeOptions}>
            {Object.entries(paymentOptions).map(([key, opt]) => (
              <button 
                key={key}
                style={{
                  ...styles.purposeBtn,
                  ...(purpose === key ? styles.purposeBtnActive : {})
                }}
                onClick={() => { setPurpose(key); setAmount(opt.amount); }}
                onMouseEnter={(e) => {
                  if (purpose !== key) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (purpose !== key) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                 {opt.label}<br/>
                <small>TZS {opt.amount.toLocaleString()}</small>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Select Payment Method</h3>
          <div style={styles.methodOptions}>
            {['mpesa', 'airtel_money', 'tigo_pesa', 'card'].map((method) => (
              <label 
                key={method}
                style={{
                  ...styles.methodOption,
                  ...(paymentMethod === method ? styles.methodOptionActive : {})
                }}
                onClick={() => setPaymentMethod(method)}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  value={method} 
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                />
                <span>
                  {method === 'mpesa' && ' M-Pesa'}
                  {method === 'airtel_money' && ' Airtel Money'}
                  {method === 'tigo_pesa' && ' Tigo Pesa'}
                  {method === 'card' && ' Credit/Debit Card'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* M-Pesa Phone Number */}
        {paymentMethod === 'mpesa' && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>M-Pesa Phone Number</h3>
            <input 
              type="tel" 
              placeholder="e.g., 0712345678" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={styles.phoneInput}
            />
            <p style={styles.hint}>You will receive a prompt on this phone to enter your PIN</p>
          </div>
        )}

        {/* Amount Summary */}
        <div style={styles.summary}>
          <div style={styles.summaryRow}>
            <span>Service:</span>
            <strong>{paymentOptions[purpose].label}</strong>
          </div>
          <div style={styles.summaryRow}>
            <span>Amount:</span>
            <strong>TZS {amount.toLocaleString()}</strong>
          </div>
          <div style={styles.summaryTotal}>
            <span>Total:</span>
            <strong>TZS {amount.toLocaleString()}</strong>
          </div>
        </div>

        {/* Payment Button */}
        <button 
          style={{
            ...styles.payBtn,
            ...(loading ? styles.payBtnDisabled : {})
          }}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? 'Processing...' : `Pay TZS ${amount.toLocaleString()}`}
        </button>

        {/* Message */}
        {message && (
          <div style={{
            ...styles.message,
            ...(message.type === 'success' ? styles.messageSuccess : styles.messageError)
          }}>
            {message.text}
          </div>
        )}

        {/* Security Info */}
        <div style={styles.securityInfo}>
          <p> Secure payment powered by</p>
          <div style={styles.paymentLogos}>
            <span style={styles.logo}>Visa</span>
            <span style={styles.logo}>Mastercard</span>
            <span style={styles.logo}>M-Pesa</span>
            <span style={styles.logo}>Airtel Money</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;



