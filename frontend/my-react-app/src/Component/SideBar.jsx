import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPlayer, logout } from "../api/index.js";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const navigate = useNavigate()
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

  const handleLogout = () => {
    logout();
    navigate("/dashboard");
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <button className="nav-icon menu-toggle" onClick={() => setIsOpen(true)}>
          <Menu size={22} />
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="overlay"
        />
      )}

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="glass-sidebar"
      >
        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-header">
            <div className="avatar-container">
              <div className="avatar">
                {student?.Avatar?.url ? (
                  <img
                    src={student.Avatar.url}
                    alt="avatar"
                    className="avatar-img"
                  />
                ) : (
                  <div className="avatar-placeholder">👤</div>
                )}
              </div>
              <div className="online-indicator"></div>
            </div>
            <h2 className="profile-name">{student?.PlayerName || "Loading..."}</h2>
            <p className="profile-status">Premium Member</p>
          </div>

          <div className="profile-details">
            <div className="profile-detail">
              📧 <span>{student?.email || "loading..."}</span>
            </div>
            <div className="profile-detail">
              📞 <span>{student?.PhoneNO || "loading..."}</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
           <button className="nav-link large-link"  onClick={() => navigate("/achievement")}>
            <span className="nav-icon-large">📊</span>
            <span className="nav-text">Achievements</span>
          </button>

          <button className="nav-link large-link" onClick={() => navigate("/clan")}>
            <span className="nav-icon-large">🎯</span>
            <span className="nav-text">Clan</span>
          </button>

          <button className="nav-link large-link" onClick={() => navigate("/leaderboard")}>
            <span className="nav-icon-large">🏆</span>
            <span className="nav-text">Leaderboard</span>
          </button>

          <button className="nav-link large-link"onClick={() => navigate("/earthfact")}>
            <span className="nav-icon-large">👤</span>
            <span className="nav-text">World Map</span>
          </button>

          <button className="nav-link large-link" onClick={() => navigate("/quize")}>
            <span className="nav-icon-large">⚙️</span>
            <span className="nav-text">Quize</span>
          </button>

        </nav>

        {/* Bottom Section */}
        <div className="sidebar-bottom">
          <button className="bottom-button large-button" onClick={() => navigate("/bot")}>
            <Settings size={24} className="button-icon" />
            <span>EcoBot</span>
          </button>
          <button className="bottom-button large-button logout">
            <LogOut size={24} className="button-icon" />
            <span>Setting</span>
          </button>
          <button className="bottom-button large-button logout" onClick={handleLogout}>
            <LogOut size={24} className="button-icon" />
            <span>Logout</span>
          </button>
        </div>

        {/* Close Button */}
        <button onClick={() => setIsOpen(false)} className="close-button">
          <X size={24} />
        </button>
      </motion.div>

      {/* CSS */}
      <style jsx>{`
        .avatar-container {
          position: relative;
          width: 60px;
          height: 60px;
        }

        .avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          background-color: #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .online-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          background-color: #4caf50;
          border: 2px solid white;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
