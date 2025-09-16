import { Network } from '@capacitor/network';
import { Preferences } from '@capacitor/preferences';
import axios from 'axios';

// 同步狀態枚舉
export enum SyncStatus {
  IDLE = 'idle',
  SYNCING = 'syncing',
  SUCCESS = 'success',
  ERROR = 'error',
  OFFLINE = 'offline'
}

// 數據變更類型
export enum ChangeType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

// 待同步的數據變更
export interface PendingChange {
  id: string;
  type: ChangeType;
  entity: string; // 實體類型：weight, bloodPressure, bloodSugar, medication
  data: any;
  timestamp: number;
  userId?: string;
}

// 同步配置
export interface SyncConfig {
  retryAttempts: number;
  retryDelay: number;
  batchSize: number;
  syncInterval: number;
}

// 同步結果
export interface SyncResult {
  success: boolean;
  syncedCount: number;
  errors: string[];
  timestamp: number;
}

class DataSyncService {
  private syncStatus: SyncStatus = SyncStatus.IDLE;
  private pendingChanges: PendingChange[] = [];
  private syncInterval: any = null;
  private config: SyncConfig = {
    retryAttempts: 3,
    retryDelay: 5000,
    batchSize: 10,
    syncInterval: 30000 // 30秒
  };

  constructor() {
    this.initializeSync();
  }

  // 初始化同步服務
  private async initializeSync() {
    try {
      // 載入待同步的變更
      await this.loadPendingChanges();
      
      // 檢查網絡狀態
      const networkStatus = await Network.getStatus();
      this.syncStatus = networkStatus.connected ? SyncStatus.IDLE : SyncStatus.OFFLINE;
      
      // 設置網絡狀態監聽
      Network.addListener('networkStatusChange', (status) => {
        this.handleNetworkChange(status.connected);
      });

      // 啟動自動同步
      this.startAutoSync();
      
      console.log('數據同步服務初始化完成');
    } catch (error) {
      console.error('數據同步服務初始化失敗:', error);
    }
  }

  // 處理網絡狀態變化
  private async handleNetworkChange(isConnected: boolean) {
    if (isConnected) {
      this.syncStatus = SyncStatus.IDLE;
      console.log('網絡已連接，開始同步數據');
      await this.syncToServer();
    } else {
      this.syncStatus = SyncStatus.OFFLINE;
      console.log('網絡已斷開，切換到離線模式');
    }
  }

