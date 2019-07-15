import React from 'react';
import {
  editor as monacoEditor,
  languages as monacoLanguages,
} from 'monaco-editor';

const staticSuggestions = [
  {
    label: 'print',
    kind: monacoLanguages.CompletionItemKind.Function,
    insertText: 'print()',
    detail: 'print functions',
    documentation: 'print',
  },
  {
    label: 'int',
    kind: monacoLanguages.CompletionItemKind.Keyword,
    detail: 'int',
    insertText: 'int',
  },
];

class PythonCompletionProvider {
  triggerCharacters = [];
  provideCompletionItems(model, position, context, cancellationToken) {
    console.group('provideCompletionItems');
    console.log({ model, position, context, cancellationToken });
    console.groupEnd();

    return {
      suggestions: this.getKeywords(),
    };
  }

  getKeywords() {
    return [...staticSuggestions];
  }
}

export function useMonacoEditor(options) {
  const containerRef = React.useRef();
  const editorRef = React.useRef();
  const disposables = React.useRef({});
  const addDisposable = React.useMemo(() => {
    return (fn, name = `disposable`) => {
      if (!editorRef.current) {
        console.warn('editor has not been instantiated');
        return;
      }

      const disposable = fn(editorRef.current);
      disposables.current[`${name}__${new Date().getTime()}`] = disposable;
    };
  }, []);
  const containerCallbackRef = React.useCallback(
    el => {
      if (el) {
        containerRef.current = el;
        const editor = monacoEditor.create(el, {
          value: '',
          language: 'python',
          minimap: { enabled: false },
          codeLens: false,
          fontSize: '16px',
          tabCompletion: 'on',
          theme: 'vs-dark',
          ...options,
        });
        const pythonCompletionProvider = monacoLanguages.registerCompletionItemProvider(
          'python',
          new PythonCompletionProvider(),
        );

        editorRef.current = editor;

        disposables.current.editor = editor;
        disposables.current.pythonCompletionProvider = pythonCompletionProvider;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  React.useEffect(() => {
    return () => {
      console.group('useMonacoEditor');
      console.log('dispose all listeners');
      console.groupEnd();

      Object.keys(disposables).forEach(k => {
        disposables[k].dispose();
      });
    };
  }, []);

  return {
    containerCallbackRef,
    containerRef,
    editorRef,
    addDisposable,
  };
}
