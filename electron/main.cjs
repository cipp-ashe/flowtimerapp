const { app, BrowserWindow, ipcMain, dialog, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let cornerWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 1200,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Window controls
ipcMain.handle('minimize-window', () => {
  mainWindow.minimize();
});

ipcMain.handle('maximize-window', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.handle('close-window', () => {
  mainWindow.close();
});

// Corner view controls
ipcMain.handle('enter-corner-mode', (event, timerState) => {
  try {
    console.log('Creating corner window...');
    const display = screen.getPrimaryDisplay();
    const { width: screenWidth } = display.workAreaSize;
    
    // Create corner window if it doesn't exist
    if (!cornerWindow) {
      cornerWindow = new BrowserWindow({
        width: 250,
        height: 200,
        x: screenWidth - 250,
        y: 0,
        frame: false,
        transparent: true,
        backgroundColor: '#00000000',
        hasShadow: true,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: path.join(__dirname, 'preload.cjs')
        }
      });

      // Enable dragging on the window
      cornerWindow.setMovable(true);

      // Set window properties
      cornerWindow.setAlwaysOnTop(true);
      cornerWindow.setVisibleOnAllWorkspaces(true);
      cornerWindow.setResizable(false);

      // Share localStorage between windows
      const currentURL = mainWindow.webContents.getURL();
      const urlObj = new URL(currentURL);
      urlObj.searchParams.set('mode', 'corner');

      // Copy localStorage data and timer state from main window
      mainWindow.webContents.executeJavaScript(`
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          data[key] = localStorage.getItem(key);
        }
        data;
      `).then(data => {
        // Set localStorage data in corner window
        const script = Object.entries(data)
          .map(([key, value]) => `localStorage.setItem('${key}', '${value}');`)
          .join('\n');
        cornerWindow.webContents.executeJavaScript(script).then(() => {
          // Send timer state to corner window
          cornerWindow.webContents.send('timer-state-update', timerState);
        });
      });

      if (isDev) {
        cornerWindow.loadURL(urlObj.toString());
        cornerWindow.webContents.openDevTools({ mode: 'detach' });
      } else {
        cornerWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
          search: urlObj.search
        });
      }

      cornerWindow.on('closed', () => {
        cornerWindow = null;
      });

      // Log window creation success
      console.log('Corner window created successfully');
    }

    // Hide main window
    mainWindow.hide();
    console.log('Corner mode entered successfully');
    return true;
  } catch (error) {
    console.error('Error entering corner mode:', error);
    throw error;
  }
});

// Timer state sync handler
ipcMain.handle('sync-timer-state', (event, state) => {
  try {
    // Determine which window sent the state update
    const sender = event.sender;
    const targetWindow = sender === mainWindow?.webContents ? cornerWindow : mainWindow;
    
    // Send state to the other window if it exists
    if (targetWindow) {
      targetWindow.webContents.send('timer-state-update', state);
    }
    return true;
  } catch (error) {
    console.error('Error syncing timer state:', error);
    throw error;
  }
});

ipcMain.handle('exit-corner-mode', (event, timerState) => {
  try {
    console.log('Exiting corner mode...');
    
    // Show main window
    mainWindow.show();
    
    // Close corner window
    if (cornerWindow) {
      cornerWindow.close();
      cornerWindow = null;
    }
    
    console.log('Corner mode exited successfully');
    return true;
  } catch (error) {
    console.error('Error exiting corner mode:', error);
    throw error;
  }
});

// File download handler
ipcMain.handle('save-file', async (event, { content, filename, mimeType }) => {
  try {
    // Get downloads folder path
    const downloadsPath = app.getPath('downloads');
    const filePath = path.join(downloadsPath, filename);

    // Write file directly to downloads folder
    fs.writeFileSync(filePath, content, { encoding: 'utf8' });

    // Notify renderer of success
    return { success: true, path: filePath };
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
});
