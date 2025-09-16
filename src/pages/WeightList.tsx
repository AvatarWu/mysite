import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WeightList.css';

interface WeightRecord {
  id: string;
  weight: number;
  height: number; // 身高 (cm)
  date: string;
  time: string;
  notes?: string;
  bmi?: number;
}

const WeightList: React.FC = () => {
  const navigate = useNavigate();
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  // 移除模態框相關狀態

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
        'weightManagement': '體重管理',
        'weightManagementDesc': '追蹤體重變化趨勢',
        'addWeight': '新增體重',
        'editWeight': '編輯體重',
        'currentWeight': '當前體重',
        'weightHistory': '體重歷史',
        'weight': '體重',
        'date': '日期',
        'time': '時間',
        'notes': '備註',
        'bmi': 'BMI',
        'targetWeight': '目標體重',
        'weightTrend': '體重趨勢',
        'back': '返回',
        'save': '儲存',
        'cancel': '取消',
        'delete': '刪除',
        'edit': '編輯',
        'kg': '公斤',
        'cm': '公分',
        'height': '身高',
        'calculateBMI': '計算 BMI',
        'bmiCategory': 'BMI 分類',
        'underweight': '過輕',
        'normal': '正常',
        'overweight': '過重',
        'obese': '肥胖',
        'bmiAdviceUnderweight': '建議增加體重，保持健康飲食和適量運動',
        'bmiAdviceNormal': '體重正常，請繼續保持健康的生活方式',
        'bmiAdviceOverweight': '建議控制體重，注意飲食和增加運動',
        'bmiAdviceObese': '建議諮詢醫生，制定減重計劃',
        'weightError': '請輸入有效的體重 (20-300kg)',
        'heightError': '請輸入有效的身高 (100-250cm)',
        'done': '完成'
      },
      'zh-CN': {
        'weightManagement': '体重管理',
        'weightManagementDesc': '追踪体重变化趋势',
        'addWeight': '新增体重',
        'editWeight': '编辑体重',
        'currentWeight': '当前体重',
        'weightHistory': '体重历史',
        'weight': '体重',
        'date': '日期',
        'time': '时间',
        'notes': '备注',
        'bmi': 'BMI',
        'targetWeight': '目标体重',
        'weightTrend': '体重趋势',
        'back': '返回',
        'save': '保存',
        'cancel': '取消',
        'delete': '删除',
        'edit': '编辑',
        'kg': '公斤',
        'cm': '公分',
        'height': '身高',
        'calculateBMI': '计算 BMI',
        'bmiCategory': 'BMI 分类',
        'underweight': '过轻',
        'normal': '正常',
        'overweight': '过重',
        'obese': '肥胖',
        'bmiAdviceUnderweight': '建议增加体重，保持健康饮食和适量运动',
        'bmiAdviceNormal': '体重正常，请继续保持健康的生活方式',
        'bmiAdviceOverweight': '建议控制体重，注意饮食和增加运动',
        'bmiAdviceObese': '建议咨询医生，制定减重计划',
        'weightError': '请输入有效的体重 (20-300kg)',
        'heightError': '请输入有效的身高 (100-250cm)',
        'done': '完成'
      },
      'en': {
        'weightManagement': 'Weight Management',
        'weightManagementDesc': 'Track weight change trends',
        'addWeight': 'Add Weight',
        'editWeight': 'Edit Weight',
        'currentWeight': 'Current Weight',
        'weightHistory': 'Weight History',
        'weight': 'Weight',
        'date': 'Date',
        'time': 'Time',
        'notes': 'Notes',
        'bmi': 'BMI',
        'targetWeight': 'Target Weight',
        'weightTrend': 'Weight Trend',
        'back': 'Back',
        'save': 'Save',
        'cancel': 'Cancel',
        'delete': 'Delete',
        'edit': 'Edit',
        'kg': 'kg',
        'cm': 'cm',
        'height': 'Height',
        'calculateBMI': 'Calculate BMI',
        'bmiCategory': 'BMI Category',
        'underweight': 'Underweight',
        'normal': 'Normal',
        'overweight': 'Overweight',
        'obese': 'Obese',
        'bmiAdviceUnderweight': 'Consider gaining weight with healthy diet and exercise',
        'bmiAdviceNormal': 'Weight is normal, keep up the healthy lifestyle',
        'bmiAdviceOverweight': 'Consider weight control with diet and exercise',
        'bmiAdviceObese': 'Consider consulting a doctor for weight management',
        'weightError': 'Please enter a valid weight (20-300kg)',
        'heightError': 'Please enter a valid height (100-250cm)',
        'done': 'Done'
      },
      'ja': {
        'weightManagement': '体重管理',
        'weightManagementDesc': '体重変化の傾向を追跡',
        'addWeight': '体重追加',
        'editWeight': '体重編集',
        'currentWeight': '現在の体重',
        'weightHistory': '体重履歴',
        'weight': '体重',
        'date': '日付',
        'time': '時間',
        'notes': '備考',
        'bmi': 'BMI',
        'targetWeight': '目標体重',
        'weightTrend': '体重傾向',
        'back': '戻る',
        'save': '保存',
        'cancel': 'キャンセル',
        'delete': '削除',
        'edit': '編集',
        'kg': 'kg',
        'cm': 'cm',
        'height': '身長',
        'calculateBMI': 'BMI 計算',
        'bmiCategory': 'BMI 分類',
        'underweight': '低体重',
        'normal': '正常',
        'overweight': '過体重',
        'obese': '肥満',
        'bmiAdviceUnderweight': '健康的な食事と運動で体重増加を検討',
        'bmiAdviceNormal': '体重は正常です、健康的な生活を続けてください',
        'bmiAdviceOverweight': '食事と運動で体重管理を検討',
        'bmiAdviceObese': '医師に相談して体重管理を検討',
        'weightError': '有効な体重を入力してください (20-300kg)',
        'heightError': '有効な身長を入力してください (100-250cm)',
        'done': '完了'
      }
    };
    
    return texts[language as keyof typeof texts]?.[key as keyof typeof texts['zh-TW']] || key;
  };

  // 載入設定
  useEffect(() => {
    loadSettings();
  }, []);

  // 移除模態框相關的清理邏輯

  const loadSettings = () => {
    // 設定載入邏輯已移至 CSS 變數系統處理
  };

  // 載入體重記錄
  useEffect(() => {
    loadWeightRecords();
    
    // 監聽頁面可見性變化，當頁面重新可見時重新載入數據
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('頁面重新可見，重新載入體重記錄');
        loadWeightRecords();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadWeightRecords = () => {
    try {
      const saved = localStorage.getItem('weightRecords');
      if (saved) {
        const records = JSON.parse(saved);
        // 轉換數據格式以匹配組件期望的格式
        const formattedRecords = records.map((record: any) => ({
          id: record._id || record.id,
          weight: record.weight,
          height: record.height,
          date: record.date,
          time: record.time || '00:00',
          notes: record.note || record.notes,
          bmi: record.bmi
        }));
        setWeightRecords(formattedRecords);
        console.log('載入體重記錄:', formattedRecords);
      }
    } catch (error) {
      console.error('載入體重記錄失敗:', error);
    }
  };

  const saveWeightRecords = (records: WeightRecord[]) => {
    try {
      localStorage.setItem('weight-records', JSON.stringify(records));
      setWeightRecords(records);
    } catch (error) {
      console.error('保存體重記錄失敗:', error);
    }
  };

  const handleAddWeight = () => {
    navigate('/add-weight');
  };

  const handleEditWeight = (record: WeightRecord) => {
    navigate(`/edit-weight/${record.id}`);
  };

  const handleDeleteWeight = (id: string) => {
    const updatedRecords = weightRecords.filter(record => record.id !== id);
    saveWeightRecords(updatedRecords);
  };

  // 移除模態框相關的保存函數


  // 移除未使用的 BMI 計算函數

  // 移除未使用的函數

  // 獲取當前體重
  const getCurrentWeight = (): number => {
    if (weightRecords.length === 0) return 0;
    const latestRecord = weightRecords[weightRecords.length - 1];
    return latestRecord.weight;
  };

  // 獲取體重趨勢
  const getWeightTrend = (): string => {
    if (weightRecords.length < 2) return 'stable';
    const latest = weightRecords[weightRecords.length - 1].weight;
    const previous = weightRecords[weightRecords.length - 2].weight;
    if (latest > previous) return 'up';
    if (latest < previous) return 'down';
    return 'stable';
  };

  return (
    <div className="weight-list-page">
      {/* 自定義導航欄 */}
      <header className="custom-header">
        <div className="header-content">
          <div 
            onClick={() => navigate('/')}
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
          
          <h1 className="header-title">{getText('weightManagement')}</h1>
        </div>
      </header>

      {/* 主要內容 */}
      <main className="main-content">
        {/* 當前體重卡片 */}
        <div className="current-weight-card">
          <div className="weight-value">{getCurrentWeight()}</div>
          <div className="weight-unit">{getText('kg')}</div>
          <div className="weight-trend">
            {getWeightTrend() === 'up' && '↗️'}
            {getWeightTrend() === 'down' && '↘️'}
            {getWeightTrend() === 'stable' && '→'}
          </div>
        </div>

        {/* 體重歷史 */}
        <div className="weight-history">
          <h2 className="section-title">{getText('weightHistory')}</h2>
          {weightRecords.length === 0 ? (
            <div className="empty-state">
              <p>還沒有體重記錄</p>
            </div>
          ) : (
            <div className="weight-records">
              {weightRecords.map((record) => (
                <div key={record.id} className="weight-record">
                  <div className="record-info">
                    <div className="record-weight">{record.weight} {getText('kg')}</div>
                    <div className="record-date">{record.date} {record.time}</div>
                    {record.bmi && (
                      <div className="record-bmi">
                        BMI: {record.bmi}
                      </div>
                    )}
                  </div>
                  <div className="record-actions">
                    <button 
                      onClick={() => handleEditWeight(record)}
                      className="edit-button"
                    >
                      {getText('edit')}
                    </button>
                    <button 
                      onClick={() => handleDeleteWeight(record.id)}
                      className="delete-button"
                    >
                      {getText('delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 浮動新增按鈕 */}
      <button 
        onClick={handleAddWeight}
        className="floating-add-button"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        {getText('addWeight')}
      </button>

    </div>
  );
};

export default WeightList;