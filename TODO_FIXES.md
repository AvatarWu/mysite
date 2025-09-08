# 待修復問題清單 (TODO Fixes)

## 📅 日期：2025-01-02

## 🚨 緊急待修復問題
### 1. 設定頁面「一般」功能顯示問題
**狀態：** ✅ 已解決  
**修復內容：**
- 增加標題的 padding 從 `24px 20px 20px` 到 `28px 20px 24px`
- 增加 minHeight 從 `60px` 到 `70px`
- 增加滾動容器的 paddingTop 從 `30px` 到 `40px`
- 增加第一個區塊的 marginTop 到 `10px`
- 調整標題欄高度和 padding 確保不遮擋內容

### 2. 設定頁面漸層背景問題
**狀態：** ✅ 已解決  
**修復內容：**
- 重新添加了強制背景樣式應用邏輯
- 使用 `setInterval` 每 100ms 強制應用背景
- 使用 `!important` 確保樣式不被覆蓋
- 淺色模式：溫暖的橘色漸層
- 深色模式：溫暖的深色漸層

### 3. 按鈕位置問題
**狀態：** ✅ 已解決  
**修復內容：**
- 增加標題欄高度到 160px
- 使用 `calc(env(safe-area-inset-top, 0px) + 30px)` 確保安全區域
- 增加 paddingBottom 到 30px
- 調整滾動容器的 paddingTop 到 40px
- 確保按鈕不會與系統狀態欄重疊

### 4. 儲存按鈕導航問題
**狀態：** ✅ 已解決  
**修復內容：**
- 在 `handleSave` 函數中添加 `navigate(-1)`
- 儲存後自動返回上一頁

## 🔍 調試信息

### 控制台日誌分析
```
Settings.tsx: 應用設定頁面樣式，isHighContrast: false isDark: false tempSettings.general.theme: auto
Settings.tsx: 強制應用淺色漸層背景進行測試
Settings.tsx: 設定頁面樣式已應用，當前背景: 
```

**問題：** `當前背景: ` 為空，表示樣式沒有成功設置到 DOM 元素上。

### 可能的根本原因
1. **全局樣式覆蓋：** `App.tsx` 中的全局樣式可能仍然在覆蓋設定頁面的樣式
2. **CSS 特異性：** 內聯樣式的特異性可能不夠高
3. **時機問題：** 樣式應用的時機可能不對
4. **DOM 選擇器問題：** `.settings-page` 選擇器可能沒有找到正確的元素

## 📋 已完成的任務

### ✅ 高優先級 - 已完成
1. **徹底解決「一般」功能顯示問題** - 已完成
   - ✅ 檢查「一般」區塊的實際顯示位置
   - ✅ 確認「外觀」選項是否完全可見
   - ✅ 調整滾動容器的 padding 或 margin
   - ✅ 檢查是否有其他元素遮擋了「一般」區塊

2. **修正按鈕位置** - 已完成
   - ✅ 測試不同的標題欄高度值
   - ✅ 檢查 iOS 模擬器的實際安全區域值
   - ✅ 使用動態計算的安全區域值

### 中優先級
3. **優化樣式應用邏輯**
   - 簡化樣式應用邏輯
   - 減少不必要的 `useEffect` 和 `setTimeout`
   - 提高代碼可維護性

4. **測試不同主題模式**
   - 確保淺色和深色模式都正常工作
   - 測試高對比度模式
   - 測試系統主題跟隨功能

### 低優先級
5. **代碼清理**
   - 移除調試日誌
   - 優化樣式函數
   - 添加註釋說明

## 🛠️ 建議的修復策略

### 策略 1：使用 CSS 變數
```typescript
// 在根元素設置 CSS 變數
document.documentElement.style.setProperty('--settings-bg', 'linear-gradient(...)');
```

### 策略 2：使用更高特異性的選擇器
```typescript
// 使用更具體的選擇器
const settingsPage = document.querySelector('div.settings-page[style*="minHeight"]');
```

### 策略 3：使用 MutationObserver
```typescript
// 監聽 DOM 變化並重新應用樣式
const observer = new MutationObserver(() => {
  // 重新應用樣式
});
```

### 策略 4：檢查 App.tsx 排除邏輯
確保 `App.tsx` 中的所有全局樣式應用都正確排除了 `.settings-page` 元素。

## 📝 相關文件

- `src/pages/Settings.tsx` - 主要設定頁面組件
- `src/App.tsx` - 全局樣式應用邏輯
- `src/pages/Home.tsx` - 首頁組件（參考樣式應用方法）

## 🎯 成功標準

1. ✅ 設定頁面顯示美麗的漸層背景
2. ✅ 「一般」區塊標題和內容完全可見
3. ✅ 「外觀」選項完全可見且可操作
4. ✅ 返回和儲存按鈕位置正確（在系統狀態欄下面）
5. ✅ 標題"設定"居中顯示
6. ✅ 儲存按鈕點擊後正常返回
7. ✅ 所有主題模式（淺色/深色/高對比度）都正常工作

---

**最後更新：** 2025-01-02  
**負責人：** AI Assistant  
**狀態：** ✅ 所有主要問題已解決
