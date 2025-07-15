import { Injectable } from '@angular/core';

declare global {
  interface Window {
    electronAPI: {
      openFileManager: () => Promise<{success: boolean, platform?: string, error?: string}>;
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {

  constructor() { }

  /**
   * Opens the native file manager (Finder on macOS, File Explorer on Windows)
   * Platform detection is handled automatically by Electron
   */
  async openFileManager(): Promise<{success: boolean, platform?: string, error?: string}> {
    try {
      if (!window.electronAPI) {
        throw new Error('Electron API not available');
      }

      const result = await window.electronAPI.openFileManager();
      return result;
    } catch (error) {
      console.error('Error opening file manager:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
