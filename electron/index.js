import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path';
import { fileURLToPath } from 'url';
import { checkExpirationNotifications } from './src/service-back/checkNotif.js';
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
    // mainWindow.loadURL('http://localhost:5173')
    mainWindow.loadFile(path.join( __dirname, 'dist', 'index.html'))

    
    mainWindow.webContents.on('console-message', (event) => {
        console.log(`[Renderer] ${event.message}`);
    });
}

// app.whenReady().then(createWindow)

app.whenReady().then(() => {
    checkExpirationNotifications()  
    createWindow()
})


ipcMain.on("print-content", (event, html) => {
    const win = new BrowserWindow({
        show: false,
        webPreferences: {
        sandbox: false,
        },
    });

    win.loadURL(
        "data:text/html;charset=utf-8," +
        encodeURIComponent(`
            <html>
            <head>
                <style>
                body {
                    font-family: Arial;
                    padding: 20px;
                }
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `)
    );

    win.webContents.on("did-finish-load", () => {
        win.webContents.print(
        {
            silent: false,
            printBackground: true,
        },
        () => win.close()
        );
    });
});
