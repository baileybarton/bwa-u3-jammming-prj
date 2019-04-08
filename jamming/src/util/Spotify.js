let accessToken;
let expiresIn;
const clientID = "b7b9606a04c24d0786aa3724196d97e5";
const redirectURI = "http://localhost:3000/";
let spotifyURI = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`

let Spotify = {

  getAccessToken() {
    if (accessToken) {
      return accessToken
    };

    let hasAccessToken = window.location.href.match(/access_token=([^&]*)/);
    let hasExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

    if (hasAccessToken && hasExpiresIn) {
      accessToken = hasAccessToken[1];
      expiresIn = hasExpiresIn[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken
    } else {
      window.location(spotifyURI);
    }
  },

  search(term) {
      fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(response => response.json())
      .then(jsonResponse => {
        if (!jsonResponse.tracks) {
          return []
        }
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }))
      })
  },

  savePlaylist(playlistName, trackURIs) {
    if (!playlistName || !trackURIs) {
      return
    }
    let accessToken = Spotify.getAccessToken();
    let headers = { Authorization: `Bearer ${accessToken}` };
    let userID;
    Spotify.getUserID(headers)
    .then(id => {
      userID = id
      return Spotify.newPlaylist(headers, userID, playlistName)
    })
    .then(playlistID => {
      return Spotify.addTrackToPlaylist(headers, userID, playlistID, trackURIs)
    })
  },

  getUserID(headers) {
    return fetch('https://api.spotify.com/v1/me', {headers: headers})
    .then(response => response.json())
    .then(jsonResponse => jsonResponse.id)
  },

  newPlaylist(headers, userID, playlistName) {
    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({ name: playlistName })
    })
      .the(response => response.json())
      .then(jsonResponse => jsonResponse.id)
  },

  addTrackToPlaylist(headers, userID, playlistID, trackURIs) {
    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({ uris: trackURIs })
    })
  }
};

export default Spotify;
