import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { register, login, getCurrentWeather } from "../api/index.js";

const videoMap = {
  sunny: "/sunny.mp4",
  rainy: "/rainy.mp4",
};

const AppFlow = () => {
  const [weather, setWeather] = useState("sunny");
  const [step, setStep] = useState("dashboard");
  const [formData, setFormData] = useState({ email: "", password: "", playerName: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState("success");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    getCurrentWeather()
      .then((condition) => {
        if (!cancelled) setWeather(condition);
      })
      .catch(() => {
        if (!cancelled) setWeather("sunny");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const boxVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
    exit: { opacity: 0, y: -16, scale: 0.96, transition: { duration: 0.3, ease: "easeIn" } },
  };

  const update = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await register({
        playerName: formData.playerName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        avatar: formData.Avatar,
      });

      setMessageTone("success");
      setMessage(res.message || "Registered!");
      setTimeout(() => {
        setMessage("");
        setStep("login");
      }, 1200);
    } catch (err) {
      setMessageTone("error");
      setMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await login({ email: formData.email, password: formData.password });
      setMessageTone("success");
      setMessage("Welcome back!");
      setTimeout(() => navigate("/maindashboard"), 900);
    } catch (err) {
      setMessageTone("error");
      setMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <video autoPlay muted loop playsInline className="background-video" key={weather}>
        <source src={videoMap[weather] || videoMap.sunny} type="video/mp4" />
      </video>

      <nav className="navbar">
        <div className="heading">
          <img src="/logo.gif" alt="ReLeaf" className="logo-gif" />
          <ul>
            <li>Eco learning platform</li>
          </ul>
        </div>
        <aside className="weather-box">
          <h3>Weather</h3>
          <p>{weather}</p>
        </aside>
      </nav>

      <div className="content-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={boxVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="glass-box"
          >
            {step === "dashboard" && (
              <>
                <h1>Welcome to ReLeaf</h1>
                <p>A gamified platform for environmental studies.</p>
                <div className="btn-group">
                  <button className="btn btn-primary" onClick={() => setStep("choose")}>
                    Let&apos;s go
                  </button>
                </div>
              </>
            )}

            {step === "choose" && (
              <>
                <h1>Are you a Player?</h1>
                <p>Start a new journey or pick up where you left off.</p>
                <div className="btn-group">
                  <button className="btn btn-primary" onClick={() => setStep("register")}>
                    New Player
                  </button>
                  <button className="btn" onClick={() => setStep("login")}>
                    Old Player
                  </button>
                </div>
              </>
            )}

            {step === "register" && (
              <>
                <h1>Register</h1>
                <form onSubmit={handleRegister} className="form-group">
                  <label htmlFor="reg-avatar">Avatar</label>
                  <input
                    id="reg-avatar"
                    type="file"
                    accept="image/*"
                    className="form-input"
                    required
                    onChange={(e) => setFormData({ ...formData, Avatar: e.target.files[0] })}
                  />

                  <label htmlFor="reg-name">Player name</label>
                  <input
                    id="reg-name"
                    type="text"
                    className="form-input"
                    placeholder="At least 3 characters"
                    autoComplete="nickname"
                    minLength={3}
                    required
                    value={formData.playerName}
                    onChange={update("playerName")}
                  />

                  <label htmlFor="reg-email">Email</label>
                  <input
                    id="reg-email"
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={update("email")}
                  />

                  <label htmlFor="reg-password">Password</label>
                  <input
                    id="reg-password"
                    type="password"
                    className="form-input"
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={formData.password}
                    onChange={update("password")}
                  />

                  <label htmlFor="reg-phone">Phone number</label>
                  <input
                    id="reg-phone"
                    type="tel"
                    className="form-input"
                    placeholder="10 digits"
                    autoComplete="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    required
                    value={formData.phone}
                    onChange={update("phone")}
                  />

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Registering..." : "Start Adventure"}
                  </button>
                  <button type="button" className="btn" onClick={() => setStep("choose")}>
                    Back
                  </button>
                </form>
                {message && (
                  <p className={`message ${messageTone}`} role="status">
                    {message}
                  </p>
                )}
              </>
            )}

            {step === "login" && (
              <>
                <h1>Login</h1>
                <form onSubmit={handleLogin} className="form-group">
                  <label htmlFor="login-email">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={update("email")}
                  />

                  <label htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    className="form-input"
                    placeholder="Your password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={update("password")}
                  />

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </button>
                  <button type="button" className="btn" onClick={() => setStep("choose")}>
                    Back
                  </button>
                </form>
                {message && (
                  <p className={`message ${messageTone}`} role="status">
                    {message}
                  </p>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AppFlow;
