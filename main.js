const { app, BrowserWindow, ipcMain, Menu, dialog, clipboard } = require('electron/main')
const { updateElectronApp } = require('update-electron-app')
const packageJson = require('./package.json')
const fs = require('fs')
const path = require('path')










// Log rotation configuration
const LOG_CONFIG = {
  maxFileSize: 1024 * 1024, // 1MB max file size
  maxFiles: 5, // Keep 5 rotated log files
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
}

// Create a simple log file in the app's user data directory (This is for debugging purposes)
const logFilePath = path.join(app.getPath('userData'), 'eventrunner-updater.log')

// Log rotation function
function rotateLogIfNeeded() {
  try {
    // Check if log file exists and get its stats
    if (!fs.existsSync(logFilePath)) {
      return // No log file to rotate
    }
    
    const stats = fs.statSync(logFilePath)
    const now = Date.now()
    
    // Check if rotation is needed (size or age)
    const needsRotation = stats.size >= LOG_CONFIG.maxFileSize || 
                         (now - stats.mtime.getTime()) >= LOG_CONFIG.maxAge
    
    if (!needsRotation) {
      return
    }
    
    // Create rotated filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const rotatedPath = path.join(
      app.getPath('userData'), 
      `eventrunner-updater-${timestamp}.log`
    )
    
    // Move current log to rotated file
    fs.renameSync(logFilePath, rotatedPath)
    
    // Clean up old rotated files
    cleanupOldLogs()
    
    console.log(`Log rotated to: ${rotatedPath}`)
  } catch (err) {
    console.error('Failed to rotate log:', err)
  }
}

// Clean up old rotated log files
function cleanupOldLogs() {
  try {
    const userDataDir = app.getPath('userData')
    const files = fs.readdirSync(userDataDir)
    
    // Find all rotated log files
    const logFiles = files
      .filter(file => file.startsWith('eventrunner-updater-') && file.endsWith('.log'))
      .map(file => ({
        name: file,
        path: path.join(userDataDir, file),
        stats: fs.statSync(path.join(userDataDir, file))
      }))
      .sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime()) // Newest first
    
    // Remove files beyond the limit
    if (logFiles.length > LOG_CONFIG.maxFiles) {
      const filesToDelete = logFiles.slice(LOG_CONFIG.maxFiles)
      filesToDelete.forEach(file => {
        fs.unlinkSync(file.path)
        console.log(`Deleted old log file: ${file.name}`)
      })
    }
    
    // Remove files older than maxAge
    const cutoffTime = Date.now() - LOG_CONFIG.maxAge
    logFiles.forEach(file => {
      if (file.stats.mtime.getTime() < cutoffTime) {
        try {
          fs.unlinkSync(file.path)
          console.log(`Deleted expired log file: ${file.name}`)
        } catch (err) {
          console.error(`Failed to delete expired log file ${file.name}:`, err)
        }
      }
    })
  } catch (err) {
    console.error('Failed to cleanup old logs:', err)
  }
}

// Enhanced logging function with rotation
function log(...args) {
  const timestamp = new Date().toISOString()
  const message = `[${timestamp}] ${args.join(' ')}`
  
  // Log to terminal (for development)
  console.log(...args)
  
  // Log to file (for packaged app)
  try {
    // Rotate log if needed before writing
    rotateLogIfNeeded()
    
    fs.appendFileSync(logFilePath, message + '\n')
  } catch (err) {
    console.error('Failed to write to log file:', err)
  }
}

// Logging initialization
log(' ')
log('========================================')
log('========= Starting EventRunner =========')
log('========================================')
log(' ')
log(' ')
log('=========== LOGGING IS SETUP ===========')
log('Log file location:', logFilePath)










// Setting up all logging variables and functions below here
function getVersionInfo() {
  try {
    const appVersion = app.getVersion()
    const electronVersion = process.versions.electron
    const nodeVersion = process.versions.node
    const chromeVersion = process.versions.chrome
    const v8Version = process.versions.v8
    
    // Read package.json to get dependency versions
    let angularVersion = 'Unknown'
    let firebaseVersion = 'Not installed'
    let electronForgeVersion = 'Unknown'
    let typescriptVersion = 'Unknown'
    
    try {
      // Get Angular version from dependencies
      if (packageJson.dependencies && packageJson.dependencies['@angular/core']) {
        angularVersion = packageJson.dependencies['@angular/core'].replace(/[^0-9.]/g, '')
      }
      
      // Check for Firebase (you might add this later)
      if (packageJson.dependencies && packageJson.dependencies['firebase']) {
        firebaseVersion = packageJson.dependencies['firebase'].replace(/[^0-9.]/g, '')
      } else if (packageJson.dependencies && packageJson.dependencies['@angular/fire']) {
        firebaseVersion = `Angular Fire ${packageJson.dependencies['@angular/fire'].replace(/[^0-9.]/g, '')}`
      }
      
      // Get Electron Forge version
      if (packageJson.devDependencies && packageJson.devDependencies['@electron-forge/cli']) {
        electronForgeVersion = packageJson.devDependencies['@electron-forge/cli'].replace(/[^0-9.]/g, '')
      }
      
      // Get TypeScript version
      if (packageJson.devDependencies && packageJson.devDependencies['typescript']) {
        typescriptVersion = packageJson.devDependencies['typescript'].replace(/[^0-9.]/g, '')
      }
    } catch (err) {
      log('Error reading dependency versions:', err)
    }
    
    return {
      app: appVersion,
      electron: electronVersion,
      node: nodeVersion,
      chrome: chromeVersion,
      v8: v8Version,
      angular: angularVersion,
      firebase: firebaseVersion,
      electronForge: electronForgeVersion,
      typescript: typescriptVersion,
      platform: process.platform,
      arch: process.arch
    }
  } catch (err) {
    log('Error getting version info:', err)
    return {
      app: app.getVersion(),
      electron: 'Unknown',
      node: 'Unknown',
      chrome: 'Unknown',
      v8: 'Unknown',
      angular: 'Unknown',
      firebase: 'Unknown',
      electronForge: 'Unknown',
      typescript: 'Unknown',
      platform: process.platform || 'Unknown',
      arch: process.arch || 'Unknown'
    }
  }
}

