import React, { useState, useRef, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 }); // Default left position
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const chatbotRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Tôi là trợ lý ảo của Trường Tiểu Học FPT. Tôi có thể giúp bạn với:",
      sender: 'bot',
      timestamp: new Date()
    },
    {
      id: 2,
      text: "• Thông tin về các dịch vụ y tế\n• Hướng dẫn sử dụng hệ thống\n• Câu hỏi về tiêm chủng\n• Thông tin liên hệ",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const quickResponses = [
    "Thông tin tiêm chủng",
    "Cách đăng ký khám sức khỏe",
    "Liên hệ y tá",
    "Hướng dẫn sử dụng"
  ];

  const botResponses = {
    "thông tin tiêm chủng": "Chương trình tiêm chủng của trường được thực hiện theo lịch của Bộ Y tế. Phụ huynh sẽ nhận thông báo qua hệ thống khi có lịch tiêm chủng cho con em mình.",
    "cách đăng ký khám sức khỏe": "Bạn có thể đăng ký khám sức khỏe định kỳ thông qua hệ thống hoặc liên hệ trực tiếp với phòng y tế của trường. Khám sức khỏe được thực hiện 2 lần/năm học.",
    "liên hệ y tá": "Phòng y tế trường: Phòng 101, Tòa nhà chính\nSĐT: 024-1234-5678\nEmail: yte@fptschool.edu.vn\nGiờ làm việc: 7:30 - 17:00 (Thứ 2 - Thứ 6)",
    "hướng dẫn sử dụng": "Hệ thống quản lý y tế có các chức năng chính:\n• Xem hồ sơ sức khỏe\n• Đăng ký khám bệnh\n• Theo dõi lịch tiêm chủng\n• Nhận thông báo y tế\n\nVui lòng đăng nhập để sử dụng đầy đủ các tính năng."
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Generate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(messageText);
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(botResponses)) {
      if (message.includes(key.toLowerCase())) {
        return response;
      }
    }

    // Default responses
    if (message.includes('xin chào') || message.includes('hello') || message.includes('hi')) {
      return "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?";
    }
    
    if (message.includes('cảm ơn') || message.includes('thank')) {
      return "Rất vui được giúp đỡ bạn! Nếu có thêm câu hỏi nào khác, đừng ngần ngại hỏi nhé.";
    }

    if (message.includes('tạm biệt') || message.includes('bye')) {
      return "Tạm biệt! Chúc bạn một ngày tốt lành. Hẹn gặp lại!";
    }

    return "Tôi hiểu bạn đang hỏi về \"" + userMessage + "\". Hiện tại tôi chưa có thông tin chi tiết về vấn đề này. Bạn có thể:\n\n• Liên hệ trực tiếp với phòng y tế: 024-1234-5678\n• Gửi email: yte@fptschool.edu.vn\n• Hoặc thử hỏi về các chủ đề khác mà tôi có thể hỗ trợ.";
  };

  const handleQuickResponse = (response) => {
    handleSendMessage(response);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Drag functionality
  const handleMouseDown = (e) => {
    if (isOpen) return; // Don't drag when chat is open
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleTouchStart = (e) => {
    if (isOpen) return; // Don't drag when chat is open
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Keep within viewport bounds
    const maxX = window.innerWidth - 60; // 60px is button width
    const maxY = window.innerHeight - 60; // 60px is button height
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    
    // Keep within viewport bounds
    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 60;
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Add global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragStart, position]);

  return (
    <div 
      className="chatbot-container"
      ref={chatbotRef}
      style={{
        left: `${position.x}px`,
        bottom: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : (isOpen ? 'default' : 'grab')
      }}
    >
      {/* Chat Button */}
      <button 
        className={`chat-button ${isOpen ? 'active' : ''} ${isDragging ? 'dragging' : ''}`}
        onClick={!isDragging ? toggleChat : undefined}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        aria-label="Open chat support"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <div className="lottie-container">
            <DotLottieReact
              src="https://lottie.host/f6c729ee-4c9e-4f76-bab7-633fca97a23a/1T0g0ujhdF.lottie"
              loop
              autoplay
              className="chat-lottie"
            />
          </div>
        )}
        {!isOpen && <div className="chat-notification-dot"></div>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="bot-avatar">🤖</div>
              <div>
                <h4>Trợ lý Y tế FPT</h4>
                <span className="status-online">Đang hoạt động</span>
              </div>
            </div>
            <button className="close-chat" onClick={toggleChat}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString('vi-VN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Responses */}
          <div className="quick-responses">
            {quickResponses.map((response, index) => (
              <button
                key={index}
                className="quick-response-btn"
                onClick={() => handleQuickResponse(response)}
              >
                {response}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="chat-input-container">
            <div className="chat-input-wrapper">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi của bạn..."
                className="chat-input"
                rows="1"
              />
              <button 
                className="send-button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
