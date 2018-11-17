import React, { Component } from 'react';
import ffLogs from './lib/fflogs';
import getQueryParam from './lib/getQueryParam';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    var apiKey = getQueryParam('apiKey');
    if (apiKey === null) {
      this.hasApiKey = false;
    }
    else {
      this.hasApiKey = true;
      const ffLog = new ffLogs(apiKey);
      this.ffLog = ffLog;
    }
    this.state = {
      ffClasses: null
    };
  }
  componentDidMount() {
    if (this.ffLog) {
      this.ffLog.getClasses().then(ffClasses => {
        this.setState({ ffClasses });
      });
    }

  }
  render() {
    const { ffClasses } = this.state;

    if (!this.hasApiKey) {
      return (        
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              No API Key provided as 'apiKey' parameter
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      )
    }
    else if (typeof ffClasses === 'undefined' || !ffClasses) {      
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Loading
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      );
    }
    else {
      const mappedFFClasses = ffClasses[0].specs.map(ffClass => {
        return (<li key={ffClass.id}>{ ffClass.name }</li>);
      });
      
      return (
        <ul>
          {mappedFFClasses}
        </ul>
      );
    }
  }
}

export default App;
