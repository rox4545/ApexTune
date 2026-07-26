import { InterceptorInterface, ExecutionContext, Injectable } from '@nitrostack/core';

/**
 * ApexTune's tools shell out to Windows-only commands (powershell, reg, taskkill,
 * powercfg) that must execute on the user's own PC to have any real effect.
 *
 * When this server is reached through NitroCloud's hosted HTTP endpoint, the code
 * actually runs inside NitroCloud's own container — NOT the user's machine. On a
 * non-Windows container these commands simply fail; on a Windows one they'd act on
 * the cloud host instead of the user's PC. Either way, that's the wrong target.
 *
 * This interceptor short-circuits every tool call with a clear explanation whenever
 * the process isn't running natively on Windows, instead of silently failing or
 * (worse) touching the wrong machine.
 */
@Injectable()
export class LocalWindowsOnlyInterceptor implements InterceptorInterface {
  async intercept(context: ExecutionContext, next: () => Promise<unknown>): Promise<unknown> {
    if (process.platform !== 'win32') {
      return {
        error: true,
        message:
          "ApexTune needs to run directly on your Windows PC to see and control it. " +
          "This request came in through the NitroCloud hosted endpoint, which runs in the cloud — not on your machine — so no action was taken. " +
          "Connect using local (STDIO) mode instead: run `npm run dev` on your own Windows PC and point NitroStudio or your MCP client at that local process."
      };
    }
    return next();
  }
}
