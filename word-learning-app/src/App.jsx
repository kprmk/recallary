import { useState } from 'react'
import TrainingMode from './components/TrainingMode'
import './styles/App.css'
import { getRandomWords } from './scripts/utils'

function App() {
  const [englishWord, setEnglishWord] = useState('')
  const [russianWord, setRussianWord] = useState('')
  const [words, setWords] = useState([
    { english: 'monday', russian: 'понедельник' },
    { english: 'morning', russian: 'утро' },
    { english: 'apple', russian: 'яблоко' },
    { english: 'strawberry', russian: 'клубника' },
    { english: 'summer', russian: 'лето' },
    { english: 'bus', russian: 'автобус' },
    { english: 'deer', russian: 'олень' },
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (englishWord && russianWord) {
      setWords([...words, { english: englishWord, russian: russianWord }])
      setEnglishWord('')
      setRussianWord('')
    }
  }

  return (
    <div className="app-container">
      <h1>Recallary 📝🧐</h1>
      
      <div className="input-section">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={englishWord}
            onChange={(e) => setEnglishWord(e.target.value)}
            placeholder="Eng"
            className="word-input"
          />
          <input
            type="text"
            value={russianWord}
            onChange={(e) => setRussianWord(e.target.value)}
            placeholder="Rus"
            className="word-input"
          />
          <button type="submit" className="add-button">Add</button>
        </form>
      </div>

      <TrainingMode words={words} />

      <div className="words-list">
        <h2>Random 5 words from total { words.length }:</h2>
        <ul>
          {getRandomWords(words).map((word, index) => (
            <li key={index} className="word-item">
              {word.english} - {word.russian}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App