const QUOTES = {
  '"': '"',
  "‘": "’",
  "‚": "‛",
  "“": "”",
  "„": "‟",
  "⹂": "⹂",
  "「": "」",
  "『": "』",
  "〝": "〞",
  "﹁": "﹂",
  "﹃": "﹄",
  "＂": "＂",
  "｢": "｣",
  "«": "»",
  "‹": "›",
  "《": "》",
  "〈": "〉",
};

const ALL_QUOTES: Array<string> = Object.entries(QUOTES).flat();

export default class StringView {
  private index: number = 0;
  private previous: number = 0;
  private buffer: string = "";
  private end: number = 0;

  constructor(buffer: string) {
    this.index = 0;
    this.buffer = buffer;
    this.end = buffer.length;
    this.previous = 0;
  }

  get current(): string | null {
    return this.eof ? null : this.buffer[this.index];
  }

  get eof(): boolean {
    return this.index >= this.end;
  }

  undo(): void {
    this.index = this.previous;
  }

  reset(): void {
    this.index = 0;
  }

  skipWs(): boolean {
    let pos = 0;
    while (!this.eof) {
      try {
        const current = this.buffer[this.index + pos];
        if (current.trim() !== "") {
          break;
        }
        pos += 1;
      } catch (e) {
        break;
      }
    }

    this.previous = this.index;
    this.index += pos;
    return this.previous !== this.index;
  }

  skipString(string: string): boolean {
    const strlen = string.length;

    if (this.buffer.slice(this.index, this.index + strlen) === string) {
      this.previous = this.index;
      this.index += strlen;
      return true;
    }

    return false;
  }

  readRest(): string {
    const result = this.buffer.slice(this.index);
    this.previous = this.index;
    this.index = this.end;
    return result;
  }

  read(n: number): string {
    const result = this.buffer.slice(this.index, this.index + n);
    this.previous = this.index;
    this.index += n;
    return result;
  }

  get(): string | null {
    let result: string | null;

    try {
      result = this.buffer[this.index + 1];
    } catch (e) {
      result = null;
    }

    this.previous = this.index;
    this.index += 1;
    return result;
  }

  getWord(): string {
    let pos = 0;
    while (!this.eof) {
      try {
        const current = this.buffer[this.index + pos];
        if (current.trim() === "") break;
        pos += 1;
      } catch (e) {
        break;
      }
    }

    this.previous = this.index;
    const result = this.buffer.slice(this.index, this.index + pos);
    this.index += pos;
    return result;
  }

  getQuotedWord(): string {
    let current = this.current;
    if (current === null) {
      return null;
    }

    let result: Array<string>;
    let escapedQuotes: Array<string>;

    const close_quote = QUOTES[current];
    const is_quoted = !!close_quote;

    if (is_quoted) {
      result = [];
      escapedQuotes = [current, close_quote];
    } else {
      result = [current];
      escapedQuotes = ALL_QUOTES;
    }

    while (!this.eof) {
      current = this.get();
      if (!current) {
        if (is_quoted) {
          // unexpected EOF
          throw new Error(close_quote); // ExpectedClosingQuoteError(close_quote)
        }
        return result.join("");
      }

      // currently we accept strings in the format of "hello world"
      // to embed a quote inside the string you must escape it: "a \"world\""
      if (current === "\\") {
        const next_char = this.get();
        if (!next_char) {
          // string ends with \ and no character after it
          if (is_quoted) {
            // if we're quoted then we're expecting a closing quote
            throw new Error(close_quote);
          }

          // if we aren't then we just let it through
          return result.join("");
        }

        if (escapedQuotes.includes(next_char)) {
          // escaped quote
          result.push(next_char);
        } else {
          // different escape character, ignore it
          this.undo();
          result.push(current);
        }

        continue;
      }

      if (!is_quoted && ALL_QUOTES.includes(current)) {
        // we aren't quoted
        throw new Error(`Unexpected quote: ${current}`);
      }

      // closing quote
      if (is_quoted && current === close_quote) {
        const next_char = this.get();
        const valid_eof = !next_char || next_char.trim() === "";
        if (!valid_eof) {
          throw new Error(next_char); // InvalidEndOfQuotedStringError(next_char)
        }

        // we're quoted so it's okay
        return result.join("");
      }

      if (current.trim() === "" && !is_quoted) {
        // end of word found
        return result.join("");
      }

      result.push(current);
    }
  }
}
