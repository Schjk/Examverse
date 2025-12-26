import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ExamProvider } from './context/ExamContext';
import Dashboard from './components/Dashboard';
import ExamInterface from './components/Exam/ExamInterface';
import Analysis from './components/Results/Analysis';

const App: React.FC = () => {
  return (
    <Router>
      <ExamProvider>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/exam" component={ExamInterface} />
          <Route path="/results" component={Analysis} />
        </Switch>
      </ExamProvider>
    </Router>
  );
};

export default App;