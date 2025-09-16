import { Keyboard } from '@capacitor/keyboard';

/**
 * 鍵盤管理服務
 * 處理 iOS 鍵盤相關問題，包括隱藏系統 Done 按鈕
 */
export class KeyboardService {
  private static instance: KeyboardService;
  private isKeyboardVisible = false;
  private keyboardHeight = 0;

  private constructor() {
    this.initializeKeyboardListeners();
  }

  public static getInstance(): KeyboardService {
    if (!KeyboardService.instance) {
      KeyboardService.instance = new KeyboardService();
    }
    return KeyboardService.instance;
  }

  /**
   * 初始化鍵盤監聽器
   */
  private initializeKeyboardListeners(): void {
    // 監聽鍵盤顯示事件
    Keyboard.addListener('keyboardWillShow', (info) => {
      this.isKeyboardVisible = true;
      this.keyboardHeight = info.keyboardHeight;
      this.hideSystemDoneButton();
    });

    // 監聽鍵盤隱藏事件
    Keyboard.addListener('keyboardWillHide', () => {
      this.isKeyboardVisible = false;
      this.keyboardHeight = 0;
    });

    // 監聽鍵盤高度變化
    Keyboard.addListener('keyboardDidShow', (info) => {
      this.keyboardHeight = info.keyboardHeight;
      this.hideSystemDoneButton();
    });
  }

  /**
   * 隱藏系統 Done 按鈕
   */
  private hideSystemDoneButton(): void {
    // 等待 DOM 更新後執行
    setTimeout(() => {
      this.forceHideSystemElements();
    }, 100);
  }

  /**
   * 強制隱藏系統元素
   */
  private forceHideSystemElements(): void {
    const selectors = [
      '._UIToolbarContentView',
      '._UIButtonBarStackView', 
      '._UIModernBarButton',
      '._UIButtonBarButton',
      'UIButtonLabel',
      'SystemInputAssistantView',
      '.inputAccessoryView',
      '[data-input-accessory-view-id]'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const htmlElement = element as HTMLElement;
        htmlElement.style.display = 'none !important';
        htmlElement.style.visibility = 'hidden !important';
        htmlElement.style.height = '0 !important';
        htmlElement.style.width = '0 !important';
        htmlElement.style.overflow = 'hidden !important';
        htmlElement.style.position = 'absolute !important';
        htmlElement.style.left = '-9999px !important';
        htmlElement.style.top = '-9999px !important';
        htmlElement.style.zIndex = '-9999 !important';
      });
    });

    // 隱藏所有可能的系統按鈕
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
      const buttonText = button.textContent?.toLowerCase() || '';
      if (buttonText.includes('done') || buttonText.includes('完成') || buttonText.includes('done')) {
        const rect = button.getBoundingClientRect();
        // 如果按鈕在鍵盤區域附近，隱藏它
        if (rect.top > window.innerHeight - this.keyboardHeight - 100) {
          button.style.display = 'none !important';
          button.style.visibility = 'hidden !important';
        }
      }
    });
  }

  /**
   * 設置輸入欄位屬性以隱藏系統按鈕
   */
  public setupInputField(inputElement: HTMLInputElement | HTMLTextAreaElement): void {
    if (!inputElement) return;

    // 設置屬性
    inputElement.setAttribute('inputAccessoryViewID', '');
    inputElement.setAttribute('data-input-accessory-view-id', '');
    inputElement.setAttribute('autocomplete', 'off');
    inputElement.setAttribute('autocorrect', 'off');
    inputElement.setAttribute('autocapitalize', 'off');
    inputElement.setAttribute('spellcheck', 'false');

    // 設置樣式
    inputElement.style.setProperty('-webkit-input-accessory-view', 'none', 'important');
    inputElement.style.setProperty('input-accessory-view', 'none', 'important');

    // 監聽焦點事件
    inputElement.addEventListener('focus', () => {
      this.hideSystemDoneButton();
    });

    inputElement.addEventListener('blur', () => {
      this.hideSystemDoneButton();
    });
  }

  /**
   * 為所有輸入欄位設置鍵盤控制
   */
  public setupAllInputFields(): void {
    const inputSelectors = [
      'input[type="text"]',
      'input[type="number"]',
      'input[type="email"]',
      'input[type="tel"]',
      'input[type="time"]',
      'input[type="date"]',
      'textarea'
    ];

    inputSelectors.forEach(selector => {
      const inputs = document.querySelectorAll(selector);
      inputs.forEach(input => {
        this.setupInputField(input as HTMLInputElement | HTMLTextAreaElement);
      });
    });
  }

  /**
   * 隱藏鍵盤
   */
  public async hideKeyboard(): Promise<void> {
    try {
      await Keyboard.hide();
    } catch (error) {
      console.warn('無法隱藏鍵盤:', error);
    }
  }

  /**
   * 顯示鍵盤
   */
  public async showKeyboard(): Promise<void> {
    try {
      await Keyboard.show();
    } catch (error) {
      console.warn('無法顯示鍵盤:', error);
    }
  }

  /**
   * 獲取鍵盤狀態
   */
  public getKeyboardState(): { isVisible: boolean; height: number } {
    return {
      isVisible: this.isKeyboardVisible,
      height: this.keyboardHeight
    };
  }

  /**
   * 設置鍵盤樣式
   */
  public setKeyboardStyle(style: 'dark' | 'light'): void {
    try {
      // 鍵盤樣式設置在 iOS 中可能不可用，跳過此功能
      console.log('鍵盤樣式設置:', style);
    } catch (error) {
      console.warn('無法設置鍵盤樣式:', error);
    }
  }

  /**
   * 設置鍵盤縮放
   */
  public setKeyboardResizeMode(mode: 'body' | 'ionic' | 'native'): void {
    try {
      // 鍵盤縮放模式設置在 iOS 中可能不可用，跳過此功能
      console.log('鍵盤縮放模式設置:', mode);
    } catch (error) {
      console.warn('無法設置鍵盤縮放模式:', error);
    }
  }

  /**
   * 清理監聽器
   */
  public cleanup(): void {
    Keyboard.removeAllListeners();
  }
}

// 導出單例實例
export const keyboardService = KeyboardService.getInstance();
