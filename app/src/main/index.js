import { app, BrowserWindow } from 'electron'
import path from 'path';
import { fileURLToPath } from 'url';
import updater from "electron-updater";
import log from "electron-log"

import './ipcHandlers.js'
import { setMainWindow } from './ipcHandlers.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.setName("bongisakisi")

const { autoUpdater } = updater;
// autoUpdater.requestHeaders = {
//   Authorization: `token ${process.env.GH_TOKEN}`
// };

autoUpdater.logger = log
autoUpdater.autoDownload = false
autoUpdater.checkForUpdatesAndNotify();
// autoUpdater.forceDevUpdateConfig = true;
autoUpdater.checkForUpdates();

function createWindow () {
    // Create splash screen
    const splash = new BrowserWindow({
        width: 350,
        height: 450,
        minWidth: 350,
        minHeight: 450,
        frame: false,
        transparent: true,
        alwaysOnTop: true
    })
    
    splash.loadFile(
        path.join(__dirname, '..', 'renderer', 'splash.html')
    )

    // Create main window but keep it hidden
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 700,
        minWidth: 1200,
        minHeight: 700,
        frame: false,
        backgroundColor: '#ffffff',
        titleBarStyle: 'default',
        show: false, // Keep hidden initially
        webPreferences: {
            preload: path.join(__dirname, '..', 'preload' ,'index.js'),
            contextIsolation: true, 
            nodeIntegration: false,
        }
    })

    // Ouvrir DevTools en développement
    // if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    //     mainWindow.webContents.openDevTools()
    // }

    mainWindow.setMenu(null)
    mainWindow.loadURL('http://localhost:5173')
    // mainWindow.loadFile(path.join(__dirname, '..', '..', 'resources', 'dist', 'index.html'))

    // Définir la fenêtre principale pour les handlers IPC
    setMainWindow(mainWindow)

    // Show main window after 5 seconds and close splash
    setTimeout(() => {
        splash.close()
        mainWindow.maximize()
        mainWindow.show()
    }, 5000)
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})