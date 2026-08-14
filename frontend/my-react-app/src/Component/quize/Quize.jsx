import { useState  } from "react";


export const Quiz = ({ questions, onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (i) => {
    setSelected(i);

    if (i === questions[currentQ].correct) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQ + 1 < questions.length) {
        setCurrentQ((prev) => prev + 1);
        setSelected(null);
      } else {
        setFinished(true);
        onComplete(); // inform parent (Intro)
      }
    }, 1000);
  };

  if (finished) {
    return (
      <div className="quiz-container">
        <h3>🎉 Quiz Completed!</h3>
        <p>Your score: {score}/{questions.length}</p>
        <div className="quiz-progress">✅ +30 XP earned!</div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h3>Question {currentQ + 1} of {questions.length}</h3>
      <div className="question">{questions[currentQ].question}</div>

      <div className="options">
        {questions[currentQ].options.map((opt, i) => (
          <button
            key={i}
            className={`option-btn ${
              selected !== null
                ? i === questions[currentQ].correct
                  ? "correct"
                  : selected === i
                  ? "incorrect"
                  : ""
                : ""
            }`}
            onClick={() => handleAnswer(i)}
            disabled={selected !== null}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="quiz-progress">
        Score: {score} | Progress: {currentQ + 1}/{questions.length}
      </div>
    </div>
  );
};
