// @flow

export interface Storage {
    getValue(string): Promise<string>;
    setValue(string, string): Promise<void>;
}

