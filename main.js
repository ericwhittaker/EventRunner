const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron/main')
const { updateElectronApp } = require('update-electron-app')
const log = require('electron-log')
const packageJson = require('./package.json')

// For private repository - hardcode the token
process.env.GH_TOKEN = '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'
console.log('=== AUTO-UPDATER SETUP ===')
console.log('Setting GH_TOKEN for private repository access')
console.log('GH_TOKEN available:', !!process.env.GH_TOKEN)
console.log('Current version from app.getVersion():', app.getVersion())
console.log('Current version from package.json:', packageJson.version)
console.log('Target repository: ericwhittaker/EventRunner')

// Enhanced logging for update-electron-app
const originalConsoleLog = console.log;
log.info = (...args) => {
  originalConsoleLog('📋 UPDATE-LOG:', ...args);
};

// Simple auto-updater setup for private GitHub repository
console.log('🚀 Initializing update-electron-app...');
updateElectronApp({
  repo: 'ericwhittaker/EventRunner',
  updateInterval: '5 minutes', // Reduced for testing
  logger: log,
  notifyUser: true
})

console.log('✅ Auto-updater initialized for private repository')
console.log('⏰ Update check interval: 5 minutes')
console.log('🔔 User notifications: enabled')
console.log('============================')

// Additional debugging - check if we're in dev mode
console.log('🔍 ENVIRONMENT CHECK:')
console.log('app.isPackaged:', app.isPackaged)
console.log('process.env.NODE_ENV:', process.env.NODE_ENV)
console.log('__dirname:', __dirname)
console.log('process.argv:', process.argv.slice(0, 3))
console.log('============================')

// Manual update check for debugging
setTimeout(() => {
  console.log('🔍 Manual update check in 10 seconds...')
  try {
    // Try to trigger an update check
    console.log('📡 Attempting manual update check...')
  } catch (error) {
    console.error('❌ Manual update check failed:', error)
  }
}, 10000)

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

// Create application menu
const createMenu = () => {
  const template = [
    {
      label: 'EventRunner',
      submenu: [
        {
          label: 'About EventRunner',
          click: async () => {
            const version = app.getVersion()
            dialog.showMessageBox({
              type: 'info',
              title: 'About EventRunner',
              message: 'EventRunner',
              detail: `Version: ${version}\nEvent Management Software\n\nBuilt with Electron and Angular`,
              buttons: ['OK']
            })
          }
        },
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'CmdOrCtrl+,',
          enabled: false // TODO: Implement preferences
        },
        { type: 'separator' },
        {
          label: 'Hide EventRunner',
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Alt+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        { type: 'separator' },
        {
          label: 'Quit EventRunner',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'New Event',
          accelerator: 'CmdOrCtrl+N',
          enabled: false // TODO: Implement new event
        },
        { type: 'separator' },
        {
          label: 'Close Window',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'EventRunner Help',
          click: () => {
            // TODO: Open help documentation
            dialog.showMessageBox({
              type: 'info',
              title: 'Help',
              message: 'EventRunner Help',
              detail: 'Help documentation coming soon!',
              buttons: ['OK']
            })
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
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

  // Handle version request
  ipcMain.handle('get-app-version', () => {
    const version = app.getVersion(); // Use Electron's built-in method
    console.log('Version requested, returning:', version);
    return version;
  });
  
  // Create the application menu
  createMenu()
  
  createWindow()

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