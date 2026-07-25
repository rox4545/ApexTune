import { ToolDecorator as Tool, z } from '@nitrostack/core';
import si from 'systeminformation';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class SystemTools {
  // Your existing RAM tool
  @Tool({
    name: 'check_memory',
    description: 'Checks current system RAM usage.',
    inputSchema: z.object({})
  })
  async checkMemory() {
    const mem = await si.mem();
    const totalGB = (mem.total / 1024 ** 3).toFixed(2);
    const usedGB = (mem.active / 1024 ** 3).toFixed(2);
    return { system_memory: `Total: ${totalGB}GB, Used: ${usedGB}GB` };
  }

  // The new Process Killer tool
  @Tool({
    name: 'kill_process',
    description: 'Kills a Windows process by name to free up memory.',
    inputSchema: z.object({
      processName: z.string().describe('Name of the process (e.g., chrome.exe, spotify.exe)')
    })
  })
  async killProcess({ processName }: { processName: string }) {
    try {
      await execAsync(`taskkill /F /IM ${processName}`);
      return { message: `Successfully killed ${processName}.` };
    } catch (error) {
      return { message: `Could not kill ${processName}. It might not be running or needs admin rights.` };
    }
  }
}