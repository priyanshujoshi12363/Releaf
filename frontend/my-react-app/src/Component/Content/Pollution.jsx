import React, { useState, useRef, useEffect } from 'react';
import { Quize3 } from '../quize/Quize3';
import PollutionGame from '../Game/game3';
import { addXp as submitXpToBackend, getUserId } from '../../api/index.js';


const Pollution = () => {
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

            await submitXpToBackend({ xp, topic: "pollution", studentId });
        } catch (err) {
            console.error("Error sending XP:", err.message);
        }
    };

    // Load saved progress
    useEffect(() => {
        const savedProgress = localStorage.getItem('pollution');
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
        localStorage.setItem('pollution', JSON.stringify(progress));
    }, [step, xpEarned, videoWatched, notesRead, quizCompleted, gameCompleted, showResults]);

    // Module steps
    const steps = [
        { type: 'video', src: '/Pollution.mp4', title: 'pollution', duration: '4:46', xp: 20 },
        { type: 'notes', content: '💧 Notes: Learn about pollution', title: 'Conservation Notes', xp: 20 },
        {
            type: 'quiz', title: 'Quick Quiz', xp: 30,
            questions: [
                {
                    question: "Which of the following is a major cause of air pollution?",
                    options: ["Planting trees", "Burning fossil fuels", "Using solar panels", "Composting waste"],
                    correct: 1
                },
                {
                    question: "What is the primary greenhouse gas contributing to global warming?",
                    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"],
                    correct: 2
                },
                {
                    question: "Which type of pollution is caused by excessive noise from traffic and industries?",
                    options: ["Water Pollution", "Soil Pollution", "Noise Pollution", "Thermal Pollution"],
                    correct: 2
                },
                {
                    question: "What is the process of converting waste materials into reusable objects called?",
                    options: ["Incineration", "Recycling", "Landfilling", "Dumping"],
                    correct: 1
                },
                {
                    question: "Which of the following is a common source of water pollution?",
                    options: ["Organic farming", "Industrial waste discharge", "Reforestation", "Wind energy"],
                    correct: 1
                },
                {
                    question: "What is the term for rain that has become acidic due to atmospheric pollution?",
                    options: ["Basic Rain", "Acid Rain", "Alkaline Rain", "Neutral Rain"],
                    correct: 1
                },
                {
                    question: "Which pollutant from car exhausts can interfere with blood's ability to carry oxygen?",
                    options: ["Carbon Monoxide", "Water Vapor", "Nitrogen", "Carbon Dioxide"],
                    correct: 0
                },
                {
                    question: "What is the accumulation of plastic products in the environment that adversely affects wildlife called?",
                    options: ["Plastic Synthesis", "Plastic Degradation", "Plastic Pollution", "Plastic Fusion"],
                    correct: 2
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
                                        <source src="/Pollution.mp4" type="video/mp4" />
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
                                        <p>Environmental pollution encompasses contamination of air, water, and soil from both natural and human activities. Air pollution arises from sources like vehicles and industries, releasing harmful pollutants (CO, NO₂, SO₂) that cause respiratory issues in humans, damage plants, and corrode materials. Control measures include using cleaner fuels and pollution control devices. Noise pollution from industrial and transport sources leads to hearing loss and stress, managed through barriers and silence zones. Soil and water pollution result from industrial waste, chemicals, and sewage, degrading ecosystems and health, controlled by recycling, composting, and stricter laws. Global challenges like warming (from greenhouse gases) and ozone depletion (from CFCs) cause climate change and health risks, requiring reduced emissions and international efforts. Acid rain, formed by SOx and NOx, harms health and structures, mitigated by emission controls. Solid waste is managed via the 3Rs (Reduce, Reuse, Recycle), landfills, incineration, and composting to minimize environmental impact.</p>


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
                                <Quize3
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
                                <PollutionGame
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

export default Pollution;
