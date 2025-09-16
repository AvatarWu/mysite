import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { Reminder } from './ReminderService';

/**
 * 通知服務
 * 處理本地通知的創建、管理和觸發
 */
export class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * 初始化通知服務
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('開始請求通知權限...');
      
      // 先檢查現有權限
      const currentPermission = await LocalNotifications.checkPermissions();
      console.log('當前通知權限狀態:', currentPermission);
      
      if (currentPermission.display === 'granted') {
        console.log('通知權限已授予');
        this.isInitialized = true;
        return;
      }
      
      // 請求通知權限
      const permission = await LocalNotifications.requestPermissions();
      console.log('通知權限請求結果:', permission);
      
      if (permission.display === 'granted') {
        console.log('通知權限已授予');
        this.isInitialized = true;
      } else {
        console.warn('通知權限被拒絕:', permission);
        // 即使權限被拒絕，也標記為已初始化，避免重複請求
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('初始化通知服務失敗:', error);
      // 即使出錯也標記為已初始化，避免重複請求
      this.isInitialized = true;
    }
  }

  /**
   * 檢查通知權限
   */
  public async checkPermissions(): Promise<boolean> {
    try {
      const permission = await LocalNotifications.checkPermissions();
      return permission.display === 'granted';
    } catch (error) {
      console.error('檢查通知權限失敗:', error);
      return false;
    }
  }

  /**
   * 請求通知權限
   */
  public async requestPermissions(): Promise<boolean> {
    try {
      const permission = await LocalNotifications.requestPermissions();
      return permission.display === 'granted';
    } catch (error) {
      console.error('請求通知權限失敗:', error);
      return false;
    }
  }

  /**
   * 創建提醒通知
   */
  public async createReminderNotification(reminder: Reminder): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const hasPermission = await this.checkPermissions();
    if (!hasPermission) {
      console.warn('沒有通知權限，無法創建通知');
      return;
    }

    try {
      // 計算下次觸發時間
      const nextTriggerTime = this.calculateNextTriggerTime(reminder);
      if (!nextTriggerTime) {
        console.warn('無法計算提醒觸發時間');
        return;
      }

      const notification: LocalNotificationSchema = {
        title: reminder.title,
        body: reminder.description,
        id: this.generateNotificationId(reminder._id),
        schedule: {
          at: nextTriggerTime
        },
        sound: 'default',
        attachments: [],
        actionTypeId: 'REMINDER_ACTION',
        extra: {
          reminderId: reminder._id,
          type: reminder.type,
          priority: reminder.priority
        }
      };

      await LocalNotifications.schedule({
        notifications: [notification]
      });

      console.log('提醒通知已創建:', reminder.title);
    } catch (error) {
      console.error('創建提醒通知失敗:', error);
    }
  }

  /**
   * 更新提醒通知
   */
  public async updateReminderNotification(reminder: Reminder): Promise<void> {
    // 先取消舊的通知
    await this.cancelReminderNotification(reminder._id);
    
    // 如果提醒啟用，創建新通知
    if (reminder.enabled) {
      await this.createReminderNotification(reminder);
    }
  }

  /**
   * 取消提醒通知
   */
  public async cancelReminderNotification(reminderId: string): Promise<void> {
    try {
      const notificationId = this.generateNotificationId(reminderId);
      await LocalNotifications.cancel({
        notifications: [{ id: notificationId }]
      });
      console.log('提醒通知已取消:', reminderId);
    } catch (error) {
      console.error('取消提醒通知失敗:', error);
    }
  }

  /**
   * 取消所有通知
   */
  public async cancelAllNotifications(): Promise<void> {
    try {
      // 獲取所有待處理的通知並取消它們
      const pending = await this.getPendingNotifications();
      if (pending.length > 0) {
        const ids = pending.map(n => n.id);
        await LocalNotifications.cancel({ notifications: ids.map(id => ({ id })) });
      }
      console.log('所有通知已取消');
    } catch (error) {
      console.error('取消所有通知失敗:', error);
    }
  }

  /**
   * 獲取待處理的通知
   */
  public async getPendingNotifications(): Promise<LocalNotificationSchema[]> {
    try {
      const result = await LocalNotifications.getPending();
      return result.notifications;
    } catch (error) {
      console.error('獲取待處理通知失敗:', error);
      return [];
    }
  }

  /**
   * 計算下次觸發時間
   */
  private calculateNextTriggerTime(reminder: Reminder): Date | null {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // 解析提醒時間
    const [hours, minutes] = reminder.time.split(':').map(Number);
    
    // 創建今天的提醒時間
    const reminderTime = new Date(today);
    reminderTime.setHours(hours, minutes, 0, 0);
    
    // 如果今天的提醒時間已過，檢查明天
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }
    
    // 檢查是否在靜音時間內
    if (this.isInQuietHours(reminderTime)) {
      // 如果是在靜音時間，移到靜音時間結束後
      const quietEnd = this.getQuietHoursEnd();
      if (quietEnd) {
        reminderTime.setHours(quietEnd.getHours(), quietEnd.getMinutes(), 0, 0);
      }
    }
    
    return reminderTime;
  }

  /**
   * 檢查是否在靜音時間內
   */
  private isInQuietHours(_time: Date): boolean {
    // 這裡應該從設定中獲取靜音時間
    // 暫時返回 false
    return false;
  }

  /**
   * 獲取靜音時間結束時間
   */
  private getQuietHoursEnd(): Date | null {
    // 這裡應該從設定中獲取靜音時間結束時間
    // 暫時返回 null
    return null;
  }

  /**
   * 生成通知 ID
   */
  private generateNotificationId(reminderId: string): number {
    // 使用提醒 ID 的哈希值作為通知 ID
    let hash = 0;
    for (let i = 0; i < reminderId.length; i++) {
      const char = reminderId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 轉換為 32 位整數
    }
    return Math.abs(hash);
  }

  /**
   * 創建健康提醒通知
   */
  public async createHealthReminderNotification(title: string, message: string, triggerTime: Date): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const hasPermission = await this.checkPermissions();
    if (!hasPermission) {
      console.warn('沒有通知權限，無法創建健康提醒通知');
      return;
    }

    try {
      const notification: LocalNotificationSchema = {
        title: title,
        body: message,
        id: Date.now(), // 使用時間戳作為 ID
        schedule: {
          at: triggerTime
        },
        sound: 'default',
        attachments: [],
        actionTypeId: 'HEALTH_REMINDER',
        extra: {
          type: 'health',
          priority: 'medium'
        }
      };

      await LocalNotifications.schedule({
        notifications: [notification]
      });

      console.log('健康提醒通知已創建:', title);
    } catch (error) {
      console.error('創建健康提醒通知失敗:', error);
    }
  }

  /**
   * 創建用藥提醒通知
   */
  public async createMedicationReminderNotification(medicationName: string, dosage: string, triggerTime: Date): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const hasPermission = await this.checkPermissions();
    if (!hasPermission) {
      console.warn('沒有通知權限，無法創建用藥提醒通知');
      return;
    }

    try {
      const notification: LocalNotificationSchema = {
        title: '用藥提醒',
        body: `該服用 ${medicationName} ${dosage} 了`,
        id: Date.now(),
        schedule: {
          at: triggerTime
        },
        sound: 'default',
        attachments: [],
        actionTypeId: 'MEDICATION_REMINDER',
        extra: {
          type: 'medication',
          priority: 'high',
          medicationName: medicationName,
          dosage: dosage
        }
      };

      await LocalNotifications.schedule({
        notifications: [notification]
      });

      console.log('用藥提醒通知已創建:', medicationName);
    } catch (error) {
      console.error('創建用藥提醒通知失敗:', error);
    }
  }

  /**
   * 創建緊急提醒通知
   */
  public async createEmergencyNotification(title: string, message: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const hasPermission = await this.checkPermissions();
    if (!hasPermission) {
      console.warn('沒有通知權限，無法創建緊急通知');
      return;
    }

    try {
      const notification: LocalNotificationSchema = {
        title: title,
        body: message,
        id: Date.now(),
        schedule: {
          at: new Date(Date.now() + 1000) // 1秒後觸發
        },
        sound: 'default',
        attachments: [],
        actionTypeId: 'EMERGENCY_ALERT',
        extra: {
          type: 'emergency',
          priority: 'urgent'
        }
      };

      await LocalNotifications.schedule({
        notifications: [notification]
      });

      console.log('緊急通知已創建:', title);
    } catch (error) {
      console.error('創建緊急通知失敗:', error);
    }
  }

  /**
   * 設置通知監聽器
   */
  public setupNotificationListeners(): void {
    // 監聽通知點擊事件
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      console.log('通知被點擊:', notification);
      this.handleNotificationClick(notification);
    });

    // 監聽通知接收事件
    LocalNotifications.addListener('localNotificationReceived', (notification) => {
      console.log('通知已接收:', notification);
    });
  }

  /**
   * 處理通知點擊事件
   */
  private handleNotificationClick(notification: any): void {
    const extra = notification.notification.extra;
    
    switch (extra?.actionTypeId) {
      case 'REMINDER_ACTION':
        console.log('提醒通知被點擊:', extra.reminderId);
        // 可以在這裡添加導航到提醒詳情的邏輯
        break;
      case 'HEALTH_REMINDER':
        console.log('健康提醒被點擊');
        // 可以在這裡添加導航到健康記錄的邏輯
        break;
      case 'MEDICATION_REMINDER':
        console.log('用藥提醒被點擊:', extra.medicationName);
        // 可以在這裡添加導航到用藥記錄的邏輯
        break;
      case 'EMERGENCY_ALERT':
        console.log('緊急通知被點擊');
        // 可以在這裡添加緊急處理邏輯
        break;
      default:
        console.log('未知通知類型被點擊');
    }
  }

  /**
   * 清理通知服務
   */
  public cleanup(): void {
    LocalNotifications.removeAllListeners();
  }
}

// 導出單例實例
export const notificationService = NotificationService.getInstance();