// store the version information in a constant for access later
// This is used to log comprehensive version information at startup
// and also in the "About" dialog
const appVersionInfo = getVersionInfo()

// Log comprehensive version information
log(' ')
log('========== VERSION INFORMATION =========')
log('EventRunner:', appVersionInfo.app)
log('Electron:', appVersionInfo.electron)
log('Node.js:', appVersionInfo.node)
log('Angular:', appVersionInfo.angular)
log('TypeScript:', appVersionInfo.typescript)
log('Platform:', appVersionInfo.platform, appVersionInfo.arch)
log('========================================')
log(' ')

// Simple auto-updater setup for public GitHub repository (trying public approach)
log('========== AUTO-UPDATER SETUP ==========')
log('🚀 Initializing update-electron-app with custom logger...');
log('Target repository: ericwhittaker/EventRunner')
log('========================================')

// Create a simple logger that update-electron-app expects (just needs .log() method)
const customLogger = {
  log: (message) => log('🔄 UPDATE-ELECTRON-APP:', message)
};

// Initialize update-electron-app with custom logger
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
// Log auto-updater setup details
log('✅ Auto-updater initialized for public repository')
log('⏰ Update check interval: 5 minutes')
log('🔔 User notifications: enabled')
log('========================================')
log(' ')

// Additional debugging - check if we're in dev mode
log(' ')
log('=============== DEBUGGING ==============')
log('🔍 ENVIRONMENT CHECK:')
log('app.isPackaged:', app.isPackaged)
log('process.env.NODE_ENV:', process.env.NODE_ENV)
log('__dirname:', __dirname)
log('process.argv:', process.argv.slice(0, 3))
log('========================================')

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










