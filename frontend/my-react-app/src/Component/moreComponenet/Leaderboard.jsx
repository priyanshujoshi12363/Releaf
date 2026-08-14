import React from "react";
import { useNavigate } from "react-router-dom";

const fakeData = [
  { rank: 1, name: "Priyanshu", score: 980 },
  { rank: 2, name: "Ananya", score: 920 },
  { rank: 3, name: "Rohan", score: 870 },
  { rank: 4, name: "Meera", score: 820 },
  { rank: 5, name: "Arjun", score: 780 },
];

const Leaderboard = () => {
    const navigate = useNavigate()
  return (

    <div className="leaderboard-container">
    <video autoPlay loop muted playsInline className="background-video">
       <source src="/sunny.mp4" type="video/mp4" />

        Your browser does not support the video tag.
      </video>
      <h2 className="leaderboard-title">🏆 Leaderboard</h2>
      <div className="leaderboard-card">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {fakeData.map((player) => (
              <tr key={player.rank} className="leaderboard-row">
                <td>#{player.rank}</td>
                <td>{player.name}</td>
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <button className="btn" onClick={() => navigate("/maindashboard")}>
        Back to Dashboard
      </button>
    </div>
     
  );
};

export default Leaderboard;
