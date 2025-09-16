import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';

// Mock react-router-dom
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// 測試用的包裝組件
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('組件渲染測試', () => {
    test('應該正確渲染頁面標題', () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText('CareOld')).toBeInTheDocument();
      expect(screen.getByText('您的健康管理助手')).toBeInTheDocument();
    });

    test('應該渲染歡迎區域', () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText('歡迎回來！')).toBeInTheDocument();
      expect(screen.getByText('今天也要關注您的健康哦')).toBeInTheDocument();
    });

    test('應該渲染主要功能區域標題', () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText('主要功能')).toBeInTheDocument();
    });

    test('應該渲染快速操作區域標題', () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText('快速操作')).toBeInTheDocument();
    });

    test('應該渲染健康摘要區域標題', () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText('健康摘要')).toBeInTheDocument();
    });
  });

  describe('功能卡片測試', () => {
    test('應該渲染所有功能卡片', () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText('用藥管理')).toBeInTheDocument();
      expect(screen.getByText('體重管理')).toBeInTheDocument();
      expect(screen.getByText('血壓管理')).toBeInTheDocument();
      expect(screen.getByText('血糖管理')).toBeInTheDocument();
      expect(screen.getByText('AI健康助手')).toBeInTheDocument();
    });

    test('應該顯示功能卡片的描述', () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText('管理日常用藥提醒')).toBeInTheDocument();
      expect(screen.getByText('追蹤體重變化趨勢')).toBeInTheDocument();
      expect(screen.getByText('監控血壓健康狀況')).toBeInTheDocument();
      expect(screen.getByText('追蹤血糖控制情況')).toBeInTheDocument();
      expect(screen.getByText('智能健康諮詢與建議')).toBeInTheDocument();
    });

    test('功能卡片應該有正確的圖標', () => {
      renderWithRouter(<Home />);
      
      // 檢查 SVG 元素是否存在
      const svgElements = document.querySelectorAll('svg');
      expect(svgElements.length).toBeGreaterThan(0);
    });
  });

  describe('快速操作測試', () => {
    test('應該渲染快速操作卡片', () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText('緊急求助')).toBeInTheDocument();
      expect(screen.getByText('設置提醒')).toBeInTheDocument();
    });

    test('應該顯示快速操作的描述', () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText('快速聯繫緊急服務')).toBeInTheDocument();
      expect(screen.getByText('管理健康提醒事項')).toBeInTheDocument();
    });
  });

  describe('健康摘要測試', () => {
    test('應該顯示體重信息', () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText('72.5')).toBeInTheDocument();
      expect(screen.getByText('當前體重 (kg)')).toBeInTheDocument();
    });

    test('應該顯示血壓信息', () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText('120/80')).toBeInTheDocument();
      expect(screen.getByText('血壓 (mmHg)')).toBeInTheDocument();
    });
  });

  describe('底部導航測試', () => {
    test('應該渲染底部導航項目', () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText('首頁')).toBeInTheDocument();
      expect(screen.getByText('用藥')).toBeInTheDocument();
      expect(screen.getByText('個人')).toBeInTheDocument();
      expect(screen.getByText('設置')).toBeInTheDocument();
    });

    test('首頁導航項目應該處於激活狀態', () => {
      renderWithRouter(<Home />);
      
      const homeNavItem = screen.getByText('首頁').closest('.nav-item');
      expect(homeNavItem).toHaveClass('active');
    });
  });

  describe('用戶交互測試', () => {
    test('點擊用藥管理卡片應該導航到正確頁面', () => {
      renderWithRouter(<Home />);
      
      const medicationCard = screen.getByText('用藥管理').closest('.feature-card');
      fireEvent.click(medicationCard!);
      
      expect(mockNavigate).toHaveBeenCalledWith('/medications');
    });

    test('點擊體重管理卡片應該導航到正確頁面', () => {
      renderWithRouter(<Home />);
      
      const weightCard = screen.getByText('體重管理').closest('.feature-card');
      fireEvent.click(weightCard!);
      
      expect(mockNavigate).toHaveBeenCalledWith('/weight-management');
    });

    test('點擊血壓管理卡片應該導航到正確頁面', () => {
      renderWithRouter(<Home />);
      
      const bloodPressureCard = screen.getByText('血壓管理').closest('.feature-card');
      fireEvent.click(bloodPressureCard!);
      
      expect(mockNavigate).toHaveBeenCalledWith('/blood-pressure');
    });

    test('點擊血糖管理卡片應該導航到正確頁面', () => {
      renderWithRouter(<Home />);
      
      const bloodSugarCard = screen.getByText('血糖管理').closest('.feature-card');
      fireEvent.click(bloodSugarCard!);
      
      expect(mockNavigate).toHaveBeenCalledWith('/blood-sugar');
    });

    test('點擊AI健康助手卡片應該導航到正確頁面', () => {
      renderWithRouter(<Home />);
      
      const aiAssistantCard = screen.getByText('AI健康助手').closest('.feature-card');
      fireEvent.click(aiAssistantCard!);
      
      expect(mockNavigate).toHaveBeenCalledWith('/ai-assistant');
    });

    test('點擊緊急求助卡片應該導航到正確頁面', () => {
      renderWithRouter(<Home />);
      
      const emergencyCard = screen.getByText('緊急求助').closest('.card');
      fireEvent.click(emergencyCard!);
      
      expect(mockNavigate).toHaveBeenCalledWith('/emergency');
    });

    test('點擊設置提醒卡片應該導航到正確頁面', () => {
      renderWithRouter(<Home />);
      
      const reminderCard = screen.getByText('設置提醒').closest('.card');
      fireEvent.click(reminderCard!);
      
      expect(mockNavigate).toHaveBeenCalledWith('/reminder-management');
    });

    test('點擊底部導航項目應該導航到正確頁面', () => {
      renderWithRouter(<Home />);
      
      const medicationNav = screen.getByText('用藥');
      fireEvent.click(medicationNav);
      
      expect(mockNavigate).toHaveBeenCalledWith('/medications');
    });
  });

  describe('鍵盤導航測試', () => {
    test('應該支持鍵盤導航 - Enter 鍵', () => {
      renderWithRouter(<Home />);
      
      const medicationCard = screen.getByText('用藥管理').closest('.feature-card');
      fireEvent.keyDown(medicationCard!, { key: 'Enter' });
      
      expect(mockNavigate).toHaveBeenCalledWith('/medications');
    });

    test('應該支持鍵盤導航 - 空格鍵', () => {
      renderWithRouter(<Home />);
      
      const medicationCard = screen.getByText('用藥管理').closest('.feature-card');
      fireEvent.keyDown(medicationCard!, { key: ' ' });
      
      expect(mockNavigate).toHaveBeenCalledWith('/medications');
    });
  });

  describe('無障礙性測試', () => {
    test('功能卡片應該有正確的 role 屬性', () => {
      renderWithRouter(<Home />);
      
      const featureCards = document.querySelectorAll('.feature-card[role="button"]');
      expect(featureCards.length).toBe(5);
    });

    test('功能卡片應該有正確的 tabIndex', () => {
      renderWithRouter(<Home />);
      
      const featureCards = document.querySelectorAll('.feature-card[tabindex="0"]');
      expect(featureCards.length).toBe(5);
    });

    test('快速操作卡片應該有正確的 role 屬性', () => {
      renderWithRouter(<Home />);
      
      const quickActionCards = document.querySelectorAll('.quick-actions-section .card[role="button"]');
      expect(quickActionCards.length).toBe(2);
    });

    test('底部導航項目應該有正確的 role 屬性', () => {
      renderWithRouter(<Home />);
      
      const navItems = document.querySelectorAll('.nav-item[role="button"]');
      expect(navItems.length).toBe(4);
    });
  });

  describe('響應式設計測試', () => {
    test('應該有正確的 CSS 類名', () => {
      renderWithRouter(<Home />);
      
      expect(document.querySelector('.app-container')).toBeInTheDocument();
      expect(document.querySelector('.page-container')).toBeInTheDocument();
      expect(document.querySelector('.nav-header')).toBeInTheDocument();
      expect(document.querySelector('.bottom-nav')).toBeInTheDocument();
    });

    test('應該有動畫類名', () => {
      renderWithRouter(<Home />);
      
      expect(document.querySelector('.animate-fade-in')).toBeInTheDocument();
      expect(document.querySelector('.animate-delay-100')).toBeInTheDocument();
      expect(document.querySelector('.animate-delay-300')).toBeInTheDocument();
      expect(document.querySelector('.animate-delay-400')).toBeInTheDocument();
    });
  });
});
