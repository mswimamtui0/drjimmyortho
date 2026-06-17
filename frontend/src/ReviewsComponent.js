import React, { useState, useEffect } from 'react';
import './ReviewsComponent.css';

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
      const response = await fetch('http://localhost:8000/api/reviews/');
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
      const response = await fetch('http://localhost:8000/api/reviews/submit/', {
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

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h2>⭐ Patient Reviews</h2>
        <div className="rating-summary">
          <div className="average-rating">
            <span className="rating-number">{averageRating}</span>
            <span className="rating-stars">{renderStars(Math.round(averageRating))}</span>
          </div>
          <span className="total-reviews">Based on {totalReviews} reviews</span>
        </div>
      </div>

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <span className="review-author">{review.patient}</span>
                <span className="review-rating">{renderStars(review.rating)}</span>
              </div>
              <p className="review-comment">{review.comment}</p>
              <span className="review-date">{review.created_at}</span>
            </div>
          ))
        )}
      </div>

      <div className="review-form">
        <h3>Write a Review</h3>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`star-btn ${star <= (hover || rating) ? 'active' : ''}`}
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
        />
        <button 
          onClick={submitReview} 
          disabled={submitting}
          className="submit-review-btn"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
}

export default ReviewsComponent;