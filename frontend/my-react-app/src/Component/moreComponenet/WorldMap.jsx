import React, { useRef, useState, useEffect } from "react";
import Globe from "react-globe.gl";
import { useNavigate } from "react-router-dom";

// Example facts data
const FACTS = [
    { level: 1, title: "Blue Planet", desc: "Earth is 71% water.", lat: 0, lng: -140 },
    { level: 2, title: "Atmosphere", desc: "78% Nitrogen, 21% Oxygen.", lat: 20, lng: 78 },
    { level: 3, title: "Magnetosphere", desc: "Protects us from solar wind.", lat: 52, lng: -3 },
    { level: 4, title: "Carbon Sink", desc: "Oceans absorb CO₂.", lat: -33, lng: -71 },
    { level: 5, title: "Biosphere", desc: "Life thrives everywhere.", lat: 35, lng: 135 },
];

const EarthFacts = ({ level = 1 }) => {
    const navigate = useNavigate()
    const globeEl = useRef();
    const [selected, setSelected] = useState(null);

    // Unlocked facts according to level
    const unlockedFacts = FACTS.filter((f) => f.level <= level);

    // Optional: auto-rotate globe
    useEffect(() => {
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.6;
        }
    }, []);

    return (
        <div className="earth-wrapper">
            {/* Top bar with back + level */}
            <div className="earth-topbar">
                <h2 className="level-text">🌍 Level {level}</h2>
                {/* Back button overlay on globe */}
                <button className="earth-back-btn" onClick={() => navigate("/maindashboard")}>
                    ⬅ Back to Dashboard
                </button>
            </div>

            {/* 3D Globe */}
            <Globe
                ref={globeEl}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                labelsData={unlockedFacts}
                labelLat={(d) => d.lat}
                labelLng={(d) => d.lng}
                labelText={(d) => d.title}
                labelSize={2.5}
                labelDotRadius={0.4}
                labelColor={() => "lime"}
                labelResolution={2}
                onLabelClick={(fact) => setSelected(fact)}
            />

            {/* Fact Box */}
            <div className="fact-box">
                {selected ? (
                    <>
                        <h3>{selected.title}</h3>
                        <p>{selected.desc}</p>
                    </>
                ) : (
                    <p>🔎 Click on a marker to unlock a fact.</p>
                )}
            </div>
        </div>
    );
};

export default EarthFacts;
