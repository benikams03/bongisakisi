const { contextBridge, ipcRenderer } = require('electron');

try {
    contextBridge.exposeInMainWorld('electron', {
        printContent: (html) => ipcRenderer.send('print-content', html)
    });
    console.log('✓ Electron API exposed to window');
} catch (err) {
    console.error('✗ Error exposing electron API:', err.message);
}