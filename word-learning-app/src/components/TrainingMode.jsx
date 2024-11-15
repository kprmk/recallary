import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../styles/TrainingMode.css';
import { getRandomWords } from '../scripts/utils'; // Импортируем функцию

function TrainingMode({ words }) {
  const [currentWord, setCurrentWord] = useState(null);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);

  // Перемешивание букв
  const shuffleWord = (word) => {
    const letters = word.split('').map((letter, index) => ({
      id: `${letter}-${index}`,
      content: letter
    }));
    
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    
    return letters;
  };

  useEffect(() => {
    const randomWords = getRandomWords(words);
    const word = randomWords.length > 0 ? randomWords[Math.floor(Math.random() * randomWords.length)] : null;
    setCurrentWord(word);
    if (word) {
      setShuffledLetters(shuffleWord(word.english));
    }
    setSelectedLetters([]);
    setIsCorrect(false);
  }, []); // Зависимость изменена на пустой массив, чтобы использовать только по умолчанию

  // Обработка нажатия клавиш
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Проверяем, что фокус не на элементах ввода
      if (e.target.tagName === 'INPUT' || !currentWord) return;

      const pressedKey = e.key.toLowerCase();
      // Проверяем, есть ли такая буква среди доступных
      const availableLetter = shuffledLetters.find(l => l.content.toLowerCase() === pressedKey);

      if (availableLetter) {
        // Если буква есть, добавляем её к выбранным
        const letterIndex = shuffledLetters.indexOf(availableLetter);
        handleLetterClick(availableLetter, letterIndex);
      } else {
        // Если буквы нет или она уже использована, показываем ошибку
        handleError();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [currentWord, shuffledLetters]);

  // Обработка ошибки
  const handleError = () => {
    setIsError(true);
    // Возвращаем все буквы обратно
    const allLetters = [...shuffledLetters, ...selectedLetters];
    setShuffledLetters(shuffleWord(currentWord.english));
    setSelectedLetters([]);
    setTimeout(() => setIsError(false), 1500);
  };

  // Обработка клика по букве
  const handleLetterClick = (letter, index) => {
    setIsError(false);
    const newShuffled = [...shuffledLetters];
    newShuffled.splice(index, 1);
    setShuffledLetters(newShuffled);
    
    const newSelected = [...selectedLetters, letter];
    setSelectedLetters(newSelected);
    
    const composedWord = newSelected.map(l => l.content).join('').toLowerCase();
    const targetWord = currentWord.english.toLowerCase();
    
    // Проверяем, является ли текущая последовательность началом целевого слова
    if (!targetWord.startsWith(composedWord)) {
      handleError();
      return;
    }
    
    // Если слово собрано полностью, проверяем правильность
    if (composedWord === targetWord) {
      handleCorrectAnswer();
    }
  };

  // Обработка правильного ответа
  const handleCorrectAnswer = () => {
    setIsCorrect(true);
    setTimeout(() => {
      const newWord = getRandomWords(words);
      setCurrentWord(newWord);
      if (newWord) {
        setShuffledLetters(shuffleWord(newWord.english));
      }
      setSelectedLetters([]);
      setIsCorrect(false);
    }, 1000);
  };

  // Добавляем функцию handleDragEnd
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === 'available' && destination.droppableId === 'selected') {
      const letter = shuffledLetters[source.index];
      const newSelected = [...selectedLetters, letter];
      const composedWord = newSelected.map(l => l.content).join('').toLowerCase();
      const targetWord = currentWord.english.toLowerCase();

      // Проверяем, является ли текущая последовательность началом целевого слова
      if (!targetWord.startsWith(composedWord)) {
        handleError();
        return;
      }

      setSelectedLetters(newSelected);
      setShuffledLetters(shuffledLetters.filter((_, index) => index !== source.index));

      // Если слово собрано полностью, проверяем правильность
      if (composedWord === targetWord) {
        handleCorrectAnswer();
      }
    } else if (source.droppableId === 'selected' && destination.droppableId === 'available') {
      const letter = selectedLetters[source.index];
      setShuffledLetters([...shuffledLetters, letter]);
      setSelectedLetters(selectedLetters.filter((_, index) => index !== source.index));
    }
  };

  if (!currentWord) {
    return <div>Добавьте слова для начала тренировки</div>;
  }

  return (
    <div className="training-mode">
      <h2>Train</h2>
      <div className="word-prompt">
        <p>Translate: <strong>{currentWord.russian}</strong></p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={`answer-container ${isCorrect ? 'word-correct' : ''} ${isError ? 'word-error' : ''}`}>
          <Droppable droppableId="selected" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="selected-letters"
              >
                {selectedLetters.map((letter, index) => (
                  <Draggable key={letter.id} draggableId={letter.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="letter-tile"
                      >
                        {letter.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        <Droppable droppableId="available" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="letters-container"
            >
              {shuffledLetters.map((letter, index) => (
                <Draggable key={letter.id} draggableId={letter.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="letter-tile"
                      onClick={() => handleLetterClick(letter, index)}
                    >
                      {letter.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default TrainingMode;