"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { CodeEditor } from "@/components/ui/code-editor";
import { OutputPanel } from "@/components/ui/output-panel";
import { runPashtoPlusPlus } from "@/lib/interpreter-client";

// Example code snippets
const EXAMPLES = {
  hello: `// Hello World example
olika("Salam Ji")
`,
  counter: `// Counter example
shumar = 0
kala (shumar < 3) {
  olika(shumar)
  shumar = shumar + 1
}
`,
  factorial: `// Factorial function example
opejana factorial(n) {
  ko (n <= 1) {
    raka 1
  } geni {
    raka n * factorial(n - 1)
  }
}

olika(factorial(5))
`
};

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const [code, setCode] = useState(EXAMPLES.hello);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [inputPrompt, setInputPrompt] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle code execution
  const runCode = async () => {
    setIsRunning(true);
    setOutput("");
    setWaitingForInput(false);

    try {
      // Create an input callback for the interpreter
      const inputCallback = () => {
        return new Promise<string>((resolve) => {
          setWaitingForInput(true);
          // Store the resolve function to be called when input is submitted
          (window as any).__resolveInput = resolve;
        });
      };

      const result = await runPashtoPlusPlus(code, inputCallback);
      
      if (result.error) {
        setOutput(prev => prev + "\n" + result.error);
      } else {
        setOutput(prev => prev + "\n" + result.output);
      }
    } catch (error) {
      setOutput(prev => prev + "\n" + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsRunning(false);
      setWaitingForInput(false);
    }
  };

  // Handle input submission
  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitingForInput && (window as any).__resolveInput) {
      const resolveInput = (window as any).__resolveInput;
      resolveInput(inputValue);
      setOutput(prev => prev + inputValue + "\n");
      setInputValue("");
      setWaitingForInput(false);
    }
  };

  // Set example code
  const setExample = (example: keyof typeof EXAMPLES) => {
    setCode(EXAMPLES[example]);
  };

  // Focus input field when waiting for input
  useEffect(() => {
    if (waitingForInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [waitingForInput]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("app.title")}</h1>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        {/* Left side - Editor */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button 
                onClick={() => setExample("hello")} 
                className="px-3 py-1 text-sm rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
              >
                {t("examples.hello")}
              </button>
              <button 
                onClick={() => setExample("counter")} 
                className="px-3 py-1 text-sm rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
              >
                {t("examples.counter")}
              </button>
              <button 
                onClick={() => setExample("factorial")} 
                className="px-3 py-1 text-sm rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
              >
                {t("examples.factorial")}
              </button>
            </div>
            <button 
              onClick={runCode} 
              disabled={isRunning || waitingForInput}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("editor.run")}
            </button>
          </div>
          
          <CodeEditor 
            value={code} 
            onChange={setCode} 
            placeholder={t("editor.placeholder")} 
            locale={locale}
          />
        </div>

        {/* Right side - Output */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="font-semibold">{t("editor.output")}</h2>
          <OutputPanel output={output} />
          
          {/* Input form */}
          {waitingForInput && (
            <form onSubmit={handleInputSubmit} className="mt-4 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-3 py-2 border rounded dark:bg-slate-800 dark:border-slate-700"
                placeholder={inputPrompt || t("editor.input")}
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                &#8594;
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t text-center text-sm text-gray-500">
        {t("footer.copyright")}
      </footer>
    </div>
  );
}
