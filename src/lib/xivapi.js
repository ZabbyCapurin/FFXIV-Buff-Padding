class XIVAPI {
  constructor() {
    this.base = 'https://xivapi.com';
  }
  handleErrors(response, throwError) {
    if (!response.ok && throwError !== false) {
      throw Error(response.statusText);
    }
    return response.json();
  }
  findCharacter(name, server) {
    let url = `${this.base}/character/search?name=${name}${typeof server !== 'undefined' && server !== null ? `${server }&server=${server}`: ''}&columns=Avatar,ID,Name,Server`;
    return fetch(url)
      .then(this.handleErrors);
  }
  getCharacter(lodestoneId, data) {
    let url = `${this.base}/character/${lodestoneId}?${typeof data !== 'undefined' && data !== null ? `${data }&data=${data}`: ''}`;
    let urlUpdate = `${this.base}/character/${lodestoneId}/update`;
    return fetch(urlUpdate)
      .then(response => this.handleErrors(response, false))
      .then(() =>
        fetch(url)
          .then(this.handleErrors)
      );
  }
  getServers() {
    let url = `${this.base}/servers/dc`;
    return fetch(url)
      .then(this.handleErrors);
  }
}

export default XIVAPI;