/**
 * Lexer for Pashto++ programming language
 * Tokenizes the input code into a stream of tokens
 */

export enum TokenType {
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  IDENTIFIER = 'IDENTIFIER',
  KEYWORD = 'KEYWORD',
  OPERATOR = 'OPERATOR',
  PUNCTUATION = 'PUNCTUATION',
  EOF = 'EOF',
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

// Keywords in Pashto++ (case insensitive)
export const KEYWORDS = [
  'ko', // if
  'geni', // else
  'kala', // while
  'che', // for
  'we', // in
  'opejana', // function
  'raka', // return
  'olika', // print
  'oghwara', // input
  'rishtia', // true
  'ghalat', // false
];

// Operators in Pashto++
export const OPERATORS = [
  '+', 'jama', // addition
  '-', 'manfi', // subtraction
  '*', 'zarab', // multiplication
  '/', 'takseem', // division
  '%', 'takseembaki', // modulo
  '_', // concatenation
  '==', // equality
  '!=', // inequality
  '>', // greater than
  '<', // less than
  '>=', // greater than or equal
  '<=', // less than or equal
  '=', // assignment
];

export class Lexer {
  private code: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private currentChar: string | null = null;

  constructor(code: string) {
    this.code = code;
    this.currentChar = this.code.length > 0 ? this.code[0] : null;
  }

  private advance(): void {
    this.position++;
    this.column++;
    
    if (this.position >= this.code.length) {
      this.currentChar = null;
    } else {
      this.currentChar = this.code[this.position];
      
      // Handle newlines for line counting
      if (this.currentChar === '\n') {
        this.line++;
        this.column = 1;
      }
    }
  }

  private peek(): string | null {
    const peekPos = this.position + 1;
    if (peekPos >= this.code.length) {
      return null;
    }
    return this.code[peekPos];
  }

  private skipWhitespace(): void {
    while (
      this.currentChar !== null && 
      /\s/.test(this.currentChar)
    ) {
      this.advance();
    }
  }

  private skipComment(): void {
    if (this.currentChar === '/' && this.peek() === '/') {
      // Skip until the end of the line
      while (this.currentChar !== null && this.currentChar !== '\n') {
        this.advance();
      }
      if (this.currentChar === '\n') {
        this.advance();
      }
    }
  }

  private number(): Token {
    let result = '';
    const startColumn = this.column;
    
    // Get the integer part
    while (
      this.currentChar !== null && 
      /[0-9]/.test(this.currentChar)
    ) {
      result += this.currentChar;
      this.advance();
    }
    
    // Get the decimal part if it exists
    if (this.currentChar === '.') {
      result += '.';
      this.advance();
      
      while (
        this.currentChar !== null && 
        /[0-9]/.test(this.currentChar)
      ) {
        result += this.currentChar;
        this.advance();
      }
    }
    
    return {
      type: TokenType.NUMBER,
      value: result,
      line: this.line,
      column: startColumn,
    };
  }

  private string(): Token {
    const startColumn = this.column;
    const quote = this.currentChar; // Save the quote type (' or ")
    let result = '';
    
    this.advance(); // Skip the opening quote
    
    while (
      this.currentChar !== null && 
      this.currentChar !== quote
    ) {
      result += this.currentChar;
      this.advance();
    }
    
    if (this.currentChar === quote) {
      this.advance(); // Skip the closing quote
    } else {
      throw new Error(`Unterminated string at line ${this.line}, column ${startColumn}`);
    }
    
    return {
      type: TokenType.STRING,
      value: result,
      line: this.line,
      column: startColumn,
    };
  }

  private identifier(): Token {
    let result = '';
    const startColumn = this.column;
    
    while (
      this.currentChar !== null && 
      /[a-zA-Z0-9_]/.test(this.currentChar)
    ) {
      result += this.currentChar;
      this.advance();
    }
    
    // Check if it's a keyword (case insensitive)
    const lowerResult = result.toLowerCase();
    if (KEYWORDS.includes(lowerResult)) {
      return {
        type: TokenType.KEYWORD,
        value: lowerResult, // Store the lowercase version for keywords
        line: this.line,
        column: startColumn,
      };
    }
    
    // Check if it's an operator word (like 'jama', 'manfi', etc.)
    if (OPERATORS.includes(lowerResult)) {
      return {
        type: TokenType.OPERATOR,
        value: lowerResult,
        line: this.line,
        column: startColumn,
      };
    }
    
    return {
      type: TokenType.IDENTIFIER,
      value: result,
      line: this.line,
      column: startColumn,
    };
  }

  private operator(): Token {
    const startColumn = this.column;
    let value = this.currentChar!;
    
    this.advance();
    
    // Check for two-character operators
    if (
      (value === '=' && this.currentChar === '=') ||
      (value === '!' && this.currentChar === '=') ||
      (value === '>' && this.currentChar === '=') ||
      (value === '<' && this.currentChar === '=')
    ) {
      value += this.currentChar;
      this.advance();
    }
    
    return {
      type: TokenType.OPERATOR,
      value,
      line: this.line,
      column: startColumn,
    };
  }

  public getNextToken(): Token {
    while (this.currentChar !== null) {
      // Skip whitespace
      if (/\s/.test(this.currentChar)) {
        this.skipWhitespace();
        continue;
      }
      
      // Skip comments
      if (this.currentChar === '/' && this.peek() === '/') {
        this.skipComment();
        continue;
      }
      
      // Numbers
      if (/[0-9]/.test(this.currentChar)) {
        return this.number();
      }
      
      // Strings
      if (this.currentChar === '"' || this.currentChar === "'") {
        return this.string();
      }
      
      // Identifiers and keywords
      if (/[a-zA-Z_]/.test(this.currentChar)) {
        return this.identifier();
      }
      
      // Operators
      if (OPERATORS.includes(this.currentChar) || 
          this.currentChar === '=' || 
          this.currentChar === '!' ||
          this.currentChar === '>' ||
          this.currentChar === '<') {
        return this.operator();
      }
      
      // Punctuation
      if (['(', ')', '{', '}', '[', ']', ',', '.', ';'].includes(this.currentChar)) {
        const token: Token = {
          type: TokenType.PUNCTUATION,
          value: this.currentChar,
          line: this.line,
          column: this.column,
        };
        this.advance();
        return token;
      }
      
      // If we get here, we have an unrecognized character
      throw new Error(`Unexpected character '${this.currentChar}' at line ${this.line}, column ${this.column}`);
    }
    
    // End of file
    return {
      type: TokenType.EOF,
      value: '',
      line: this.line,
      column: this.column,
    };
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];
    let token = this.getNextToken();
    
    while (token.type !== TokenType.EOF) {
      tokens.push(token);
      token = this.getNextToken();
    }
    
    tokens.push(token); // Push the EOF token
    return tokens;
  }
}
