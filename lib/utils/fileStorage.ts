import fs from 'fs';
import path from 'path';

/**
 * Utility class for managing file storage
 */
export class FileStorage {
  /**
   * Ensure required upload directories exist
   */
  static async ensureUploadDirectories(): Promise<void> {
    const uploadDirs = [
      path.join(process.cwd(), 'public', 'uploads'),
      path.join(process.cwd(), 'public', 'uploads', 'avatars'),
      path.join(process.cwd(), 'public', 'uploads', 'models'),
      path.join(process.cwd(), 'public', 'uploads', 'temp')
    ];
    
    try {
      console.log('Ensuring upload directories exist...');
      
      for (const dir of uploadDirs) {
        if (!fs.existsSync(dir)) {
          console.log(`Creating directory: ${dir}`);
          await fs.promises.mkdir(dir, { recursive: true });
        } else {
          console.log(`Directory already exists: ${dir}`);
        }
        
        // Make sure directory is writable
        try {
          await fs.promises.access(dir, fs.constants.W_OK);
          console.log(`Directory is writable: ${dir}`);
        } catch (error) {
          console.error(`Directory is not writable: ${dir}`, error);
        }
      }
      
      console.log('All upload directories verified');
    } catch (error) {
      console.error('Error ensuring upload directories:', error);
      throw error;
    }
  }
  
  /**
   * Get the absolute path to an upload directory
   */
  static getUploadPath(subDir?: string): string {
    const baseDir = path.join(process.cwd(), 'public', 'uploads');
    return subDir ? path.join(baseDir, subDir) : baseDir;
  }
  
  /**
   * Get a public URL for an uploaded file
   */
  static getPublicUrl(filePath: string): string {
    // Remove the public prefix to get the URL path
    const relativePath = filePath.replace(path.join(process.cwd(), 'public'), '');
    // Normalize path separators for URLs
    return relativePath.replace(/\\/g, '/');
  }
} 