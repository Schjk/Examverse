import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const init = () => {
  const container = document.getElementById('root');
  if (!container) {
    console.error("AceRank Error: Root container not found in DOM.");
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("AceRank successfully mounted to #root.");
  } catch (err) {
    console.error("AceRank Mounting Error:", err);
    container.innerHTML = `
      <div style="padding: 40px; color: #dc2626; font-family: sans-serif; text-align: center;">
        <h2 style="font-weight: bold; font-size: 1.25rem;">Runtime Error</h2>
        <p>${err instanceof Error ? err.message : String(err)}</p>
      </div>
    `;
  }
};

// Check if DOM is ready, then initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
