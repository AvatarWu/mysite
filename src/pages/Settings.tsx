import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SettingsData {
  general: {
    appearance: 'auto' | 'light' | 'dark';
    language: 'zh-TW' | 'zh-CN' | 'en';
    notifications: boolean;
    autoSync: boolean;
    syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    voiceNavigation: boolean;
    reduceMotion: boolean;
  };
  privacy: {
    dataSharing: boolean;
  };
  notifications: {
    healthReminders: boolean;
    medicationAlerts: boolean;
    appointmentReminders: boolean;
    systemUpdates: boolean;
    emergencyAlerts: boolean;
    weeklyReports: boolean;
  };
}

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAppearanceMenu, setShowAppearanceMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showSyncFrequencyMenu, setShowSyncFrequencyMenu] = useState(false);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    general: {
      appearance: 'auto',
      language: 'zh-TW',
      notifications: false,
      autoSync: false,
      syncFrequency: 'daily',
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      fontSize: 'medium',
      voiceNavigation: false,
      reduceMotion: false,
    },
    privacy: {
      dataSharing: false,
    },
    notifications: {
      healthReminders: true,
      medicationAlerts: true,
      appointmentReminders: true,
      systemUpdates: false,
      emergencyAlerts: true,
      weeklyReports: false,
    },
  });
  const [tempSettings, setTempSettings] = useState<SettingsData>(settings);

  // 載入設定
  useEffect(() => {
    loadSettings();
  }, []);

  // 點擊外部關閉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-menu')) {
        setShowAppearanceMenu(false);
        setShowLanguageMenu(false);
        setShowSyncFrequencyMenu(false);
        setShowFontSizeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 應用字體大小設定
  const applyFontSize = (fontSize: 'small' | 'medium' | 'large' | 'extra-large') => {
    const fontSizes = {
      small: '14px',
      medium: '16px', 
      large: '18px',
      'extra-large': '20px'
    };
    
    document.documentElement.style.setProperty('--base-font-size', fontSizes[fontSize]);
    document.documentElement.setAttribute('data-font-size', fontSize);
  };

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('careold-settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        setTempSettings(parsedSettings);
        
        // 應用外觀設定
        if (parsedSettings.general.appearance === 'dark') {
          setIsDark(true);
          document.documentElement.setAttribute('data-theme', 'dark');
        } else if (parsedSettings.general.appearance === 'light') {
          setIsDark(false);
          document.documentElement.setAttribute('data-theme', 'light');
        } else {
          // 自動模式
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setIsDark(prefersDark);
          document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        }
        
        // 應用高對比度設定
        setIsHighContrast(parsedSettings.accessibility.highContrast);
        
        // 應用字體大小設定
        applyFontSize(parsedSettings.accessibility.fontSize);
      }
    } catch (error) {
      console.error('載入設定失敗:', error);
    }
  };

  // 監聽系統主題變化
  useEffect(() => {
    if (tempSettings.general.appearance !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const checkSystemTheme = () => {
      const shouldBeDark = mediaQuery.matches;
      setIsDark(shouldBeDark);
      document.documentElement.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light');
    };

    checkSystemTheme();
    mediaQuery.addEventListener('change', checkSystemTheme);

    return () => mediaQuery.removeEventListener('change', checkSystemTheme);
  }, [tempSettings.general.appearance]);

  const handleToggle = (category: keyof SettingsData, key: string) => {
    setTempSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !(prev[category] as any)[key],
      },
    }));
    setHasChanges(true);
  };

  const handleSelect = (category: keyof SettingsData, key: string, value: string) => {
    setTempSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value as any,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    try {
      // 保存到本地存儲
      localStorage.setItem('careold-settings', JSON.stringify(tempSettings));
      setSettings(tempSettings);
      setHasChanges(false);
      
      // 應用外觀設定
      if (tempSettings.general.appearance === 'dark') {
        setIsDark(true);
        document.documentElement.setAttribute('data-theme', 'dark');
      } else if (tempSettings.general.appearance === 'light') {
        setIsDark(false);
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        // 自動模式
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(prefersDark);
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      }
      
      // 應用高對比度設定
      setIsHighContrast(tempSettings.accessibility.highContrast);
      
      // 應用字體大小設定
      applyFontSize(tempSettings.accessibility.fontSize);
      
      alert('設定已儲存！');
      navigate('/');
    } catch (error) {
      console.error('儲存設定失敗:', error);
      alert('儲存失敗，請重試');
    }
  };

  const handleBack = () => {
    if (hasChanges) {
      if (window.confirm('您有未儲存的變更，確定要離開嗎？')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  // Apple 風格的切換開關組件
  const AppleToggle = ({ checked, onChange, disabled = false }: { checked: boolean; onChange: () => void; disabled?: boolean }) => (
    <button
      onClick={onChange}
      disabled={disabled}
      style={{
        width: '51px',
        height: '31px',
        borderRadius: '16px',
        border: 'none',
        background: checked ? '#34C759' : (isHighContrast ? (isDark ? '#ffffff' : '#000000') : '#E5E5EA'),
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: disabled ? 0.5 : 1,
        outline: 'none',
        boxShadow: checked ? '0 2px 8px rgba(52, 199, 89, 0.3)' : 'none',
      }}
    >
      <div
        style={{
          width: '27px',
          height: '27px',
          borderRadius: '50%',
          background: '#ffffff',
          position: 'absolute',
          top: '2px',
          left: checked ? '22px' : '2px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      />
    </button>
  );

  return (
    <div className="settings-page" style={{
      minHeight: '100vh',
      background: isHighContrast
        ? (isDark ? '#000000' : '#ffffff')
        : (isDark ? 'linear-gradient(135deg, #2d1b0e 0%, #3d2815 20%, #4d331c 40%, #5d3e23 60%, #6d492a 80%, #7d5431 100%)' : 'linear-gradient(135deg, #fff8f0 0%, #ffe8d6 20%, #ffd4b3 40%, #ffc49b 60%, #ffb380 80%, #ffa366 100%)'),
      color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
      paddingTop: 'env(safe-area-inset-top)',
    }}>
      {/* 導航欄 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: isHighContrast
          ? (isDark ? '#000000' : '#ffffff')
          : (isDark ? 'rgba(45, 27, 14, 0.9)' : 'rgba(255, 248, 240, 0.9)'),
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: isHighContrast
          ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
          : (isDark ? '0.5px solid rgba(255, 255, 255, 0.2)' : '0.5px solid rgba(0, 0, 0, 0.1)'),
        paddingTop: 'env(safe-area-inset-top)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px 16px',
          position: 'relative',
        }}>
          <button
            onClick={handleBack}
            style={{
              background: 'transparent',
              border: 'none',
              color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#007AFF'),
              fontSize: '17px',
              fontWeight: '400',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'background-color 0.2s ease',
              minWidth: '80px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 122, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            返回
          </button>
          
          <h1 style={{
            fontSize: '17px',
            fontWeight: '600',
            color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
            margin: 0,
            letterSpacing: '-0.4px',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            textShadow: isDark ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none',
          }}>
            設定
          </h1>
          
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            style={{
              background: hasChanges ? '#007AFF' : 'transparent',
              border: hasChanges ? 'none' : (isDark ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid #8E8E93'),
              color: hasChanges ? '#ffffff' : (isDark ? 'rgba(255, 255, 255, 0.6)' : '#8E8E93'),
              fontSize: '17px',
              fontWeight: '500',
              cursor: hasChanges ? 'pointer' : 'not-allowed',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              opacity: hasChanges ? 1 : 0.6,
              minWidth: '80px',
            }}
            onMouseEnter={(e) => {
              if (hasChanges) {
                e.currentTarget.style.backgroundColor = '#0056CC';
                e.currentTarget.style.transform = 'scale(1.02)';
              } else {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (hasChanges) {
                e.currentTarget.style.backgroundColor = '#007AFF';
                e.currentTarget.style.transform = 'scale(1)';
              } else {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            儲存
          </button>
        </div>
      </div>

      {/* 內容區域 */}
      <div style={{
        padding: '20px',
        paddingTop: 'calc(env(safe-area-inset-top) + 50px)',
        paddingBottom: '40px',
      }}>
        {/* 一般設定 */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '13px',
            fontWeight: '400',
            color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            一般
          </h2>
          
          <div style={{
            background: isHighContrast
              ? (isDark ? '#000000' : '#ffffff')
              : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)'),
            borderRadius: '12px',
            overflow: 'hidden',
            border: isHighContrast
              ? (isDark ? '1px solid #ffffff' : '1px solid #000000')
              : 'none',
            boxShadow: isHighContrast ? 'none' : (isDark ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)'),
          }}>
            {/* 外觀設定 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
            }}>
              <div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '400',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  marginBottom: '2px',
                }}>
                  外觀
                </div>
                <div style={{
                  fontSize: '13px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                }}>
                  選擇應用程式的外觀
                </div>
              </div>
              <button
                onClick={() => setShowAppearanceMenu(!showAppearanceMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  fontSize: '17px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>
                  {tempSettings.general.appearance === 'auto' ? '自動' : 
                   tempSettings.general.appearance === 'light' ? '淺色' : '深色'}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </button>
              
              {/* 外觀選單 */}
              {showAppearanceMenu && (
                <div className="dropdown-menu" style={{
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  left: '0',
                  background: isHighContrast
                    ? (isDark ? '#000000' : '#ffffff')
                    : (isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)'),
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  border: isHighContrast
                    ? (isDark ? '1px solid #ffffff' : '1px solid #000000')
                    : '1px solid rgba(0, 0, 0, 0.1)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  zIndex: 1000,
                  overflow: 'hidden',
                  marginTop: '4px',
                }}>
                  {[
                    { value: 'auto', label: '自動' },
                    { value: 'light', label: '淺色' },
                    { value: 'dark', label: '深色' }
                  ].map((option, index) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        handleSelect('general', 'appearance', option.value);
                        setShowAppearanceMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: index < 2 ? (isHighContrast
                          ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                          : '0.5px solid rgba(0, 0, 0, 0.1)') : 'none',
                        color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                        fontSize: '17px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span>{option.label}</span>
                      {tempSettings.general.appearance === option.value && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 語言設定 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
            }}>
              <div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '400',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  marginBottom: '2px',
                }}>
                  語言
                </div>
                <div style={{
                  fontSize: '13px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                }}>
                  選擇應用程式的顯示語言
                </div>
              </div>
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  fontSize: '17px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>
                  {tempSettings.general.language === 'zh-TW' ? '繁體中文' : 
                   tempSettings.general.language === 'zh-CN' ? '簡體中文' : 'English'}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </button>
              
              {/* 語言選單 */}
              {showLanguageMenu && (
                <div className="dropdown-menu" style={{
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  left: '0',
                  background: isHighContrast
                    ? (isDark ? '#000000' : '#ffffff')
                    : (isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)'),
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  border: isHighContrast
                    ? (isDark ? '1px solid #ffffff' : '1px solid #000000')
                    : '1px solid rgba(0, 0, 0, 0.1)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  zIndex: 1000,
                  overflow: 'hidden',
                  marginTop: '4px',
                }}>
                  {[
                    { value: 'zh-TW', label: '繁體中文' },
                    { value: 'zh-CN', label: '簡體中文' },
                    { value: 'en', label: 'English' }
                  ].map((option, index) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        handleSelect('general', 'language', option.value);
                        setShowLanguageMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: index < 2 ? (isHighContrast
                          ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                          : '0.5px solid rgba(0, 0, 0, 0.1)') : 'none',
                        color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                        fontSize: '17px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span>{option.label}</span>
                      {tempSettings.general.language === option.value && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 通知設定 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '400',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  marginBottom: '2px',
                }}>
                  通知
                </div>
                <div style={{
                  fontSize: '13px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                }}>
                  接收健康提醒和更新通知
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.general.notifications}
                onChange={() => handleToggle('general', 'notifications')}
              />
            </div>

            {/* 自動同步設定 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '400',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  marginBottom: '2px',
                }}>
                  自動同步
                </div>
                <div style={{
                  fontSize: '13px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                }}>
                  自動同步健康數據到雲端
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.general.autoSync}
                onChange={() => handleToggle('general', 'autoSync')}
              />
            </div>

            {/* 同步頻率設定 */}
            {tempSettings.general.autoSync && (
              <div style={{
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                background: isHighContrast
                  ? (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)')
                  : (isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'),
              }}>
                <div>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: '400',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                    marginBottom: '2px',
                  }}>
                    同步頻率
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                  }}>
                    選擇數據同步的頻率
                  </div>
                </div>
                <button
                  onClick={() => setShowSyncFrequencyMenu(!showSyncFrequencyMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                    fontSize: '17px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>
                    {tempSettings.general.syncFrequency === 'realtime' ? '即時' :
                     tempSettings.general.syncFrequency === 'hourly' ? '每小時' :
                     tempSettings.general.syncFrequency === 'daily' ? '每天' : '每週'}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </button>
                
                {/* 同步頻率選單 */}
                {showSyncFrequencyMenu && (
                  <div className="dropdown-menu" style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    left: '0',
                    background: isHighContrast
                      ? (isDark ? '#000000' : '#ffffff')
                      : (isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)'),
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '12px',
                    border: isHighContrast
                      ? (isDark ? '1px solid #ffffff' : '1px solid #000000')
                      : '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    zIndex: 1000,
                    overflow: 'hidden',
                    marginTop: '4px',
                  }}>
                    {[
                      { value: 'realtime', label: '即時', description: '數據變更時立即同步' },
                      { value: 'hourly', label: '每小時', description: '每小時同步一次' },
                      { value: 'daily', label: '每天', description: '每天同步一次' },
                      { value: 'weekly', label: '每週', description: '每週同步一次' }
                    ].map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          handleSelect('general', 'syncFrequency', option.value);
                          setShowSyncFrequencyMenu(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: index < 3 ? (isHighContrast
                            ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                            : '0.5px solid rgba(0, 0, 0, 0.1)') : 'none',
                          color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                          fontSize: '17px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'background-color 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '500', marginBottom: '2px' }}>{option.label}</div>
                          <div style={{ 
                            fontSize: '13px', 
                            color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                            opacity: 0.8 
                          }}>
                            {option.description}
                          </div>
                        </div>
                        {tempSettings.general.syncFrequency === option.value && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5"></path>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 無障礙設定 */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '13px',
            fontWeight: '400',
            color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            無障礙
          </h2>
          
          <div style={{
            background: isHighContrast
              ? (isDark ? '#000000' : '#ffffff')
              : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)'),
            borderRadius: '12px',
            overflow: 'hidden',
            border: isHighContrast
              ? (isDark ? '1px solid #ffffff' : '1px solid #000000')
              : 'none',
            boxShadow: isHighContrast ? 'none' : (isDark ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)'),
          }}>
            {/* 高對比度 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '400',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  marginBottom: '2px',
                }}>
                  高對比度
                </div>
                <div style={{
                  fontSize: '13px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                }}>
                  提高文字和背景的對比度
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.accessibility.highContrast}
                onChange={() => handleToggle('accessibility', 'highContrast')}
              />
            </div>

            {/* 字體大小設定 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
            }}>
              <div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '400',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  marginBottom: '2px',
                }}>
                  字體大小
                </div>
                <div style={{
                  fontSize: '13px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                }}>
                  調整應用程式中的文字大小
                </div>
              </div>
              <button
                onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  fontSize: '17px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>
                  {tempSettings.accessibility.fontSize === 'small' ? '小' :
                   tempSettings.accessibility.fontSize === 'medium' ? '中' :
                   tempSettings.accessibility.fontSize === 'large' ? '大' : '特大'}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </button>
              
              {/* 字體大小選單 */}
              {showFontSizeMenu && (
                <div className="dropdown-menu" style={{
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  left: '0',
                  background: isHighContrast
                    ? (isDark ? '#000000' : '#ffffff')
                    : (isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)'),
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  border: isHighContrast
                    ? (isDark ? '1px solid #ffffff' : '1px solid #000000')
                    : '1px solid rgba(0, 0, 0, 0.1)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  zIndex: 1000,
                  overflow: 'hidden',
                  marginTop: '4px',
                }}>
                  {[
                    { value: 'small', label: '小', description: '14px - 適合小螢幕' },
                    { value: 'medium', label: '中', description: '16px - 標準大小' },
                    { value: 'large', label: '大', description: '18px - 易於閱讀' },
                    { value: 'extra-large', label: '特大', description: '20px - 最大字體' }
                  ].map((option, index) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        handleSelect('accessibility', 'fontSize', option.value);
                        setShowFontSizeMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: index < 3 ? (isHighContrast
                          ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                          : '0.5px solid rgba(0, 0, 0, 0.1)') : 'none',
                        color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                        fontSize: '17px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '500', marginBottom: '2px' }}>{option.label}</div>
                        <div style={{ 
                          fontSize: '13px', 
                          color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                          opacity: 0.8 
                        }}>
                          {option.description}
                        </div>
                      </div>
                      {tempSettings.accessibility.fontSize === option.value && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 語音導航 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '400',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  marginBottom: '2px',
                }}>
                  語音導航
                </div>
                <div style={{
                  fontSize: '13px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                }}>
                  啟用語音導航功能
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.accessibility.voiceNavigation}
                onChange={() => handleToggle('accessibility', 'voiceNavigation')}
              />
            </div>

            {/* 減少動畫 */}
            <div style={{
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '400',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  marginBottom: '2px',
                }}>
                  減少動畫
                </div>
                <div style={{
                  fontSize: '13px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                }}>
                  減少界面動畫效果
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.accessibility.reduceMotion}
                onChange={() => handleToggle('accessibility', 'reduceMotion')}
              />
            </div>
          </div>
        </div>

        {/* 通知設定 */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '13px',
            fontWeight: '400',
            color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            通知
          </h2>
          
          <div style={{
            background: isHighContrast
              ? (isDark ? '#000000' : '#ffffff')
              : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)'),
            borderRadius: '12px',
            overflow: 'hidden',
            border: isHighContrast
              ? (isDark ? '1px solid #ffffff' : '1px solid #000000')
              : 'none',
            boxShadow: isHighContrast ? 'none' : (isDark ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)'),
          }}>
            {/* 健康提醒 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#FF9500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: '400',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                    marginBottom: '2px',
                  }}>
                    健康提醒
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                  }}>
                    日常健康檢查提醒
                  </div>
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.notifications.healthReminders}
                onChange={() => handleToggle('notifications', 'healthReminders')}
              />
            </div>

            {/* 用藥提醒 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#FF3B30',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4"></path>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: '400',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                    marginBottom: '2px',
                  }}>
                    用藥提醒
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                  }}>
                    藥物服用時間提醒
                  </div>
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.notifications.medicationAlerts}
                onChange={() => handleToggle('notifications', 'medicationAlerts')}
              />
            </div>

            {/* 預約提醒 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#007AFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: '400',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                    marginBottom: '2px',
                  }}>
                    預約提醒
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                  }}>
                    醫療預約和檢查提醒
                  </div>
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.notifications.appointmentReminders}
                onChange={() => handleToggle('notifications', 'appointmentReminders')}
              />
            </div>

            {/* 系統更新 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#8E8E93',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: '400',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                    marginBottom: '2px',
                  }}>
                    系統更新
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                  }}>
                    應用程式更新通知
                  </div>
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.notifications.systemUpdates}
                onChange={() => handleToggle('notifications', 'systemUpdates')}
              />
            </div>

            {/* 緊急警報 */}
            <div style={{
              padding: '16px 20px',
              borderBottom: isHighContrast
                ? (isDark ? '0.5px solid #ffffff' : '0.5px solid #000000')
                : '0.5px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#FF2D92',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: '400',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                    marginBottom: '2px',
                  }}>
                    緊急警報
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                  }}>
                    重要健康警報和緊急通知
                  </div>
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.notifications.emergencyAlerts}
                onChange={() => handleToggle('notifications', 'emergencyAlerts')}
              />
            </div>

            {/* 週報 */}
            <div style={{
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#34C759',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: '400',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                    marginBottom: '2px',
                  }}>
                    週報
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                  }}>
                    每週健康報告摘要
                  </div>
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.notifications.weeklyReports}
                onChange={() => handleToggle('notifications', 'weeklyReports')}
              />
            </div>
          </div>
        </div>

        {/* 隱私與安全設定 */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '13px',
            fontWeight: '400',
            color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            隱私與安全
          </h2>
          
          <div style={{
            background: isHighContrast
              ? (isDark ? '#000000' : '#ffffff')
              : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)'),
            borderRadius: '12px',
            overflow: 'hidden',
            border: isHighContrast
              ? (isDark ? '1px solid #ffffff' : '1px solid #000000')
              : 'none',
            boxShadow: isHighContrast ? 'none' : (isDark ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)'),
          }}>
            {/* 數據分享 */}
            <div style={{
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '400',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#1d1d1f'),
                  marginBottom: '2px',
                }}>
                  數據分享
                </div>
                <div style={{
                  fontSize: '13px',
                  color: isHighContrast ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#ffffff' : '#8E8E93'),
                }}>
                  允許與醫療機構分享數據
                </div>
              </div>
              <AppleToggle
                checked={tempSettings.privacy.dataSharing}
                onChange={() => handleToggle('privacy', 'dataSharing')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;