import React from "react";

const AIAnalysis = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div style={styles.container}>
      <h2>AI Code Review</h2>

      <Section title="Logic" content={analysis.logic} />
      <Section title="Edge Cases" content={analysis.edgeCases} />
      <Section title="Time Complexity" content={analysis.timeComplexity} />
      <Section title="Improvement" content={analysis.improvement} />

      <div style={styles.section}>
        <h3>Improved Code</h3>
        <pre style={styles.code}>{analysis.improvedCode}</pre>
      </div>
    </div>
  );
};

const Section = ({ title, content }) => (
  <div style={styles.section}>
    <h3>{title}</h3>
    <p>{content}</p>
  </div>
);

const styles = {
  container: {
    marginTop: "20px",
    padding: "20px",
    background: "#1e1e1e",
    color: "white",
    borderRadius: "8px",
  },
  section: {
    marginBottom: "15px",
  },
  code: {
    background: "#111",
    padding: "10px",
    borderRadius: "6px",
    overflowX: "auto",
  },
};

export default AIAnalysis;