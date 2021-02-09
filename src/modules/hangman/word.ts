/* eslint-disable */

export class Word {
  private static lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";

  constructor(rawWord: string) {}

  private validate(rawWord: string) {
    let i = rawWord.length;
    while (i--) {
      if (!Word.lowercaseLetters.includes(rawWord[i])) {
      }
    }
  }
}
