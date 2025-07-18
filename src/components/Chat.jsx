import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Sparkles, MessageCircle } from "lucide-react";
import PayloadProcessor from "../Api-Calls/PayloadProcessor"; // Adjust the import path as necessary

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
  const [finalPayload, setFinalPayload] = useState(null);
  const currentTextRef = useRef("");
  // Add state to control PayloadProcessor rendering
  const [payloadToProcess, setPayloadToProcess] = useState(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

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

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    // Add user message
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
    setIsTyping(true);

    // Trigger PayloadProcessor when send button is pressed
    setPayloadToProcess(hardcoded_payload);

    // Fetch bot response
    fetchBotResponse(inputMessage);
  };

  const hardcoded_payload = {
    filter: {
      startDate: 1752690600000,
      endDate: 1752776970000,
      notFetchEmpData: false,
    },
    keyToFieldList: {
      AgentTicketDetails: [
        {
          id: 1,
          displayName: "Total Tickets Created",
          type: "AgentTicketDetails",
          key: "TOTAL_TICKETS_CREATED",
          position: "1",
        },
        {
          id: 2,
          displayName: "Pending Tickets",
          type: "AgentTicketDetails",
          key: "TOTAL_TICKETS_PENDING",
          position: "1",
        },
        {
          id: 3,
          displayName: "Tickets Resolved",
          type: "AgentTicketDetails",
          key: "TOTAL_TICKETS_RESOLVED",
          position: "1",
        },
      ],
      EmployeeDetails: [
        {
          id: 1,
          displayName: "Employee Code",
          type: "EmployeeDetails",
          key: "EMPLOYEE_CODE",
          position: "1",
        },
      ],
    },
  };

  const fetchBotResponse = async (inputMessage) => {
    try {
      const response = await fetch(
        "https://e76f17d470eb.ngrok-free.app/kapture/dashboard/payload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_message: inputMessage }),
        }
      );

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let fullText = "";
      let partialChunk = "";
      let botMessageId = null;

      const pushTextUpdate = () => {
        if (botMessageId) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId ? { ...msg, text: fullText } : msg
            )
          );
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setIsTyping(false);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const combined = partialChunk + chunk;
        const lines = combined.split("\n");

        partialChunk = "";

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          try {
            const data = JSON.parse(line);

            if (data.type === "text" && data.content) {
              // Create bot message on first content if it doesn't exist
              if (!botMessageId) {
                const botMessage = {
                  id: Date.now() + Math.random(), // Ensure unique ID
                  text: "",
                  sender: "bot",
                  timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                };
                botMessageId = botMessage.id;
                setMessages((prev) => [...prev, botMessage]);
                setIsTyping(false); // Stop showing typing indicator once we start streaming
              }

              fullText += data.content;
              pushTextUpdate();
            } else if (data.content.final_payload) {
              setFinalPayload(data.keyToFieldList.AgentTicketDetails);
              console.log("Final Payload:", data.AgentTicketDetails);
            }
          } catch (err) {
            if (i === lines.length - 1) {
              partialChunk = line; // carry forward incomplete chunk
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setIsTyping(false);
    }
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
        style={{ height: "calc(100vh - 104px)" }} // Adjusted height
      >
        <div className="max-w-6xl mx-auto px-4 py-2">
          {" "}
          {/* Reduced padding */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-3 flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } message-appear`}
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

      {/* Conditionally render PayloadProcessor only when send button is pressed */}
      {payloadToProcess && <PayloadProcessor payload={payloadToProcess} />}
    </div>
  );
};

export default Chat;
