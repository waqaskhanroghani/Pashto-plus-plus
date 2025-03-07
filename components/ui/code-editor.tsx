"use client";

import { useEffect, useRef, useState } from "react";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { basicSetup } from "codemirror";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  locale: string;
}

export function CodeEditor({ value, onChange, placeholder, locale }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!editorRef.current || !isMounted) return;

    // Clean up previous editor if it exists
    if (viewRef.current) {
      viewRef.current.destroy();
    }

    // Create a new editor
    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        javascript(),
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          "&": {
            height: "100%",
            minHeight: "300px",
            fontFamily: locale === "ps" ? "var(--font-noto-nastaliq-urdu)" : "var(--font-geist-mono)",
            fontSize: locale === "ps" ? "1.2rem" : "0.9rem",
            direction: locale === "ps" ? "rtl" : "ltr",
          },
          ".cm-scroller": {
            overflow: "auto",
            fontFamily: "inherit",
          },
          ".cm-content": {
            caretColor: "var(--foreground)",
            fontFamily: "inherit",
          },
          ".cm-line": {
            fontFamily: "inherit",
          },
        }),
        EditorView.lineWrapping,
        oneDark,
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [value, onChange, isMounted, locale]);

  return (
    <div 
      ref={editorRef} 
      className="border rounded overflow-hidden flex-1 dark:border-gray-700 bg-white dark:bg-gray-900"
      style={{ minHeight: "300px" }}
    />
  );
}
