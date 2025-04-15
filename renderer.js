const selectButton = document.getElementById('select-files');
const songList = document.getElementById('song-list');
const audioPlayer = document.getElementById('audio-player');

let songs = [];

selectButton.addEventListener('click', async () => {
    const filePaths = await window.electronAPI.selectAudioFile();
    if (filePaths.length > 0) {
        songs = filePaths;
        renderSongList();
    }
});

function renderSongList() {
    songList.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = song.split(/[\\/]/).pop();
        li.addEventListener('click', () => {
            audioPlayer.src = song;
            audioPlayer.play();
        });
        songList.appendChild(li);
    });
}