import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setResponse("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    setResponse(data.response || data.error);
    setLoading(false);
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Anthropic API — First Request</h1>
      <p style={styles.subtitle}>Simple chat using claude-opus-4-5</p>

      <form onSubmit={sendMessage} style={styles.form}>
        <textarea
          style={styles.textarea}
          rows={4}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>

      {response && (
        <div style={styles.responseBox}>
          <strong>Claude:</strong>
          <p style={styles.responseText}>{response}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 640,
    margin: "60px auto",
    fontFamily: "sans-serif",
    padding: "0 16px",
  },
  title: {
    fontSize: 24,
    marginBottom: 4,
  },
  subtitle: {
    color: "#666",
    marginBottom: 24,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  textarea: {
    width: "100%",
    padding: 12,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
    resize: "vertical",
    boxSizing: "border-box",
  },
  button: {
    padding: "10px 24px",
    fontSize: 16,
    backgroundColor: "#c96442",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  responseBox: {
    marginTop: 32,
    padding: 16,
    backgroundColor: "#f9f6f2",
    borderRadius: 6,
    border: "1px solid #e0d8cf",
  },
  responseText: {
    marginTop: 8,
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },
};
