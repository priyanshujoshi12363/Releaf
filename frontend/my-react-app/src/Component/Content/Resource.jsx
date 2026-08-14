import React, { useState, useRef, useEffect } from 'react';
import { Quize2 } from '../quize/Quize2';
import NaturalGame from '../Game/game2';
import { addXp as submitXpToBackend, getUserId } from '../../api/index.js';


const Resources = () => {
    const [step, setStep] = useState(0);
    const [xpEarned, setXpEarned] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [videoWatched, setVideoWatched] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [notesRead, setNotesRead] = useState(false);

    const videoRef = useRef(null);
    const bgVideoRef = useRef(null);

    const sendXpToBackend = async (xp) => {
        try {
            const studentId = getUserId();
            if (!studentId) return;

            await submitXpToBackend({ xp, topic: "conservation", studentId });
        } catch (err) {
            console.error("Error sending XP:", err.message);
        }
    };

    // Load saved progress
    useEffect(() => {
        const savedProgress = localStorage.getItem('resources');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            setStep(progress.step || 0);
            setXpEarned(progress.xpEarned || 0);
            setVideoWatched(progress.videoWatched || false);
            setNotesRead(progress.notesRead || false);
            setQuizCompleted(progress.quizCompleted || false);
            setGameCompleted(progress.gameCompleted || false);
            setShowResults(progress.showResults || false);
        }
    }, []);

    // Save progress to localStorage
    useEffect(() => {
        const progress = { step, xpEarned, videoWatched, notesRead, quizCompleted, gameCompleted, showResults };
        localStorage.setItem('resources', JSON.stringify(progress));
    }, [step, xpEarned, videoWatched, notesRead, quizCompleted, gameCompleted, showResults]);

    // Module steps
    const steps = [
        { type: 'video', src: '/Natural.mp4', title: 'Natural Resources', duration: '3:54', xp: 20 },
        { type: 'notes', content: '💧 Notes: Learn about conservation and natural resources...', title: 'Conservation Notes', xp: 20 },
        {
            type: 'quiz', title: 'Quick Quiz', xp: 30,
            questions: [
                {
                    question: "Which of the following is an example of a non-renewable resource?",
                    options: ["Coal", "Water", "Forests", "Solar energy"],
                    correct: 0
                },
                {
                    question: "What is the main purpose of conservation of natural resources?",
                    options: ["To use them quickly", "To ensure sustainable use for future generations", "To increase pollution", "To destroy biodiversity"],
                    correct: 1
                },
                {
                    question: "Which practice helps conserve soil fertility?",
                    options: ["Overgrazing", "Crop rotation", "Deforestation", "Excessive chemical use"],
                    correct: 1
                },
                {
                    question: "Which of the following is a renewable natural resource?",
                    options: ["Petroleum", "Natural gas", "Wind energy", "Coal"],
                    correct: 2
                },
                {
                    question: "What is afforestation?",
                    options: ["Cutting down trees", "Growing trees in new areas", "Overusing forests", "Burning wood for energy"],
                    correct: 1
                },
                {
                    question: "Why is water conservation important?",
                    options: ["Because water is unlimited", "To ensure availability of clean water", "To increase industrial waste", "To promote deforestation"],
                    correct: 1
                },
                {
                    question: "Which human activity reduces forest cover the most?",
                    options: ["Logging and agriculture", "Using solar energy", "Recycling waste", "Planting trees"],
                    correct: 0
                },
                {
                    question: "What is the best way to conserve biodiversity?",
                    options: ["Destroying habitats", "Protecting natural habitats and wildlife", "Using fossil fuels", "Overfishing"],
                    correct: 1
                }
            ]
        },
        { type: 'game', title: 'Eco Sorting Game', xp: 30 }
    ];

    // Handle video end
    const handleVideoEnd = () => {
        if (!videoWatched) {
            setVideoWatched(true);
            addXp(steps[0].xp);
        }
    };

    const addXp = (amount) => setXpEarned(prev => prev + amount);

    const nextStep = () => {
        if (step === 0 && !videoWatched) return alert("Please watch the video first!");
        if (step === 1 && !notesRead) return alert("Please read the notes first!");
        if (step === 2 && !quizCompleted) return alert("Please complete the quiz first!");
        if (step === 3 && !gameCompleted) return alert("Please complete the game first!");

        if (step + 1 < steps.length) setStep(prev => prev + 1);
        else setShowResults(true);
    };

    const prevStep = () => setStep(prev => (prev - 1 >= 0 ? prev - 1 : prev));

    // ✅ Results Component
    const Results = () => {
        useEffect(() => {
            sendXpToBackend(xpEarned);
        }, []);

        return (
            <div className="results-container">
                <h2>🎊 Module Completed! 🎊</h2>
                <div className="xp-summary">
                    <h3>You earned {xpEarned} XP!</h3>
                    <div className="xp-breakdown">
                        <div className="xp-item"><span>Video watched:</span><span>+{steps[0].xp} XP</span></div>
                        <div className="xp-item"><span>Notes read:</span><span>+{steps[1].xp} XP</span></div>
                        <div className="xp-item"><span>Quiz completed:</span><span>+{steps[2].xp} XP</span></div>
                        <div className="xp-item"><span>Game finished:</span><span>+{steps[3].xp} XP</span></div>
                        <div className="xp-total"><span>Total:</span><span>{xpEarned} XP</span></div>
                    </div>
                </div>
                <button className="continue-btn" onClick={() => window.location.href = '/learn'}>
                    Continue to Next Module
                </button>
            </div>
        );
    };

    return (
        <div className="learning-module">
            {/* Background video */}
            <video ref={bgVideoRef} autoPlay muted loop playsInline className="background-video">
                <source src="/space.mp4" type="video/mp4" />
            </video>

            <div className="content-overlay">
                <nav className="navbar">
                    <div className="heading">
                        <img src="/logo.gif" alt="ReLeaf Logo" className="logo-gif" />
                        <ul><li>{steps[step].title}</li></ul>
                    </div>
                    <div className="xp-display"><span>{xpEarned} XP</span></div>
                </nav>

                <div className="module-content">
                    {showResults ? <Results /> : (
                        <>
                            {/* Video step */}
                            {steps[step].type === 'video' && (
                                <div className="video-container">
                                    <video
                                        ref={videoRef}
                                        controls
                                        playsInline
                                        preload="auto"
                                        className="content-video"
                                        onEnded={handleVideoEnd}
                                    >
                                        <source src="/Natural.mp4" type="video/mp4" />
                                    </video>
                                    {videoWatched && <div className="completion-badge">✅ Video watched! +{steps[step].xp} XP</div>}
                                </div>
                            )}

                            {/* Notes step */}
                            {steps[step].type === 'notes' && (
                                <div className="notes-container">
                                    <h3>Study Notes</h3>
                                    <div className="notes-content">
                                        <p>{steps[step].content}</p>
                                        <p>Natural Resources – The natural components of the environment that exist without human intervention (air, water, soil, plants, animals, fossil fuels). </p>
                                        <p>  Types:</p>

                                        <p>  Renewable – Infinite and reusable (water, wind, forests). </p>

                                        <p>  Non-renewable – Limited, exhaustible (fossil fuels, minerals).</p>
                                        Top 5 Natural Resources:
                                        Air – Needed for life, protect from pollution.
                                        Water – Only 2% is fresh, must save it.
                                        Soil – Helps plants grow.
                                        Iron – Used in weapons, transport, buildings.
                                        Forests – Provide clean air, maintain ecology.
                                        Non-Renewable Examples:
                                        Fossil fuels – Exhaustible, pollute air.
                                        Water – Limited freshwater, climate change reduces it.
                                        Air – Pollution harms health.
                                        Conservation Tips:
                                        Reduce vehicle use.
                                        Save water.
                                    </div>
                                    {!notesRead ? (
                                        <button
                                            className="read-complete-btn"
                                            onClick={() => {
                                                setNotesRead(true);
                                                addXp(steps[step].xp);
                                            }}
                                        >
                                            Mark as Read
                                        </button>
                                    ) : (
                                        <div className="completion-badge">✅ Notes read! +{steps[step].xp}XP</div>
                                    )}
                                </div>
                            )}

                            {/* Quiz step */}
                            {steps[step].type === 'quiz' && (
                                <Quize2
                                    questions={steps[step].questions || []}
                                    onComplete={() => {
                                        setQuizCompleted(true);
                                        addXp(steps[step].xp);
                                    }}
                                />
                            )}

                            {/* Game step */}
                            {steps[step].type === 'game' && (
                                // In your Resources component, add logging
                                <NaturalGame
                                    onComplete={(result) => {
                                        setGameCompleted(result.completed);
                                        addXp(result.xp);
                                    }}
                                />
                            )}
                        </>
                    )}
                </div>

                {!showResults && (
                    <div className="module-controls">
                        <button onClick={prevStep} disabled={step === 0}>⬅ Previous</button>
                        <button onClick={nextStep}>
                            {step === steps.length - 1 ? 'Finish Module' : 'Next ➡'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Resources;
