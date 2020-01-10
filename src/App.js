import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './screens/Home';
import Dashboard from './screens/Dashboard';
import Genres from './screens/Genres';

function App() {
  return (
    <Router>
      <Switch>
        {/* <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/" component={Home} /> */}
        <Route exact path="/genres" component={Genres} />
        {/* <Route exact path="/user/signin/callback" component={Home} /> */}
      </Switch>
    </Router>
  );
}

export default App;
