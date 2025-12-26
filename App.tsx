import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ExamProvider } from './context/ExamContext.tsx';
import Dashboard from './components/Dashboard.tsx';
import ExamInterface from './components/Exam/ExamInterface.tsx';
import Analysis from './components/Results/Analysis.tsx';

const App: React.FC = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ExamProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/exam" element={<ExamInterface />} />
          <Route path="/results" element={<Analysis />} />
        </Routes>
      </ExamProvider>
    </Router>
  );
};

export default App;