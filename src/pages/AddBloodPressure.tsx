import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { healthDataService, BloodPressureRecord } from '../services/HealthDataService';
import './AddBloodPressure.css';

const AddBloodPressure: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
    pulse: '',
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
      const records = await healthDataService.getBloodPressureRecords();
      const record = records.find(r => r._id === recordId);
      if (record) {
        setFormData({
          systolic: record.systolic.toString(),
          diastolic: record.diastolic.toString(),
          pulse: record.pulse.toString(),
          date: record.date,
          time: record.time,
          note: record.note || ''
        });
      } else {
        alert('找不到該記錄');
        navigate('/blood-pressure');
      }
    } catch (error) {
      console.error('載入記錄失敗:', error);
      alert('載入記錄失敗');
      navigate('/blood-pressure');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.systolic || isNaN(Number(formData.systolic))) {
      newErrors.systolic = '請輸入有效的收縮壓數值';
    } else if (Number(formData.systolic) < 50 || Number(formData.systolic) > 300) {
      newErrors.systolic = '收縮壓數值應在 50-300 之間';
    }

    if (!formData.diastolic || isNaN(Number(formData.diastolic))) {
      newErrors.diastolic = '請輸入有效的舒張壓數值';
    } else if (Number(formData.diastolic) < 30 || Number(formData.diastolic) > 200) {
      newErrors.diastolic = '舒張壓數值應在 30-200 之間';
    }

    if (!formData.pulse || isNaN(Number(formData.pulse))) {
      newErrors.pulse = '請輸入有效的脈搏數值';
    } else if (Number(formData.pulse) < 30 || Number(formData.pulse) > 200) {
      newErrors.pulse = '脈搏數值應在 30-200 之間';
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
      const recordData: Omit<BloodPressureRecord, '_id'> = {
        systolic: Number(formData.systolic),
        diastolic: Number(formData.diastolic),
        pulse: Number(formData.pulse),
        date: formData.date,
        time: formData.time,
        note: formData.note
      };

      if (isEdit && id) {
        await healthDataService.updateBloodPressureRecord(id, recordData);
        alert('血壓記錄已更新');
      } else {
        await healthDataService.addBloodPressureRecord(recordData);
        alert('血壓記錄已新增');
      }

      navigate('/blood-pressure');
    } catch (error) {
      console.error('儲存失敗:', error);
      alert('儲存失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除該欄位的錯誤
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="add-blood-pressure-page" style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
      {/* 自定義導航欄 - Apple 風格 */}
      <header className="custom-header" style={{ 
        backgroundColor: '#000000',
        borderBottom: '0.5px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="header-content" style={{ position: 'relative', height: '44px', display: 'flex', alignItems: 'center' }}>
          {/* 返回按鈕 - 絕對定位在左側 */}
          <div 
            onClick={() => navigate('/blood-pressure')} 
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
            <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500' }}>返回</span>
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
            {isEdit ? '編輯血壓記錄' : '新增血壓記錄'}
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
            {loading ? '儲存中...' : '儲存'}
          </div>
        </div>
      </header>

      {/* 主要內容區域 */}
      <main className="main-content" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
        <form onSubmit={handleSubmit} className="blood-pressure-form" style={{ backgroundColor: 'transparent' }}>
          {/* 血壓數值 */}
          <div className="form-section" style={{ backgroundColor: '#1c1c1e', border: '0.5px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h2 className="section-title" style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>血壓數值</h2>
            <div className="blood-pressure-inputs">
              <div className="input-group">
                <label className="input-label" style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>收縮壓 (mmHg)</label>
                <input
                  type="number"
                  className={`form-input ${errors.systolic ? 'error' : ''}`}
                  value={formData.systolic}
                  onChange={(e) => handleInputChange('systolic', e.target.value)}
                  placeholder="120"
                  min="50"
                  max="300"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #38383a',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#1c1c1e',
                    color: '#ffffff'
                  }}
                />
                {errors.systolic && <span className="error-message">{errors.systolic}</span>}
              </div>
              
              <div className="input-group">
                <label className="input-label" style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>舒張壓 (mmHg)</label>
                <input
                  type="number"
                  className={`form-input ${errors.diastolic ? 'error' : ''}`}
                  value={formData.diastolic}
                  onChange={(e) => handleInputChange('diastolic', e.target.value)}
                  placeholder="80"
                  min="30"
                  max="200"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #38383a',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#1c1c1e',
                    color: '#ffffff'
                  }}
                />
                {errors.diastolic && <span className="error-message">{errors.diastolic}</span>}
              </div>
            </div>
            
            <div className="input-group">
              <label className="input-label" style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>脈搏 (bpm)</label>
              <input
                type="number"
                className={`form-input ${errors.pulse ? 'error' : ''}`}
                value={formData.pulse}
                onChange={(e) => handleInputChange('pulse', e.target.value)}
                placeholder="80"
                min="30"
                max="200"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #38383a',
                  borderRadius: '8px',
                  fontSize: '16px',
                  backgroundColor: '#1c1c1e',
                  color: '#ffffff'
                }}
              />
              {errors.pulse && <span className="error-message">{errors.pulse}</span>}
            </div>
          </div>

          {/* 時間記錄 */}
          <div className="form-section" style={{ backgroundColor: '#1c1c1e', border: '0.5px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h2 className="section-title" style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>時間記錄</h2>
            <div className="time-inputs">
              <div className="input-group">
                <label className="input-label" style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>日期</label>
                <input
                  type="date"
                  className={`form-input ${errors.date ? 'error' : ''}`}
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #38383a',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#1c1c1e',
                    color: '#ffffff'
                  }}
                />
                {errors.date && <span className="error-message">{errors.date}</span>}
              </div>
              
              <div className="input-group">
                <label className="input-label" style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>時間</label>
                <input
                  type="time"
                  className={`form-input ${errors.time ? 'error' : ''}`}
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #38383a',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#1c1c1e',
                    color: '#ffffff'
                  }}
                />
                {errors.time && <span className="error-message">{errors.time}</span>}
              </div>
            </div>
          </div>

          {/* 備註 */}
          <div className="form-section" style={{ backgroundColor: '#1c1c1e', border: '0.5px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h2 className="section-title" style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>備註</h2>
            <div className="input-group">
              <label className="input-label" style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>備註 (選填)</label>
              <textarea
                className="form-textarea"
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                placeholder="記錄任何相關的症狀或情況..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #38383a',
                  borderRadius: '8px',
                  fontSize: '16px',
                  backgroundColor: '#1c1c1e',
                  color: '#ffffff',
                  resize: 'vertical',
                  minHeight: '80px'
                }}
              />
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddBloodPressure;