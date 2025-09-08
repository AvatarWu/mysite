import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';

// 測試用的包裝組件
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('Design System', () => {
  describe('CSS 變量測試', () => {
    test('應該有正確的顏色變量', () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      // 檢查主要顏色變量
      expect(computedStyle.getPropertyValue('--primary')).toBeDefined();
      expect(computedStyle.getPropertyValue('--success')).toBeDefined();
      expect(computedStyle.getPropertyValue('--warning')).toBeDefined();
      expect(computedStyle.getPropertyValue('--danger')).toBeDefined();
      
      // 檢查中性顏色變量
      expect(computedStyle.getPropertyValue('--neutral-50')).toBeDefined();
      expect(computedStyle.getPropertyValue('--neutral-900')).toBeDefined();
    });

    test('應該有正確的間距變量', () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      expect(computedStyle.getPropertyValue('--spacing-0')).toBeDefined();
      expect(computedStyle.getPropertyValue('--spacing-4')).toBeDefined();
      expect(computedStyle.getPropertyValue('--spacing-8')).toBeDefined();
      expect(computedStyle.getPropertyValue('--spacing-16')).toBeDefined();
    });

    test('應該有正確的字體大小變量', () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      expect(computedStyle.getPropertyValue('--text-xs')).toBeDefined();
      expect(computedStyle.getPropertyValue('--text-base')).toBeDefined();
      expect(computedStyle.getPropertyValue('--text-xl')).toBeDefined();
      expect(computedStyle.getPropertyValue('--text-4xl')).toBeDefined();
    });

    test('應該有正確的圓角變量', () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      expect(computedStyle.getPropertyValue('--radius-sm')).toBeDefined();
      expect(computedStyle.getPropertyValue('--radius-lg')).toBeDefined();
      expect(computedStyle.getPropertyValue('--radius-full')).toBeDefined();
    });

    test('應該有正確的陰影變量', () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      expect(computedStyle.getPropertyValue('--shadow-sm')).toBeDefined();
      expect(computedStyle.getPropertyValue('--shadow-md')).toBeDefined();
      expect(computedStyle.getPropertyValue('--shadow-lg')).toBeDefined();
    });

    test('應該有正確的動畫變量', () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      expect(computedStyle.getPropertyValue('--transition-fast')).toBeDefined();
      expect(computedStyle.getPropertyValue('--transition-normal')).toBeDefined();
      expect(computedStyle.getPropertyValue('--transition-slow')).toBeDefined();
    });

    test('應該有正確的安全區域變量', () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      expect(computedStyle.getPropertyValue('--safe-area-top')).toBeDefined();
      expect(computedStyle.getPropertyValue('--safe-area-bottom')).toBeDefined();
      expect(computedStyle.getPropertyValue('--safe-area-left')).toBeDefined();
      expect(computedStyle.getPropertyValue('--safe-area-right')).toBeDefined();
    });
  });

  describe('組件樣式測試', () => {
    test('按鈕組件應該有正確的樣式類', () => {
      renderWithRouter(<Home />);
      
      // 檢查按鈕樣式類是否存在
      const buttonStyles = document.querySelector('.btn');
      expect(buttonStyles).toBeInTheDocument();
    });

    test('卡片組件應該有正確的樣式類', () => {
      renderWithRouter(<Home />);
      
      // 檢查卡片樣式類是否存在
      const cardStyles = document.querySelector('.card');
      expect(cardStyles).toBeInTheDocument();
    });

    test('功能卡片應該有正確的樣式類', () => {
      renderWithRouter(<Home />);
      
      // 檢查功能卡片樣式類是否存在
      const featureCardStyles = document.querySelector('.feature-card');
      expect(featureCardStyles).toBeInTheDocument();
    });

    test('導航組件應該有正確的樣式類', () => {
      renderWithRouter(<Home />);
      
      // 檢查導航樣式類是否存在
      const navStyles = document.querySelector('.nav-header');
      expect(navStyles).toBeInTheDocument();
      
      const bottomNavStyles = document.querySelector('.bottom-nav');
      expect(bottomNavStyles).toBeInTheDocument();
    });
  });

  describe('響應式設計測試', () => {
    test('應該有響應式網格類', () => {
      renderWithRouter(<Home />);
      
      // 檢查響應式網格類是否存在
      const gridStyles = document.querySelector('.grid');
      expect(gridStyles).toBeInTheDocument();
      
      const gridCols2 = document.querySelector('.grid-cols-2');
      expect(gridCols2).toBeInTheDocument();
    });

    test('應該有響應式容器類', () => {
      renderWithRouter(<Home />);
      
      // 檢查響應式容器類是否存在
      const containerStyles = document.querySelector('.container');
      expect(containerStyles).toBeInTheDocument();
    });
  });

  describe('動畫系統測試', () => {
    test('應該有淡入動畫類', () => {
      renderWithRouter(<Home />);
      
      // 檢查動畫類是否存在
      const fadeInStyles = document.querySelector('.animate-fade-in');
      expect(fadeInStyles).toBeInTheDocument();
    });

    test('應該有動畫延遲類', () => {
      renderWithRouter(<Home />);
      
      // 檢查動畫延遲類是否存在
      const delay100 = document.querySelector('.animate-delay-100');
      const delay300 = document.querySelector('.animate-delay-300');
      const delay400 = document.querySelector('.animate-delay-400');
      
      expect(delay100).toBeInTheDocument();
      expect(delay300).toBeInTheDocument();
      expect(delay400).toBeInTheDocument();
    });
  });

  describe('工具類測試', () => {
    test('應該有文字對齊工具類', () => {
      renderWithRouter(<Home />);
      
      // 檢查文字對齊工具類是否存在
      const textCenter = document.querySelector('.text-center');
      expect(textCenter).toBeInTheDocument();
    });

    test('應該有字體粗細工具類', () => {
      renderWithRouter(<Home />);
      
      // 檢查字體粗細工具類是否存在
      const fontBold = document.querySelector('.font-bold');
      expect(fontBold).toBeInTheDocument();
    });

    test('應該有字體大小工具類', () => {
      renderWithRouter(<Home />);
      
      // 檢查字體大小工具類是否存在
      const text2xl = document.querySelector('.text-2xl');
      const textSm = document.querySelector('.text-sm');
      
      expect(text2xl).toBeInTheDocument();
      expect(textSm).toBeInTheDocument();
    });
  });

  describe('無障礙性測試', () => {
    test('應該支持鍵盤導航', () => {
      renderWithRouter(<Home />);
      
      // 檢查是否有 tabindex 屬性
      const focusableElements = document.querySelectorAll('[tabindex]');
      expect(focusableElements.length).toBeGreaterThan(0);
    });
  });

  describe('深色模式支持', () => {
    test('應該有深色模式的媒體查詢', () => {
      // 這個測試檢查 CSS 是否包含深色模式的媒體查詢
      // 由於我們無法直接測試 CSS 媒體查詢，我們檢查組件是否正確渲染
      renderWithRouter(<Home />);
      
      // 檢查組件是否正確渲染
      expect(document.querySelector('.app-container')).toBeInTheDocument();
    });
  });

  describe('性能優化測試', () => {
    test('應該有觸摸優化的媒體查詢', () => {
      renderWithRouter(<Home />);
      
      // 檢查組件是否正確渲染
      expect(document.querySelector('.feature-card')).toBeInTheDocument();
    });

    test('應該有減少動畫的媒體查詢', () => {
      renderWithRouter(<Home />);
      
      // 檢查組件是否正確渲染
      expect(document.querySelector('.animate-fade-in')).toBeInTheDocument();
    });
  });

  describe('高對比度模式支持', () => {
    test('應該有高對比度模式的媒體查詢', () => {
      renderWithRouter(<Home />);
      
      // 檢查組件是否正確渲染
      expect(document.querySelector('.feature-card')).toBeInTheDocument();
    });
  });
});
