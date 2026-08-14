import React, { useState } from 'react';


const PollutionGame = ({ onComplete }) => {
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  const questions = [
    {
      question: "Which is a major cause of air pollution?",
      options: ["Planting trees", "Vehicle emissions", "Using bicycles", "Composting"],
      correct: 1
    },
    {
      question: "What is the main source of ocean plastic pollution?",
      options: ["Marine animals", "Land-based waste", "Underwater volcanoes", "Fishing nets"],
      correct: 1
    },
    {
      question: "Which of these reduces water pollution?",
      options: ["Dumping industrial waste", "Proper sewage treatment", "Using chemical fertilizers", "Oil spills"],
      correct: 1
    },
    {
      question: "What is NOT a type of pollution?",
      options: ["Air pollution", "Noise pollution", "Light pollution", "Plant pollution"],
      correct: 3
    },
    {
      question: "Which activity helps reduce pollution?",
      options: ["Burning trash", "Using single-use plastics", "Recycling materials", "Driving alone daily"],
      correct: 2
    }
  ];

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === questions[currentQuestion].correct) {
      setScore(score + 20);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setGameCompleted(true);
      if (onComplete) onComplete({
        completed: true,
        xp: score + (selectedIndex === questions[currentQuestion].correct ? 20 : 0)
      });
    }
  };

  const resetGame = () => {
    setScore(0);
    setGameCompleted(false);
    setCurrentQuestion(0);
  };

  return (
    <div className="pollution-game">
      <div className="game-header">
        <h2>🌍 Pollution Challenge</h2>
        <div className="score">Score: {score}</div>
      </div>
      
      {!gameCompleted ? (
        <div className="game-content">
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="question">
            <h3>{questions[currentQuestion].question}</h3>
          </div>
          
          <div className="options">
            {questions[currentQuestion].options.map((option, index) => (
              <button 
                key={index}
                className="option-btn"
                onClick={() => handleAnswer(index)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="completion-screen">
          <h3>✅ Challenge Completed!</h3>
          <p>Your final score: {score}/100</p>
          {score >= 80 ? (
            <p>Excellent! You're a pollution expert!</p>
          ) : score >= 60 ? (
            <p>Good job! You know about pollution!</p>
          ) : (
            <p>Keep learning about pollution prevention!</p>
          )}
          <button className="play-again" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default PollutionGame;