import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot } from "lucide-react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial bot message
  useEffect(() => {
    if (!hasInitialized) {
      const initialMessage = {
        id: Date.now(),
        text: "Hello! 👋 I'm your AI Assistant. I'm here to help you with any questions or tasks you might have. What would you like to talk about today?",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setTimeout(() => {
        setMessages([initialMessage]);
        setHasInitialized(true);
      }, 500);
    }
  }, [hasInitialized]);

  // Simulate bot response
  const simulateBotResponse = (userMessage) => {
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "I understand your question! Let me provide a comprehensive answer for you.",
        "That's a great point! Here's what I think about that topic.",
        "I can definitely help with that. Let me break it down step by step.",
        "Interesting question! Based on my knowledge, here's what I can tell you.",
        "I'm glad you asked! This is actually a fascinating topic to explore.",
        "Perfect! I have some insights that might be helpful for your situation.",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      const botMessage = {
        id: Date.now(),
        text: randomResponse,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Send message
  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    simulateBotResponse(inputMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 flex flex-col">
      
      {/* Chat Content */}
      <main 
        className="flex-1 pt-20 pb-24 overflow-y-auto"
        style={{ height: 'calc(100vh - 104px)' }} // Adjusted height
      >
        <div className="max-w-6xl mx-auto px-4 py-2"> {/* Reduced padding */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-3 flex ${message.sender === "user" ? "justify-end" : "justify-start"} message-appear`}
            >
              <div
                className={`max-w-[80%] flex items-start gap-3 ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
               <div
  className={`w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 shadow-lg overflow-hidden`}
>
  {message.sender === "user" ? (
    <User size={18} className="text-white" />
  ) : (
    <img
      src="/kapImg.svg"
      alt="Bot Avatar"
      className="w-full h-full object-cover"
    />
  )}
</div>

                <div
                  className={`relative ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                      : "bg-gradient-to-r from-slate-700 to-slate-800"
                  } text-white p-3 rounded-2xl shadow-xl backdrop-blur-md border border-slate-600/30`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.text}
                  </p>
                  <div
                    className={`text-xs mt-1 opacity-70 ${
                      message.sender === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {message.timestamp}
                  </div>
                </div>
              </div>
            </div>
          ))}
{isTyping && (
  <div className="flex justify-start mb-3">
    <div className="max-w-[80%] flex items-center gap-3">
      <div className="w-10 h-10 rounded-full shadow-lg overflow-hidden">
        <img
          src="/kapImg.svg"
          alt="Bot Avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-4 rounded-2xl shadow-xl backdrop-blur-md border border-slate-600/30">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
      </div>
    </div>
  </div>
)}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <div className="fixed bottom-0 left-0 sm:left-16 w-full sm:w-[calc(100%-4rem)] z-30 bg-slate-800/90 backdrop-blur-md border-t border-slate-700/50 shadow-lg h-24">
        <div className="px-4 py-3 h-full flex items-center">
          <div className="max-w-6xl mx-auto w-full">
            <div className="relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your message to the AI system..."
                className="w-full px-4 py-3 pr-14 bg-slate-700/50 backdrop-blur-md border border-slate-600/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[50px] max-h-32 text-white placeholder-slate-400 shadow-lg"
                rows="1"
              />
              <button
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === "" || isTyping}
                className="absolute right-2 top-2 p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 shadow-md"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes message-appear {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .message-appear {
          animation: message-appear 0.3s ease-out;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.3);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.4);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.6);
        }
      `}</style>
    </div>
  );
};

export default Chat;