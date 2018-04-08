import React, { Component } from 'react';
import './App.css';
import Toggle from './components/ToggleButton'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Toggle label="Yeah" type="A" />
        <Toggle label="Cool" type="B" />
      </div>
    );
  }
}

export default App;
