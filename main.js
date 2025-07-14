const { app, BrowserWindow, ipcMain } = require('electron/main')
const { autoUpdater } = require('electron-updater')
const packageJson = require('./package.json')

// Configure auto-updater for GitHub releases
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'ericwhittaker',
  repo: 'EventRunner'
})

// Auto-updater events
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info.version)
})

autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available.')
})

autoUpdater.on('error', (err) => {
  console.log('Error in auto-updater:', err)
})

autoUpdater.on('download-progress', (progressObj) => {
  const log_message = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred}/${progressObj.total})`
  console.log(log_message)
})

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded')
  // Auto-install on next restart
  autoUpdater.quitAndInstall()
})

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1366, // Adjusted width for better visibility
    height: 1000,
    webPreferences: {
      preload: require('path').join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  const indexPath = require('path').join(__dirname, 'dist', 'EventRunner', 'browser', 'index.html');
  
  win.loadFile(indexPath).catch(err => {
    console.error('Failed to load index.html:', err);
    // Fallback: try loading from current directory
    win.loadFile('index.html').catch(fallbackErr => {
      console.error('Fallback load also failed:', fallbackErr);
    });
  });

  // Handle refresh requests
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.log('Failed to load:', errorDescription, 'URL:', validatedURL);
    // Reload the main index.html on any load failure
    win.loadFile(indexPath);
  });
  
  // win.loadFile('dist/EventRunner/browser/index.html')
  // win.loadURL('http://platform.onelife.app')
}

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')
  
  // Handle app reload requests
  ipcMain.handle('app-reload', () => {
    const windows = BrowserWindow.getAllWindows();
    windows.forEach(win => {
      const indexPath = require('path').join(__dirname, 'dist', 'EventRunner', 'browser', 'index.html');
      win.loadFile(indexPath);
    });
  });

  // Handle manual update check
  ipcMain.handle('check-for-updates', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

  // Handle version request
  ipcMain.handle('get-app-version', () => {
    const version = app.getVersion(); // Use Electron's built-in method
    console.log('Version requested, returning:', version);
    return version;
  });
  
  createWindow()

  // Check for updates when app starts (only in production)
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    setTimeout(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 3000); // Wait 3 seconds after startup
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})