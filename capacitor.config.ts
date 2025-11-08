import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'templeconnect',
  webDir: 'public',
  server: {
    url: 'https://temple-iota-ochre.vercel.app', // ✅ Your live URL here
    cleartext: true
  }
};

export default config;
