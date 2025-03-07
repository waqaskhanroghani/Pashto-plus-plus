/**
 * Parser for Pashto++ programming language
 * Parses tokens into an Abstract Syntax Tree (AST)
 */

import { Token, TokenType } from './lexer';

// AST Node Types
export enum NodeType {
  Program = 'Program',
  NumericLiteral = 'NumericLiteral',
  StringLiteral = 'StringLiteral',
  BooleanLiteral = 'BooleanLiteral',
  Identifier = 'Identifier',
  BinaryExpression = 'BinaryExpression',
  AssignmentExpression = 'AssignmentExpression',
  VariableDeclaration = 'VariableDeclaration',
  FunctionDeclaration = 'FunctionDeclaration',
  CallExpression = 'CallExpression',
  ReturnStatement = 'ReturnStatement',
  IfStatement = 'IfStatement',
  WhileStatement = 'WhileStatement',
  ForStatement = 'ForStatement',
  BlockStatement = 'BlockStatement',
  ExpressionStatement = 'ExpressionStatement',
  ArrayLiteral = 'ArrayLiteral',
}

// AST Node interfaces
export interface Node {
  type: NodeType;
  line: number;
  column: number;
}

export interface Program extends Node {
  type: NodeType.Program;
  body: Statement[];
}

export interface Expression extends Node {}

export interface Statement extends Node {}

export interface NumericLiteral extends Expression {
  type: NodeType.NumericLiteral;
  value: number;
}

export interface StringLiteral extends Expression {
  type: NodeType.StringLiteral;
  value: string;
}

export interface BooleanLiteral extends Expression {
  type: NodeType.BooleanLiteral;
  value: boolean;
}

export interface Identifier extends Expression {
  type: NodeType.Identifier;
  name: string;
}

export interface BinaryExpression extends Expression {
  type: NodeType.BinaryExpression;
  operator: string;
  left: Expression;
  right: Expression;
}

export interface AssignmentExpression extends Expression {
  type: NodeType.AssignmentExpression;
  left: Identifier;
  right: Expression;
}

export interface VariableDeclaration extends Statement {
  type: NodeType.VariableDeclaration;
  name: string;
  value: Expression | null;
}

export interface FunctionDeclaration extends Statement {
  type: NodeType.FunctionDeclaration;
  name: string;
  params: string[];
  body: BlockStatement;
}

export interface CallExpression extends Expression {
  type: NodeType.CallExpression;
  callee: Expression;
  arguments: Expression[];
}

export interface ReturnStatement extends Statement {
  type: NodeType.ReturnStatement;
  argument: Expression | null;
}

export interface IfStatement extends Statement {
  type: NodeType.IfStatement;
  test: Expression;
  consequent: BlockStatement;
  alternate: BlockStatement | null;
}

export interface WhileStatement extends Statement {
  type: NodeType.WhileStatement;
  test: Expression;
  body: BlockStatement;
}

export interface ForStatement extends Statement {
  type: NodeType.ForStatement;
  variable: string;
  iterable: Expression;
  body: BlockStatement;
}

export interface BlockStatement extends Statement {
  type: NodeType.BlockStatement;
  body: Statement[];
}

export interface ExpressionStatement extends Statement {
  type: NodeType.ExpressionStatement;
  expression: Expression;
}

export interface ArrayLiteral extends Expression {
  type: NodeType.ArrayLiteral;
  elements: Expression[];
}

