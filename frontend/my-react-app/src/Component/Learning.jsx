import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProgress } from "../api/index.js";

export default function Roadmap() {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(null);
  const [progress, setProgress] = useState(0); // total journey progress
  const [progressData, setProgressData] = useState({}); // ✅ all progress topics

  useEffect(() => {
    getProgress()
      .then((data) => {
        setProgressData(data);

        // calculate overall progress = average of all topics
        const values = Object.values(data);
        const avg =
          values.length > 0
            ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
            : 0;

        // ✅ cap overall progress between 0–100
        setProgress(Math.min(Math.max(avg, 0), 100));
      })
      .catch((err) => console.error("Error fetching progress:", err.message));
  }, []);

  const checkpoints = [
    { id: 1, title: "Introduction to Environment", path: "/intro", icon: "🌱", key: "introduction" },
    { id: 2, title: "Natural Resources & Conservation", path: "/resources", icon: "💧", key: "conservation" },
    { id: 3, title: "Pollution & Waste Management", path: "/pollution", icon: "♻️", key: "pollution" },
    { id: 4, title: "Climate Change & Global Challenge", path: "/climate", icon: "🌡️", key: "climate" },
    { id: 5, title: "Sustainable Living & Agriculture", path: "/sustainable", icon: "🌾", key: "sustainable" },
    { id: 6, title: "Wildlife & Biodiversity", path: "/wildlife", icon: "🦋", key: "biodiversity" },
    { id: 7, title: "Environment, Society & Policy", path: "/society", icon: "🏛️", key: "environment" },
    { id: 8, title: "Real World Eco-Action", path: "/ecoaction", icon: "🌎", key: "real_world" }
  ];

  const handleCardClick = (path, id) => {
    setActiveCard(id);
    setTimeout(() => {
      navigate(path);
    }, 800);
  };

  return (
    <div className="roadmap-wrapper">
      <div className="video-overlay"></div>
      <video autoPlay muted loop playsInline className="bg-video">
        <source src="/space.mp4" type="video/mp4" />
      </video>

      <button className="back-btn" onClick={() => navigate("/maindashboard")}>
        ← Back to Dashboard
      </button>

      {/* Overall Progress */}
      <div className="progress-container">
        <div className="progress-text">Your Learning Journey: {progress}% Complete</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="roadmap-container">
        <h1 className="roadmap-title">
          <span className="title-icon">🌿</span>
          Environmental Learning Path
          <span className="title-icon">🌿</span>
        </h1>
        
        <div className="checkpoint-grid">
          {checkpoints.map((checkpoint, index) => {
            let progressValue = progressData[checkpoint.key] ?? 0;

            // ✅ cap each checkpoint progress 0–100
            progressValue = Math.min(Math.max(progressValue, 0), 100);

            return (
              <div 
                key={checkpoint.id}
                className={`checkpoint-card ${activeCard === checkpoint.id ? 'active' : ''}`}
                onClick={() => handleCardClick(checkpoint.path, checkpoint.id)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-icon">{checkpoint.icon}</div>
                <div className="card-content">
                  <h3>{checkpoint.title}</h3>
                  <div className="card-progress">
                    <div className="card-progress-bar">
                      <div className="card-progress-fill" style={{ width: `${progressValue}%` }}></div>
                    </div>
                    <span>{progressValue}%</span>
                  </div>
                </div>
                <div className="card-number">{index + 1}</div>
              </div>
            );
          })}
        </div>

        {/* Decorative floating elements */}
        <div className="floating-element el-1">🌿</div>
        <div className="floating-element el-2">💧</div>
        <div className="floating-element el-3">🌎</div>
      </div>
    </div>
  );
}
