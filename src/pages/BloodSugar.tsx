import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BloodSugar.css';
import { healthDataService } from '../services/HealthDataService';

interface BloodSugarRecord {
  id: string;
  value: number;
  unit: string;
  date: string;
  time: string;
  note?: string;
  status: 'normal' | 'high' | 'low';
}

const BloodSugar: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<BloodSugarRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // 多語言函數
  const getText = (key: string) => {
    const savedSettings = localStorage.getItem('careold-settings');
    let language = 'zh-TW';
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        language = settings.general?.language || 'zh-TW';
      } catch (error) {
        console.error('讀取語言設定失敗:', error);
      }
    }
    
    const texts = {
      'zh-TW': {
        'back': '返回',
        'bloodSugarManagement': '血糖管理',
        'add': '新增',
        'averageBloodSugar': '平均血糖',
        'recordCount': '記錄數量',
        'mgdL': 'mg/dL',
        'records': '筆',
        'latestStatus': '最新狀態',
        'lowBloodSugar': '低血糖',
        'normal': '正常',
        'high': '偏高',
        'highBloodSugar': '高血糖',
        'bloodSugarRecords': '血糖記錄',
        'loading': '載入中...',
        'noBloodSugarRecords': '尚無血糖記錄',
        'addFirstBloodSugarRecord': '點擊右上角「新增」按鈕開始記錄',
        'addBloodSugarRecord': '新增血糖記錄',
        'beforeBreakfast': '早餐前',
        'afterLunch2h': '午餐後2小時',
        'edit': '編輯',
        'delete': '刪除',
        'notes': '備註',
        'confirmDelete': '確定要刪除這筆記錄嗎？',
        'deleteFailed': '刪除失敗，請重試',
        'loadFailed': '載入血糖記錄失敗'
      },
      'zh-CN': {
        'back': '返回',
        'bloodSugarManagement': '血糖管理',
        'add': '新增',
        'averageBloodSugar': '平均血糖',
        'recordCount': '记录数量',
        'mgdL': 'mg/dL',
        'records': '笔',
        'latestStatus': '最新状态',
        'lowBloodSugar': '低血糖',
        'normal': '正常',
        'high': '偏高',
        'highBloodSugar': '高血糖',
        'bloodSugarRecords': '血糖记录',
        'loading': '载入中...',
        'noBloodSugarRecords': '尚无血糖记录',
        'addFirstBloodSugarRecord': '点击右上角「新增」按钮开始记录',
        'addBloodSugarRecord': '新增血糖记录',
        'beforeBreakfast': '早餐前',
        'afterLunch2h': '午餐后2小时',
        'edit': '编辑',
        'delete': '删除',
        'notes': '备注',
        'confirmDelete': '确定要删除这笔记录吗？',
        'deleteFailed': '删除失败，请重试',
        'loadFailed': '载入血糖记录失败'
      },
      'en': {
        'back': 'Back',
        'bloodSugarManagement': 'Blood Sugar Management',
        'add': 'Add',
        'averageBloodSugar': 'Average Blood Sugar',
        'recordCount': 'Record Count',
        'mgdL': 'mg/dL',
        'records': 'records',
        'latestStatus': 'Latest Status',
        'lowBloodSugar': 'Low Blood Sugar',
        'normal': 'Normal',
        'high': 'High',
        'highBloodSugar': 'High Blood Sugar',
        'bloodSugarRecords': 'Blood Sugar Records',
        'loading': 'Loading...',
        'noBloodSugarRecords': 'No blood sugar records',
        'addFirstBloodSugarRecord': 'Click the "Add" button in the top right to start recording',
        'addBloodSugarRecord': 'Add Blood Sugar Record',
        'beforeBreakfast': 'Before Breakfast',
        'afterLunch2h': '2 Hours After Lunch',
        'edit': 'Edit',
        'delete': 'Delete',
        'notes': 'Notes',
        'confirmDelete': 'Are you sure you want to delete this record?',
        'deleteFailed': 'Delete failed, please try again',
        'loadFailed': 'Failed to load blood sugar records'
      },
      'ja': {
        'back': '戻る',
        'bloodSugarManagement': '血糖管理',
        'add': '追加',
        'averageBloodSugar': '平均血糖',
        'recordCount': '記録数',
        'mgdL': 'mg/dL',
        'records': '記録',
        'latestStatus': '最新状態',
        'lowBloodSugar': '低血糖',
        'normal': '正常',
        'high': '高い',
        'highBloodSugar': '高血糖',
        'bloodSugarRecords': '血糖記録',
        'loading': '読み込み中...',
        'noBloodSugarRecords': '血糖記録がありません',
        'addFirstBloodSugarRecord': '右上の「追加」ボタンをクリックして記録を開始',
        'addBloodSugarRecord': '血糖記録を追加',
        'beforeBreakfast': '朝食前',
        'afterLunch2h': '昼食後2時間',
        'edit': '編集',
        'delete': '削除',
        'notes': 'メモ',
        'confirmDelete': 'この記録を削除してもよろしいですか？',
        'deleteFailed': '削除に失敗しました。再試行してください',
        'loadFailed': '血糖記録の読み込みに失敗しました'
      }
    };
    
    return (texts as any)[language]?.[key] || (texts as any)['zh-TW'][key] || key;
  };

  // 應用主題到頁面
  useEffect(() => {
    const applyTheme = () => {
      const savedSettings = localStorage.getItem('careold-settings');
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          const theme = settings.general?.appearance || 'auto';
          
          if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.setAttribute('data-theme', 'dark');
            document.documentElement.style.setProperty('--theme-bg', 'linear-gradient(135deg, #2d1b0e 0%, #3d2815 20%, #4d331c 40%, #5d3e23 60%, #6d492a 80%, #7d5431 100%)');
            document.documentElement.style.setProperty('--theme-text', '#ffffff');
          } else if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.setAttribute('data-theme', 'light');
            document.documentElement.style.setProperty('--theme-bg', 'linear-gradient(135deg, #fff8f0 0%, #ffe8d6 20%, #ffd4b3 40%, #ffc49b 60%, #ffb380 80%, #ffa366 100%)');
            document.documentElement.style.setProperty('--theme-text', '#1d1d1f');
          } else {
            // 自動模式
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
              document.documentElement.setAttribute('data-theme', 'dark');
              document.body.setAttribute('data-theme', 'dark');
              document.documentElement.style.setProperty('--theme-bg', 'linear-gradient(135deg, #2d1b0e 0%, #3d2815 20%, #4d331c 40%, #5d3e23 60%, #6d492a 80%, #7d5431 100%)');
              document.documentElement.style.setProperty('--theme-text', '#ffffff');
            } else {
              document.documentElement.setAttribute('data-theme', 'light');
              document.body.setAttribute('data-theme', 'light');
              document.documentElement.style.setProperty('--theme-bg', 'linear-gradient(135deg, #fff8f0 0%, #ffe8d6 20%, #ffd4b3 40%, #ffc49b 60%, #ffb380 80%, #ffa366 100%)');
              document.documentElement.style.setProperty('--theme-text', '#1d1d1f');
            }
          }
        } catch (error) {
          console.error('應用主題失敗:', error);
        }
      }
    };

    applyTheme();

    // 監聽主題變更事件
    const handleThemeChange = (event: CustomEvent) => {
      console.log('BloodSugar.tsx: 收到主題變更事件:', event.detail);
      // 直接應用主題，不重新讀取localStorage
      const theme = event.detail.theme;
      const isDark = event.detail.isDark;
      
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.setAttribute('data-theme', 'dark');
        document.documentElement.style.setProperty('--theme-bg', 'linear-gradient(135deg, #2d1b0e 0%, #3d2815 20%, #4d331c 40%, #5d3e23 60%, #6d492a 80%, #7d5431 100%)');
        document.documentElement.style.setProperty('--theme-text', '#ffffff');
      } else if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.setAttribute('data-theme', 'light');
        document.documentElement.style.setProperty('--theme-bg', 'linear-gradient(135deg, #fff8f0 0%, #ffe8d6 20%, #ffd4b3 40%, #ffc49b 60%, #ffb380 80%, #ffa366 100%)');
        document.documentElement.style.setProperty('--theme-text', '#1d1d1f');
      } else if (theme === 'auto') {
        if (isDark) {
          document.documentElement.setAttribute('data-theme', 'dark');
          document.body.setAttribute('data-theme', 'dark');
          document.documentElement.style.setProperty('--theme-bg', 'linear-gradient(135deg, #2d1b0e 0%, #3d2815 20%, #4d331c 40%, #5d3e23 60%, #6d492a 80%, #7d5431 100%)');
          document.documentElement.style.setProperty('--theme-text', '#ffffff');
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
          document.body.setAttribute('data-theme', 'light');
          document.documentElement.style.setProperty('--theme-bg', 'linear-gradient(135deg, #fff8f0 0%, #ffe8d6 20%, #ffd4b3 40%, #ffc49b 60%, #ffb380 80%, #ffa366 100%)');
          document.documentElement.style.setProperty('--theme-text', '#1d1d1f');
        }
      }
    };
    
    const handleLanguageChange = (_event: CustomEvent) => {
      // 重新載入頁面以應用語言變更
      window.location.reload();
    };
    
    window.addEventListener('themeChanged', handleThemeChange as EventListener);
    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  useEffect(() => {
    loadRecords();
    
    // 監聽頁面可見性變化，當頁面重新可見時重新載入數據
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('頁面重新可見，重新載入血糖記錄');
        loadRecords();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await healthDataService.getBloodSugarRecords();
      // 轉換數據格式以匹配組件期望的格式
      const formattedRecords = data.map((record: any) => ({
        id: record._id || record.id,
        value: record.value,
        unit: record.unit,
        date: record.date,
        time: record.time || '00:00',
        note: record.note || record.notes,
        status: record.status || getBloodSugarStatus(record.value).status
      }));
      setRecords(formattedRecords);
      console.log('載入血糖記錄:', formattedRecords);
    } catch (error) {
      console.error(getText('loadFailed'), error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRecord = (record: BloodSugarRecord) => {
    navigate(`/blood-sugar/edit/${record.id}`);
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm(getText('confirmDelete'))) {
      try {
        await healthDataService.deleteBloodSugarRecord(id);
        await loadRecords(); // 重新載入記錄
        console.log('刪除血糖記錄成功:', id);
      } catch (error) {
        console.error('刪除記錄失敗:', error);
        alert(getText('deleteFailed'));
      }
    }
  };

  const getBloodSugarStatus = (value: number) => {
    if (value < 70) {
      return { status: getText('lowBloodSugar'), color: '#FF9500', icon: '⚠️' };
    } else if (value <= 140) {
      return { status: getText('normal'), color: '#34C759', icon: '✅' };
    } else if (value <= 200) {
      return { status: getText('high'), color: '#FF9500', icon: '⚠️' };
    } else {
      return { status: getText('highBloodSugar'), color: '#FF3B30', icon: '🔴' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      month: 'numeric',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getStatistics = () => {
    if (records.length === 0) return null;
    
    const avgValue = Math.round(records.reduce((sum, r) => sum + r.value, 0) / records.length);
    const latestRecord = records[0];
    const latestStatus = getBloodSugarStatus(latestRecord.value);
    
    return {
      avgValue,
      latestStatus
    };
  };

  const statistics = getStatistics();

  return (
    <div className="blood-sugar-page" style={{ minHeight: '100vh' }}>
      {/* 自定義導航欄 - Apple 風格 */}
      <header className="custom-header">
        <div className="header-content">
          <div 
            onClick={() => navigate('/')} 
            className="custom-back-btn"
            style={{
              color: '#ffffff',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '16px',
              fontWeight: '500',
              position: 'absolute',
              left: '20px',
              zIndex: 1001,
              minWidth: '60px',
              minHeight: '44px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span style={{ color: '#007aff', fontSize: '16px', fontWeight: '500' }}>{getText('back')}</span>
          </div>
          <div 
            className="custom-title" 
            style={{ 
              color: '#ffffff', 
              fontSize: '20px', 
              fontWeight: '600', 
              margin: '0',
              textAlign: 'center',
              flex: '1',
              backgroundColor: 'transparent',
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              zIndex: 1000
            }}
          >
            {getText('bloodSugarManagement')}
          </div>
          <div
            onClick={() => navigate('/blood-sugar/add')}
            className="custom-add-btn"
            style={{
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              position: 'absolute',
              right: '20px',
              zIndex: 1001,
              minWidth: '60px',
              minHeight: '44px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>{getText('add')}</span>
          </div>
        </div>
      </header>

      {/* 主要內容區域 */}
      <main className="main-content">
        {/* 統計概覽 */}
        {statistics && (
          <div className="stats-overview">
            <div className="stats-grid">
              <div className="stat-card" style={{  }}>
                <div className="stat-icon">📊</div>
                <div className="stat-value" style={{ color: '#ffffff' }}>{statistics.avgValue}</div>
                <div className="stat-label" style={{ color: '#8e8e93' }}>{getText('averageBloodSugar')}</div>
                <div className="stat-unit" style={{ color: '#8e8e93' }}>{getText('mgdL')}</div>
              </div>
              <div className="stat-card" style={{  }}>
                <div className="stat-icon">📈</div>
                <div className="stat-value" style={{ color: '#ffffff' }}>{records.length}</div>
                <div className="stat-label" style={{ color: '#8e8e93' }}>{getText('recordCount')}</div>
                <div className="stat-unit" style={{ color: '#8e8e93' }}>{getText('records')}</div>
              </div>
            </div>
          </div>
        )}

        {/* 最新狀態 */}
        {statistics && (
          <div className="status-card" style={{  }}>
            <div className="status-icon" style={{ backgroundColor: statistics.latestStatus.color }}>
              {statistics.latestStatus.icon}
            </div>
            <div className="status-content">
              <div className="status-title" style={{ color: '#ffffff' }}>{getText('latestStatus')}</div>
              <div className="status-subtitle" style={{ color: '#8e8e93' }}>
                {statistics.latestStatus.status} - {records[0]?.value} {getText('mgdL')}
              </div>
            </div>
          </div>
        )}

        {/* 記錄列表 */}
        <div className="records-section">
          <h2 style={{ 
            color: '#2c1810', 
            fontSize: '20px', 
            fontWeight: '700',
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.3)',
            letterSpacing: '-0.3px'
          }}>
            {getText('bloodSugarRecords')}
          </h2>
          {loading ? (
            <div className="loading-state" style={{  }}>
              <div style={{ 
                color: '#2c1810', 
                fontSize: '16px', 
                fontWeight: '500',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.3)'
              }}>
                {getText('loading')}
              </div>
            </div>
          ) : records.length === 0 ? (
            <div className="empty-state" style={{  }}>
              <div style={{ 
                color: '#2c1810', 
                fontSize: '18px', 
                fontWeight: '600',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.3)',
                letterSpacing: '-0.2px'
              }}>
                {getText('noBloodSugarRecords')}
              </div>
              <div style={{ 
                color: '#5d4037', 
                fontSize: '14px', 
                marginTop: '8px',
                fontWeight: '500',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.2)',
                lineHeight: '1.4'
              }}>
                {getText('addFirstBloodSugarRecord')}
              </div>
            </div>
          ) : (
            <div className="records-list">
              {records.map((record) => {
                const status = getBloodSugarStatus(record.value);
                return (
                  <div 
                    key={record.id} 
                    className="record-card"
                    style={{  }}
                  >
                    <div className="record-info">
                      <div className="record-value" style={{ color: '#ffffff' }}>
                        {record.value} {record.unit}
                      </div>
                      <div className="record-meta" style={{ color: '#8e8e93' }}>
                        {formatDate(record.date)} {formatTime(record.time)}
                        {record.note && ` • ${record.note}`}
                      </div>
                    </div>
                    <div className="record-actions">
                      <div 
                        className="record-status"
                        style={{ 
                          backgroundColor: status.color,
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: '600',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          marginRight: '8px'
                        }}
                      >
                        {status.status}
                      </div>
                      <button 
                        className="edit-button"
                        onClick={() => handleEditRecord(record)}
                        title={getText('edit')}
                        style={{
                          background: 'rgba(0, 122, 255, 0.1)',
                          border: '1px solid rgba(0, 122, 255, 0.3)',
                          borderRadius: '8px',
                          padding: '8px',
                          marginRight: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.5">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteRecord(record.id)}
                        title={getText('delete')}
                        style={{
                          background: 'rgba(255, 59, 48, 0.1)',
                          border: '1px solid rgba(255, 59, 48, 0.3)',
                          borderRadius: '8px',
                          padding: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2.5">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BloodSugar;