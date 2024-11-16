import './styles/App.css'
import { useState, useEffect } from 'react'
import TrainingMode from './components/TrainingMode'
import { getRandomWords } from './scripts/utils'

const backendUrl = import.meta.env.VITE_BACKEND_URL;
if (!backendUrl) {
    console.error('Backend URL is not defined in environment variables');
}

function App() {
  const [word, setWord] = useState('')
  const [translation, setTranslation] = useState('')
  const [vocab, setVocab] = useState([])
  const [displayedWords, setDisplayedWords] = useState([])
  const [searchTerm, setSearchTerm] = useState('');

  const fetchWords = async () => {
    try {
      const response = await fetch(`${backendUrl}/words`);
      const data = await response.json();
      setVocab(data);
      setDisplayedWords(getRandomWords(data));
    } catch (error) {
      console.error('Ошибка при получении слов:', error);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (word && translation) {
      try {
        const response = await fetch(`${backendUrl}/word`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ word: word, translation: translation }),
        });
        
        if (response.ok) {
          const newWord = await response.json();
          setVocab([...vocab, newWord]);
          setDisplayedWords(getRandomWords([...vocab, newWord]));
        } else {
          console.error('Ошибка при добавлении слова:', response.statusText);
        }
      } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
      }

      setWord('');
      setTranslation('');
      await fetchWords();
    }
  }

  const handleDelete = async (wordToDelete) => {
    try {
      const response = await fetch(`${backendUrl}/word/${wordToDelete.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchWords();
      } else {
        console.error('Ошибка при удалении слова:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
    }
  };

  const filteredDisplayedWords = displayedWords.filter(item => 
    item.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <h1>Recallary 📝🧐</h1>
      
      <div className="input-section">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Word"
            className="word-input"
          />
          <input
            type="text"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="Translation"
            className="word-input"
          />
          <button type="submit" className="add-button">Add</button>
        </form>
      </div>

      <TrainingMode words={vocab} />

      <div className="words-list">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search words"
          className="word-input"
        />
        <h2>Random 5 words from total { displayedWords.length }:</h2>
        <ul>
          {filteredDisplayedWords.map((item, index) => (
            <li key={index} className="word-item">
              {item.word} - {item.translation}
              <button onClick={() => handleDelete(item)} className="delete-button" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em', marginLeft: '10px' }}>
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App