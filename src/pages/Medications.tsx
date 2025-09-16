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
        'medicationManagement': '用藥管理',
        'medicationOverview': '用藥概況',
        'healthManagementStatus': '您的健康管理狀態',
        'totalMedications': '總用藥數',
        'activeMedications': '活躍用藥',
        'todayDoses': '今日劑量',
        'completionRate': '完成率',
        'addMedication': '添加用藥',
        'noMedications': '暫無用藥記錄',
        'addFirstMedication': '添加您的第一種用藥',
        'loading': '載入中...',
        'error': '載入失敗',
        'retry': '重試',
        'mg': '毫克',
        'timesPerDay': '次/天',
        'morning': '早上',
        'afternoon': '下午',
        'evening': '晚上',
        'night': '夜間',
        'totalMedicationsCount': '總用藥數',
        'reminderCount': '提醒次數',
        'medicationList': '用藥清單',
        'manageAllMedications': '管理您的所有用藥提醒',
        'noMedicationRecords': '還沒有用藥記錄',
        'addFirstMedicationReminder': '點擊下方按鈕新增您的第一個用藥提醒',
        'editMedication': '編輯',
        'deleteMedication': '刪除',
        'reminderTime': '提醒時間',
        'notes': '備註',
        'addNewMedication': '新增用藥',
        'daily': '每日',
        'twiceDaily': '每日兩次',
        'threeTimes': '每日三次',
        'weekly': '每週',
        'asNeeded': '需要時',
        'earlyMorning': '凌晨',
        'morningTime': '上午',
        'noon': '中午',
        'afternoonTime': '下午',
        'eveningTime': '晚上',
        'confirmDeleteMedication': '確定要刪除這個用藥提醒嗎？',
        'deleteFailed': '刪除失敗，請重試',
        'loadFailed': '載入用藥數據失敗'
      },
      'zh-CN': {
        'back': '返回',
        'medicationManagement': '用药管理',
        'medicationOverview': '用药概况',
        'healthManagementStatus': '您的健康管理状态',
        'totalMedications': '总用药数',
        'activeMedications': '活跃用药',
        'todayDoses': '今日剂量',
        'completionRate': '完成率',
        'addMedication': '添加用药',
        'noMedications': '暂无用药记录',
        'addFirstMedication': '添加您的第一种用药',
        'loading': '载入中...',
        'error': '载入失败',
        'retry': '重试',
        'mg': '毫克',
        'timesPerDay': '次/天',
        'morning': '早上',
        'afternoon': '下午',
        'evening': '晚上',
        'night': '夜间',
        'totalMedicationsCount': '总用药数',
        'reminderCount': '提醒次数',
        'medicationList': '用药清单',
        'manageAllMedications': '管理您的所有用药提醒',
        'noMedicationRecords': '还没有用药记录',
        'addFirstMedicationReminder': '点击下方按钮新增您的第一个用药提醒',
        'editMedication': '编辑',
        'deleteMedication': '删除',
        'reminderTime': '提醒时间',
        'notes': '备注',
        'addNewMedication': '新增用药',
        'daily': '每日',
        'twiceDaily': '每日两次',
        'threeTimes': '每日三次',
        'weekly': '每周',
        'asNeeded': '需要时',
        'earlyMorning': '凌晨',
        'morningTime': '上午',
        'noon': '中午',
        'afternoonTime': '下午',
        'eveningTime': '晚上',
        'confirmDeleteMedication': '确定要删除这个用药提醒吗？',
        'deleteFailed': '删除失败，请重试',
        'loadFailed': '载入用药数据失败'
      },
      'en': {
        'back': 'Back',
        'medicationManagement': 'Medication Management',
        'medicationOverview': 'Medication Overview',
        'healthManagementStatus': 'Your health management status',
        'totalMedications': 'Total Medications',
        'activeMedications': 'Active Medications',
        'todayDoses': 'Today\'s Doses',
        'completionRate': 'Completion Rate',
        'addMedication': 'Add Medication',
        'noMedications': 'No medication records',
        'addFirstMedication': 'Add your first medication',
        'loading': 'Loading...',
        'error': 'Loading failed',
        'retry': 'Retry',
        'mg': 'mg',
        'timesPerDay': 'times/day',
        'morning': 'Morning',
        'afternoon': 'Afternoon',
        'evening': 'Evening',
        'night': 'Night',
        'totalMedicationsCount': 'Total Medications',
        'reminderCount': 'Reminders',
        'medicationList': 'Medication List',
        'manageAllMedications': 'Manage all your medication reminders',
        'noMedicationRecords': 'No medication records yet',
        'addFirstMedicationReminder': 'Click the button below to add your first medication reminder',
        'editMedication': 'Edit',
        'deleteMedication': 'Delete',
        'reminderTime': 'Reminder Time',
        'notes': 'Notes',
        'addNewMedication': 'Add Medication',
        'daily': 'Daily',
        'twiceDaily': 'Twice Daily',
        'threeTimes': 'Three Times',
        'weekly': 'Weekly',
        'asNeeded': 'As Needed',
        'earlyMorning': 'Early Morning',
        'morningTime': 'Morning',
        'noon': 'Noon',
        'afternoonTime': 'Afternoon',
        'eveningTime': 'Evening',
        'confirmDeleteMedication': 'Are you sure you want to delete this medication reminder?',
        'deleteFailed': 'Delete failed, please try again',
        'loadFailed': 'Failed to load medication data'
      },
      'ja': {
        'back': '戻る',
        'medicationManagement': '薬物管理',
        'medicationOverview': '薬物概要',
        'healthManagementStatus': 'あなたの健康管理状態',
        'totalMedications': '総薬物数',
        'activeMedications': 'アクティブな薬物',
        'todayDoses': '今日の用量',
        'completionRate': '完了率',
        'addMedication': '薬物を追加',
        'noMedications': '薬物記録がありません',
        'addFirstMedication': '最初の薬物を追加してください',
        'loading': '読み込み中...',
        'error': '読み込み失敗',
        'retry': '再試行',
        'mg': 'ミリグラム',
        'timesPerDay': '回/日',
        'morning': '朝',
        'afternoon': '午後',
        'evening': '夕方',
        'night': '夜間',
        'totalMedicationsCount': '総薬物数',
        'reminderCount': 'リマインダー回数',
        'medicationList': '薬物リスト',
        'manageAllMedications': 'すべての薬物リマインダーを管理',
        'noMedicationRecords': '薬物記録がありません',
        'addFirstMedicationReminder': '下のボタンをクリックして最初の薬物リマインダーを追加',
        'editMedication': '編集',
        'deleteMedication': '削除',
        'reminderTime': 'リマインダー時間',
        'morningTime': '午前',
        'noon': '正午',
        'afternoonTime': '午後',
        'eveningTime': '夕方',
        'confirmDeleteMedication': 'この薬物リマインダーを削除してもよろしいですか？',
        'deleteFailed': '削除に失敗しました。再試行してください',
        'loadFailed': '薬物データの読み込みに失敗しました'
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
      console.log('Medications.tsx: 收到主題變更事件:', event.detail);
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
      setError(getText('loadFailed'));
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
    if (window.confirm(getText('confirmDeleteMedication'))) {
      try {
        // 使用 HealthDataService 刪除數據
        await healthDataService.deleteMedicationRecord(id);
        
        // 重新獲取數據以更新界面
        await fetchMedications();
        console.log('刪除成功:', id);
      } catch (err) {
        console.error('刪除失敗:', err);
        alert(getText('deleteFailed'));
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
      
      if (hour < 6) return `${getText('earlyMorning')}${hour}:${minute.toString().padStart(2, '0')}`;
      if (hour < 12) return `${getText('morningTime')}${hour}:${minute.toString().padStart(2, '0')}`;
      if (hour === 12) return `${getText('noon')}${hour}:${minute.toString().padStart(2, '0')}`;
      if (hour < 18) return `${getText('afternoonTime')}${hour}:${minute.toString().padStart(2, '0')}`;
      return `${getText('eveningTime')}${hour}:${minute.toString().padStart(2, '0')}`;
    } catch (error) {
      return time;
    }
  };

  // 格式化頻率顯示
  const formatFrequency = (frequency: string) => {
    const frequencyMap: { [key: string]: string } = {
      'daily': getText('daily'),
      'twice-daily': getText('twiceDaily'),
      'three-times': getText('threeTimes'),
      'weekly': getText('weekly'),
      'as-needed': getText('asNeeded')
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
            <div 
              onClick={handleBack}
              className="custom-back-btn"
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#000000',
                border: '1px solid #000000',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                minWidth: '60px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                zIndex: 1001,
                userSelect: 'none',
                WebkitUserSelect: 'none',
                touchAction: 'manipulation'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500' }}>{getText('back')}</span>
            </div>
            <h1 className="header-title">{getText('medicationManagement')}</h1>
            <div className="header-spacer"></div>
          </div>
        </header>
        
        <main className="main-content">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{getText('loading')}</p>
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
            <div 
              onClick={handleBack}
              className="custom-back-btn"
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#000000',
                border: '1px solid #000000',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                minWidth: '60px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                zIndex: 1001,
                userSelect: 'none',
                WebkitUserSelect: 'none',
                touchAction: 'manipulation'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500' }}>{getText('back')}</span>
            </div>
            <h1 className="header-title">{getText('medicationManagement')}</h1>
            <div className="header-spacer"></div>
          </div>
        </header>
        
        <main className="main-content">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">{getText('error')}</h3>
            <p className="error-description">{error}</p>
            <button onClick={fetchMedications} className="retry-button">
              {getText('retry')}
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
          <div 
            onClick={handleBack}
            className="custom-back-btn"
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#000000',
              border: '1px solid #000000',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              minWidth: '60px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              zIndex: 1001,
              userSelect: 'none',
              WebkitUserSelect: 'none',
              touchAction: 'manipulation'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500' }}>{getText('back')}</span>
          </div>
          <h1 className="header-title">{getText('medicationManagement')}</h1>
          {/* 右側空白區域，確保標題居中 */}
          <div className="header-spacer"></div>
        </div>
      </header>

      {/* 主要內容區域 */}
      <main className="main-content">
        {/* 統計信息 - 以用戶邏輯重新設計 */}
        <div className="stats-overview">
          <div className="stats-header">
            <h2 className="stats-title">{getText('medicationOverview')}</h2>
            <p className="stats-subtitle">{getText('healthManagementStatus')}</p>
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
                <div className="stat-label">{getText('totalMedicationsCount')}</div>
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
                <div className="stat-label">{getText('reminderCount')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 用藥列表 */}
        <div className="medications-section">
          <div className="section-header">
            <h2 className="section-title">{getText('medicationList')}</h2>
            <p className="section-subtitle">{getText('manageAllMedications')}</p>
          </div>
          
          <div className="medications-list">
            {medications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💊</div>
                <h3 className="empty-title">{getText('noMedicationRecords')}</h3>
                <p className="empty-description">{getText('addFirstMedicationReminder')}</p>
              </div>
            ) : (
              medications.map((medication) => {
                console.log('Medication object:', medication);
                console.log('Medication _id:', medication._id);
                return (
                <div key={medication._id} className="medication-item">
                  <div className="medication-content">
                    <div className="medication-header">
                      <h3 className="medication-name">{medication.name}</h3>
                      <div className="medication-actions">
                        <button
                          onClick={() => handleDelete(medication._id)}
                          className="action-button delete-button"
                          type="button"
                          title={getText('deleteMedication')}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleEdit(medication._id)}
                          className="action-button edit-button"
                          type="button"
                          title={getText('editMedication')}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
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
                          {getText('reminderTime')}
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
                          {getText('notes')}
                        </div>
                        <p className="notes-content">{medication.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                );
              })
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
          <span>{getText('addNewMedication')}</span>
        </button>
      </div>
    </div>
  );
};

export default Medications;