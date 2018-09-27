// @flow

import {  AsyncStorage } from 'react-native';
import type { Storage } from '~/src/services/storage.flow.js';

export class DeviceStorage {

    backingStorage: AsyncStorage;

    constructor(backingStorage: AsyncStorage) {
        this.backingStorage = backingStorage;
    }

    getValue(name: string): Promise<string> {
        return this.backingStorage.getItem(name);
    }

    setValue(name: string, value: string): Promise<void> {
        return this.backingStorage.setItem(name, value);
    }
}
export const deviceStorage: Storage = new DeviceStorage(AsyncStorage);
