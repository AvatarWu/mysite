import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// 使用 const 聲明並直接導出
export const IonRouterOutlet = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const IonBackButton = () => <button>Back</button>;
export const IonReactRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);
export const IonTabs = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const IonTabBar = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const IonTabButton = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

// 移除默認導出，因為我們使用命名導出 