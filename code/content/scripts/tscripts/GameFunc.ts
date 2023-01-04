import { NetTablesHelper } from "./helper/NetTablesHelper";
import { GameServiceConfig } from "./shared/GameServiceConfig";

export module GameFunc {
    export function AsVector(obj: any) {
        return obj as Vector;
    }

    export function AsAttribute(obj: string) {
        switch (obj) {
            case "DOTA_ATTRIBUTE_STRENGTH":
                return Attributes.DOTA_ATTRIBUTE_STRENGTH;
            case "DOTA_ATTRIBUTE_AGILITY":
                return Attributes.DOTA_ATTRIBUTE_AGILITY;
            case "DOTA_ATTRIBUTE_INTELLECT":
                return Attributes.DOTA_ATTRIBUTE_INTELLECT;
            case "DOTA_ATTRIBUTE_MAX":
                return Attributes.DOTA_ATTRIBUTE_MAX;
            case "DOTA_ATTRIBUTE_INVALID":
                return Attributes.DOTA_ATTRIBUTE_INVALID;
        }
        return Attributes.DOTA_ATTRIBUTE_INVALID;
    }

    /**
     * 位运算判断参数是否包含
     * @param n
     * @param arg
     * @returns
     */
    export function IncludeArgs(n: number, ...arg: Array<number>) {
        n = n | 0; // 将浮点数n转化为正整数
        let pad = 0;
        let arr: Array<number> = []; // 用于保存结果的数组
        while (n > 0) {
            if ((n & 1) > 0) arr.push(1 << pad);
            pad++;
            n >>= 1;
        }
        let r: Array<boolean> = [];
        arg.forEach((_a) => {
            r.push(arr.indexOf(_a) > -1);
        });
        return r;
    }
    /**
     * 获取全局唯一UUID
     * @returns
     */
    function GenerateUUID2() {
        let d = GameRules.GetGameTime();
        let t = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
        t = string.gsub(t, "x", (c: string) => {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        })[0];
        t = string.gsub(t, "y", (c: string) => {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        })[0];
        return t;
    }
    function GenerateUUID1() {
        let S4 = () => {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    }

    let uuidCount: number = 0;
    export function GenerateUUID() {
        uuidCount++;
        return DoUniqueString("" + RandomInt(1, 10000)) + uuidCount + "@";
    }
    /**
     * 获取服务器serverKey
     * @returns
     */
    export function GetServerKey() {
        if (IsServer()) {
            return (_G as any).__ServerKeyV2__;
        } else {
            return NetTablesHelper.GetData(GameServiceConfig.ENetTables.common, "encrypt_key")._ || "";
        }
    }
    /**
     * 实例扩充方法
     * @param instance 实例
     * @param table 类
     */
    export function BindInstanceToCls(_instance: any, table: new () => any) {
        if (_instance instanceof table) { return }
        let instance = GetmetatableIndex(_instance) as any;
        let { prototype } = table;
        while (prototype) {
            for (const key in prototype) {
                // Using hasOwnProperty to ignore methods from metatable added by ExtendInstance
                // https://github.com/SteamDatabase/GameTracking-Dota2/blob/7edcaa294bdcf493df0846f8bbcd4d47a5c3bd57/game/core/scripts/vscripts/init.lua#L195
                if (!instance.hasOwnProperty(key)) {
                    instance[key] = prototype[key];
                }
            }
            prototype = getmetatable(prototype);
        }
    }
    /**
     * 获取对象原表索引数据
     * @param s
     * @returns
     */
    export function GetmetatableIndex(s: Object) {
        return getmetatable(s).__index as Object;
    }

    /**测量对象内存大小 todo */
    export function memSize(o: any) {
        collectgarbage("stop");
        let before = collectgarbage("count");
        let after = collectgarbage("count");
        return (after - before) * 1024;
    }

    /**
     * 判断是否有效
     * @param obj
     * @returns
     */
    export function IsValid(obj: CEntityInstance | IBaseModifier_Plus) {
        return obj && !obj.IsNull();
    }

    export namespace mathUtil {
        /**
         * 伪随机
         * @param fChance
         * @returns
         */
        export function PRD(fChance: number, entity: IBaseNpc_Plus = null, sign: string = null) {
            return RandomInt(1, 100) <= fChance;
        }
        /**
         * 越界检查
         * @param num
         * @param min
         * @param max
         * @returns
         */
        export function Clamp(num: number, min: number, max: number) {
            return num <= min ? min : num >= max ? max : num;
        }

        export function Lerp(percent: number, a: number, b: number) {
            return a + percent * (b - a);
        }

        export function RemapVal(num: number, a: number, b: number, c: number, d: number) {
            if (a == b) return c;

            let percent = (num - a) / (b - a);
            return Lerp(percent, c, d);
        }

        export function RemapValClamped(num: number, a: number, b: number, c: number, d: number) {
            if (a == b) return c;

            let percent = (num - a) / (b - a);
            percent = Clamp(percent, 0.0, 1.0);

            return Lerp(percent, c, d);
        }
    }

    /**向量 */
    export namespace VectorFunctions {
        /**
         * 逆時針旋轉
         * @param vVector
         * @param radian
         * @returns
         */
        export function Rotation2D(vVector: Vector, radian: number): Vector {
            const fLength2D = vVector.Length2D();
            const vUnitVector2D = (vVector / fLength2D) as Vector;
            const fCos = math.cos(radian);
            const fSin = math.sin(radian);
            return (Vector(vUnitVector2D.x * fCos - vUnitVector2D.y * fSin, vUnitVector2D.x * fSin + vUnitVector2D.y * fCos, vUnitVector2D.z) * fLength2D) as Vector;
        }
        /**
         * 向量加法
         * @param arg
         * @returns
         */
        export function Add(...arg: Array<Vector>): Vector {
            let r = Vector(0, 0, 0);
            arg.forEach((v) => {
                r = (r + v) as Vector;
            });
            return r;
        }

        export function VectorToString(s: Vector): string {
            if (s == null) return;
            return s.x + " " + s.y + " " + s.z;
        }

        export function ArrayToVector(s: [number, number, number]): Vector {
            if (s == null) return;
            return Vector(...s);
        }
        /**
         * 字符串转Vector
         * @param s
         */
        export function StringToVector(s: string): Vector {
            if (s == null) return;
            let d = s.split(" ");
            return Vector(parseFloat(d[0] || "0"), parseFloat(d[1] || "0"), parseFloat(d[2] || "0"));
        }

        export function HorizonVector(vec: Vector) {
            vec.z = 0;
            return vec.Normalized();
        }
        /**
         *
         * @param pect
         * @param v1
         * @param v2
         * @returns
         */
        export function VectorLerp(pect: number, v1: Vector, v2: Vector) {
            return ((v2 - v1) * pect + v1) as Vector;
        }
        /**
         * 是否是交互有效距离
         * @param v1
         * @param v2
         * @returns
         */
        export function IsValidDiatance(v1: Vector, v2: Vector) {
            return ((v1 - v2) as Vector).Length() <= 300;
        }

        /**
         * 判斷是否是零坐標
         * @param v
         * @returns
         */
        export function VectorIsZero(v: Vector) {
            return v.x == 0 && v.y == 0 && v.z == 0;
        }
        export class Vector2D {
            public x: number;
            public y: number;
            constructor(v: Vector) {
                this.x = v.x;
                this.y = v.y;
            }
        }

        export class Polygon2D {
            data: Array<GameFunc.VectorFunctions.Vector2D> = [];
            constructor(polygon: Array<Vector>) {
                polygon.forEach((v) => {
                    this.data.push(new GameFunc.VectorFunctions.Vector2D(v));
                });
            }
        }

        /**
         * 判斷兩線相交
         * @param pt1_1
         * @param pt1_2
         * @param pt2_1
         * @param pt2_2
         * @returns
         */
        export function IsLineCross(pt1_1: Vector2D, pt1_2: Vector2D, pt2_1: Vector2D, pt2_2: Vector2D) {
            return (
                math.min(pt1_1.x, pt1_2.x) <= math.max(pt2_1.x, pt2_2.x) &&
                math.min(pt2_1.x, pt2_2.x) <= math.max(pt1_1.x, pt1_2.x) &&
                math.min(pt1_1.y, pt1_2.y) <= math.max(pt2_1.y, pt2_2.y) &&
                math.min(pt2_1.y, pt2_2.y) <= math.max(pt1_1.y, pt1_2.y)
            );
        }
        //  判断点是否在不规则图形里（不规则图形里是点集，点集每个都是固定住的）
        export function IsPointInPolygon(point: Vector, polygonPoints: Vector[]) {
            let j = polygonPoints.length;
            let bool = 0;
            for (let i = 0; i < polygonPoints.length; i++) {
                let polygonPoint1 = polygonPoints[j];
                let polygonPoint2 = polygonPoints[i];
                if (
                    ((polygonPoint2.y < point.y && polygonPoint1.y >= point.y) || (polygonPoint1.y < point.y && polygonPoint2.y >= point.y)) &&
                    (polygonPoint2.x <= point.x || polygonPoint1.x <= point.x)
                ) {
                    bool = bit.bxor(bool, (polygonPoint2.x + ((point.y - polygonPoint2.y) / (polygonPoint1.y - polygonPoint2.y)) * (polygonPoint1.x - polygonPoint2.x) < point.x && 1) || 0);
                }
                j = i;
            }
            return bool == 1;
        }
    }

    /**
     *
     * @param hUnit
     * @param iOrder
     * @param hTarget
     * @param hAbility
     * @param vPosition
     */
    export function ExecuteOrder(hUnit: CDOTA_BaseNPC, iOrder: dotaunitorder_t, hTarget: CDOTA_BaseNPC, hAbility: CDOTABaseAbility, vPosition: Vector = null) {
        ExecuteOrderFromTable({
            UnitIndex: hUnit.entindex(),
            OrderType: iOrder,
            TargetIndex: (hTarget && hTarget.entindex()) || null,
            AbilityIndex: (hAbility && hAbility.entindex()) || null,
            Position: vPosition,
            Queue: false,
        });
    }

    export namespace ArrayFunc {
        /**
         * 随机数组 TODO 优化算法，count与数组长度接近，需要反向删选
         * @param arr
         * @param count 数量
         * @param isRepeat 是否重复
         */
        export function RandomArray<T>(arr: Array<T>, count: number = 1, isRepeat: boolean = false) {
            let len = arr.length;
            count = math.min(count, len);
            let r: T[] = [];
            if (count <= 0) {
                return r;
            }
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
                    index.push(tonumber(_i));
                }
            }
            // 这里需要-1 适配
            for (let k of index) {
                r.push(arr[k - 1]);
            }
            if (r.length != index.length) {
                GLogHelper.error("RandomArray out of range");
            }
            return r;
        }

