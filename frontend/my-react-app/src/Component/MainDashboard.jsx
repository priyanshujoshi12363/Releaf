import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";
import { getPlayer, getCurrentWeather } from "../api/index.js";


const MainDashboard = () => {
  const navigate = useNavigate()
  const [weather, setWeather] = useState("sunny"); // ✅ Default = sunny
  const [carbonEmission] = useState(1202);

  // ✅ State for backend data
  const [player, setPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Fetch player data
  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setPlayer(await getPlayer());
      } catch (error) {
        if (error.status === 401) {
          navigate("/dashboard");
          return;
        }
        console.error("Error fetching player data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerData();
  }, [navigate]);

  // ✅ Weather fetch with fallback
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const condition = await getCurrentWeather();
        setWeather(condition === "sunny" ? "sunny" : "rainy");
      } catch {
        console.warn("Weather API failed, using default sunny");
        setWeather("sunny"); // fallback
      }
    };

    fetchWeather();
  }, []);

  const weatherIcons = {
    sunny: "☀️",
    rainy: "🌧️",
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="pixel-loader"></div>
        <p>Loading Releaf...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {/* 🎥 Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        key={weather}
        className="background-video"
      >
        <source src={"/sunny.mp4"} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Navbar */}
      <nav className="navbar">
        <div className="heading">
          <div className="logo-container">
            <img src="/logo.gif" alt="ReLeaf Logo" className="logo-gif" />
            <span className="pixel-plant">🌱</span>
          </div>

          {/* ✅ Player Data */}
          <div className="profile">
            <div className="level-badge">
              <span className="badge-icon">🏆</span>
              <h2>Level-{player?.Level}</h2>
            </div>
            <div className="streak-counter">
              <span className="streak-icon">🔥</span>
              <h2>{player?.streak} days</h2>
            </div>
            <div className="streak-counter">
              <span className="streak-icon">Xp🔥</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(player?.playerXp / 100) * 100}%`,
                  }}
                ></div>
              </div>
              <p>{player?.playerXp} XP</p>
            </div>
          </div>
        </div>

        {/* Weather + Carbon */}
        <div className="stats-container">
          <div className="weather-box pixel-box">
            <h3>Current Weather</h3>
            <div className="weather-display">
              <span className="weather-icon">{weatherIcons[weather]}</span>
              <p>{weather}</p>
            </div>
          </div>
          <div className="weather-box pixel-box">
            <h3>Carbon Emission</h3>
            <div className="emission-display">
              <span className="emission-icon">🌍</span>
              <p>{carbonEmission} kg</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="content">
        <div className="glass">
          <div className="welcome-container pixel-box">
            <h1>Welcome, {player?.PlayerName}</h1>
            <p>Click on learn to start your journey towards a greener planet</p>
            <button className="btn" onClick={() => navigate("/learn")}>Start Learning</button>
          </div>
        </div>

        <div className="dashboard-grid">
          <h2>Progress bar</h2>

          <div className="grid-item pixel-box">
            <h4>ECO TOPICS</h4>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${player?.EcoLearn}%` }}
              ></div>
            </div>
            <p>{player?.EcoLearn}%</p>
          </div>

          <div className="grid-item pixel-box">
            <h4>GAME POINT</h4>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${player?.GamePoint}%` }}
              ></div>
            </div>
            <p>{player?.GamePoint}%</p>
          </div>

          <div className="grid-item pixel-box">
            <h4>QUIZ</h4>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${player?.Quize}%` }}
              ></div>
            </div>
            <p>{player?.Quize}%</p>
          </div>
        </div>
      </main>

      <SideBar />
    </div>
  );
};

export default MainDashboard;
