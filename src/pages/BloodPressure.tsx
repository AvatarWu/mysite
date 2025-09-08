import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { healthDataService, BloodPressureRecord } from '../services/HealthDataService';
import './BloodPressure.css';

const BloodPressure: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<BloodPressureRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

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
        'bloodPressureManagement': '血壓管理',
        'add': '新增',
        'averageSystolicPressure': '平均收縮壓',
        'averageDiastolicPressure': '平均舒張壓',
        'averagePulse': '平均脈搏',
        'mmHg': 'mmHg',
        'bpm': 'bpm',
        'latestStatus': '最新狀態',
        'normal': '正常',
        'normalHigh': '正常偏高',
        'hypertensionStage1': '高血壓一期',
        'hypertensionStage2': '高血壓二期',
        'hypertensionStage3': '高血壓三期',
        'lastWeek': '最近一週',
        'lastMonth': '最近一月',
        'allRecords': '全部記錄',
        'bloodPressureRecords': '血壓記錄',
        'records': '筆記錄',
        'loading': '載入中...',
        'noRecords': '暫無記錄',
        'addFirstRecord': '添加您的第一筆血壓記錄',
        'confirmDelete': '確定要刪除這筆記錄嗎？',
        'deleteFailed': '刪除失敗，請重試',
        'loadFailed': '載入血壓記錄失敗'
      },
      'zh-CN': {
        'back': '返回',
        'bloodPressureManagement': '血压管理',
        'add': '新增',
        'averageSystolicPressure': '平均收缩压',
        'averageDiastolicPressure': '平均舒张压',
        'averagePulse': '平均脉搏',
        'mmHg': 'mmHg',
        'bpm': 'bpm',
        'latestStatus': '最新状态',
        'normal': '正常',
        'normalHigh': '正常偏高',
        'hypertensionStage1': '高血压一期',
        'hypertensionStage2': '高血压二期',
        'hypertensionStage3': '高血压三期',
        'lastWeek': '最近一周',
        'lastMonth': '最近一月',
        'allRecords': '全部记录',
        'bloodPressureRecords': '血压记录',
        'records': '笔记录',
        'loading': '载入中...',
        'noRecords': '暂无记录',
        'addFirstRecord': '添加您的第一笔血压记录',
        'confirmDelete': '确定要删除这笔记录吗？',
        'deleteFailed': '删除失败，请重试',
        'loadFailed': '载入血压记录失败'
      },
      'en': {
        'back': 'Back',
        'bloodPressureManagement': 'Blood Pressure Management',
        'add': 'Add',
        'averageSystolicPressure': 'Average Systolic Pressure',
        'averageDiastolicPressure': 'Average Diastolic Pressure',
        'averagePulse': 'Average Pulse',
        'mmHg': 'mmHg',
        'bpm': 'bpm',
        'latestStatus': 'Latest Status',
        'normal': 'Normal',
        'normalHigh': 'Normal High',
        'hypertensionStage1': 'Hypertension Stage I',
        'hypertensionStage2': 'Hypertension Stage II',
        'hypertensionStage3': 'Hypertension Stage III',
        'lastWeek': 'Last Week',
        'lastMonth': 'Last Month',
        'allRecords': 'All Records',
        'bloodPressureRecords': 'Blood Pressure Records',
        'records': 'records',
        'loading': 'Loading...',
        'noRecords': 'No records',
        'addFirstRecord': 'Add your first blood pressure record',
        'confirmDelete': 'Are you sure you want to delete this record?',
        'deleteFailed': 'Delete failed, please try again',
        'loadFailed': 'Failed to load blood pressure records'
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
    const handleThemeChange = (_event: CustomEvent) => {
      applyTheme();
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
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await healthDataService.getBloodPressureRecords();
      setRecords(data);
    } catch (error) {
      console.error(getText('loadFailed'), error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRecord = (record: BloodPressureRecord) => {
    navigate(`/blood-pressure/edit/${record._id}`);
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm(getText('confirmDelete'))) {
      try {
        await healthDataService.deleteBloodPressureRecord(id);
        await loadRecords();
      } catch (error) {
        console.error('刪除記錄失敗:', error);
        alert(getText('deleteFailed'));
      }
    }
  };

  const getBloodPressureStatus = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) {
      return { status: getText('normal'), color: '#34C759', icon: '✅' };
    } else if (systolic < 130 && diastolic < 80) {
      return { status: getText('normalHigh'), color: '#FF9500', icon: '⚠️' };
    } else if (systolic < 140 || diastolic < 90) {
      return { status: getText('hypertensionStage1'), color: '#FF3B30', icon: '🔴' };
    } else if (systolic < 160 || diastolic < 100) {
      return { status: getText('hypertensionStage2'), color: '#FF3B30', icon: '🔴' };
    } else {
      return { status: getText('hypertensionStage3'), color: '#FF3B30', icon: '🔴' };
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
    
    const avgSystolic = Math.round(records.reduce((sum, r) => sum + r.systolic, 0) / records.length);
    const avgDiastolic = Math.round(records.reduce((sum, r) => sum + r.diastolic, 0) / records.length);
    const avgPulse = Math.round(records.reduce((sum, r) => sum + r.pulse, 0) / records.length);
    
    const latestRecord = records[0];
    const latestStatus = getBloodPressureStatus(latestRecord.systolic, latestRecord.diastolic);
    
    return {
      avgSystolic,
      avgDiastolic,
      avgPulse,
      latestStatus
    };
  };

  const statistics = getStatistics();

  return (
    <div className="blood-pressure-page" style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
      {/* 自定義導航欄 - Apple 風格 */}
      <header className="custom-header" style={{ 
        backgroundColor: '#000000',
        borderBottom: '0.5px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="header-content">
          <div 
            onClick={() => navigate('/')} 
            className="custom-back-btn"
            style={{
              background: '#000000',
              border: '1px solid #000000',
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500' }}>{getText('back')}</span>
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
            {getText('bloodPressureManagement')}
          </div>
          <div
            onClick={() => navigate('/blood-pressure/add')}
            className="custom-add-btn"
            style={{
              background: '#000000',
              border: '1px solid #000000',
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
              <div className="stat-card" style={{ backgroundColor: '#000000', border: '0.5px solid rgba(255, 255, 255, 0.1)' }}>
                <div className="stat-icon">📊</div>
                <div className="stat-value" style={{ color: '#ffffff' }}>{statistics.avgSystolic}</div>
                <div className="stat-label" style={{ color: '#8e8e93' }}>{getText('averageSystolicPressure')}</div>
                <div className="stat-unit" style={{ color: '#8e8e93' }}>{getText('mmHg')}</div>
              </div>
              <div className="stat-card" style={{ backgroundColor: '#000000', border: '0.5px solid rgba(255, 255, 255, 0.1)' }}>
                <div className="stat-icon">📈</div>
                <div className="stat-value" style={{ color: '#ffffff' }}>{statistics.avgDiastolic}</div>
                <div className="stat-label" style={{ color: '#8e8e93' }}>{getText('averageDiastolicPressure')}</div>
                <div className="stat-unit" style={{ color: '#8e8e93' }}>{getText('mmHg')}</div>
              </div>
              <div className="stat-card" style={{ backgroundColor: '#000000', border: '0.5px solid rgba(255, 255, 255, 0.1)' }}>
                <div className="stat-icon">💓</div>
                <div className="stat-value" style={{ color: '#ffffff' }}>{statistics.avgPulse}</div>
                <div className="stat-label" style={{ color: '#8e8e93' }}>{getText('averagePulse')}</div>
                <div className="stat-unit" style={{ color: '#8e8e93' }}>{getText('bpm')}</div>
              </div>
            </div>
            
            <div className="status-card" style={{ backgroundColor: '#000000', border: '0.5px solid rgba(255, 255, 255, 0.1)' }}>
              <div className="status-icon" style={{ backgroundColor: statistics.latestStatus.color }}>
                {statistics.latestStatus.icon}
              </div>
              <div className="status-content">
                <div className="status-title" style={{ color: '#ffffff' }}>{statistics.latestStatus.status}</div>
                <div className="status-subtitle" style={{ color: '#8e8e93' }}>{getText('latestStatus')}</div>
              </div>
            </div>
          </div>
        )}

        {/* 時間篩選 */}
        <div className="filter-section">
          <div className="filter-buttons">
            <button 
              className={`filter-button ${selectedPeriod === 'week' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('week')}
            >
              {getText('lastWeek')}
            </button>
            <button 
              className={`filter-button ${selectedPeriod === 'month' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('month')}
            >
              {getText('lastMonth')}
            </button>
            <button 
              className={`filter-button ${selectedPeriod === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('all')}
            >
              {getText('allRecords')}
            </button>
          </div>
        </div>

        {/* 記錄列表 */}
        <div className="records-section">
          <div className="records-header">
            <h2 className="records-title">{getText('bloodPressureRecords')}</h2>
            <span className="records-count">{records.length} {getText('records')}</span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>{getText('loading')}</p>
            </div>
          ) : records.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>尚無血壓記錄</h3>
              <p>點擊右下角「+」按鈕或右上角「+ 新增」按鈕開始記錄您的血壓</p>
              <button 
                className="primary-button"
                onClick={() => navigate('/blood-pressure/add')}
              >
                新增第一筆記錄
              </button>
            </div>
          ) : (
            <div className="records-list">
              {records.map((record) => {
                const status = getBloodPressureStatus(record.systolic, record.diastolic);
                return (
                  <div key={record._id} className="record-card" style={{ 
                    backgroundColor: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#000000' : '#ffffff', 
                    border: window.matchMedia('(prefers-color-scheme: dark)').matches ? '0.5px solid rgba(255, 255, 255, 0.1)' : '0.5px solid rgba(0, 0, 0, 0.1)'
                  }}>
                    <div className="record-header">
                      <div className="record-date">
                        <span className="date">{formatDate(record.date)}</span>
                        <span className="time">{formatTime(record.time)}</span>
                      </div>
                      <div className="record-actions">
                        <button 
                          className="edit-button"
                          onClick={() => handleEditRecord(record)}
                          title="編輯"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteRecord(record._id!)}
                          title="刪除"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="record-content">
                      <div className="blood-pressure-values">
                        <div className="bp-value">
                          <span className="bp-label">收縮壓</span>
                          <span className="bp-number">{record.systolic}</span>
                          <span className="bp-unit">mmHg</span>
                        </div>
                        <div className="bp-separator">/</div>
                        <div className="bp-value">
                          <span className="bp-label">舒張壓</span>
                          <span className="bp-number">{record.diastolic}</span>
                          <span className="bp-unit">mmHg</span>
                        </div>
                      </div>
                      
                      <div className="pulse-value">
                        <span className="pulse-label">脈搏</span>
                        <span className="pulse-number">{record.pulse}</span>
                        <span className="pulse-unit">bpm</span>
                      </div>
                      
                      <div className="record-status">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: status.color }}
                        >
                          {status.icon} {status.status}
                        </span>
                      </div>
                    </div>
                    
                    {record.note && (
                      <div className="record-note">
                        <span className="note-label">備註：</span>
                        <span className="note-text">{record.note}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* 浮動新增按鈕 */}
      <button 
        className="floating-add-button"
        onClick={() => navigate('/blood-pressure/add')}
        title="新增血壓記錄"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>
    </div>
  );
};

export default BloodPressure;