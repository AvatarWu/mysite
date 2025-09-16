import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SettingsData {
  general: {
    appearance: 'auto' | 'light' | 'dark';
    language: 'zh-TW' | 'zh-CN' | 'en' | 'ja';
    notifications: boolean;
    autoSync: boolean;
    syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    voiceNavigation: boolean;
    reduceMotion: boolean;
  };
  privacy: {
    dataSharing: boolean;
    locationServices: boolean;
    crashReports: boolean;
  };
  notifications: {
    healthReminders: boolean;
    medicationAlerts: boolean;
    appointmentReminders: boolean;
    systemUpdates: boolean;
    emergencyAlerts: boolean;
    weeklyReports: boolean;
  };
}

const Settings: React.FC = () => {
  console.log('Settings 組件渲染');
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    // 檢查系統主題偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    return false;
  });
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAppearanceMenu, setShowAppearanceMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showSyncFrequencyMenu, setShowSyncFrequencyMenu] = useState(false);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    general: {
      appearance: 'auto',
      language: 'zh-TW',
      notifications: false,
      autoSync: false,
      syncFrequency: 'daily',
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      fontSize: 'medium',
      voiceNavigation: false,
      reduceMotion: false,
    },
    privacy: {
      dataSharing: false,
      locationServices: false,
      crashReports: true,
    },
    notifications: {
      healthReminders: true,
      medicationAlerts: true,
      appointmentReminders: true,
      systemUpdates: false,
      emergencyAlerts: true,
      weeklyReports: false,
    },
  });
  const [tempSettings, setTempSettings] = useState<SettingsData>(settings);

  // 載入設定
  useEffect(() => {
    loadSettings();
  }, []);

  // 點擊外部關閉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-menu')) {
        setShowAppearanceMenu(false);
        setShowLanguageMenu(false);
        setShowSyncFrequencyMenu(false);
        setShowFontSizeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 應用字體大小設定
  const applyFontSize = (fontSize: 'small' | 'medium' | 'large' | 'extra-large') => {
    const fontSizes = {
      small: '14px',
      medium: '16px', 
      large: '18px',
      'extra-large': '20px'
    };
    
    document.documentElement.style.setProperty('--base-font-size', fontSizes[fontSize]);
    document.documentElement.setAttribute('data-font-size', fontSize);
  };

  // 多語言文字對應
  const getText = (key: string) => {
    const texts = {
      'zh-TW': {
        'settings': '設定',
        'general': '一般',
        'appearance': '外觀',
        'appearanceDesc': '選擇應用程式的外觀',
        'auto': '自動',
        'light': '淺色',
        'dark': '深色',
        'language': '語言',
        'languageDesc': '選擇應用程式的顯示語言',
        'tradChinese': '繁體中文',
        'simpChinese': '簡體中文',
        'english': 'English',
        'japanese': '日本語',
        'notifications': '通知',
        'notificationsDesc': '接收健康提醒和更新通知',
        'autoSync': '自動同步',
        'autoSyncDesc': '自動同步健康數據到雲端',
        'syncFrequency': '同步頻率',
        'syncFrequencyDesc': '選擇數據同步的頻率',
        'realtime': '即時',
        'realtimeDesc': '數據變更時立即同步',
        'hourly': '每小時',
        'hourlyDesc': '每小時同步一次',
        'daily': '每天',
        'dailyDesc': '每天同步一次',
        'weekly': '每週',
        'weeklyDesc': '每週同步一次',
        'accessibility': '無障礙',
        'highContrast': '高對比度',
        'highContrastDesc': '提高文字和背景的對比度',
        'fontSize': '字體大小',
        'fontSizeDesc': '調整應用程式中的文字大小',
        'small': '小',
        'smallDesc': '14px - 適合小螢幕',
        'medium': '中',
        'mediumDesc': '16px - 標準大小',
        'large': '大',
        'largeDesc': '18px - 易於閱讀',
        'extraLarge': '特大',
        'extraLargeDesc': '20px - 最大字體',
        'voiceNavigation': '語音導航',
        'voiceNavigationDesc': '啟用語音導航功能',
        'reduceMotion': '減少動畫',
        'reduceMotionDesc': '減少界面動畫效果',
        'privacy': '隱私與安全',
        'dataSharing': '數據分享',
        'dataSharingDesc': '允許與醫療機構分享數據',
        'locationServices': '位置服務',
        'locationServicesDesc': '允許應用程式存取位置資訊',
        'crashReports': '崩潰報告',
        'crashReportsDesc': '自動發送崩潰報告以改善應用程式',
        'back': '返回',
        'save': '儲存',
        'healthReminders': '健康提醒',
        'healthRemindersDesc': '日常健康檢查提醒',
        'medicationAlerts': '用藥提醒',
        'medicationAlertsDesc': '藥物服用時間提醒',
        'appointmentReminders': '預約提醒',
        'appointmentRemindersDesc': '醫療預約和檢查提醒',
        'systemUpdates': '系統更新',
        'systemUpdatesDesc': '應用程式更新通知',
        'emergencyAlerts': '緊急警報',
        'emergencyAlertsDesc': '重要健康警報和緊急通知',
        'weeklyReports': '週報',
        'weeklyReportsDesc': '每週健康報告摘要'
      },
      'zh-CN': {
        'settings': '设置',
        'general': '一般',
        'appearance': '外观',
        'appearanceDesc': '选择应用程序的外观',
        'auto': '自动',
        'light': '浅色',
        'dark': '深色',
        'language': '语言',
        'languageDesc': '选择应用程序的显示语言',
        'tradChinese': '繁体中文',
        'simpChinese': '简体中文',
        'english': 'English',
        'japanese': '日本語',
        'notifications': '通知',
        'notificationsDesc': '接收健康提醒和更新通知',
        'autoSync': '自动同步',
        'autoSyncDesc': '自动同步健康数据到云端',
        'syncFrequency': '同步频率',
        'syncFrequencyDesc': '选择数据同步的频率',
        'realtime': '实时',
        'realtimeDesc': '数据变更时立即同步',
        'hourly': '每小时',
        'hourlyDesc': '每小时同步一次',
        'daily': '每天',
        'dailyDesc': '每天同步一次',
        'weekly': '每周',
        'weeklyDesc': '每周同步一次',
        'accessibility': '无障碍',
        'highContrast': '高对比度',
        'highContrastDesc': '提高文字和背景的对比度',
        'fontSize': '字体大小',
        'fontSizeDesc': '调整应用程序中的文字大小',
        'small': '小',
        'smallDesc': '14px - 适合小屏幕',
        'medium': '中',
        'mediumDesc': '16px - 标准大小',
        'large': '大',
        'largeDesc': '18px - 易于阅读',
        'extraLarge': '特大',
        'extraLargeDesc': '20px - 最大字体',
        'voiceNavigation': '语音导航',
        'voiceNavigationDesc': '启用语音导航功能',
        'reduceMotion': '减少动画',
        'reduceMotionDesc': '减少界面动画效果',
        'privacy': '隐私与安全',
        'dataSharing': '数据分享',
        'dataSharingDesc': '允许与医疗机构分享数据',
        'locationServices': '位置服务',
        'locationServicesDesc': '允许应用程序访问位置信息',
        'crashReports': '崩溃报告',
        'crashReportsDesc': '自动发送崩溃报告以改善应用程序',
        'back': '返回',
        'save': '保存',
        'healthReminders': '健康提醒',
        'healthRemindersDesc': '日常健康检查提醒',
        'medicationAlerts': '用药提醒',
        'medicationAlertsDesc': '药物服用时间提醒',
        'appointmentReminders': '预约提醒',
        'appointmentRemindersDesc': '医疗预约和检查提醒',
        'systemUpdates': '系统更新',
        'systemUpdatesDesc': '应用程序更新通知',
        'emergencyAlerts': '紧急警报',
        'emergencyAlertsDesc': '重要健康警报和紧急通知',
        'weeklyReports': '周报',
        'weeklyReportsDesc': '每周健康报告摘要'
      },
      'en': {
        'settings': 'Settings',
        'general': 'General',
        'appearance': 'Appearance',
        'appearanceDesc': 'Choose the appearance of the app',
        'auto': 'Auto',
        'light': 'Light',
        'dark': 'Dark',
        'language': 'Language',
        'languageDesc': 'Choose the display language of the app',
        'tradChinese': 'Traditional Chinese',
        'simpChinese': 'Simplified Chinese',
        'english': 'English',
        'japanese': 'Japanese',
        'notifications': 'Notifications',
        'notificationsDesc': 'Receive health reminders and update notifications',
        'autoSync': 'Auto Sync',
        'autoSyncDesc': 'Automatically sync health data to cloud',
        'syncFrequency': 'Sync Frequency',
        'syncFrequencyDesc': 'Choose the frequency of data sync',
        'realtime': 'Realtime',
        'realtimeDesc': 'Sync immediately when data changes',
        'hourly': 'Hourly',
        'hourlyDesc': 'Sync once per hour',
        'daily': 'Daily',
        'dailyDesc': 'Sync once per day',
        'weekly': 'Weekly',
        'weeklyDesc': 'Sync once per week',
        'accessibility': 'Accessibility',
        'highContrast': 'High Contrast',
        'highContrastDesc': 'Increase contrast between text and background',
        'fontSize': 'Font Size',
        'fontSizeDesc': 'Adjust text size in the app',
        'small': 'Small',
        'smallDesc': '14px - Suitable for small screens',
        'medium': 'Medium',
        'mediumDesc': '16px - Standard size',
        'large': 'Large',
        'largeDesc': '18px - Easy to read',
        'extraLarge': 'Extra Large',
        'extraLargeDesc': '20px - Maximum font size',
        'voiceNavigation': 'Voice Navigation',
        'voiceNavigationDesc': 'Enable voice navigation features',
        'reduceMotion': 'Reduce Motion',
        'reduceMotionDesc': 'Reduce interface animation effects',
        'privacy': 'Privacy & Security',
        'dataSharing': 'Data Sharing',
        'dataSharingDesc': 'Allow sharing data with medical institutions',
        'locationServices': 'Location Services',
        'locationServicesDesc': 'Allow app to access location information',
        'crashReports': 'Crash Reports',
        'crashReportsDesc': 'Automatically send crash reports to improve the app',
        'back': 'Back',
        'save': 'Save',
        'healthReminders': 'Health Reminders',
        'healthRemindersDesc': 'Daily health check reminders',
        'medicationAlerts': 'Medication Alerts',
        'medicationAlertsDesc': 'Medication time reminders',
        'appointmentReminders': 'Appointment Reminders',
        'appointmentRemindersDesc': 'Medical appointment and checkup reminders',
        'systemUpdates': 'System Updates',
        'systemUpdatesDesc': 'App update notifications',
        'emergencyAlerts': 'Emergency Alerts',
        'emergencyAlertsDesc': 'Important health alerts and emergency notifications',
        'weeklyReports': 'Weekly Reports',
        'weeklyReportsDesc': 'Weekly health report summary'
      },
      'ja': {
        'settings': '設定',
        'general': '一般',
        'appearance': '外観',
        'appearanceDesc': 'アプリケーションの外観を選択',
        'auto': '自動',
        'light': 'ライト',
        'dark': 'ダーク',
        'language': '言語',
        'languageDesc': 'アプリケーションの表示言語を選択',
        'tradChinese': '繁体中文',
        'simpChinese': '簡体中文',
        'english': 'English',
        'japanese': '日本語',
        'notifications': '通知',
        'notificationsDesc': '健康リマインダーと更新通知を受信',
        'autoSync': '自動同期',
        'autoSyncDesc': '健康データをクラウドに自動同期',
        'syncFrequency': '同期頻度',
        'syncFrequencyDesc': 'データ同期の頻度を選択',
        'realtime': 'リアルタイム',
        'realtimeDesc': 'データ変更時に即座に同期',
        'hourly': '毎時',
        'hourlyDesc': '1時間ごとに同期',
        'daily': '毎日',
        'dailyDesc': '1日1回同期',
        'weekly': '毎週',
        'weeklyDesc': '1週間に1回同期',
        'accessibility': 'アクセシビリティ',
        'highContrast': 'ハイコントラスト',
        'highContrastDesc': 'テキストと背景のコントラストを向上',
        'fontSize': 'フォントサイズ',
        'fontSizeDesc': 'アプリケーション内のテキストサイズを調整',
        'small': '小',
        'smallDesc': '14px - 小画面に適している',
        'medium': '中',
        'mediumDesc': '16px - 標準サイズ',
        'large': '大',
        'largeDesc': '18px - 読みやすい',
        'extraLarge': '特大',
        'extraLargeDesc': '20px - 最大フォント',
        'voiceNavigation': '音声ナビゲーション',
        'voiceNavigationDesc': '音声ナビゲーション機能を有効化',
        'reduceMotion': 'アニメーションを減らす',
        'reduceMotionDesc': 'インターフェースのアニメーション効果を減らす',
        'privacy': 'プライバシーとセキュリティ',
        'dataSharing': 'データ共有',
        'dataSharingDesc': '医療機関とのデータ共有を許可',
        'locationServices': '位置情報サービス',
        'locationServicesDesc': 'アプリが位置情報にアクセスすることを許可',
        'crashReports': 'クラッシュレポート',
        'crashReportsDesc': 'アプリの改善のためクラッシュレポートを自動送信',
        'back': '戻る',
        'save': '保存',
        'healthReminders': '健康リマインダー',
        'healthRemindersDesc': '日常の健康チェックリマインダー',
        'medicationAlerts': '薬物リマインダー',
        'medicationAlertsDesc': '薬物服用時間のリマインダー',
        'appointmentReminders': '予約リマインダー',
        'appointmentRemindersDesc': '医療予約と検査のリマインダー',
        'systemUpdates': 'システム更新',
        'systemUpdatesDesc': 'アプリケーション更新通知',
        'emergencyAlerts': '緊急アラート',
        'emergencyAlertsDesc': '重要な健康アラートと緊急通知',
        'weeklyReports': '週次レポート',
        'weeklyReportsDesc': '週次健康レポートサマリー'
      }
    };
    
    return (texts as any)[tempSettings.general.language]?.[key] || (texts as any)['zh-TW'][key] || key;
  };

  // 應用語言設定
  const applyLanguage = (language: 'zh-TW' | 'zh-CN' | 'en' | 'ja') => {
    document.documentElement.setAttribute('lang', language);
    console.log('語言已切換至:', language);
  };

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('careold-settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        setTempSettings(parsedSettings);
        
        // 應用外觀設定
        if (parsedSettings.general.appearance === 'dark') {
          setIsDark(true);
          document.documentElement.setAttribute('data-theme', 'dark');
        } else if (parsedSettings.general.appearance === 'light') {
          setIsDark(false);
          document.documentElement.setAttribute('data-theme', 'light');
        } else {
          // 自動模式 - 檢查系統主題
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          console.log('系統主題偏好:', prefersDark ? 'dark' : 'light');
          setIsDark(prefersDark);
          document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        }
        
        // 應用高對比度設定
        setIsHighContrast(parsedSettings.accessibility.highContrast);
        
        // 應用字體大小設定
        applyFontSize(parsedSettings.accessibility.fontSize);
        
        // 應用語言設定
        applyLanguage(parsedSettings.general.language);
      }
    } catch (error) {
      console.error('載入設定失敗:', error);
    }
  };

  // 監聽系統主題變化
  useEffect(() => {
    if (tempSettings.general.appearance !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const checkSystemTheme = () => {
      const shouldBeDark = mediaQuery.matches;
      setIsDark(shouldBeDark);
      document.documentElement.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light');
    };

    checkSystemTheme();
    mediaQuery.addEventListener('change', checkSystemTheme);

    return () => mediaQuery.removeEventListener('change', checkSystemTheme);
  }, [tempSettings.general.appearance]);

  const handleToggle = (category: keyof SettingsData, key: string) => {
    setTempSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !(prev[category] as any)[key],
      },
    }));
    setHasChanges(true);
  };

  const handleSelect = (category: keyof SettingsData, key: string, value: string) => {
    setTempSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value as any,
      },
    }));
    setHasChanges(true);
    
    // 立即應用外觀設定變更
    if (category === 'general' && key === 'appearance') {
      if (value === 'dark') {
        setIsDark(true);
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.setAttribute('data-theme', 'dark');
        // 強制應用深色主題到所有元素
        const darkBg = 'linear-gradient(135deg, #2d1b0e 0%, #3d2815 20%, #4d331c 40%, #5d3e23 60%, #6d492a 80%, #7d5431 100%)';
        document.documentElement.style.setProperty('--theme-bg', darkBg);
        document.documentElement.style.setProperty('--theme-text', '#ffffff');
        console.log('Settings: 設定深色主題CSS變數:', darkBg);
        console.log('Settings: 檢查CSS變數值:', getComputedStyle(document.documentElement).getPropertyValue('--theme-bg'));
        // 觸發主題變更事件
        window.dispatchEvent(new CustomEvent('themeChanged', { 
          detail: { theme: 'dark', isDark: true } 
        }));
      } else if (value === 'light') {
        setIsDark(false);
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.setAttribute('data-theme', 'light');
        // 強制應用淺色主題到所有元素
        const lightBg = 'linear-gradient(135deg, #fff8f0 0%, #ffe8d6 20%, #ffd4b3 40%, #ffc49b 60%, #ffb380 80%, #ffa366 100%)';
        document.documentElement.style.setProperty('--theme-bg', lightBg);
        document.documentElement.style.setProperty('--theme-text', '#1d1d1f');
        console.log('Settings: 設定淺色主題CSS變數:', lightBg);
        console.log('Settings: 檢查CSS變數值:', getComputedStyle(document.documentElement).getPropertyValue('--theme-bg'));
        // 觸發主題變更事件
        window.dispatchEvent(new CustomEvent('themeChanged', { 
          detail: { theme: 'light', isDark: false } 
        }));
      } else {
        // 自動模式
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(prefersDark);
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        if (prefersDark) {
          const darkBg = 'linear-gradient(135deg, #2d1b0e 0%, #3d2815 20%, #4d331c 40%, #5d3e23 60%, #6d492a 80%, #7d5431 100%)';
          document.documentElement.style.setProperty('--theme-bg', darkBg);
          document.documentElement.style.setProperty('--theme-text', '#ffffff');
          console.log('Settings: 自動模式-深色主題CSS變數:', darkBg);
        } else {
          const lightBg = 'linear-gradient(135deg, #fff8f0 0%, #ffe8d6 20%, #ffd4b3 40%, #ffc49b 60%, #ffb380 80%, #ffa366 100%)';
          document.documentElement.style.setProperty('--theme-bg', lightBg);
          document.documentElement.style.setProperty('--theme-text', '#1d1d1f');
          console.log('Settings: 自動模式-淺色主題CSS變數:', lightBg);
        }
        console.log('Settings: 檢查CSS變數值:', getComputedStyle(document.documentElement).getPropertyValue('--theme-bg'));
        // 觸發主題變更事件
        window.dispatchEvent(new CustomEvent('themeChanged', { 
          detail: { theme: 'auto', isDark: prefersDark } 
        }));
      }
    }
    
    // 立即應用語言設定變更
    if (category === 'general' && key === 'language') {
      applyLanguage(value as 'zh-TW' | 'zh-CN' | 'en');
      // 觸發語言變更事件
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language: value } 
      }));
    }
    
    // 立即應用外觀設定變更
    if (category === 'general' && key === 'appearance') {
      // 觸發主題變更事件
      window.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { theme: value } 
      }));
    }
  };

  const handleSave = () => {
    try {
      // 保存到本地存儲
      localStorage.setItem('careold-settings', JSON.stringify(tempSettings));
      setSettings(tempSettings);
      setHasChanges(false);
      
      // 應用外觀設定
      if (tempSettings.general.appearance === 'dark') {
        setIsDark(true);
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.setAttribute('data-theme', 'dark');
        document.documentElement.style.setProperty('--theme-bg', 'linear-gradient(135deg, #2d1b0e 0%, #3d2815 20%, #4d331c 40%, #5d3e23 60%, #6d492a 80%, #7d5431 100%)');
        document.documentElement.style.setProperty('--theme-text', '#ffffff');
      } else if (tempSettings.general.appearance === 'light') {
        setIsDark(false);
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.setAttribute('data-theme', 'light');
        document.documentElement.style.setProperty('--theme-bg', 'linear-gradient(135deg, #fff8f0 0%, #ffe8d6 20%, #ffd4b3 40%, #ffc49b 60%, #ffb380 80%, #ffa366 100%)');
        document.documentElement.style.setProperty('--theme-text', '#1d1d1f');
      } else {
        // 自動模式
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(prefersDark);
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        if (prefersDark) {
          document.documentElement.style.setProperty('--theme-bg', 'linear-gradient(135deg, #2d1b0e 0%, #3d2815 20%, #4d331c 40%, #5d3e23 60%, #6d492a 80%, #7d5431 100%)');
          document.documentElement.style.setProperty('--theme-text', '#ffffff');
        } else {
          document.documentElement.style.setProperty('--theme-bg', 'linear-gradient(135deg, #fff8f0 0%, #ffe8d6 20%, #ffd4b3 40%, #ffc49b 60%, #ffb380 80%, #ffa366 100%)');
          document.documentElement.style.setProperty('--theme-text', '#1d1d1f');
        }
      }
      
      // 應用高對比度設定
      setIsHighContrast(tempSettings.accessibility.highContrast);
      
      // 應用字體大小設定
      applyFontSize(tempSettings.accessibility.fontSize);
      
      // 應用語言設定
      applyLanguage(tempSettings.general.language);
      
      // 觸發全局事件，通知其他頁面更新
      window.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { theme: tempSettings.general.appearance } 
      }));
      
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language: tempSettings.general.language } 
      }));
      
      window.dispatchEvent(new CustomEvent('highContrastChanged', { 
        detail: { enabled: tempSettings.accessibility.highContrast } 
      }));
      
      window.dispatchEvent(new CustomEvent('largeTextChanged', { 
        detail: { enabled: tempSettings.accessibility.fontSize !== 'medium' } 
      }));
      
      alert('設定已儲存！');
      navigate('/');
    } catch (error) {
      console.error('儲存設定失敗:', error);
      alert('儲存失敗，請重試');
    }
  };

  const handleBack = () => {
    if (hasChanges) {
      if (window.confirm('您有未儲存的變更，確定要離開嗎？')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  // Apple 風格的切換開關組件
  const AppleToggle = ({ checked, onChange, disabled = false }: { checked: boolean; onChange: () => void; disabled?: boolean }) => (
    <button
      onClick={onChange}
      disabled={disabled}
      style={{
        width: '51px',
        height: '31px',
        borderRadius: '16px',
        border: 'none',
        background: checked ? '#34C759' : (isHighContrast ? (isDark ? '#ffffff' : '#000000') : '#E5E5EA'),
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: disabled ? 0.5 : 1,
        outline: 'none',
        boxShadow: checked ? '0 2px 8px rgba(52, 199, 89, 0.3)' : 'none',
      }}
    >
      <div
        style={{
          width: '27px',
          height: '27px',
          borderRadius: '50%',
          background: '#ffffff',
          position: 'absolute',
          top: '2px',
          left: checked ? '22px' : '2px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      />
    </button>
  );

  return (
    <div className="settings-page" style={{
      minHeight: '100vh',
      background: isHighContrast
        ? (isDark ? '#000000' : '#ffffff')
        : (isDark ? 'linear-gradient(135deg, #2d1b0e 0%, #3d2815 20%, #4d331c 40%, #5d3e23 60%, #6d492a 80%, #7d5431 100%)' : 'linear-gradient(135deg, #fff8f0 0%, #ffe8d6 20%, #ffd4b3 40%, #ffc49b 60%, #ffb380 80%, #ffa366 100%)'),
      color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
      paddingTop: 'env(safe-area-inset-top)',
    }}>
      {/* 導航欄 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: isHighContrast
          ? (isDark ? '#000000' : '#ffffff')
          : (isDark ? 'rgba(45, 27, 14, 0.9)' : 'rgba(255, 248, 240, 0.9)'),
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: isHighContrast
          ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
          : (isDark ? '0.5px solid rgba(255, 255, 255, 0.2)' : '0.5px solid rgba(0, 0, 0, 0.1)'),
        paddingTop: 'env(safe-area-inset-top)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px 16px',
          position: 'relative',
        }}>
          <button
            onClick={handleBack}
            style={{
              background: 'transparent',
              border: 'none',
              color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#007AFF'),
              fontSize: '17px',
              fontWeight: '400',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'background-color 0.2s ease',
              minWidth: '80px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 122, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            {getText('back')}
          </button>
          
          <h1 style={{
            fontSize: '17px',
            fontWeight: '600',
            color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
            margin: 0,
            letterSpacing: '-0.4px',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            textShadow: isDark ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none',
          }}>
            {getText('settings')}
          </h1>
          
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            style={{
              background: hasChanges ? '#007AFF' : 'transparent',
              border: hasChanges ? 'none' : (isDark ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid #8E8E93'),
              color: hasChanges ? '#ffffff' : (isDark ? 'rgba(255, 255, 255, 0.6)' : '#8E8E93'),
              fontSize: '17px',
              fontWeight: '500',
              cursor: hasChanges ? 'pointer' : 'not-allowed',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              opacity: hasChanges ? 1 : 0.6,
              minWidth: '80px',
            }}
            onMouseEnter={(e) => {
              if (hasChanges) {
                e.currentTarget.style.backgroundColor = '#0056CC';
                e.currentTarget.style.transform = 'scale(1.02)';
              } else {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (hasChanges) {
                e.currentTarget.style.backgroundColor = '#007AFF';
                e.currentTarget.style.transform = 'scale(1)';
              } else {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {getText('save')}
          </button>
        </div>
      </div>

      {/* 內容區域 */}
      <div style={{
        padding: '20px',
        paddingTop: 'calc(env(safe-area-inset-top) + 50px)',
        paddingBottom: '40px',
      }}>
        {/* 一般設定 */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '13px',
            fontWeight: '400',
            color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {getText('general')}
          </h2>
          
          <div style={{
            background: isHighContrast
              ? (isDark ? '#000000' : '#ffffff')
              : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)'),
            borderRadius: '12px',
            overflow: 'hidden',
            border: isHighContrast
              ? (isDark ? '1px solid #ffffff' : '1px solid #000000')
              : 'none',
            boxShadow: isHighContrast ? 'none' : (isDark ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)'),
          }}>
            {/* 外觀設定 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
            }}>
              <div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '400',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  marginBottom: '2px',
                }}>
                  {getText('appearance')}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                }}>
                  {getText('appearanceDesc')}
                </div>
              </div>
              <button
                onClick={() => setShowAppearanceMenu(!showAppearanceMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  fontSize: '17px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>
                  {tempSettings.general.appearance === 'auto' ? getText('auto') : 
                   tempSettings.general.appearance === 'light' ? getText('light') : getText('dark')}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </button>
              
              {/* 外觀選單 */}
              {showAppearanceMenu && (
                <div className="dropdown-menu" style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: isHighContrast
                    ? (isDark ? '#000000' : '#ffffff')
                    : (isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.98)'),
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  border: isHighContrast
                    ? (isDark ? '2px solid #ffffff' : '2px solid #000000')
                    : '2px solid rgba(0, 0, 0, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  zIndex: 99999,
                  overflow: 'visible',
                  width: '280px',
                  maxWidth: '90vw',
                  minHeight: 'auto',
                  maxHeight: '80vh',
                }}>
                  {[
                    { value: 'auto', label: getText('auto') },
                    { value: 'light', label: getText('light') },
                    { value: 'dark', label: getText('dark') }
                  ].map((option, index) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        handleSelect('general', 'appearance', option.value);
                        setShowAppearanceMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: index < 3 ? (isHighContrast
                          ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                          : '0.5px solid rgba(0, 0, 0, 0.1)') : 'none',
                        color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                        fontSize: '17px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span>{option.label}</span>
                      {tempSettings.general.appearance === option.value && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 語言設定 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
            }}>
              <div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '400',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  marginBottom: '2px',
                }}>
                  {getText('language')}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                }}>
                  {getText('languageDesc')}
                </div>
              </div>
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  fontSize: '17px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>
                  {tempSettings.general.language === 'zh-TW' ? getText('tradChinese') : 
                   tempSettings.general.language === 'zh-CN' ? getText('simpChinese') : 
                   tempSettings.general.language === 'en' ? getText('english') : getText('japanese')}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </button>
              
              {/* 語言選單 */}
              {showLanguageMenu && (
                <div className="dropdown-menu" style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: isHighContrast
                    ? (isDark ? '#000000' : '#ffffff')
                    : (isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.98)'),
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  border: isHighContrast
                    ? (isDark ? '2px solid #ffffff' : '2px solid #000000')
                    : '2px solid rgba(0, 0, 0, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  zIndex: 99999,
                  overflow: 'visible',
                  width: '280px',
                  maxWidth: '90vw',
                  minHeight: 'auto',
                  maxHeight: '80vh',
                }}>
                  {[
                    { value: 'zh-TW', label: getText('tradChinese') },
                    { value: 'zh-CN', label: getText('simpChinese') },
                    { value: 'en', label: getText('english') },
                    { value: 'ja', label: getText('japanese') }
                  ].map((option, index) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        handleSelect('general', 'language', option.value);
                        setShowLanguageMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: index < 3 ? (isHighContrast
                          ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                          : '0.5px solid rgba(0, 0, 0, 0.1)') : 'none',
                        color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                        fontSize: '17px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span>{option.label}</span>
                      {tempSettings.general.language === option.value && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 通知設定 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '400',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  marginBottom: '2px',
                }}>
                  {getText('notifications')}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                }}>
                  {getText('notificationsDesc')}
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.general.notifications}
                onChange={() => handleToggle('general', 'notifications')}
              />
            </div>

            {/* 自動同步設定 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '400',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  marginBottom: '2px',
                }}>
                  {getText('autoSync')}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                }}>
                  {getText('autoSyncDesc')}
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.general.autoSync}
                onChange={() => handleToggle('general', 'autoSync')}
              />
            </div>

            {/* 同步頻率設定 */}
            {tempSettings.general.autoSync && (
              <div style={{
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                background: isHighContrast
                  ? (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)')
                  : (isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'),
              }}>
                <div>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: '400',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                    marginBottom: '2px',
                  }}>
                    同步頻率
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                  }}>
                    選擇數據同步的頻率
                  </div>
                </div>
                <button
                  onClick={() => setShowSyncFrequencyMenu(!showSyncFrequencyMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                    fontSize: '17px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>
                    {tempSettings.general.syncFrequency === 'realtime' ? getText('realtime') :
                     tempSettings.general.syncFrequency === 'hourly' ? getText('hourly') :
                     tempSettings.general.syncFrequency === 'daily' ? getText('daily') : getText('weekly')}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </button>
                
                {/* 同步頻率選單 */}
                {showSyncFrequencyMenu && (
                  <div className="dropdown-menu" style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: isHighContrast
                      ? (isDark ? '#000000' : '#ffffff')
                      : (isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.98)'),
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    border: isHighContrast
                      ? (isDark ? '2px solid #ffffff' : '2px solid #000000')
                      : '2px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    zIndex: 99999,
                    overflow: 'visible',
                    width: '320px',
                    maxWidth: '90vw',
                    minHeight: 'auto',
                    maxHeight: '80vh',
                  }}>
                    {[
                      { value: 'realtime', label: '即時', description: '數據變更時立即同步' },
                      { value: 'hourly', label: '每小時', description: '每小時同步一次' },
                      { value: 'daily', label: '每天', description: '每天同步一次' },
                      { value: 'weekly', label: '每週', description: '每週同步一次' }
                    ].map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          handleSelect('general', 'syncFrequency', option.value);
                          setShowSyncFrequencyMenu(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: index < 3 ? (isHighContrast
                            ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                            : '0.5px solid rgba(0, 0, 0, 0.1)') : 'none',
                          color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                          fontSize: '17px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'background-color 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '500', marginBottom: '2px' }}>{option.label}</div>
                          <div style={{ 
                            fontSize: '13px', 
                            color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                            opacity: 0.8 
                          }}>
                            {option.description}
                          </div>
                        </div>
                        {tempSettings.general.syncFrequency === option.value && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5"></path>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 無障礙設定 */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '13px',
            fontWeight: '400',
            color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {getText('accessibility')}
          </h2>
          
          <div style={{
            background: isHighContrast
              ? (isDark ? '#000000' : '#ffffff')
              : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)'),
            borderRadius: '12px',
            overflow: 'hidden',
            border: isHighContrast
              ? (isDark ? '1px solid #ffffff' : '1px solid #000000')
              : 'none',
            boxShadow: isHighContrast ? 'none' : (isDark ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)'),
          }}>
            {/* 高對比度 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '400',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  marginBottom: '2px',
                }}>
                  {getText('highContrast')}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                }}>
                  {getText('highContrastDesc')}
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.accessibility.highContrast}
                onChange={() => handleToggle('accessibility', 'highContrast')}
              />
            </div>

            {/* 字體大小設定 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
            }}>
              <div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '400',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  marginBottom: '2px',
                }}>
                  {getText('fontSize')}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                }}>
                  {getText('fontSizeDesc')}
                </div>
              </div>
              <button
                onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  fontSize: '17px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>
                  {tempSettings.accessibility.fontSize === 'small' ? getText('small') :
                   tempSettings.accessibility.fontSize === 'medium' ? getText('medium') :
                   tempSettings.accessibility.fontSize === 'large' ? getText('large') : getText('extraLarge')}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </button>
              
              {/* 字體大小選單 */}
              {showFontSizeMenu && (
                <div className="dropdown-menu" style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: isHighContrast
                    ? (isDark ? '#000000' : '#ffffff')
                    : (isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.98)'),
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  border: isHighContrast
                    ? (isDark ? '2px solid #ffffff' : '2px solid #000000')
                    : '2px solid rgba(0, 0, 0, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  zIndex: 99999,
                  overflow: 'visible',
                  width: '320px',
                  maxWidth: '90vw',
                  minHeight: 'auto',
                  maxHeight: '80vh',
                }}>
                  {[
                    { value: 'small', label: getText('small'), description: getText('smallDesc') },
                    { value: 'medium', label: getText('medium'), description: getText('mediumDesc') },
                    { value: 'large', label: getText('large'), description: getText('largeDesc') },
                    { value: 'extra-large', label: getText('extraLarge'), description: getText('extraLargeDesc') }
                  ].map((option, index) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        handleSelect('accessibility', 'fontSize', option.value);
                        setShowFontSizeMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: index < 3 ? (isHighContrast
                          ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                          : '0.5px solid rgba(0, 0, 0, 0.1)') : 'none',
                        color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                        fontSize: '17px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '500', marginBottom: '2px' }}>{option.label}</div>
                        <div style={{ 
                          fontSize: '13px', 
                          color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                          opacity: 0.8 
                        }}>
                          {option.description}
                        </div>
                      </div>
                      {tempSettings.accessibility.fontSize === option.value && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 語音導航 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '400',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  marginBottom: '2px',
                }}>
                  {getText('voiceNavigation')}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                }}>
                  {getText('voiceNavigationDesc')}
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.accessibility.voiceNavigation}
                onChange={() => handleToggle('accessibility', 'voiceNavigation')}
              />
            </div>

            {/* 減少動畫 */}
            <div style={{
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '400',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  marginBottom: '2px',
                }}>
                  {getText('reduceMotion')}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                }}>
                  {getText('reduceMotionDesc')}
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.accessibility.reduceMotion}
                onChange={() => handleToggle('accessibility', 'reduceMotion')}
              />
            </div>
          </div>
        </div>

        {/* 通知設定 */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '13px',
            fontWeight: '400',
            color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            通知
          </h2>
          
          <div style={{
            background: isHighContrast
              ? (isDark ? '#000000' : '#ffffff')
              : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)'),
            borderRadius: '12px',
            overflow: 'hidden',
            border: isHighContrast
              ? (isDark ? '1px solid #ffffff' : '1px solid #000000')
              : 'none',
            boxShadow: isHighContrast ? 'none' : (isDark ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)'),
          }}>
            {/* 健康提醒 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#FF9500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: '400',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                    marginBottom: '2px',
                  }}>
                    {getText('healthReminders')}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                  }}>
                    {getText('healthRemindersDesc')}
                  </div>
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.notifications.healthReminders}
                onChange={() => handleToggle('notifications', 'healthReminders')}
              />
            </div>

            {/* 用藥提醒 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#FF3B30',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4"></path>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: '400',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                    marginBottom: '2px',
                  }}>
                    {getText('medicationAlerts')}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                  }}>
                    {getText('medicationAlertsDesc')}
                  </div>
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.notifications.medicationAlerts}
                onChange={() => handleToggle('notifications', 'medicationAlerts')}
              />
            </div>

            {/* 預約提醒 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#007AFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: '400',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                    marginBottom: '2px',
                  }}>
                    {getText('appointmentReminders')}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                  }}>
                    {getText('appointmentRemindersDesc')}
                  </div>
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.notifications.appointmentReminders}
                onChange={() => handleToggle('notifications', 'appointmentReminders')}
              />
            </div>

            {/* 系統更新 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#8E8E93',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: '400',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                    marginBottom: '2px',
                  }}>
                    {getText('systemUpdates')}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                  }}>
                    {getText('systemUpdatesDesc')}
                  </div>
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.notifications.systemUpdates}
                onChange={() => handleToggle('notifications', 'systemUpdates')}
              />
            </div>

            {/* 緊急警報 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#FF2D92',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: '400',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                    marginBottom: '2px',
                  }}>
                    {getText('emergencyAlerts')}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                  }}>
                    {getText('emergencyAlertsDesc')}
                  </div>
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.notifications.emergencyAlerts}
                onChange={() => handleToggle('notifications', 'emergencyAlerts')}
              />
            </div>

            {/* 週報 */}
            <div style={{
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#34C759',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: '400',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                    marginBottom: '2px',
                  }}>
                    {getText('weeklyReports')}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                  }}>
                    {getText('weeklyReportsDesc')}
                  </div>
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.notifications.weeklyReports}
                onChange={() => handleToggle('notifications', 'weeklyReports')}
              />
            </div>
          </div>
        </div>

        {/* 健康管理區塊 */}
        <div style={{
          background: isHighContrast ? (isDark ? '#000000' : '#ffffff') : (isDark ? '#1c1c1e' : '#ffffff'),
          borderRadius: '12px',
          marginBottom: '20px',
          overflow: 'hidden',
          border: isHighContrast ? (isDark ? '1px solid #ffffff' : '1px solid #000000') : 'none',
          boxShadow: isHighContrast ? 'none' : (isDark ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)'),
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: isHighContrast
              ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
              : '0.5px solid rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/emergency-help')}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '500',
                color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#000000'),
                marginBottom: '2px',
              }}>
                緊急求助
              </div>
              <div style={{
                fontSize: '13px',
                color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
              }}>
                緊急聯絡人和醫療資訊管理
              </div>
            </div>
            <div style={{
              color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
              fontSize: '14px'
            }}>
              ›
            </div>
          </div>
          
          <div style={{
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => {
            console.log('=== 點擊提醒管理開始 ===');
            console.log('點擊提醒管理');
            console.log('當前URL:', window.location.href);
            console.log('當前路徑:', window.location.pathname);
            console.log('準備導航到: /reminder-management');
            alert('點擊提醒管理按鈕！');
            console.log('準備調用 navigate 函數');
            try {
              navigate('/reminder-management');
              console.log('導航函數已調用');
            } catch (error) {
              console.error('導航函數調用失敗:', error);
            }
            console.log('=== 點擊提醒管理結束 ===');
          }}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '500',
                color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#000000'),
                marginBottom: '2px',
              }}>
                提醒管理
              </div>
              <div style={{
                fontSize: '13px',
                color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
              }}>
                健康提醒和通知設定
              </div>
            </div>
            <div style={{
              color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
              fontSize: '14px'
            }}>
              ›
            </div>
          </div>
        </div>

        {/* 隱私與安全設定 */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '13px',
            fontWeight: '400',
            color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {getText('privacy')}
          </h2>
          
          <div style={{
            background: isHighContrast
              ? (isDark ? '#000000' : '#ffffff')
              : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)'),
            borderRadius: '12px',
            overflow: 'hidden',
            border: isHighContrast
              ? (isDark ? '1px solid #ffffff' : '1px solid #000000')
              : 'none',
            boxShadow: isHighContrast ? 'none' : (isDark ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)'),
          }}>
            {/* 數據分享 */}
            <div style={{
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '400',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  marginBottom: '2px',
                }}>
                  {getText('dataSharing')}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                }}>
                  {getText('dataSharingDesc')}
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.privacy.dataSharing}
                onChange={() => handleToggle('privacy', 'dataSharing')}
              />
            </div>

            {/* 位置服務 - 階段 1 重新開發 */}
            <div style={{
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#007AFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: '400',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                    marginBottom: '2px',
                  }}>
                    {getText('locationServices')}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                  }}>
                    {getText('locationServicesDesc')}
                  </div>
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.privacy.locationServices}
                onChange={() => handleToggle('privacy', 'locationServices')}
              />
            </div>

            {/* 崩潰報告 - 階段 2 重新開發 */}
            <div style={{
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#8E8E93',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: '400',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                    marginBottom: '2px',
                  }}>
                    {getText('crashReports')}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                  }}>
                    {getText('crashReportsDesc')}
                  </div>
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.privacy.crashReports}
                onChange={() => handleToggle('privacy', 'crashReports')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;