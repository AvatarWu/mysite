// src/pages/Medications.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { healthDataService } from '../services/HealthDataService';
import './Medications.css';

interface Medication {
  _id: string;
  name: string;
  dosage: string;
  unit: string;
  frequency: string;
  timeSlots: Array<{
    time: string;
    enabled: boolean;
  }>;
  createdAt: string;
  notes?: string;
}

const Medications: React.FC = () => {
  const navigate = useNavigate();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 使用 HealthDataService 獲取真實數據
      const records = await healthDataService.getMedicationRecords();
      console.log('獲取到的用藥記錄:', records);
      
      // 轉換數據格式以匹配界面需求
      const formattedMedications: Medication[] = records.map(record => ({
        _id: record._id || '',
        name: record.name,
        dosage: record.dosage,
        unit: 'mg', // 使用默認單位，因為 MedicationRecord 沒有 unit 屬性
        frequency: record.frequency,
        timeSlots: record.timeSlots || [],
        createdAt: record.createdAt ? new Date(record.createdAt).toISOString() : new Date().toISOString(),
        notes: record.note
      }));
      
      setMedications(formattedMedications);
    } catch (err) {
      setError('無法載入用藥數據');
      console.error('載入用藥數據失敗:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleAddMedication = () => {
    navigate('/medications/add');
  };

  const handleEdit = (id: string) => {
    console.log('編輯用藥:', id);
    // 導航到編輯頁面，傳遞用藥 ID
    navigate(`/medications/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('確定要刪除這個用藥提醒嗎？')) {
      try {
        // 使用 HealthDataService 刪除數據
        await healthDataService.deleteMedicationRecord(id);
        
        // 重新獲取數據以更新界面
        await fetchMedications();
        console.log('刪除成功:', id);
      } catch (err) {
        console.error('刪除失敗:', err);
        alert('刪除失敗，請重試');
      }
    }
  };

  const totalMedications = medications.length;
  const totalReminders = medications.reduce((total, med) => {
    return total + (med.timeSlots ? med.timeSlots.filter(slot => slot.enabled).length : 0);
  }, 0);

  // 格式化時間顯示
  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const minute = parseInt(minutes);
      
      if (hour < 6) return `凌晨${hour}:${minute.toString().padStart(2, '0')}`;
      if (hour < 12) return `上午${hour}:${minute.toString().padStart(2, '0')}`;
      if (hour === 12) return `中午${hour}:${minute.toString().padStart(2, '0')}`;
      if (hour < 18) return `下午${hour}:${minute.toString().padStart(2, '0')}`;
      return `晚上${hour}:${minute.toString().padStart(2, '0')}`;
    } catch (error) {
      return time;
    }
  };

  // 格式化頻率顯示
  const formatFrequency = (frequency: string) => {
    const frequencyMap: { [key: string]: string } = {
      'daily': '每日',
      'twice-daily': '每日兩次',
      'three-times': '每日三次',
      'weekly': '每週',
      'as-needed': '需要時'
    };
    return frequencyMap[frequency] || frequency;
  };

  // 格式化日期顯示（目前未使用，保留以備將來擴展）
  // const formatDate = (dateString: string) => {
  //   try {
  //     const date = new Date(dateString);
  //     const now = new Date();
  //     const diffTime = Math.abs(now.getTime() - date.getTime());
  //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //     
  //     if (diffDays === 1) return '今天';
  //     if (diffDays === 2) return '昨天';
  //     if (diffDays <= 7) return `${diffDays - 1}天前`;
  //     
  //     return date.toLocaleDateString('zh-TW', {
  //       month: 'short',
  //       day: 'numeric'
  //     });
  //   } catch (error) {
  //     return '未知日期';
  //   }
  // };

  if (loading) {
    return (
      <div className="medications-page">
        <header className="custom-header">
          <div className="header-content">
            <button onClick={handleBack} className="back-button" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              返回
            </button>
            <h1 className="header-title">用藥管理</h1>
          </div>
        </header>
        
        <main className="main-content">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>載入中...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="medications-page">
        <header className="custom-header">
          <div className="header-content">
            <button onClick={handleBack} className="back-button" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              返回
            </button>
            <h1 className="header-title">用藥管理</h1>
          </div>
        </header>
        
        <main className="main-content">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">載入失敗</h3>
            <p className="error-description">{error}</p>
            <button onClick={fetchMedications} className="retry-button">
              重試
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="medications-page">
      {/* 自定義導航欄 - Apple 風格 */}
      <header className="custom-header">
        <div className="header-content">
          <button onClick={handleBack} className="back-button" type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            返回
          </button>
          <h1 className="header-title">用藥管理</h1>
        </div>
      </header>

      {/* 主要內容區域 */}
      <main className="main-content">
        {/* 統計信息 - 以用戶邏輯重新設計 */}
        <div className="stats-overview">
          <div className="stats-header">
            <h2 className="stats-title">用藥概況</h2>
            <p className="stats-subtitle">您的健康管理狀態</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 3h12l4 6-8 11L2 9l4-6z"/>
                  <path d="M6 7h12"/>
                  <path d="M9 11h6"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">{totalMedications}</div>
                <div className="stat-label">總用藥數</div>
              </div>
            </div>

            <div className="stat-card secondary">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7-3 9-3 9H9s-3-2-3-9"/>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">{totalReminders}</div>
                <div className="stat-label">提醒次數</div>
              </div>
            </div>
          </div>
        </div>

        {/* 用藥列表 */}
        <div className="medications-section">
          <div className="section-header">
            <h2 className="section-title">用藥清單</h2>
            <p className="section-subtitle">管理您的所有用藥提醒</p>
          </div>
          
          <div className="medications-list">
            {medications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💊</div>
                <h3 className="empty-title">還沒有用藥記錄</h3>
                <p className="empty-description">點擊下方按鈕新增您的第一個用藥提醒</p>
              </div>
            ) : (
              medications.map((medication) => (
                <div key={medication._id} className="medication-item">
                  <div className="medication-content">
                    <div className="medication-header">
                      <h3 className="medication-name">{medication.name}</h3>
                      <div className="medication-actions">
                        <button
                          onClick={() => handleEdit(medication._id)}
                          className="action-button edit-button"
                          type="button"
                          title="編輯"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleDelete(medication._id)}
                          className="action-button delete-button"
                          type="button"
                          title="刪除"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="medication-details">
                      <span className="medication-dosage">
                        {medication.dosage} {medication.unit}
                      </span>
                      <span className="medication-frequency">
                        {formatFrequency(medication.frequency)}
                      </span>
                    </div>

                    {medication.timeSlots && medication.timeSlots.length > 0 && (
                      <div className="reminder-times">
                        <div className="reminder-label">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12,6 12,12 16,14"/>
                          </svg>
                          提醒時間
                        </div>
                        <div className="time-slots">
                          {medication.timeSlots
                            .filter(slot => slot.enabled)
                            .map((slot, index) => (
                              <span key={index} className="time-slot">
                                {formatTime(slot.time)}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                    {medication.notes && (
                      <div className="medication-notes">
                        <div className="notes-label">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10,9 9,9 8,9"/>
                          </svg>
                          備註
                        </div>
                        <p className="notes-content">{medication.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* 新增用藥按鈕 - 重新設計 */}
      <div className="floating-action-button">
        <button onClick={handleAddMedication} className="add-medication-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>新增用藥</span>
        </button>
      </div>
    </div>
  );
};

export default Medications;