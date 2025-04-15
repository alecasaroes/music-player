const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', 'electronAPI',{
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping'),
    selectAudioFile: () => ipcRenderer.invoke('select-audio-file')
})