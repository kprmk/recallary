export const getRandomWords = (words) => {
  const shuffledWords = words.sort(() => 0.5 - Math.random()); // Перемешиваем слова
  return shuffledWords.slice(0, 5); // Возвращаем только первые 5 слов
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