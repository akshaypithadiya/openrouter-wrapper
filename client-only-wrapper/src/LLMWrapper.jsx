import React, { useState } from 'react';
import axios from 'axios';

const LLMWrapper = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'deepseek/deepseek-r1:free', // You can use other models too
          messages: [{ role: 'user', content: input }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer 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`,
            'HTTP-Referer': 'http://localhost:5173', // update with your actual app domain if deployed
            'X-Title': 'LLM - Client Only Wrapper', // can be anything
          },
        }
      );
      const reply = res.data.choices[0].message.content;
      setResponse(reply);
    } catch (error) {
      console.error(error);
      setResponse(
        'Something went wrong! Maybe the API key or quota is invalid.'
      );
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Chat with OpenRouter</h2>
      <textarea
        rows="4"
        cols="50"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything..."
      />
      <br />
      <button onClick={handleSend} disabled={loading || !input}>
        {loading ? 'Thinking...' : 'Send'}
      </button>
      <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
        <strong>Response :</strong> {response}
      </div>
    </div>
  );
};

export default LLMWrapper;
