// src/pages/AddMedication.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { healthDataService } from '../services/HealthDataService';
import './AddMedication.css';

interface TimeSlot {
  time: string;
  enabled: boolean;
}

const AddMedication: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    unit: 'mg',
    frequency: 'three-times',
    timeSlots: [
      { time: '09:00', enabled: true },
      { time: '12:00', enabled: true },
      { time: '16:00', enabled: true }
    ],
    notes: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleBack = () => {
    navigate('/medications');
  };

  const handleSave = async () => {
    // 驗證表單
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '請輸入藥物名稱';
    }
    
    if (!formData.dosage.trim()) {
      newErrors.dosage = '請輸入劑量';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 清除錯誤
    setErrors({});
    setIsSaving(true);

    try {
      // 準備數據以符合 MedicationRecord 接口
      const medicationData = {
        name: formData.name.trim(),
        dosage: formData.dosage.trim(),
        frequency: formData.frequency,
        timeSlots: formData.timeSlots.filter(slot => slot.enabled),
        reminderEnabled: true,
        startDate: new Date().toISOString().split('T')[0], // 今天的日期
        note: formData.notes.trim() || undefined
      };

      // 使用 HealthDataService 保存數據
      const savedRecord = await healthDataService.addMedicationRecord(medicationData);
      console.log('用藥提醒已保存:', savedRecord);
      
      // 顯示成功提示
      setShowSuccessModal(true);
      
      // 2秒後自動返回用藥管理頁面
      setTimeout(() => {
        navigate('/medications');
      }, 2000);
    } catch (error) {
      console.error('保存用藥提醒失敗:', error);
      alert('保存失敗，請重試');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 清除該字段的錯誤
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // 當服用頻率改變時，自動調整提醒時間數量
    if (field === 'frequency') {
      let targetTimeSlotsCount = 1;
      
      switch (value) {
        case 'daily':
          targetTimeSlotsCount = 1;
          break;
        case 'twice-daily':
          targetTimeSlotsCount = 2;
          break;
        case 'three-times':
          targetTimeSlotsCount = 3;
          break;
        case 'weekly':
          targetTimeSlotsCount = 1;
          break;
        case 'as-needed':
          targetTimeSlotsCount = 1;
          break;
        default:
          targetTimeSlotsCount = 1;
      }
      
      // 調整時間槽數量
      const currentTimeSlots = [...formData.timeSlots];
      if (currentTimeSlots.length < targetTimeSlotsCount) {
        // 需要增加時間槽
        while (currentTimeSlots.length < targetTimeSlotsCount) {
          const newTime = `${12 + currentTimeSlots.length}:00`;
          currentTimeSlots.push({ time: newTime, enabled: true });
        }
      } else if (currentTimeSlots.length > targetTimeSlotsCount) {
        // 需要減少時間槽
        currentTimeSlots.splice(targetTimeSlotsCount);
      }
      
      setFormData(current => ({ ...current, timeSlots: currentTimeSlots }));
    }
  };

  const handleTimeSlotChange = (index: number, enabled: boolean) => {
    const newTimeSlots = [...formData.timeSlots];
    newTimeSlots[index].enabled = enabled;
    setFormData(prev => ({ ...prev, timeSlots: newTimeSlots }));
  };

  const handleTimeChange = (index: number, time: string) => {
    const newTimeSlots = [...formData.timeSlots];
    newTimeSlots[index].time = time;
    setFormData(prev => ({ ...prev, timeSlots: newTimeSlots }));
  };

  const addTimeSlot = () => {
    const newTimeSlot: TimeSlot = { time: '12:00', enabled: true };
    setFormData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, newTimeSlot]
    }));
  };

  // 移除時間槽功能（目前未使用，保留以備將來擴展）
  // const removeTimeSlot = (index: number) => {
  //   if (formData.timeSlots.length > 1) {
  //     const newTimeSlots = formData.timeSlots.filter((_, i) => i !== index);
  //     setFormData(prev => ({ ...prev, timeSlots: newTimeSlots }));
  //   }
  // };

  // 將24小時制時間轉換為精確的中文時間格式（符合截圖）
  // const formatTimeToChinese = (time: string) => {
  //   const [hours, minutes] = time.split(':').map(Number);
  //   const hour = hours;
  //   const minute = minutes;
  //   
  //   if (hour < 6) return `凌晨${hour}:${minute.toString().padStart(2, '0')}`;
  //   if (hour < 12) return `上午${hour}:${minute.toString().padStart(2, '0')}`;
  //   if (hour === 12) return `中午${hour}:${minute.toString().padStart(2, '0')}`;
  //   if (hour < 18) return `下午${hour}:${minute.toString().padStart(2, '0')}`;
  //   return `晚上${hour}:${minute.toString().padStart(2, '0')}`;
  // };

  const isFormValid = Boolean(formData.name.trim() && formData.dosage.trim());
  
  // 調試信息
  console.log('表單驗證狀態:', {
    name: formData.name.trim(),
    dosage: formData.dosage.trim(),
    isFormValid,
    isSaving,
    buttonClass: `save-button ${isFormValid && !isSaving ? 'active' : 'disabled'}`,
    buttonDisabled: !isFormValid || isSaving
  });

  return (
    <div className="add-medication-page">
      {/* 自定義導航欄 - Apple 風格 */}
      <header className="custom-header">
        <div className="header-content">
          {/* 返回按鈕 - 絕對定位在左側 */}
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
              letterSpacing: '-0.3px',
              backgroundColor: 'transparent',
              zIndex: 1000
            }}
          >
            新增用藥
          </div>
          
          {/* 保存按鈕 - 絕對定位在右側 */}
          <div
            onClick={handleSave}
            className="custom-save-btn"
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: isFormValid && !isSaving ? '#000000' : '#8e8e93',
              border: `1px solid ${isFormValid && !isSaving ? '#000000' : '#8e8e93'}`,
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isFormValid && !isSaving ? 'pointer' : 'not-allowed',
              minWidth: '60px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001,
              userSelect: 'none',
              WebkitUserSelect: 'none',
              touchAction: 'manipulation',
              opacity: isFormValid && !isSaving ? 1 : 0.6
            }}
          >
            {isSaving ? '儲存中...' : '完成'}
          </div>
        </div>
      </header>

      {/* 主要內容區域 */}
      <main className="main-content">
        {/* 基本資料 */}
        <section className="form-section">
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3.5.5-5 1.5-1.5-1-3.24-1.5-5-1.5A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7 7-7z"/>
            </svg>
            基本資料
          </h3>

          <div className="input-group">
            <label className={`input-label ${errors.name ? 'error' : ''} required`}>
              藥物名稱
            </label>
            <input
              id="medication-name"
              type="text"
              className={`input-field ${errors.name ? 'error' : ''}`}
              placeholder="請輸入藥物名稱"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
            {errors.name && (
              <div className="error-message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {errors.name}
              </div>
            )}
          </div>

          <div className="input-group">
            <label className={`input-label ${errors.dosage ? 'error' : ''} required`}>
              劑量
            </label>
            <input
              id="medication-dosage"
              type="text"
              className={`input-field ${errors.dosage ? 'error' : ''}`}
              placeholder="劑量"
              value={formData.dosage}
              onChange={(e) => handleInputChange('dosage', e.target.value)}
              inputMode="decimal"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
            {errors.dosage && (
              <div className="error-message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {errors.dosage}
              </div>
            )}
          </div>

          <div className="input-group">
            <label className="input-label">單位</label>
            <select
              className="select-field"
              value={formData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
            >
              <option value="mg">毫克</option>
              <option value="g">公克</option>
              <option value="ml">毫升</option>
              <option value="tablet">錠</option>
              <option value="capsule">膠囊</option>
              <option value="drop">滴</option>
              <option value="IU">國際單位</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">服用頻率</label>
            <select
              className="select-field"
              value={formData.frequency}
              onChange={(e) => handleInputChange('frequency', e.target.value)}
            >
              <option value="daily">每日</option>
              <option value="twice-daily">每日兩次</option>
              <option value="three-times">每日三次</option>
              <option value="weekly">每週</option>
              <option value="as-needed">需要時</option>
            </select>
          </div>
        </section>

        {/* 提醒時間 */}
        <section className="reminder-section">
          <div className="reminder-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            <h3>提醒時間</h3>
          </div>

          {formData.timeSlots.map((slot, index) => (
            <div key={index} className="time-slot">
              <input
                type="time"
                className="time-input"
                value={slot.time}
                onChange={(e) => handleTimeChange(index, e.target.value)}
              />
              <div
                className={`toggle-switch ${slot.enabled ? 'active' : ''}`}
                onClick={() => handleTimeSlotChange(index, !slot.enabled)}
              />
            </div>
          ))}

          <button
            type="button"
            className="add-reminder-button"
            onClick={addTimeSlot}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            新增提醒時間
          </button>
        </section>

        {/* 備註 */}
        <section className="notes-section">
          <div className="notes-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            <h3>備註</h3>
          </div>
          <textarea
            className="notes-textarea"
            placeholder="請輸入備註（選填）"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={4}
          />
        </section>
      </main>

      {/* 成功模態框 */}
      {showSuccessModal && (
        <div className="success-modal">
          <div className="modal-content">
            <div className="success-icon">✓</div>
            <h3 className="modal-title">保存成功！</h3>
            <p className="modal-message">用藥提醒已成功保存，即將返回用藥管理頁面</p>
            <button
              className="ok-button"
              onClick={() => setShowSuccessModal(false)}
            >
              確定
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMedication; 