const { contextBridge, ipcRenderer } = require('electron');

console.log('test - preload loaded');

try {
    contextBridge.exposeInMainWorld('electron', {
  // -------------------- CATEGORIE --------------------
    createCategorie: (name) => ipcRenderer.invoke('categorie:create', name),
    getCategories: () => ipcRenderer.invoke('categorie:getAll'),
    getCategorieById: (id) => ipcRenderer.invoke('categorie:getById', id),
    updateCategorie: (id, name) => ipcRenderer.invoke('categorie:update', id, name),
    deleteCategorie: (id) => ipcRenderer.invoke('categorie:delete', id),

    // -------------------- MEDICAMENTS --------------------
    createMedicament: (medicament) => ipcRenderer.invoke('medicament:create', medicament),
    getMedicaments: () => ipcRenderer.invoke('medicament:getAll'),
    getMedicamentById: (idmed) => ipcRenderer.invoke('medicament:getById', idmed),
    updateMedicament: (idmed, medicament) => ipcRenderer.invoke('medicament:update', idmed, medicament),
    deleteMedicament: (idmed) => ipcRenderer.invoke('medicament:delete', idmed),

    // -------------------- NOTIFICATIONS --------------------
    createNotification: (notification) => ipcRenderer.invoke('notification:create', notification),
    getNotifications: () => ipcRenderer.invoke('notification:getAll'),
    getNotificationById: (idnotif) => ipcRenderer.invoke('notification:getById', idnotif),
    updateNotification: (idnotif, notification) => ipcRenderer.invoke('notification:update', idnotif, notification),
    deleteNotification: (idnotif) => ipcRenderer.invoke('notification:delete', idnotif),

    // -------------------- ACHAT --------------------
    createAchat: (achat) => ipcRenderer.invoke('achat:create', achat),
    getAchats: () => ipcRenderer.invoke('achat:getAll'),
    getAchatById: (idachat) => ipcRenderer.invoke('achat:get', idachat),
    updateAchat: (idachat, achat) => ipcRenderer.invoke('achat:update', idachat, achat),
    deleteAchat: (idachat) => ipcRenderer.invoke('achat:delete', idachat),

    });
    console.log('✓ Electron API exposed to window');
} catch (err) {
    console.error('✗ Error exposing electron API:', err.message);
}
