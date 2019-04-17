const enum StorageType {
    local,
    session,
}

class StorageWapper {
    private storage: Storage;

    constructor(type: StorageType) {
        if (type === StorageType.local) {
            this.storage = localStorage;
        }
        else {
            this.storage = sessionStorage;
        }
    }

    get length() {
        return this.storage.length;
    }

    get<T = string>(key: string): T | null {
        const value = this.storage.getItem(key);

        if (!value) {
            return null;
        }

        let result: T;

        try {
            result = JSON.parse(value);
        }
        catch (e) {
            result = value as any;

            // 兼容以前的版本
            if (key === 'language' && this.storage === localStorage) {
                this.storage.setItem('language', JSON.stringify(value));
            }
            else {
                console.warn(e);
            }
        }

        return result;
    }

    set(key: string, value: any) {
        this.storage.setItem(key, JSON.stringify(value));
    }

    remove(key: string) {
        this.storage.removeItem(key);
    }

    exist(key: string) {
        return this.get(key) !== null;
    }

    clear(exclude: string[] = []) {
        // 保存临时变量
        const data = exclude.map((key) => ({
            key,
            value: this.get(key),
        }));

        // 清除所有缓存
        this.storage.clear();
        // 临时值存入缓存
        data.forEach(({ key, value }) => this.set(key, value));
    }
}

export const local = new StorageWapper(StorageType.local);
export const session = new StorageWapper(StorageType.session);
