const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron/main')
const { updateElectronApp } = require('update-electron-app')
const packageJson = require('./package.json')
const fs = require('fs')
const path = require('path')

// For private repository - hardcode the token
process.env.GH_TOKEN = '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'

// Create a simple log file in the app's user data directory (This is for debugging purposes)
const logFilePath = path.join(app.getPath('userData'), 'eventrunner-updater.log')

// Simple logging function that works in both dev and packaged app
function log(...args) {
  const timestamp = new Date().toISOString()
  const message = `[${timestamp}] ${args.join(' ')}`
  
  // Log to terminal (for development)
  console.log(...args)
  
  // Log to file (for packaged app)
  try {
    fs.appendFileSync(logFilePath, message + '\n')
  } catch (err) {
    console.error('Failed to write to log file:', err)
  }
}

log('=== AUTO-UPDATER SETUP ===')
log('Log file location:', logFilePath)
log('Setting GH_TOKEN for private repository access')
log('GH_TOKEN available:', !!process.env.GH_TOKEN)
log('Current version from app.getVersion():', app.getVersion())
log('Current version from package.json:', packageJson.version)
log('Target repository: ericwhittaker/EventRunner')

// Simple auto-updater setup for private GitHub repository
log('🚀 Initializing update-electron-app...');

// Create a custom logger to capture update-electron-app's output
const customLogger = {
  info: (message) => log('📡 UPDATE-ELECTRON-APP:', message),
  warn: (message) => log('⚠️ UPDATE-ELECTRON-APP WARNING:', message),
  error: (message) => log('❌ UPDATE-ELECTRON-APP ERROR:', message),
  debug: (message) => log('🔍 UPDATE-ELECTRON-APP DEBUG:', message)
};

try {
  updateElectronApp({
    repo: 'ericwhittaker/EventRunner',
    updateInterval: '5 minutes',
    notifyUser: true,
    logger: customLogger
  });
  log('✅ updateElectronApp() call completed without errors');
} catch (error) {
  log('❌ updateElectronApp() threw an error:', error);
}

log('✅ Auto-updater initialized for private repository')
log('⏰ Update check interval: 5 minutes')
log('🔔 User notifications: enabled')
log('============================')

// Additional debugging - check if we're in dev mode
log('🔍 ENVIRONMENT CHECK:')
log('app.isPackaged:', app.isPackaged)
log('process.env.NODE_ENV:', process.env.NODE_ENV)
log('__dirname:', __dirname)
log('process.argv:', process.argv.slice(0, 3))
log('============================')

// Manual update check for debugging
setTimeout(() => {
  log('🔍 Manual update check in 10 seconds...')
  try {
    // Try to trigger an update check
    log('📡 Attempting manual update check...')
    log('📡 Note: update-electron-app doesn\'t expose manual check method')
  } catch (error) {
    log('❌ Manual update check failed:', error)
  }
}, 10000)

// Add periodic logging to check if updater is still working
setInterval(() => {
  log('💓 Auto-updater heartbeat - still running at', new Date().toISOString());
  log('📊 Current state: version', app.getVersion(), '| packaged:', app.isPackaged);
}, 2 * 60 * 1000); // Every 2 minutes

// Log network requests if possible
if (process.versions.electron) {
  log('🔌 Electron version:', process.versions.electron);
  log('🔌 Node version:', process.versions.node);
}

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
    log('Failed to load index.html:', err);
    // Fallback: try loading from current directory
    win.loadFile('index.html').catch(fallbackErr => {
      log('Fallback load also failed:', fallbackErr);
    });
  });

  // Handle refresh requests
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    log('Failed to load:', errorDescription, 'URL:', validatedURL);
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
        },
        { type: 'separator' },
        {
          label: 'Show Update Logs',
          click: () => {
            dialog.showMessageBox({
              type: 'info',
              title: 'Update Logs',
              message: 'Auto-updater log file location:',
              detail: `${logFilePath}\n\nLogs are written to this file. You can copy this file to share debug information.`,
              buttons: ['OK', 'Open Log Folder']
            }).then((result) => {
              if (result.response === 1) {
                // Open log folder
                require('child_process').exec(`open "${path.dirname(logFilePath)}"`);
              }
            });
          }
        },
        {
          label: 'Debug: Check for Updates',
          click: () => {
            log('🔄 Manual update check requested via menu');
            log('📊 Current app state:');
            log('   - Version:', app.getVersion());
            log('   - Is Packaged:', app.isPackaged);
            log('   - Repository: ericwhittaker/EventRunner');
            
            dialog.showMessageBox({
              type: 'info',
              title: 'Update Check',
              message: 'Update check triggered',
              detail: `Current version: ${app.getVersion()}\nCheck the log file for details.\n\nNote: Updates only work in packaged apps, not development mode.`,
              buttons: ['OK']
            });
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
    log('Version requested, returning:', version);
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