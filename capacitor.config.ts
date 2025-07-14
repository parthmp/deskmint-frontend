import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.parthparmar.deskmint',
  appName: 'DeskMint',
  webDir: 'dist',
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
