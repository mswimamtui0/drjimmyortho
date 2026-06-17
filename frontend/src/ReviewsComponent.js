import React, { useState, useEffect } from 'react';
import API_URL from './apiConfig';

function ReviewsComponent() {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/reviews/`);
      const data = await response.json();
      setReviews(data.reviews || []);
      setAverageRating(data.average_rating || 0);
      setTotalReviews(data.total_reviews || 0);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const submitReview = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/reviews/submit/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: user.id,
          rating: rating,
          comment: comment
        })
      });
      
      const data = await response.json();
      if (data.success) {
        alert('✅ Thank you for your review!');
        setRating(0);
        setComment('');
        fetchReviews();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // Styles
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Segoe UI, sans-serif'
    },
    header: {
      textAlign: 'center',
      padding: '30px',
      background: 'linear-gradient(135deg, #1976d2, #0d47a1)',
      color: 'white',
      borderRadius: '15px',
      marginBottom: '30px'
    },
    headerTitle: {
      margin: '0 0 15px 0'
    },
    ratingSummary: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '5px'
    },
    averageRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    ratingNumber: {
      fontSize: '2.5em',
      fontWeight: 'bold'
    },
    ratingStars: {
      fontSize: '1.5em'
    },
    totalReviews: {
      fontSize: '0.9em',
      opacity: 0.9
    },
    reviewItem: {
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      marginBottom: '15px',
      borderLeft: '4px solid #1976d2'
    },
    reviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px'
    },
    reviewAuthor: {
      fontWeight: 'bold',
      color: '#333'
    },
    reviewRating: {
      fontSize: '1.2em'
    },
    reviewComment: {
      color: '#555',
      lineHeight: '1.6',
      margin: '10px 0'
    },
    reviewDate: {
      fontSize: '12px',
      color: '#999'
    },
    reviewForm: {
      background: '#f8f9fa',
      padding: '25px',
      borderRadius: '15px',
      marginTop: '30px'
    },
    formTitle: {
      margin: '0 0 15px 0',
      color: '#333'
    },
    starRating: {
      display: 'flex',
      gap: '5px',
      marginBottom: '15px'
    },
    starBtn: {
      background: 'none',
      border: 'none',
      fontSize: '2em',
      cursor: 'pointer',
      padding: '5px',
      transition: 'transform 0.2s'
    },
    starActive: {
      color: '#ffc107'
    },
    starInactive: {
      color: '#ddd'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontFamily: 'inherit',
      resize: 'vertical',
      minHeight: '100px',
      fontSize: '14px'
    },
    submitBtn: {
      marginTop: '15px',
      padding: '12px 40px',
      background: '#1976d2',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background 0.3s'
    },
    submitBtnDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>⭐ Patient Reviews</h2>
        <div style={styles.ratingSummary}>
          <div style={styles.averageRating}>
            <span style={styles.ratingNumber}>{averageRating}</span>
            <span style={styles.ratingStars}>{renderStars(Math.round(averageRating))}</span>
          </div>
          <span style={styles.totalReviews}>Based on {totalReviews} reviews</span>
        </div>
      </div>

      <div>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} style={styles.reviewItem}>
              <div style={styles.reviewHeader}>
                <span style={styles.reviewAuthor}>{review.patient}</span>
                <span style={styles.reviewRating}>{renderStars(review.rating)}</span>
              </div>
              <p style={styles.reviewComment}>{review.comment}</p>
              <span style={styles.reviewDate}>{review.created_at}</span>
            </div>
          ))
        )}
      </div>

      <div style={styles.reviewForm}>
        <h3 style={styles.formTitle}>Write a Review</h3>
        <div style={styles.starRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              style={{
                ...styles.starBtn,
                color: star <= (hover || rating) ? '#ffc107' : '#ddd'
              }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              ⭐
            </button>
          ))}
        </div>
        <textarea
          placeholder="Share your experience with Dr. Jimmy..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={styles.textarea}
        />
        <button 
          onClick={submitReview} 
          disabled={submitting}
          style={{
            ...styles.submitBtn,
            ...(submitting ? styles.submitBtnDisabled : {})
          }}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
}

export default ReviewsComponent;
