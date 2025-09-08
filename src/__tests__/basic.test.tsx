import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../pages/Home';

// 簡單的測試，不涉及路由
describe('Basic Home Component Tests', () => {
  test('應該渲染頁面標題', () => {
    render(<Home />);
    
    // 檢查基本文本是否存在
    expect(screen.getByText('CareOld')).toBeTruthy();
    expect(screen.getByText('您的健康管理助手')).toBeTruthy();
  });

  test('應該渲染主要功能區域', () => {
    render(<Home />);
    
    expect(screen.getByText('主要功能')).toBeTruthy();
    expect(screen.getByText('用藥管理')).toBeTruthy();
    expect(screen.getByText('體重管理')).toBeTruthy();
  });

  test('應該渲染快速操作區域', () => {
    render(<Home />);
    
    expect(screen.getByText('快速操作')).toBeTruthy();
    expect(screen.getByText('緊急求助')).toBeTruthy();
    expect(screen.getByText('設置提醒')).toBeTruthy();
  });

  test('應該渲染健康摘要區域', () => {
    render(<Home />);
    
    expect(screen.getByText('健康摘要')).toBeTruthy();
    expect(screen.getByText('72.5')).toBeTruthy();
    expect(screen.getByText('120/80')).toBeTruthy();
  });

  test('應該渲染底部導航', () => {
    render(<Home />);
    
    expect(screen.getByText('首頁')).toBeTruthy();
    expect(screen.getByText('用藥')).toBeTruthy();
    expect(screen.getByText('個人')).toBeTruthy();
    expect(screen.getByText('設置')).toBeTruthy();
  });
});
