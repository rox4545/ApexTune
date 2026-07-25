import { ToolDecorator as Tool, z } from '@nitrostack/core';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class CleanupTools {
  @Tool({
    name: 'get_reclaimable_space',
    description: 'Estimates how much disk space could be freed by clearing temp files, without deleting anything. Run this before clean_temp_files.',
    inputSchema: z.object({})
  })
  async getReclaimableSpace() {
    try {
      const cmd = `powershell -Command "(Get-ChildItem -Path $env:TEMP,'C:\\Windows\\Temp' -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum"`;
      const { stdout } = await execAsync(cmd);
      const bytes = parseInt(stdout.trim(), 10) || 0;
      return { reclaimableMB: (bytes / 1024 ** 2).toFixed(1) };
    } catch (error) {
      return { message: 'Could not estimate reclaimable space.' };
    }
  }

  @Tool({
    name: 'clean_temp_files',
    description: 'Deletes files in the user and Windows temp folders to free disk space. Files currently in use are skipped automatically. Requires confirm:true — call once first to preview.',
    inputSchema: z.object({
      confirm: z.boolean().default(false)
    })
  })
  async cleanTempFiles({ confirm }: { confirm: boolean }) {
    if (!confirm) {
      return { preview: true, message: 'This will permanently delete files in %TEMP% and C:\\Windows\\Temp. Files currently locked by running apps will be safely skipped. Call again with confirm:true to proceed.' };
    }
    try {
      const cmd = `powershell -Command "Get-ChildItem -Path $env:TEMP,'C:\\Windows\\Temp' -Recurse -Force -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue"`;
      await execAsync(cmd);
      return { message: 'Temp files cleaned (locked/in-use files were skipped).' };
    } catch (error) {
      return { message: 'Cleanup ran but some files may have been skipped due to permissions.' };
    }
  }

  @Tool({
    name: 'empty_recycle_bin',
    description: 'Empties the Windows Recycle Bin. Requires confirm:true — call once first to preview.',
    inputSchema: z.object({
      confirm: z.boolean().default(false)
    })
  })
  async emptyRecycleBin({ confirm }: { confirm: boolean }) {
    if (!confirm) {
      return { preview: true, message: 'This will permanently empty the Recycle Bin — files will not be recoverable. Call again with confirm:true to proceed.' };
    }
    try {
      await execAsync(`powershell -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue"`);
      return { message: 'Recycle Bin emptied.' };
    } catch (error) {
      return { message: 'Could not empty Recycle Bin.' };
    }
  }
}
