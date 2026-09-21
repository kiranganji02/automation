import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaTrash, FaRobot, FaUser, FaQuestionCircle } from 'react-icons/fa';
import { chatbotResponses } from '../../data/sampleData';
import { toast } from 'react-toastify';

const Chatbot = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('ipc_chat_history');
    return saved ? JSON.parse(saved) : [{
      id: 1,
      text: "Hello! I'm your AI Placement Coach. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toISOString()
    }];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('ipc_chat_history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateResponse = (text) => {
    const lowerText = text.toLowerCase();
    let bestMatch = chatbotResponses?.find(resp => 
      resp.keywords.some(kw => lowerText.includes(kw.toLowerCase()))
    );

    if (!bestMatch) {
      if (lowerText.includes('hello') || lowerText.includes('hi')) return "Hello there! How can I assist you with your placement preparation today?";
      if (lowerText.includes('bye')) return "Goodbye! Keep practicing and best of luck!";
      return "I'm not sure I understand. Could you please rephrase your question or ask about DSA, Interviews, Resumes, or Career Guidance?";
    }

    return bestMatch.response;
  };

  const handleSend = (text = input) => {
    if (!text.trim()) return;

    const newUserMsg = {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateResponse(text),
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      text: "Chat cleared. How can I help you now?",
      sender: 'bot',
      timestamp: new Date().toISOString()
    }]);
    toast.success("Chat history cleared!");
  };

  const quickActions = ['DSA Help', 'Interview Tips', 'Resume Advice', 'Career Guidance'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6 max-w-5xl mx-auto h-[calc(100vh-80px)] flex flex-col"
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-500 flex items-center gap-2">
          <FaRobot /> AI Coach
        </h1>
        <button 
          onClick={clearChat}
          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <FaTrash /> <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg flex-1 overflow-hidden flex flex-col border border-gray-100">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[85%] md:max-w-[70%] flex flex-col">
                <div className={`
                  ${msg.sender === 'user' 
                    ? 'chat-bubble-user bg-primary-500 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-sm' 
                    : 'chat-bubble-bot bg-slate-100 text-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm'
                  }
                `}>
                  <div className="flex items-start gap-2">
                    {msg.sender === 'bot' && <FaRobot className="mt-1 flex-shrink-0 text-slate-500" />}
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                    {msg.sender === 'user' && <FaUser className="mt-1 flex-shrink-0 text-primary-200" />}
                  </div>
                </div>
                <span className={`text-[10px] text-gray-400 mt-1 px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-4 flex gap-1 items-center w-16 shadow-sm">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-slate-400 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-slate-400 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-slate-400 rounded-full" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-4 py-2 bg-slate-50 flex gap-2 overflow-x-auto border-t border-slate-100 scrollbar-hide">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(action)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm"
            >
              <FaQuestionCircle className="text-primary-400" /> {action}
            </button>
          ))}
        </div>

        <div className="p-3 md:p-4 bg-white border-t border-slate-100">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about placement..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed text-white rounded-xl px-5 py-3 flex items-center justify-center transition-colors shadow-sm"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Chatbot;
