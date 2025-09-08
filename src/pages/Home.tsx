import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// 功能卡片數據
const featureCards = [
  {
    id: 'medication',
    title: '用藥管理',
    description: '管理日常用藥提醒',
    icon: '💊',
    color: '#3b82f6',
    route: '/medications'
  },
  {
    id: 'weight',
    title: '體重管理',
    description: '追蹤體重變化趨勢',
    icon: '⚖️',
    color: '#16a34a',
    route: '/weight-list'
  },
  {
    id: 'blood-pressure',
    title: '血壓管理',
    description: '監控血壓健康狀況',
    icon: '❤️',
    color: '#f59e0b',
    route: '/blood-pressure'
  },
  {
    id: 'blood-sugar',
    title: '血糖管理',
    description: '追蹤血糖控制情況',
    icon: '🩸',
    color: '#dc2626',
    route: '/blood-sugar'
  },
  {
    id: 'ai-assistant',
    title: 'AI健康助手',
    description: '智能健康諮詢與建議',
    icon: '🤖',
    color: '#8b5cf6',
    route: '/ai-assistant'
  }
];

// 快速操作數據
const quickActions = [
  {
    id: 'emergency',
    title: '緊急求助',
    description: '快速聯繫緊急服務',
    icon: '🚨',
    color: '#dc2626',
    route: '/emergency'
  },
  {
    id: 'reminder',
    title: '設置提醒',
    description: '管理健康提醒事項',
    icon: '⏰',
    color: '#3b82f6',
    route: '/reminders'
  }
];

// 底部導航數據
const navigationItems = [
  { id: 'home', label: '首頁', icon: '🏠', route: '/', active: true },
  { id: 'medication', label: '用藥', icon: '💊', route: '/medications' },
  { id: 'profile', label: '個人', icon: '👤', route: '/profile' },
  { id: 'settings', label: '設置', icon: '⚙️', route: '/settings' }
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  // 在頁面載入時檢查並應用主題
  useEffect(() => {
    const applyThemeToHome = () => {
      try {
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          if (settings.general && settings.general.theme) {
            console.log('Home.tsx: 檢查到主題設定:', settings.general.theme);
            
            if (settings.general.theme === 'dark') {
              console.log('Home.tsx: 應用深色模式到首頁');
              
              // 強制應用深色模式到首頁元素
              document.body.style.setProperty('background-color', '#1a1a1a', 'important');
              document.body.style.setProperty('color', '#ffffff', 'important');
              
              // 強制覆蓋所有內聯樣式
              const allDivs = document.querySelectorAll('div');
              allDivs.forEach(div => {
                if (div instanceof HTMLElement) {
                  if (div.style.backgroundColor || div.style.background) {
                    div.style.setProperty('background-color', '#1a1a1a', 'important');
                    div.style.setProperty('background', '#1a1a1a', 'important');
                  }
                  if (div.style.color) {
                    div.style.setProperty('color', '#ffffff', 'important');
                  }
                }
              });
              
              // 強制覆蓋標題
              const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
              allHeadings.forEach(heading => {
                if (heading instanceof HTMLElement) {
                  heading.style.setProperty('color', '#ffffff', 'important');
                }
              });
              
              // 強制覆蓋段落
              const allParagraphs = document.querySelectorAll('p');
              allParagraphs.forEach(p => {
                if (p instanceof HTMLElement) {
                  p.style.setProperty('color', '#e0e0e0', 'important');
                }
              });
              
              // 強制覆蓋按鈕
              const allButtons = document.querySelectorAll('button');
              allButtons.forEach(button => {
                if (button instanceof HTMLElement) {
                  button.style.setProperty('background-color', '#3d3d3d', 'important');
                  button.style.setProperty('color', '#ffffff', 'important');
                  button.style.setProperty('border-color', '#4d4d4d', 'important');
                }
              });
              
              console.log('Home.tsx: 深色模式已應用到首頁');
            }
          }
        }
      } catch (error) {
        console.error('Home.tsx: 應用主題失敗:', error);
      }
    };

    // 延遲應用主題，確保 DOM 已完全載入
    const timer = setTimeout(applyThemeToHome, 100);
    
    return () => clearTimeout(timer);
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
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)',
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
            }}>CareOld</h1>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0'
            }}>您的健康管理助手</p>
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
            }}>歡迎回來！</h2>
            <p style={{
              fontSize: '16px',
              color: '#6c757d',
              margin: '0',
              fontWeight: '500'
            }}>今天也要關注您的健康哦</p>
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
          }}>主要功能</h2>
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
          }}>快速操作</h2>
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
          }}>健康摘要</h2>
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
                }}>72.5</div>
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280'
                }}>當前體重 (kg)</div>
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
                }}>120/80</div>
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280'
                }}>血壓 (mmHg)</div>
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
