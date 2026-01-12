const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // In dev, load localhost. In prod, load index.html
    const isDev = !app.isPackaged;
    const startUrl = isDev
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, '../dist/index.html')}`;

    win.loadURL(startUrl);

    // if (isDev) {
    //    win.webContents.openDevTools();
    // }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Persistence API
ipcMain.handle('get-projects', () => {
    return store.get('projects', []);
});

ipcMain.handle('save-projects', (event, projects) => {
    store.set('projects', projects);
    return true;
});
