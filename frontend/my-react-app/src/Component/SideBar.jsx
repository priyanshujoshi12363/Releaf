import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPlayer, logout } from "../api/index.js";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setStudent(await getPlayer());
      } catch (error) {
        console.error("Error fetching student data:", error.message);
      }
    };

    fetchStudentData();
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate("/dashboard");
  };

  const go = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <button
          type="button"
          className="nav-icon menu-toggle"
          aria-label="Open menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
        >
          <Menu size={22} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="overlay"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : "-105%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="glass-sidebar"
        role="dialog"
        aria-label="Player menu"
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="close-button"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

        <div className="profile-section">
          <div className="profile-header">
            <div className="avatar-container">
              <div className="avatar">
                {student?.Avatar?.url ? (
                  <img src={student.Avatar.url} alt="" className="avatar-img" />
                ) : (
                  <div className="avatar-placeholder">👤</div>
                )}
              </div>
              <span className="online-indicator" />
            </div>
            <h2 className="profile-name">{student?.PlayerName || "Loading..."}</h2>
            <p className="profile-status">Eco Explorer</p>
          </div>

          <div className="profile-details">
            <div className="profile-detail">
              <span aria-hidden="true">📧</span>
              <span>{student?.email || "loading..."}</span>
            </div>
            <div className="profile-detail">
              <span aria-hidden="true">📞</span>
              <span>{student?.PhoneNO || "loading..."}</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-link large-link" onClick={() => go("/achievement")}>
            <span className="nav-icon-large" aria-hidden="true">📊</span>
            <span className="nav-text">Achievements</span>
          </button>

          <button className="nav-link large-link" onClick={() => go("/clan")}>
            <span className="nav-icon-large" aria-hidden="true">🎯</span>
            <span className="nav-text">Clan</span>
          </button>

          <button className="nav-link large-link" onClick={() => go("/leaderboard")}>
            <span className="nav-icon-large" aria-hidden="true">🏆</span>
            <span className="nav-text">Leaderboard</span>
          </button>

          <button className="nav-link large-link" onClick={() => go("/earthfact")}>
            <span className="nav-icon-large" aria-hidden="true">🌍</span>
            <span className="nav-text">World Map</span>
          </button>

          <button className="nav-link large-link" onClick={() => go("/quize")}>
            <span className="nav-icon-large" aria-hidden="true">📝</span>
            <span className="nav-text">Quiz</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="bottom-button large-button" onClick={() => go("/bot")}>
            <Settings size={22} className="button-icon" />
            <span>EcoBot</span>
          </button>
          <button className="bottom-button large-button logout" onClick={handleLogout}>
            <LogOut size={22} className="button-icon" />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
