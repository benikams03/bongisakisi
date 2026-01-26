import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'url';
import path from 'path';

let mainWindow
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import './src/ipcHandlers.js'

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1200,
        minHeight: 800,
        backgroundColor: '#ffffff',
        titleBarStyle: 'default',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true, 
        }
    })

    mainWindow.setMenu(null)
    mainWindow.loadURL('http://localhost:5173')
}

app.whenReady().then(createWindow)

ipcMain.on('send-data', (event, data) => {
    console.log('Données reçues de React :', data)
    event.sender.send('reply-data', `Electron a bien reçu : ${JSON.stringify(data)}`)
})
