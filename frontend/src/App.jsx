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
    <>
      <h1>Recallary 📝🧐</h1>
      <div className="app-container" style={{ display: 'flex', minWidth: '50vw', gap: '3vw' }}>
        <div className="input-section" style={{ flex: 1 }}>
          <h3>Add word</h3>
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
          <h3>Vocab search (total words: { displayedWords.length })</h3>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="search"
            className="word-input"
          />
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {filteredDisplayedWords.map((item, index) => (
              <li key={index} className="word-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                👉 {item.word} - {item.translation}
                <button
                  onClick={() => handleDelete(item)}
                  className="delete-button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em' }}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          <TrainingMode words={vocab} />
        </div>
      </div>
    </>
  )
}

export default App