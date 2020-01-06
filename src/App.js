import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './screens/Home';
import Dashboard from './screens/Dashboard';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/" component={Home} />
        <Route exact path="/user/signin/callback" component={() => <Home/>} />
      </Switch>
    </Router>
  );
}

export default App;
