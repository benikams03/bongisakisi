const { contextBridge, ipcRenderer } = require('electron')

// Expose une API sécurisée à React
contextBridge.exposeInMainWorld('electronAPI', {
  sendData: (data) => ipcRenderer.send('send-data', data),
  onReply: (callback) => ipcRenderer.on('reply-data', (event, data) => callback(data))
})
