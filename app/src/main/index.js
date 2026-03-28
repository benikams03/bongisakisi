import { app, BrowserWindow } from 'electron'
import path from 'path';
import { fileURLToPath } from 'url';
import './ipcHandlers.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.setName("bongisakisi")

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

    // Show main window after 3 seconds and close splash
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
