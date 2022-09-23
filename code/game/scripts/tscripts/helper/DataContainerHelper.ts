/**
 * 高仿C#Dictionary
 * 效率稍差
 */
export default class Dictionary<K, V>  {

    _keys: K[] = [];
    _values: V[] = [];

    public copy(obj: Dictionary<K, V>) {
        if (this == obj || obj == null) return;
        this._keys = [].concat(obj._keys as any);
        this._values = [].concat(obj._values as any);
    }

    public copyData(ks: K[], vs: V[]) {
        if (ks == null || vs == null) return;
        this._keys = [].concat(ks);
        this._values = [].concat(vs);
    }

    public add(key: K, value: V): void {
        if (this.containsKey(key)) {
            this._values[this._keys.indexOf(key)] = value;
        } else {
            this._keys.push(key);
            this._values.push(value);
        }
    }

    public remove(key: K): void {
        let index = this._keys.indexOf(key, 0);
        if (index !== -1) {
            this._keys.splice(index, 1);
            this._values.splice(index, 1);
        }
    }

    public get(key: K): V {
        if (this.containsKey(key)) {
            return this._values[this._keys.indexOf(key)];
        } else {
            return null as any as V;
        }
    }

    public set(key: K, value: V): void {
        if (this.containsKey(key)) {
            this._values[this._keys.indexOf(key)] = value;
        } else {
            this._keys.push(key);
            this._values.push(value);
        }
    }

    public keys(): K[] {
        return this._keys.concat([]);
    }

    public values(): V[] {
        return this._values.concat([]);
    }

    public containsKey(key: K): boolean {
        return this._keys.indexOf(key) != -1;
    }

    public containsValue(value: V): boolean {
        return this._values.indexOf(value) != -1;
    }

    public count(): number {
        return this._keys.length;
    }

    public clear(): void {
        this._keys = [];
        this._values = [];
    }

    public forEach(callback: (k: K, v: V) => void): void {
        let sum = this._keys.length;
        for (let i = 0; i < sum; i++) {
            callback(this._keys[i], this._values[i]);
        }
    }



    public toObject(): Object {
        let obj: any = {};
        this.forEach((k, v) => {
            obj[k] = v;
        });
        return obj;
    }
}