/* eslint-disable no-undef */
import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

const OpenRouterWrapper = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const currentInput = input;
    setLoading(true);
    setInput(input);

    try {
      const res = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          // Model to use and user message
          model: 'deepseek/deepseek-r1:free',
          messages: [{ role: 'user', content: currentInput }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`, // API key
            'HTTP-Referer': 'http://localhost:5173', // App URL (change when deployed)
            'X-Title': 'LLM - Client Only Wrapper', // App identifier (optional)
          },
        }
      );
      const reply = res.data.choices[0].message.content;
      // Add request/response pair to the top of history
      setHistory((prev) => [
        { request: currentInput, response: reply },
        ...prev,
      ]);
    } catch (error) {
      console.error(error);
      // Append error message to history
      setHistory((prev) => [
        {
          request: currentInput,
          response:
            'Something went wrong! Maybe the API key or quota is invalid.',
        },
        ...prev,
      ]);
    }
    setLoading(false);
    setInput('');
  };

  return (
    <div className="chat-container">
      <h1>OpenRouter LLM Playground</h1>
      <textarea
        className="chat-input"
        rows="6"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything..."
        disabled={loading}
      />
      <button
        className="chat-button"
        onClick={handleSend}
        disabled={loading || !input}
      >
        {loading ? 'Thinking...' : 'Send'}
      </button>
      <div className="chat-history">
        {history.map((item, index) => (
          <div key={index}>
            <div className="chat-request">
              <strong>Request</strong>
              <div>{item.request}</div>
            </div>
            <div className="chat-response">
              <strong>Response</strong>
              <div>{item.response}</div>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpenRouterWrapper;