  // 啟動自動同步
  private startAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.syncInterval = setInterval(async () => {
      if (this.syncStatus === SyncStatus.IDLE && this.pendingChanges.length > 0) {
        await this.syncToServer();
      }
    }, this.config.syncInterval);
  }

  // 添加待同步的變更
  async addPendingChange(change: Omit<PendingChange, 'id' | 'timestamp'>): Promise<void> {
    try {
      const pendingChange: PendingChange = {
        ...change,
        id: this.generateChangeId(),
        timestamp: Date.now()
      };

      this.pendingChanges.push(pendingChange);
      await this.savePendingChanges();
      
      console.log(`已添加待同步變更: ${change.type} ${change.entity}`);
      
      // 如果網絡可用，立即嘗試同步
      if (this.syncStatus !== SyncStatus.OFFLINE) {
        await this.syncToServer();
      }
    } catch (error) {
      console.error('添加待同步變更失敗:', error);
    }
  }

  // 生成變更ID
  private generateChangeId(): string {
    return `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 保存待同步的變更到本地存儲
  private async savePendingChanges(): Promise<void> {
    try {
      await Preferences.set({
        key: 'pendingChanges',
        value: JSON.stringify(this.pendingChanges)
      });
    } catch (error) {
      console.error('保存待同步變更失敗:', error);
    }
  }

  // 從本地存儲載入待同步的變更
  private async loadPendingChanges(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: 'pendingChanges' });
      if (value) {
        this.pendingChanges = JSON.parse(value);
        console.log(`載入 ${this.pendingChanges.length} 個待同步變更`);
      }
    } catch (error) {
      console.error('載入待同步變更失敗:', error);
      this.pendingChanges = [];
    }
  }

  // 同步到服務器
  async syncToServer(): Promise<SyncResult> {
    if (this.syncStatus === SyncStatus.SYNCING || this.pendingChanges.length === 0) {
      return {
        success: true,
        syncedCount: 0,
        errors: [],
        timestamp: Date.now()
      };
    }

    this.syncStatus = SyncStatus.SYNCING;
    const result: SyncResult = {
      success: true,
      syncedCount: 0,
      errors: [],
      timestamp: Date.now()
    };

    try {
      // 分批處理變更
      const batches = this.chunkArray(this.pendingChanges, this.config.batchSize);
      
      for (const batch of batches) {
        const batchResult = await this.processBatch(batch);
        result.syncedCount += batchResult.syncedCount;
        result.errors.push(...batchResult.errors);
      }

      // 清理已同步的變更
      if (result.syncedCount > 0) {
        this.pendingChanges = this.pendingChanges.filter(
          change => !result.syncedCount || change.timestamp < result.timestamp
        );
        await this.savePendingChanges();
      }

      this.syncStatus = result.errors.length === 0 ? SyncStatus.SUCCESS : SyncStatus.ERROR;
      console.log(`同步完成: ${result.syncedCount} 個變更已同步`);
      
    } catch (error) {
      console.error('同步失敗:', error);
      this.syncStatus = SyncStatus.ERROR;
      result.success = false;
      result.errors.push(error instanceof Error ? error.message : '未知錯誤');
    }

    return result;
  }

  // 處理一批變更
  private async processBatch(batch: PendingChange[]): Promise<{ syncedCount: number; errors: string[] }> {
    const result = { syncedCount: 0, errors: [] as string[] };

    for (const change of batch) {
      try {
        await this.processChange(change);
        result.syncedCount++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '未知錯誤';
        result.errors.push(`${change.entity} ${change.type}: ${errorMessage}`);
        console.error(`處理變更失敗:`, change, error);
      }
    }

    return result;
  }

  // 處理單個變更
  private async processChange(change: PendingChange): Promise<void> {
    // 檢查是否有認證令牌，如果沒有則跳過服務器同步
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('未找到認證令牌，跳過服務器同步，僅保存到本地');
      return; // 直接返回，不拋出錯誤
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    switch (change.entity) {
      case 'weight':
        await this.syncWeightChange(change, headers);
        break;
      case 'bloodPressure':
        await this.syncBloodPressureChange(change, headers);
        break;
      case 'bloodSugar':
        await this.syncBloodSugarChange(change, headers);
        break;
      case 'medication':
        await this.syncMedicationChange(change, headers);
        break;
      default:
        throw new Error(`不支援的實體類型: ${change.entity}`);
    }
  }

  // 同步體重記錄變更
  private async syncWeightChange(change: PendingChange, headers: any): Promise<void> {
    const endpoint = '/api/health/weight';
    
    switch (change.type) {
      case ChangeType.CREATE:
        await axios.post(endpoint, change.data, { headers });
        break;
      case ChangeType.UPDATE:
        await axios.put(`${endpoint}/${change.data._id}`, change.data, { headers });
        break;
      case ChangeType.DELETE:
        await axios.delete(`${endpoint}/${change.data._id}`, { headers });
        break;
    }
  }

  // 同步血壓記錄變更
  private async syncBloodPressureChange(change: PendingChange, headers: any): Promise<void> {
    const endpoint = '/api/health/blood-pressure';
    
    switch (change.type) {
      case ChangeType.CREATE:
        await axios.post(endpoint, change.data, { headers });
        break;
      case ChangeType.UPDATE:
        await axios.put(`${endpoint}/${change.data._id}`, change.data, { headers });
        break;
      case ChangeType.DELETE:
        await axios.delete(`${endpoint}/${change.data._id}`, { headers });
        break;
    }
  }

  // 同步血糖記錄變更
  private async syncBloodSugarChange(change: PendingChange, headers: any): Promise<void> {
    const endpoint = '/api/health/blood-sugar';
    
    switch (change.type) {
      case ChangeType.CREATE:
        await axios.post(endpoint, change.data, { headers });
        break;
      case ChangeType.UPDATE:
        await axios.put(`${endpoint}/${change.data._id}`, change.data, { headers });
        break;
      case ChangeType.DELETE:
        await axios.delete(`${endpoint}/${change.data._id}`, { headers });
        break;
    }
  }

  // 同步用藥提醒變更
  private async syncMedicationChange(change: PendingChange, headers: any): Promise<void> {
    const endpoint = '/api/health/medications';
    
    switch (change.type) {
      case ChangeType.CREATE:
        await axios.post(endpoint, change.data, { headers });
        break;
      case ChangeType.UPDATE:
        await axios.put(`${endpoint}/${change.data._id}`, change.data, { headers });
        break;
      case ChangeType.DELETE:
        await axios.delete(`${endpoint}/${change.data._id}`, { headers });
        break;
    }
  }

  // 從服務器同步數據到本地
  async syncFromServer(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('未找到認證令牌，跳過服務器同步');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      
      // 同步各種健康數據
      await Promise.all([
        this.syncHealthDataFromServer('/api/health/weight', 'weightRecords', headers),
        this.syncHealthDataFromServer('/api/health/blood-pressure', 'bloodPressureRecords', headers),
        this.syncHealthDataFromServer('/api/health/blood-sugar', 'bloodSugarRecords', headers),
        this.syncHealthDataFromServer('/api/health/medications', 'medicationRecords', headers)
      ]);

      console.log('從服務器同步數據完成');
    } catch (error) {
      console.error('從服務器同步數據失敗:', error);
    }
  }

  // 從服務器同步特定類型的健康數據
  private async syncHealthDataFromServer(endpoint: string, storageKey: string, headers: any): Promise<void> {
    try {
      const response = await axios.get(endpoint, { headers });
      if (response.data.success) {
        localStorage.setItem(storageKey, JSON.stringify(response.data.records || response.data.medications || []));
      }
    } catch (error) {
      console.error(`同步 ${storageKey} 失敗:`, error);
    }
  }

  // 數組分塊
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // 獲取同步狀態
  getSyncStatus(): SyncStatus {
    return this.syncStatus;
  }

  // 獲取待同步變更數量
  getPendingChangesCount(): number {
    return this.pendingChanges.length;
  }

  // 手動觸發同步
  async manualSync(): Promise<SyncResult> {
    console.log('手動觸發同步');
    return await this.syncToServer();
  }

  // 清理所有待同步的變更
  async clearPendingChanges(): Promise<void> {
    this.pendingChanges = [];
    await this.savePendingChanges();
    console.log('已清理所有待同步變更');
  }

  // 獲取同步統計信息
  getSyncStats() {
    return {
      status: this.syncStatus,
      pendingCount: this.pendingChanges.length,
      lastSync: this.pendingChanges.length > 0 ? 
        new Date(Math.min(...this.pendingChanges.map(c => c.timestamp))) : null
    };
  }

  // 銷毀服務
  destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    console.log('數據同步服務已銷毀');
  }
}

// 創建單例實例
export const dataSyncService = new DataSyncService();
