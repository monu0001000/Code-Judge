import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, setCode }) {
  return (
    <Editor
      height="400px"
      language="javascript"
      value={code}
      theme="vs-dark"
      onChange={(value) => setCode(value)}
    />
  );
}
