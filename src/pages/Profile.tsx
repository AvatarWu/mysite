// src/pages/Profile.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  emergencyContact: string;
  bloodType: string;
  allergies: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '陳大明',
    email: 'chen.daming@example.com',
    phone: '0912-345-678',
    birthDate: '1950-05-15',
    address: '台北市信義區信義路五段7號',
    emergencyContact: '0987-654-321',
    bloodType: 'A+',
    allergies: '無已知過敏'
  });

  const [tempData, setTempData] = useState<ProfileData>({ ...profileData });

  const handleBack = () => {
    navigate('/');
  };

  const handleEdit = () => {
    setTempData({ ...profileData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData({ ...tempData });
    setIsEditing(false);
    // 這裡可以添加保存到後端的邏輯
    console.log('個人資料已保存:', tempData);
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="profile-page">
      {/* 自定義導航欄 - Apple 風格 */}
      <header className="custom-header">
        <div className="header-content">
          <button onClick={handleBack} className="back-button" type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            返回
          </button>
          <h1 className="header-title">個人資料</h1>
          {!isEditing ? (
            <button onClick={handleEdit} className="edit-button" type="button">
              編輯
            </button>
          ) : (
            <div className="edit-actions">
              <button onClick={handleCancel} className="cancel-button" type="button">
                取消
              </button>
              <button onClick={handleSave} className="save-button" type="button">
                完成
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 主要內容區域 */}
      <main className="main-content">
        {/* 頭像區域 */}
        <section className="avatar-section">
          <div className="avatar-container">
            <div className="avatar">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            {isEditing && (
              <button className="change-avatar-button" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
              </button>
            )}
          </div>
          <div className="user-info">
            <h2 className="user-name">{profileData.name}</h2>
            <p className="user-details">{calculateAge(profileData.birthDate)} 歲 • {profileData.bloodType}</p>
          </div>
        </section>

        {/* 基本資料 */}
        <section className="info-section">
          <h3 className="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            基本資料
          </h3>

          <div className="info-group">
            <div className="info-item">
              <label className="info-label">姓名</label>
              {isEditing ? (
                <input
                  type="text"
                  className="info-input"
                  value={tempData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              ) : (
                <div className="info-value">{profileData.name}</div>
              )}
            </div>

            <div className="info-item">
              <label className="info-label">電子郵件</label>
              {isEditing ? (
                <input
                  type="email"
                  className="info-input"
                  value={tempData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              ) : (
                <div className="info-value">{profileData.email}</div>
              )}
            </div>

            <div className="info-item">
              <label className="info-label">電話</label>
              {isEditing ? (
                <input
                  type="tel"
                  className="info-input"
                  value={tempData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <div className="info-value">{profileData.phone}</div>
              )}
            </div>

            <div className="info-item">
              <label className="info-label">出生日期</label>
              {isEditing ? (
                <input
                  type="date"
                  className="info-input"
                  value={tempData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                />
              ) : (
                <div className="info-value">{new Date(profileData.birthDate).toLocaleDateString('zh-TW')}</div>
              )}
            </div>

            <div className="info-item">
              <label className="info-label">地址</label>
              {isEditing ? (
                <textarea
                  className="info-textarea"
                  value={tempData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={2}
                />
              ) : (
                <div className="info-value">{profileData.address}</div>
              )}
            </div>
          </div>
        </section>

        {/* 健康資料 */}
        <section className="info-section">
          <h3 className="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3.5.5-5 1.5-1.5-1-3.24-1.5-5-1.5A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7 7-7z"/>
            </svg>
            健康資料
          </h3>

          <div className="info-group">
            <div className="info-item">
              <label className="info-label">血型</label>
              {isEditing ? (
                <select
                  className="info-select"
                  value={tempData.bloodType}
                  onChange={(e) => handleInputChange('bloodType', e.target.value)}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              ) : (
                <div className="info-value">{profileData.bloodType}</div>
              )}
            </div>

            <div className="info-item">
              <label className="info-label">過敏史</label>
              {isEditing ? (
                <textarea
                  className="info-textarea"
                  value={tempData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  rows={2}
                  placeholder="請輸入已知的過敏史"
                />
              ) : (
                <div className="info-value">{profileData.allergies}</div>
              )}
            </div>
          </div>
        </section>

        {/* 緊急聯絡人 */}
        <section className="info-section">
          <h3 className="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            緊急聯絡人
          </h3>

          <div className="info-group">
            <div className="info-item">
              <label className="info-label">緊急聯絡電話</label>
              {isEditing ? (
                <input
                  type="tel"
                  className="info-input"
                  value={tempData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                />
              ) : (
                <div className="info-value">
                  {profileData.emergencyContact}
                  <button className="call-button" type="button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
