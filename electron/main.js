const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let mainWindow

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
      contextIsolation: true, // toujours vrai pour la sécurité
    }
  })

  mainWindow.setMenu(null)
  // Dev React
  mainWindow.loadURL('http://localhost:5173')
}

app.whenReady().then(createWindow)

// Exemple : recevoir des données depuis React
ipcMain.on('send-data', (event, data) => {
  console.log('Données reçues de React :', data)

  // Tu peux stocker localement ici (JSON / SQLite)
  
  // Réponse à React
  event.sender.send('reply-data', `Electron a bien reçu : ${JSON.stringify(data)}`)
})
