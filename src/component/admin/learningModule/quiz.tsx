import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

const Quiz: React.FC = () => {
  const questions: Question[] = [
    {
      id: 1,
      question: 'What is the capital of France?',
      options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
      correctAnswer: 'Paris',
    },
    {
      id: 2,
      question: 'Which planet is known as the Red Planet?',
      options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
      correctAnswer: 'Mars',
    },
    // Add more questions here
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [score, setScore] = useState<number>(0);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setCurrentQuestion(currentQuestion + 1);
    setSelectedOption('');
  };

  const handleQuizSubmit = () => {
    alert('Quiz submitted successfully');
  };

  return (
    <div className="quiz-container">
      <h1>Quiz Time!</h1>
      {currentQuestion < questions.length ? (
        <div className="question-container">
          <h2>{questions[currentQuestion].question}</h2>
          <ol className="options-list">
            {questions[currentQuestion].options.map((option, index) => (
              <li key={index}>
                <label>
                  <input
                    type="radio"
                    name="quizOption"
                    value={option}
                    checked={selectedOption === option}
                    onChange={() => handleOptionSelect(option)}
                  />
                  {option}
                </label>
              </li>
            ))}
          </ol>
          <button className="next-button" onClick={handleNextQuestion}>
            Next Question
          </button>
          <Link to="/admin/lms/my-learning-assessment">
            <button className="cancel-button">Cancel</button>
          </Link>
        </div>
      ) : (
        <div className="result-container">
          <h2>Quiz Completed!</h2>
          <Link
            to="/admin/lms/my-learning-assessment"
            style={{ textDecoration: 'none', color: 'white' }}
            state={{ quizScore: score }}
          >
            <button className="submit-button" onClick={handleQuizSubmit}>
              Submit Quiz                                          
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Quiz;




