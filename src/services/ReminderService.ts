import { notificationService } from './NotificationService';

export interface Reminder {
  _id: string;
  title: string;
  description: string;
  type: 'health' | 'medication' | 'appointment' | 'emergency' | 'custom';
  time: string; // HH:MM format
  days: number[]; // 0-6 (Sunday-Saturday)
  enabled: boolean;
  repeat: 'daily' | 'weekly' | 'monthly' | 'once';
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
}

export interface ReminderSettings {
  healthReminders: boolean;
  medicationAlerts: boolean;
  appointmentReminders: boolean;
  systemUpdates: boolean;
  emergencyAlerts: boolean;
  weeklyReports: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM
    end: string; // HH:MM
  };
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

class ReminderService {
  private reminders: Reminder[] = [];
  private settings: ReminderSettings = {
    healthReminders: true,
    medicationAlerts: true,
    appointmentReminders: true,
    systemUpdates: false,
    emergencyAlerts: true,
    weeklyReports: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    soundEnabled: true,
    vibrationEnabled: true
  };

  constructor() {
    this.loadReminders();
    this.loadSettings();
  }

  // 載入提醒列表
  private loadReminders(): void {
    try {
      const saved = localStorage.getItem('reminders');
      if (saved) {
        this.reminders = JSON.parse(saved);
      }
    } catch (error) {
      console.error('載入提醒失敗:', error);
      this.reminders = [];
    }
  }

