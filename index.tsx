import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Critical Failure during React hydration:", error);
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 2rem; color: #dc2626; font-family: sans-serif;">
        <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Mount Error</h1>
        <p>${error instanceof Error ? error.message : String(error)}</p>
      </div>
    `;
  }
}