import { McpApp, Module } from '@nitrostack/core';
import { SystemTools } from './system.tools';

@McpApp({
  module: AppModule,
  server: { name: 'apextune-server', version: '1.0.0' }
})
@Module({
  name: 'AppModule', // <-- We just added this required property
  controllers: [SystemTools],
})
export class AppModule {}