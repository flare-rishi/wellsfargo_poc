import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTextEditorData,
  selectDeletedColumns,
  updateTextEditorData,
} from "../../slices/dataSlice/dataSlice";

const TextEditor = () => {
  const jsonData = useSelector(selectTextEditorData);
  const deletedColumns = useSelector(selectDeletedColumns);
  const [editor, setEditor] = useState(null);
  const [decorationsIds, setDecorationsIds] = useState([]);
  const dispatch = useDispatch();

  const handleEditorChange = (value) => {
    dispatch(updateTextEditorData(value));
  };

  const applyDecorations = (editor) => {
    const decorations = [];
    const model = editor.getModel();

    // Iterate over lines in the editor
    for (let lineNumber = 1; lineNumber <= model.getLineCount(); lineNumber++) {
      const lineText = model.getLineContent(lineNumber);

      // Collect deleted columns for this line
      const deletedColumnsInLine = [];
      deletedColumns.forEach((col) => {
        const regex = new RegExp(`\\b${col}\\b`, "gi");
        if (regex.test(lineText)) {
          deletedColumnsInLine.push(col);
        }
      });

      // Create decoration for the entire line with a glyph margin
      if (deletedColumnsInLine.length > 0) {
        decorations.push({
          range: new monaco.Range(lineNumber, 1, lineNumber, 1),
          options: {
            isWholeLine: true,
            glyphMarginClassName: "deletedColumnGlyph",
            glyphMarginHoverMessage: {
              value: `Deleted columns: ${deletedColumnsInLine.join(", ")}`,
            },
            className: "deletedColumnLineDecoration",
          },
        });

        decorations.push({
          range: new monaco.Range(lineNumber, 1, lineNumber, 1),
          options: {
            isWholeLine: true,
            glyphMarginClassName: "deletedColumnGlyph",
            glyphMarginHoverMessage: {
              value: `Deleted columns: ${deletedColumnsInLine.join(", ")}`,
            },
            className: "deletedColumnLineDecoration",
            overviewRuler: {
              color: "rgba(255, 0, 0, 0.5)",
              darkColor: "rgba(255, 0, 0, 0.5)",
              position: monaco.editor.OverviewRulerLane.Full,
            },
          },
        });

        // Create decorations for each matched column name (underlining)
        deletedColumnsInLine.forEach((col) => {
          const regex = new RegExp(`\\b${col}\\b`, "gi");
          let match;
          while ((match = regex.exec(lineText)) !== null) {
            const startPos = model.getPositionAt(match.index);
            const endPos = model.getPositionAt(match.index + match[0].length);

            decorations.push({
              range: new monaco.Range(
                startPos.lineNumber,
                startPos.column,
                endPos.lineNumber,
                endPos.column
              ),
              options: {
                className: "deletedColumnTextDecoration",
              },
            });
          }
        });
      }
    }

    // Apply decorations and store the new decoration IDs
    const newDecorationsIds = editor.deltaDecorations(
      decorationsIds,
      decorations
    );
    setDecorationsIds(newDecorationsIds);
  };

  useEffect(() => {
    if (editor) {
      applyDecorations(editor);
    }
  }, [editor, jsonData, deletedColumns]);

  return (
    <div style={{ height: "100%", width: "95%", padding: "20px" }}>
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="json"
        value={jsonData}
        onChange={handleEditorChange}
        onMount={(editor) => setEditor(editor)}
        options={{
          minimap: { enabled: true },
          formatOnType: true,
          formatOnPaste: true,
          automaticLayout: true,
          cursorBlinking: true,
          glyphMargin: true,
        }}
      />
      <style jsx>{`
        .deletedColumnTextDecoration {
          text-decoration: underline wavy yellow 3px;
        }
        .deletedColumnLineDecoration {
          background-color: rgba(255, 0, 0, 0.3);
        }
        .deletedColumnGlyph {
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>')
            no-repeat center center;
          width: 20px;
          height: 20px;
          margin-left: 5px;
        }
      `}</style>
    </div>
  );
};

export default TextEditor;
