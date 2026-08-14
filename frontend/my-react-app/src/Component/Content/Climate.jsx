import React, { useState, useRef, useEffect } from 'react';
import { Quize4 } from '../quize/Quize4';
import ClimateGame from '../Game/game4';
import { addXp as submitXpToBackend, getUserId } from '../../api/index.js';


const Climate = () => {
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

            await submitXpToBackend({ xp, topic: "climate", studentId });
        } catch (err) {
            console.error("Error sending XP:", err.message);
        }
    };

    // Load saved progress
    useEffect(() => {
        const savedProgress = localStorage.getItem('climate');
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
        localStorage.setItem('climate', JSON.stringify(progress));
    }, [step, xpEarned, videoWatched, notesRead, quizCompleted, gameCompleted, showResults]);

    // Module steps
    const steps = [
        { type: 'video', src: '/Climate.mp4', title: 'Climate', duration: '4:59', xp: 20 },
        { type: 'notes', content: '💧 Notes: Learn about Climate', title: 'Conservation Notes', xp: 20 },
        {
            type: 'quiz', title: 'Quick Quiz', xp: 30,
            questions: [
                {
                    question: "What is the primary cause of current global climate change?",
                    options: ["Natural Earth cycle", "Human activities releasing greenhouse gases", "Changes in solar radiation", "Volcanic eruptions"],
                    correct: 1
                },
                {
                    question: "Which of the following is a major consequence of climate change?",
                    options: ["Decreased sea levels", "More predictable weather patterns", "Increased frequency of extreme weather events", "Global cooling"],
                    correct: 2
                },
                {
                    question: "What is the main greenhouse gas responsible for trapping heat in the atmosphere?",
                    options: ["Oxygen (O₂)", "Nitrogen (N₂)", "Carbon Dioxide (CO₂)", "Argon (Ar)"],
                    correct: 2
                },
                {
                    question: "Which action is most effective in mitigating climate change?",
                    options: ["Increasing deforestation", "Transitioning to renewable energy sources", "Expanding fossil fuel use", "Increasing industrial agriculture"],
                    correct: 1
                },
                {
                    question: "What is the term for the long-term shift in global weather patterns and average temperatures?",
                    options: ["Seasonal change", "Climate change", "Weather variation", "Atmospheric fluctuation"],
                    correct: 1
                },
                {
                    question: "Which phenomenon is directly linked to melting polar ice caps due to climate change?",
                    options: ["Decreased ocean acidity", "Lower sea levels", "Coastal erosion and sea level rise", "Formation of new glaciers"],
                    correct: 2
                },
                {
                    question: "What does the term 'carbon footprint' refer to?",
                    options: ["The amount of carbon in soil", "Total greenhouse gas emissions caused by an individual or organization", "The weight of carbon molecules", "A measurement of fossil fuel reserves"],
                    correct: 1
                },
                {
                    question: "Which international agreement aims to limit global warming to well below 2°C?",
                    options: ["Kyoto Protocol", "Paris Agreement", "Montreal Protocol", "Geneva Convention"],
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
                                        <source src="/Climate.mp4" type="video/mp4" />
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
                                        <p>Climate change refers to long-term shifts in Earth's weather patterns, primarily caused by greenhouse gases like CO₂ from human </p>

<p>
This leads to global warming, where these gases trap heat, acting like a blanket around the planet. The major challenges this creates include:</p>
<p>
Melting ice and rising sea levels, threatening coastal cities and animal habitats.
</p><p>
More extreme weather like storms, droughts, and wildfires.
</p> <p>
Threats to animals and food/water supplies as environments change.</p>


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
                                <Quize4
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
                                <ClimateGame
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

export default Climate;
