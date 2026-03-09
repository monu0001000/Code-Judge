import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";

export default function CollaborativeEditor({ roomId }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const ydoc = new Y.Doc();

    const provider = new WebsocketProvider(
      "ws://localhost:1234",
      roomId,
      ydoc
    );

    const yText = ydoc.getText("monaco");

    provider.on("status", (event) => {
      console.log("WebSocket status:", event.status);
    });

    let binding;

    if (editorRef.current) {
      binding = new MonacoBinding(
        yText,
        editorRef.current.getModel(),
        new Set([editorRef.current]),
        provider.awareness
      );
    }

    return () => {
      if (binding) binding.destroy();
      provider.destroy();
      ydoc.destroy();
    };
  }, [roomId]);

  return (
    <Editor
      height="500px"
      defaultLanguage="javascript"
      onMount={(editor) => {
        editorRef.current = editor;
      }}
    />
  );
}