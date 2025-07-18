import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Eye, EyeOff, X } from "lucide-react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import DashboardCharts from "../components/Dashboard/Dashboardchart";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
  const [finalPayload, setFinalPayload] = useState(null);
  const [dashboardResult, setDashboardResult] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const currentTextRef = useRef("");
  // Add thread management state
  const [threadId, setThreadId] = useState("");
  const [isNewThread, setIsNewThread] = useState(true);
  // Add navigation hook
  const navigate = useNavigate();
  // Preview state
  const [showPreview, setShowPreview] = useState(false);

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
    const currentMessage = inputMessage;
    setInputMessage("");
    setHasUserSentMessage(true);
    setIsTyping(true);

    // Fetch bot response
    fetchBotResponse(currentMessage);
  };

  const fetchDashboardData = async (payload) => {
    try {
      setPreviewLoading(true);
      
      // Get today's date timestamps
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
      );

      // Create enhanced payload with filter
      const enhancedPayload = {
        ...payload,
        filter: {
          startDate: startOfDay.getTime(),
          endDate: endOfDay.getTime(),
          notFetchEmpData: false,
        },
      };

      console.log("Making API call with enhanced payload:", enhancedPayload);

      const res = await fetch(
        "https://democrm.kapturecrm.com/ms/dashboard/performance-dashboard",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic ZGVtb2NybTpEZW1vY3JtJDMyMQ==",
          },
          body: JSON.stringify(enhancedPayload),
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      console.log("API Response received:", data);
      setDashboardResult(data);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
      setDashboardResult({ error: err.message });
    } finally {
      setPreviewLoading(false);
    }
  };

  const handlePreview = async () => {
    if (finalPayload) {
      setShowPreview(true);
      if (!dashboardResult) {
        await fetchDashboardData(finalPayload);
      }
    }
  };

const handleFullDashboard = () => {
  if (finalPayload) {
    // Save the entire dashboard state (payload + any UI state you want)
    const dashboardState = {
      payload: finalPayload,
      timestamp: new Date().toISOString(), // Optional: save when it was created
    };

    localStorage.setItem('savedDashboard', JSON.stringify(dashboardState));
    navigate("/dashboard");
  }
};


  const fetchBotResponse = async (inputMessage) => {
    try {
      // Prepare payload based on thread state
      const requestPayload = {
        user_message: inputMessage,
        isNewThread: isNewThread,
        thread_id: threadId,
      };

      console.log("Sending payload:", requestPayload);

      const response = await fetch(
        "https://48da3b38e21f.ngrok-free.app/kapture/dashboard/payload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          body: JSON.stringify(requestPayload),
        }
      );

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let fullText = "";
      let partialChunk = "";
      let botMessageId = null;

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
            console.log("Received data:", data);

            // Handle thread ID response
            if (data.type === "threadID") {
              console.log("Thread ID received:", data.content);
              setThreadId(data.content);
              setIsNewThread(false);
            }

            // Handle text content - LIVE STREAMING FIX
            if (data.type === "text" && data.content) {
              console.log("Streaming text chunk:", data.content);

              if (!botMessageId) {
                const botMessage = {
                  id: Date.now() + Math.random(),
                  text: data.content, // Start with first chunk
                  sender: "bot",
                  timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                };
                botMessageId = botMessage.id;
                fullText = data.content;
                setMessages((prev) => [...prev, botMessage]);
                setIsTyping(false);
              } else {
                fullText += data.content;

                // Force immediate update with flushSync for live streaming
                flushSync(() => {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === botMessageId ? { ...msg, text: fullText } : msg
                    )
                  );
                });
              }
            }

            // Handle payload response - check for the specific structure
            if (data.type === "payload" && data.content) {
              console.log("Payload received:", data.content);
              setFinalPayload(data.content);
              setDashboardResult(null); // Reset dashboard result for new payload
            }

            // Handle if the payload comes directly as the data object
            if (data.filter && data.keyToFieldList) {
              console.log("Direct payload structure received:", data);
              setFinalPayload(data);
              setDashboardResult(null); // Reset dashboard result for new payload
            }

            // Handle if payload is nested in content
            if (
              data.content &&
              data.content.filter &&
              data.content.keyToFieldList
            ) {
              console.log("Nested payload structure received:", data.content);
              setFinalPayload(data.content);
              setDashboardResult(null); // Reset dashboard result for new payload
            }

            // Handle other possible payload structures
            if (data.type === "final_payload" || data.final_payload) {
              const payload = data.final_payload || data.content;
              console.log("Final payload received:", payload);
              setFinalPayload(payload);
              setDashboardResult(null); // Reset dashboard result for new payload
            }
          } catch (err) {
            console.error("Error parsing JSON:", err);
            console.log("Problematic line:", line);
            if (i === lines.length - 1) {
              partialChunk = line;
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

  // Function to reset thread (optional - for starting new conversations)
  const resetThread = () => {
    setThreadId("");
    setIsNewThread(true);
    setMessages([]);
    setHasInitialized(false);
    setFinalPayload(null);
    setDashboardResult(null);
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 flex">
      {/* Chat Side */}
      <div className={`flex flex-col transition-all duration-300 ${showPreview ? 'w-1/2' : 'w-full'}`}>
        {/* Chat Content */}
        <main
          className="flex-1 pt-20 pb-24 overflow-y-auto"
          style={{ height: "calc(100vh - 104px)" }}
        >
          <div className="max-w-6xl mx-auto px-4 py-2">
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
                      <User size={20} className="text-white" />
                    ) : (
                      <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                      <img src="/public/kapImg.svg"/>
                      </div>
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
                    <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                      <img src="/public/kapImg.svg"/>
                    </div>
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
        <div className="bg-slate-800/90 backdrop-blur-md border-t border-slate-700/50 shadow-lg h-24">
          <div className="px-4 py-3 h-full flex items-center">
            <div className="max-w-6xl mx-auto w-full">
              <div className="relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your message to the AI system..."
                  className="w-full px-4 py-3 pr-32 bg-slate-700/50 backdrop-blur-md border border-slate-600/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[50px] max-h-32 text-white placeholder-slate-400 shadow-lg"
                  rows="1"
                />
                
                {/* Preview Button */}
                <button
                  onClick={handlePreview}
                  disabled={!finalPayload}
                  className={`absolute right-20 top-2 p-2 rounded-lg transition-all duration-200 shadow-md ${
                    finalPayload
                      ? `${showPreview ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600'} text-white hover:opacity-90 cursor-pointer`
                      : "bg-slate-600 text-slate-400 cursor-not-allowed opacity-50"
                  }`}
                  title={finalPayload ? (showPreview ? "Hide Preview" : "Show Preview") : "No data available"}
                >
                  {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

                {/* Send Button */}
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
      </div>

      {/* Preview Side */}
      {showPreview && (
        <div className="w-1/2 bg-white border-l border-slate-300 flex flex-col">
          {/* Preview Header */}
          <div className="bg-slate-100 border-b border-slate-200 p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Dashboard Preview</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleFullDashboard}
                disabled={!finalPayload}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm"
              >
                Save Dashboard
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1 hover:bg-slate-200 rounded-md"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {previewLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading dashboard data...</p>
                </div>
              </div>
            ) : dashboardResult ? (
              <div className="h-full">
                <DashboardCharts apiResponse={dashboardResult} />
              </div>
            ) : finalPayload ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <p className="text-gray-600">Click preview to load dashboard data</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <p className="text-gray-600">Generate dashboard data from chat to see preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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