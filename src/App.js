import React, { Component } from 'react';
import {
    Alert
} from 'react-bootstrap';

import ffLogs from './lib/fflogs';
import xivApi from './lib/xivapi';
import getQueryParam from './lib/getQueryParam';
import CharacterSelect from './apps/characterSelect';
import EncounterSelect from './apps/encounterSelect';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component {
  static getServerRegion(serverName, allServers) {
    const allRegions = Object.keys(allServers);
    const result = allRegions.find(region => {
      const regions = allServers[region];
      return Object.keys(regions).find(dataCenter => {
        const dataCenters = regions[dataCenter];
        return dataCenters.find(server => {
          return server === serverName
        })
      })
    });
    return result;
  }
  constructor(props) {
    super(props);
    this.xivApi = new xivApi();
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
      ffClasses: null,
      zones: null,
      selectedCharacter: null,
      attemptedToGetCharacter: false,
      servers: null,
      selectedEncounter: null
    };
    this.renderBody = this.renderBody.bind(this);
    this.characterSelected = this.characterSelected.bind(this);
    this.encounterSelected = this.encounterSelected.bind(this);
  }
  componentDidMount() {
    if (this.ffLog) {
      const getClasses = this.ffLog.getClasses();
      const getZones = this.ffLog.getZones();
      const getServers = this.xivApi.getServers();
    
      Promise.all([getClasses, getZones, getServers].map(p => p.catch(e => e))).then(results => {        
        const ffClasses = results[0];
        const zones = results[1];
        const servers = results[2];
        const dataCenters = Object.keys(servers);

        const organizedServers = {
          "NA": {},
          "EU": {},
          "JP": {}
        };
        for (let i = 0, dataCentersCount = dataCenters.length; i < dataCentersCount; i += 1)
        {
          const dc = dataCenters[i];
          const dcObj = {};
          dcObj[dc] = servers[dc];

          switch(dc) {
            case "Aether":
            case "Primal":
            case "Crystal":
              organizedServers["NA"][dc] = servers[dc];
              break;
            case "Chaos":
            case "Light":
              organizedServers["EU"][dc] = servers[dc];
              break;
            case "Elemental":
            case "Gaia":
            case "Mana":
              organizedServers["JP"][dc] = servers[dc];
              break;
            default:
              organizedServers["NA"][dc] = servers[dc];
              break;
          }
        }
        this.setState({ ffClasses, zones, servers: organizedServers });
      });
    }
  }
  characterSelected(char) {
    if (typeof char === 'undefined' || char === null ||
      typeof char.Character === 'undefined' || char.Character === null)
    {
      this.setState({ selectedCharacter: null, attemptedToGetCharacter: true});
    } else {
      const { Name, Server } = char.Character;
      const serverRegion = App.getServerRegion(Server, this.state.servers);
      this.ffLog.getCharacterInfo(Name, Server, serverRegion).then(results => {
        const parses = results[0];
        const ranking = results[1];
        const character = {
          info: char,
          parses,
          ranking
        }
        this.setState({ selectedCharacter: character });
      });
    }
  }
  encounterSelected(encnt) {
    this.setState({ selectedEncounter: encnt });
  }
  renderBody() {
    const { attemptedToGetCharacter, zones, selectedCharacter, selectedEncounter } = this.state;

    let displaySelectedChar = null;
    let encounterDisplay = null;

    if (selectedCharacter) {
      const selectedChar = selectedCharacter.info;
      const { Avatar, Name, Server } = selectedChar.Character;

      displaySelectedChar = (
        <div id="characterSelected">
            <img src={Avatar} alt={Name}></img>
            { Name } | { Server }
        </div>
      );

      let encounter = null;
      if (selectedEncounter) {
        encounter = (
          <h2>{selectedEncounter.name}</h2>
        )
      }

      encounterDisplay = (
        <div id="encounterHolder">
          <EncounterSelect zones={zones} encounterSelected={this.encounterSelected} />
          { encounter }
        </div>
      );
    } else if (attemptedToGetCharacter) {
      displaySelectedChar = (
        <Alert bsStyle="danger">
          Something went wrong.  The character's data wasn't found.  Please try again or wait a few minutes/hours for XIV API to get it.
        </Alert>
      );
    }

    return (
      <div id="main-holder">
        <CharacterSelect xivApi={this.xivApi} characterSelected={this.characterSelected} />
        { displaySelectedChar }
        { encounterDisplay }
      </div>
    );
  }
  render() {
    const { servers } = this.state;
    const header = <img src={logo} className="App-logo" alt="logo" />;
    let body = null;

    if (!this.hasApiKey) {
      body =  (
        <p>
          No API Key provided as 'apiKey' parameter
        </p>
      )
    }
    else if (typeof servers === 'undefined' || servers === null) {
      body =  (
        <p>
          Loading
        </p>
      );
    }
    else {
      body = this.renderBody();
    }
    
    return (
      <div className="App">
        <header className="App-header">
          {header}
        </header>
        {body}
      </div>
    );
  }
}

export default App;
