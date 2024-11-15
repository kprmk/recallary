import { useState } from 'react'
import TrainingMode from './components/TrainingMode'

function App() {
  const [englishWord, setEnglishWord] = useState('')
  const [russianWord, setRussianWord] = useState('')
  const [words, setWords] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (englishWord && russianWord) {
      setWords([...words, { english: englishWord, russian: russianWord }])
      setEnglishWord('')
      setRussianWord('')
    }
  }

  return (
    <div>
      <h1>Изучение слов</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={englishWord}
          onChange={(e) => setEnglishWord(e.target.value)}
          placeholder="Английское слово"
        />
        <input
          type="text"
          value={russianWord}
          onChange={(e) => setRussianWord(e.target.value)}
          placeholder="Русское слово"
        />
        <button type="submit">Добавить</button>
      </form>

      <div>
        <h2>Добавленные слова:</h2>
        <ul>
          {words.map((word, index) => (
            <li key={index}>
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