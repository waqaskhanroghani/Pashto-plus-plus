/**
 * Client-side adapter for the Pashto++ interpreter
 * This file provides a browser-compatible version of the interpreter
 */

import { Lexer } from './interpreter/lexer';
import { Parser } from './interpreter/parser';
import { Interpreter } from './interpreter/interpreter';

// Main entry point for running Pashto++ code in the browser
export async function runPashtoPlusPlus(
  code: string,
  inputCallback: () => Promise<string>
): Promise<{ output: string, error?: string }> {
  try {
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();

    const parser = new Parser(tokens);
    const program = parser.parse();

    const interpreter = new Interpreter(inputCallback);
    return await interpreter.interpret(program);
  } catch (error) {
    if (error instanceof Error) {
      return { output: '', error: error.message };
    }
    return { output: '', error: String(error) };
  }
}
