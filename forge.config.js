const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    appBundleId: 'com.ericwhittaker.eventrunner', // Required for auto-updates
    appVersion: process.env.npm_package_version || '1.0.0',
    icon: './assets/icons/icon', // Electron will auto-append .icns, .ico, .png as needed
    
    // PROPER Electron Forge code signing configuration
    // Empty osxSign object lets Electron Forge auto-detect certificates
    osxSign: {}
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        // Windows auto-update support
        // remoteReleases: `https://github.com/ericwhittaker/EventRunner/releases/download/v${process.env.npm_package_version || '1.0.0'}/`,
        setupIcon: './assets/icons/icon.ico',
        // loadingGif: './assets/icons/installing.gif' // Optional: custom install animation
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './assets/icons/icon.png'
        }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          icon: './assets/icons/icon.png'
        }
      },
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'ericwhittaker',
          name: 'EventRunner'
        },
        prerelease: false
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
