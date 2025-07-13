import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.parthparmar.deskmint',
  appName: 'DeskMint',
  webDir: 'dist',
  android: {
    allowMixedContent: true
  }
};

export default config;
