export module FuncHelper {




    export class Handler {
        private static _pool: Handler[] = [];
        private static _gid: number = 0;
        public _id = Handler._gid++;
        public caller: any;
        public method: Function | null;
        public args: any[];
        public once: boolean;
        constructor() {
            this.once = false;
            this._id = 0;
            this.setTo(null, null, []);
        }
        setTo(caller: any, method: any, args: any[], once = false) {
            this._id = Handler._gid++;
            this.caller = caller;
            this.method = method;
            this.args = args;
            this.once = once;
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
            let nextCall = this.method.apply(this.caller, ...arg);
            this._id === id && this.once && this.recover();
            return nextCall;
        }
        clear() {
            this.caller = null;
            this.method = null;
            this.args = [];
            return this;
        }
        recover() {
            if (this._id > 0) {
                this._id = 0;
                Handler._pool.push(this.clear());
            }
        }
        static create(caller: any, method: any, args: any[] = [], once = true) {
            if (Handler._pool.length > 0) return (Handler._pool.pop() as Handler).setTo(caller, method, args, once);
            return new Handler().setTo(caller, method, args, once);
        }
    }

    /**
     * 获取全局唯一UUID
     * @returns
     */
    export function generateUUID() {
        let d = new Date().getTime();
        let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        });
        return uuid;
    }

    export function toArray<T>(a: ArrayLikeObject<T>) {
        let r: T[] = [];
        let keys = Object.keys(a).sort();
        for (let k of keys) {
            r.push((a as any)[k] as T);
        }
        return r;
    }

    /**
     * 获取本局玩家数量
     */
    export function getPlayerCount() {
        let playerCount = Players.GetMaxTeamPlayers();
        for (let i = 0; i < playerCount; i++) {
            if (!Players.IsValidPlayerID(i as PlayerID)) {
                return i;
            }
        }
        return playerCount;
    }
    /**
     * 向量距离
     * @param v1
     * @param v2
     * @returns
     */
    export function Vector_distance(v1: [number, number, number], v2: [number, number, number]) {
        return (v1[0] - v2[0]) ^ (2 + (v1[1] - v2[1])) ^ (2 + (v1[2] - v2[2])) ^ 2 ^ 0.5;
    }

    /**
     * 是否是有效交互距离
     * @param v1
     * @param v2
     */
    export function IsValidDiatance(v1: [number, number, number], v2: [number, number, number]) {
        return Vector_distance(v1, v2) <= 300;
    }

    /**
     * 字符串转Vector
     * @param s
     */
    export function StringToVector(s: string): Vector {
        if (s == null) return new Vector();
        let d = s.split(" ");
        return new Vector(parseFloat(d[0] || "0"), parseFloat(d[1] || "0"), parseFloat(d[2] || "0"));
    }

    export class Vector {
        x: number = 0;
        y: number = 0;
        z: number = 0;
        constructor(x?: number, y?: number, z?: number) {
            if (x != null) this.x = x;
            if (y != null) this.y = y;
            if (z != null) this.z = z;
        }
        toArray() {
            return [this.x, this.y, this.z] as [number, number, number];
        }
    }

    export function Clamp(num: number, min: number, max: number) {
        return num <= min ? min : num >= max ? max : num;
    }

    export function Lerp(percent: number, a: number, b: number) {
        return a + percent * (b - a);
    }

    export function RemapValClamped(num: number, a: number, b: number, c: number, d: number) {
        if (a == b) return c;
        let percent = (num - a) / (b - a);
        percent = Clamp(percent, 0.0, 1.0);
        return Lerp(percent, c, d);
    }
    export namespace Random {
        /**
         * 随机数组 TODO 优化算法，count与数组长度接近，需要反向删选
         * @param arr
         * @param count 数量
         * @param isRepeat 是否重复
         */
        export function RandomArray<T>(arr: Array<T>, count: number = 1, isRepeat: boolean = false) {
            if (arr == null) return;
            let len = arr.length;
            count = Math.min(count, len);
            let r: T[] = [];
            if (count <= 0) {
                return r;
            }
            Math.random;
            let index = [];
            if (isRepeat) {
                while (count > 0) {
                    count -= 1;
                    index.push(RandomInt(0, len - 1));
                }
            } else {
                let _arr = Object.keys(arr);
                while (count > 0) {
                    count -= 1;
                    let _len = _arr.length;
                    let _i = _arr.splice(RandomInt(0, _len - 1), 1)[0];
                    index.push(Number(_i));
                }
            }
            for (let k of index) {
                r.push(arr[k]);
            }
            if (r.length != index.length) {
                throw new Error("RandomArray out of range");
            }
            return r;
        }

        /**
         * 随机整数
         */
        export function RandomInt(min: number, max: number): number {
            return Math.round(Math.random() * (max - min) + min);
        }
    }
}
