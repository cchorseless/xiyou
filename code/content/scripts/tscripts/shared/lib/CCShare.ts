export module CCShare {
    export class CCHandler<R = any> {
        private static _pool: CCHandler[] = [];
        private static _gid: number = 0;
        public _id = CCHandler._gid++;
        public caller: any;
        public method: ((...args: any[]) => R) | null;
        public args: any[] | null;
        public tmpArg: any;
        public once: boolean;
        constructor() {
            this.once = false;
            this._id = 0;
            this.setTo(null, null, null);
        }
        setTo(caller: any, method: ((...args: any[]) => R) | null, args: any[] | null, once = true) {
            this._id = CCHandler._gid++;
            this.caller = caller;
            this.method = method;
            this.args = args;
            this.once = once;
            this.tmpArg = null;
            return this;
        }
        run() {
            if (this.method == null) return null;
            let id = this._id;
            let nextCall = this.method.apply(this.caller);
            this._id === id && this.once && this.recover();
            return nextCall;
        }
        runWith(data: any[]) {
            if (this.method == null) return null;
            let id = this._id;
            let arg: any[] = [];
            if (this.args) {
                arg = arg.concat(this.args);
            }
            if (data) {
                arg = arg.concat(data);
            }
            let nextCall = this.method.apply(this.caller, arg);
            this._id === id && this.once && this.recover();
            return nextCall;
        }
        // run() {
        //     if (this.method == null) return null;
        //     let id = this._id;
        //     let [status, nextCall] = xpcall(
        //         this.method,
        //         (msg: any) => {
        //             return "\n" + GLogHelper.traceFunc(msg) + "\n";
        //         },
        //         this.caller
        //     );
        //     if (!status) {
        //         GLogHelper.error(nextCall);
        //     }
        //     this._id === id && this.once && this.recover();
        //     return nextCall;
        // }
        // runWith(data: any[]) {
        //     if (this.method == null) return null;
        //     let id = this._id;
        //     let arg: any[] = [];
        //     if (this.args) {
        //         arg = arg.concat(this.args);
        //     }
        //     if (data) {
        //         arg = arg.concat(data);
        //     }
        //     let [status, nextCall] = xpcall(
        //         this.method,
        //         (msg: any) => {
        //             return "\n" + GLogHelper.traceFunc(msg) + "\n";
        //         },
        //         this.caller,
        //         ...arg
        //     );
        //     if (!status) {
        //         GLogHelper.error(nextCall);
        //     }
        //     this._id === id && this.once && this.recover();
        //     return nextCall;
        // }
        clear() {
            this.caller = null;
            this.method = null;
            this.args = null;
            this.tmpArg = null;
            return this;
        }
        recover() {
            if (this._id > 0) {
                this._id = 0;
                CCHandler._pool.push(this.clear());
            }
        }
        static create<R = any>(caller: any, method: ((...args: any[]) => R) | null, args: any[] | null = null, once = true) {
            if (CCHandler._pool.length > 0) return CCHandler._pool.pop()!.setTo(caller, method, args as any, once);
            return new CCHandler().setTo(caller, method, args, once);
        }
    }
    export function Reloadable<T extends { new(...args: any[]): {}; }>(constructor: T): T {
        const className = constructor.name;
        if (_G._GReloadClassTypeCache[className] == null) {
            _G._GReloadClassTypeCache[className] = constructor;
        }
        else if (_CODE_IN_LUA_) {
            Object.assign(_G._GReloadClassTypeCache[className].prototype, constructor.prototype);
        }
        return _G._GReloadClassTypeCache[className];
    }

    export function GetReloadCache<T>(key: string, defaultv: T): T {
        //#region LUA
        if (_CODE_IN_LUA_) {
            if (_G._GReloadCacheData[key] == null) {
                _G._GReloadCacheData[key] = defaultv;
            }
            return _G._GReloadCacheData[key];
        }
        //#endregion LUA
        return defaultv;
    }


    export function GetRegClass<T>(className: string, ignoreWarn = false, ignoreExt: boolean = false) {
        let r;
        if (ignoreExt) { r = _G._GReloadClassTypeCache[className]; }
        else {
            r = _G._GReloadClassTypeCache[className + "Ext"] || _G._GReloadClassTypeCache[className];
        }
        if (r == null && !ignoreWarn) {
            GLogHelper.warn("NOT Reg Reload Class " + className);
        }
        return r as T;
    }

    let uuidCount: number = 0;
    export function GenerateUUID() {
        uuidCount++;
        let a = Math.floor(Math.random() * 10000 + 1);
        let b = Math.floor(Math.random() * 10000 + 1);
        return `${a}_${b}_${uuidCount}@`;
    }

    export function RandomNumber(min: number, max: number) {
        return Math.round(Math.random() * (max - min) + min);
    }


    export class Dictionary<K, V>  {

        _keys: K[] = [];
        _values: V[] = [];

        public copy(obj: any) {
            if (this == obj || obj == null) return;
            if (obj._keys && obj._values) {
                this._keys = [].concat(TryTransArrayLikeObject(obj._keys));
                this._values = [].concat(TryTransArrayLikeObject(obj._values));
            }
            else {
                const data: [K, V][] = obj;
                for (let _v of data) {
                    this.add(_v[0], _v[1]);
                }
            }
        }

        public copyData(ks: K[], vs: V[]) {
            if (ks == null || vs == null) return;
            this._keys = [].concat(ks as any);
            this._values = [].concat(vs as any);
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
        public get size(): number {
            return this._keys.length;
        }
        public has(key: K): boolean {
            return this._keys.indexOf(key) != -1;
        }
        public delete(key: K): boolean {
            const index = this._keys.indexOf(key);
            if (index != -1) {
                this._keys.splice(index, 1);
                this._values.splice(index, 1);
                return true;
            }
            return false
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
    export function TryTransArrayLikeObject(a: any) {
        if (typeof a === "object") {
            let keys = Object.keys(a).sort();
            let canTran: any = [];
            for (let i = 0, len = keys.length; i < len; i++) {
                if ((i + 1) + "" === keys[i]) {
                    canTran.push(a[keys[i] as any]);
                }
                else {
                    canTran = null;
                    break;
                }
            }
            if (canTran != null) {
                return canTran;
            }
        }
        return a;
    }

    export function FromJson(v: string) {
        if (typeof v !== "string") { return v }
        if (_CODE_IN_LUA_) {
            //#region LUA
            const r = json.decode(v) as [any, number];
            if (r[0] == null) {
                GLogHelper.error("From json fail", v)
            }
            return r[0];
            //#endregion LUA
        }
        else {
            //#region JS
            return JSON.parse(v);
            //#endregion JS
        }
    }

    export function ToJson(v: any): string {
        if (_CODE_IN_LUA_) {
            //#region LUA
            return json.encode(v);
            //#endregion LUA
        }
        else {
            //#region JS
            return JSON.stringify(v);
            //#endregion JS
        }
    }

    export function ToNumber(v: any): number {
        if (v == null || v == "" || v == "null" || v == "nil") { return 0 }
        return Number(v);
    }

    export function ToBoolean(v: any): boolean {
        if (v == 0 || v == "0" || v == null || v == "" || v == "null" || v == "nil") { return false }
        return !!v;
    }
}

declare global {
    var global: typeof globalThis;
    /**代码是否在lua上 */
    var _CODE_IN_LUA_: Readonly<boolean>;
    var GHandler: typeof CCShare.CCHandler;
    type IGHandler<R = any> = CCShare.CCHandler<R>;
    var _GReloadClassTypeCache: Record<string, any>;
    var _GReloadCacheData: Record<string, any>;
    var GReloadable: typeof CCShare.Reloadable;
    var GGetReloadCache: typeof CCShare.GetReloadCache;
    var GGetRegClass: typeof CCShare.GetRegClass;
    var GFromJson: typeof CCShare.FromJson;
    var GToJson: typeof CCShare.ToJson;
    var GGenerateUUID: typeof CCShare.GenerateUUID;
    var GRandomNumber: typeof CCShare.RandomNumber;
    var GToNumber: typeof CCShare.ToNumber;
    var GToBoolean: typeof CCShare.ToBoolean;
    type IGDictionary<K, V> = CCShare.Dictionary<K, V>;
    var GDictionary: typeof CCShare.Dictionary;
}
const _CODE_IN_JS_ = !((Entities as any).First);
if (_CODE_IN_JS_) {
    (global as any)._G = global;
}
(_G._CODE_IN_LUA_ as any) = !_CODE_IN_JS_;
if (_G.GHandler == null) {
    _G.GHandler = CCShare.CCHandler;
    _G._GReloadClassTypeCache = {};
    _G._GReloadCacheData = {};
    _G.GReloadable = CCShare.Reloadable;
    _G.GGetReloadCache = CCShare.GetReloadCache;
    _G.GGetRegClass = CCShare.GetRegClass;
    _G.GFromJson = CCShare.FromJson;
    _G.GToJson = CCShare.ToJson;
    _G.GGenerateUUID = CCShare.GenerateUUID;
    _G.GRandomNumber = CCShare.RandomNumber;
    _G.GToNumber = CCShare.ToNumber;
    _G.GToBoolean = CCShare.ToBoolean;
    _G.GDictionary = CCShare.Dictionary;
    if (_CODE_IN_JS_) {
        (global as any).GameRules = Game;
    }
    else {
        // (_G.Map as any) = CCShare.Dictionary;
    }
}


