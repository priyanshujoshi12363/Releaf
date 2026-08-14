import React, { useState, useRef, useEffect } from 'react';
import { Quiz } from '../quize/Quize.jsx';
import { SortingGame } from '../Game/game1.jsx';
import { addXp as submitXpToBackend, getUserId } from '../../api/index.js';

const Intro = () => {
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

      await submitXpToBackend({ xp, topic: "introduction", studentId });
    } catch (err) {
      console.error("Error sending XP:", err.message);
    }
  };

  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('introduction');
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

  // Save progress to localStorage whenever state changes
  useEffect(() => {
    const progress = {
      step,
      xpEarned,
      videoWatched,
      notesRead,
      quizCompleted,
      gameCompleted,
      showResults
    };
    localStorage.setItem('introduction', JSON.stringify(progress));
  }, [step, xpEarned, videoWatched, notesRead, quizCompleted, gameCompleted, showResults]);

  // Each step: video, notes, quiz, game
  const steps = [
    { type: 'video', src: '/environment1.mp4', title: 'Introduction Video', duration: '2:30', xp: 20 },
    { type: 'notes', content: '🌱 Notes: Learn about environment basics...', title: 'Environmental Basics', xp: 20 },
    {
      type: 'quiz', content: '📝 Quiz: Test your knowledge!', title: 'Quick Quiz', xp: 30,
      questions: [
        { question: "What is the primary cause of global warming?", options: ["Solar radiation", "Greenhouse gases", "Ocean currents", "Volcanic activity"], correct: 1 },
        { question: "Which of these is a renewable resource?", options: ["Coal", "Natural gas", "Solar energy", "Petroleum"], correct: 2 },
        { question: "Which gas is most responsible for the greenhouse effect?", options: ["Oxygen (O₂)", "Carbon Dioxide (CO₂)", "Nitrogen (N₂)", "Helium (He)"], correct: 1 },
        { question: "What is the process of converting waste materials into new products called?", options: ["Incineration", "Composting", "Landfilling", "Recycling"], correct: 3 },
        { question: "Which human activity is a major cause of deforestation?", options: ["Swimming", "Cycling to work", "Agriculture and logging", "Using renewable energy"], correct: 2 },
        { question: "What is the term for the variety of life in a particular habitat or ecosystem?", options: ["Sustainability", "Ecology", "Biodiversity", "Conservation"], correct: 2 },
        { question: "Which of these is a major source of water pollution?", options: ["Planting trees", "Agricultural runoff and pesticides", "Using solar panels", "Composting food scraps"], correct: 1 },
        { question: "What does the 'three R's' mantra in waste management stand for?", options: ["Run, Relax, Read", "Reduce, Reuse, Recycle", "Rest, Recover, Rebuild", "Review, Revise, Repeat"], correct: 1 }
      ],
    },
    { type: 'game', content: '🎮 Game: Play to learn!', title: 'Eco Sorting Game', xp: 30 }
  ];

  // Handle video ended event
  const handleVideoEnd = () => {
    setVideoWatched(true);
    addXp(steps[0].xp);
  };

  // Add XP to total
  const addXp = (amount) => {
    setXpEarned(prev => prev + amount);
  };

  const nextStep = () => {
    if (step === 0 && !videoWatched) { alert("Please watch the video first!"); return; }
    if (step === 1 && !notesRead) { alert("Please read the notes first!"); return; }
    if (step === 2 && !quizCompleted) { alert("Please complete the quiz first!"); return; }
    if (step === 3 && !gameCompleted) { alert("Please complete the game first!"); return; }

    if (step + 1 < steps.length) setStep(prev => prev + 1);
    else setShowResults(true); // finished
  };

  const prevStep = () => setStep(prev => (prev - 1 >= 0 ? prev - 1 : prev));

  // ✅ Results Component
  const Results = () => {
    useEffect(() => {
      sendXpToBackend(xpEarned); // send XP when results page is shown
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
            <ul><li>{steps[step].title || "Introduction to environment"}</li></ul>
          </div>
          <div className="xp-display">
            <span className="xp-counter">{xpEarned} XP</span>
          </div>
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
                    className="content-video"
                    onEnded={handleVideoEnd}
                  >
                    <source src={steps[step].src} type="video/mp4" />
                  </video>
                  <div className="video-controls">
                    <button onClick={() => videoRef.current.play()}>Play</button>
                    <button onClick={() => videoRef.current.pause()}>Pause</button>
                    <span className="video-duration">{steps[step].duration}</span>
                  </div>
                  {videoWatched && (
                    <div className="completion-badge">✅ Video watched! +{steps[step].xp}XP</div>
                  )}
                </div>
              )}

              {/* Notes step */}
              {steps[step].type === 'notes' && (
                <div className="notes-container">
                  <h3>Study Notes</h3>
                  <div className="notes-content">
                    <p>{steps[step].content}</p>
                    <p>The air we breathe, the water we drink ... all constitute the environment.</p>
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
                <Quiz
                  questions={steps[step].questions || []}
                  onComplete={() => {
                    setQuizCompleted(true);
                    addXp(steps[step].xp);
                  }}
                />
              )}

              {/* Game step */}
              {steps[step].type === 'game' && (
                <SortingGame
  onComplete={(result) => {
    setGameCompleted(result.completed); // ✅ now true
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
            <div className="progress-indicator">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`progress-dot ${i === step ? 'active' : ''} ${(i === 0 && videoWatched) ||
                    (i === 1 && notesRead) ||
                    (i === 2 && quizCompleted) ||
                    (i === 3 && gameCompleted) ? 'completed' : ''
                    }`}
                ></div>
              ))}
            </div>
            <button onClick={nextStep}>
              {step === steps.length - 1 ? 'Finish Module' : 'Next ➡'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Intro;
