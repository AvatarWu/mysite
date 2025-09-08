import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// 功能卡片數據 - 將在組件內動態生成

// 快速操作數據 - 將在組件內動態生成

// 底部導航數據 - 將在組件內動態生成

const Home: React.FC = () => {
  const navigate = useNavigate();

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
        'medicationManagement': '用藥管理',
        'medicationManagementDesc': '管理日常用藥提醒',
        'weightManagement': '體重管理',
        'weightManagementDesc': '追蹤體重變化趨勢',
        'bloodPressureManagement': '血壓管理',
        'bloodPressureManagementDesc': '監控血壓健康狀況',
        'bloodSugarManagement': '血糖管理',
        'bloodSugarManagementDesc': '追蹤血糖控制情況',
        'aiHealthAssistant': 'AI健康助手',
        'aiHealthAssistantDesc': '智能健康諮詢與建議',
        'emergencyHelp': '緊急求助',
        'emergencyHelpDesc': '快速聯繫緊急服務',
        'setReminder': '設置提醒',
        'setReminderDesc': '管理健康提醒事項',
        'home': '首頁',
        'medication': '用藥',
        'profile': '個人',
        'settings': '設置',
        'appTitle': 'CareOld',
        'appSubtitle': '您的健康管理助手',
        'welcomeBack': '歡迎回來！',
        'welcomeMessage': '今天也要關注您的健康哦',
        'mainFeatures': '主要功能',
        'quickActions': '快速操作',
        'healthSummary': '健康摘要',
        'currentWeight': '當前體重(kg)',
        'bloodPressure': '血壓(mmHg)',
        'weightValue': '72.5',
        'bloodPressureValue': '120/80'
      },
      'zh-CN': {
        'medicationManagement': '用药管理',
        'medicationManagementDesc': '管理日常用药提醒',
        'weightManagement': '体重管理',
        'weightManagementDesc': '追踪体重变化趋势',
        'bloodPressureManagement': '血压管理',
        'bloodPressureManagementDesc': '监控血压健康状况',
        'bloodSugarManagement': '血糖管理',
        'bloodSugarManagementDesc': '追踪血糖控制情况',
        'aiHealthAssistant': 'AI健康助手',
        'aiHealthAssistantDesc': '智能健康咨询与建议',
        'emergencyHelp': '紧急求助',
        'emergencyHelpDesc': '快速联系紧急服务',
        'setReminder': '设置提醒',
        'setReminderDesc': '管理健康提醒事项',
        'home': '首页',
        'medication': '用药',
        'profile': '个人',
        'settings': '设置',
        'appTitle': 'CareOld',
        'appSubtitle': '您的健康管理助手',
        'welcomeBack': '欢迎回来！',
        'welcomeMessage': '今天也要关注您的健康哦',
        'mainFeatures': '主要功能',
        'quickActions': '快速操作',
        'healthSummary': '健康摘要',
        'currentWeight': '当前体重(kg)',
        'bloodPressure': '血压(mmHg)',
        'weightValue': '72.5',
        'bloodPressureValue': '120/80'
      },
      'en': {
        'medicationManagement': 'Medication Management',
        'medicationManagementDesc': 'Manage daily medication reminders',
        'weightManagement': 'Weight Management',
        'weightManagementDesc': 'Track weight change trends',
        'bloodPressureManagement': 'Blood Pressure Management',
        'bloodPressureManagementDesc': 'Monitor blood pressure health',
        'bloodSugarManagement': 'Blood Sugar Management',
        'bloodSugarManagementDesc': 'Track blood sugar control',
        'aiHealthAssistant': 'AI Health Assistant',
        'aiHealthAssistantDesc': 'Intelligent health consultation and advice',
        'emergencyHelp': 'Emergency Help',
        'emergencyHelpDesc': 'Quick contact with emergency services',
        'setReminder': 'Set Reminder',
        'setReminderDesc': 'Manage health reminder items',
        'home': 'Home',
        'medication': 'Medication',
        'profile': 'Profile',
        'settings': 'Settings',
        'appTitle': 'CareOld',
        'appSubtitle': 'Your Health Management Assistant',
        'welcomeBack': 'Welcome Back!',
        'welcomeMessage': 'Take care of your health today',
        'mainFeatures': 'Main Features',
        'quickActions': 'Quick Actions',
        'healthSummary': 'Health Summary',
        'currentWeight': 'Current Weight (kg)',
        'bloodPressure': 'Blood Pressure (mmHg)',
        'weightValue': '72.5',
        'bloodPressureValue': '120/80'
      }
    };
    
    return (texts as any)[language]?.[key] || (texts as any)['zh-TW'][key] || key;
  };

  // 動態生成功能卡片數據
  const featureCards = [
    {
      id: 'medication',
      title: getText('medicationManagement'),
      description: getText('medicationManagementDesc'),
      icon: '💊',
      color: '#3b82f6',
      route: '/medications'
    },
    {
      id: 'weight',
      title: getText('weightManagement'),
      description: getText('weightManagementDesc'),
      icon: '⚖️',
      color: '#16a34a',
      route: '/weight-list'
    },
    {
      id: 'blood-pressure',
      title: getText('bloodPressureManagement'),
      description: getText('bloodPressureManagementDesc'),
      icon: '❤️',
      color: '#f59e0b',
      route: '/blood-pressure'
    },
    {
      id: 'blood-sugar',
      title: getText('bloodSugarManagement'),
      description: getText('bloodSugarManagementDesc'),
      icon: '🩸',
      color: '#dc2626',
      route: '/blood-sugar'
    },
    {
      id: 'ai-assistant',
      title: getText('aiHealthAssistant'),
      description: getText('aiHealthAssistantDesc'),
      icon: '🤖',
      color: '#8b5cf6',
      route: '/ai-assistant'
    }
  ];

  // 動態生成快速操作數據
  const quickActions = [
    {
      id: 'emergency',
      title: getText('emergencyHelp'),
      description: getText('emergencyHelpDesc'),
      icon: '🚨',
      color: '#dc2626',
      route: '/emergency'
    },
    {
      id: 'reminder',
      title: getText('setReminder'),
      description: getText('setReminderDesc'),
      icon: '⏰',
      color: '#3b82f6',
      route: '/reminders'
    }
  ];

  // 動態生成底部導航數據
  const navigationItems = [
    { id: 'home', label: getText('home'), icon: '🏠', route: '/', active: true },
    { id: 'medication', label: getText('medication'), icon: '💊', route: '/medications' },
    { id: 'profile', label: getText('profile'), icon: '👤', route: '/profile' },
    { id: 'settings', label: getText('settings'), icon: '⚙️', route: '/settings' }
  ];

  // 應用主題到首頁的函數
  const applyThemeToHome = (theme?: string) => {
    try {
      let targetTheme = theme;
      
      // 如果沒有指定主題，從本地存儲讀取
      if (!targetTheme) {
        const savedSettings = localStorage.getItem('careold-settings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          targetTheme = settings.general?.appearance || 'auto';
        }
      }
      
      console.log('Home.tsx: 應用主題到首頁:', targetTheme);
      
      if (targetTheme === 'dark') {
        console.log('Home.tsx: 應用深色模式到首頁');
        
        // 應用深色主題
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.setAttribute('data-theme', 'dark');
        document.documentElement.style.setProperty('--theme-bg', 'linear-gradient(135deg, #2d1b0e 0%, #3d2815 20%, #4d331c 40%, #5d3e23 60%, #6d492a 80%, #7d5431 100%)');
        document.documentElement.style.setProperty('--theme-text', '#ffffff');
        
        // 強制應用深色模式到首頁元素
        document.body.style.setProperty('background', 'linear-gradient(135deg, #2d1b0e 0%, #3d2815 20%, #4d331c 40%, #5d3e23 60%, #6d492a 80%, #7d5431 100%)', 'important');
        document.body.style.setProperty('color', '#ffffff', 'important');
        
      } else if (targetTheme === 'light') {
        console.log('Home.tsx: 應用淺色模式到首頁');
        
        // 應用淺色主題
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.setAttribute('data-theme', 'light');
        document.documentElement.style.setProperty('--theme-bg', 'linear-gradient(135deg, #fff8f0 0%, #ffe8d6 20%, #ffd4b3 40%, #ffc49b 60%, #ffb380 80%, #ffa366 100%)');
        document.documentElement.style.setProperty('--theme-text', '#1d1d1f');
        
        // 強制應用淺色模式到首頁元素
        document.body.style.setProperty('background', 'linear-gradient(135deg, #fff8f0 0%, #ffe8d6 20%, #ffd4b3 40%, #ffc49b 60%, #ffb380 80%, #ffa366 100%)', 'important');
        document.body.style.setProperty('color', '#1d1d1f', 'important');
        
      } else {
        // 自動模式
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log('Home.tsx: 應用自動模式到首頁:', prefersDark ? 'dark' : 'light');
        
        if (prefersDark) {
          document.documentElement.setAttribute('data-theme', 'dark');
          document.body.setAttribute('data-theme', 'dark');
          document.documentElement.style.setProperty('--theme-bg', 'linear-gradient(135deg, #2d1b0e 0%, #3d2815 20%, #4d331c 40%, #5d3e23 60%, #6d492a 80%, #7d5431 100%)');
          document.documentElement.style.setProperty('--theme-text', '#ffffff');
          document.body.style.setProperty('background', 'linear-gradient(135deg, #2d1b0e 0%, #3d2815 20%, #4d331c 40%, #5d3e23 60%, #6d492a 80%, #7d5431 100%)', 'important');
          document.body.style.setProperty('color', '#ffffff', 'important');
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
          document.body.setAttribute('data-theme', 'light');
          document.documentElement.style.setProperty('--theme-bg', 'linear-gradient(135deg, #fff8f0 0%, #ffe8d6 20%, #ffd4b3 40%, #ffc49b 60%, #ffb380 80%, #ffa366 100%)');
          document.documentElement.style.setProperty('--theme-text', '#1d1d1f');
          document.body.style.setProperty('background', 'linear-gradient(135deg, #fff8f0 0%, #ffe8d6 20%, #ffd4b3 40%, #ffc49b 60%, #ffb380 80%, #ffa366 100%)', 'important');
          document.body.style.setProperty('color', '#1d1d1f', 'important');
        }
      }
      
      console.log('Home.tsx: 主題已應用到首頁');
    } catch (error) {
      console.error('Home.tsx: 應用主題失敗:', error);
    }
  };

  // 在頁面載入時檢查並應用主題
  useEffect(() => {
    // 延遲應用主題，確保 DOM 已完全載入
    const timer = setTimeout(() => applyThemeToHome(), 100);
    
    return () => clearTimeout(timer);
  }, []);

  // 監聽全局主題變更事件
  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      console.log('Home.tsx: 收到主題變更事件:', event.detail.theme);
      applyThemeToHome(event.detail.theme);
    };
    
    const handleLanguageChange = (event: CustomEvent) => {
      console.log('Home.tsx: 收到語言變更事件:', event.detail.language);
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

  const handleFeatureClick = (route: string) => {
    navigate(route);
  };

  const handleQuickActionClick = (route: string) => {
    navigate(route);
  };

  const handleNavigationClick = (route: string) => {
    navigate(route);
  };

  // 強制應用首頁的樣式，抵抗全局樣式覆蓋
  useEffect(() => {
    const applyHomePageStyles = () => {
      const homePage = document.querySelector('div[style*="minHeight: 100vh"]');
      if (homePage) {
        // 強制應用背景漸層
        (homePage as HTMLElement).style.setProperty('background', 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)', 'important');
      }
    };

    // 延遲應用樣式，確保在全局樣式之後
    const timer = setTimeout(applyHomePageStyles, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--theme-bg, linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%))',
      color: 'var(--theme-text, #1d1d1f)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
    }}>
      {/* 導航頭部 */}
      <header style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '16px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1d1d1f',
              margin: '0 0 4px 0'
            }}>{getText('appTitle')}</h1>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0'
            }}>{getText('appSubtitle')}</p>
          </div>
          <button style={{
            background: 'transparent',
            border: 'none',
            color: '#3b82f6',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            🔔
          </button>
        </div>
      </header>

      {/* 主要內容 */}
      <main style={{
        padding: '24px 20px',
        maxWidth: '600px',
        margin: '0 auto',
        paddingBottom: '100px'
      }}>
        {/* 歡迎區域 */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#495057',
              margin: '0 0 8px 0'
            }}>{getText('welcomeBack')}</h2>
            <p style={{
              fontSize: '16px',
              color: '#6c757d',
              margin: '0',
              fontWeight: '500'
            }}>{getText('welcomeMessage')}</p>
          </div>
        </section>

        {/* 功能卡片區域 */}
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#495057',
            margin: '0 0 24px 0',
            textAlign: 'center'
          }}>{getText('mainFeatures')}</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            {featureCards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleFeatureClick(card.route)}
                style={{
                  background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}dd 100%)`,
                  color: '#ffffff',
                  borderRadius: '16px',
                  padding: '24px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s ease',
                  minHeight: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
              >
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px'
                }}>
                  {card.icon}
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                  lineHeight: '1.2'
                }}>{card.title}</h3>
                <p style={{
                  fontSize: '14px',
                  opacity: '0.9',
                  margin: '0',
                  lineHeight: '1.4'
                }}>{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 快速操作區域 */}
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1d1d1f',
            margin: '0 0 20px 0',
            textAlign: 'center'
          }}>{getText('quickActions')}</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            {quickActions.map((action) => (
              <div
                key={action.id}
                onClick={() => handleQuickActionClick(action.route)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{
                  fontSize: '32px',
                  marginBottom: '12px'
                }}>
                  {action.icon}
                </div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1d1d1f',
                  margin: '0 0 8px 0'
                }}>{action.title}</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>{action.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 健康摘要區域 */}
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1d1d1f',
            margin: '0 0 20px 0',
            textAlign: 'center'
          }}>{getText('healthSummary')}</h2>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}>
              <div style={{
                textAlign: 'center',
                padding: '16px',
                backgroundColor: '#f3f4f6',
                borderRadius: '12px'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#3b82f6',
                  marginBottom: '8px'
                }}>{getText('weightValue')}</div>
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280'
                }}>{getText('currentWeight')}</div>
              </div>
              <div style={{
                textAlign: 'center',
                padding: '16px',
                backgroundColor: '#f3f4f6',
                borderRadius: '12px'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#16a34a',
                  marginBottom: '8px'
                }}>{getText('bloodPressureValue')}</div>
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280'
                }}>{getText('bloodPressure')}</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 底部導航 */}
      <nav style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '8px 0',
        zIndex: 1000,
        boxShadow: '0 -2px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {navigationItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNavigationClick(item.route)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                cursor: 'pointer',
                borderRadius: '10px',
                color: item.active ? '#3b82f6' : '#8e8e93',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '24px' }}>{item.icon}</div>
              <span style={{
                fontSize: '12px',
                fontWeight: '500'
              }}>{item.label}</span>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Home;
