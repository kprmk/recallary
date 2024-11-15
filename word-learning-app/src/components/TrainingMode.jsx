import React, { useState, useEffect } from 'react';

function TrainingMode({ words }) {
  const [currentWord, setCurrentWord] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);

  // Выбор случайного слова
  const getRandomWord = () => {
    if (words.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  };

  // Перемешивание букв
  const shuffleWord = (word) => {
    return word.split('').sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const word = getRandomWord();
    setCurrentWord(word);
    if (word) {
      setShuffledLetters(shuffleWord(word.english));
    }
  }, [words]);

  // Обработка ввода с клавиатуры
  const handleKeyboardInput = (e) => {
    setUserInput(e.target.value);
    checkAnswer(e.target.value);
  };

  // Обработка клика по букве
  const handleLetterClick = (letter, index) => {
    const newSelected = [...selectedLetters, letter];
    setSelectedLetters(newSelected);
    checkAnswer(newSelected.join(''));
  };

  // Проверка ответа
  const checkAnswer = (answer) => {
    if (currentWord && answer.toLowerCase() === currentWord.english.toLowerCase()) {
      alert('Правильно!');
      // Переход к следующему слову
      const newWord = getRandomWord();
      setCurrentWord(newWord);
      if (newWord) {
        setShuffledLetters(shuffleWord(newWord.english));
      }
      setUserInput('');
      setSelectedLetters([]);
    }
  };

  if (!currentWord) {
    return <div>Добавьте слова для начала тренировки</div>;
  }

  return (
    <div>
      <h2>Тренировка</h2>
      <div>
        <p>Переведите слово: {currentWord.russian}</p>
        
        {/* Ввод с клавиатуры */}
        <input
          type="text"
          value={userInput}
          onChange={handleKeyboardInput}
          placeholder="Введите перевод"
        />

        {/* Интерактивные буквы */}
        <div className="letters-container">
          {shuffledLetters.map((letter, index) => (
            <button
              key={index}
              onClick={() => handleLetterClick(letter, index)}
              disabled={selectedLetters.includes(letter)}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Отображение собранного слова */}
        <div className="selected-letters">
          {selectedLetters.join('')}
        </div>
      </div>
    </div>
  );
}

export default TrainingMode;