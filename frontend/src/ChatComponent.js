import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './ChatComponent.css';

function ChatComponent({ patientId, doctorId, patientName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    socketRef.current = io('http://drjimmy-backend.onrender.com/ws/chat/');
    
    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to chat');
    });

    socketRef.current.on('chat_message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() && socketRef.current) {
      socketRef.current.emit('chat_message', {
        message: newMessage,
        sender_id: patientId,
        receiver_id: doctorId
      });
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>💬 Live Chat - {patientName}</h3>
        <span className={`status ${isConnected ? 'online' : 'offline'}`}>
          {isConnected ? '🟢 Online' : '🔴 Offline'}
        </span>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender_id === patientId ? 'sent' : 'received'}`}
          >
            <div className="message-content">{msg.message}</div>
            <div className="message-time">{msg.timestamp}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          disabled={!isConnected}
        />
        <button onClick={sendMessage} disabled={!isConnected}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatComponent;