// Create the main application window
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
            // Format the detailed version information
            const versionDetails = [
              `Version: ${appVersionInfo.app}`,
              '',
              '--- Core Technologies ---',
              `Electron: ${appVersionInfo.electron}`,
              `Node.js: ${appVersionInfo.node}`,
              `Chrome: ${appVersionInfo.chrome}`,
              `V8 Engine: ${appVersionInfo.v8}`,
              '',
              '--- Frontend Framework ---',
              `Angular: ${appVersionInfo.angular}`,
              `TypeScript: ${appVersionInfo.typescript}`,
              `Electron Forge: ${appVersionInfo.electronForge}`,
              `Firebase: ${appVersionInfo.firebase}`,
              '',
              '--- System Information ---',
              `Platform: ${appVersionInfo.platform}`,
              `Architecture: ${appVersionInfo.arch}`,
              '',
              '--- Build Information ---',
              `Built: ${new Date().toLocaleDateString()}`,
              `Environment: ${app.isPackaged ? 'Production' : 'Development'}`
            ].join('\n')
            
            dialog.showMessageBox({
              type: 'info',
              title: 'About EventRunner',
              message: 'EventRunner',
              detail: `${versionDetails}`,
              buttons: ['OK', 'Copy Version Info']
            }).then((result) => {
              if (result.response === 1) {
                // Copy version info to clipboard
                const { clipboard } = require('electron')
                const copyText = [
                  'EventRunner Version Information:',
                  '',
                  versionDetails
                ].join('\n')
                
                clipboard.writeText(copyText)
                
                // Show confirmation
                dialog.showMessageBox({
                  type: 'info',
                  title: 'Copied',
                  message: 'Version information copied to clipboard',
                  buttons: ['OK']
                })
              }
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
            // Get log file info
            let logInfo = 'No log file found'
            try {
              if (fs.existsSync(logFilePath)) {
                const stats = fs.statSync(logFilePath)
                const sizeKB = (stats.size / 1024).toFixed(1)
                const age = Math.round((Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24))
                logInfo = `Current log: ${sizeKB}KB, ${age} days old`
              }
            } catch (err) {
              logInfo = 'Error reading log file'
            }
            
            dialog.showMessageBox({
              type: 'info',
              title: 'Update Logs',
              message: 'Auto-updater log files:',
              detail: `${logInfo}\n\nLog file location:\n${logFilePath}\n\nLogs are automatically rotated when they exceed 1MB or are older than 30 days. Up to 5 old log files are kept as backup.`,
              buttons: ['OK', 'Open Log Folder', 'Clean Old Logs']
            }).then((result) => {
              if (result.response === 1) {
                // Open log folder
                require('child_process').exec(`open "${path.dirname(logFilePath)}"`);
              } else if (result.response === 2) {
                // Clean old logs manually
                cleanupOldLogs();
                dialog.showMessageBox({
                  type: 'info',
                  title: 'Logs Cleaned',
                  message: 'Old log files have been cleaned up.',
                  buttons: ['OK']
                });
              }
            });
          }
        },
        {
          label: 'Debug: Check for Updates',
          click: () => {
            const timestamp = new Date().toISOString();
            
            log('🔄 ====== MANUAL UPDATE CHECK REQUESTED ======');
            log('🕐 Timestamp:', timestamp);
            log('👤 Triggered by: User via Help menu');
            log('');
            log('📊 Current Application State:');
            log('   • App Version:', app.getVersion());
            log('   • Is Packaged:', app.isPackaged);
            log('   • Environment:', app.isPackaged ? 'Production' : 'Development');
            log('   • Platform:', process.platform);
            log('   • Architecture:', process.arch);
            log('   • Electron Version:', process.versions.electron);
            log('   • Node Version:', process.versions.node);
            log('');
            log('🔧 Auto-Updater Configuration:');
            log('   • Repository: ericwhittaker/EventRunner');
            log('   • Update Interval: 5 minutes');
            log('   • User Notifications: enabled');
            log('   • Logger: custom logger attached');
            log('');
            log('ℹ️  Note: update-electron-app runs automatically in background');
            log('ℹ️  Manual triggers are not exposed by the library');
            log('ℹ️  This debug function logs current state for troubleshooting');
            log('============================================');
            
            // Show enhanced dialog with more details
            const updateDetails = [
              `Current Version: ${app.getVersion()}`,
              `Environment: ${app.isPackaged ? 'Production (updates enabled)' : 'Development (updates disabled)'}`,
              `Platform: ${process.platform} ${process.arch}`,
              `Electron: ${process.versions.electron}`,
              `Repository: ericwhittaker/EventRunner`,
              ``,
              `Auto-updater Status:`,
              `• Running in background every 5 minutes`,
              `• Logs saved to: eventrunner-updater.log`,
              `• User notifications enabled`,
              ``,
              `Check the log file for detailed update activity.`,
              `Updates only work in packaged/production builds.`
            ].join('\n');
            
            dialog.showMessageBox({
              type: 'info',
              title: 'Update Check Debug Info',
              message: 'Update System Status',
              detail: updateDetails,
              buttons: ['OK', 'Open Log Folder', 'Copy Debug Info']
            }).then((result) => {
              if (result.response === 1) {
                // Open log folder
                log('📂 Opening log folder requested by user');
                require('child_process').exec(`open "${path.dirname(logFilePath)}"`);
              } else if (result.response === 2) {
                // Copy debug info to clipboard
                log('📋 Debug info copied to clipboard by user');
                const debugInfo = [
                  'EventRunner Update Debug Information',
                  `Generated: ${timestamp}`,
                  '',
                  updateDetails,
                  '',
                  '--- Technical Details ---',
                  `Log File: ${logFilePath}`,
                  `User Data: ${app.getPath('userData')}`,
                  `App Path: ${app.getAppPath()}`
                ].join('\n');
                
                clipboard.writeText(debugInfo);
                
                dialog.showMessageBox({
                  type: 'info',
                  title: 'Debug Info Copied',
                  message: 'Debug information copied to clipboard',
                  buttons: ['OK']
                });
              }
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Reset App Data',
          click: () => {
            dialog.showMessageBox({
              type: 'warning',
              title: 'Reset App Data',
              message: 'This will delete all EventRunner app data',
              detail: `This will remove:\n• All log files\n• App preferences\n• Cache and temporary files\n• Local storage data\n\nThis cannot be undone. The app will quit after reset.`,
              buttons: ['Cancel', 'Reset App Data'],
              defaultId: 0,
              cancelId: 0
            }).then((result) => {
              if (result.response === 1) {
                // User confirmed reset
                try {
                  const userDataPath = app.getPath('userData');
                  log('🗑️  Resetting app data at:', userDataPath);
                  
                  // Remove the entire user data directory
                  fs.rmSync(userDataPath, { recursive: true, force: true });
                  
                  dialog.showMessageBox({
                    type: 'info',
                    title: 'App Data Reset',
                    message: 'App data has been reset',
                    detail: 'All EventRunner data has been removed. The app will now quit.',
                    buttons: ['OK']
                  }).then(() => {
                    app.quit();
                  });
                } catch (err) {
                  console.error('Failed to reset app data:', err);
                  dialog.showErrorBox('Reset Failed', `Failed to reset app data: ${err.message}`);
                }
              }
            });
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// This is the when ready event handler
// It initializes the app, sets up IPC handlers, and creates the main window
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