import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReminderManagementTest: React.FC = () => {
  console.log('ReminderManagementTest 組件渲染');
  console.log('當前URL:', window.location.href);
  console.log('當前路徑:', window.location.pathname);
  
  // 添加組件生命週期日誌
  console.log('ReminderManagementTest 組件開始渲染');
  
  try {
    const navigate = useNavigate();
    console.log('useNavigate 初始化成功');
    
    // 添加渲染完成日誌
    console.log('ReminderManagementTest 組件即將返回JSX');
    
    return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      padding: '20px'
    }}>
      <header style={{
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button 
          onClick={() => navigate('/settings')}
          style={{
            background: '#007AFF',
            color: '#ffffff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          返回設定
        </button>
        <h1 style={{ margin: 0 }}>提醒管理測試</h1>
        <div style={{ width: '100px' }}></div>
      </header>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h2>測試頁面載入成功！</h2>
        <p>如果你看到這個頁面，說明導航功能正常。</p>
        <p>時間: {new Date().toLocaleString()}</p>
      </div>
    </div>
    );
  } catch (error) {
    console.error('ReminderManagementTest 組件錯誤:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>組件錯誤</h2>
        <p>錯誤: {error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
};

export default ReminderManagementTest;
