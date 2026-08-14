import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { saveQuizResult } from "../../api/index.js";

const sampleQuestions = [
  {
    question: "Which gas is mainly responsible for global warming?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"],
    answer: 1,
  },
  {
    question: "Which renewable energy is produced using sunlight?",
    options: ["Geothermal", "Solar", "Wind", "Hydropower"],
    answer: 1,
  },
  {
    question: "What is the 3R principle in waste management?",
    options: [
      "Reduce, Reuse, Recycle",
      "Remove, Rebuild, Restore",
      "Recycle, Replant, Reuse",
      "Reduce, Rebuild, Restore",
    ],
    answer: 0,
  },
  // 👉 Add more questions if needed
];

const Quize = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState("welcome"); // welcome | quiz | result
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAccept = () => {
    const shuffled = [...sampleQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
    setStage("quiz");
  };

  const handleAnswer = (idx) => {
    if (idx === questions[current].answer) {
      setScore((prev) => prev + 10);
    } else {
      setScore((prev) => (prev - 4 >= 0 ? prev - 4 : 0));
    }

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setStage("result");
      handleSaveResult(); // ✅ save to backend
    }
  };

  const handleSaveResult = async () => {
    if (score <= 0) return;

    try {
      setLoading(true);
      await saveQuizResult({ xp: score });
    } catch (err) {
      console.error("Error saving quiz result:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setStage("welcome");
    setScore(0);
    setCurrent(0);
    setName("");
  };

  return (
    <div className="quiz-page">
      {/* Background video */}
      <video className="quiz-bg-video" autoPlay loop muted playsInline>
        <source src="/sunny.mp4" type="video/mp4" />
      </video>
      <nav className="navbar">
        <div className="heading">
          <div className="logo-container">
            <img src="/logo.gif" alt="ReLeaf Logo" className="logo-gif" />
            <span className="pixel-plant">🌱</span>
          </div>
        </div>
        <button className="btn" onClick={() => navigate("/maindashboard")}>
          Back to Dashboard
        </button>
      </nav>
      <div className="quiz-overlay" />

      {/* AnimatePresence for transitions */}
      <AnimatePresence mode="wait">
        {stage === "welcome" && (
          <motion.main
            key="welcome"
            className="quiz-main"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6 }}
          >
            <section className="quiz-card">
              <div className="card-left">
                <h1 className="card-heading">Welcome to Eco Quiz 🌱</h1>
                <p className="card-text">
                  Test your knowledge about the environment & sustainability.
                </p>
                <ul className="card-list">
                  <li>10 questions per challenge</li>
                  <li>
                    Correct answer → <strong>+10 XP</strong>
                  </li>
                  <li>
                    Wrong answer → <strong>-4 XP</strong>
                  </li>
                  <li>Reach 100 XP → Level Up 🚀</li>
                </ul>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="name-input"
                />
              </div>
              <div className="card-right">
                <button
                  className="accept-btn"
                  onClick={handleAccept}
                  disabled={!name}
                >
                  Accept Challenge
                </button>
                <p className="small-note">Good luck, Eco Warrior!</p>
              </div>
            </section>
          </motion.main>
        )}

        {stage === "quiz" && (
          <motion.main
            key="quiz"
            className="quiz-main"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6 }}
          >
            <section className="quiz-card quiz-active">
              <h2 className="question-text">
                Q{current + 1}. {questions[current].question}
              </h2>
              <div className="options">
                {questions[current].options.map((opt, idx) => (
                  <button
                    key={idx}
                    className="option-btn"
                    onClick={() => handleAnswer(idx)}
                    disabled={loading}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className="quiz-footer">
                <span className="score-display">XP: {score}</span>
                <span className="progress">
                  {current + 1} / {questions.length}
                </span>
              </div>
            </section>
          </motion.main>
        )}

        {stage === "result" && (
          <motion.main
            key="result"
            className="quiz-main"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6 }}
          >
            <section className="quiz-card result-card">
              <h1>🎉 Quiz Completed!</h1>
              <p>
                <strong>Name:</strong> {name}
              </p>
              <p>
                <strong>Total XP:</strong> {score}
              </p>
              <p>
                <strong>Marks:</strong> {score / 10} / {questions.length}
              </p>
              {loading ? (
                <p>Saving your score...</p>
              ) : (
                <button className="restart-btn" onClick={handleRestart}>
                  Back to Home
                </button>
              )}
            </section>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quize;

