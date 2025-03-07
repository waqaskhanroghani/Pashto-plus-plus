# Pashto++

A beginner-friendly, JavaScript-inspired programming language with Pashto keywords styled like those in Hamar. It uses curly braces instead of indentation, features loose typing, and prioritizes simplicity with a forgiving syntax.

## Features

- JavaScript-like syntax with curly braces `{}`
- Loose typing (no type declarations)
- Case insensitivity for keywords
- Optional semicolons
- Natural Pashto keywords for programming constructs
- Bilingual UI (English/Pashto)
- Light/Dark theme support

## Language Syntax

### Data Types

- **Number**: `10` or `3.14` (single numeric type)
- **String**: `"Salam"` or `'Pashto'` (flexible quotes)
- **Array**: `[1, "dwa", 3]` (JavaScript-style)
- **Boolean**: `rishtia` (true) or `ghalat` (false)

### Variables

Assign with `=`:

```
nawm = "Ali"      // "nawm" = name (نوم)
shumar = 5        // "shumar" = number (شمېر)
jorkanumbers = [1, 2, 3]  // array
```

### Operators

| Operation | Syntax | Example |
| --- | --- | --- |
| Addition | `+` or `jama` | `5 + 3` → `8` |
| Subtraction | `-` or `manfi` | `10 - 4` → `6` |
| Multiplication | `*` or `zarab` | `2 * 3` → `6` |
| Division | `/` or `takseem` | `10 / 2` → `5` |
| Modulo | `%` or `takseembaki` | `7 % 3` → `1` |
| Concatenation | `_` | `"Salam" _ "Ji"` → `"SalamJi"` |
| Equality | `==` | `5 == 5` → `rishtia` |
| Inequality | `!=` | `5 != 3` → `rishtia` |

### Control Structures

#### If/Else

```
ko (shumar > 5) {
  olika("Shumar ghat da")  // "Number is big"
} geni {
  olika("Shumar wrik da")  // "Number is small"
}
```

#### While Loop

```
shumar = 0
kala (shumar < 3) {
  olika(shumar)
  shumar = shumar + 1
}
// Outputs: 0, 1, 2
```

#### For Loop

```
che (x we jorkanumbers(0, 3)) {
  olika(x)
}
// Outputs: 0, 1, 2
```

### Functions

```
opejana jor(a, b) {
  raka a + b
}
olika(jor(3, 4))  // Outputs: 7
```

### Input/Output

```
olika("Salam Ji")  // Outputs: Salam Ji

nawm = oghwara("Sta nawm da? ")  // Prompts: What's your name?
olika("Salam " _ nawm)
```

### Built-in Functions

| Function | Description | Example |
| --- | --- | --- |
| `jorkanumbers` | Generate range | `jorkanumbers(0, 3)` → `[0,1,2]` |
| `oshmara` | Array length | `oshmara([1,2,3])` → `3` |
| `max` | Maximum value | `max(2,5,3)` → `5` |
| `min` | Minimum value | `min(2,5,3)` → `2` |
| `abs` | Absolute value | `abs(-5)` → `5` |

## Getting Started

First, install the dependencies:

```bash
yarn install
```

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the Pashto++ editor.

## Project Structure

- `/lib/interpreter` - The Pashto++ language interpreter
  - `/lexer.ts` - Tokenizes the input code
  - `/parser.ts` - Parses tokens into an AST
  - `/interpreter.ts` - Executes the AST
- `/components/ui` - UI components for the editor
- `/app/[locale]` - Next.js app router with internationalization
- `/messages` - Translation files for English and Pashto

## Technologies Used

- **Next.js** - React framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **next-intl** - Internationalization
- **CodeMirror** - Code editor
- **Noto Nastaliq Urdu** - Font for Pashto text

## Example Program

```
nawm = oghwara("Sta nawm da? ")
olika("Salam " _ nawm)
che (x we jorkanumbers(0, 3)) {
  olika(x)
}
```

Output (if "Zahir" entered):

```
Sta nawm da? [Zahir]
Salam Zahir
0
1
2
```

## License

Pashto++ 2025
