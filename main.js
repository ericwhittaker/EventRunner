const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron/main')
const { updateElectronApp } = require('update-electron-app')
const log = require('electron-log')
const packageJson = require('./package.json')

// For private repository - hardcode the token
process.env.GH_TOKEN = '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'

// Configure electron-log for both file and console output
log.transports.file.level = 'info';
log.transports.console.level = 'info';
log.transports.file.fileName = 'electron-updater.log';
log.transports.file.maxSize = 5 * 1024 * 1024; // 5MB

function logBoth(message, ...args) {
  console.log(message, ...args);
  log.info(message, ...args);
}

logBoth('=== AUTO-UPDATER SETUP ===')
logBoth('Setting GH_TOKEN for private repository access')
logBoth('GH_TOKEN available:', !!process.env.GH_TOKEN)
logBoth('Current version from app.getVersion():', app.getVersion())
logBoth('Current version from package.json:', packageJson.version)
logBoth('Target repository: ericwhittaker/EventRunner')
logBoth('Electron log file location:', log.transports.file.getFile().path)

// Enhanced logging for update-electron-app
const originalConsoleLog = console.log;
log.info = (...args) => {
  originalConsoleLog('📋 UPDATE-LOG:', ...args);
  log.transports.file.write('UPDATE-LOG: ' + args.join(' '));
};

// Simple auto-updater setup for private GitHub repository
logBoth('🚀 Initializing update-electron-app...');
updateElectronApp({
  repo: 'ericwhittaker/EventRunner',
  updateInterval: '5 minutes', // Reduced for testing
  logger: log,
  notifyUser: true
})

logBoth('✅ Auto-updater initialized for private repository')
logBoth('⏰ Update check interval: 5 minutes')
logBoth('🔔 User notifications: enabled')
logBoth('============================')

// Additional debugging - check if we're in dev mode
logBoth('🔍 ENVIRONMENT CHECK:')
logBoth('app.isPackaged:', app.isPackaged)
logBoth('process.env.NODE_ENV:', process.env.NODE_ENV)
logBoth('__dirname:', __dirname)
logBoth('process.argv:', process.argv.slice(0, 3))
logBoth('============================')

// Manual update check for debugging
setTimeout(() => {
  logBoth('🔍 Manual update check in 10 seconds...')
  try {
    // Try to trigger an update check
    logBoth('📡 Attempting manual update check...')
    logBoth('📡 Note: update-electron-app doesn\'t expose manual check method')
  } catch (error) {
    logBoth('❌ Manual update check failed:', error)
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
        },
        { type: 'separator' },
        {
          label: 'Show Update Logs',
          click: () => {
            const logPath = log.transports.file.getFile().path;
            dialog.showMessageBox({
              type: 'info',
              title: 'Update Logs',
              message: 'Auto-updater log file location:',
              detail: `${logPath}\n\nLogs are written to both console and this file for debugging auto-update issues.`,
              buttons: ['OK', 'Open Log Folder']
            }).then((result) => {
              if (result.response === 1) {
                // Open log folder
                require('child_process').exec(`open "${require('path').dirname(logPath)}"`);
              }
            });
          }
        },
        {
          label: 'Debug: Check for Updates',
          click: () => {
            logBoth('🔄 Manual update check requested via menu');
            logBoth('📊 Current app state:');
            logBoth('   - Version:', app.getVersion());
            logBoth('   - Is Packaged:', app.isPackaged);
            logBoth('   - Repository: ericwhittaker/EventRunner');
            
            dialog.showMessageBox({
              type: 'info',
              title: 'Update Check',
              message: 'Update check triggered',
              detail: `Current version: ${app.getVersion()}\nCheck the console/logs for details.\n\nNote: Updates only work in packaged apps, not development mode.`,
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
    logBoth('Version requested, returning:', version);
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