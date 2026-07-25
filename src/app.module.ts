import { McpApp, Module } from '@nitrostack/core';
import { SystemTools } from './system.tools';
import { StartupTools } from './startup.tools';
import { CleanupTools } from './cleanup.tools';
import { NetworkTools } from './network.tools';
import { BoostTools } from './boost.tools';

@McpApp({
  module: AppModule,
  server: { name: 'apextune-server', version: '1.0.0' }
})
@Module({
  name: 'AppModule',
  controllers: [SystemTools, StartupTools, CleanupTools, NetworkTools, BoostTools],
})
export class AppModule {}
