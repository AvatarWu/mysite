import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 導入真實的頁面組件
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
// import AIHealthAssistant from './pages/AIHealthAssistant';
import Medications from './pages/Medications';
import AddMedication from './pages/AddMedication';
import BloodPressure from './pages/BloodPressure';
import BloodSugar from './pages/BloodSugar';
import AddBloodPressure from './pages/AddBloodPressure';
import AddBloodSugar from './pages/AddBloodSugar';
import WeightList from './pages/WeightList';
import AddWeight from './pages/AddWeight';
import EmergencyHelp from './pages/EmergencyHelp';
import ReminderManagement from './pages/ReminderManagement';

// 導入新的設計系統
import './theme/design-system.css';
import './theme/components.css';

const App: React.FC = () => {
  // 在應用啟動時載入並應用已保存的設定
  useEffect(() => {
    const loadAndApplySettings = () => {
      try {
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          
          // 應用無障礙設定
          if (settings.accessibility) {
            const root = document.documentElement;
            
            if (settings.accessibility.largeText) {
              // 大字體設定 - 更明顯的變化
              root.style.setProperty('--text-base', '1.25rem');
              root.style.setProperty('--text-xl', '1.5rem');
              root.style.setProperty('--text-2xl', '1.75rem');
              root.style.setProperty('--text-lg', '1.125rem');
              root.style.setProperty('--text-sm', '1rem');
              
              // 直接應用大字體到 body 和主要元素
              document.body.style.fontSize = '1.25rem';
              document.body.style.lineHeight = '1.6';
              
              // 應用到大標題
              const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
              headings.forEach(heading => {
                if (heading instanceof HTMLElement) {
                  heading.style.fontSize = heading.tagName === 'H1' ? '2rem' : 
                                          heading.tagName === 'H2' ? '1.75rem' : 
                                          heading.tagName === 'H3' ? '1.5rem' : '1.25rem';
                }
              });
              
              // 應用到段落和一般文字
              const paragraphs = document.querySelectorAll('p, span, div');
              paragraphs.forEach(element => {
                if (element instanceof HTMLElement && !element.classList.contains('setting-name')) {
                  element.style.fontSize = '1.125rem';
                }
              });
            }
            
            if (settings.accessibility.highContrast) {
              console.log('App.tsx: 應用高對比度模式');
              
              // 檢查當前主題，決定高對比度的基礎顏色
              let isDarkTheme = false;
              if (settings.general && settings.general.theme) {
                isDarkTheme = settings.general.theme === 'dark';
              }
              
              if (isDarkTheme) {
                // 深色主題下的高對比度（排除設定頁面）
                const settingsPage = document.querySelector('.settings-page');
                if (!settingsPage) {
                  document.body.style.setProperty('background-color', '#000000', 'important');
                  document.body.style.setProperty('color', '#ffffff', 'important');
                }
                
                // 強制所有文字為白色（排除設定頁面）
                const allTextElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button, input, select, label');
                allTextElements.forEach(element => {
                  if (element instanceof HTMLElement) {
                    // 排除設定頁面的元素
                    if (!element.closest('.settings-page')) {
                      element.style.setProperty('color', '#ffffff', 'important');
                    }
                  }
                });
                
                // 強制所有背景為純黑（排除設定頁面）
                const allElements = document.querySelectorAll('*');
                allElements.forEach(element => {
                  if (element instanceof HTMLElement) {
                    // 排除設定頁面的元素
                    if (!element.closest('.settings-page')) {
                      const currentBg = element.style.backgroundColor || element.style.background;
                      if (currentBg && !currentBg.includes('transparent')) {
                        element.style.setProperty('background-color', '#000000', 'important');
                      }
                    }
                  }
                });
                
                // 特別保護設定頁面的背景
                if (settingsPage instanceof HTMLElement) {
                  const warmDarkGradient = 'linear-gradient(135deg, #2d1b0e 0%, #3d2815 20%, #4d331c 40%, #5d3e23 60%, #6d492a 80%, #7d5431 100%)';
                  settingsPage.style.setProperty('background', warmDarkGradient, 'important');
                  settingsPage.style.setProperty('background-image', warmDarkGradient, 'important');
                  console.log('App.tsx: 高對比度深色模式保護設定頁面背景');
                }
              } else {
                // 淺色主題下的高對比度（排除設定頁面）
                const settingsPage = document.querySelector('.settings-page');
                if (!settingsPage) {
                  document.body.style.setProperty('background-color', '#ffffff', 'important');
                  document.body.style.setProperty('color', '#000000', 'important');
                }
                
                // 強制所有文字為黑色（排除設定頁面）
                const allTextElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button, input, select, label');
                allTextElements.forEach(element => {
                  if (element instanceof HTMLElement) {
                    // 排除設定頁面的元素
                    if (!element.closest('.settings-page')) {
                      element.style.setProperty('color', '#000000', 'important');
                    }
                  }
                });
                
                // 強制所有背景為純白（排除設定頁面）
                const allElements = document.querySelectorAll('*');
                allElements.forEach(element => {
                  if (element instanceof HTMLElement) {
                    // 排除設定頁面的元素
                    if (!element.closest('.settings-page')) {
                      const currentBg = element.style.backgroundColor || element.style.background;
                      if (currentBg && !currentBg.includes('transparent')) {
                        element.style.setProperty('background-color', '#ffffff', 'important');
                      }
                    }
                  }
                });
                
                // 特別保護設定頁面的背景
                if (settingsPage instanceof HTMLElement) {
                  const warmLightGradient = 'linear-gradient(135deg, #fff8f0 0%, #ffe8d6 20%, #ffd4b3 40%, #ffc49b 60%, #ffb380 80%, #ffa366 100%)';
                  settingsPage.style.setProperty('background', warmLightGradient, 'important');
                  settingsPage.style.setProperty('background-image', warmLightGradient, 'important');
                  console.log('App.tsx: 高對比度淺色模式保護設定頁面背景');
                }
              }
              
              // 設置高對比度的主題色變數
              root.style.setProperty('--primary', '#00ffff', 'important');      // 青色
              root.style.setProperty('--success', '#00ff00', 'important');      // 亮綠色
              root.style.setProperty('--warning', '#ffff00', 'important');      // 黃色
              root.style.setProperty('--danger', '#ff0000', 'important');       // 紅色
              
              console.log('App.tsx: 高對比度模式已應用，主題:', isDarkTheme ? '深色' : '淺色');
            }
          }
          
          // 應用主題設定
          if (settings.general && settings.general.theme) {
            applyGlobalTheme(settings.general.theme);
          }
        }
      } catch (error) {
        console.error('載入設定失敗:', error);
      }
    };

    // 全局主題應用函數
    const applyGlobalTheme = (theme: string) => {
      console.log('App.tsx: 開始應用全局主題:', theme);
      
      if (theme === 'dark') {
        console.log('App.tsx: 啟用全局深色模式');
        
        // 應用深色模式到 body（排除設定頁面）
        const settingsPage = document.querySelector('.settings-page');
        if (!settingsPage) {
          document.body.style.setProperty('background-color', '#1a1a1a', 'important');
          document.body.style.setProperty('color', '#ffffff', 'important');
        }
        
        // 應用深色模式到 app-container
        const appContainer = document.querySelector('.app-container');
        if (appContainer instanceof HTMLElement) {
          if (settingsPage) {
            // 設定頁面存在時，設置透明背景
            appContainer.style.setProperty('background-color', 'transparent', 'important');
            appContainer.style.setProperty('background', 'transparent', 'important');
          } else {
            appContainer.style.setProperty('background-color', '#1a1a1a', 'important');
            appContainer.style.setProperty('color', '#ffffff', 'important');
          }
        }
        
        // 強制覆蓋所有內聯樣式 - 首頁（排除設定頁面）
        const allDivs = document.querySelectorAll('div');
        allDivs.forEach(div => {
          if (div instanceof HTMLElement) {
            // 排除設定頁面的元素
            if (!div.closest('.settings-page') && !div.closest('.custom-header')) {
              // 檢查是否有內聯樣式
              if (div.style.backgroundColor || div.style.background) {
                div.style.setProperty('background-color', '#1a1a1a', 'important');
                div.style.setProperty('background', '#1a1a1a', 'important');
              }
              if (div.style.color) {
                div.style.setProperty('color', '#ffffff', 'important');
              }
            }
          }
        });
        
        // 特別保護設定頁面的背景
        if (settingsPage instanceof HTMLElement) {
          // 確保設定頁面保持其漸層背景
          const warmDarkGradient = 'linear-gradient(135deg, #2d1b0e 0%, #3d2815 20%, #4d331c 40%, #5d3e23 60%, #6d492a 80%, #7d5431 100%)';
          settingsPage.style.setProperty('background', warmDarkGradient, 'important');
          settingsPage.style.setProperty('background-image', warmDarkGradient, 'important');
          console.log('App.tsx: 保護設定頁面深色漸層背景');
        }
        
        // 強制覆蓋所有內聯樣式 - 標題（排除血壓頁面、血糖頁面和設定頁面的標題）
        const allHeadings = document.querySelectorAll('h1:not(.header-title):not(.custom-title), h2, h3, h4, h5, h6');
        allHeadings.forEach(heading => {
          if (heading instanceof HTMLElement) {
            // 排除血糖管理頁面和設定頁面的元素
            if (!heading.closest('.blood-sugar-page') && !heading.closest('.settings-page')) {
              heading.style.setProperty('color', '#ffffff', 'important');
            }
          }
        });
        
        // 強制覆蓋所有內聯樣式 - 段落
        const allParagraphs = document.querySelectorAll('p');
        allParagraphs.forEach(p => {
          if (p instanceof HTMLElement) {
            // 排除血糖管理頁面和設定頁面的元素
            if (!p.closest('.blood-sugar-page') && !p.closest('.settings-page')) {
              p.style.setProperty('color', '#e0e0e0', 'important');
            }
          }
        });
        
        // 強制覆蓋所有內聯樣式 - 按鈕（排除返回按鈕、儲存按鈕、新增按鈕）
        const allButtons = document.querySelectorAll('button:not(.back-button):not(.save-button):not(.add-button):not(.custom-back-btn):not(.custom-save-btn):not(.custom-add-btn)');
        allButtons.forEach(button => {
          if (button instanceof HTMLElement) {
            // 排除血糖管理頁面和設定頁面的元素
            if (!button.closest('.blood-sugar-page') && !button.closest('.settings-page')) {
              // 檢查按鈕是否有內聯樣式，如果有則不覆蓋
              if (!button.style.color && !button.style.backgroundColor) {
                button.style.setProperty('background-color', '#3d3d3d', 'important');
                button.style.setProperty('color', '#ffffff', 'important');
                button.style.setProperty('border-color', '#4d4d4d', 'important');
              }
            }
          }
        });
        
        // 強制覆蓋所有內聯樣式 - 主要內容區域
        const mainElement = document.querySelector('main');
        if (mainElement instanceof HTMLElement) {
          // 排除血糖管理頁面和設定頁面的元素
          if (!mainElement.closest('.blood-sugar-page') && !mainElement.closest('.settings-page')) {
            mainElement.style.setProperty('background-color', '#1a1a1a', 'important');
            mainElement.style.setProperty('color', '#ffffff', 'important');
          }
        }
        
        // 強制覆蓋所有內聯樣式 - 歡迎區域
        const welcomeSection = document.querySelector('section');
        if (welcomeSection instanceof HTMLElement) {
          welcomeSection.style.setProperty('background-color', '#2d2d2d', 'important');
          welcomeSection.style.setProperty('color', '#ffffff', 'important');
        }
        
        // 強制覆蓋所有內聯樣式 - 功能卡片
        const featureCards = document.querySelectorAll('div[style*="background"]');
        featureCards.forEach(card => {
          if (card instanceof HTMLElement) {
            card.style.setProperty('background', '#2d2d2d', 'important');
            card.style.setProperty('color', '#ffffff', 'important');
          }
        });
        
        // 強制覆蓋所有內聯樣式 - 快速操作卡片
        const quickActionCards = document.querySelectorAll('div[style*="background-color"]');
        quickActionCards.forEach(card => {
          if (card instanceof HTMLElement) {
            card.style.setProperty('background-color', '#2d2d2d', 'important');
            card.style.setProperty('color', '#1a1a1a', 'important');
          }
        });
        
        // 強制覆蓋所有內聯樣式 - 底部導航
        const bottomNav = document.querySelector('nav');
        if (bottomNav instanceof HTMLElement) {
          bottomNav.style.setProperty('background-color', '#2d2d2d', 'important');
          bottomNav.style.setProperty('border-top-color', '#4d4d4d', 'important');
        }
        
        console.log('App.tsx: 全局深色模式樣式已強制應用');
        
      } else if (theme === 'light') {
        console.log('App.tsx: 啟用全局淺色模式');
        
        // 恢復淺色模式 - 清除強制樣式
        document.body.style.removeProperty('background-color');
        document.body.style.removeProperty('color');
        
        const appContainer = document.querySelector('.app-container');
        if (appContainer instanceof HTMLElement) {
          const settingsPage = document.querySelector('.settings-page');
          if (settingsPage) {
            // 設定頁面存在時，設置透明背景
            appContainer.style.setProperty('background-color', 'transparent', 'important');
            appContainer.style.setProperty('background', 'transparent', 'important');
          } else {
            appContainer.style.removeProperty('background-color');
            appContainer.style.removeProperty('color');
          }
        }
        
        // 恢復所有元素的樣式（排除設定頁面）
        const allDivs = document.querySelectorAll('div');
        allDivs.forEach(div => {
          if (div instanceof HTMLElement) {
            // 排除設定頁面的元素
            if (!div.closest('.settings-page') && !div.closest('.custom-header')) {
              div.style.removeProperty('background-color');
              div.style.removeProperty('background');
              div.style.removeProperty('color');
            }
          }
        });
        
        // 特別保護設定頁面的背景
        const settingsPageLight = document.querySelector('.settings-page');
        if (settingsPageLight instanceof HTMLElement) {
          // 確保設定頁面保持其漸層背景
          const warmLightGradient = 'linear-gradient(135deg, #fff8f0 0%, #ffe8d6 20%, #ffd4b3 40%, #ffc49b 60%, #ffb380 80%, #ffa366 100%)';
          settingsPageLight.style.setProperty('background', warmLightGradient, 'important');
          settingsPageLight.style.setProperty('background-image', warmLightGradient, 'important');
          console.log('App.tsx: 保護設定頁面淺色漸層背景');
        }
        
        const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        allHeadings.forEach(heading => {
          if (heading instanceof HTMLElement) {
            heading.style.removeProperty('color');
          }
        });
        
        const allParagraphs = document.querySelectorAll('p');
        allParagraphs.forEach(p => {
          if (p instanceof HTMLElement) {
            p.style.removeProperty('color');
          }
        });
        
        const allButtons = document.querySelectorAll('button');
        allButtons.forEach(button => {
          if (button instanceof HTMLElement) {
            // 只清除沒有內聯樣式的按鈕
            if (!button.style.color && !button.style.backgroundColor) {
              button.style.removeProperty('background-color');
              button.style.removeProperty('color');
              button.style.removeProperty('border-color');
            }
          }
        });
        
        const mainElement = document.querySelector('main');
        if (mainElement instanceof HTMLElement) {
          mainElement.style.removeProperty('background-color');
          mainElement.style.removeProperty('color');
        }
        
        const welcomeSection = document.querySelector('section');
        if (welcomeSection instanceof HTMLElement) {
          welcomeSection.style.removeProperty('background-color');
          welcomeSection.style.removeProperty('color');
        }
        
        const featureCards = document.querySelectorAll('div[style*="background"]');
        featureCards.forEach(card => {
          if (card instanceof HTMLElement) {
            card.style.removeProperty('background');
            card.style.removeProperty('color');
          }
        });
        
        const quickActionCards = document.querySelectorAll('div[style*="background-color"]');
        quickActionCards.forEach(card => {
          if (card instanceof HTMLElement) {
            card.style.removeProperty('background-color');
            card.style.removeProperty('color');
          }
        });
        
        const bottomNav = document.querySelector('nav');
        if (bottomNav instanceof HTMLElement) {
          bottomNav.style.removeProperty('background-color');
          bottomNav.style.removeProperty('border-top-color');
        }
        
        console.log('App.tsx: 全局淺色模式樣式已恢復');
        
      } else {
        console.log('App.tsx: 跟隨系統模式');
        // 跟隨系統 - 檢查系統偏好
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          applyGlobalTheme('dark');
        } else {
          applyGlobalTheme('light');
        }
      }
    };

    loadAndApplySettings();
    
    // 全局高對比度應用函數
    const applyGlobalHighContrast = (enabled: boolean) => {
      console.log('App.tsx: 應用全局高對比度:', enabled);
      
      if (enabled) {
        // 檢查當前主題
        const savedSettings = localStorage.getItem('settings');
        let isDarkTheme = false;
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          isDarkTheme = settings.general && settings.general.theme === 'dark';
        }
        
        if (isDarkTheme) {
          // 深色主題下的高對比度（排除設定頁面）
          const settingsPage = document.querySelector('.settings-page');
          if (!settingsPage) {
            document.body.style.setProperty('background-color', '#000000', 'important');
            document.body.style.setProperty('color', '#ffffff', 'important');
          }
          
          // 強制所有文字為白色（排除設定頁面）
          const allTextElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button, input, select, label');
          allTextElements.forEach(element => {
            if (element instanceof HTMLElement) {
              // 排除設定頁面的元素
              if (!element.closest('.settings-page')) {
                element.style.setProperty('color', '#ffffff', 'important');
              }
            }
          });
          
          // 強制所有背景為純黑（排除設定頁面）
          const allElements = document.querySelectorAll('*');
          allElements.forEach(element => {
            if (element instanceof HTMLElement) {
              // 排除設定頁面的元素
              if (!element.closest('.settings-page')) {
                const currentBg = element.style.backgroundColor || element.style.background;
                if (currentBg && !currentBg.includes('transparent')) {
                  element.style.setProperty('background-color', '#000000', 'important');
                }
              }
            }
          });
        } else {
          // 淺色主題下的高對比度（排除設定頁面）
          const settingsPage = document.querySelector('.settings-page');
          if (!settingsPage) {
            document.body.style.setProperty('background-color', '#ffffff', 'important');
            document.body.style.setProperty('color', '#000000', 'important');
          }
          
          // 強制所有文字為黑色（排除設定頁面）
          const allTextElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button, input, select, label');
          allTextElements.forEach(element => {
            if (element instanceof HTMLElement) {
              // 排除設定頁面的元素
              if (!element.closest('.settings-page')) {
                element.style.setProperty('color', '#000000', 'important');
              }
            }
          });
          
          // 強制所有背景為純白（排除設定頁面）
          const allElements = document.querySelectorAll('*');
          allElements.forEach(element => {
            if (element instanceof HTMLElement) {
              // 排除設定頁面的元素
              if (!element.closest('.settings-page')) {
                const currentBg = element.style.backgroundColor || element.style.background;
                if (currentBg && !currentBg.includes('transparent')) {
                  element.style.setProperty('background-color', '#ffffff', 'important');
                }
              }
            }
          });
        }
        
        // 設置高對比度的主題色變數
        const root = document.documentElement;
        root.style.setProperty('--primary', '#00ffff', 'important');      // 青色
        root.style.setProperty('--success', '#00ff00', 'important');      // 亮綠色
        root.style.setProperty('--warning', '#ffff00', 'important');      // 黃色
        root.style.setProperty('--danger', '#ff0000', 'important');       // 紅色
        
        // 強制應用高對比度到首頁的特定元素
        const homePage = document.querySelector('.home-page');
        if (homePage instanceof HTMLElement) {
          if (isDarkTheme) {
            homePage.style.setProperty('background-color', '#000000', 'important');
            homePage.style.setProperty('color', '#ffffff', 'important');
          } else {
            homePage.style.setProperty('background-color', '#ffffff', 'important');
            homePage.style.setProperty('color', '#000000', 'important');
          }
        }
        
        // 強制應用高對比度到首頁的卡片元素
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
          if (card instanceof HTMLElement) {
            if (isDarkTheme) {
              card.style.setProperty('background-color', '#000000', 'important');
              card.style.setProperty('border-color', '#00ffff', 'important');
              card.style.setProperty('color', '#ffffff', 'important');
            } else {
              card.style.setProperty('background-color', '#ffffff', 'important');
              card.style.setProperty('border-color', '#000000', 'important');
              card.style.setProperty('color', '#000000', 'important');
            }
          }
        });
        
        console.log('App.tsx: 全局高對比度已應用，主題:', isDarkTheme ? '深色' : '淺色');
      } else {
        // 關閉高對比度，恢復當前主題
        console.log('App.tsx: 關閉全局高對比度，恢復主題');
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          if (settings.general && settings.general.theme) {
            applyGlobalTheme(settings.general.theme);
          }
        }
      }
    };

    // 全局大字體應用函數
    const applyGlobalLargeText = (enabled: boolean) => {
      console.log('App.tsx: 應用全局大字體:', enabled);
      
      if (enabled) {
        // 應用大字體
        const root = document.documentElement;
        root.style.setProperty('--text-base', '1.25rem', 'important');
        root.style.setProperty('--text-xl', '1.5rem', 'important');
        root.style.setProperty('--text-2xl', '1.75rem', 'important');
        root.style.setProperty('--text-lg', '1.125rem', 'important');
        root.style.setProperty('--text-sm', '1rem', 'important');
        
        // 直接應用大字體到 body
        document.body.style.setProperty('font-size', '1.25rem', 'important');
        document.body.style.setProperty('line-height', '1.6', 'important');
        
        // 應用到大標題
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
          if (heading instanceof HTMLElement) {
            const currentSize = heading.style.fontSize;
            if (!currentSize) {
              heading.style.setProperty('font-size', 
                heading.tagName === 'H1' ? '2rem' : 
                heading.tagName === 'H2' ? '1.75rem' : 
                heading.tagName === 'H3' ? '1.5rem' : '1.25rem', 'important');
            }
          }
        });
        
        // 應用到段落和一般文字
        const paragraphs = document.querySelectorAll('p, span, div, button, input, select, label');
        paragraphs.forEach(element => {
          if (element instanceof HTMLElement) {
            const currentSize = element.style.fontSize;
            if (!currentSize) {
              element.style.setProperty('font-size', '1.125rem', 'important');
            }
          }
        });
        
        console.log('App.tsx: 全局大字體已應用');
      } else {
        // 恢復正常字體
        const root = document.documentElement;
        root.style.removeProperty('--text-base');
        root.style.removeProperty('--text-xl');
        root.style.removeProperty('--text-2xl');
        root.style.removeProperty('--text-lg');
        root.style.removeProperty('--text-sm');
        
        document.body.style.removeProperty('font-size');
        document.body.style.removeProperty('line-height');
        
        // 恢復所有元素的字體大小
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
          if (element instanceof HTMLElement) {
            element.style.removeProperty('font-size');
          }
        });
        
        console.log('App.tsx: 全局大字體已恢復');
      }
    };

    // 全局語言應用函數
    const applyGlobalLanguage = (language: string) => {
      console.log('App.tsx: 應用全局語言:', language);
      
      // 設置 HTML lang 屬性
      document.documentElement.setAttribute('lang', language);
      
      // 通知所有組件語言已變更
      window.dispatchEvent(new CustomEvent('languageUpdated', { 
        detail: { language } 
      }));
      
      console.log('App.tsx: 全局語言已應用');
    };

    // 監聽主題變更事件
    const handleThemeChange = (event: CustomEvent) => {
      console.log('App.tsx: 收到主題變更事件:', event.detail.theme);
      applyGlobalTheme(event.detail.theme);
    };
    
    // 監聽高對比度變更事件
    const handleHighContrastChange = (event: CustomEvent) => {
      console.log('App.tsx: 收到高對比度變更事件:', event.detail.enabled);
      applyGlobalHighContrast(event.detail.enabled);
    };
    
    // 監聽大字體變更事件
    const handleLargeTextChange = (event: CustomEvent) => {
      console.log('App.tsx: 收到大字體變更事件:', event.detail.enabled);
      applyGlobalLargeText(event.detail.enabled);
    };
    
    // 監聽語言變更事件
    const handleLanguageChange = (event: CustomEvent) => {
      console.log('App.tsx: 收到語言變更事件:', event.detail.language);
      applyGlobalLanguage(event.detail.language);
    };
    
    window.addEventListener('themeChanged', handleThemeChange as EventListener);
    window.addEventListener('highContrastChanged', handleHighContrastChange as EventListener);
    window.addEventListener('largeTextChanged', handleLargeTextChange as EventListener);
    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    // 監聽頁面切換事件，重新應用主題和高對比度
    const handleRouteChange = () => {
      console.log('App.tsx: 頁面切換，重新應用主題和高對比度');
      const savedSettings = localStorage.getItem('settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.general && settings.general.theme) {
          // 延遲一下再應用，確保 DOM 已更新
          setTimeout(() => {
            applyGlobalTheme(settings.general.theme);
          }, 100);
        }
        if (settings.accessibility && settings.accessibility.highContrast) {
          // 延遲一下再應用高對比度，確保 DOM 已更新
          setTimeout(() => {
            console.log('App.tsx: 頁面切換後重新應用高對比度');
            applyGlobalHighContrast(true);
          }, 150);
        }
      }
    };
    
    // 監聽 popstate 事件（瀏覽器前進/後退）
    window.addEventListener('popstate', handleRouteChange);
    
    // 監聽 React Router 的導航事件
    const handleNavigation = () => {
      console.log('App.tsx: React Router 導航，重新應用主題和高對比度');
      const savedSettings = localStorage.getItem('settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.general && settings.general.theme) {
          // 延遲一下再應用，確保 DOM 已更新
          setTimeout(() => {
            applyGlobalTheme(settings.general.theme);
          }, 100);
        }
        if (settings.accessibility && settings.accessibility.highContrast) {
          // 延遲一下再應用高對比度，確保 DOM 已更新
          setTimeout(() => {
            console.log('App.tsx: React Router 導航後重新應用高對比度');
            applyGlobalHighContrast(true);
          }, 150);
        }
      }
    };
    
    // 使用 MutationObserver 監聽 DOM 變化，當頁面內容改變時重新應用主題
    const observer = new MutationObserver((mutations) => {
      let shouldReapplyTheme = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // 檢查是否有新的頁面內容被添加
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement && 
                (node.classList.contains('settings-page') || 
                 node.classList.contains('home-page') ||
                 node.querySelector('header') ||
                 node.querySelector('main'))) {
              shouldReapplyTheme = true;
            }
          });
        }
      });
      
      if (shouldReapplyTheme) {
        console.log('App.tsx: DOM 變化檢測到頁面切換，重新應用主題');
        handleNavigation();
      }
    });
    
    // 暫時禁用 DOM 變化監聽器來測試
    // observer.observe(document.body, {
    //   childList: true,
    //   subtree: true
    // });
    console.log('App.tsx: DOM 變化監聽器已禁用');
    
    // 清理事件監聽器
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
      window.removeEventListener('highContrastChanged', handleHighContrastChange as EventListener);
      window.removeEventListener('largeTextChanged', handleLargeTextChange as EventListener);
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
      window.removeEventListener('popstate', handleRouteChange);
      observer.disconnect();
    };
  }, []);

  // 添加路由調試日誌
  console.log('App.tsx: 渲染路由配置');
  console.log('App.tsx: 當前URL:', window.location.href);
  console.log('App.tsx: 當前路徑:', window.location.pathname);
  console.log('App.tsx: 渲染時間:', new Date().toLocaleString());
  
  // 添加路由變化監聽
  useEffect(() => {
    const handleRouteChange = () => {
      console.log('App.tsx: 路由變化檢測到');
      console.log('App.tsx: 新URL:', window.location.href);
      console.log('App.tsx: 新路徑:', window.location.pathname);
    };
    
    // 監聽所有路由變化
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      console.log('App.tsx: pushState 被調用', args);
      originalPushState.apply(history, args);
      handleRouteChange();
    };
    
    history.replaceState = function(...args) {
      console.log('App.tsx: replaceState 被調用', args);
      originalReplaceState.apply(history, args);
      handleRouteChange();
    };
    
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);
  
  return (
    <div className="app-container">
      <Router>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          {/* <Route path="/ai-assistant" element={<AIHealthAssistant />} /> */}
            <Route path="/medications" element={<Medications />} />
          <Route path="/medications/add" element={<AddMedication />} />
          <Route path="/medications/edit/:id" element={<AddMedication />} />
            <Route path="/blood-pressure" element={<BloodPressure />} />
          <Route path="/blood-pressure/add" element={<AddBloodPressure />} />
          <Route path="/blood-pressure/edit/:id" element={<AddBloodPressure />} />
            <Route path="/blood-sugar" element={<BloodSugar />} />
            <Route path="/blood-sugar/add" element={<AddBloodSugar />} />
          <Route path="/blood-sugar/edit/:id" element={<AddBloodSugar />} />
            <Route path="/weight-management" element={<WeightList />} />
            <Route path="/add-weight" element={<AddWeight />} />
            <Route path="/edit-weight/:id" element={<AddWeight />} />
            <Route path="/emergency-help" element={<EmergencyHelp />} />
            <Route path="/reminder-management" element={<ReminderManagement />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </Router>
    </div>
  );
};

export default App;
