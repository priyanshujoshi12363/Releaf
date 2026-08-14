import React from "react";
import { Award, Star, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const achievements = [
  { id: 1, title: "First Step 🌱", desc: "Completed your first eco lesson", unlocked: true },
  { id: 2, title: "Quiz Master 🧠", desc: "Scored 80%+ in a quiz", unlocked: false },
  { id: 3, title: "Eco Streak 🔥", desc: "7-day learning streak", unlocked: true },
  { id: 4, title: "Planet Protector 🌍", desc: "Reduced 100kg carbon emissions", unlocked: false },
];

const Achievement = () => {
    const navigate = useNavigate()
  return (
    <div className="achievement-container">
      {/* 🔹 Background Video */}
      <video autoPlay loop muted playsInline className="background-video">
        <source src="/sunny.mp4" type="video/mp4" />
        Your browser does not support the video tag.
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

      {/* 🔹 Content */}
      <div className="achievement-content glass-box">
        <div className="achievement-box">
          <h1 className="achievement-title">
            <Trophy className="trophy-icon" />
            Achievements
          </h1>

          <div className="achievement-list">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`achievement-card ${ach.unlocked ? "unlocked" : "locked"}`}
              >
                <div className="achievement-info">
                  {ach.unlocked ? (
                    <Award className="icon unlocked-icon" />
                  ) : (
                    <Star className="icon locked-icon" />
                  )}
                  <div>
                    <h2 className="achievement-card-title">{ach.title}</h2>
                    <p className="achievement-card-desc">{ach.desc}</p>
                  </div>
                </div>
                {ach.unlocked ? (
                  <span className="status unlocked-status">Unlocked ✅</span>
                ) : (
                  <span className="status locked-status">Locked 🔒</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievement;
