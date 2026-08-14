import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { register, login, getCurrentWeather } from "../api/index.js";



const AppFlow = () => {
  const [weather, setWeather] = useState("sunny");
  const [step, setStep] = useState("dashboard"); // dashboard → choose → register → login → mainboard
  const [formData, setFormData] = useState({ email: "", password: "", playerName: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  // Weather API
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

  const videoMap = {
    sunny: "/sunny.mp4",
    cloudy: "/cloudy.mp4",
    rainy: "/rainy.mp4",
  };

  // Transitions
  const boxVariants = {
    hidden: { opacity: 0, scale: 0.7 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.5, ease: "easeIn" } }
  };

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

      setMessage(res.message || "Registered!");
      setTimeout(() => setStep("login"), 1000);
    } catch (err) {
      setMessage(err.message || "Error!");
    } finally {
      setLoading(false);
    }
  };
  // Handle Login Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await login({ email: formData.email, password: formData.password });
      setMessage("Welcome back!");
      setTimeout(() => navigate("/maindashboard"), 1200);
    } catch (err) {
      setMessage(err.message || "Error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Background */}
      <video autoPlay muted loop playsInline className="background-video">
        <source src={videoMap[weather]} type="video/mp4" />
      </video>

      {/* Navbar */}
      <nav className="navbar">
        <div className="heading">
          <img src="/logo.gif" alt="ReLeaf Logo" className="logo-gif" />
          <ul><li>Eco learning platform</li></ul>
        </div>
        <aside className="weather-box">
          <h3>Current Weather</h3>
          <p>{weather}</p>
        </aside>
      </nav>

      {/* Animated Box */}
      <div className="flex justify-center items-center h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={boxVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="glass-box p-8 rounded-2xl shadow-lg bg-white/10 border border-white/20"
          >
            {/* STEP CONTENT */}
            {step === "dashboard" && (
              <>
                <h1>Welcome to ReLeaf</h1>
                <p>A gamified platform for environmental studies.</p>
                <button className="btn" onClick={() => setStep("choose")}>
                  Let's go
                </button>
              </>
            )}

            {step === "choose" && (
              <>
                <h1>Are you a Player?</h1>
                <div className="flex gap-4 mt-6 justify-center">
                  <button className="btn" onClick={() => setStep("register")}>
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
                <form onSubmit={handleRegister} className="flex flex-col gap-3 mt-4">

                  <input
                    type="file"
                    className="form-input"
                    required
                    onChange={(e) => setFormData({ ...formData, Avatar: e.target.files[0] })}
                  />
                  <input type="text" className="form-input" placeholder="Player Name" required
                    onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                  />
                  <input type="email" className="form-input" placeholder="Email" required
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <input type="password" className="form-input" placeholder="Password" required
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <input type="text" className="form-input" placeholder="Phone Number"
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <button type="submit" className="btn" disabled={loading}>
                    {loading ? "Registering..." : "Start Adventure"}
                  </button>
                </form>
                {message && <p>{message}</p>}
              </>
            )}

            {step === "login" && (
              <>
                <h1>Login</h1>
                <form onSubmit={handleLogin} className="form-group">
                  <input type="email" className="form-input" placeholder="Email" required
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <input type="password" className="form-input" placeholder="Password" required
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button type="submit" className="btn" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>
                {message && <p>{message}</p>}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AppFlow;
