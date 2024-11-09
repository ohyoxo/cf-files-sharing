// src/storage/manager.js

import { R2Storage } from './r2';
import { D1Storage } from './d1';
import { generateId } from '../utils/id';

class StorageManager {
  constructor(env) {
    this.r2Storage = new R2Storage(env.FILE_BUCKET);
    this.d1Storage = new D1Storage(env.DB);
  }

  async store(file, storageType) {
    const id = generateId();
    const metadata = {
      id,
      filename: file.name,
      size: file.size,
      storage_type: storageType,
    };

    if (storageType === 'r2') {
      await this.r2Storage.store(id, file);
    } else {
      await this.d1Storage.store(id, file);
    }

    return metadata;
  }

  async retrieve(id) {
    // 尝试从 R2 存储中获取
    let file = await this.r2Storage.retrieve(id);
    if (file) return file;

    // 尝试从 D1 存储中获取
    file = await this.d1Storage.retrieve(id);
    if (file) return file;

    return null;
  }
}

export { StorageManager };