import React, { useState } from 'react';


const ClimateGame = ({ onComplete }) => {
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  const questions = [
    {
      question: "What is the main cause of current climate change?",
      options: ["Natural cycles", "Human activities", "Volcanic eruptions", "Solar fluctuations"],
      correct: 1
    },
    {
      question: "Which greenhouse gas is most responsible for global warming?",
      options: ["Methane", "Carbon Dioxide", "Nitrous Oxide", "Water Vapor"],
      correct: 1
    },
    {
      question: "What is a major effect of climate change on oceans?",
      options: ["Decreased acidity", "Sea level fall", "Ocean cooling", "Coral bleaching"],
      correct: 3
    },
    {
      question: "Which action helps reduce climate change?",
      options: ["Deforestation", "Using fossil fuels", "Renewable energy", "Industrial farming"],
      correct: 2
    },
    {
      question: "What does the term 'carbon footprint' refer to?",
      options: ["The mark your shoe leaves", "Amount of CO2 released by activities", "A type of pollution", "Measuring tree sizes"],
      correct: 1
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
    <div className="climate-game">
      <div className="game-header">
        <h2>🌤️ Climate Challenge</h2>
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
            <p>Excellent! You're a climate expert!</p>
          ) : score >= 60 ? (
            <p>Good job! You understand climate change!</p>
          ) : (
            <p>Keep learning about climate solutions!</p>
          )}
          <button className="play-again" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ClimateGame;