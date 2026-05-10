import { useState, useRef, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SUGGESTIONS = [
  "Giày Nike size US9 còn hàng không?",
  "Chính sách đổi trả như thế nào?",
  "Giày chạy bộ dưới 2 triệu",
  "Hướng dẫn chọn size giày",
];

const BOT_WELCOME =
  "Xin chào! Mình là trợ lý SneakSpirit 👟\nMình có thể tư vấn giày, size, đơn hàng và khuyến mãi. Bạn cần mình giúp gì?";

const formatTime = () =>
  new Date().toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 bg-white border border-[#ebebeb] rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
      <style>{`
        @keyframes sneakBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block w-[7px] h-[7px] rounded-full bg-red-600 opacity-55"
          style={{
            animation: "sneakBounce 1.2s infinite ease-in-out",
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div
      className={`flex gap-2 items-end ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-sm shrink-0">
          👟
        </div>
      )}
      <div className="max-w-[78%]">
        <div
          className={`px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
            isUser
              ? "bg-red-600 text-white rounded-2xl rounded-br-sm"
              : "bg-white border border-[#ebebeb] text-gray-900 rounded-2xl rounded-bl-sm shadow-sm"
          }`}
        >
          {msg.content.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </div>
        <p
          className={`text-[10.5px] text-gray-300 mt-1 px-1 ${isUser ? "text-right" : "text-left"}`}
        >
          {msg.time}
        </p>
      </div>
    </div>
  );
}

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: BOT_WELCOME, time: formatTime() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [unread, setUnread] = useState(0);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text.trim(), time: formatTime() },
    ]);
    setInput("");
    setLoading(true);
    setShowSuggestions(false);
    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), sessionId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setSessionId(data.data.sessionId);
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: data.data.answer, time: formatTime() },
        ]);
        if (!open) setUnread((n) => n + 1);
      } else throw new Error(data.error || "API error");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "Xin lỗi, mình đang gặp sự cố kỹ thuật. Bạn thử lại sau nhé! 🙏",
          time: formatTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const canSend = input.trim() && !loading;

  return (
    <>
      <style>{`
        .snk-msgs::-webkit-scrollbar { width: 4px; }
        .snk-msgs::-webkit-scrollbar-thumb { background: #e8e8e8; border-radius: 4px; }
      `}</style>

      {/*Chat window */}
      <div
        style={{
          position: "fixed",
          bottom: "90px",
          right: "24px",
          left: "auto",
          top: "auto",
          width: `min(360px, calc(100vw - 32px))`,
          height: `min(520px, calc(100dvh - 110px))`,
          zIndex: 9999,
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #f3f4f6",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 12px 48px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
          transformOrigin: "bottom right",
          transition:
            "transform 0.22s cubic-bezier(0.34,1.56,0.64,1), opacity 0.18s ease",
          transform: open ? "scale(1)" : "scale(0.88)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 py-3 bg-white border-b-2 border-red-600 shrink-0">
          <div className="w-9 h-9 rounded-[10px] bg-red-50 border border-red-100 flex items-center justify-center text-lg shrink-0">
            👟
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900 tracking-wide">
              SneakSpirit
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-[7px] h-[7px] rounded-full bg-green-500" />
              <p className="text-[11.5px] text-gray-400">
                Trợ lý đang hoạt động
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 text-[13px] hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="snk-msgs flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
          {messages.map((msg, i) => (
            <Message key={i} msg={msg} />
          ))}
          {loading && (
            <div className="flex flex-row gap-2 items-end">
              <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-sm shrink-0">
                👟
              </div>
              <TypingDots />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {showSuggestions && (
          <div className="px-3.5 pt-2.5 pb-2 bg-white border-t border-gray-100">
            <p className="text-[10.5px] text-gray-300 uppercase tracking-widest font-semibold mb-1.5">
              Gợi ý câu hỏi
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 rounded-full border-2 border-gray-200 bg-white text-gray-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-t border-gray-100 bg-white">
          <input
            ref={inputRef}
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={500}
            disabled={loading}
            className="flex-1 border-[1.5px] border-gray-200 rounded-[10px] px-3.5 py-2 text-[13.5px] bg-gray-50 text-gray-900 h-[38px] focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/10 transition-all"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!canSend}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              border: "none",
              backgroundColor: "#dc2626",
              opacity: canSend ? 1 : 0.4,
              cursor: canSend ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        {/* Branding */}
        <p className="text-center text-[10.5px] text-gray-300 py-1.5 bg-white tracking-wide">
          Powered by{" "}
          <span className="text-red-600 font-semibold">SneakSpirit AI</span>
        </p>
      </div>

      {/* FAB button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          left: "auto",
          top: "auto",
          width: "54px",
          height: "54px",
          borderRadius: "16px",
          backgroundColor: "#dc2626",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10000,
          border: "none",
          boxShadow: "0 4px 20px rgba(208,2,27,0.35)",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {!open && unread > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              backgroundColor: "#111",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              width: 18,
              height: 18,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #fff",
            }}
          >
            {unread}
          </span>
        )}
      </button>
    </>
  );
};

export default ChatWidget;
