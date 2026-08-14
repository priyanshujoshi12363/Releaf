import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClan, joinClan } from "../../api/index.js";
const Clan = () => {
    const navigate = useNavigate()
    const [stage, setStage] = useState("welcome"); // welcome | create | join | clan
    const [clanName, setClanName] = useState("");
    const [description, setDescription] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [clanCode, setClanCode] = useState("");

const handleCreateClan = async () => {
  if (!clanName || !description || !avatar) {
    alert("Please fill all details!");
    return;
  }

  try {
    const data = await createClan({ clanName, desc: description, avatar });

    alert("Clan created successfully!");
    setClanName(data.clan.clanName);
    setDescription(data.clan.desc);
    setAvatar(data.clan.avatar.url); // show uploaded avatar
    setStage("clan");
  } catch (error) {
    console.error("Error creating clan:", error.message);
    alert(error.message || "Something went wrong!");
  }
};


    const handleJoinClan = async () => {
        if (!clanCode) {
            alert("Enter clan code!");
            return;
        }

        try {
            const data = await joinClan({ clanCode });
            setClanName(data.clan.clanName);
            setDescription(data.clan.desc);
            setAvatar(data.clan.avatar?.url ?? null);
            setStage("clan");
        } catch (error) {
            console.error("Error joining clan:", error.message);
            alert(error.message || "Could not join that clan.");
        }
    };

    const handleLeaveClan = () => {
        setClanName("");
        setDescription("");
        setAvatar(null);
        setClanCode("");
        setStage("welcome");
    };

    return (
        <div className="clan-page">

            {/* 🔥 Background video */}
            <video className="clan-bg-video" autoPlay loop muted playsInline>
                <source src="/sunny.mp4" type="video/mp4" />
            </video>
            <div className="clan-overlay" />
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
            <div className="clan-container">
                {stage === "welcome" && (
                    <div className="clan-card">
                        <h1>🏕 Welcome to Clans</h1>
                        <p>Join or create a clan to learn together & earn XP as a team.</p>
                        <div className="btn-group">
                            <button className="btn" onClick={() => setStage("create")}>Create Clan</button>
                            <button className="btn" onClick={() => setStage("join")}>Join Clan</button>
                        </div>
                    </div>
                )}

                {stage === "create" && (
                    <div className="clan-card">
                        <h2>Create New Clan</h2>
                        <input
                            type="text"
                            placeholder="Clan Name"
                            value={clanName}
                            onChange={(e) => setClanName(e.target.value)}
                        />
                        <textarea
                            placeholder="Clan Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAvatar(e.target.files[0])}
                        />
                        {avatar && (
                            <img src={URL.createObjectURL(avatar)} alt="Avatar" className="clan-avatar-preview" />
                        )}

                        <button onClick={handleCreateClan}>Enter Clan</button>
                        <button onClick={() => setStage("welcome")}>⬅ Back</button>
                    </div>
                )}

                {stage === "join" && (
                    <div className="clan-card">
                        <h2>Join Clan</h2>
                        <input
                            type="text"
                            placeholder="Enter Clan Code"
                            value={clanCode}
                            onChange={(e) => setClanCode(e.target.value)}
                        />
                        <button onClick={handleJoinClan}>Join</button>
                        <button onClick={() => setStage("welcome")}>⬅ Back</button>
                    </div>
                )}

                {stage === "clan" && (
                    <div className="clan-card">
                        <h2>{clanName}</h2>
                        {avatar && (
                            <img src={avatar} alt="Clan Avatar" className="clan-avatar" />
                        )}
                        <p>{description}</p>
                        <h3>Members</h3>
                        <ul>
                            <li>You (Leader)</li>
                            <li>Eco Friend 1</li>
                            <li>Eco Friend 2</li>
                        </ul>
                        <p>Clan XP: 250</p>
                        <button onClick={handleLeaveClan}>Leave Clan</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Clan;

