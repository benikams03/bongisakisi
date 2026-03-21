import { ipcMain } from 'electron'

ipcMain.handle('test', () => 'testons')
ipcMain.handle('getUserData', (_, id, name) => ({ name: name, id: id }))