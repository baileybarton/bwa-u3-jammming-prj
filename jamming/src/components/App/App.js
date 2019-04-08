import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    }
      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.updatePlaylistName = this.updatePlaylistName.bind(this);
      this.savePlaylist = this.savePlaylist.bind(this);
      this.search = this.search.bind(this);
    }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      let updatedPlaylistTracks = this.state.playListTracks.push(track)
      this.setState({ playlistTracks: updatedPlaylistTracks })
    }

  }

  removeTrack(track) {
    let updatedPlaylistTracks = this.state.playlistTracks.filter(plTrack => plTrack.id !== track.id);
    this.setState({ playlistTracks: updatedPlaylistTracks });
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name})
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    if (this.state.playlistName && trackURIs && trackURIs.length > 0) {
      Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
        console.log(`A new playlist ${this.state.playlistName} with ${trackURIs.length} songs has been saved.`);
        this.setState({ playlistName: 'New Playlist', playlistTracks: []});
      })
    }
  }

  search(term) {
    Spotify.search(term)
    .then(response => this.setState({ searchResults: response }))
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack()} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
     )
  }
};

export default App;
