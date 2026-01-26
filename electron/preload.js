import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld('electronAPI', {
    createUser: (name) => ipcRenderer.invoke('user:create', name),
    getUsers: () => ipcRenderer.invoke('user:get')
})
