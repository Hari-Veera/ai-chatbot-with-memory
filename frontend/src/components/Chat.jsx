import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [dark, setDark] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesRef = useRef(null);
  const endRef = useRef(null);

  /* 🔹 Auto-scroll to bottom */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /* 🔹 Detect manual scroll */
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;

    const handleScroll = () => {
      const isBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 50;
      setShowScrollBtn(!isBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  /* 🔹 Persistent dark mode */
  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("darkMode", dark);
  }, [dark]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    setMessages(prev => [
      ...prev,
      { sender: "user", text: input, time }
    ]);
    setTyping(true);

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        userId: "demo-user",
        message: input
      });

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: res.data.reply,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        }
      ]);
    } catch (err) {
      let errorMessage = "Service temporarily unavailable.";

      if (err.response?.status === 429) {
        errorMessage =
          "API quota exceeded. Please try again later.";
      }

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: errorMessage,
          time
        }
      ]);
    }

    setTyping(false);
    setInput("");
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <h3>Chatbot</h3>
        <button onClick={() => setDark(!dark)}>
          {dark ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages" ref={messagesRef}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`bubble fade-in ${
              m.sender === "user" ? "user-bubble" : "bot-bubble"
            }`}
          >
            {m.text}
            <div className="timestamp">{m.time}</div>
          </div>
        ))}

        {typing && <div className="typing">Bot is typing...</div>}
        <div ref={endRef} />
      </div>

      {/* Scroll-to-bottom button */}
      {showScrollBtn && (
        <button
          className="scroll-btn"
          onClick={() =>
            endRef.current?.scrollIntoView({ behavior: "smooth" })
          }
        >
          ↓
        </button>
      )}

      {/* Input */}
      <div className="chat-input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
