
export module FuncHelper {



    export function Utf8ArrayToStr(array: Uint8Array) {
        let out, i, len, c;
        let char2, char3;
        out = "";
        len = array.length;
        i = 0;
        while (i < len) {
            c = array[i++];
            switch (c >> 4) {
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                    // 0xxxxxxx
                    out += String.fromCharCode(c);
                    break;
                case 12: case 13:
                    // 110x xxxx   10xx xxxx
                    char2 = array[i++];
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    }
    export function ToFiniteNumber(i: number, defaultVar = 0) {
        return isFinite(i) ? i : defaultVar;
    }
    /**
     * 获取全局唯一UUID
     * @returns
     */
    export function GenerateUUID() {
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
    export function GetPlayerCount() {
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
    export function ToFloat(v: number | string) {
        return Math.round(Number(v) * 10000) / 10000;
    }
    export function Clamp(num: number, min: number, max: number) {
        return num <= min ? min : num >= max ? max : num;
    }

    export function Lerp(percent: number, a: number, b: number) {
        return a + percent * (b - a);
    }
    export function Round(fNumber: number, prec = 0) {
        let i = Math.pow(10, prec);
        return Math.round(fNumber * i) / i;
    }
    export function SignNumber(fNumber: number, ispect = false) {
        const pect = ispect ? '%' : "";
        return fNumber == 0 ? "" : (fNumber > 0 ? "+" + fNumber + pect : fNumber + pect);
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

    export namespace BigNumber {
        export enum Digit {
            K = 1,
            M = 2,
            G = 3,
            T = 4,
            P = 5,
            E = 6,
            Z = 7,
            Y = 8,
            B = 9,
        }
        export enum DigitSchinese {
            "万" = 1,
            "亿" = 2,
            "万亿" = 3,
            "兆" = 4,
            "万兆" = 5,
            "京" = 6,
            "万京" = 7,
            "垓" = 8,
            "万垓" = 9,
        }

        export function FormatNumber(fNumber: number, prec: number = 2) {
            fNumber = ToFloat(fNumber);
            let [a, b] = FormatNumberBase(fNumber, prec);
            if (b) {
                return a + b;
            }
            return a;
        }

        export function FormatNumberBase(fNumber: number, prec = 2) {
            let sSign = fNumber < 0 ? "-" : "";
            fNumber = Math.abs(fNumber);
            let sNumber = String(Math.abs(fNumber));
            let a = sNumber.split(".");
            let sInteger = a[0];
            let sLanguage = $.Language().toLowerCase();
            if (sLanguage == "schinese") {
                let n = Math.floor((sInteger.length - 1) / 4);
                if (n == 0) {
                    return [sSign + String(Round(fNumber, prec))];
                }
                sNumber = String(Round(fNumber / Math.pow(10000, n), prec));
                let sDigit = DigitSchinese[n];
                return [sSign + sNumber, sDigit];
            } else {
                let n = Math.floor((sInteger.length - 1) / 3);
                if (n == 0) {
                    return [sSign + String(Round(fNumber, prec))];
                }
                sNumber = String(Round(fNumber / Math.pow(1000, n), prec));
                let sDigit = Digit[n];
                return [sSign + sNumber, sDigit];
            }
        }
    }




}
