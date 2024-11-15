import { useState } from 'react'
import TrainingMode from './components/TrainingMode'
import './styles/App.css'

function App() {
  const [englishWord, setEnglishWord] = useState('')
  const [russianWord, setRussianWord] = useState('')
  const [words, setWords] = useState([
    { english: 'apple', russian: 'яблоко' },
    { english: 'strawberry', russian: 'клубника' },
    { english: 'bus', russian: 'автобус' }
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
      <h1>Изучение слов</h1>
      
      <div className="input-section">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={englishWord}
            onChange={(e) => setEnglishWord(e.target.value)}
            placeholder="Английское слово"
            className="word-input"
          />
          <input
            type="text"
            value={russianWord}
            onChange={(e) => setRussianWord(e.target.value)}
            placeholder="Русское слово"
            className="word-input"
          />
          <button type="submit" className="add-button">Добавить</button>
        </form>
      </div>

      <div className="words-list">
        <h2>Добавленные слова:</h2>
        <ul>
          {words.map((word, index) => (
            <li key={index} className="word-item">
              {word.english} - {word.russian}
            </li>
          ))}
        </ul>
      </div>

      <TrainingMode words={words} />
    </div>
  )
}

export default App