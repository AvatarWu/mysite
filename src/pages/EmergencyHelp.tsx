import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmergencyHelp.css';

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

  useEffect(() => {
    loadEmergencyData();
  }, []);

  const loadEmergencyData = () => {
    try {
      // 載入緊急聯絡人
      const savedContacts = localStorage.getItem('emergencyContacts');
      if (savedContacts) {
        setContacts(JSON.parse(savedContacts));
      }

      // 載入醫療資訊
      const savedMedicalInfo = localStorage.getItem('medicalInfo');
      if (savedMedicalInfo) {
        setMedicalInfo(JSON.parse(savedMedicalInfo));
      }
    } catch (error) {
      console.error('載入緊急數據失敗:', error);
    }
  };

  const saveEmergencyData = () => {
    try {
      localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
      localStorage.setItem('medicalInfo', JSON.stringify(medicalInfo));
    } catch (error) {
      console.error('保存緊急數據失敗:', error);
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
      saveEmergencyData();
      return updated;
    });
  };


  const deleteContact = (id: string) => {
    setContacts(prev => {
      const updated = prev.filter(contact => contact._id !== id);
      saveEmergencyData();
      return updated;
    });
  };

  const callContact = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const updateMedicalInfo = (updates: Partial<MedicalInfo>) => {
    setMedicalInfo(prev => {
      const updated = { ...prev, ...updates };
      saveEmergencyData();
      return updated;
    });
  };

  const primaryContact = contacts.find(contact => contact.isPrimary);

  return (
    <div className="emergency-help-page">
      {/* 頂部導航 */}
      <header className="emergency-header">
        <div className="header-content">
          {/* 返回按鈕 */}
          <div 
            onClick={() => navigate('/')} 
            className="custom-back-btn"
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1001,
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
          
          {/* 標題 */}
          <div 
            className="custom-title"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: '700',
              textAlign: 'center',
              margin: '0',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}
          >
            緊急求助
          </div>
        </div>
      </header>

      {/* 主要內容 */}
      <main className="emergency-main">
        {/* 緊急撥號區域 */}
        <div className="emergency-call-section">
          <div className="emergency-call-card">
            <div className="emergency-icon">🚨</div>
            <h2 className="emergency-title">緊急情況</h2>
            <p className="emergency-description">如遇緊急情況，請立即撥打以下電話</p>
            
            <div className="emergency-buttons">
              <button 
                className="emergency-call-btn primary"
                onClick={() => callContact('110')}
              >
                <span className="btn-icon">🚔</span>
                <span className="btn-text">報警 110</span>
              </button>
              
              <button 
                className="emergency-call-btn secondary"
                onClick={() => callContact('119')}
              >
                <span className="btn-icon">🚑</span>
                <span className="btn-text">救護車 119</span>
              </button>
            </div>
          </div>
        </div>

        {/* 主要聯絡人 */}
        {primaryContact && (
          <div className="primary-contact-section">
            <h3 className="section-title">主要聯絡人</h3>
            <div className="primary-contact-card">
              <div className="contact-info">
                <div className="contact-name">{primaryContact.name}</div>
                <div className="contact-relationship">{primaryContact.relationship}</div>
                <div className="contact-phone">{primaryContact.phone}</div>
              </div>
              <button 
                className="call-primary-btn"
                onClick={() => callContact(primaryContact.phone)}
              >
                <span className="btn-icon">📞</span>
                撥打
              </button>
            </div>
          </div>
        )}

        {/* 緊急聯絡人列表 */}
        <div className="contacts-section">
          <div className="section-header">
            <h3 className="section-title">緊急聯絡人</h3>
            <button 
              className="add-contact-btn"
              onClick={() => setShowAddContact(true)}
            >
              <span className="btn-icon">+</span>
              新增聯絡人
            </button>
          </div>

          <div className="contacts-list">
            {contacts.map(contact => (
              <div key={contact._id} className="contact-item">
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
                    className="call-btn"
                    onClick={() => callContact(contact.phone)}
                  >
                    📞
                  </button>
                  <button 
                    className="edit-btn"
                    onClick={() => {/* TODO: 編輯聯絡人 */}}
                  >
                    ✏️
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteContact(contact._id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 醫療資訊 */}
        <div className="medical-info-section">
          <div className="section-header">
            <h3 className="section-title">醫療資訊</h3>
            <button 
              className="edit-medical-btn"
              onClick={() => setShowMedicalInfo(true)}
            >
              <span className="btn-icon">✏️</span>
              編輯
            </button>
          </div>

          <div className="medical-info-card">
            <div className="medical-item">
              <span className="medical-label">血型：</span>
              <span className="medical-value">{medicalInfo.bloodType || '未設定'}</span>
            </div>
            <div className="medical-item">
              <span className="medical-label">過敏史：</span>
              <span className="medical-value">
                {medicalInfo.allergies.length > 0 ? medicalInfo.allergies.join(', ') : '無'}
              </span>
            </div>
            <div className="medical-item">
              <span className="medical-label">常用藥物：</span>
              <span className="medical-value">
                {medicalInfo.medications.length > 0 ? medicalInfo.medications.join(', ') : '無'}
              </span>
            </div>
            <div className="medical-item">
              <span className="medical-label">慢性病：</span>
              <span className="medical-value">
                {medicalInfo.conditions.length > 0 ? medicalInfo.conditions.join(', ') : '無'}
              </span>
            </div>
            {medicalInfo.emergencyNotes && (
              <div className="medical-item">
                <span className="medical-label">緊急備註：</span>
                <span className="medical-value">{medicalInfo.emergencyNotes}</span>
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