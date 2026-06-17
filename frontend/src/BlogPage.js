import API_URL from './apiConfig';
import React, { useState, useEffect } from 'react';
import './BlogPage.css';

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/blog/posts/`);
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostDetail = async (slug) => {
    try {
      const response = await fetch(`http://drjimmy-backend.onrender.com/api/blog/post/${slug}/`);
      const data = await response.json();
      setSelectedPost(data.post);
      setComments(data.post.comments || []);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const handleComment = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please login to comment');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/blog/comment/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: selectedPost.id,
          author_id: user.id,
          content: newComment
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setComments([...comments, data.comment]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  if (loading) return <div className="blog-loading">Loading...</div>;

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>📝 Dr. Jimmy's Medical Blog</h1>
        <p>Expert insights on spine health, orthopedic care, and medical innovations</p>
      </div>

      {selectedPost ? (
        <div className="blog-post-detail">
          <button onClick={() => setSelectedPost(null)} className="back-btn">
            ← Back to all posts
          </button>
          
          <h1>{selectedPost.title}</h1>
          <div className="post-meta">
            <span>👨‍⚕️ {selectedPost.author}</span>
            <span>📅 {selectedPost.published_at}</span>
            <span>👁️ {selectedPost.views} views</span>
            <span>🏷️ {selectedPost.tags?.join(', ')}</span>
          </div>
          
          {selectedPost.featured_image && (
            <img 
              src={selectedPost.featured_image} 
              alt={selectedPost.title} 
              className="post-image"
            />
          )}
          
          <div className="post-content">{selectedPost.content}</div>
          
          <div className="comments-section">
            <h3>💬 Comments ({comments.length})</h3>
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <strong>{comment.author}</strong>
                <p>{comment.content}</p>
                <small>{comment.created_at}</small>
              </div>
            ))}
            
            <div className="comment-form">
              <textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={handleComment}>Post Comment</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="blog-grid">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className="blog-card"
              onClick={() => fetchPostDetail(post.slug)}
            >
              {post.featured_image && (
                <img src={post.featured_image} alt={post.title} className="blog-card-image" />
              )}
              <div className="blog-card-content">
                <h3>{post.title}</h3>
                <p>{post.excerpt || post.content.substring(0, 150)}...</p>
                <div className="blog-card-meta">
                  <span>📅 {post.published_at}</span>
                  <span>👁️ {post.views}</span>
                  <span>💬 {post.comment_count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogPage;

