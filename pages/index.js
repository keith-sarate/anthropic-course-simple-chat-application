import { useState } from "react";

// --- Simple Chat (no history) ---
function SimpleChat() {
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
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>Simple Chat</h2>
      <p style={styles.panelSubtitle}>Each message is independent — no memory between turns</p>

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

// --- Multi Turn Conversation ---
function MultiTurnConversation() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  function addUserMessage(msgs, text) {
    return [...msgs, { role: "user", content: text }];
  }

  function addAssistantMessage(msgs, text) {
    return [...msgs, { role: "assistant", content: text }];
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const updatedMessages = addUserMessage(messages, input);
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/multi-turn-conversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages }),
    });

    const data = await res.json();
    const reply = data.response || data.error;

    setMessages(addAssistantMessage(updatedMessages, reply));
    setLoading(false);
  }

  return (
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>Multi Turn Conversation</h2>
      <p style={styles.panelSubtitle}>Conversation context is maintained across all turns</p>

      <div style={styles.messageList}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={msg.role === "user" ? styles.userBubble : styles.assistantBubble}
          >
            <strong>{msg.role === "user" ? "You" : "Claude"}:</strong>
            <p style={styles.responseText}>{msg.content}</p>
          </div>
        ))}
        {loading && (
          <div style={styles.assistantBubble}>
            <em>Claude is thinking...</em>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} style={styles.form}>
        <textarea
          style={styles.textarea}
          rows={4}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div style={styles.formRow}>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
          <button
            type="button"
            style={styles.clearButton}
            onClick={() => setMessages([])}
            disabled={loading || messages.length === 0}
          >
            Clear history
          </button>
        </div>
      </form>
    </div>
  );
}

// --- System Prompt Chat ---
function SystemPromptChat() {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  function addUserMessage(msgs, text) {
    return [...msgs, { role: "user", content: text }];
  }

  function addAssistantMessage(msgs, text) {
    return [...msgs, { role: "assistant", content: text }];
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const updatedMessages = addUserMessage(messages, input);
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/system-prompt-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages, system: systemPrompt }),
    });

    const data = await res.json();
    const reply = data.response || data.error;

    setMessages(addAssistantMessage(updatedMessages, reply));
    setLoading(false);
  }

  return (
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>System Prompt Chat</h2>
      <p style={styles.panelSubtitle}>Shape Claude's tone, style, and approach to match your specific use case</p>

      <label style={styles.systemLabel}>System prompt (optional)</label>
      <div style={styles.systemExample}>
        <strong>Example:</strong> "You are a patient math tutor. Do not directly answer a student's questions. Guide them to a solution step by step."
      </div>
      <textarea
        style={{ ...styles.textarea, ...styles.systemTextarea }}
        rows={4}
        placeholder="Enter your system prompt here..."
        value={systemPrompt}
        onChange={(e) => setSystemPrompt(e.target.value)}
      />

      <div style={styles.divider} />

      <div style={styles.messageList}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={msg.role === "user" ? styles.userBubble : styles.assistantBubble}
          >
            <strong>{msg.role === "user" ? "You" : "Claude"}:</strong>
            <p style={styles.responseText}>{msg.content}</p>
          </div>
        ))}
        {loading && (
          <div style={styles.assistantBubble}>
            <em>Claude is thinking...</em>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} style={styles.form}>
        <textarea
          style={styles.textarea}
          rows={3}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div style={styles.formRow}>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
          <button
            type="button"
            style={styles.clearButton}
            onClick={() => setMessages([])}
            disabled={loading || messages.length === 0}
          >
            Clear history
          </button>
        </div>
      </form>
    </div>
  );
}

