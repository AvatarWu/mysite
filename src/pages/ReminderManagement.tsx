import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reminderService, Reminder, ReminderSettings } from '../services/ReminderService';
import './ReminderManagement.css';

// 添加錯誤邊界來捕獲導入錯誤
console.log('ReminderManagement 模組載入成功');

const ReminderManagement: React.FC = () => {
  console.log('ReminderManagement 組件渲染');
  
  try {
    console.log('ReminderManagement 組件初始化開始');
    const navigate = useNavigate();
    console.log('useNavigate 初始化成功');
    
    const [reminders, setReminders] = useState<Reminder[]>([]);
    console.log('reminders state 初始化成功');
    
    const [settings, setSettings] = useState<ReminderSettings>(() => {
      console.log('開始初始化 settings state');
      try {
        const settings = reminderService.getSettings();
        console.log('settings 載入成功:', settings);
        return settings;
      } catch (error) {
        console.error('settings 載入失敗:', error);
        return {
          healthReminders: true,
          medicationAlerts: true,
          appointmentReminders: true,
          systemUpdates: false,
          emergencyAlerts: true,
          weeklyReports: false,
          quietHours: { enabled: false, start: '22:00', end: '08:00' },
          soundEnabled: true,
          vibrationEnabled: true
        };
      }
    });
    console.log('settings state 初始化成功');
    
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    // 防止iOS鍵盤約束衝突 - 輕量版本
    useEffect(() => {
      if (showAddModal) {
        // 立即設置輸入欄位屬性
        const setupInputs = () => {
          const inputs = document.querySelectorAll('input, textarea, select');
          inputs.forEach(input => {
            const element = input as HTMLElement;
            element.setAttribute('inputAccessoryViewID', '');
            element.setAttribute('data-input-accessory-view-id', '');
            element.setAttribute('autocomplete', 'off');
            element.setAttribute('autocorrect', 'off');
            element.setAttribute('autocapitalize', 'off');
            element.setAttribute('spellcheck', 'false');
          });
        };

        // 立即執行
        setupInputs();
        
        // 監聽輸入焦點事件
        const handleFocus = (e: FocusEvent) => {
          const target = e.target as HTMLElement;
          if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
            target.setAttribute('inputAccessoryViewID', '');
            target.setAttribute('data-input-accessory-view-id', '');
          }
        };

        // 監聽觸摸開始事件
        const handleTouchStart = (e: TouchEvent) => {
          const target = e.target as HTMLElement;
          if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
            target.setAttribute('inputAccessoryViewID', '');
            target.setAttribute('data-input-accessory-view-id', '');
          }
        };

        document.addEventListener('focusin', handleFocus);
        document.addEventListener('touchstart', handleTouchStart);
        
        return () => {
          document.removeEventListener('focusin', handleFocus);
          document.removeEventListener('touchstart', handleTouchStart);
        };
      }
    }, [showAddModal]);
    
    console.log('ReminderManagement 組件初始化成功');

    useEffect(() => {
      const loadData = async () => {
        console.log('ReminderManagement useEffect 執行');
        try {
          console.log('開始載入提醒數據...');
          loadReminders();
          console.log('提醒數據載入完成，數量:', reminders.length);
          
          console.log('開始載入設定...');
          loadSettings();
          console.log('設定載入完成');
          
          // 強制創建/更新預設提醒
          const existingReminders = reminderService.getReminders();
          console.log('現有提醒數量:', existingReminders.length);
          console.log('強制更新預設提醒...');
          reminderService.createDefaultReminders();
          loadReminders();
          console.log('預設提醒更新完成');
          
          // 初始化通知服務
          console.log('開始初始化通知服務...');
          await reminderService.initializeNotifications();
          console.log('通知服務初始化完成');
          
          // 特別檢查測量血壓提醒
          const updatedReminders = reminderService.getReminders();
          const bloodPressureReminder = updatedReminders.find(r => r.title === '測量血壓');
          if (bloodPressureReminder) {
            console.log('測量血壓提醒詳細數據:', {
              title: bloodPressureReminder.title,
              days: bloodPressureReminder.days,
              daysLength: bloodPressureReminder.days.length,
              hasSunday: bloodPressureReminder.days.includes(0),
              hasSaturday: bloodPressureReminder.days.includes(6)
            });
          }
          console.log('useEffect 執行完成');
        } catch (error) {
          console.error('ReminderManagement useEffect 錯誤:', error);
          if (error instanceof Error) {
            console.error('錯誤堆疊:', error.stack);
          }
        }
      };

      loadData();
    }, []);

    const loadReminders = () => {
      setReminders(reminderService.getReminders());
    };

    const loadSettings = () => {
      setSettings(reminderService.getSettings());
    };

    const handleAddReminder = (reminderData: Omit<Reminder, '_id' | 'createdAt' | 'updatedAt'>) => {
      reminderService.addReminder(reminderData);
      loadReminders();
      setShowAddModal(false);
    };

    const handleUpdateReminder = (id: string, updates: Partial<Reminder>) => {
      reminderService.updateReminder(id, updates);
      loadReminders();
      setEditingReminder(null);
    };

    const handleDeleteReminder = (id: string) => {
      if (window.confirm('確定要刪除這個提醒嗎？')) {
        reminderService.deleteReminder(id);
        loadReminders();
      }
    };

    const handleToggleReminder = (id: string) => {
      const reminder = reminders.find(r => r._id === id);
      if (reminder) {
        handleUpdateReminder(id, { enabled: !reminder.enabled });
      }
    };

    const handleUpdateSettings = (updates: Partial<ReminderSettings>) => {
      reminderService.updateSettings(updates);
      setSettings({ ...settings, ...updates });
    };

    const getText = (key: string): string => {
      const texts: Record<string, Record<string, string>> = {
        'zh-TW': {
          reminderManagement: '提醒管理',
          addReminder: '新增提醒',
          reminderSettings: '提醒設定',
          healthReminders: '健康提醒',
          medicationAlerts: '用藥提醒',
          appointmentReminders: '預約提醒',
          emergencyAlerts: '緊急警報',
          weeklyReports: '週報',
          quietHours: '靜音時間',
          soundEnabled: '聲音提醒',
          vibrationEnabled: '震動提醒',
          back: '返回',
          edit: '編輯',
          delete: '刪除',
          enabled: '啟用',
          disabled: '停用',
          today: '今日',
          upcoming: '即將到來',
          noReminders: '暫無提醒',
          createFirstReminder: '創建您的第一個提醒',
          reminderType: '提醒類型',
          reminderTime: '提醒時間',
          reminderDays: '提醒日期',
          reminderPriority: '優先級',
          title: '標題',
          description: '描述',
          category: '分類',
          repeat: '重複',
          daily: '每日',
          weekly: '每週',
          monthly: '每月',
          once: '一次',
          low: '低',
          medium: '中',
          high: '高',
          urgent: '緊急',
          health: '健康',
          medication: '用藥',
          appointment: '預約',
          emergency: '緊急',
          custom: '自訂',
          save: '儲存',
          cancel: '取消',
          startTime: '開始時間',
          endTime: '結束時間',
          enabledStatus: '啟用',
          disabledStatus: '停用'
        }
      };

      const lang = localStorage.getItem('language') || 'zh-TW';
      return texts[lang]?.[key] || texts['zh-TW'][key] || key;
    };

    const getDayNames = (): string[] => {
      return ['日', '一', '二', '三', '四', '五', '六'];
    };

    // 將提醒的days數組（週一到週日：1,2,3,4,5,6,0）轉換為顯示索引（週日到週六：0,1,2,3,4,5,6）
    const getDisplayDays = (reminderDays: number[]): number[] => {
      return reminderDays.map(day => {
        // 週日(0) → 索引0，週一(1) → 索引1，...，週六(6) → 索引6
        return day;
      });
    };

    const getTypeIcon = (type: Reminder['type']): string => {
      switch (type) {
        case 'health': return '🏥';
        case 'medication': return '💊';
        case 'appointment': return '📅';
        case 'emergency': return '🚨';
        default: return '⏰';
      }
    };

    const getPriorityColor = (priority: Reminder['priority']): string => {
      switch (priority) {
        case 'low': return '#34c759';
        case 'medium': return '#ff9500';
        case 'high': return '#ff3b30';
        case 'urgent': return '#af52de';
        default: return '#8e8e93';
      }
    };

    console.log('ReminderManagement 組件返回渲染');
    console.log('當前狀態:', { reminders: reminders.length, settings, showAddModal, editingReminder, showSettingsModal });
    
    // 添加簡單的測試渲染
    if (reminders.length === 0 && !showAddModal && !showSettingsModal) {
      console.log('顯示空狀態');
    }
    
    // 添加錯誤邊界
    try {
      return (
        <div className="reminder-management-page">
        {/* 自定義標題欄 */}
        <header className="custom-header">
          <div className="header-content" style={{ position: 'relative', height: '44px', display: 'flex', alignItems: 'center' }}>
            {/* 返回按鈕 - 智能返回邏輯 */}
            <div 
              onClick={() => {
                // 檢查是否從設定頁面進入
                const referrer = document.referrer;
                const isFromSettings = referrer.includes('/settings') || 
                                     window.history.length > 1 && 
                                     document.referrer.includes('settings');
                
                if (isFromSettings) {
                  navigate('/settings');
                } else {
                  // 預設返回主頁
                  navigate('/');
                }
              }} 
              className="custom-back-btn"
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#000000',
                border: '1px solid #000000',
                color: '#ffffff',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '16px',
                fontWeight: '500',
                minWidth: '60px',
                minHeight: '44px',
                zIndex: 1001
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500' }}>返回</span>
            </div>
            
            {/* 標題 - 絕對定位在中央 */}
            <div 
              className="custom-title" 
              style={{ 
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#ffffff', 
                fontSize: '20px', 
                fontWeight: '600', 
                margin: '0',
                textAlign: 'center',
                backgroundColor: 'transparent',
                zIndex: 1000
              }}
            >
              {getText('reminderManagement')}
            </div>
            
            {/* 設定按鈕 - Apple 美學設計 */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="apple-settings-button"
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '20px',
                padding: '10px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                color: '#1d1d1f',
                fontSize: '17px',
                fontWeight: '600',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                letterSpacing: '-0.2px',
                minWidth: '60px',
                minHeight: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1001,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(0.95)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
              }}
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ marginRight: '6px' }}
              >
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              設定
            </button>
          </div>
        </header>

        {/* 主要內容 */}
        <main className="main-content">
          {/* 統計卡片 */}
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-number">{reminders.filter(r => r.enabled).length}</div>
              <div className="stat-label">啟用提醒</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{reminderService.getTodayReminders().length}</div>
              <div className="stat-label">今日提醒</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{reminderService.getUpcomingReminders().length}</div>
              <div className="stat-label">即將到來</div>
            </div>
          </div>

          {/* 提醒列表 */}
          <div className="reminders-section">
            <div className="section-header">
              <h2 className="section-title">我的提醒</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="add-button"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                {getText('addReminder')}
              </button>
            </div>

            {reminders.length === 0 ? (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z"/>
                </svg>
                <p>{getText('noReminders')}</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="create-button"
                >
                  {getText('createFirstReminder')}
                </button>
              </div>
            ) : (
              <div className="reminders-list">
                {reminders.map((reminder) => (
                  <div key={reminder._id} className={`reminder-card ${!reminder.enabled ? 'disabled' : ''}`}>
                    <div className="reminder-header">
                      <div className="reminder-icon">
                        {getTypeIcon(reminder.type)}
                      </div>
                      <div className="reminder-info">
                        <h3 className="reminder-title">{reminder.title}</h3>
                        <p className="reminder-description">{reminder.description}</p>
                        <div className="reminder-meta">
                          <span className="reminder-time">{reminder.time}</span>
                          <span className="reminder-category">{reminder.category}</span>
                          <span 
                            className="reminder-priority"
                            style={{ color: getPriorityColor(reminder.priority) }}
                          >
                            {getText(reminder.priority)}
                          </span>
                        </div>
                      </div>
                      <div className="reminder-actions">
                        <button
                          onClick={() => handleToggleReminder(reminder._id)}
                          className={`toggle-button ${reminder.enabled ? 'enabled' : 'disabled'}`}
                          title={reminder.enabled ? getText('disabledStatus') : getText('enabledStatus')}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {reminder.enabled ? (
                              <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z"/>
                            ) : (
                              <path d="M18 6L6 18M6 6l12 12"/>
                            )}
                          </svg>
                        </button>
                        <button
                          onClick={() => setEditingReminder(reminder)}
                          className="edit-button"
                          title={getText('edit')}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteReminder(reminder._id)}
                          className="delete-button"
                          title={getText('delete')}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="reminder-days">
                      {getDayNames().map((day, index) => {
                        const displayDays = getDisplayDays(reminder.days);
                        return (
                          <span
                            key={index}
                            className={`day-indicator ${displayDays.includes(index) ? 'active' : ''}`}
                          >
                            {day}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* 新增/編輯提醒模態框 */}
        {showAddModal && (
          <ReminderModal
            onSave={handleAddReminder}
            onCancel={() => setShowAddModal(false)}
            getText={getText}
          />
        )}

        {editingReminder && (
          <ReminderModal
            reminder={editingReminder}
            onSave={(updates) => handleUpdateReminder(editingReminder._id, updates)}
            onCancel={() => setEditingReminder(null)}
            getText={getText}
          />
        )}

        {/* 提醒設定模態框 */}
        {showSettingsModal && (
          <ReminderSettingsModal
            settings={settings}
            onSave={handleUpdateSettings}
            onCancel={() => setShowSettingsModal(false)}
            getText={getText}
          />
        )}
      </div>
      );
    } catch (error) {
      console.error('ReminderManagement 渲染錯誤:', error);
      if (error instanceof Error) {
        console.error('錯誤堆疊:', error.stack);
      }
      return (
        <div className="reminder-management-page">
          <div style={{ padding: '20px', textAlign: 'center', color: '#ffffff' }}>
            <h2>提醒管理</h2>
            <p>頁面載入時發生錯誤，請重新整理頁面。</p>
            <p>錯誤信息: {error instanceof Error ? error.message : String(error)}</p>
            <button 
              onClick={() => navigate('/settings')}
              style={{
                background: '#007AFF',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              返回設定
            </button>
          </div>
        </div>
      );
    }
  } catch (error) {
    console.error('ReminderManagement 組件初始化錯誤:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>組件初始化錯誤</h2>
        <p>錯誤: {error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
};

// 提醒模態框組件
interface ReminderModalProps {
  reminder?: Reminder;
  onSave: (reminder: Omit<Reminder, '_id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  getText: (key: string) => string;
}

  const ReminderModal: React.FC<ReminderModalProps> = ({ reminder, onSave, onCancel, getText }) => {
    const [formData, setFormData] = useState({
      title: reminder?.title || '',
      description: reminder?.description || '',
      type: reminder?.type || 'health' as Reminder['type'],
      time: reminder?.time || '08:00',
      days: reminder?.days || [1, 2, 3, 4, 5, 6, 0], // 每天
      enabled: reminder?.enabled ?? true,
      repeat: reminder?.repeat || 'daily' as Reminder['repeat'],
      category: reminder?.category || '',
      priority: reminder?.priority || 'medium' as Reminder['priority']
    });

    const [errors, setErrors] = useState<{[key: string]: string}>({});

    // 驗證輸入函數
    const validateInput = (value: string, fieldName: string): string => {
      // 檢查是否為空或只包含空格
      if (!value || value.trim() === '') {
        return `${fieldName}不能為空`;
      }
      
      // 檢查是否為無效值（不區分大小寫）
      const lowerValue = value.toLowerCase();
      if (lowerValue === 'null' || lowerValue === 'undefined' || lowerValue === 'nan') {
        return `${fieldName}不能為無效值`;
      }
      
      // 檢查是否包含特殊字符（只允許中文、英文、數字、空格、基本標點）
      const validPattern = /^[\u4e00-\u9fa5a-zA-Z0-9\s.,!?()-]+$/;
      if (!validPattern.test(value)) {
        return `${fieldName}包含無效字符，只允許中文、英文、數字和基本標點符號`;
      }
      
      // 檢查長度
      if (value.length > 50) {
        return `${fieldName}長度不能超過50個字符`;
      }
      
      return '';
    };

    // 處理輸入變化
    const handleInputChange = (field: string, value: string) => {
      // 檢查是否為無效值（不區分大小寫）
      const lowerValue = value.toLowerCase();
      const isInvalidValue = lowerValue === 'null' || lowerValue === 'undefined' || lowerValue === 'nan';
      
      if (isInvalidValue) {
        // 如果是無效值，設置錯誤並清空輸入
        setFormData(prev => ({ ...prev, [field]: '' }));
        setErrors(prev => ({ ...prev, [field]: `${field === 'title' ? '提醒標題' : '提醒描述'}不能為無效值` }));
      } else {
        // 正常輸入，更新數據並清除錯誤
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
          setErrors(prev => ({ ...prev, [field]: '' }));
        }
      }
    };

    // 處理輸入失焦驗證
    const handleInputBlur = (field: string, value: string) => {
      const error = validateInput(value, field === 'title' ? '提醒標題' : '提醒描述');
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    };

    // 防止iOS鍵盤約束衝突 - 簡化版本
    useEffect(() => {
      // 設置輸入欄位屬性
      const setupInputs = () => {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
          const element = input as HTMLElement;
          element.setAttribute('inputAccessoryViewID', '');
          element.setAttribute('data-input-accessory-view-id', '');
          element.setAttribute('autocomplete', 'off');
          element.setAttribute('autocorrect', 'off');
          element.setAttribute('autocapitalize', 'off');
          element.setAttribute('spellcheck', 'false');
        });
      };

      // 立即執行
      setupInputs();
      
      // 監聽輸入焦點事件
      const handleFocus = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
          target.setAttribute('inputAccessoryViewID', '');
          target.setAttribute('data-input-accessory-view-id', '');
        }
      };

      document.addEventListener('focusin', handleFocus);
      
      return () => {
        document.removeEventListener('focusin', handleFocus);
      };
    }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 驗證所有欄位
    const newErrors: {[key: string]: string} = {};
    
    const titleError = validateInput(formData.title, '提醒標題');
    if (titleError) {
      newErrors.title = titleError;
    }
    
    // 檢查是否有錯誤
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  const handleDayToggle = (day: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day].sort()
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{reminder ? getText('edit') : getText('addReminder')}</h3>
          <button onClick={onCancel} className="close-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">{getText('title')}</label>
            <input
              type="text"
              className={`form-input ${errors.title ? 'form-input-error' : ''}`}
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              onBlur={(e) => handleInputBlur('title', e.target.value)}
              placeholder="提醒標題"
              required
            />
            {errors.title && (
              <div className="form-error">{errors.title}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">{getText('reminderTime')}</label>
            <input
              type="time"
              className="form-input"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{getText('reminderDays')}</label>
            <div className="days-selector">
              {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
                <button
                  key={index}
                  type="button"
                  className={`day-button ${formData.days.includes(index) ? 'active' : ''}`}
                  onClick={() => handleDayToggle(index)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-button">
              {getText('cancel')}
            </button>
            <button type="submit" className="save-button">
              {getText('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 提醒設定模態框組件
interface ReminderSettingsModalProps {
  settings: ReminderSettings;
  onSave: (updates: Partial<ReminderSettings>) => void;
  onCancel: () => void;
  getText: (key: string) => string;
}

const ReminderSettingsModal: React.FC<ReminderSettingsModalProps> = ({ settings, onSave, onCancel, getText }) => {
  const [tempSettings, setTempSettings] = useState<ReminderSettings>(settings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('設定儲存按鈕被點擊', tempSettings);
    onSave(tempSettings);
  };

  return (
    <div className="apple-modal-overlay">
      <div className="apple-modal-content">
        <div className="apple-modal-header">
          <h3 className="apple-modal-title">{getText('reminderSettings')}</h3>
          <button onClick={onCancel} className="apple-close-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div className="apple-settings-content">
          {/* 健康提醒區塊 */}
          <div className="apple-setting-section">
            <div className="apple-setting-item">
              <div className="apple-setting-icon">🏥</div>
              <div className="apple-setting-info">
                <div className="apple-setting-title">{getText('healthReminders')}</div>
                <div className="apple-setting-desc">健康檢查提醒</div>
              </div>
              <div className="apple-toggle-container">
                <input
                  type="checkbox"
                  id="healthReminders"
                  className="apple-toggle"
                  checked={tempSettings.healthReminders}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, healthReminders: e.target.checked }))}
                />
                <label htmlFor="healthReminders" className="apple-toggle-label"></label>
              </div>
            </div>
          </div>

          {/* 用藥提醒區塊 */}
          <div className="apple-setting-section">
            <div className="apple-setting-item">
              <div className="apple-setting-icon">💊</div>
              <div className="apple-setting-info">
                <div className="apple-setting-title">{getText('medicationAlerts')}</div>
                <div className="apple-setting-desc">用藥提醒</div>
              </div>
              <div className="apple-toggle-container">
                <input
                  type="checkbox"
                  id="medicationAlerts"
                  className="apple-toggle"
                  checked={tempSettings.medicationAlerts}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, medicationAlerts: e.target.checked }))}
                />
                <label htmlFor="medicationAlerts" className="apple-toggle-label"></label>
              </div>
            </div>
          </div>

          {/* 預約提醒區塊 */}
          <div className="apple-setting-section">
            <div className="apple-setting-item">
              <div className="apple-setting-icon">📅</div>
              <div className="apple-setting-info">
                <div className="apple-setting-title">{getText('appointmentReminders')}</div>
                <div className="apple-setting-desc">預約提醒</div>
              </div>
              <div className="apple-toggle-container">
                <input
                  type="checkbox"
                  id="appointmentReminders"
                  className="apple-toggle"
                  checked={tempSettings.appointmentReminders}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, appointmentReminders: e.target.checked }))}
                />
                <label htmlFor="appointmentReminders" className="apple-toggle-label"></label>
              </div>
            </div>
          </div>

          {/* 緊急警報區塊 */}
          <div className="apple-setting-section">
            <div className="apple-setting-item">
              <div className="apple-setting-icon">🚨</div>
              <div className="apple-setting-info">
                <div className="apple-setting-title">{getText('emergencyAlerts')}</div>
                <div className="apple-setting-desc">緊急警報</div>
              </div>
              <div className="apple-toggle-container">
                <input
                  type="checkbox"
                  id="emergencyAlerts"
                  className="apple-toggle"
                  checked={tempSettings.emergencyAlerts}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, emergencyAlerts: e.target.checked }))}
                />
                <label htmlFor="emergencyAlerts" className="apple-toggle-label"></label>
              </div>
            </div>
          </div>

          {/* 靜音時間設定區塊 */}
          <div className="apple-setting-section">
            <div className="apple-setting-item">
              <div className="apple-setting-icon">🔇</div>
              <div className="apple-setting-info">
                <div className="apple-setting-title">{getText('quietHours')}</div>
                <div className="apple-setting-desc">靜音時間設定</div>
              </div>
              <div className="apple-toggle-container">
                <input
                  type="checkbox"
                  id="quietHours"
                  className="apple-toggle"
                  checked={tempSettings.quietHours.enabled}
                  onChange={(e) => setTempSettings(prev => ({ 
                    ...prev, 
                    quietHours: { ...prev.quietHours, enabled: e.target.checked }
                  }))}
                />
                <label htmlFor="quietHours" className="apple-toggle-label"></label>
              </div>
            </div>

            {tempSettings.quietHours.enabled && (
              <div className="apple-time-settings">
                <div className="apple-time-group">
                  <label className="apple-time-label">{getText('startTime')}</label>
                  <input
                    type="time"
                    className="apple-time-input"
                    value={tempSettings.quietHours.start}
                    onChange={(e) => setTempSettings(prev => ({ 
                      ...prev, 
                      quietHours: { ...prev.quietHours, start: e.target.value }
                    }))}
                  />
                </div>
                <div className="apple-time-group">
                  <label className="apple-time-label">{getText('endTime')}</label>
                  <input
                    type="time"
                    className="apple-time-input"
                    value={tempSettings.quietHours.end}
                    onChange={(e) => setTempSettings(prev => ({ 
                      ...prev, 
                      quietHours: { ...prev.quietHours, end: e.target.value }
                    }))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 聲音設定區塊 */}
          <div className="apple-setting-section">
            <div className="apple-setting-item">
              <div className="apple-setting-icon">🔊</div>
              <div className="apple-setting-info">
                <div className="apple-setting-title">聲音提醒</div>
                <div className="apple-setting-desc">啟用聲音通知</div>
              </div>
              <div className="apple-toggle-container">
                <input
                  type="checkbox"
                  id="soundEnabled"
                  className="apple-toggle"
                  checked={tempSettings.soundEnabled}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, soundEnabled: e.target.checked }))}
                />
                <label htmlFor="soundEnabled" className="apple-toggle-label"></label>
              </div>
            </div>
          </div>

          {/* 震動設定區塊 */}
          <div className="apple-setting-section">
            <div className="apple-setting-item">
              <div className="apple-setting-icon">📳</div>
              <div className="apple-setting-info">
                <div className="apple-setting-title">震動提醒</div>
                <div className="apple-setting-desc">啟用震動通知</div>
              </div>
              <div className="apple-toggle-container">
                <input
                  type="checkbox"
                  id="vibrationEnabled"
                  className="apple-toggle"
                  checked={tempSettings.vibrationEnabled}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, vibrationEnabled: e.target.checked }))}
                />
                <label htmlFor="vibrationEnabled" className="apple-toggle-label"></label>
              </div>
            </div>
          </div>
        </div>

        <div className="apple-modal-actions">
          <button onClick={onCancel} className="apple-cancel-button">
            {getText('cancel')}
          </button>
          <button onClick={handleSave} className="apple-save-button">
            {getText('save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderManagement;
