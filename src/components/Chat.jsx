import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Sparkles, MessageCircle } from "lucide-react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);

  const scrollToBottom = () => {
    // Use setTimeout to ensure scroll happens after DOM update
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      }, 1000);
    }
  }, [hasInitialized]);

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
    }, 2000);
  };

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
    setHasUserSentMessage(true);
    simulateBotResponse(inputMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 flex flex-col relative overflow-hidden ">
      {/* 3D Background Panels */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-40 h-40 bg-gradient-to-br from-slate-600/20 to-slate-900/30 border border-slate-500/30 rounded-xl backdrop-blur-sm rotate3d shadow-3xl"
            style={{
              top: `${10 + i * 12}%`,
              left: `${i % 2 === 0 ? 10 + i * 10 : 70 - i * 8}%`,
              animationDelay: `${i * 0.5}s`,
              transform: `rotateX(45deg) rotateY(${i * 15}deg)`,
            }}
          />
        ))}

        {/* Optional rotating wireframe */}
        <svg className="absolute inset-0 w-full h-full opacity-5 animate-spin-slow">
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            stroke="cyan"
            strokeWidth="0.3"
            fill="none"
          />
          <line
            x1="0%"
            y1="50%"
            x2="100%"
            y2="50%"
            stroke="cyan"
            strokeWidth="0.2"
          />
          <line
            x1="50%"
            y1="0%"
            x2="50%"
            y2="100%"
            stroke="cyan"
            strokeWidth="0.2"
          />
        </svg>
      </div>

      {/* Fixed Chat Header */}
      <header className="fixed top-0 left-0 sm:left-16 w-full sm:w-[calc(100%-4rem)] z-30 bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50 shadow-lg">
        <div className="px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">
                  AI Assistant Dashboard
                </h1>
                <p className="text-sm text-slate-300">
                  Intelligent Conversation Interface
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-300">Online</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-300">AI Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Content - Properly spaced between fixed header and input */}
      <main className="flex-1 flex flex-col relative z-10 pt-20 pb-24">
        {!hasUserSentMessage ? (
          <>
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-6 mx-auto animate-pulse-slow shadow-2xl">
                  <MessageCircle size={40} className="text-white" />
                </div>
                <h2 className="text-5xl font-light text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text ">
                  AI Assistant Dashboard
                </h2>
                <p className="text-xl text-slate-300 max-w-md mx-auto">
                  Hello! 👋 I'm your AI Assistant. I'm here to help you with any
                  questions or tasks you might have. What would you like to talk
                  about today?
                </p>
              </div>
            </div>
            {/* Show the initial bot message in chat area */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-6xl mx-auto px-4 py-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-6 flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    } message-appear`}
                  >
                    <div
                      className={`max-w-[70%] flex items-start gap-4 ${
                        message.sender === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0 shadow-lg ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                            : "bg-gradient-to-r from-blue-500 to-purple-600"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <User size={20} className="text-white" />
                        ) : (
                          <Bot size={20} className="text-white" />
                        )}
                      </div>
                      <div
                        className={`relative ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                            : "bg-gradient-to-r from-slate-700 to-slate-800"
                        } text-white p-4 rounded-2xl shadow-xl backdrop-blur-md border border-slate-600/30 message-bubble`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.text}
                        </p>
                        <div
                          className={`text-xs mt-2 opacity-70 ${
                            message.sender === "user"
                              ? "text-right"
                              : "text-left"
                          }`}
                        >
                          {message.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start mb-6 message-appear">
                    <div className="max-w-[70%] flex items-center gap-4 flex-row">
                      <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
                        <Bot size={20} className="text-white" />
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
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-4 py-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-6 flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  } message-appear`}
                >
                  <div
                    className={`max-w-[70%] flex items-start gap-4 ${
                      message.sender === "user"
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0 shadow-lg ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                          : "bg-gradient-to-r from-blue-500 to-purple-600"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User size={20} className="text-white" />
                      ) : (
                        <Bot size={20} className="text-white" />
                      )}
                    </div>
                    <div
                      className={`relative ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                          : "bg-gradient-to-r from-slate-700 to-slate-800"
                      } text-white p-4 rounded-2xl shadow-xl backdrop-blur-md border border-slate-600/30 message-bubble`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.text}
                      </p>
                      <div
                        className={`text-xs mt-2 opacity-70 ${
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
                <div className="flex justify-start mb-6 message-appear">
                  <div className="max-w-[70%] flex items-center gap-4 flex-row">
                    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
                      <Bot size={20} className="text-white" />
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
          </div>
        )}
      </main>

      {/* Fixed Input Box */}
      <div className="fixed bottom-0 left-0 sm:left-16 w-full sm:w-[calc(100%-4rem)] z-30 bg-slate-800/90 backdrop-blur-md border-t border-slate-700/50 shadow-lg">
        <div className="px-4 py-3">
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your message to the AI system..."
                className="w-full px-6 py-4 pr-16 bg-slate-700/50 backdrop-blur-md border border-slate-600/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[60px] max-h-32 text-white placeholder-slate-400 shadow-xl"
                rows="1"
              />
              <button
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === "" || isTyping}
                className="absolute right-3 top-3 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float3d {
          0%,
          100% {
            transform: rotateX(45deg) rotateY(0deg) translateY(0);
            opacity: 0.4;
          }
          50% {
            transform: rotateX(45deg) rotateY(180deg) translateY(-10px);
            opacity: 0.7;
          }
        }

        @keyframes spin-slow {
          0% {
            transform: rotateZ(0deg);
          }
          100% {
            transform: rotateZ(360deg);
          }
        }

        .rotate3d {
          animation: float3d 12s ease-in-out infinite;
          transform-style: preserve-3d;
        }

        .shadow-3xl {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }

        .message-appear {
          animation: message-appear 0.4s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        @keyframes message-appear {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.5);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Chat;
