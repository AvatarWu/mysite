import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { healthDataService, BloodPressureRecord } from '../services/HealthDataService';
import './BloodPressure.css';

const BloodPressure: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<BloodPressureRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await healthDataService.getBloodPressureRecords();
      setRecords(data);
    } catch (error) {
      console.error('載入血壓記錄失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRecord = (record: BloodPressureRecord) => {
    navigate(`/blood-pressure/edit/${record._id}`);
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm('確定要刪除這筆記錄嗎？')) {
      try {
        await healthDataService.deleteBloodPressureRecord(id);
        await loadRecords();
      } catch (error) {
        console.error('刪除記錄失敗:', error);
        alert('刪除失敗，請重試');
      }
    }
  };

  const getBloodPressureStatus = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) {
      return { status: '正常', color: '#34C759', icon: '✅' };
    } else if (systolic < 130 && diastolic < 80) {
      return { status: '正常偏高', color: '#FF9500', icon: '⚠️' };
    } else if (systolic < 140 || diastolic < 90) {
      return { status: '高血壓一期', color: '#FF3B30', icon: '🔴' };
    } else if (systolic < 160 || diastolic < 100) {
      return { status: '高血壓二期', color: '#FF3B30', icon: '🔴' };
    } else {
      return { status: '高血壓三期', color: '#FF3B30', icon: '🔴' };
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
            <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500' }}>返回</span>
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
            血壓管理
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
            <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>新增</span>
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
                <div className="stat-label" style={{ color: '#8e8e93' }}>平均收縮壓</div>
                <div className="stat-unit" style={{ color: '#8e8e93' }}>mmHg</div>
              </div>
              <div className="stat-card" style={{ backgroundColor: '#000000', border: '0.5px solid rgba(255, 255, 255, 0.1)' }}>
                <div className="stat-icon">📈</div>
                <div className="stat-value" style={{ color: '#ffffff' }}>{statistics.avgDiastolic}</div>
                <div className="stat-label" style={{ color: '#8e8e93' }}>平均舒張壓</div>
                <div className="stat-unit" style={{ color: '#8e8e93' }}>mmHg</div>
              </div>
              <div className="stat-card" style={{ backgroundColor: '#000000', border: '0.5px solid rgba(255, 255, 255, 0.1)' }}>
                <div className="stat-icon">💓</div>
                <div className="stat-value" style={{ color: '#ffffff' }}>{statistics.avgPulse}</div>
                <div className="stat-label" style={{ color: '#8e8e93' }}>平均脈搏</div>
                <div className="stat-unit" style={{ color: '#8e8e93' }}>bpm</div>
              </div>
            </div>
            
            <div className="status-card" style={{ backgroundColor: '#000000', border: '0.5px solid rgba(255, 255, 255, 0.1)' }}>
              <div className="status-icon" style={{ backgroundColor: statistics.latestStatus.color }}>
                {statistics.latestStatus.icon}
              </div>
              <div className="status-content">
                <div className="status-title" style={{ color: '#ffffff' }}>{statistics.latestStatus.status}</div>
                <div className="status-subtitle" style={{ color: '#8e8e93' }}>最新狀態</div>
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
              最近一週
            </button>
            <button 
              className={`filter-button ${selectedPeriod === 'month' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('month')}
            >
              最近一月
            </button>
            <button 
              className={`filter-button ${selectedPeriod === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('all')}
            >
              全部記錄
            </button>
          </div>
        </div>

        {/* 記錄列表 */}
        <div className="records-section">
          <div className="records-header">
            <h2 className="records-title">血壓記錄</h2>
            <span className="records-count">{records.length} 筆記錄</span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>載入中...</p>
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