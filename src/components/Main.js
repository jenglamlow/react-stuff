import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Table from './Table';
import Button from './Button';
import Home from './Home';

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/table' component={Table}/>
      <Route path='/button' component={Button}/>
    </Switch>
  </main>
);

export default Main;
