/**
 * 高仿C#List
 */
export class List<T> extends Array<T> {
    public constructor() {
        super();
    }

    add(value: T): void {
        this.push(value);
    }

    insert(index: number, value: T): void {
        this.splice(index, 0, value);
    }

    remove(value: T): void {
        var index: number = this.indexOf(value);
        this.removeAt(index);
    }

    removeAt(index: number): void {
        this.splice(index, 1);
    }

    contains(value: T): boolean {
        return this.indexOf(value) >= 0;
    }

    count(): number {
        return this.length;
    }

    clear(): void {
        this.splice(0);
    }

    foreach(callback: Function): void {
        this._breaking = false;
        var sum = this.length;
        for (var i = 0; i < sum; i++) {
            if (this._breaking) {
                break;
            }
            callback(this[i]);
        }
    }

    _breaking: boolean = false;
    break(): void {
        this._breaking = true;
    }

    toArray(): T[] {
        var array: T[] = [];
        this.forEach(element => {
            array.push(element);
        });
        return array;
    }

    append(value: T[]): void {
        value.forEach(element => {
            this.push(element);
        });
    }
}


/**
 * 高仿C#Dictionary
 * 效率稍差
 */
export default class Dictionary<K, V> extends Object {

    _keys: K[] = [];
    _values: V[] = [];

    public constructor() {
        super();
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
        var index = this._keys.indexOf(key, 0);
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
        this._keys.splice(0);
        this._values.splice(0);
    }

    public forEach(callback: (k: K, v: V) => void): void {
        this._breaking = false;
        var sum = this._keys.length;
        for (var i = 0; i < sum; i++) {
            if (this._breaking) {
                break;
            }
            callback(this._keys[i], this._values[i]);
        }
    }

    _breaking: boolean = false;
    public break(): void {
        this._breaking = true;
    }

    public toObject(): Object {
        var obj: any = {};
        this.forEach((k, v) => {
            obj[k] = v;
        });
        return obj;
    }
}