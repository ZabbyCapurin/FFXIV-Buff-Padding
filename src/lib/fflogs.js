class FFLogs {  
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.base = 'https://www.fflogs.com:443/v1'
  }
  handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  }
  getZones(params) {
    let url = `${this.base}/zones?${typeof params !== "undefined" ? params + '&': ''}api_key=${this.apiKey}`;
    return fetch(url)
      .then(this.handleErrors);
  }
  getClasses(params) {                             
    let url = `${this.base}/classes?${typeof params !== "undefined" ? params + '&': ''}api_key=${this.apiKey}`;
    return fetch(url)
      .then(this.handleErrors);
  }
  getEncounterRankings(encounterId, params) {
    let url = `${this.base}/rankings/encounter/${encounterId}?${typeof params !== "undefined" ? params + '&': ''}api_key=${this.apiKey}`;
    return fetch(url)
      .then(this.handleErrors);
  }
  getCharacterRankings(characterName, serverName, serverRegion, params) {
    let url = `${this.base}/rankings/character/${characterName}/${serverName}/${serverRegion}?${typeof params !== "undefined" ? params + '&': ''}api_key=${this.apiKey}`;
    return fetch(url)
      .then(this.handleErrors);
  }
  getParses(characterName, serverName, serverRegion, params) {
    let url = `${this.base}/parses/character/${characterName}/${serverName}/${serverRegion}?${typeof params !== "undefined" ? params + '&': ''}api_key=${this.apiKey}`;
    return fetch(url)
      .then(this.handleErrors);
  }
  getGuildReports(guildName, serverName, serverRegion, params) {
    let url = `${this.base}/reports/guild/${guildName}/${serverName}/${serverRegion}?${typeof params !== "undefined" ? params + '&': ''}api_key=${this.apiKey}`;
    return fetch(url)
      .then(this.handleErrors);
  }
  getUserReports(userName, params) {
    let url = `${this.base}/reports/user/${userName}?${typeof params !== "undefined" ? params + '&': ''}api_key=${this.apiKey}`;
    return fetch(url)
      .then(this.handleErrors);
  }
  getCharacterInfo(characterName, serverName, serverRegion, parseParams, characterRankingParams) {
    let parses = this.getParses(characterName, serverName, serverRegion, parseParams);
    let characterRanking = this.getCharacterRankings(characterName, serverName, serverRegion, characterRankingParams);

    return Promise.all([parses, characterRanking].map(p => p.catch(e => e)));
  }
}

export default FFLogs;