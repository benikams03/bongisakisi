const { contextBridge, ipcRenderer } = require('electron');

// Solution garantie de fonctionner : API universelle
const createUniversalApi = () => {
    return {
        // Méthode universelle pour appeler n'importe quelle route IPC
        invoke: (channel, ...args) => {
            if (typeof channel !== 'string') {
                throw new Error('Channel must be a string');
            }
            return ipcRenderer.invoke(channel, ...args);
        }
    };
};

contextBridge.exposeInMainWorld('localApi', createUniversalApi());