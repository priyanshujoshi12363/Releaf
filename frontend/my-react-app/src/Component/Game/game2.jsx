import React, { useState } from 'react';


const NaturalGame = ({ onComplete }) => {
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  const questions = [
    {
      question: "What is NOT a natural resource?",
      options: ["Coal", "Solar Power", "Forest", "Water"],
      correct: 1
    },
    {
      question: "Which of these is a conservation method?",
      options: ["Oil drilling", "Deforestation", "Recycling", "Mining"],
      correct: 2
    },
    {
      question: "Which resource is renewable?",
      options: ["Natural Gas", "Coal", "Wind", "Oil"],
      correct: 2
    },
    {
      question: "What helps protect our natural resources?",
      options: ["Using plastic bags", "Leaving lights on", "Water conservation", "Driving alone"],
      correct: 2
    }
  ];

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === questions[currentQuestion].correct) {
      setScore(score + 25);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const finalCompleted = true;
      const finalXp = score + (selectedIndex === questions[currentQuestion].correct ? 25 : 0);
      
      setGameCompleted(finalCompleted);
      
      // Call onComplete with the expected object structure
      if (onComplete) {
        onComplete({
          completed: finalCompleted,
          xp: finalXp
        });
      }
    }
  };

  const resetGame = () => {
    setScore(0);
    setGameCompleted(false);
    setCurrentQuestion(0);
  };

  return (
    <div className="natural-game">
      <div className="game-header">
        <h2>🌿 Natural Resources Quiz</h2>
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
          <h3>🎉 Quiz Completed!</h3>
          <p>Your final score: {score}/100</p>
          {score >= 75 ? (
            <p>Great job! You know about natural resources!</p>
          ) : (
            <p>Keep learning about natural resources!</p>
          )}
          <button className="play-again" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default NaturalGame;