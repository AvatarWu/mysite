# CareOld 數據同步系統說明

## 概述

CareOld 數據同步系統是一個完整的離線優先（Offline-First）數據管理解決方案，確保用戶在網絡不穩定或離線的情況下仍能正常使用應用，並在網絡恢復時自動同步數據。

## 系統架構

### 核心組件

1. **DataSyncService** (`src/services/DataSyncService.ts`)
   - 負責管理數據同步的核心服務
   - 處理網絡狀態檢測
   - 管理待同步的變更隊列
   - 自動和手動同步功能

2. **HealthDataService** (`src/services/HealthDataService.ts`)
   - 統一的健康數據管理服務
   - 整合本地存儲和 API 調用
   - 自動觸發數據同步

3. **SyncStatusIndicator** (`src/components/SyncStatusIndicator.tsx`)
   - 同步狀態顯示組件
   - 實時顯示同步狀態和待同步變更數量
   - 提供手動同步功能

## 功能特性

### 🚀 離線優先設計
- 所有數據操作優先保存到本地
- 離線時完全可用，無需網絡連接
- 網絡恢復後自動同步

### 🔄 智能同步機制
- 自動檢測網絡狀態變化
- 批量處理待同步變更
- 錯誤重試和衝突解決

### 📱 實時狀態監控
- 同步狀態實時顯示
- 待同步變更數量提示
- 網絡連接狀態指示

### 🛡️ 數據安全
- 本地數據持久化
- 同步失敗時數據不丟失
- 支持手動同步和數據清理

## 使用方法

### 1. 基本數據操作

```typescript
import { healthDataService } from '../services/HealthDataService';

// 添加體重記錄
const newRecord = await healthDataService.addWeightRecord({
  weight: 70,
  height: 170,
  bmi: 24.2,
  note: '晨起測量',
  date: '2025-08-09'
});

// 獲取體重記錄
const records = await healthDataService.getWeightRecords();

// 更新記錄
const updatedRecord = await healthDataService.updateWeightRecord(
  recordId, 
  { weight: 69.5 }
);

// 刪除記錄
await healthDataService.deleteWeightRecord(recordId);
```

### 2. 同步狀態監控

```typescript
import { dataSyncService } from '../services/DataSyncService';

// 獲取同步狀態
const stats = dataSyncService.getSyncStats();
console.log('同步狀態:', stats.status);
console.log('待同步變更:', stats.pendingCount);

// 手動觸發同步
await dataSyncService.manualSync();

// 檢查是否有待同步變更
const hasChanges = dataSyncService.getPendingChangesCount() > 0;
```

### 3. 在組件中使用

```typescript
import React, { useState, useEffect } from 'react';
import { healthDataService } from '../services/HealthDataService';
import SyncStatusIndicator from '../components/SyncStatusIndicator';

const MyComponent: React.FC = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const records = await healthDataService.getWeightRecords();
      setData(records);
    } catch (error) {
      console.error('載入數據失敗:', error);
    }
  };

  return (
    <div>
      <h1>我的數據</h1>
      {/* 在頁面頭部顯示同步狀態 */}
      <SyncStatusIndicator />
      
      {/* 數據列表 */}
      {data.map(item => (
        <div key={item._id}>{item.name}</div>
      ))}
    </div>
  );
};
```

## 同步流程

### 1. 數據添加流程
```
用戶操作 → 本地存儲 → 添加到同步隊列 → 自動同步到服務器
```

### 2. 網絡狀態變化處理
```
網絡斷開 → 切換到離線模式 → 繼續本地操作
網絡恢復 → 自動檢測 → 開始同步待同步變更
```

### 3. 錯誤處理
```
同步失敗 → 保留在待同步隊列 → 下次網絡可用時重試
重試失敗 → 記錄錯誤 → 用戶可手動重試
```

## 配置選項

### 同步配置
```typescript
const config = {
  retryAttempts: 3,        // 重試次數
  retryDelay: 5000,        // 重試延遲（毫秒）
  batchSize: 10,           // 批量處理大小
  syncInterval: 30000      // 自動同步間隔（毫秒）
};
```

### 存儲鍵名
```typescript
const STORAGE_KEYS = {
  weightRecords: 'weightRecords',
  bloodPressureRecords: 'bloodPressureRecords',
  bloodSugarRecords: 'bloodSugarRecords',
  medicationRecords: 'medicationRecords',
  pendingChanges: 'pendingChanges'
};
```

## 測試頁面

使用 `SyncTest` 頁面來測試同步功能：

1. **添加測試數據**：輸入體重和身高，點擊添加記錄
2. **監控同步狀態**：觀察同步狀態指示器的變化
3. **手動同步**：點擊手動同步按鈕測試同步功能
4. **清理數據**：點擊清理本地數據按鈕重置狀態

## 故障排除

### 常見問題

1. **同步失敗**
   - 檢查網絡連接
   - 確認服務器狀態
   - 查看瀏覽器控制台錯誤信息

2. **數據不顯示**
   - 檢查本地存儲
   - 確認數據格式正確
   - 嘗試手動同步

3. **狀態指示器異常**
   - 刷新頁面
   - 檢查組件導入
   - 確認服務初始化

### 調試技巧

```typescript
// 啟用詳細日誌
console.log('同步狀態:', dataSyncService.getSyncStats());
console.log('待同步變更:', dataSyncService.getPendingChangesCount());

// 檢查本地存儲
console.log('本地體重記錄:', localStorage.getItem('weightRecords'));

// 手動觸發同步
await dataSyncService.manualSync();
```

## 最佳實踐

### 1. 錯誤處理
```typescript
try {
  await healthDataService.addWeightRecord(data);
} catch (error) {
  // 顯示用戶友好的錯誤信息
  setErrorMessage('添加記錄失敗，請稍後重試');
  console.error('詳細錯誤:', error);
}
```

### 2. 狀態管理
```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleOperation = async () => {
  setIsLoading(true);
  setError(null);
  
  try {
    await performOperation();
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};
```

### 3. 用戶反饋
```typescript
// 顯示同步狀態
<SyncStatusIndicator />

// 顯示操作結果
<IonToast
  isOpen={showToast}
  message={toastMessage}
  duration={3000}
/>
```

## 擴展功能

### 1. 添加新的數據類型
```typescript
// 在 HealthDataService 中添加新方法
async addNewRecord(record: NewRecordType): Promise<NewRecordType> {
  // 實現邏輯
  // 添加到同步隊列
  await dataSyncService.addPendingChange({
    type: ChangeType.CREATE,
    entity: 'newType',
    data: record
  });
}
```

### 2. 自定義同步邏輯
```typescript
// 在 DataSyncService 中添加新的同步方法
private async syncNewTypeChange(change: PendingChange, headers: any): Promise<void> {
  const endpoint = '/api/health/new-type';
  // 實現同步邏輯
}
```

## 總結

CareOld 數據同步系統提供了完整的離線優先數據管理解決方案，確保用戶在任何網絡條件下都能正常使用應用。系統自動處理數據同步，用戶無需關心技術細節，專注於健康數據的記錄和管理。

通過使用這個系統，您的應用將具備：
- ✅ 離線可用性
- ✅ 自動數據同步
- ✅ 實時狀態監控
- ✅ 錯誤處理和重試
- ✅ 用戶友好的界面

如果您有任何問題或需要進一步的幫助，請參考代碼註釋或聯繫開發團隊。