// --- Temperature Chat ---
function TemperatureChat() {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [temperature, setTemperature] = useState(1.0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  function addUserMessage(msgs, text) {
    return [...msgs, { role: "user", content: text }];
  }

  function addAssistantMessage(msgs, text) {
    return [...msgs, { role: "assistant", content: text }];
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const updatedMessages = addUserMessage(messages, input);
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/temperature-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages, system: systemPrompt, temperature }),
    });

    const data = await res.json();
    const reply = data.response || data.error;

    setMessages(addAssistantMessage(updatedMessages, reply));
    setLoading(false);
  }

  return (
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>Temperature Chat</h2>
      <p style={styles.panelSubtitle}>Control randomness — lower values are focused, higher values are creative</p>

      <div style={styles.tempGuide}>
        <div style={styles.tempGuideBlock}>
          <span style={{ ...styles.tempGuideBadge, backgroundColor: "#dbeafe", color: "#1d4ed8" }}>Low (0.0 – 0.3)</span>
          <span>Factual responses · Coding · Data extraction · Content moderation</span>
        </div>
        <div style={styles.tempGuideBlock}>
          <span style={{ ...styles.tempGuideBadge, backgroundColor: "#fef9c3", color: "#854d0e" }}>Medium (0.4 – 0.7)</span>
          <span>Summarization · Education · Problem-solving · Constrained creative writing</span>
        </div>
        <div style={styles.tempGuideBlock}>
          <span style={{ ...styles.tempGuideBadge, backgroundColor: "#fee2e2", color: "#b91c1c" }}>High (0.8 – 1.0)</span>
          <span>Brainstorming · Creative writing · Marketing · Jokes</span>
        </div>
      </div>

      <label style={styles.systemLabel}>System prompt (optional)</label>
      <div style={styles.systemExample}>
        <strong>Example:</strong> "You are a patient math tutor. Do not directly answer a student's questions. Guide them to a solution step by step."
      </div>
      <textarea
        style={{ ...styles.textarea, ...styles.systemTextarea }}
        rows={3}
        placeholder="Enter your system prompt here..."
        value={systemPrompt}
        onChange={(e) => setSystemPrompt(e.target.value)}
      />

      <div style={styles.temperatureRow}>
        <label style={styles.systemLabel}>Temperature: <span style={styles.tempValue}>{temperature.toFixed(1)}</span></label>
        <div style={styles.tempLabels}>
          <span>Precise (0.0)</span>
          <span>Creative (1.0)</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          style={styles.slider}
        />
      </div>

      <div style={styles.divider} />

      <div style={styles.messageList}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={msg.role === "user" ? styles.userBubble : styles.assistantBubble}
          >
            <strong>{msg.role === "user" ? "You" : "Claude"}:</strong>
            <p style={styles.responseText}>{msg.content}</p>
          </div>
        ))}
        {loading && (
          <div style={styles.assistantBubble}>
            <em>Claude is thinking...</em>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} style={styles.form}>
        <textarea
          style={styles.textarea}
          rows={3}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div style={styles.formRow}>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
          <button
            type="button"
            style={styles.clearButton}
            onClick={() => setMessages([])}
            disabled={loading || messages.length === 0}
          >
            Clear history
          </button>
        </div>
      </form>
    </div>
  );
}

// --- Streaming Chat ---
function StreamingChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [streamingText, setStreamingText] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const updatedMessages = [...messages, { role: "user", content: input }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setStreamingText("");

    const res = await fetch("/api/streaming-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    let finished = false;
    while (!finished) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") { finished = true; break; }
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              fullText += parsed.text;
              setStreamingText(fullText);
            }
          } catch {}
        }
      }
    }

    setMessages([...updatedMessages, { role: "assistant", content: fullText }]);
    setStreamingText("");
    setLoading(false);
  }

  return (
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>Streaming Chat</h2>
      <p style={styles.panelSubtitle}>Text streams in real-time — appears as Claude generates it</p>

      <div style={styles.streamingBadge}>SSE · text/event-stream</div>

      <div style={styles.messageList}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={msg.role === "user" ? styles.userBubble : styles.assistantBubble}
          >
            <strong>{msg.role === "user" ? "You" : "Claude"}:</strong>
            <p style={styles.responseText}>{msg.content}</p>
          </div>
        ))}
        {loading && !streamingText && (
          <div style={styles.assistantBubble}>
            <em>Claude is thinking...</em>
          </div>
        )}
        {loading && streamingText && (
          <div style={styles.assistantBubble}>
            <strong>Claude:</strong>
            <p style={styles.responseText}>
              {streamingText}
              <span style={styles.cursor}>▌</span>
            </p>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} style={styles.form}>
        <textarea
          style={styles.textarea}
          rows={3}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div style={styles.formRow}>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Streaming..." : "Send"}
          </button>
          <button
            type="button"
            style={styles.clearButton}
            onClick={() => setMessages([])}
            disabled={loading || messages.length === 0}
          >
            Clear history
          </button>
        </div>
      </form>
    </div>
  );
}

