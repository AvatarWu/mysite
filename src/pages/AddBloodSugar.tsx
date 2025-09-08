import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddBloodSugar.css';

interface BloodSugarFormData {
  value: string;
  unit: string;
  date: string;
  time: string;
  note: string;
}

const AddBloodSugar: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<BloodSugarFormData>({
    value: '',
    unit: 'mg/dL',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    note: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      loadRecord(id);
    }
  }, [isEdit, id]);

  const loadRecord = async (recordId: string) => {
    try {
      // 模擬載入記錄數據
      console.log('載入記錄:', recordId);
    } catch (error) {
      console.error('載入記錄失敗:', error);
    }
  };

  const handleInputChange = (field: keyof BloodSugarFormData, value: string) => {
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.value.trim()) {
      newErrors.value = '請輸入血糖值';
    } else {
      const value = parseFloat(formData.value);
      if (isNaN(value) || value < 0 || value > 1000) {
        newErrors.value = '請輸入有效的血糖值 (0-1000)';
      }
    }

    if (!formData.date) {
      newErrors.date = '請選擇日期';
    }

    if (!formData.time) {
      newErrors.time = '請選擇時間';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // 模擬保存數據
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('保存血糖記錄:', formData);
      navigate('/blood-sugar');
    } catch (error) {
      console.error('保存失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-blood-sugar-page" style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
      {/* 自定義導航欄 - Apple 風格 */}
      <header className="custom-header" style={{ 
        backgroundColor: '#000000',
        borderBottom: '0.5px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="header-content">
          <div 
            onClick={() => navigate('/blood-sugar')} 
            className="custom-back-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#007aff',
              padding: '8px 12px',
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
            {isEdit ? '編輯血糖記錄' : '新增血糖記錄'}
          </div>
          <button
            type="submit"
            form="blood-sugar-form"
            className="custom-save-btn"
            disabled={loading}
            style={{
              background: '#007aff',
              border: 'none',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              position: 'absolute',
              right: '20px',
              zIndex: 1001,
              minWidth: '60px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500' }}>
              {loading ? '保存中...' : '保存'}
            </span>
          </button>
        </div>
      </header>

      {/* 主要內容區域 */}
      <main className="main-content" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
        <form id="blood-sugar-form" onSubmit={handleSubmit} style={{ backgroundColor: 'transparent' }}>
          {/* 血糖值輸入 */}
          <div className="form-section" style={{ backgroundColor: '#1c1c1e', border: '0.5px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h2 className="section-title" style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>血糖值</h2>
            <div className="form-group">
              <label className="form-label" style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                血糖值
              </label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ flex: '2' }}>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.value}
                    onChange={(e) => handleInputChange('value', e.target.value)}
                    placeholder="請輸入血糖值"
                    style={{
                      backgroundColor: '#1c1c1e',
                      border: '1px solid #38383a',
                      color: '#ffffff',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '16px',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                  {errors.value && (
                    <div className="error-message" style={{ color: '#FF3B30' }}>
                      {errors.value}
                    </div>
                  )}
                </div>
                <div style={{ flex: '1' }}>
                  <select
                    className="form-input"
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    style={{
                      backgroundColor: '#1c1c1e',
                      border: '1px solid #38383a',
                      color: '#ffffff',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '16px',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="mg/dL" style={{ backgroundColor: '#1c1c1e', color: '#ffffff' }}>mg/dL</option>
                    <option value="mmol/L" style={{ backgroundColor: '#1c1c1e', color: '#ffffff' }}>mmol/L</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 日期和時間 */}
          <div className="form-section" style={{ backgroundColor: '#1c1c1e', border: '0.5px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h2 className="section-title" style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>測量時間</h2>
            <div className="form-group">
              <label className="form-label" style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                測量時間
              </label>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '12px' 
              }}>
                <div>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    style={{
                      backgroundColor: '#1c1c1e',
                      border: '1px solid #38383a',
                      color: '#ffffff',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '16px',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                  {errors.date && (
                    <div className="error-message" style={{ color: '#FF3B30' }}>
                      {errors.date}
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="time"
                    className="form-input"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    style={{
                      backgroundColor: '#1c1c1e',
                      border: '1px solid #38383a',
                      color: '#ffffff',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '16px',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                  {errors.time && (
                    <div className="error-message" style={{ color: '#FF3B30' }}>
                      {errors.time}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 備註 */}
          <div className="form-section" style={{ backgroundColor: '#1c1c1e', border: '0.5px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h2 className="section-title" style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>備註</h2>
            <div className="form-group">
              <label className="form-label" style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                備註 (選填)
              </label>
              <textarea
                className="form-textarea"
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                placeholder="例如：餐前、餐後2小時、運動後等"
                rows={3}
                style={{
                  backgroundColor: '#1c1c1e',
                  border: '1px solid #38383a',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '16px',
                  width: '100%',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  minHeight: '100px',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          {/* 參考信息 */}
          <div className="reference-section" style={{ 
            backgroundColor: '#1c1c1e', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '20px',
            marginTop: '20px'
          }}>
            <div className="title" style={{ color: '#ffffff', fontSize: '17px', fontWeight: '600', marginBottom: '12px' }}>
              血糖參考值
            </div>
            <div className="content" style={{ color: '#8e8e93', fontSize: '15px', lineHeight: '1.5' }}>
              <div>• 正常：70-140 mg/dL (3.9-7.8 mmol/L)</div>
              <div>• 餐前：70-130 mg/dL (3.9-7.2 mmol/L)</div>
              <div>• 餐後2小時：&lt;180 mg/dL (&lt;10.0 mmol/L)</div>
              <div>• 低血糖：&lt;70 mg/dL (&lt;3.9 mmol/L)</div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddBloodSugar;