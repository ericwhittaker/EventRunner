# Development Cheat Sheet

This is a quick reference for common Git and NPM commands used in this project.

## Git Branch Management

### Creating and Switching Branches
```bash
# Create and switch to new branch
git checkout -b branch-name
# OR (newer syntax)
git switch -c branch-name

# Switch to existing branch
git checkout branch-name
# OR (newer syntax)
git switch branch-name
```

### Deleting Branches
```bash
# Safe delete (prevents deletion if branch has unmerged commits)
git branch -d branch-name
git branch --delete branch-name

# Force delete (deletes branch even with unmerged commits)
git branch -D branch-name
git branch --delete --force branch-name
```

### Viewing Branches
```bash
# List local branches
git branch

# List all branches (local and remote)
git branch -a
git branch --all

# List remote branches only
git branch -r
git branch --remotes
```

### Branch Status and Information
```bash
# Show current branch and status
git status

# Show branch commit history
git log --oneline -5

# Compare branches
git diff main other-branch
git diff main other-branch --name-only  # Just file names
```

## NPM Package Management

### Installing Packages
```bash
# Install packages and update package-lock.json
npm install
npm install package-name

# Clean install (deletes node_modules, installs exactly from lock file)
npm ci

# Install development dependencies
npm install --save-dev package-name
npm install -D package-name
```

### Package Information
```bash
# List installed packages
npm ls --depth=0

# Check for outdated packages
npm outdated

# View package info
npm info package-name
```

## Safe Branch Workflow with Packages

### Starting an Experiment
```bash
# 1. Ensure clean main state
git checkout main
npm ci

# 2. Create experimental branch
git checkout -b feature-experiment

# 3. Install new packages if needed
npm install new-package-name

# 4. Do your development work...
```

### Finishing an Experiment

#### If you LIKE the changes:
```bash
# 1. Switch back to main
git checkout main

# 2. Merge the branch
git merge feature-experiment

# 3. Clean install with new packages
npm ci

# 4. Clean up the branch
git branch -d feature-experiment
```

#### If you DON'T like the changes:
```bash
# 1. Switch back to main
git checkout main

# 2. Reinstall original packages
npm ci

# 3. Force delete the experimental branch
git branch -D feature-experiment
```

## Common Git Shortcuts

### Staging and Committing
```bash
# Stage all changes
git add .
git add --all

# Commit with message
git commit -m "Your message here"

# Stage and commit in one step
git commit -am "Your message here"
```

### Undoing Changes
```bash
# Undo last commit (keep changes in working directory)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Discard all working directory changes
git reset --hard HEAD

# Discard changes to specific file
git checkout -- filename
```

### Viewing Changes
```bash
# See what changed
git diff

# See what's staged
git diff --staged

# See commit history
git log --oneline
git log --graph --oneline --all
```

## NPM Scripts (Project Specific)

```bash
# Development
npm start                    # Start Angular dev server
npm run watch               # Build in watch mode

# Building and Testing
npm run build               # Build for production
npm test                    # Run unit tests

# Electron
npm run electronstart       # Start Electron app
npm run electronpackage     # Package Electron app
npm run electronmake        # Make Electron distributables

# Versioning and Release
npm run er-releasepatch     # Patch version (0.9.5 → 0.9.6)
npm run er-releaseminor     # Minor version (0.9.5 → 0.10.0)
npm run er-releasemajor     # Major version (0.9.5 → 1.0.0)
```

## Quick Tips

### When to use which delete command:
- Use `git branch -d` when you want Git to protect you from losing work
- Use `git branch -D` when you're sure you want to discard the branch's work

### When to use which npm command:
- Use `npm install` when you want to add new packages or update existing ones
- Use `npm ci` when you want to install exactly what's in package-lock.json (especially after switching branches)

### Branch naming conventions:
- `feature/footer-component` - for new features
- `fix/button-styling` - for bug fixes
- `experiment/new-ui-library` - for experiments
- `chore/update-dependencies` - for maintenance tasks

### Git commit message conventions:
- `feat:` - new features
- `fix:` - bug fixes
- `docs:` - documentation changes
- `style:` - formatting, missing semicolons, etc.
- `refactor:` - code changes that neither fix bugs nor add features
- `chore:` - updating build tasks, package manager configs, etc.

## Emergency Commands

### "Oh no, I messed up!"
```bash
# See what you did recently
git reflog

# Go back to a specific commit
git reset --hard commit-hash

# Restore a deleted file
git checkout HEAD -- filename
```

### "I'm in the middle of something and need to switch branches"
```bash
# Temporarily save your work
git stash

# Switch branches and do other work...

# Come back and restore your work
git stash pop
```
