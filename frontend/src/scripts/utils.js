export const getRandomWords = (words) => {
  const shuffledWords = words.sort(() => 0.5 - Math.random()); // Перемешиваем слова
  return shuffledWords.slice(0, 5); // Возвращаем только первые 5 слов
}; 

export const getWordForTraining = (words) => {
  const newWords = words.filter(word =>
    (word.repetitions.correct + word.repetitions.incorrect) === 0
  );
  if (newWords.length > 0) {
    return newWords[Math.floor(Math.random() * newWords.length)];
  }

  const sortedWords = words.sort((a, b) => {
    const aTotal = a.repetitions.correct + a.repetitions.incorrect;
    const bTotal = b.repetitions.correct + b.repetitions.incorrect;
    const aScore = aTotal === 0 ? 0 : a.repetitions.correct / aTotal;
    const bScore = bTotal === 0 ? 0 : b.repetitions.correct / bTotal;
    return aScore - bScore;
  });
  return sortedWords[0];
};

export const get_word_stats = (word) => {
  const corrects = word.repetitions.correct;
  const incorrects = word.repetitions.incorrect;
  const total = corrects + incorrects;
  const result = `#️⃣ ${total}`;
  if (total === 0) {
    return result;
  }
  return result + ` 🆗 ${corrects / total}`;
};

export const get_word_repr = (word) => {
  return `👉 ${word.word} - ${word.translation} ${get_word_stats(word)}`;
};