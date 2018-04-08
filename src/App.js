import React, { Component } from 'react';

import './App.css';
import Toggle from './components/ToggleButton';
import Data from './components/DataRow';
import Header from './components/HeaderRow';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Toggle label="Yeah" type="A" />
        <Toggle label="Cool" type="B" />
        <Header/>
        <Data/>
        <Data/>
        <Header/>
        <Data/>
        <Data/>
      </div>
    );
  }
}

export default App;
