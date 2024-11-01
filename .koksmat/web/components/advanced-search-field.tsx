import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import * as monaco from 'monaco-editor'; // Import Monaco directly
import { parse } from 'yaml';

const Editor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.Editor),
  { ssr: false }
);

interface Property {
  name: string;
  values: string[];
}

interface SearchTokenEditorProps {
  initialData: string;
  onUpdate: (data: any) => void;
  properties?: Property[];
}

export const SearchTokenEditor: React.FC<SearchTokenEditorProps> = ({ initialData, onUpdate, properties = [] }) => {
  const [content, setContent] = useState(initialData);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
      onUpdate(value);
      validateProperties(value); // Pass monaco as an argument
    }
  };

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;

    // Capture the Enter key to prevent new lines
    editor.onKeyDown((e: any) => {
      if (e.keyCode === 13) { // 13 is the keyCode for Enter
        e.preventDefault(); // Prevents new line creation
      }
    });

    if (properties.length > 0) {
      // Define custom language for syntax highlighting
      monaco.languages.register({ id: 'customFilterLanguage' });

      // Define tokenization rules for color-coding property names
      monaco.languages.setMonarchTokensProvider('customFilterLanguage', {
        tokenizer: {
          root: [
            [
              new RegExp(`\\b(${properties.map(p => p.name).join('|')}):`),
              'keyword'
            ],
            [/"([^"\\]|\\.)*$/, 'string.invalid'],  // Invalid string if not closed
            [/"/, { token: 'string.quote', next: '@string' }],
          ],
          string: [
            [/[^\\"]+/, 'string'],
            [/\\./, 'string.escape'],
            [/"/, { token: 'string.quote', next: '@pop' }],
          ],
        },
      });

      // Register the completion provider for autocomplete
      monaco.languages.registerCompletionItemProvider('customFilterLanguage', {
        triggerCharacters: [':', ' '],
        provideCompletionItems: (model, position) => {
          const textUntilPosition = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          });

          const isNewPropertyContext = /(^|\s)(?!.*["][^"]*$)(\w*)$/.test(textUntilPosition);

          let suggestions: monaco.languages.CompletionItem[] = [];

          if (isNewPropertyContext) {
            suggestions = properties.map(prop => ({
              label: prop.name,
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: `${prop.name}:`,
              range: {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: position.column - textUntilPosition.trim().length,
                endColumn: position.column,
              },
              command: {
                id: 'editor.action.triggerSuggest',
                title: 'Trigger Suggestions'
              }
            }));
          } else {
            const match = textUntilPosition.match(/(\w+):\s*(\w*)$/);
            if (match) {
              const [_, propName, partialValue] = match;
              const property = properties.find(prop => prop.name === propName);
              if (property) {
                suggestions = property.values
                  .filter(value => value.startsWith(partialValue || ''))
                  .map(value => ({
                    label: value,
                    kind: monaco.languages.CompletionItemKind.Value,
                    insertText: value,
                    range: {
                      startLineNumber: position.lineNumber,
                      endLineNumber: position.lineNumber,
                      startColumn: position.column - partialValue.length,
                      endColumn: position.column,
                    },
                  }));
              }
            }
          }

          return { suggestions };
        },
      });

      // Set the theme to make it look like an input
      monaco.editor.defineTheme('customTheme', {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: '007acc' },
          { token: 'string', foreground: 'd69d85' },
        ],
        colors: {}
      });
      monaco.editor.setTheme('customTheme');
      //editor.updateOptions({ language: 'customFilterLanguage' });
    }
  };

  const validateProperties = (value: string) => {
    if (!editorRef.current) return;

    const allowedProperties = new Set(properties.map(prop => prop.name));
    const model = editorRef.current.getModel();
    if (!model) return;

    const markers: monaco.editor.IMarkerData[] = [];

    // Simple parsing logic to identify unknown properties (basic YAML-style parsing)
    const lines = value.split('\n');
    lines.forEach((line, index) => {
      const match = line.match(/^(\w+):/);
      if (match) {
        const propertyName = match[1];
        if (!allowedProperties.has(propertyName)) {
          markers.push({
            severity: monaco.MarkerSeverity.Error,
            message: `Unknown property: "${propertyName}"`,
            startLineNumber: index + 1,
            startColumn: 1,
            endLineNumber: index + 1,
            endColumn: line.length + 1,
          });
        }
      }
    });

    // Apply markers to show errors for unknown properties
    monaco.editor.setModelMarkers(model, 'customFilterLanguage', markers);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="editor-container">
      <Editor
        height="40px"
        width="100%"
        language="customFilterLanguage"
        value={content}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          lineNumbers: 'off',
          scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
          overviewRulerLanes: 0,
          //hideCursorInOverviewRurer: true,
          renderLineHighlight: 'none',
          renderLineHighlightOnlyWhenFocus: false,
          scrollBeyondLastLine: false,
          wordWrap: 'off',
          automaticLayout: true,
          folding: false,
          glyphMargin: false,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0,
          contextmenu: false,
          fontSize: 16,
          fontFamily: 'inherit',
          selectionHighlight: false,
          fixedOverflowWidgets: true,
        }}
        aria-labelledby="editor-label"
      />
    </div>
  );
};

export default SearchTokenEditor;