// --- Page ---
export default function Home() {
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Anthropic API — Chat</h1>
      <p style={styles.subtitle}>claude-opus-4-5</p>
      <div style={styles.columns}>
        <SimpleChat />
        <MultiTurnConversation />
        <SystemPromptChat />
        <TemperatureChat />
        <StreamingChat />
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "sans-serif",
    padding: "32px 12px",
    maxWidth: "100%",
    margin: "0 auto",
  },
  title: {
    fontSize: 26,
    marginBottom: 4,
  },
  subtitle: {
    color: "#666",
    marginBottom: 32,
  },
  columns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
    gap: 16,
    alignItems: "start",
  },
  panel: {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 16,
    backgroundColor: "#fff",
  },
  panelTitle: {
    fontSize: 18,
    marginBottom: 4,
    marginTop: 0,
  },
  panelSubtitle: {
    color: "#888",
    fontSize: 13,
    marginBottom: 20,
    marginTop: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  formRow: {
    display: "flex",
    gap: 8,
  },
  textarea: {
    width: "100%",
    padding: 12,
    fontSize: 15,
    borderRadius: 6,
    border: "1px solid #ccc",
    resize: "vertical",
    boxSizing: "border-box",
  },
  button: {
    padding: "10px 24px",
    fontSize: 15,
    backgroundColor: "#c96442",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  clearButton: {
    padding: "10px 16px",
    fontSize: 15,
    backgroundColor: "transparent",
    color: "#888",
    border: "1px solid #ccc",
    borderRadius: 6,
    cursor: "pointer",
  },
  responseBox: {
    marginTop: 24,
    padding: 14,
    backgroundColor: "#f9f6f2",
    borderRadius: 6,
    border: "1px solid #e0d8cf",
  },
  messageList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 20,
    maxHeight: 420,
    overflowY: "auto",
  },
  userBubble: {
    padding: 12,
    backgroundColor: "#eef2ff",
    borderRadius: 6,
    border: "1px solid #d0d9f5",
  },
  assistantBubble: {
    padding: 12,
    backgroundColor: "#f9f6f2",
    borderRadius: 6,
    border: "1px solid #e0d8cf",
  },
  responseText: {
    marginTop: 4,
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },
  systemLabel: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#555",
    marginBottom: 6,
  },
  systemExample: {
    fontSize: 12,
    color: "#777",
    backgroundColor: "#f4f4f4",
    border: "1px solid #e0e0e0",
    borderRadius: 6,
    padding: "8px 12px",
    marginBottom: 8,
    lineHeight: 1.5,
  },
  systemTextarea: {
    backgroundColor: "#fafff5",
    border: "1px solid #b8dfa0",
  },
  divider: {
    borderTop: "1px dashed #ddd",
    margin: "20px 0",
  },
  temperatureRow: {
    marginTop: 16,
    marginBottom: 4,
  },
  tempValue: {
    color: "#c96442",
    fontWeight: 700,
  },
  tempLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 11,
    color: "#999",
    marginBottom: 4,
  },
  slider: {
    width: "100%",
    accentColor: "#c96442",
    cursor: "pointer",
  },
  tempGuide: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginBottom: 16,
    fontSize: 12,
    color: "#555",
  },
  tempGuideBlock: {
    display: "flex",
    alignItems: "baseline",
    gap: 8,
    lineHeight: 1.5,
  },
  tempGuideBadge: {
    flexShrink: 0,
    borderRadius: 4,
    padding: "1px 7px",
    fontWeight: 600,
    fontSize: 11,
  },
  cursor: {
    display: "inline-block",
    color: "#c96442",
    animation: "blink 1s step-end infinite",
  },
  streamingBadge: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 600,
    color: "#7c3aed",
    backgroundColor: "#ede9fe",
    border: "1px solid #ddd6fe",
    borderRadius: 4,
    padding: "2px 8px",
    marginBottom: 16,
  },
};
