export default class HangmanGame {
  static noose: Array<string> = [
    " +---+",
    " |   |",
    "     |",
    "     |",
    "     |",
    "     |",
    "=======",
  ];

  static hangman: Array<Array<string>> = [
    ["     |"],
    [" 0   |"],
    [" 0   |", " |   |"],
    [" 0   |", "/|   |"],
    [" 0   |", "/|\\  |"],
    [" 0   |", "/|\\  |", "/    |"],
    [" 0   |", "/|\\  |", "/ \\  |"],
  ];

  constructor() {}
}

// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-undef
type ConstructorArgs = {
  // eslint-disable-next-line no-undef
  word: string;
};
