// renderer.js - The frontend JavaScript for the Electron app
//const rendererContent = ``
const { ipcRenderer } = require('electron');

let playlist = [];
const audioPlayer = document.getElementById('audio-player');
const currentSongElement = document.getElementById('current-song');
const songList = document.getElementById('song-list');

document.getElementById('select-music').addEventListener('click', async () => {
  const files = await ipcRenderer.invoke('select-files');
  
  if (files.length > 0) {
    // Add new files to the playlist
    playlist = [...playlist, ...files];
    updatePlaylist();
  }
});

function updatePlaylist() {
  // Clear the current playlist UI
  songList.innerHTML = '';
  
  // Add each song to the playlist UI
  playlist.forEach((song, index) => {
    const li = document.createElement('li');
    li.textContent = song.name;
    li.dataset.index = index;
    
    li.addEventListener('click', () => {
      playSong(index);
    });
    
    songList.appendChild(li);
  });
  
  // If playlist was empty and now has songs, play the first one
  if (playlist.length > 0 && !audioPlayer.src) {
    playSong(0);
  }
}

function playSong(index) {
  const song = playlist[index];
  
  // Update audio source
  audioPlayer.src = song.path;
  audioPlayer.play();
  
  // Update UI
  currentSongElement.textContent = song.name;
  
  // Highlight the current song in the playlist
  const items = songList.querySelectorAll('li');
  items.forEach(item => item.classList.remove('active'));
  items[index].classList.add('active');
}

// Handle audio completion - play next song
audioPlayer.addEventListener('ended', () => {
  const currentIndex = playlist.findIndex(song => 
    song.path === audioPlayer.src.replace('file://', '')
  );
  
  if (currentIndex < playlist.length - 1) {
    playSong(currentIndex + 1);
  }
});