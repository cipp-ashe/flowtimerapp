const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 1200,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: false
    },
    backgroundColor: '#000000',
    resizable: true,
    minWidth: 400,
    minHeight: 600
  });

  // Always load from the dist directory for the packaged app
  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  mainWindow.loadFile(indexPath);

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('blur', () => {
    mainWindow?.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Window control handlers
  ipcMain.handle('minimize', () => {
    mainWindow?.minimize();
  });

  ipcMain.handle('maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });

  ipcMain.handle('close', () => {
    if (mainWindow) {
      mainWindow.destroy();
      process.exit(0);
    }
  });

  mainWindow.setHasShadow(true);
  mainWindow.setMenuBarVisibility(false);
}

// Force close all windows and quit
app.on('before-quit', () => {
  if (mainWindow) {
    mainWindow.destroy();
  }
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  process.exit(0);
});

// Create window on activation
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
