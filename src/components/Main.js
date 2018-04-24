import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Table from './Table';
import Button from './Button';
import Home from './Home';
import Timeline from './Timeline';
import TimelineDual from './TimelineDual';
import ReactTableExample from './ReactTableExample';
import D3 from './DDD';

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/table' component={Table}/>
      <Route path='/react-table' component={ReactTableExample}/>
      <Route path='/button' component={Button}/>
      <Route path='/timeline' component={Timeline}/>
      <Route path='/timelinedual' component={TimelineDual}/>
      <Route path='/d3' component={D3}/>
    </Switch>
  </main>
);

export default Main;
