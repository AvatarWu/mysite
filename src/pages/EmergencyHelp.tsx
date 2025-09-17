import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmergencyHelp.css';
import { themeService } from '../services/ThemeService';

interface EmergencyContact {
  _id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MedicalInfo {
  bloodType: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  emergencyNotes: string;
}

const EmergencyHelp: React.FC = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>({
    bloodType: '',
    allergies: [],
    medications: [],
    conditions: [],
    emergencyNotes: ''
  });
  const [showAddContact, setShowAddContact] = useState(false);
  const [showMedicalInfo, setShowMedicalInfo] = useState(false);

  // 應用主題到頁面
  useEffect(() => {
    // 應用主題
    themeService.applyTheme();

    // 監聽主題變更
    const cleanupTheme = themeService.onThemeChange(() => {
      console.log('EmergencyHelp.tsx: 主題變更，重新應用');
      themeService.applyTheme();
    });

    // 監聽系統主題變更
    const cleanupSystemTheme = themeService.onSystemThemeChange(() => {
      console.log('EmergencyHelp.tsx: 系統主題變更，重新應用');
      themeService.applyTheme();
    });

    // 監聽自定義主題變更事件
    const handleThemeChange = (event: CustomEvent) => {
      console.log('EmergencyHelp.tsx: 收到主題變更事件:', event.detail);
      themeService.applyTheme();
    };
    
    const handleLanguageChange = (_event: CustomEvent) => {
      // 重新載入頁面以應用語言變更
      window.location.reload();
    };
    
    window.addEventListener('themeChanged', handleThemeChange as EventListener);
    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      cleanupTheme();
      cleanupSystemTheme();
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  useEffect(() => {
    loadEmergencyData();
    
    // 監聽頁面可見性變化，當頁面重新可見時重新載入數據
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('頁面重新可見，重新載入緊急數據');
        loadEmergencyData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadEmergencyData = () => {
    try {
      // 載入緊急聯絡人
      const savedContacts = localStorage.getItem('emergencyContacts');
      console.log('載入緊急聯絡人數據:', savedContacts);
      if (savedContacts) {
        const parsedContacts = JSON.parse(savedContacts);
        console.log('解析後的聯絡人數據:', parsedContacts);
        setContacts(parsedContacts);
      } else {
        console.log('沒有找到保存的聯絡人數據');
        setContacts([]);
      }

      // 載入醫療資訊
      const savedMedicalInfo = localStorage.getItem('medicalInfo');
      if (savedMedicalInfo) {
        const parsed = JSON.parse(savedMedicalInfo);
        // 確保數組字段正確初始化
        setMedicalInfo({
          bloodType: parsed.bloodType || '',
          allergies: Array.isArray(parsed.allergies) ? parsed.allergies : 
                    (typeof parsed.allergies === 'string' && parsed.allergies.trim() ? 
                     parsed.allergies.split(',').map((item: string) => item.trim()).filter((item: string) => item) : []),
          medications: Array.isArray(parsed.medications) ? parsed.medications : 
                      (typeof parsed.medications === 'string' && parsed.medications.trim() ? 
                       parsed.medications.split('\n').map((item: string) => item.trim()).filter((item: string) => item) : []),
          conditions: Array.isArray(parsed.conditions) ? parsed.conditions : 
                     (typeof parsed.conditions === 'string' && parsed.conditions.trim() ? 
                      parsed.conditions.split(',').map((item: string) => item.trim()).filter((item: string) => item) : []),
          emergencyNotes: parsed.emergencyNotes || parsed.emergencyNote || ''
        });
        console.log('載入醫療資訊:', parsed);
        console.log('轉換後的醫療資訊:', {
          bloodType: parsed.bloodType || '',
          allergies: Array.isArray(parsed.allergies) ? parsed.allergies : 
                    (typeof parsed.allergies === 'string' && parsed.allergies.trim() ? 
                     parsed.allergies.split(',').map((item: string) => item.trim()).filter((item: string) => item) : []),
          medications: Array.isArray(parsed.medications) ? parsed.medications : 
                      (typeof parsed.medications === 'string' && parsed.medications.trim() ? 
                       parsed.medications.split('\n').map((item: string) => item.trim()).filter((item: string) => item) : []),
          conditions: Array.isArray(parsed.conditions) ? parsed.conditions : 
                     (typeof parsed.conditions === 'string' && parsed.conditions.trim() ? 
                      parsed.conditions.split(',').map((item: string) => item.trim()).filter((item: string) => item) : []),
          emergencyNotes: parsed.emergencyNotes || parsed.emergencyNote || ''
        });
      }
    } catch (error) {
      console.error('載入緊急數據失敗:', error);
    }
  };


  const addContact = (contact: Omit<EmergencyContact, '_id' | 'createdAt' | 'updatedAt'>) => {
    const newContact: EmergencyContact = {
      ...contact,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setContacts(prev => {
      const updated = [...prev, newContact];
      // 使用更新後的狀態保存數據
      localStorage.setItem('emergencyContacts', JSON.stringify(updated));
      console.log('新增聯絡人並保存:', newContact);
      console.log('更新後的聯絡人列表:', updated);
      return updated;
    });
  };


  const deleteContact = (id: string) => {
    setContacts(prev => {
      const updated = prev.filter(contact => contact._id !== id);
      // 使用更新後的狀態保存數據
      localStorage.setItem('emergencyContacts', JSON.stringify(updated));
      console.log('刪除聯絡人並保存:', id);
      console.log('更新後的聯絡人列表:', updated);
      return updated;
    });
  };

  const callContact = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const updateMedicalInfo = (updates: Partial<MedicalInfo>) => {
    const updated = { ...medicalInfo, ...updates };
    setMedicalInfo(updated);
    
    // 保存到 localStorage
    try {
      localStorage.setItem('medicalInfo', JSON.stringify(updated));
      console.log('醫療資訊已保存:', updated);
    } catch (error) {
      console.error('保存醫療資訊失敗:', error);
    }
  };

  // const primaryContact = contacts.find(contact => contact.isPrimary);

  return (
    <div className="emergency-help-page" style={{ minHeight: '100vh' }}>
      {/* 自定義導航欄 - Apple 風格 */}
      <header className="custom-header">
        <div className="header-content">
          <div 
            onClick={() => navigate('/')} 
            className="custom-back-btn"
            style={{
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
            緊急求助
          </div>
        </div>
      </header>

      {/* 主要內容區域 */}
      <main className="main-content">
        {/* 統計概覽 */}
        <div className="stats-overview">
          <div className="stats-grid">
            <div className="stat-card emergency-card">
              <div className="stat-icon">🚨</div>
              <div className="stat-value">緊急</div>
              <div className="stat-label">求助</div>
            </div>
            <div className="stat-card contacts-card">
              <div className="stat-icon">👥</div>
              <div className="stat-value">{contacts.length}</div>
              <div className="stat-label">聯絡人</div>
            </div>
            <div className="stat-card medical-card">
              <div className="stat-icon">🏥</div>
              <div className="stat-value">醫療</div>
              <div className="stat-label">資訊</div>
            </div>
          </div>
        </div>

        {/* 緊急撥號區域 */}
        <div className="emergency-call-section">
          <div className="section-header">
            <h2 className="section-title">緊急情況</h2>
            <p className="section-description">如遇緊急情況，請立即撥打以下電話</p>
          </div>
          
          <div className="emergency-buttons">
            <button 
              className="emergency-btn police-btn"
              onClick={() => callContact('110')}
            >
              <div className="btn-icon">🚔</div>
              <div className="btn-content">
                <div className="btn-title">報警</div>
                <div className="btn-subtitle">110</div>
              </div>
            </button>
            
            <button 
              className="emergency-btn ambulance-btn"
              onClick={() => callContact('119')}
            >
              <div className="btn-icon">🚑</div>
              <div className="btn-content">
                <div className="btn-title">救護車</div>
                <div className="btn-subtitle">119</div>
              </div>
            </button>
          </div>
        </div>

        {/* 緊急聯絡人列表 */}
        <div className="contacts-section">
          <div className="section-header">
            <h3 className="section-title">緊急聯絡人</h3>
            <button 
              className="add-btn"
              onClick={() => setShowAddContact(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              新增
            </button>
          </div>

          <div className="contacts-list">
            {contacts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <div className="empty-title">尚無緊急聯絡人</div>
                <div className="empty-subtitle">點擊「新增」按鈕開始添加</div>
              </div>
            ) : (
              contacts.map(contact => (
                <div key={contact._id} className="contact-card">
                  <div className="contact-avatar">
                    <div className="avatar-text">{contact.name.charAt(0)}</div>
                  </div>
                  <div className="contact-info">
                    <div className="contact-name">
                      {contact.name}
                      {contact.isPrimary && <span className="primary-badge">主要</span>}
                    </div>
                    <div className="contact-relationship">{contact.relationship}</div>
                    <div className="contact-phone">{contact.phone}</div>
                  </div>
                  <div className="contact-actions">
                    <button 
                      className="action-btn call-btn"
                      onClick={() => callContact(contact.phone)}
                      title="撥打電話"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </button>
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => {/* TODO: 編輯聯絡人 */}}
                      title="編輯聯絡人"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => deleteContact(contact._id)}
                      title="刪除聯絡人"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 醫療資訊 */}
        <div className="medical-info-section">
          <div className="section-header">
            <h3 className="section-title">醫療資訊</h3>
            <button 
              className="edit-btn"
              onClick={() => setShowMedicalInfo(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              編輯
            </button>
          </div>

          <div className="medical-info-card">
            <div className="medical-item">
              <div className="medical-icon">🩸</div>
              <div className="medical-content">
                <div className="medical-label">血型</div>
                <div className="medical-value">{medicalInfo.bloodType || '未設定'}</div>
              </div>
            </div>
            <div className="medical-item">
              <div className="medical-icon">⚠️</div>
              <div className="medical-content">
                <div className="medical-label">過敏史</div>
                <div className="medical-value">
                  {Array.isArray(medicalInfo.allergies) && medicalInfo.allergies.length > 0 ? medicalInfo.allergies.join(', ') : '無'}
                </div>
              </div>
            </div>
            <div className="medical-item">
              <div className="medical-icon">💊</div>
              <div className="medical-content">
                <div className="medical-label">常用藥物</div>
                <div className="medical-value">
                  {Array.isArray(medicalInfo.medications) && medicalInfo.medications.length > 0 ? medicalInfo.medications.join(', ') : '無'}
                </div>
              </div>
            </div>
            <div className="medical-item">
              <div className="medical-icon">🏥</div>
              <div className="medical-content">
                <div className="medical-label">慢性病</div>
                <div className="medical-value">
                  {Array.isArray(medicalInfo.conditions) && medicalInfo.conditions.length > 0 ? medicalInfo.conditions.join(', ') : '無'}
                </div>
              </div>
            </div>
            {medicalInfo.emergencyNotes && (
              <div className="medical-item">
                <div className="medical-icon">📝</div>
                <div className="medical-content">
                  <div className="medical-label">緊急備註</div>
                  <div className="medical-value">{medicalInfo.emergencyNotes}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 新增聯絡人模態框 */}
      {showAddContact && (
        <AddContactModal
          onClose={() => setShowAddContact(false)}
          onSave={addContact}
        />
      )}

      {/* 編輯醫療資訊模態框 */}
      {showMedicalInfo && (
        <MedicalInfoModal
          onClose={() => setShowMedicalInfo(false)}
          onSave={updateMedicalInfo}
          medicalInfo={medicalInfo}
        />
      )}
    </div>
  );
};

// 新增聯絡人模態框組件
interface AddContactModalProps {
  onClose: () => void;
  onSave: (contact: Omit<EmergencyContact, '_id' | 'createdAt' | 'updatedAt'>) => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
    isPrimary: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">新增緊急聯絡人</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">姓名</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="請輸入姓名"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">電話號碼</label>
            <input
              type="tel"
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="請輸入電話號碼"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">關係</label>
            <input
              type="text"
              className="form-input"
              value={formData.relationship}
              onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
              placeholder="如：配偶、子女、朋友"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isPrimary}
                onChange={(e) => setFormData(prev => ({ ...prev, isPrimary: e.target.checked }))}
              />
              <span className="checkbox-text">設為主要聯絡人</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="save-button">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 編輯醫療資訊模態框組件
interface MedicalInfoModalProps {
  onClose: () => void;
  onSave: (updates: Partial<MedicalInfo>) => void;
  medicalInfo: MedicalInfo;
}

const MedicalInfoModal: React.FC<MedicalInfoModalProps> = ({ onClose, onSave, medicalInfo }) => {
  const [formData, setFormData] = useState(medicalInfo);

  // 當 medicalInfo prop 更新時，同步更新表單數據
  useEffect(() => {
    setFormData(medicalInfo);
  }, [medicalInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const addItem = (field: keyof MedicalInfo, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
    }
  };

  const removeItem = (field: keyof MedicalInfo, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">編輯醫療資訊</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">血型</label>
            <select
              className="form-select"
              value={formData.bloodType}
              onChange={(e) => setFormData(prev => ({ ...prev, bloodType: e.target.value }))}
            >
              <option value="">請選擇血型</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">過敏史</label>
            <div className="array-input">
              {formData.allergies.map((allergy, index) => (
                <div key={index} className="array-item">
                  <span className="item-text">{allergy}</span>
                  <button 
                    type="button" 
                    className="remove-item-btn"
                    onClick={() => removeItem('allergies', index)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <input
                type="text"
                className="form-input"
                placeholder="輸入過敏原後按 Enter"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('allergies', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">常用藥物</label>
            <div className="array-input">
              {formData.medications.map((medication, index) => (
                <div key={index} className="array-item">
                  <span className="item-text">{medication}</span>
                  <button 
                    type="button" 
                    className="remove-item-btn"
                    onClick={() => removeItem('medications', index)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <input
                type="text"
                className="form-input"
                placeholder="輸入藥物名稱後按 Enter"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('medications', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">慢性病</label>
            <div className="array-input">
              {formData.conditions.map((condition, index) => (
                <div key={index} className="array-item">
                  <span className="item-text">{condition}</span>
                  <button 
                    type="button" 
                    className="remove-item-btn"
                    onClick={() => removeItem('conditions', index)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <input
                type="text"
                className="form-input"
                placeholder="輸入疾病名稱後按 Enter"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('conditions', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">緊急備註</label>
            <textarea
              className="form-textarea"
              value={formData.emergencyNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, emergencyNotes: e.target.value }))}
              placeholder="其他重要的醫療資訊"
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="save-button">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmergencyHelp;