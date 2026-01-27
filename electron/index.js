import { app, BrowserWindow } from 'electron'
import path from 'path';
import { fileURLToPath } from 'url';
import './src/ipcHandlers.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1200,
        minHeight: 800,
        backgroundColor: '#ffffff',
        titleBarStyle: 'default',
        webPreferences: {
            preload: path.join( __dirname, 'preload.js'),
            contextIsolation: true, 
            nodeIntegration: false,
        }
    })    

    mainWindow.setMenu(null)
    mainWindow.loadURL('http://localhost:5173')
    
    mainWindow.webContents.on('console-message', (event) => {
        console.log(`[Renderer] ${event.message}`);
    });
}

app.whenReady().then(createWindow)
