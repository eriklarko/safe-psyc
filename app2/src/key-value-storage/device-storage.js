// @flow
//
// Can be used to persist data on the device. Useful for e.g. if the user has
// seen some onboarding or similar. Not suitable for things like settings that
// should likely sync across devices.

import { AsyncStorage } from 'react-native';

// Meant to be implemented by both `DeviceStorage` and
// a future `AccountStorage` class
interface KeyValueStorage {
    read(key: string): Promise<string>;
    persist(key: string, value: string): Promise<void>;
}

// Store key-value pairs on the device
export class DeviceStorage {

    read(name: string): Promise<string> {
        return AsyncStorage.getItem(name);
    }

    persist(name: string, value: string): Promise<void> {
        return AsyncStorage.setItem(name, value);
    }
}
export const deviceStorage: KeyValueStorage = new DeviceStorage();
