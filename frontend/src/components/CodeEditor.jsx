import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, setCode, language = "javascript" }) {
  return (
    <Editor
      height="400px"
      language={language}
      value={code}
      theme="vs-dark"
      onChange={(value) => setCode(value)}
    />
  );
}
