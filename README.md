# EventRunner

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Electron Development

### Development Mode
To run the app in Electron development mode:

```bash
npm run electronstart
```

### Packaging (Local Testing)
To create distributable packages locally (for testing):

```bash
npm run electronmake
```
This creates installers in the `/out/make/` folder.

## 🚀 Release Process

### Development Workflow
1. **Code & Commit**: Make your changes and commit them using VS Code GUI (as usual)
2. **Test**: Ensure everything works with `npm run electronstart`

### Release Workflow
When you're ready to release a new version to users:

#### Method 1: Full Release (Recommended)
```bash
# 1. Version bump (creates tag + pushes automatically)
npm version minor    # or 'patch' for bug fixes, 'major' for breaking changes

# 2. Build and publish to GitHub Releases
npm run release
```

#### Method 2: Step by Step
```bash
# 1. Version bump
npm version minor

# 2. Build Angular app
npm run build

# 3. Publish to GitHub Releases
npm run electronpublish
```

### What Happens During Release
- **npm version minor**: 
  - Updates package.json version (0.3.1 → 0.4.0)
  - Creates git commit with version number
  - Creates git tag (v0.4.0)
  - Pushes commits and tags to GitHub
- **npm run release**:
  - Builds Angular app for production
  - Creates Electron installers (.dmg, .exe, etc.)
  - Uploads installers to GitHub Releases
  - Enables auto-updater for existing users

### Auto-Updater
- Users with existing versions will automatically receive update notifications
- Updates download in background and install on next app restart
- Uses GitHub Releases as the update server

### Version Types
- **patch**: Bug fixes (0.3.1 → 0.3.2)
- **minor**: New features (0.3.1 → 0.4.0) 
- **major**: Breaking changes (0.3.1 → 1.0.0)

### Requirements for Release
- Clean working tree (all changes committed)
- Push access to the GitHub repository
- GitHub token configured for electron-forge publisher
