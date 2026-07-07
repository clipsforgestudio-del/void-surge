/* ============================================
   VOID SURGE - Electron Main Process
   ============================================ */

const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 640,
        minHeight: 360,
        fullscreen: false,
        fullscreenable: true,
        resizable: true,
        title: 'VOID SURGE',
        icon: path.join(__dirname, 'icon.png'),
        backgroundColor: '#000000',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    mainWindow.setMenu(null);
    mainWindow.loadFile(path.join(__dirname, '..', 'index.html'));

    // Remove menu bar completely
    mainWindow.setMenuBarVisibility(false);

    // Handle fullscreen toggle with F11
    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'F11' && input.type === 'keyDown') {
            mainWindow.setFullscreen(!mainWindow.isFullscreen());
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Set window title
    mainWindow.on('page-title-updated', (e) => {
        e.preventDefault();
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});