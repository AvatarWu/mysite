// 主題服務 - 統一管理所有頁面的主題應用
export class ThemeService {
  private static instance: ThemeService;
  private mediaQuery: MediaQueryList;
  private listeners: Array<() => void> = [];

  private constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  }

  public static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }

  // 應用主題到頁面
  public applyTheme(): void {
    const savedSettings = localStorage.getItem('careold-settings');
    console.log('ThemeService: 開始應用主題，設定:', savedSettings);
    
    let isDark = false;
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        const theme = settings.general?.appearance || 'auto';
        console.log('ThemeService: 檢測到主題設定:', theme);
        
        if (theme === 'dark') {
          isDark = true;
        } else if (theme === 'light') {
          isDark = false;
        } else {
          // 自動模式 - 檢測系統主題
          isDark = this.mediaQuery.matches;
          console.log('ThemeService: 自動模式檢測到系統主題偏好:', isDark ? 'dark' : 'light');
        }
      } catch (error) {
        console.error('解析設定失敗:', error);
        // 解析失敗時，檢測系統主題
        isDark = this.mediaQuery.matches;
      }
    } else {
      // 沒有設定時，檢測系統主題
      isDark = this.mediaQuery.matches;
      console.log('ThemeService: 沒有找到設定，檢測系統主題:', isDark ? 'dark' : 'light');
    }
    
    // 應用主題
    this.setTheme(isDark);
  }

  // 設置主題
  private setTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.setAttribute('data-theme', 'dark');
      document.documentElement.style.setProperty('--theme-bg', 'linear-gradient(135deg, #2d1b0e 0%, #3d2815 20%, #4d331c 40%, #5d3e23 60%, #6d492a 80%, #7d5431 100%)');
      document.documentElement.style.setProperty('--theme-text', '#ffffff');
      document.documentElement.style.setProperty('--theme-card-bg', 'rgba(255, 255, 255, 0.1)');
      document.documentElement.style.setProperty('--theme-card-border', '1px solid rgba(255, 255, 255, 0.1)');
      document.documentElement.style.setProperty('--theme-card-shadow', '0 2px 8px rgba(0, 0, 0, 0.3)');
      document.documentElement.style.setProperty('--theme-text-secondary', 'rgba(255, 255, 255, 0.7)');
      console.log('ThemeService: 應用深色主題');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.setAttribute('data-theme', 'light');
      document.documentElement.style.setProperty('--theme-bg', 'linear-gradient(135deg, #fff8f0 0%, #ffe8d6 20%, #ffd4b3 40%, #ffc49b 60%, #ffb380 80%, #ffa366 100%)');
      document.documentElement.style.setProperty('--theme-text', '#1d1d1f');
      document.documentElement.style.setProperty('--theme-card-bg', 'rgba(255, 255, 255, 0.8)');
      document.documentElement.style.setProperty('--theme-card-border', '1px solid rgba(0, 0, 0, 0.1)');
      document.documentElement.style.setProperty('--theme-card-shadow', '0 2px 8px rgba(0, 0, 0, 0.1)');
      document.documentElement.style.setProperty('--theme-text-secondary', '#666666');
      console.log('ThemeService: 應用淺色主題');
    }
    
    // 通知所有監聽器
    this.listeners.forEach(listener => listener());
  }

  // 監聽主題變更
  public onThemeChange(callback: () => void): () => void {
    this.listeners.push(callback);
    
    // 返回清理函數
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // 監聽系統主題變更
  public onSystemThemeChange(_callback: () => void): () => void {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      console.log('ThemeService: 系統主題變更:', e.matches ? 'dark' : 'light');
      // 只有在自動模式下才響應系統主題變更
      const savedSettings = localStorage.getItem('careold-settings');
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          if (settings.general?.appearance === 'auto') {
            this.applyTheme();
          }
        } catch (error) {
          console.error('解析設定失敗:', error);
        }
      } else {
        this.applyTheme();
      }
    };
    
    this.mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    // 返回清理函數
    return () => {
      this.mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }

  // 獲取當前主題
  public getCurrentTheme(): 'light' | 'dark' {
    return document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light';
  }

  // 檢查是否為深色模式
  public isDarkMode(): boolean {
    return this.getCurrentTheme() === 'dark';
  }
}

export const themeService = ThemeService.getInstance();