  // 載入提醒設定
  private loadSettings(): void {
    try {
      const saved = localStorage.getItem('reminderSettings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('載入提醒設定失敗:', error);
    }
  }

  // 保存提醒列表
  private saveReminders(): void {
    try {
      localStorage.setItem('reminders', JSON.stringify(this.reminders));
    } catch (error) {
      console.error('保存提醒失敗:', error);
    }
  }

  // 保存提醒設定
  private saveSettings(): void {
    try {
      localStorage.setItem('reminderSettings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('保存提醒設定失敗:', error);
    }
  }

  // 獲取所有提醒
  getReminders(): Reminder[] {
    return [...this.reminders];
  }

  // 獲取提醒設定
  getSettings(): ReminderSettings {
    return { ...this.settings };
  }

  // 添加提醒
  addReminder(reminder: Omit<Reminder, '_id' | 'createdAt' | 'updatedAt'>): Reminder {
    const newReminder: Reminder = {
      ...reminder,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.reminders.push(newReminder);
    this.saveReminders();
    this.scheduleNotification(newReminder);
    return newReminder;
  }

  // 更新提醒
  updateReminder(id: string, updates: Partial<Reminder>): boolean {
    const index = this.reminders.findIndex(r => r._id === id);
    if (index === -1) return false;

    this.reminders[index] = {
      ...this.reminders[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveReminders();
    this.scheduleNotification(this.reminders[index]);
    return true;
  }

  // 刪除提醒
  deleteReminder(id: string): boolean {
    const index = this.reminders.findIndex(r => r._id === id);
    if (index === -1) return false;

    this.reminders.splice(index, 1);
    this.saveReminders();
    this.cancelNotification(id);
    return true;
  }

  // 更新提醒設定
  updateSettings(updates: Partial<ReminderSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.saveSettings();
  }

  // 檢查是否在靜音時間
  isQuietHours(): boolean {
    if (!this.settings.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const startTime = this.parseTime(this.settings.quietHours.start);
    const endTime = this.parseTime(this.settings.quietHours.end);

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  // 解析時間字串
  private parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }



  // 獲取今日提醒
  getTodayReminders(): Reminder[] {
    const today = new Date().getDay();
    return this.reminders.filter(reminder => 
      reminder.enabled && 
      reminder.days.includes(today)
    );
  }

  // 獲取即將到來的提醒
  getUpcomingReminders(hours: number = 24): Reminder[] {
    const now = new Date();
    const upcoming = new Date(now.getTime() + hours * 60 * 60 * 1000);
    
    return this.reminders.filter(reminder => {
      if (!reminder.enabled) return false;
      
      const reminderTime = this.parseTime(reminder.time);
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      return reminderTime > currentTime && reminderTime <= upcoming.getHours() * 60 + upcoming.getMinutes();
    });
  }

  // 創建預設提醒
  createDefaultReminders(): void {
    const defaultReminders: Omit<Reminder, '_id' | 'createdAt' | 'updatedAt'>[] = [
      {
        title: '測量血壓',
        description: '記得測量今天的血壓',
        type: 'health',
        time: '08:00',
        days: [1, 2, 3, 4, 5, 6, 0], // 每天
        enabled: true,
        repeat: 'daily',
        category: '健康檢查',
        priority: 'medium'
      },
      {
        title: '測量血糖',
        description: '記得測量今天的血糖',
        type: 'health',
        time: '09:00',
        days: [1, 2, 3, 4, 5, 6, 0], // 每天
        enabled: true,
        repeat: 'daily',
        category: '健康檢查',
        priority: 'high'
      },
      {
        title: '記錄體重',
        description: '記得記錄今天的體重',
        type: 'health',
        time: '07:00',
        days: [1, 2, 3, 4, 5, 6, 0], // 每天
        enabled: true,
        repeat: 'daily',
        category: '健康檢查',
        priority: 'low'
      }
    ];

    // 強制更新所有預設提醒
    defaultReminders.forEach(defaultReminder => {
      const existingIndex = this.reminders.findIndex(r => 
        r.title === defaultReminder.title && 
        r.type === defaultReminder.type
      );
      
      if (existingIndex === -1) {
        // 不存在，添加新的
        this.addReminder(defaultReminder);
      } else {
        // 存在，強制更新為新的預設值
        this.reminders[existingIndex] = {
          ...this.reminders[existingIndex],
          days: [...defaultReminder.days], // 強制更新days數組
          description: defaultReminder.description,
          time: defaultReminder.time,
          category: defaultReminder.category,
          priority: defaultReminder.priority,
          updatedAt: new Date().toISOString()
        };
      }
    });
    
    // 保存所有更新
    this.saveReminders();
  }

  // 調度通知
  private async scheduleNotification(reminder: Reminder): Promise<void> {
    if (!reminder.enabled) {
      await notificationService.cancelReminderNotification(reminder._id);
      return;
    }

    try {
      await notificationService.createReminderNotification(reminder);
    } catch (error) {
      console.error('調度提醒通知失敗:', error);
    }
  }

  // 取消通知
  private async cancelNotification(reminderId: string): Promise<void> {
    try {
      await notificationService.cancelReminderNotification(reminderId);
    } catch (error) {
      console.error('取消提醒通知失敗:', error);
    }
  }

  // 初始化通知服務
  public async initializeNotifications(): Promise<void> {
    try {
      await notificationService.initialize();
      notificationService.setupNotificationListeners();
      
      // 為所有啟用的提醒調度通知
      const enabledReminders = this.reminders.filter(r => r.enabled);
      for (const reminder of enabledReminders) {
        await this.scheduleNotification(reminder);
      }
    } catch (error) {
      console.error('初始化通知服務失敗:', error);
    }
  }

  // 創建健康提醒通知
  public async createHealthReminder(title: string, message: string, triggerTime: Date): Promise<void> {
    try {
      await notificationService.createHealthReminderNotification(title, message, triggerTime);
    } catch (error) {
      console.error('創建健康提醒失敗:', error);
    }
  }

  // 創建用藥提醒通知
  public async createMedicationReminder(medicationName: string, dosage: string, triggerTime: Date): Promise<void> {
    try {
      await notificationService.createMedicationReminderNotification(medicationName, dosage, triggerTime);
    } catch (error) {
      console.error('創建用藥提醒失敗:', error);
    }
  }

  // 創建緊急通知
  public async createEmergencyNotification(title: string, message: string): Promise<void> {
    try {
      await notificationService.createEmergencyNotification(title, message);
    } catch (error) {
      console.error('創建緊急通知失敗:', error);
    }
  }
}

export const reminderService = new ReminderService();
