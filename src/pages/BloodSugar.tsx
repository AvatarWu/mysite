import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BloodSugar.css';

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

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      // 模擬數據載入
      const mockRecords: BloodSugarRecord[] = [
        {
          id: '1',
          value: 120,
          unit: 'mg/dL',
          date: '2024-01-15',
          time: '08:30',
          note: '早餐前',
          status: 'normal'
        },
        {
          id: '2',
          value: 180,
          unit: 'mg/dL',
          date: '2024-01-15',
          time: '12:00',
          note: '午餐後2小時',
          status: 'high'
        }
      ];
      setRecords(mockRecords);
    } catch (error) {
      console.error('載入血糖記錄失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBloodSugarStatus = (value: number) => {
    if (value < 70) {
      return { status: '低血糖', color: '#FF9500', icon: '⚠️' };
    } else if (value <= 140) {
      return { status: '正常', color: '#34C759', icon: '✅' };
    } else if (value <= 200) {
      return { status: '偏高', color: '#FF9500', icon: '⚠️' };
    } else {
      return { status: '高血糖', color: '#FF3B30', icon: '🔴' };
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
    <div className="blood-sugar-page" style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span style={{ color: '#007aff', fontSize: '16px', fontWeight: '500' }}>返回</span>
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
            血糖管理
          </div>
          <div
            onClick={() => navigate('/blood-sugar/add')}
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
      <main className="main-content" style={{ backgroundColor: '#000000' }}>
        {/* 統計概覽 */}
        {statistics && (
          <div className="stats-overview">
            <div className="stats-grid">
              <div className="stat-card" style={{ backgroundColor: '#000000', border: '0.5px solid rgba(255, 255, 255, 0.1)' }}>
                <div className="stat-icon">📊</div>
                <div className="stat-value" style={{ color: '#ffffff' }}>{statistics.avgValue}</div>
                <div className="stat-label" style={{ color: '#8e8e93' }}>平均血糖</div>
                <div className="stat-unit" style={{ color: '#8e8e93' }}>mg/dL</div>
              </div>
              <div className="stat-card" style={{ backgroundColor: '#000000', border: '0.5px solid rgba(255, 255, 255, 0.1)' }}>
                <div className="stat-icon">📈</div>
                <div className="stat-value" style={{ color: '#ffffff' }}>{records.length}</div>
                <div className="stat-label" style={{ color: '#8e8e93' }}>記錄數量</div>
                <div className="stat-unit" style={{ color: '#8e8e93' }}>筆</div>
              </div>
            </div>
          </div>
        )}

        {/* 最新狀態 */}
        {statistics && (
          <div className="status-card" style={{ backgroundColor: '#000000', border: '0.5px solid rgba(255, 255, 255, 0.1)' }}>
            <div className="status-icon" style={{ backgroundColor: statistics.latestStatus.color }}>
              {statistics.latestStatus.icon}
            </div>
            <div className="status-content">
              <div className="status-title" style={{ color: '#ffffff' }}>最新狀態</div>
              <div className="status-subtitle" style={{ color: '#8e8e93' }}>
                {statistics.latestStatus.status} - {records[0]?.value} mg/dL
              </div>
            </div>
          </div>
        )}

        {/* 記錄列表 */}
        <div className="records-section">
          <h2 style={{ color: '#ffffff' }}>血糖記錄</h2>
          {loading ? (
            <div className="loading-state" style={{ backgroundColor: '#000000', border: '0.5px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ color: '#ffffff' }}>載入中...</div>
            </div>
          ) : records.length === 0 ? (
            <div className="empty-state" style={{ backgroundColor: '#000000', border: '0.5px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ color: '#ffffff' }}>尚無血糖記錄</div>
              <div style={{ color: '#8e8e93', fontSize: '14px', marginTop: '8px' }}>
                點擊右上角「新增」按鈕開始記錄
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
                    style={{ backgroundColor: '#000000', border: '0.5px solid rgba(255, 255, 255, 0.1)' }}
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
                    <div 
                      className="record-status"
                      style={{ 
                        backgroundColor: status.color,
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: '600',
                        padding: '6px 12px',
                        borderRadius: '8px'
                      }}
                    >
                      {status.status}
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