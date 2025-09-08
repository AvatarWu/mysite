import { dataSyncService, ChangeType } from './DataSyncService';
import axios from 'axios';

// 健康數據類型
export interface WeightRecord {
  _id?: string;
  date: string;
  weight: number;
  height: number;
  bmi: number;
  note?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BloodPressureRecord {
  _id?: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  date: string;
  time: string;
  note?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BloodSugarRecord {
  _id?: string;
  value: number;
  unit: 'mg/dL' | 'mmol/L';
  type: 'beforeMeal' | 'afterMeal' | 'beforeSleep';
  date: string;
  time: string;
  note?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MedicationRecord {
  _id?: string;
  name: string;
  dosage: string;
  frequency: string;
  timeSlots: Array<{ time: string; enabled: boolean }>;
  reminderEnabled: boolean;
  startDate: string;
  endDate?: string;
  note?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 健康數據服務類
class HealthDataService {
  private baseURL = '/api/health';
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  // 設置認證令牌
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // 清除認證令牌
  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // 獲取請求頭
  private getHeaders() {
    if (!this.token) {
      throw new Error('未找到認證令牌');
    }
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  // ==================== 體重記錄管理 ====================

  // 獲取體重記錄列表
  async getWeightRecords(): Promise<WeightRecord[]> {
    try {
      // 優先從本地存儲獲取
      const localData = localStorage.getItem('weightRecords');
      if (localData) {
        const records = JSON.parse(localData);
        console.log(`從本地存儲載入 ${records.length} 條體重記錄`);
        return records;
      }

      // 如果本地沒有數據，從服務器獲取
      const response = await axios.get(`${this.baseURL}/weight`, {
        headers: this.getHeaders()
      });

      if (response.data.success) {
        const records = response.data.records || [];
        localStorage.setItem('weightRecords', JSON.stringify(records));
        return records;
      }

      return [];
    } catch (error) {
      console.error('獲取體重記錄失敗:', error);
      // 返回本地數據作為備用
      const localData = localStorage.getItem('weightRecords');
      return localData ? JSON.parse(localData) : [];
    }
  }

  // 添加體重記錄
  async addWeightRecord(record: Omit<WeightRecord, '_id' | 'createdAt' | 'updatedAt'>): Promise<WeightRecord> {
    try {
      // 先保存到本地
      const newRecord: WeightRecord = {
        ...record,
        _id: this.generateLocalId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const existingRecords = await this.getWeightRecords();
      existingRecords.unshift(newRecord);
      localStorage.setItem('weightRecords', JSON.stringify(existingRecords));

      // 添加到同步隊列
      await dataSyncService.addPendingChange({
        type: ChangeType.CREATE,
        entity: 'weight',
        data: newRecord
      });

      return newRecord;
    } catch (error) {
      console.error('添加體重記錄失敗:', error);
      throw error;
    }
  }

  // 更新體重記錄
  async updateWeightRecord(id: string, updates: Partial<WeightRecord>): Promise<WeightRecord> {
    try {
      const existingRecords = await this.getWeightRecords();
      const recordIndex = existingRecords.findIndex(r => r._id === id);
      
      if (recordIndex === -1) {
        throw new Error('體重記錄不存在');
      }

      const updatedRecord: WeightRecord = {
        ...existingRecords[recordIndex],
        ...updates,
        updatedAt: new Date()
      };

      existingRecords[recordIndex] = updatedRecord;
      localStorage.setItem('weightRecords', JSON.stringify(existingRecords));

      // 添加到同步隊列
      await dataSyncService.addPendingChange({
        type: ChangeType.UPDATE,
        entity: 'weight',
        data: updatedRecord
      });

      return updatedRecord;
    } catch (error) {
      console.error('更新體重記錄失敗:', error);
      throw error;
    }
  }

  // 刪除體重記錄
  async deleteWeightRecord(id: string): Promise<void> {
    try {
      const existingRecords = await this.getWeightRecords();
      const recordToDelete = existingRecords.find(r => r._id === id);
      
      if (!recordToDelete) {
        throw new Error('體重記錄不存在');
      }

      const filteredRecords = existingRecords.filter(r => r._id !== id);
      localStorage.setItem('weightRecords', JSON.stringify(filteredRecords));

      // 添加到同步隊列
      await dataSyncService.addPendingChange({
        type: ChangeType.DELETE,
        entity: 'weight',
        data: recordToDelete
      });
    } catch (error) {
      console.error('刪除體重記錄失敗:', error);
      throw error;
    }
  }

  // ==================== 血壓記錄管理 ====================

  // 獲取血壓記錄列表
  async getBloodPressureRecords(): Promise<BloodPressureRecord[]> {
    try {
      // 優先從本地存儲獲取
      const localData = localStorage.getItem('bloodPressureRecords');
      if (localData) {
        const records = JSON.parse(localData);
        console.log(`從本地存儲載入 ${records.length} 條血壓記錄`);
        return records;
      }

      // 如果本地沒有數據，從服務器獲取
      const response = await axios.get(`${this.baseURL}/blood-pressure`, {
        headers: this.getHeaders()
      });

      if (response.data.success) {
        const records = response.data.records || [];
        localStorage.setItem('bloodPressureRecords', JSON.stringify(records));
        return records;
      }

      return [];
    } catch (error) {
      console.error('獲取血壓記錄失敗:', error);
      // 返回本地數據作為備用
      const localData = localStorage.getItem('bloodPressureRecords');
      return localData ? JSON.parse(localData) : [];
    }
  }

  // 添加血壓記錄
  async addBloodPressureRecord(record: Omit<BloodPressureRecord, '_id' | 'createdAt' | 'updatedAt'>): Promise<BloodPressureRecord> {
    try {
      // 先保存到本地
      const newRecord: BloodPressureRecord = {
        ...record,
        _id: this.generateLocalId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const existingRecords = await this.getBloodPressureRecords();
      existingRecords.unshift(newRecord);
      localStorage.setItem('bloodPressureRecords', JSON.stringify(existingRecords));

      // 添加到同步隊列
      await dataSyncService.addPendingChange({
        type: ChangeType.CREATE,
        entity: 'bloodPressure',
        data: newRecord
      });

      return newRecord;
    } catch (error) {
      console.error('添加血壓記錄失敗:', error);
      throw error;
    }
  }

  // 更新血壓記錄
  async updateBloodPressureRecord(id: string, updates: Partial<BloodPressureRecord>): Promise<BloodPressureRecord> {
    try {
      const existingRecords = await this.getBloodPressureRecords();
      const recordIndex = existingRecords.findIndex(r => r._id === id);
      
      if (recordIndex === -1) {
        throw new Error('血壓記錄不存在');
      }

      const updatedRecord: BloodPressureRecord = {
        ...existingRecords[recordIndex],
        ...updates,
        updatedAt: new Date()
      };

      existingRecords[recordIndex] = updatedRecord;
      localStorage.setItem('bloodPressureRecords', JSON.stringify(existingRecords));

      // 添加到同步隊列
      await dataSyncService.addPendingChange({
        type: ChangeType.UPDATE,
        entity: 'bloodPressure',
        data: updatedRecord
      });

      return updatedRecord;
    } catch (error) {
      console.error('更新血壓記錄失敗:', error);
      throw error;
    }
  }

  // 刪除血壓記錄
  async deleteBloodPressureRecord(id: string): Promise<void> {
    try {
      const existingRecords = await this.getBloodPressureRecords();
      const recordToDelete = existingRecords.find(r => r._id === id);
      
      if (!recordToDelete) {
        throw new Error('血壓記錄不存在');
      }

      const filteredRecords = existingRecords.filter(r => r._id !== id);
      localStorage.setItem('bloodPressureRecords', JSON.stringify(filteredRecords));

      // 添加到同步隊列
      await dataSyncService.addPendingChange({
        type: ChangeType.DELETE,
        entity: 'bloodPressure',
        data: recordToDelete
      });
    } catch (error) {
      console.error('刪除血壓記錄失敗:', error);
      throw error;
    }
  }

  // ==================== 血糖記錄管理 ====================

  // 獲取血糖記錄列表
  async getBloodSugarRecords(): Promise<BloodSugarRecord[]> {
    try {
      // 優先從本地存儲獲取
      const localData = localStorage.getItem('bloodSugarRecords');
      if (localData) {
        const records = JSON.parse(localData);
        console.log(`從本地存儲載入 ${records.length} 條血糖記錄`);
        return records;
      }

      // 如果本地沒有數據，從服務器獲取
      const response = await axios.get(`${this.baseURL}/blood-sugar`, {
        headers: this.getHeaders()
      });

      if (response.data.success) {
        const records = response.data.records || [];
        localStorage.setItem('bloodSugarRecords', JSON.stringify(records));
        return records;
      }

      return [];
    } catch (error) {
      console.error('獲取血糖記錄失敗:', error);
      // 返回本地數據作為備用
      const localData = localStorage.getItem('bloodSugarRecords');
      return localData ? JSON.parse(localData) : [];
    }
  }

  // 添加血糖記錄
  async addBloodSugarRecord(record: Omit<BloodSugarRecord, '_id' | 'createdAt' | 'updatedAt'>): Promise<BloodSugarRecord> {
    try {
      // 先保存到本地
      const newRecord: BloodSugarRecord = {
        ...record,
        _id: this.generateLocalId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const existingRecords = await this.getBloodSugarRecords();
      existingRecords.unshift(newRecord);
      localStorage.setItem('bloodSugarRecords', JSON.stringify(existingRecords));

      // 添加到同步隊列
      await dataSyncService.addPendingChange({
        type: ChangeType.CREATE,
        entity: 'bloodSugar',
        data: newRecord
      });

      return newRecord;
    } catch (error) {
      console.error('添加血糖記錄失敗:', error);
      throw error;
    }
  }

  // 更新血糖記錄
  async updateBloodSugarRecord(id: string, updates: Partial<BloodSugarRecord>): Promise<BloodSugarRecord> {
    try {
      const existingRecords = await this.getBloodSugarRecords();
      const recordIndex = existingRecords.findIndex(r => r._id === id);
      
      if (recordIndex === -1) {
        throw new Error('血糖記錄不存在');
      }

      const updatedRecord: BloodSugarRecord = {
        ...existingRecords[recordIndex],
        ...updates,
        updatedAt: new Date()
      };

      existingRecords[recordIndex] = updatedRecord;
      localStorage.setItem('bloodSugarRecords', JSON.stringify(existingRecords));

      // 添加到同步隊列
      await dataSyncService.addPendingChange({
        type: ChangeType.UPDATE,
        entity: 'bloodSugar',
        data: updatedRecord
      });

      return updatedRecord;
    } catch (error) {
      console.error('更新血糖記錄失敗:', error);
      throw error;
    }
  }

  // 刪除血糖記錄
  async deleteBloodSugarRecord(id: string): Promise<void> {
    try {
      const existingRecords = await this.getBloodSugarRecords();
      const recordToDelete = existingRecords.find(r => r._id === id);
      
      if (!recordToDelete) {
        throw new Error('血糖記錄不存在');
      }

      const filteredRecords = existingRecords.filter(r => r._id !== id);
      localStorage.setItem('bloodSugarRecords', JSON.stringify(filteredRecords));

      // 添加到同步隊列
      await dataSyncService.addPendingChange({
        type: ChangeType.DELETE,
        entity: 'bloodSugar',
        data: recordToDelete
      });
    } catch (error) {
      console.error('刪除血糖記錄失敗:', error);
      throw error;
    }
  }

  // ==================== 用藥提醒管理 ====================

  // 獲取用藥提醒列表
  async getMedicationRecords(): Promise<MedicationRecord[]> {
    try {
      // 優先從本地存儲獲取
      const localData = localStorage.getItem('medicationRecords');
      if (localData) {
        const records = JSON.parse(localData);
        console.log(`從本地存儲載入 ${records.length} 條用藥提醒`);
        return records;
      }

      // 如果本地沒有數據，從服務器獲取
      const response = await axios.get(`${this.baseURL}/medications`, {
        headers: this.getHeaders()
      });

      if (response.data.success) {
        const records = response.data.medications || [];
        localStorage.setItem('medicationRecords', JSON.stringify(records));
        return records;
      }

      return [];
    } catch (error) {
      console.error('獲取用藥提醒失敗:', error);
      // 返回本地數據作為備用
      const localData = localStorage.getItem('medicationRecords');
      return localData ? JSON.parse(localData) : [];
    }
  }

  // 添加用藥提醒
  async addMedicationRecord(record: Omit<MedicationRecord, '_id' | 'createdAt' | 'updatedAt'>): Promise<MedicationRecord> {
    try {
      // 先保存到本地
      const newRecord: MedicationRecord = {
        ...record,
        _id: this.generateLocalId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const existingRecords = await this.getMedicationRecords();
      existingRecords.unshift(newRecord);
      localStorage.setItem('medicationRecords', JSON.stringify(existingRecords));

      // 添加到同步隊列
      await dataSyncService.addPendingChange({
        type: ChangeType.CREATE,
        entity: 'medication',
        data: newRecord
      });

      return newRecord;
    } catch (error) {
      console.error('添加用藥提醒失敗:', error);
      throw error;
    }
  }

  // 更新用藥提醒
  async updateMedicationRecord(id: string, updates: Partial<MedicationRecord>): Promise<MedicationRecord> {
    try {
      const existingRecords = await this.getMedicationRecords();
      const recordIndex = existingRecords.findIndex(r => r._id === id);
      
      if (recordIndex === -1) {
        throw new Error('用藥提醒不存在');
      }

      const updatedRecord: MedicationRecord = {
        ...existingRecords[recordIndex],
        ...updates,
        updatedAt: new Date()
      };

      existingRecords[recordIndex] = updatedRecord;
      localStorage.setItem('medicationRecords', JSON.stringify(existingRecords));

      // 添加到同步隊列
      await dataSyncService.addPendingChange({
        type: ChangeType.UPDATE,
        entity: 'medication',
        data: updatedRecord
      });

      return updatedRecord;
    } catch (error) {
      console.error('更新用藥提醒失敗:', error);
      throw error;
    }
  }

  // 刪除用藥提醒
  async deleteMedicationRecord(id: string): Promise<void> {
    try {
      const existingRecords = await this.getMedicationRecords();
      const recordToDelete = existingRecords.find(r => r._id === id);
      
      if (!recordToDelete) {
        throw new Error('用藥提醒不存在');
      }

      const filteredRecords = existingRecords.filter(r => r._id !== id);
      localStorage.setItem('medicationRecords', JSON.stringify(filteredRecords));

      // 添加到同步隊列
      await dataSyncService.addPendingChange({
        type: ChangeType.DELETE,
        entity: 'medication',
        data: recordToDelete
      });
    } catch (error) {
      console.error('刪除用藥提醒失敗:', error);
      throw error;
    }
  }

  // ==================== 通用功能 ====================

  // 生成本地ID
  private generateLocalId(): string {
    return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 手動同步所有數據
  async syncAllData(): Promise<void> {
    try {
      console.log('開始同步所有健康數據...');
      
      // 先從服務器同步數據到本地
      await dataSyncService.syncFromServer();
      
      // 再將本地變更同步到服務器
      await dataSyncService.syncToServer();
      
      console.log('所有健康數據同步完成');
    } catch (error) {
      console.error('同步健康數據失敗:', error);
      throw error;
    }
  }

  // 獲取同步狀態
  getSyncStatus() {
    return dataSyncService.getSyncStats();
  }

  // 清理所有本地數據
  async clearAllLocalData(): Promise<void> {
    try {
      localStorage.removeItem('weightRecords');
      localStorage.removeItem('bloodPressureRecords');
      localStorage.removeItem('bloodSugarRecords');
      localStorage.removeItem('medicationRecords');
      
      // 清理待同步的變更
      await dataSyncService.clearPendingChanges();
      
      console.log('所有本地健康數據已清理');
    } catch (error) {
      console.error('清理本地健康數據失敗:', error);
      throw error;
    }
  }

  // 檢查是否有未同步的變更
  hasPendingChanges(): boolean {
    return dataSyncService.getPendingChangesCount() > 0;
  }

  // 獲取待同步變更數量
  getPendingChangesCount(): number {
    return dataSyncService.getPendingChangesCount();
  }
}

// 創建單例實例
export const healthDataService = new HealthDataService();

// 導出類型 - 已移除重複導出
// export type { 
//   WeightRecord, 
//   BloodPressureRecord, 
//   BloodSugarRecord, 
//   MedicationRecord 
// };
