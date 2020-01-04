import React, {Component} from 'react';
import './App.css';
import {BrowserRouter, Route, Switch, withRouter} from 'react-router-dom';
import MainComponent from './MainComponent';
import HomeComponent from './HomeComponent';

function App() {
  return(
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={() => <MainComponent login="False" />}  />
        <Route exact path="/user/signin/callback" component={() => <MainComponent login="True" />}  />
        <Route exact path="/home" component={HomeComponent} />
      </Switch>
    </BrowserRouter>
  )
}
export default App;