        /**
         * 根据权重随机数组
         * @param arr
         * @param weight
         * @param count
         */
        export function RandomArrayByWeight<T>(arr: Array<T>, weight: Array<number | string>, count: number = 1) {
            let _arr = [].concat(arr);
            let _weight: number[] = [];
            weight.forEach((v) => {
                _weight.push(tonumber(v));
            });
            if (_arr.length == count || _arr.length == 0) {
                return _arr;
            }
            if (_arr.length < count) {
                GLogHelper.error("our of range");
            }
            let _count = count;
            let he = 0;
            let i = 0;
            for (let _k of _weight) {
                i += 1;
                if (i > _arr.length) {
                    break;
                }
                he += math.abs(_k);
            }
            let r = [];
            while (he > 0 && _count > 0) {
                _count -= 1;
                let _rand = RandomInt(1, he);
                let index = 0;
                while (_weight[index] != null && _rand > _weight[index]) {
                    index += 1;
                    _rand -= _weight[index];
                }
                r.push(_arr[index]);
                he -= _weight[index];
                _arr.splice(index, 1);
                _weight.splice(index, 1);
            }
            if (r.length != count) {
                GLogHelper.error("our of range");
            }
            return r;
        }

        /**
         * 移除數組内所有元素
         * @param t
         * @param v
         * @returns
         */
        export function RemoveAll(t: Array<any>, v: any) {
            if (t == null || t.length == 0) return;
            let len = t.length;
            for (let i = len - 1; i > -1; i--) {
                if (t[i] == v) {
                    t.splice(i, 1);
                }
            }
        }
        /**
         * 数组移除元素
         * @param t
         * @param v
         * @param isall
         * @returns
         */
        export function ArrayRemove(t: Array<any>, v: any, isall = false) {
            if (!t) {
                return;
            }
            let index = t.indexOf(v);
            if (index > -1) {
                t.splice(index, 1);
            }
            if (isall) {
                index = t.indexOf(v);
                while (index > -1) {
                    t.splice(index, 1);
                    index = t.indexOf(v);
                }
            }
        }
        /**
         * Set转化成数组
         * @param set
         * @returns
         */
        export function FromSet<T>(set: Set<T>): T[] {
            let r = [] as T[];
            set.forEach((i) => {
                r.push(i);
            });
            return r;
        }
    }
}
