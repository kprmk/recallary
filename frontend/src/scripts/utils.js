export const getRandomWords = (words) => {
  const shuffledWords = words.sort(() => 0.5 - Math.random()); // Перемешиваем слова
  return shuffledWords.slice(0, 5); // Возвращаем только первые 5 слов
}; 