import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Menu,
  Settings,
  History,
  Plus,
} from "lucide-react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateBotResponse = (userMessage) => {
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        "That's an interesting question! Let me think about that for a moment. Here's what I can help you with based on my understanding...",
        "I understand what you're asking. Here's a comprehensive response to your query with some additional context that might be helpful...",
        "Great question! Based on what you've told me, I'd suggest exploring this topic further. Let me break it down for you...",
        "I'm here to help! Let me provide you with some detailed information about that topic, including relevant examples and explanations...",
        "Thanks for asking! I can definitely assist you with that. Here's a thorough explanation along with some practical insights...",
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
    }, 1500 + Math.random() * 2000);
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
    simulateBotResponse(inputMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedPrompts = [
    "Explain quantum computing in simple terms",
    "Write a creative story about space exploration",
    "Help me plan a healthy meal prep routine",
    "What are the latest trends in web development?",
  ];

  const handleSuggestedPrompt = (prompt) => {
    setInputMessage(prompt);
    inputRef.current?.focus();
  };

  const startNewChat = () => {
    setMessages([]);
    setInputMessage("");
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      {/* <header className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Menu size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <h1 className="text-xl font-medium text-gray-800">Gemini</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={startNewChat}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="New chat"
            >
              <Plus size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <History size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Settings size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {messages.length === 0 ? (
          /* Welcome Screen */
          <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
            <div className="text-center mb-12">
              {/* <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles size={32} className="text-white" />
              </div> */}
              <h2 className="text-4xl font-light text-gray-800 mb-4">
                Hello, I'm Gemini
              </h2>
              <p className="text-lg text-gray-600">How can I help you today?</p>
            </div>

            {/* Suggested Prompts */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="p-4 text-left border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
                >
                  <p className="text-gray-700 group-hover:text-gray-900">
                    {prompt}
                  </p>
                </button>
              ))}
            </div> */}
          </div>
        ) : (
          /* Chat Messages */
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-8">
              {messages.map((message) => (
                <div key={message.id} className="mb-8 animate-fade-in">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === "user"
                          ? "bg-blue-500"
                          : "bg-gradient-to-r from-blue-500 to-purple-600"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User size={16} className="text-white" />
                      ) : (
                        <Sparkles size={16} className="text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {message.sender === "user" ? "You" : "Gemini"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {message.timestamp}
                        </span>
                      </div>
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="mb-8 animate-fade-in">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                      <Sparkles size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          Gemini
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a prompt here"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[52px] max-h-32 text-gray-800 placeholder-gray-500"
                rows="1"
              />
              <button
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === "" || isTyping}
                className="absolute right-2 top-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
            
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        textarea {
          field-sizing: content;
        }
      `}</style>
    </div>
  );
};

export default Chat;
