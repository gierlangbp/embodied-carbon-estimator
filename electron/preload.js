const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getProjects: () => ipcRenderer.invoke('get-projects'),
    saveProjects: (projects) => ipcRenderer.invoke('save-projects', projects)
});
