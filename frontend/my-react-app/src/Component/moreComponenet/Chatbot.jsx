import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendChatMessage } from "../../api/index.js";

const ecoFacts = [
  "🌳 One tree can absorb up to 21kg of CO₂ each year.",
  "💡 Switching to LED bulbs saves up to 80% energy.",
  "🚴 Cycling just 5 km can save 1 kg of CO₂ compared to driving.",
  "🌍 Recycling one aluminum can saves enough energy to power a TV for 3 hours.",
  "💧 Turning off the tap while brushing can save 12 liters of water each time.",
];

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hey! I’m your Eco Bot. Ask me anything about the environment 🌱",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(input);

      let botReply = reply || "⚠️ Sorry, I couldn't get a response.";
      const randomFact = ecoFacts[Math.floor(Math.random() * ecoFacts.length)];
      botReply += "\n\n💡 Fact: " + randomFact;

      setMessages([...newMessages, { sender: "bot", text: botReply }]);
    } catch (err) {
      console.error("Chat error:", err.message);
      setMessages([
        ...newMessages,
        { sender: "bot", text: "⚠️ " + (err.message || "Oops! Something went wrong.") },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-box">
        <h2 className="chatbot-title">🌱 Eco Chatbot</h2>

        <div className="chat-area">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-bubble ${msg.sender === "user" ? "user" : "bot"}`}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="chat-bubble bot">⏳ Thinking...</div>
          )}
        </div>

        <div className="input-area">
          <input
            type="text"
            className="chat-input"
            placeholder="Type your eco question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} className="send-btn">
            🚀
          </button>
        </div>
      </div>
      <button
        className="earth-back-btn"
        onClick={() => navigate("/maindashboard")}
      >
        ⬅ Back to Dashboard
      </button>
    </div>
  );
};

export default Chatbot;
