const { contextBridge, ipcRenderer } = require('electron');

// Listen for timer state updates
ipcRenderer.on('timer-state-update', (event, state) => {
  window.dispatchEvent(new CustomEvent('timer-state-update', { detail: state }));
});

contextBridge.exposeInMainWorld('electron', {
  minimize: () => ipcRenderer.invoke('minimize-window'),
  maximize: () => ipcRenderer.invoke('maximize-window'),
  close: () => ipcRenderer.invoke('close-window'),
  saveFile: (options) => ipcRenderer.invoke('save-file', options),
  enterCornerMode: (timerState) => ipcRenderer.invoke('enter-corner-mode', timerState),
  exitCornerMode: () => ipcRenderer.invoke('exit-corner-mode'),
  syncTimerState: (state) => ipcRenderer.invoke('sync-timer-state', state),
});
