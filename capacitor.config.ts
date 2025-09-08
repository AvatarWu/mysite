import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.careold.health',
  appName: 'CareOld Health',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    // 本地通知插件配置
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
    // 狀態欄插件配置
    StatusBar: {
      style: 'default',
      overlaysWebView: true
    }
  }
};

export default config;
