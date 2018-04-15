import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Table from './Table';
import Button from './Button';
import Home from './Home';
import Time from './Time';
import Timeline from './Timeline';

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/table' component={Table}/>
      <Route path='/button' component={Button}/>
      <Route path='/time' component={Time}/>
      <Route path='/timeline' component={Timeline}/>
    </Switch>
  </main>
);

export default Main;
