// CSS
import './App.css';

// React
import { useCallback, useEffect, useState } from 'react';

// Data
import { wordsList } from './data/words';

// Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

// o useCallback é utilizado para resolver problemas de dependência do useEffect

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
]

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    console.log(words[category].length);
    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)];
    console.log(word);

    // precisa retornar como um objeto...se fosse [word, category] seria um array
    return {word, category};
  }, [words]);

  // starts the secret word game
  const startGame = useCallback(() => {
    // clear all letters
    clearLetterStates();

    // pick word and pick category
    const { word, category } =  pickWordAndCategory();

    // create an array of letters

    let wordLetters = word.split('');
    wordLetters = wordLetters.map((x) => x.toLowerCase());

    console.log(word, category);
    console.log(wordLetters);
    
    // fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();
    
    // check if letter has already been utilized
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }

    // push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,     // spread operator
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses -1);
    };
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  // check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      // reset all states
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  // check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];  // array de letras únicas...o Set só deixa itens únicos em um array

    // win condition
    if (guessedLetters.length === uniqueLetters.length) {
      // add score
      setScore((actualScore) => actualScore += 100);

      // restar game with new word
      startGame();
    };
  }, [guessedLetters, letters, startGame]); // tem que colocar aqui tudo que o useEffect vai monitorar

  // restarts the game
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name)
  };

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}></StartScreen>}
      {gameStage === 'game' && <Game 
      verifyLetter={verifyLetter}
      pickedWord={pickedWord}
      pickedCategory={pickedCategory}
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}
      ></Game>}
      {gameStage === 'end' && <GameOver retry={retry} score={score}></GameOver>}
    </div>
  );
}

export default App;