// Operator precedence for expression parsing
const PRECEDENCE: Record<string, number> = {
  '=': 1,
  '==': 2,
  '!=': 2,
  '<': 3,
  '>': 3,
  '<=': 3,
  '>=': 3,
  '+': 4,
  'jama': 4,
  '-': 4,
  'manfi': 4,
  '_': 4, // concatenation
  '*': 5,
  'zarab': 5,
  '/': 5,
  'takseem': 5,
  '%': 5,
  'takseembaki': 5,
};

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private check(type: TokenType, value?: string): boolean {
    if (this.isAtEnd()) return false;
    if (value) {
      return this.peek().type === type && this.peek().value.toLowerCase() === value.toLowerCase();
    }
    return this.peek().type === type;
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private matchValue(type: TokenType, value: string): boolean {
    if (this.check(type, value)) {
      this.advance();
      return true;
    }
    return false;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(`${message} at line ${this.peek().line}, column ${this.peek().column}`);
  }

  private consumeValue(type: TokenType, value: string, message: string): Token {
    if (this.check(type, value)) return this.advance();
    throw new Error(`${message} at line ${this.peek().line}, column ${this.peek().column}`);
  }

  // Main parsing method
  public parse(): Program {
    try {
      const program: Program = {
        type: NodeType.Program,
        body: [],
        line: 1,
        column: 1,
      };

      while (!this.isAtEnd()) {
        program.body.push(this.declaration());
      }

      return program;
    } catch (error) {
      console.error('Parse error:', error);
      throw error;
    }
  }

  // Declarations
  private declaration(): Statement {
    // Function declaration
    if (this.matchValue(TokenType.KEYWORD, 'opejana')) {
      return this.functionDeclaration();
    }

    return this.statement();
  }

  private functionDeclaration(): FunctionDeclaration {
    const token = this.previous();
    const name = this.consume(TokenType.IDENTIFIER, 'Expected function name').value;
    
    this.consume(TokenType.PUNCTUATION, '(', 'Expected "(" after function name');
    
    const params: string[] = [];
    if (!this.check(TokenType.PUNCTUATION, ')')) {
      do {
        params.push(this.consume(TokenType.IDENTIFIER, 'Expected parameter name').value);
      } while (this.match(TokenType.PUNCTUATION) && this.previous().value === ',');
    }
    
    this.consume(TokenType.PUNCTUATION, ')', 'Expected ")" after parameters');
    
    this.consume(TokenType.PUNCTUATION, '{', 'Expected "{" before function body');
    const body = this.blockStatement();
    
    return {
      type: NodeType.FunctionDeclaration,
      name,
      params,
      body,
      line: token.line,
      column: token.column,
    };
  }

  // Statements
  private statement(): Statement {
    // If statement
    if (this.matchValue(TokenType.KEYWORD, 'ko')) {
      return this.ifStatement();
    }
    
    // While statement
    if (this.matchValue(TokenType.KEYWORD, 'kala')) {
      return this.whileStatement();
    }
    
    // For statement
    if (this.matchValue(TokenType.KEYWORD, 'che')) {
      return this.forStatement();
    }
    
    // Return statement
    if (this.matchValue(TokenType.KEYWORD, 'raka')) {
      return this.returnStatement();
    }
    
    // Block statement
    if (this.match(TokenType.PUNCTUATION) && this.previous().value === '{') {
      return this.blockStatement();
    }
    
    return this.expressionStatement();
  }

  private ifStatement(): IfStatement {
    const token = this.previous();
    
    this.consume(TokenType.PUNCTUATION, '(', 'Expected "(" after "ko"');
    const test = this.expression();
    this.consume(TokenType.PUNCTUATION, ')', 'Expected ")" after if condition');
    
    this.consume(TokenType.PUNCTUATION, '{', 'Expected "{" before if body');
    const consequent = this.blockStatement();
    
    let alternate: BlockStatement | null = null;
    if (this.matchValue(TokenType.KEYWORD, 'geni')) {
      this.consume(TokenType.PUNCTUATION, '{', 'Expected "{" before else body');
      alternate = this.blockStatement();
    }
    
    return {
      type: NodeType.IfStatement,
      test,
      consequent,
      alternate,
      line: token.line,
      column: token.column,
    };
  }

  private whileStatement(): WhileStatement {
    const token = this.previous();
    
    this.consume(TokenType.PUNCTUATION, '(', 'Expected "(" after "kala"');
    const test = this.expression();
    this.consume(TokenType.PUNCTUATION, ')', 'Expected ")" after while condition');
    
    this.consume(TokenType.PUNCTUATION, '{', 'Expected "{" before while body');
    const body = this.blockStatement();
    
    return {
      type: NodeType.WhileStatement,
      test,
      body,
      line: token.line,
      column: token.column,
    };
  }

  private forStatement(): ForStatement {
    const token = this.previous();
    
    this.consume(TokenType.PUNCTUATION, '(', 'Expected "(" after "che"');
    const variable = this.consume(TokenType.IDENTIFIER, 'Expected variable name in for loop').value;
    
    this.consumeValue(TokenType.KEYWORD, 'we', 'Expected "we" after variable name in for loop');
    
    const iterable = this.expression();
    this.consume(TokenType.PUNCTUATION, ')', 'Expected ")" after for loop condition');
    
    this.consume(TokenType.PUNCTUATION, '{', 'Expected "{" before for loop body');
    const body = this.blockStatement();
    
    return {
      type: NodeType.ForStatement,
      variable,
      iterable,
      body,
      line: token.line,
      column: token.column,
    };
  }

  private returnStatement(): ReturnStatement {
    const token = this.previous();
    let argument: Expression | null = null;
    
    if (!this.check(TokenType.PUNCTUATION, ';') && !this.check(TokenType.PUNCTUATION, '}')) {
      argument = this.expression();
    }
    
    // Optional semicolon
    if (this.match(TokenType.PUNCTUATION) && this.previous().value === ';') {
      // Consume the semicolon
    }
    
    return {
      type: NodeType.ReturnStatement,
      argument,
      line: token.line,
      column: token.column,
    };
  }

  private blockStatement(): BlockStatement {
    const token = this.previous();
    const statements: Statement[] = [];
    
    while (!this.check(TokenType.PUNCTUATION, '}') && !this.isAtEnd()) {
      statements.push(this.declaration());
    }
    
    this.consume(TokenType.PUNCTUATION, '}', 'Expected "}" after block');
    
    return {
      type: NodeType.BlockStatement,
      body: statements,
      line: token.line,
      column: token.column,
    };
  }

  private expressionStatement(): ExpressionStatement {
    const token = this.peek();
    const expr = this.expression();
    
    // Optional semicolon
    if (this.match(TokenType.PUNCTUATION) && this.previous().value === ';') {
      // Consume the semicolon
    }
    
    return {
      type: NodeType.ExpressionStatement,
      expression: expr,
      line: token.line,
      column: token.column,
    };
  }

  // Expressions
  private expression(): Expression {
    return this.assignment();
  }

  private assignment(): Expression {
    const expr = this.equality();
    
    if (this.match(TokenType.OPERATOR) && this.previous().value === '=') {
      const equals = this.previous();
      const value = this.assignment();
      
      if (expr.type === NodeType.Identifier) {
        return {
          type: NodeType.AssignmentExpression,
          left: expr as Identifier,
          right: value,
          line: equals.line,
          column: equals.column,
        };
      }
      
      throw new Error(`Invalid assignment target at line ${equals.line}, column ${equals.column}`);
    }
    
    return expr;
  }

  private equality(): Expression {
    return this.parseBinaryExpression(this.comparison.bind(this), ['==', '!=']);
  }

  private comparison(): Expression {
    return this.parseBinaryExpression(this.addition.bind(this), ['>', '<', '>=', '<=']);
  }

  private addition(): Expression {
    return this.parseBinaryExpression(this.multiplication.bind(this), ['+', '-', '_', 'jama', 'manfi']);
  }

  private multiplication(): Expression {
    return this.parseBinaryExpression(this.unary.bind(this), ['*', '/', '%', 'zarab', 'takseem', 'takseembaki']);
  }

  private parseBinaryExpression(nextMethod: () => Expression, operators: string[]): Expression {
    let expr = nextMethod();
    
    while (this.match(TokenType.OPERATOR) && operators.includes(this.previous().value)) {
      const operator = this.previous().value;
      const right = nextMethod();
      
      expr = {
        type: NodeType.BinaryExpression,
        operator,
        left: expr,
        right,
        line: this.previous().line,
        column: this.previous().column,
      };
    }
    
    return expr;
  }

  private unary(): Expression {
    if (this.match(TokenType.OPERATOR) && ['-', 'manfi'].includes(this.previous().value)) {
      const operator = this.previous().value;
      const right = this.unary();
      
      return {
        type: NodeType.BinaryExpression,
        operator,
        left: {
          type: NodeType.NumericLiteral,
          value: 0,
          line: this.previous().line,
          column: this.previous().column,
        },
        right,
        line: this.previous().line,
        column: this.previous().column,
      };
    }
    
    return this.call();
  }

  private call(): Expression {
    let expr = this.primary();
    
    while (true) {
      if (this.match(TokenType.PUNCTUATION) && this.previous().value === '(') {
        expr = this.finishCall(expr);
      } else {
        break;
      }
    }
    
    return expr;
  }

  private finishCall(callee: Expression): CallExpression {
    const args: Expression[] = [];
    const token = this.previous();
    
    if (!this.check(TokenType.PUNCTUATION, ')')) {
      do {
        args.push(this.expression());
      } while (this.match(TokenType.PUNCTUATION) && this.previous().value === ',');
    }
    
    this.consume(TokenType.PUNCTUATION, ')', 'Expected ")" after arguments');
    
    return {
      type: NodeType.CallExpression,
      callee,
      arguments: args,
      line: token.line,
      column: token.column,
    };
  }

  private primary(): Expression {
    const token = this.peek();
    
    // Number literals
    if (this.match(TokenType.NUMBER)) {
      return {
        type: NodeType.NumericLiteral,
        value: parseFloat(this.previous().value),
        line: this.previous().line,
        column: this.previous().column,
      };
    }
    
    // String literals
    if (this.match(TokenType.STRING)) {
      return {
        type: NodeType.StringLiteral,
        value: this.previous().value,
        line: this.previous().line,
        column: this.previous().column,
      };
    }
    
    // Boolean literals
    if (this.matchValue(TokenType.KEYWORD, 'rishtia')) {
      return {
        type: NodeType.BooleanLiteral,
        value: true,
        line: this.previous().line,
        column: this.previous().column,
      };
    }
    
    if (this.matchValue(TokenType.KEYWORD, 'ghalat')) {
      return {
        type: NodeType.BooleanLiteral,
        value: false,
        line: this.previous().line,
        column: this.previous().column,
      };
    }
    
    // Array literals
    if (this.match(TokenType.PUNCTUATION) && this.previous().value === '[') {
      return this.arrayLiteral();
    }
    
    // Grouping expressions
    if (this.match(TokenType.PUNCTUATION) && this.previous().value === '(') {
      const expr = this.expression();
      this.consume(TokenType.PUNCTUATION, ')', 'Expected ")" after expression');
      return expr;
    }
    
    // Identifiers
    if (this.match(TokenType.IDENTIFIER)) {
      return {
        type: NodeType.Identifier,
        name: this.previous().value,
        line: this.previous().line,
        column: this.previous().column,
      };
    }
    
    throw new Error(`Unexpected token '${this.peek().value}' at line ${this.peek().line}, column ${this.peek().column}`);
  }

  private arrayLiteral(): ArrayLiteral {
    const token = this.previous();
    const elements: Expression[] = [];
    
    if (!this.check(TokenType.PUNCTUATION, ']')) {
      do {
        elements.push(this.expression());
      } while (this.match(TokenType.PUNCTUATION) && this.previous().value === ',');
    }
    
    this.consume(TokenType.PUNCTUATION, ']', 'Expected "]" after array elements');
    
    return {
      type: NodeType.ArrayLiteral,
      elements,
      line: token.line,
      column: token.column,
    };
  }
}
