import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddMedication from '../pages/AddMedication';

describe('AddMedication', () => {
  const renderWithRouter = () =>
    render(
      <MemoryRouter>
        <AddMedication />
      </MemoryRouter>
    );

  test('頻率切換時提醒時間欄位數量正確調整', () => {
    renderWithRouter();

    // 初始為 three-times，應有 3 個 time 輸入
    expect(screen.getAllByRole('textbox', { hidden: true }).filter(el => (el as HTMLInputElement).type === 'time').length).toBe(3);

    const frequencySelect = screen.getByRole('combobox');

    // 切換為每日 (daily) 應為 1 個
    fireEvent.change(frequencySelect, { target: { value: 'daily' } });
    expect(document.querySelectorAll('input[type="time"]').length).toBe(1);

    // 切換為每日兩次 (twice-daily) 應為 2 個
    fireEvent.change(frequencySelect, { target: { value: 'twice-daily' } });
    expect(document.querySelectorAll('input[type="time"]').length).toBe(2);

    // 切換回每日三次 (three-times) 應為 3 個
    fireEvent.change(frequencySelect, { target: { value: 'three-times' } });
    expect(document.querySelectorAll('input[type="time"]').length).toBe(3);
  });

  test('藥物名稱與劑量為必填', () => {
    renderWithRouter();

    const completeBtn = screen.getByRole('button', { name: /完成|儲存中/ });
    fireEvent.click(completeBtn);

    expect(screen.getByText('請輸入藥物名稱')).toBeInTheDocument();
    expect(screen.getByText('請輸入劑量')).toBeInTheDocument();
  });
});


