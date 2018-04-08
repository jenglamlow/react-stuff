import React, { Component } from 'react';

import './App.css';
import Toggle from './components/ToggleButton';
import Data from './components/DataRow';
import Header from './components/HeaderRow';

import onA from './img/on.png';
import offA from './img/off.png';
import onB from './img/switch-on.png';
import offB from './img/switch-off.png';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Toggle label="Yeah" on={onA} off={offA}/>
        <Toggle label="Cool" on={onB} off={offB}/>

        <br />
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
