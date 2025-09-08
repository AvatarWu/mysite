// src/pages/Notifications.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

interface NotificationItem {
  id: string;
  type: 'medication' | 'health' | 'emergency' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationSettings {
  medication: boolean;
  healthReminder: boolean;
  dailyCheck: boolean;
  emergency: boolean;
  sound: boolean;
  vibration: boolean;
}

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'history' | 'settings'>('history');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'medication',
      title: '用藥提醒',
      message: '該服用血壓藥了 - 每日上午 9:00',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小時前
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'health',
      title: '血壓測量提醒',
      message: '記得測量並記錄今天的血壓數據',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6小時前
      read: true,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'medication',
      title: '用藥提醒',
      message: '該服用維他命D了 - 每日下午 2:00',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1天前
      read: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'reminder',
      title: '健康檢查提醒',
      message: '下週二有預約的健康檢查',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2天前
      read: true,
      priority: 'low'
    },
    {
      id: '5',
      type: 'emergency',
      title: '緊急聯絡人更新',
      message: '建議您更新緊急聯絡人資訊',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
      read: false,
      priority: 'high'
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    medication: true,
    healthReminder: true,
    dailyCheck: false,
    emergency: true,
    sound: true,
    vibration: true
  });

  const handleBack = () => {
    navigate('/');
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    if (window.confirm('確定要清除所有通知嗎？')) {
      setNotifications([]);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const handleSettingToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = diff / (1000 * 60 * 60);
    const days = diff / (1000 * 60 * 60 * 24);

    if (hours < 1) {
      return '剛剛';
    } else if (hours < 24) {
      return `${Math.floor(hours)} 小時前`;
    } else if (days < 7) {
      return `${Math.floor(days)} 天前`;
    } else {
      return timestamp.toLocaleDateString('zh-TW');
    }
  };

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'medication':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 3h12l4 6-8 11L2 9l4-6z"/>
            <path d="M6 7h12"/>
            <path d="M9 11h6"/>
          </svg>
        );
      case 'health':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3.5.5-5 1.5-1.5-1-3.24-1.5-5-1.5A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7 7-7z"/>
          </svg>
        );
      case 'emergency':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        );
      case 'reminder':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        );
    }
  };

  const getPriorityColor = (priority: NotificationItem['priority']) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-page">
      {/* 自定義導航欄 - Apple 風格 */}
      <header className="custom-header">
        <div className="header-content">
          <button onClick={handleBack} className="back-button" type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            返回
          </button>
          <h1 className="header-title">通知</h1>
          {unreadCount > 0 && (
            <div className="unread-badge">{unreadCount}</div>
          )}
        </div>
      </header>

      {/* 標籤切換 */}
      <div className="tab-container">
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
          通知歷史
        </button>
        <button 
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          通知設定
        </button>
      </div>

      {/* 主要內容區域 */}
      <main className="main-content">
        {activeTab === 'history' && (
          <div className="history-content">
            {/* 操作按鈕 */}
            {notifications.length > 0 && (
              <div className="action-bar">
                <button 
                  className="action-btn secondary"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  全部標記為已讀
                </button>
                <button 
                  className="action-btn danger"
                  onClick={clearAllNotifications}
                >
                  清除所有通知
                </button>
              </div>
            )}

            {/* 通知列表 */}
            <div className="notifications-list">
              {notifications.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 8a6 6 0 0 1 12 0c0 7-3 9-3 9H9s-3-2-3-9"/>
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                    </svg>
                  </div>
                  <h3 className="empty-title">沒有通知</h3>
                  <p className="empty-description">您目前沒有任何通知記錄</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div 
                      className="notification-icon"
                      style={{ color: getPriorityColor(notification.priority) }}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <h4 className="notification-title">{notification.title}</h4>
                        <span className="notification-time">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                      <p className="notification-message">{notification.message}</p>
                      <div className="notification-meta">
                        <span className={`priority-badge ${notification.priority}`}>
                          {notification.priority === 'high' && '高優先級'}
                          {notification.priority === 'medium' && '中優先級'}
                          {notification.priority === 'low' && '低優先級'}
                        </span>
                        {!notification.read && (
                          <span className="unread-indicator">未讀</span>
                        )}
                      </div>
                    </div>
                    <button 
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-content">
            <section className="settings-section">
              <h3 className="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7-3 9-3 9H9s-3-2-3-9"/>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                </svg>
                通知類型
              </h3>

              <div className="settings-group">
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-name">用藥提醒</div>
                    <div className="setting-desc">按時服藥的提醒通知</div>
                  </div>
                  <div 
                    className={`toggle-switch ${settings.medication ? 'active' : ''}`}
                    onClick={() => handleSettingToggle('medication')}
                  >
                    <div className="toggle-handle"></div>
                  </div>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-name">健康提醒</div>
                    <div className="setting-desc">記錄健康數據的提醒</div>
                  </div>
                  <div 
                    className={`toggle-switch ${settings.healthReminder ? 'active' : ''}`}
                    onClick={() => handleSettingToggle('healthReminder')}
                  >
                    <div className="toggle-handle"></div>
                  </div>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-name">每日檢查</div>
                    <div className="setting-desc">每日健康狀況檢查提醒</div>
                  </div>
                  <div 
                    className={`toggle-switch ${settings.dailyCheck ? 'active' : ''}`}
                    onClick={() => handleSettingToggle('dailyCheck')}
                  >
                    <div className="toggle-handle"></div>
                  </div>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-name">緊急通知</div>
                    <div className="setting-desc">緊急狀況相關通知</div>
                  </div>
                  <div 
                    className={`toggle-switch ${settings.emergency ? 'active' : ''}`}
                    onClick={() => handleSettingToggle('emergency')}
                  >
                    <div className="toggle-handle"></div>
                  </div>
                </div>
              </div>
            </section>

            <section className="settings-section">
              <h3 className="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11H1l6-6 6 6zm9 0V5l6 6-6 6V11zm-4 8c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"/>
                </svg>
                通知方式
              </h3>

              <div className="settings-group">
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-name">聲音提醒</div>
                    <div className="setting-desc">播放提醒音效</div>
                  </div>
                  <div 
                    className={`toggle-switch ${settings.sound ? 'active' : ''}`}
                    onClick={() => handleSettingToggle('sound')}
                  >
                    <div className="toggle-handle"></div>
                  </div>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-name">震動提醒</div>
                    <div className="setting-desc">設備震動提醒</div>
                  </div>
                  <div 
                    className={`toggle-switch ${settings.vibration ? 'active' : ''}`}
                    onClick={() => handleSettingToggle('vibration')}
                  >
                    <div className="toggle-handle"></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;
