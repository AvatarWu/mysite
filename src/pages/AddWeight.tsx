import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { healthDataService, WeightRecord } from '../services/HealthDataService';
import './AddWeight.css';

interface WeightFormData {
  weight: string;
  height: string;
  date: string;
  time: string;
  note: string;
}

const AddWeight: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<WeightFormData>({
    weight: '',
    height: '',
    date: '',
    time: '',
    note: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      loadRecord(id);
    } else {
      // 設定預設值
      const now = new Date();
      setFormData(prev => ({
        ...prev,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().slice(0, 5)
      }));
    }

  }, [isEdit, id]);

  const loadRecord = async (recordId: string) => {
    try {
      const records = await healthDataService.getWeightRecords();
      const record = records.find(r => r._id === recordId);
      if (record) {
        setFormData({
          weight: record.weight.toString(),
          height: record.height.toString(),
          date: record.date,
          time: '12:00', // WeightRecord 沒有 time 屬性，使用預設值
          note: record.note || ''
        });
      }
    } catch (error) {
      console.error('載入記錄失敗:', error);
    }
  };

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
        'addWeight': '新增體重',
        'editWeight': '編輯體重',
        'weight': '體重',
        'height': '身高',
        'date': '日期',
        'time': '時間',
        'note': '備註',
        'kg': '公斤',
        'cm': '公分',
        'bmi': 'BMI',
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
        'back': '返回',
        'save': '儲存',
        'saving': '儲存中...'
      },
      'zh-CN': {
        'addWeight': '新增体重',
        'editWeight': '编辑体重',
        'weight': '体重',
        'height': '身高',
        'date': '日期',
        'time': '时间',
        'note': '备注',
        'kg': '公斤',
        'cm': '公分',
        'bmi': 'BMI',
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
        'back': '返回',
        'save': '保存',
        'saving': '保存中...'
      },
      'en': {
        'addWeight': 'Add Weight',
        'editWeight': 'Edit Weight',
        'weight': 'Weight',
        'height': 'Height',
        'date': 'Date',
        'time': 'Time',
        'note': 'Notes',
        'kg': 'kg',
        'cm': 'cm',
        'bmi': 'BMI',
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
        'back': 'Back',
        'save': 'Save',
        'saving': 'Saving...'
      },
      'ja': {
        'addWeight': '体重追加',
        'editWeight': '体重編集',
        'weight': '体重',
        'height': '身長',
        'date': '日付',
        'time': '時間',
        'note': '備考',
        'kg': 'kg',
        'cm': 'cm',
        'bmi': 'BMI',
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
        'back': '戻る',
        'save': '保存',
        'saving': '保存中...'
      }
    };

    return texts[language as keyof typeof texts]?.[key as keyof typeof texts['zh-TW']] || key;
  };

  const handleInputChange = (field: keyof WeightFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 清除該欄位的錯誤
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // 數字輸入驗證
  const validateNumberInput = (value: string, type: 'weight' | 'height'): { isValid: boolean; errorMessage: string } => {
    if (!value.trim()) {
      return { isValid: false, errorMessage: '' };
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
      return { isValid: false, errorMessage: type === 'weight' ? getText('weightError') : getText('heightError') };
    }

    if (type === 'weight') {
      if (num < 20 || num > 300) {
        return { isValid: false, errorMessage: getText('weightError') };
      }
    } else {
      if (num < 100 || num > 250) {
        return { isValid: false, errorMessage: getText('heightError') };
      }
    }

    return { isValid: true, errorMessage: '' };
  };

  // BMI 計算
  const calculateBMI = (weight: number, height: number): number => {
    if (height <= 0) return 0;
    const heightInMeters = height / 100;
    return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
  };

  // 獲取 BMI 分類
  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  };

  // 獲取 BMI 建議
  const getBMIAdvice = (bmi: number): string => {
    const category = getBMICategory(bmi);
    const adviceKey = `bmiAdvice${category.charAt(0).toUpperCase() + category.slice(1)}`;
    return getText(adviceKey);
  };

  const handleSubmit = async () => {
    // 驗證表單
    const newErrors: Record<string, string> = {};

    if (!formData.weight.trim()) {
      newErrors.weight = getText('weightError');
    } else {
      const weightValidation = validateNumberInput(formData.weight, 'weight');
      if (!weightValidation.isValid) {
        newErrors.weight = weightValidation.errorMessage;
      }
    }

    if (!formData.height.trim()) {
      newErrors.height = getText('heightError');
    } else {
      const heightValidation = validateNumberInput(formData.height, 'height');
      if (!heightValidation.isValid) {
        newErrors.height = heightValidation.errorMessage;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // 保存記錄
      const weightNum = parseFloat(formData.weight);
      const heightNum = parseFloat(formData.height);
      const bmi = calculateBMI(weightNum, heightNum);

      const record: WeightRecord = {
        _id: id || Date.now().toString(),
        weight: weightNum,
        height: heightNum,
        date: formData.date,
        note: formData.note,
        bmi
      };

      if (isEdit) {
        await healthDataService.updateWeightRecord(id!, record);
      } else {
        await healthDataService.addWeightRecord(record);
      }

      // 返回體重管理頁面
      navigate('/weight-management');
    } catch (error) {
      console.error('保存失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 計算當前 BMI
  const currentBMI = formData.weight && formData.height ? 
    calculateBMI(parseFloat(formData.weight), parseFloat(formData.height)) : 0;
  const bmiCategory = currentBMI > 0 ? getBMICategory(currentBMI) : '';

  return (
    <div className="add-weight-page" style={{ backgroundColor: '#1a1a1a', color: '#ffffff', minHeight: '100vh' }}>
      {/* 自定義導航欄 - Apple 風格 */}
      <header className="custom-header">
        <div className="header-content">
          {/* 返回按鈕 - 絕對定位在左側 */}
          <div
            onClick={() => navigate('/weight-management')} 
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
            <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500' }}>{getText('back')}</span>
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
            {isEdit ? getText('editWeight') : getText('addWeight')}
          </div>
          
          {/* 保存按鈕 - 絕對定位在右側 */}
          <div
            onClick={handleSubmit}
            className="custom-save-btn"
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#000000',
              border: '1px solid #000000',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              minWidth: '60px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001
            }}
          >
            {loading ? getText('saving') : getText('save')}
          </div>
        </div>
      </header>

      {/* 主要內容區域 */}
      <main className="main-content" style={{ backgroundColor: '#1a1a1a', color: '#ffffff', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <form id="weight-form" onSubmit={handleSubmit} className="weight-form" style={{ backgroundColor: 'transparent' }}>
          {/* 體重和身高輸入 */}
          <div className="form-section" style={{ backgroundColor: '#1c1c1e', border: '0.5px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h2 className="section-title" style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>{getText('weight')} & {getText('height')}</h2>
            <div className="input-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-group">
                <label className="input-label" style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>{getText('weight')} ({getText('kg')})</label>
                <input
                  type="text"
                  className={`form-input ${errors.weight ? 'error' : ''}`}
                  value={formData.weight}
                  onChange={(e) => {
                    const filteredValue = e.target.value.replace(/[^0-9.]/g, '');
                    handleInputChange('weight', filteredValue);
                  }}
                  placeholder="70.5"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: `1px solid ${errors.weight ? '#ff3b30' : '#38383a'}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#2c2c2e',
                    color: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.weight && <span style={{ color: '#ff3b30', fontSize: '14px', marginTop: '4px' }}>{errors.weight}</span>}
              </div>
              
              <div className="input-group">
                <label className="input-label" style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>{getText('height')} ({getText('cm')})</label>
                <input
                  type="text"
                  className={`form-input ${errors.height ? 'error' : ''}`}
                  value={formData.height}
                  onChange={(e) => {
                    const filteredValue = e.target.value.replace(/[^0-9]/g, '');
                    handleInputChange('height', filteredValue);
                  }}
                  placeholder="170"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: `1px solid ${errors.height ? '#ff3b30' : '#38383a'}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#2c2c2e',
                    color: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.height && <span style={{ color: '#ff3b30', fontSize: '14px', marginTop: '4px' }}>{errors.height}</span>}
              </div>
            </div>
          </div>

          {/* BMI 顯示區域 */}
          {currentBMI > 0 && (
            <div className="bmi-section" style={{ backgroundColor: '#1c1c1e', border: '0.5px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
              <h2 className="section-title" style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>{getText('bmi')}</h2>
              <div className="bmi-display">
                <div className="bmi-value" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span className="bmi-number" style={{ fontSize: '36px', fontWeight: '700', color: '#007aff' }}>{currentBMI}</span>
                  <span className="bmi-label" style={{ fontSize: '18px', color: '#8e8e93' }}>{getText('bmi')}</span>
                </div>
                <div className={`bmi-category ${bmiCategory}`} style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  display: 'inline-block',
                  background: bmiCategory === 'normal' ? '#d4edda' : bmiCategory === 'underweight' ? '#cce5ff' : bmiCategory === 'overweight' ? '#fff3cd' : '#f8d7da',
                  color: bmiCategory === 'normal' ? '#155724' : bmiCategory === 'underweight' ? '#004085' : bmiCategory === 'overweight' ? '#856404' : '#721c24'
                }}>
                  {getText(bmiCategory)}
                </div>
                <div className="bmi-advice" style={{ fontSize: '14px', color: '#8e8e93', lineHeight: '1.4' }}>
                  {getBMIAdvice(currentBMI)}
                </div>
              </div>
            </div>
          )}

          {/* 日期和時間 */}
          <div className="form-section" style={{ backgroundColor: '#1c1c1e', border: '0.5px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h2 className="section-title" style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>{getText('date')} & {getText('time')}</h2>
            <div className="input-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-group">
                <label className="input-label" style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>{getText('date')}</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #38383a',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#2c2c2e',
                    color: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div className="input-group">
                <label className="input-label" style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>{getText('time')}</label>
                <input
                  type="time"
                  className="form-input"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #38383a',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#2c2c2e',
                    color: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          {/* 備註 */}
          <div className="form-section" style={{ backgroundColor: '#1c1c1e', border: '0.5px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h2 className="section-title" style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>{getText('note')}</h2>
            <div className="input-group">
              <textarea
                className="form-textarea"
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                placeholder={getText('note')}
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #38383a',
                  borderRadius: '8px',
                  fontSize: '16px',
                  backgroundColor: '#2c2c2e',
                  color: '#ffffff',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  minHeight: '80px',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddWeight;