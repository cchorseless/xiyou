/** @noSelfInFile */

import { GameFunc } from "../../GameFunc";
import { AoiHelper } from "../../helper/AoiHelper";
import { KVHelper } from "../../helper/KVHelper";
import { ResHelper } from "../../helper/ResHelper";
import { PropertyCalculate } from "../propertystat/PropertyCalculate";


//----------------------------------------------------------------------------------------------------
function IsValid(h: CEntityInstance | CDOTA_Buff | undefined): h is CEntityInstance | CDOTA_Buff {
    return h != null && !h.IsNull();
}

/**
 * 判断是否为有效数字，如不是则缺省值，缺省值默认为0
 * @param i
 * @param defaultVar
 * @returns
 */
function finiteNumber(i: number, defaultVar = 0) {
    return isFinite(i) ? i : defaultVar;
}

/**
 * 转化为有效数字，如不是则缺省值，缺省值默认为0
 * @param i 任意值
 * @param defaultVar 缺省值，默认为0
 * @returns 返回数字
 */
function toFiniteNumber(i: any, defaultVar = 0) {
    return finiteNumber(Number(i), defaultVar);
}

/**
 * 记录表系统，可以记录一个表并且返回索引，用于做一些需要记录数据的技能
 */
const tRecordTable = new Map<number, any>();

/**
 * 创建一个记录表，返回记录表及其索引。可以传入一个表来作为记录表使用
 * @param t 可不填，缺省值为一个空表
 * @returns 返回表以及其索引
 */
function CreateRecordTable<T extends object | Array<T>>(t: T = {} as T): LuaMultiReturn<[T, number]> {
    let index = 0;
    while (tRecordTable.has(index)) {
        index = index + 1;
    }
    tRecordTable.set(index, t);
    return $multi(tRecordTable.get(index), index);
}

/**
 * 删除一个记录表，抹去该表的索引信息。可以传入索引或表本身
 * @param t_or_index 表或者索引
 * @returns 返回是否删除成功
 */
function RemoveRecordTable<T extends object | Array<T>>(t_or_index: T | number) {
    let index;
    if (typeof t_or_index == "number") {
        index = t_or_index;
    } else {
        index = GetRecordTableIndex(t_or_index);
    }
    if (index) {
        tRecordTable.delete(index);
        return true;
    }
    return false;
}

/**
 * 获取记录表的索引
 * @param t 记录表
 * @returns 索引，没有则会返回undefined
 */
function GetRecordTableIndex<T extends object | Array<T>>(t: T) {
    for (const [index, _t] of tRecordTable) {
        if (_t == t) {
            return index;
        }
    }
    return;
}

/**
 * 通过index获取记录表
 * @param index 索引
 * @returns 记录表，没有则会返回undefined
 */
function GetRecordTableByIndex<T extends object | Array<T>>(index: number): T | undefined {
    return tRecordTable.get(index);
}

/**
 * 获取所有记录表数量
 * @returns 返回记录表数量
 */
function RecordTableCount() {
    return tRecordTable.size;
}

/**
 * 获取技能的特殊键值
 * @param sAbilityName 技能名字
 * @param sKey 特殊键值名字
 * @param iLevel 等级，从0开始
 */
// function GetAbilityNameLevelSpecialValueFor(sAbilityName: string, sKey: string, iLevel: number) {
//     let tAbilityKeyValues = KVHelper.KvAbilitys[sAbilityName] ?? KVHelper.KvItems[sAbilityName];
//     if (typeof tAbilityKeyValues == "object") {
//         if (typeof tAbilityKeyValues.AbilityValues == "object") {
//             let value = tAbilityKeyValues.AbilityValues[sKey];
//             if (value) {
//                 let sValues;
//                 if (typeof value == "object") {
//                     sValues = value.value;
//                 } else if (typeof value != "undefined") {
//                     sValues = value;
//                 }
//                 if (sValues != undefined) {
//                     let aValues = tostring(sValues).split(" ");
//                     if (aValues.length > 0) {
//                         return toFiniteNumber(aValues[Math.min(iLevel, aValues.length - 1)]);
//                     }
//                 }
//             }
//         }
//         if (typeof tAbilityKeyValues.AbilitySpecial == "object") {
//             for (const sIndex in tAbilityKeyValues.AbilitySpecial) {
//                 const tData = tAbilityKeyValues.AbilitySpecial[sIndex];
//                 if (tData[sKey] != undefined) {
//                     let aValues = tostring(tData[sKey]).split(" ");
//                     if (aValues.length > 0) {
//                         return toFiniteNumber(aValues[Math.min(iLevel, aValues.length - 1)]);
//                     }
//                 }
//             }
//         }
//     }
//     return 0;
// }
/**
 * 获取技能的特殊键值的附属值
 * @param sAbilityName 技能名字
 * @param sKey 特殊键值名字
 * @param iLevel 等级，从0开始
 * @param sAddedKey 特殊键值附属值名字
 */
// function GetAbilityNameLevelSpecialAddedValueFor(sAbilityName: string, sKey: string, iLevel: number, sAddedKey: string) {
//     let tAbilityKeyValues = KVHelper.KvAbilitys[sAbilityName] ?? KVHelper.KvItems[sAbilityName];
//     if (typeof tAbilityKeyValues == "object") {
//         if (typeof tAbilityKeyValues.AbilityValues == "object") {
//             let value = tAbilityKeyValues.AbilityValues[sKey];
//             if (typeof value == "object") {
//                 let sValues = value[sAddedKey];
//                 if (sValues != undefined) {
//                     let aValues = tostring(sValues).split(" ");
//                     if (aValues.length > 0) {
//                         let sV = aValues[Math.min(iLevel, aValues.length - 1)];
//                         let nV = Number(sV);
//                         if (isFinite(nV)) {
//                             return nV;
//                         } else {
//                             return sV;
//                         }
//                     }
//                 }
//             }
//         }
//         if (typeof tAbilityKeyValues.AbilitySpecial == "object") {
//             for (const sIndex in tAbilityKeyValues.AbilitySpecial) {
//                 const tData = tAbilityKeyValues.AbilitySpecial[sIndex];
//                 if (tData[sKey] != undefined && tData[sAddedKey] != undefined) {
//                     let aValues = tostring(tData[sKey]).split(" ");
//                     if (aValues.length > 0) {
//                         let sV = aValues[Math.min(iLevel, aValues.length - 1)];
//                         let nV = Number(sV);
//                         if (isFinite(nV)) {
//                             return nV;
//                         } else {
//                             return sV;
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }


/**
 * 击退函数
 * @param fPercent 插值
 * @param fStartHeight 开始高度
 * @param fMaxHeight 最大高度
 * @param fEndHeight 最终高度
 * @returns
 */
function KnockBackFunction(fPercent: number, fStartHeight: number, fMaxHeight: number, fEndHeight: number) {
    fPercent = GFuncMath.Clamp(fPercent, 0, 1);
    return (2 * fEndHeight + 2 * fStartHeight - 4 * fMaxHeight) * (fPercent * fPercent) + (4 * fMaxHeight - fEndHeight - 3 * fStartHeight) * fPercent + fStartHeight;
}

//----------------------------------------------------------------------------------------------------

/**
 * 附加值计算函数
 */
let tAddedValues: Record<string, string> = {
    _str: "GetStrength",
    _agi: "GetAgility",
    _int: "GetIntellect",
    _all: "GetAllStats",
    _attack_damage: "GetAttackDamage",
    _attack_speed: "GetAttackSpeed",
    _health: "GetCustomMaxHealth",
    _mana: "GetMaxMana",
    _armor: "GetArmor",
    _move_speed: "GetMoveSpeed",
    _ulti: "GetUltiPower",
};

declare global {
    interface CEntityInstance {
        /**
         * Runs when the Instance is destroyed .
         *
         * @both
         */
        OnDestroy(): void;
    }
}


declare global {
    interface CDOTABaseAbility {
        /**默认值 */
        __DefaultSpecialValue__: { [k: string]: number | number[] };
        /**是否销毁 */
        __safedestroyed__: boolean;

        /**
         * @both
         * @param fInterval
         * @param fCallback
         * @param _isIgnorePauseTime true 忽视游戏暂停.default false
         */
        AddTimer(fInterval: number, fCallback: () => number | void, _isIgnorePauseTime?: boolean): void;

        /**
         * @both
         * @returns
         */
        GetCasterPlus<T extends IBaseNpc_Plus>(): T;

        /**
         * @Server
         * @returns
         */
        GetOwnerPlus<T extends IBaseNpc_Plus>(): T;

        GetLevelSpecialValueFor_Engine: typeof CDOTABaseAbility.GetLevelSpecialValueFor;
        GetSpecialValueFor_Engine: typeof CDOTABaseAbility.GetSpecialValueFor;

        GetSpecialValueFor(sKey: string, default_V?: number): number;

        /**
         * @Both
         * 获取技能和天赋值
         * @param sKey 键名
         * @param default_V 默认值
         * @returns 值
         */
        GetTalentSpecialValueFor(sKey: string, default_V?: number): number;

        /**
         * 获取技能等级键值
         * @param sKey 键名
         * @param iLevel 等级，-1为取当前等级，1级填值为0
         * @param bAbilityUpgrade 是否为计算技能升级，不填默认为true
         * @param bAdded 是否计算附加值，不填默认为true
         * @param hUnit 附加值函数计算者，不填默认为技能拥有者
         * @returns 值
         */
        // GetLevelSpecialValue(sKey: string, iLevel: number, bAbilityUpgrade?: boolean, bAdded?: boolean, hUnit?: CDOTA_BaseNPC): number;
        /**
         * 获取技能等级键附加值
         * @param sKey 键名
         * @param iLevel 等级，-1为取当前等级，1级填值为0
         * @param sAddedKey 键附加值名
         * @param bAbilityUpgrade 是否为计算技能升级，不填默认为true
         * @returns 值
         */

        // GetLevelSpecialAddedValue(sKey: string, iLevel: number, sAddedKey: string, bAbilityUpgrade?: boolean): string | number | undefined;

        /**
         * @Both
         * 设置技能默认值
         * @param sKey
         * @param v
         */
        SetDefaultSpecialValue(sKey: string, v: any): void;

        // /**
        //  * 获取技能当前等级键值
        //  * @param sKey 键名
        //  * @param bAbilityUpgrade 是否为计算技能升级，不填默认为true
        //  * @param bAdded 是否计算附加值，不填默认为true
        //  * @param hUnit 附加值函数计算者，不填默认为技能拥有者
        //  * @returns 值
        //  */
        // GetSpecialValue(sKey: string, bAbilityUpgrade?: boolean, bAdded?: boolean, hUnit?: CDOTA_BaseNPC): number;


        /**
         * 技能是否准备就绪可以施放
         * @serverOnly
         */
        IsAbilityReady(): boolean;

        /**尝试智能施法,AI会调用
         * @serverOnly
         */
        AutoSpellSelf(): boolean;

        /**
         * 是否拥有天赋
         * @param sTalent 天赋名
         * @returns 值
         */
        HasTalent(sTalent: string): IBaseAbility_Plus | null;

        /**
         * @Both
         * 获取天赋数值
         * @param sKey 键名
         * @returns 值
         */
        GetTalentValue(sTalent: string, sKey?: string): number;

        /**
         * 获取自定义技能类型
         * @returns 值
         */
        // GetCustomAbilityType(): CUSTOM_ABILITY_TYPE;
        SpeakTrigger(): number;

        /** 获取伤害类型 */
        // GetDamageType(): CC_DAMAGE_TYPES;
    }
}

const CBaseAbility = IsServer() ? CDOTABaseAbility : C_DOTABaseAbility;

CBaseAbility.AddTimer = function (fInterval: number, fCallback: () => number | void, _isIgnorePauseTime = false) {
    if (fInterval < 0) {
        fInterval = 0;
        GLogHelper.error("AddTimer", "fInterval < 0", fInterval);
    }
    GTimerHelper.AddTimer(fInterval, GHandler.create(this,
        () => {
            return fCallback();
        }), _isIgnorePauseTime);
}

CBaseAbility.GetCasterPlus = function () {
    return this.GetCaster() as IBaseNpc_Plus
}

if (CBaseAbility.GetLevelSpecialValueFor_Engine == undefined) {
    CBaseAbility.GetLevelSpecialValueFor_Engine = CBaseAbility.GetLevelSpecialValueFor;
}
if (CBaseAbility.GetSpecialValueFor_Engine == null) {
    CBaseAbility.GetSpecialValueFor_Engine = CBaseAbility.GetSpecialValueFor;
}

/**
 * 设置Special默认值
 * @param s
 * @param default_V
 * @returns
 */
CBaseAbility.SetDefaultSpecialValue = function (s: string, default_V: number | number[]) {
    this.__DefaultSpecialValue__ = this.__DefaultSpecialValue__ || {};
    this.__DefaultSpecialValue__[s] = default_V;
}

CBaseAbility.GetSpecialValueFor = function (s: string, default_V = 0): number {
    let r = this.GetSpecialValueFor_Engine(s);
    if (r && r != 0) {
        return r
    } else if (this.__DefaultSpecialValue__ && this.__DefaultSpecialValue__[s] && this.__DefaultSpecialValue__[s] != null) {
        let data = this.__DefaultSpecialValue__[s];
        if (type(data) == 'number') {
            return data as number
        } else {
            let level = this.GetLevel();
            return (data as number[])[level - 1] as number
        }
    }
    let data = KVHelper.KvAbilitys[this.GetAbilityName()] || KVHelper.KvItems[this.GetAbilityName()];
    if (data) {
        let dataV = data[s] as any;
        if (dataV == null) {
            let spedata = data.AbilitySpecial as { [k: string]: any };
            if (spedata != null) {
                for (let k in spedata) {
                    let v = spedata[k];
                    if (v[s]) {
                        dataV = v[s];
                        break;
                    }
                }
            }
        }
        if (dataV) {
            if (type(dataV) == 'number') {
                return dataV as number;
            } else if (type(dataV) == 'string') {
                let datalist = (dataV as string).split(' ').map((v) => {
                    return GToNumber(v)
                });
                let index = math.min(this.GetLevel(), datalist.length);
                return datalist[index - 1] as number
            }
        }
    }
    GLogHelper.warn("GetSpecialValueFor Miss ", this.GetAbilityName(), s);
    return default_V
}
CBaseAbility.GetTalentSpecialValueFor = function (s: string, default_V = 0): number {
    let base = this.GetSpecialValueFor(s, default_V);
    let talentName;
    const link = "LinkedSpecialBonus";
    let data: { [k: string]: any } = KVHelper.KvAbilitys[this.GetAbilityName()] || KVHelper.KvItems[this.GetAbilityName()];
    for (const k in data) {
        const v: { [k: string]: any } = data[k];
        if (k == "AbilitySpecial") {
            for (const [l, m] of GameFunc.Pair(v)) {
                if (m[s] && m[link]) {
                    talentName = m[link];
                    break;
                }
            }
        } else if (k == "AbilityValues") {
            for (const [l, m] of GameFunc.Pair(v)) {
                if (type(m) == "table") {
                    if (m[s] && m[link]) {
                        talentName = m[link];
                        break;
                    }
                }
            }
        }
        if (talentName) break;
    }
    if (talentName) {
        let talent = this.GetCasterPlus().FindAbilityByName(talentName);
        if (talent && talent.GetLevel() > 0) {
            base = base + talent.GetSpecialValueFor("value");
        }
    }
    return base;
}

// CBaseAbility.GetLevelSpecialValue = function (sKey: string, iLevel: number, bAbilityUpgrade: boolean = true, bAdded: boolean = true, hUnit?: CDOTA_BaseNPC) {
//     if (!IsValid(this)) return 0;
//     if (iLevel == -1) iLevel = this.GetLevel() - 1;
//     let hCaster = this.GetCaster();

//     bAbilityUpgrade = bAbilityUpgrade && AbilityUpgrades != undefined;

//     let value;
//     if (bAbilityUpgrade) {
//         value = AbilityUpgrades.GetAbilityMechanicsUpgradeLevelSpecialValue(hCaster, this.GetName(), sKey, iLevel) ?? this.GetLevelSpecialValueFor_Engine(sKey, iLevel);
//         value = AbilityUpgrades.CalcSpecialValueUpgrade(hCaster, this.GetName(), sKey, value);
//     } else {
//         value = this.GetLevelSpecialValueFor_Engine(sKey, iLevel);
//     }

//     // 附加值计算
//     if (!IsValid(hUnit)) hUnit = hCaster;
//     if (bAdded) {
//         for (const k in tAddedValues) {
//             const v = tAddedValues[k];
//             let factor;
//             if (bAbilityUpgrade) {
//                 factor = toFiniteNumber(AbilityUpgrades.GetAbilityMechanicsUpgradeLevelSpecialAddedValue(hCaster, this.GetName(), sKey, iLevel, k) ?? GetAbilityNameLevelSpecialAddedValueFor(this.GetName(), sKey, iLevel, k));
//                 factor = AbilityUpgrades.CalcSpecialValuePropertyUpgrade(hCaster, this.GetName(), sKey, k, factor);
//             } else {
//                 factor = toFiniteNumber(GetAbilityNameLevelSpecialAddedValueFor(this.GetName(), sKey, iLevel, k));
//             }
//             if (factor != 0 && typeof hUnit[v as keyof CDOTA_BaseNPC] === "function") {
//                 // @ts-ignore
//                 let addedValue = toFiniteNumber(hUnit[v](), 0);
//                 value = value + addedValue * factor;

//                 // 最终结果值不小于
//                 let min;
//                 if (bAbilityUpgrade) {
//                     min = AbilityUpgrades.GetAbilityMechanicsUpgradeLevelSpecialAddedValue(hCaster, this.GetName(), sKey, iLevel, "_min") ?? GetAbilityNameLevelSpecialAddedValueFor(this.GetName(), sKey, iLevel, "_min");
//                 } else {
//                     min = GetAbilityNameLevelSpecialAddedValueFor(this.GetName(), sKey, iLevel, "_min");
//                 }
//                 if (typeof min == "number") {
//                     min = AbilityUpgrades.CalcSpecialValuePropertyUpgrade(hCaster, this.GetName(), sKey, "_min", min);
//                     value = math.max(value, min);
//                 }
//                 // 最终结果值不大于
//                 let max;
//                 if (bAbilityUpgrade) {
//                     max = AbilityUpgrades.GetAbilityMechanicsUpgradeLevelSpecialAddedValue(hCaster, this.GetName(), sKey, iLevel, "_max") ?? GetAbilityNameLevelSpecialAddedValueFor(this.GetName(), sKey, iLevel, "_max");
//                 } else {
//                     max = GetAbilityNameLevelSpecialAddedValueFor(this.GetName(), sKey, iLevel, "_max");
//                 }
//                 if (typeof max == "number") {
//                     max = AbilityUpgrades.CalcSpecialValuePropertyUpgrade(hCaster, this.GetName(), sKey, "_max", max);
//                     value = math.min(value, max);
//                 }
//             }
//         }
//     }
//     return value;
// };

// CBaseAbility.GetLevelSpecialAddedValue = function (sKey: string, iLevel: number, sAddedKey: string, bAbilityUpgrade: boolean = true) {
//     if (!IsValid(this)) return;
//     if (iLevel == -1) iLevel = this.GetLevel() - 1;
//     let hCaster = this.GetCaster();

//     bAbilityUpgrade = bAbilityUpgrade && AbilityUpgrades != undefined;

//     let value;
//     if (bAbilityUpgrade) {
//         value = AbilityUpgrades.GetAbilityMechanicsUpgradeLevelSpecialAddedValue(hCaster, this.GetName(), sKey, iLevel, sAddedKey) ?? GetAbilityNameLevelSpecialAddedValueFor(this.GetName(), sKey, iLevel, sAddedKey);
//         if (typeof value == "number") {
//             value = AbilityUpgrades.CalcSpecialValuePropertyUpgrade(hCaster, this.GetName(), sKey, sAddedKey, value);
//         }
//     } else {
//         value = GetAbilityNameLevelSpecialAddedValueFor(this.GetName(), sKey, iLevel, sAddedKey);
//     }
//     return value;
// };


// CBaseAbility.GetSpecialValue = function (sKey: string, bAbilityUpgrade: boolean = true, bAdded: boolean = true, hUnit?: CDOTA_BaseNPC) {
//     if (!IsValid(this)) return 0;
//     let iLevel = this.GetLevel() - 1;
//     let hCaster = this.GetCaster();

//     bAbilityUpgrade = bAbilityUpgrade && AbilityUpgrades != undefined;

//     let value;
//     if (bAbilityUpgrade) {
//         value = AbilityUpgrades.GetAbilityMechanicsUpgradeLevelSpecialValue(hCaster, this.GetName(), sKey, iLevel) ?? this.GetSpecialValueFor_Engine(sKey);
//         value = AbilityUpgrades.CalcSpecialValueUpgrade(hCaster, this.GetName(), sKey, value);
//     } else {
//         value = this.GetSpecialValueFor_Engine(sKey);
//     }

//     // 附加值计算
//     if (!IsValid(hUnit)) hUnit = hCaster;
//     if (bAdded) {
//         for (const k in tAddedValues) {
//             const v = tAddedValues[k];
//             let factor;
//             if (bAbilityUpgrade) {
//                 factor = toFiniteNumber(AbilityUpgrades.GetAbilityMechanicsUpgradeLevelSpecialAddedValue(hCaster, this.GetName(), sKey, iLevel, k) ?? GetAbilityNameLevelSpecialAddedValueFor(this.GetName(), sKey, iLevel, k));
//                 factor = AbilityUpgrades.CalcSpecialValuePropertyUpgrade(hCaster, this.GetName(), sKey, k, factor);
//             } else {
//                 factor = toFiniteNumber(GetAbilityNameLevelSpecialAddedValueFor(this.GetName(), sKey, iLevel, k));
//             }
//             if (factor != 0 && typeof hUnit[v as keyof CDOTA_BaseNPC] === "function") {
//                 // @ts-ignore
//                 let addedValue = toFiniteNumber(hUnit[v](), 0);
//                 value = value + addedValue * factor;

//                 // 最终结果值不小于
//                 let min;
//                 if (bAbilityUpgrade) {
//                     min = AbilityUpgrades.GetAbilityMechanicsUpgradeLevelSpecialAddedValue(hCaster, this.GetName(), sKey, iLevel, "_min") ?? GetAbilityNameLevelSpecialAddedValueFor(this.GetName(), sKey, iLevel, "_min");
//                 } else {
//                     min = GetAbilityNameLevelSpecialAddedValueFor(this.GetName(), sKey, iLevel, "_min");
//                 }
//                 if (typeof min == "number") {
//                     min = AbilityUpgrades.CalcSpecialValuePropertyUpgrade(hCaster, this.GetName(), sKey, "_min", min);
//                     value = math.max(value, min);
//                 }
//                 // 最终结果值不大于
//                 let max;
//                 if (bAbilityUpgrade) {
//                     max = AbilityUpgrades.GetAbilityMechanicsUpgradeLevelSpecialAddedValue(hCaster, this.GetName(), sKey, iLevel, "_max") ?? GetAbilityNameLevelSpecialAddedValueFor(this.GetName(), sKey, iLevel, "_max");
//                 } else {
//                     max = GetAbilityNameLevelSpecialAddedValueFor(this.GetName(), sKey, iLevel, "_max");
//                 }
//                 if (typeof max == "number") {
//                     max = AbilityUpgrades.CalcSpecialValuePropertyUpgrade(hCaster, this.GetName(), sKey, "_max", max);
//                     value = math.min(value, max);
//                 }
//             }
//         }
//     }
//     return value;
// };

// CBaseAbility.GetSpecialAddedValue = function (sKey: string, sAddedKey: string, bAbilityUpgrade: boolean = true) {
//     return this.GetLevelSpecialAddedValue(sKey, this.GetLevel() - 1, sAddedKey, bAbilityUpgrade);
// };

CBaseAbility.HasTalent = function (sTalent: string) {
    if (!IsValid(this)) return;
    const hCaster = this.GetCaster();
    const hTalent = hCaster.FindAbilityByName(sTalent);
    if (IsValid(hTalent) && hTalent.GetLevel() > 0) {
        return hTalent as IBaseAbility_Plus;
    }
};
CBaseAbility.GetTalentValue = function (sTalent: string, sKey: string = "value") {
    if (!IsValid(this)) return 0;
    const hCaster = this.GetCasterPlus();
    const hTalent = hCaster.FindAbilityByName(sTalent);
    if (!IsValid(hTalent) || hTalent.GetLevel() == 0) {
        return 0;
    }
    return hTalent.GetSpecialValueFor(sKey);
};
// CBaseAbility.GetCustomAbilityType = function () {
//     let customAbilityType = KVHelper.KvAbilitys[this.GetAbilityName()].CustomAbilityType;
//     if (customAbilityType == undefined || customAbilityType == "") {
//         customAbilityType = "ABILITY_TYPE_NONE";
//     }
//     return CUSTOM_ABILITY_TYPE[customAbilityType as "ABILITY_TYPE_NONE"];
// };

// CBaseAbility.GetDamageType = function () {
//     return KVHelper.KvAbilitys[this.GetAbilityName()].DamageType;
// };

if (IsServer()) {
    CBaseAbility.GetOwnerPlus = function () {
        if (!IsValid(this)) return;
        return this.GetOwner() as IBaseNpc_Plus
    }
    CBaseAbility.IsAbilityReady = function () {
        if (!IsValid(this)) return false;
        let hCaster = this.GetCaster();
        let iBehavior = this.GetBehaviorInt();

        if (!IsValid(hCaster)) {
            return false;
        }

        let hAbility = hCaster.GetCurrentActiveAbility();
        if (IsValid(hAbility) && hAbility.IsInAbilityPhase()) {
            return false;
        }

        if (hCaster.HasModifier("modifier_passive_cast")) {
            return false;
        }

        if (this.GetLevel() <= 0) {
            return false;
        }

        if (this.IsHidden()) {
            return false;
        }

        if (!this.IsActivated()) {
            return false;
        }

        if (!this.IsCooldownReady()) {
            return false;
        }

        if (!this.IsOwnersManaEnough()) {
            return false;
        }

        if (!this.IsOwnersGoldEnough(hCaster.GetPlayerID())) {
            return false;
        }

        if (hCaster.IsHexed() || hCaster.IsCommandRestricted()) {
            return false;
        }

        if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE) != DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE && hCaster.IsStunned()) {
            return false;
        }

        if (!this.IsItem() && !this.IsPassive() && hCaster.IsSilenced()) {
            return false;
        }

        if (!this.IsItem() && this.IsPassive() && hCaster.PassivesDisabled()) {
            return false;
        }

        if (this.IsItem() && !this.IsPassive() && hCaster.IsMuted()) {
            return false;
        }

        if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL) != DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL && hCaster.IsChanneling()) {
            return false;
        }

        if (!this.IsFullyCastable()) {
            return false;
        }

        return true;
    };
    CBaseAbility.AutoSpellSelf = function () {
        return false;
    }
}

if (IsClient()) {
    CBaseAbility.GetManaCost = function (level: number) {
        let data = KVHelper.KvAbilitys[this.GetAbilityName()] || KVHelper.KvItems[this.GetAbilityName()];
        if (data && data.AbilityManaCost) {
            return GToNumber(data.AbilityManaCost.split(' ')[level - 1]);
        }
        return 0;
    }
    CBaseAbility.GetGoldCost = function (level: number) {
        return 0;
    }
}
//----------------------------------------------------------------------------------------------------

declare global {
    interface CDOTA_Buff {
        __safedestroyed__: boolean;

        /**
         * @both
         * @param fInterval
         * @param fCallback
         * @param _isIgnorePauseTime true 忽视游戏暂停.default false
         */
        AddTimer(fInterval: number, fCallback: () => number | void): void;

        /**是否被销毁
         * @Both
         */
        IsNull(): boolean;

        /**获取施法技能
         * @Both
         *
         */
        GetAbilityPlus<T extends IBaseAbility_Plus>(): T;

        /**获取施法技能
         * @Both
         *
         */
        GetItemPlus<T extends IBaseItem_Plus>(): T;

        /**获取施法来源NPC，谁施法的
         * @Both
         *
         */
        GetCasterPlus<T extends IBaseNpc_Plus>(): T;

        /**获取作用归属NPC，在谁身上
         * @Both
         *
         */
        GetParentPlus<T extends IBaseNpc_Plus>(): T;

        /**自己给自己施法的
         * @Both
         */
        IsCastBySelf(): boolean;

        /**
         * 獲取當前等級對應技能屬性
         * @Both
         * @param s
         * @param default_V 默认值
         * @returns
         */
        GetSpecialValueFor(sKey: string, default_V?: number): number;

        /**
         * @Both
         * 获取技能当前等级键附加值
         * @param sKey 键名
         * @param default_V 默认值
         * @returns 值
         */
        GetTalentSpecialValueFor(sKey: string, default_V?: number): number;

        /**
         * 获取buff来源技能等级键值，如获取不到则会返回0
         * @Both
         * @param sKey 键名
         * @param iLevel 等级，-1为取当前等级，1级填值为0
         * @returns 值
         */
        GetLevelSpecialValueFor(sKey: string, iLevel: number): number;

        /**
         * @Both
         * @returns
         */
        GetAbilityLevel(): number;

        /**
         * 圆形范围找敌方单位
         * @Server
         * @param radius
         * @param p
         * @returns
         */
        FindEnemyInRadius(radius: number, p?: Vector): IBaseNpc_Plus[]

        /**
         * 获取天赋数值
         * @param sKey 键名
         * @returns 值
         */
        GetAbilityTalentValue(sTalent: string, sKey: string): number;

        /**
         * 是否拥有天赋
         * @param sTalent 天赋名
         * @returns 值
         */
        HasTalent(sTalent: string): IBaseAbility_Plus | null;

        /** 获取流派数值 */
        GetSectSpecialValueFor(id: string, sKey: string): number;

        /** 增加层数
         * @Both
         */
        IncrementStackCount(iStackCount?: number): void;

        /** 减少层数
         * @Both
         */
        DecrementStackCount(iStackCount?: number): void;

        /**
         * 更改BUFF层数
         * @Both
         * @param iCount +增加 +减少
         * @returns
         */
        ChangeStackCount(iStackCount?: number): number;

        /**
         * 获取自定义技能键值
         * @returns 值
         */
        GetCustomAbilityValueFor(id: string, sKey: string): number;

        /** 触发自定义技能效果 */
        customAbilityEffect(): void;

    }
}

CDOTA_Buff.IsNull = function () {
    return this.__safedestroyed__;
}
CDOTA_Buff.AddTimer = function (fInterval: number, fCallback: () => number | void, _isIgnorePauseTime = false) {
    if (fInterval < 0) {
        fInterval = 0;
        GLogHelper.error("CDOTA_Buff AddTimer", "fInterval < 0", fInterval);
    }
    GTimerHelper.AddTimer(fInterval, GHandler.create(this, () => {
        return fCallback()
    }), _isIgnorePauseTime);
}
CDOTA_Buff.GetAbilityPlus = function () {
    if (!IsValid(this)) {
        return
    }
    ;
    return this.GetAbility() as IBaseAbility_Plus;
}
CDOTA_Buff.GetItemPlus = function () {
    if (!IsValid(this)) {
        return
    }
    ;
    return this.GetAbility() as IBaseItem_Plus;
}
CDOTA_Buff.GetCasterPlus = function () {
    if (!IsValid(this)) {
        return
    }
    ;
    return this.GetCaster() as IBaseNpc_Plus;
}

CDOTA_Buff.GetParentPlus = function () {
    if (!IsValid(this)) {
        return
    }
    ;
    return this.GetParent() as IBaseNpc_Plus;
}

CDOTA_Buff.IsCastBySelf = function () {
    return this.GetCasterPlus().GetEntityIndex() == this.GetParentPlus().GetEntityIndex();
}
CDOTA_Buff.GetSpecialValueFor = function (s: string, default_V = 0) {
    if (!IsValid(this)) return 0;
    let r = 0;
    if (this.GetAbility() == null) {
        r = (this as any)[s];
    } else {
        r = this.GetAbilityPlus().GetSpecialValueFor(s) || 0;
    }
    if (r && r != 0) {
        return r;
    } else {
        return default_V;
    }
};
CDOTA_Buff.GetTalentSpecialValueFor = function (s: string, default_V = 0) {
    if (!IsValid(this)) return 0;
    let r = 0;
    if (this.GetAbility() == null) {
        r = (this as any)[s];
    } else {
        r = this.GetAbilityPlus().GetTalentSpecialValueFor(s) || 0;
    }
    if (r && r != 0) {
        return r;
    } else {
        return default_V;
    }
}
CDOTA_Buff.GetLevelSpecialValueFor = function (s: string, lvl: number) {
    if (!IsValid(this) || !IsValid(this.GetAbility())) return 0;
    if (this.GetAbility() == null) {
        let r = (this as any)[s];
        return r || 0;
    }
    return this.GetAbility().GetLevelSpecialValueFor(s, lvl);
};


CDOTA_Buff.GetAbilityLevel = function () {
    if (this.GetAbility() == null) {
        return -1;
    }
    return this.GetAbility().GetLevel();
}


CDOTA_Buff.GetAbilityTalentValue = function (sTalent: string, sKey: string) {
    if (!IsValid(this)) return 0;
    const hCaster = this.GetCaster();
    const hTalent = hCaster?.FindAbilityByName(sTalent);
    if (!IsValid(hTalent) || hTalent.GetLevel() == 0) {
        return 0;
    }
    return hTalent.GetSpecialValueFor(sKey);
};
CDOTA_Buff.HasTalent = function (sTalent: string) {
    if (!IsValid(this)) return null;
    const hCaster = this.GetCaster();
    const hTalent = hCaster.FindAbilityByName(sTalent);
    if (!IsValid(hTalent) || hTalent.GetLevel() == 0) {
        return null;
    }
    return hTalent as IBaseAbility_Plus;
};

// CDOTA_Buff.GetSectSpecialValueFor = function (id: string, sKey: string): number {
//     if (!IsValid(this) || !IsValid(this.GetAbility())) return 0;
//     let iLevel = 0;
//     const hCaster = this.GetCaster();
//     if (hCaster) {
//         const playerID = hCaster.GetPlayerOwnerID();
//         if (hCaster.HasModifier("modifier_neutral")) {
//             // 野怪版本
//             if (IsServer()) {
//                 const entIndex = hCaster.entindex();
//                 // @ts-ignore
//                 const data = GameState.getState()?.neutralSectData[entIndex];
//                 if (data && data[id]) {
//                     iLevel = data[id].level;
//                 } else {
//                     iLevel = 0;
//                 }
//             } else {
//                 iLevel = 0;
//             }
//         } else {
//             if (IsServer()) {
//                 if (PlayerData.getHero(playerID).abilityUpgradeData[id]) {
//                     iLevel = PlayerData.getHero(playerID).abilityUpgradeData[id].level;
//                 }
//             } else {
//                 const data = CustomNetTables.GetTableValue("sect_data", ("ability_upgrade_" + playerID) as "ability_upgrade_0");
//                 if (data && data[id]) {
//                     iLevel = data[id].level;
//                 }
//             }
//         }
//         if (iLevel && iLevel > 0) {
//             let valueData: string | any = KeyValues.AbilityUpgradesKvs[id]?.AbilityValues[sKey];
//             if (valueData == undefined) {
//                 return 0;
//             }
//             let overload = CustomNetTables.GetTableValue("sect_data", "sect_adjust") ?? {};
//             let sectName = this.GetAbility().GetAbilityName();
//             let adjust = (overload?.[sectName]?.adjust) ?? 0;
//             if (typeof valueData != "object") {
//                 let valuePerLevel = tostring(valueData).split(" ");
//                 if (valuePerLevel[iLevel - 1]) {
//                     return ((100 + adjust) / 100) * tonumber(valuePerLevel[iLevel - 1]) as number;
//                 } else if (valuePerLevel[0]) {
//                     return ((100 + adjust) / 100) * tonumber(valuePerLevel[0]) as number;
//                 }
//             } else {
//                 let valuePerLevel = tostring(valueData["value"]).split(" ");

//                 if (valuePerLevel[iLevel - 1]) {
//                     let value = tonumber(valuePerLevel[iLevel - 1]) as number;
//                     if (valueData["modifier"] && valueData["modifier"] == "constant") {
//                         return value;
//                     }
//                     if (valueData["modifier"] && valueData["modifier"] == "increase") {
//                         return value * ((100 - adjust) / 100);
//                     }
//                     return value * ((100 + adjust) / 100);
//                 } else if (valuePerLevel[0]) {
//                     return ((100 + adjust) / 100) * tonumber(valuePerLevel[0]) as number;
//                 }
//             }
//         }

//     }
//     return 0;
// };
// CDOTA_Buff.GetCustomAbilityValueFor = function (id: string, sKey: string): number {
//     if (!IsValid(this) || !IsValid(this.GetAbility())) return 0;
//     let ability = this.GetAbility();
//     const hCaster = this.GetCaster();
//     if (IsValid(hCaster) && IsValid(ability)) {
//         let iLevel = ability.GetLevel();
//         if (iLevel > 0) {
//             let valueData: string = KeyValues.CustomAbilitiesKv[id].AbilityValues[sKey];
//             let valuePerLevel = valueData.split(" ");
//             if (valuePerLevel[iLevel - 1]) {
//                 return tonumber(valuePerLevel[iLevel - 1]) as number;
//             } else if (valuePerLevel[0]) {
//                 return tonumber(valuePerLevel[0]) as number;
//             }
//         }
//     }
//     return 0;
// };
CDOTA_Buff.ChangeStackCount = function (iCount: number) {
    let oldCount = this.GetStackCount();
    this.SetStackCount(Math.max(0, oldCount + iCount));
    return this.GetStackCount();
}
CDOTA_Buff.IncrementStackCount = function (iStackCount?: number) {
    if (iStackCount == undefined) {
        this.SetStackCount(this.GetStackCount() + 1);
    } else {
        this.SetStackCount(this.GetStackCount() + iStackCount);
    }
};
CDOTA_Buff.DecrementStackCount = function (iStackCount?: number) {
    if (iStackCount == undefined) {
        this.SetStackCount(this.GetStackCount() - 1);
    } else {
        this.SetStackCount(this.GetStackCount() - iStackCount);
    }
};
if (IsServer()) {
    CDOTA_Buff.FindEnemyInRadius = function (radius: number, p: Vector = null) {
        if (IsServer()) {
            if (p == null) {
                p = this.GetCaster().GetAbsOrigin();
            }
            let teamNumber = this.GetCaster().GetTeamNumber();
            return AoiHelper.FindEntityInRadius(teamNumber, p, radius);
        }
    }
}
//#region BaseNPC
declare global {
    interface CDOTA_BaseNPC {
        /**是否已经被安全销毁 */
        __safedestroyed__: boolean;
        /**是否是第一次创建 */
        __bIsFirstSpawn: boolean;
        /**创建的实体 */
        __CreateChildren__: IBaseNpc_Plus[];
        /**所有的BUFF信息 */
        __AllModifiersInfo__: { [v: string]: Array<IBaseModifier_Plus> };
        __TempData: { [k: string]: any };
        /**绑定的实体
         * @Server
         */
        ETRoot: IETEntityRoot;

        /**
         * @Server 删除时回调
         */
        UpdateOnRemove(): void;
        /**
         * @Both 清除数据
         */
        ClearSelf(): void;
        /**
         * @Both 找到本体
         */
        GetSource(): IBaseNpc_Plus;

        /**
         * @Both
         * 是否拥有魔晶
         * @param hCaster
         */
        HasShard(): boolean;
        /**
         * 是否NPC thinker
         * @Both
         */
        IsThinker(): boolean;
        /**
         * @Both
         */
        TempData<T = any>(): { [k: string]: T };

        /**
         * @Both
         * 获取损失的生命值百分比
         */
        GetHealthLosePect(): number;

        /**
         * @Server
         */
        InitActivityModifier(): void;

        /**
         * @Both
         */
        IsInvisiblePlus(): boolean;

        /**
         * @Server
         * @param sItemName
         * @param bStash
         */
        RemoveItemByName(sItemName: string, bStash?: boolean): void;

        /**
         * @Both
         */
        IsFriendly(hTarget: CDOTA_BaseNPC): boolean;

        /**
         * @Both
         * 是否有天赋
         * @param sTalentName 天赋名称 或者 技能索引
         * @returns
         */
        HasTalent(sTalentName: string): IBaseAbility_Plus | null;

        /**
         * @Both
         * 获取天赋的值
         * @param sTalentName 天赋的名字或者索引
         * @returns
         */
        GetTalentValue(TalentName: string, sSpecialName?: string, default_V?: number): number;

        /**
         * @Server
         */
        GetOwnerPlus<T extends IBaseNpc_Plus>(): T;

        /**
         * kv数据
         * @Both
         */
        GetKVData<T>(key: string, defaultv?: T): T;

        /**
         * 父节点注册自己
         * @Both
         */
        RegOwnerSelf(b: boolean): void;

        /**
         * @Both
         * 删除所有子节点
         */
        RemoveAllChildrenNpc(): void;
        /**
         * @Both
         * 设置自己等级
         * @param n
         */
        CreatureLevelUp(n: number): void;

        /**
         * 注册BUFF
         * @Both
         * @param buff
         * @param isReg
         */
        RegModifiersInfo<T extends IBaseModifier_Plus>(buff: T, isReg: boolean): void;

        /**
         * 通过名字找子节点
         * @Both
         */
        FindChildByName<T extends IBaseNpc_Plus>(name: string): T[];

        /**
         * 通过Buff名字找子节点
         * @Both
         */
        FindChildByBuffName<T extends IBaseNpc_Plus>(name: string): T[];

        /**
         * 通过filter找子节点
         * @Both
         */
        FindChildByFilter<T extends IBaseNpc_Plus>(func: (v: IBaseNpc_Plus, i: number) => boolean): T[];

        /**
         * 是否是真实单位
         * @Both
         */
        IsRealUnit(): boolean;

        /**
         * 获取玩家ID
         * @Both
         */
        GetPlayerID(): PlayerID;

        /**
         * @Both
         */
        GetIntellect(): number;

        /**
         * @Both
         */
        GetStrength(): number;

        /**
         * @Both
         */
        GetAgility(): number;

        /**
         * @Both
         */
        GetAllStats(): number;

        /**
         * 获取主属性值
         * @Server
         * @returns
         */
        GetPrimaryStatValue(): number;

        /**
         * 获取主属性
         * @Both
         * @returns
         */
        GetPrimaryAttribute(): Attributes;

        /**
         * 设置主属性值
         * @Server
         * @returns
         */
        SetPrimaryAttribute(v: Attributes): void;

        /**
         * 异常状态抵抗百分比，用于异常状态持续时间
         * @Both
         * @param n
         * @returns
         */
        GetStatusResistanceFactor(hCaster: CDOTA_BaseNPC): number;

        /**
         * @Server
         * @param fChanged
         */
        ModifyMaxHealth(fChanged: number): void;

        /**
         * @Server
         * @param abilityname
         * @param level
         * @returns
         */
        addAbilityPlus<T extends IBaseAbility_Plus>(abilityname: string, level?: number): T;

        /**
         * @BOTH
         * @param abilityname
         */
        findAbliityPlus<T extends IBaseAbility_Plus>(abilityname: string): T | null;

        /**
         * @Server
         * @param abilityname
         */
        removeAbilityPlus(abilityname: string): void;

        /**
         * @Server
         * @param buffname
         * @param caster
         * @param ability
         * @param modifierTable
         * @returns
         */
        addBuff<T extends CDOTA_Buff>(buffname: string, caster?: IBaseNpc_Plus, ability?: IBaseAbility_Plus, modifierTable?: IModifierTable): T;

        /**
         * @Server
         * @param buffname
         * @param caster
         * @param ability
         * @param modifierTable
         * @returns
         */
        addOnlyBuff<T extends CDOTA_Buff>(buffname: string, caster?: IBaseNpc_Plus, ability?: IBaseAbility_Plus, modifierTable?: IModifierTable): T;

        /**
         * @Server
         * @param buffname
         * @param caster
         */
        removeBuff<T extends CDOTA_Buff>(buffname: string, caster?: CDOTA_BaseNPC): void;

        /**
         * @Both
         * @param buffname
         * @param caster
         * @returns
         */
        findBuff<T extends CDOTA_Buff>(buffname: string, caster?: CDOTA_BaseNPC): T;

        /**
         * @Both
         * @param buffname
         * @param caster
         */
        findBuffStack(buffname: string, caster?: CDOTA_BaseNPC): number;

        /**
         * @Server
         * 单位放到地面上
         */
        SetUnitOnClearGround(): void;

        /**
         * @Server
         * @param hAbility
         * @param hCaster
         * @param fDuration
         */
        ApplyCharm(hAbility: IBaseAbility_Plus, hCaster: CDOTA_BaseNPC, fDuration: number): void;

        /**
         * @Server
         * 治疗
         * @param amount
         * @param inflictor
         */
        ApplyHeal(amount: number, inflictor: CDOTABaseAbility | undefined): void;

        /**
         * @Server
         * 吸血
         * @param source
         * @param lifestealPct
         * @param damage
         * @param target
         * @param damage_type
         * @param iSource
         * @param bParticle
         */
        Lifesteal(source: IBaseAbility_Plus, lifestealPct: number, damage: number, target: IBaseNpc_Plus, damage_type?: DAMAGE_TYPES, iSource?: DamageCategory_t, bParticle?: boolean): void;


        /**
         * @Server
         * 恐惧
         * @param hAbility
         * @param hCaster
         * @param duraiton
         */
        ApplyFear(hAbility: IBaseAbility_Plus, hCaster: IBaseNpc_Plus, duraiton: number): IBaseModifier_Plus;

        /**
         * @Server
         * 击退
         * @param hAbility
         * @param hCaster
         * @param kv
         */
        ApplyKnockBack(hAbility: IBaseAbility_Plus, hCaster: IBaseNpc_Plus, kv: {
            distance: number,
            duration: number,
            height?: number,
            direction_x?: number,
            direction_y?: number,
            tree_destroy_radius?: number,
            IsStun?: boolean,
            IsFlail?: boolean,
        }): IBaseModifier_Plus;

        /**
         * @Server
         * 眩晕
         * @param hAbility
         * @param hCaster
         * @param duraiton
         */
        ApplyStunned(hAbility: IBaseAbility_Plus, hCaster: IBaseNpc_Plus, duraiton: number): IBaseModifier_Plus;


        /**
         * @Server
         * 混乱
         * @param hAbility
         * @param hCaster
         * @param duraiton
         */
        ApplyDaze(hAbility: IBaseAbility_Plus, hCaster: IBaseNpc_Plus, duraiton: number): IBaseModifier_Plus;

        /**
         * @Server
         * 冰冻
         * @param hAbility
         * @param hCaster
         * @param duraiton
         */
        ApplyFreeze(hAbility: IBaseAbility_Plus, hCaster: IBaseNpc_Plus, duraiton: number): IBaseModifier_Plus;

        /**
         * @Server
         * 寒冷层数
         * @param hAbility
         * @param hCaster
         * @param duraiton
         */
        ApplyChilled(hAbility: IBaseAbility_Plus, hCaster: IBaseNpc_Plus, duraiton: number): IBaseModifier_Plus;

        /**
         * @Server
         * 移除寒冷效果
         */
        RemoveChilled(): void;

        /**
         * @Both
         * 寒冷效果
         */
        IsChilled(): boolean;

        /**
         * @Both
         * 冰冻
         */
        IsFreeze(): boolean;

        /**
         * @Both
         * 混乱
         */
        IsDazed(): boolean;

        /**
         * @Both
         * 沉睡，受到攻击会被唤醒
         */
        IsSleeped(): boolean;

        /**
         * @Both
         * 获取攻击距离
         */
        GetAttackRangePlus(): number;


    }
}

const BaseNPC = IsServer() ? CDOTA_BaseNPC : C_DOTA_BaseNPC;
BaseNPC.IsThinker = function () {
    return this.GetUnitName() == "npc_dota_thinker";
}
BaseNPC.ClearSelf = function () {
    if (IsValid(this)) {
        if (this.__TempData) {
            for (let k in this.__TempData) {
                delete this.__TempData[k];
            }
        }
        this.__TempData = null;
        if (this.__CreateChildren__) {
            let thinkers = this.FindChildByFilter((v) => v.IsThinker());
            thinkers.forEach((v) => {
                v.Destroy();
            });
        }
        this.__CreateChildren__ = null;
        this.__AllModifiersInfo__ = null;
        if (this.ETRoot) {
            this.ETRoot.Dispose();
            this.ETRoot = null;
        }
        this.RegOwnerSelf(false);
        GTimerHelper.ClearAll(this);
    }
}

BaseNPC.GetHealthLosePect = function () {
    return (1 - this.GetHealth() / this.GetMaxHealth()) * 100;
}
BaseNPC.HasShard = function () {
    return this.HasModifier("modifier_item_aghanims_shard")
}
BaseNPC.IsSummoned = function () {
    return this.HasModifier("modifier_summon")
}
BaseNPC.IsIllusion = function () {
    return this.HasModifier("modifier_illusion")
}
BaseNPC.GetSource = function () {
    if (this.IsSummoned() || this.IsClone() || this.IsIllusion()) {
        return IsValid(this.GetOwnerPlus()) && this.GetOwnerPlus() || this;
    }
    return this
}
BaseNPC.RegOwnerSelf = function (b: boolean) {
    let owner = this.GetOwnerPlus();
    if (IsValid(owner)) {
        if (b) {
            owner.__CreateChildren__ = owner.__CreateChildren__ || [];
            owner.__CreateChildren__.push(this);
        } else {
            if (!owner.__CreateChildren__) {
                return;
            }
            let index = owner.__CreateChildren__.indexOf(this);
            if (index >= 0) {
                owner.__CreateChildren__.splice(index, 1);
            }
        }
    }
}
BaseNPC.RemoveAllChildrenNpc = function () {
    if (!IsValid(this)) { return }
    if (!this.__CreateChildren__) { return }
    let children = [...this.__CreateChildren__];
    let len = children.length;
    for (let i = 0; i < len; i++) {
        const child = children[i];
        GFuncEntity.SafeDestroyUnit(child);
    }
    this.__CreateChildren__ = null;
}

BaseNPC.FindChildByName = function (name: string) {
    let r: IBaseNpc_Plus[] = [];
    if (IsValid(this)) {
        let children = this.__CreateChildren__ || [];
        let len = children.length;
        for (let i = 0; i < len; i++) {
            const child = children[i];
            if (!IsValid(child)) {
                children.splice(i, 1);
                i--;
                len--;
                continue;
            }
            if (child.GetUnitName() == name) {
                r.push(child);
            }
        }
    }
    return r;
}

BaseNPC.FindChildByBuffName = function (name: string) {
    let r: IBaseNpc_Plus[] = [];
    if (IsValid(this)) {
        let children = this.__CreateChildren__ || [];
        let len = children.length;
        for (let i = 0; i < len; i++) {
            const child = children[i];
            if (!IsValid(child)) {
                children.splice(i, 1);
                i--;
                len--;
                continue;
            }
            if (child.HasModifier(name)) {
                r.push(child);
            }
        }
    }
    return r;
}
BaseNPC.FindChildByFilter = function (func: (unit: IBaseNpc_Plus, index: number) => boolean) {
    let r: IBaseNpc_Plus[] = [];
    if (IsValid(this)) {
        let children = this.__CreateChildren__ || [];
        let len = children.length;
        for (let i = 0; i < len; i++) {
            const child = children[i];
            if (!IsValid(child)) {
                children.splice(i, 1);
                i--;
                len--;
                continue;
            }
            if (func(child, i)) {
                r.push(child);
            }
        }
    }
    return r;
}

BaseNPC.RegModifiersInfo = function (buff: IBaseModifier_Plus, isReg: boolean) {
    this.__AllModifiersInfo__ = this.__AllModifiersInfo__ || {};
    let buffname = buff.GetName();
    if (isReg) {
        if (this.__AllModifiersInfo__[buffname] == null) {
            this.__AllModifiersInfo__[buffname] = [];
        }
        this.__AllModifiersInfo__[buffname].push(buff);
    } else {
        // 删除数据
        if (this.__AllModifiersInfo__[buffname]) {
            let len = this.__AllModifiersInfo__[buffname].length;
            for (let i = 0; i < len; i++) {
                if (buff.UUID == this.__AllModifiersInfo__[buffname][i].UUID) {
                    // 删除元素
                    this.__AllModifiersInfo__[buffname].splice(i, 1);
                    break;
                }
            }
            if (this.__AllModifiersInfo__[buffname].length == 0) {
                delete this.__AllModifiersInfo__[buffname];
            }
        }
    }
}

BaseNPC.findBuff = function (buffname: string, caster: CDOTA_BaseNPC = null) {
    if (buffname && this.HasModifier(buffname)) {
        if (IsServer()) {
            if (caster) {
                return this.FindModifierByNameAndCaster(buffname, caster);
            }
            return this.FindModifierByName(buffname);
        } else {
            let modifiers = this.__AllModifiersInfo__ || {};
            if (modifiers[buffname]) {
                let len = modifiers[buffname].length;
                for (let i = 0; i < len; i++) {
                    const buff = modifiers[buffname][i];
                    if (caster) {
                        if (buff.GetCaster() == caster) {
                            return buff;
                        }
                    } else {
                        return buff;
                    }
                }
            }
        }
    }
}

BaseNPC.InitActivityModifier = function () {
    let name = this.GetUnitName();
    if (name == null || name.length == 0) {
        return
    }
    ;
    let entityKeyValues = KVHelper.KvUnits[name];
    if (entityKeyValues == null) return;
    let move = entityKeyValues.MovementSpeedActivityModifiers;
    let attackspeed = entityKeyValues.AttackSpeedActivityModifiers;
    let attackrange = entityKeyValues.AttackRangeActivityModifiers;
    let obj = {};
    if (move) {
        obj = Object.assign(obj, move)
    }
    if (attackspeed) {
        obj = Object.assign(obj, attackspeed)
    }
    if (attackrange) {
        obj = Object.assign(obj, attackrange)
    }
    if (Object.keys(obj).length > 0) {
        Gmodifier_spawn_activity.apply(this, this, null, obj)
    }
}


BaseNPC.TempData = function () {
    if (this.__TempData == null) {
        this.__TempData = {};
    }
    return this.__TempData;
}

BaseNPC.IsInvisiblePlus = function () {
    if (this.IsInvisible()) {
        return true;
    }
    const IMBA_INVISIBLE_MODIFIERS = [
        "modifier_imba_moonlight_shadow_invis",
        "modifier_item_imba_shadow_blade_invis",
        "modifier_imba_vendetta",
        "modifier_nyx_assassin_burrow",
        "modifier_item_imba_silver_edge_invis",
        "modifier_item_glimmer_cape_fade",
        "modifier_weaver_shukuchi",
        "modifier_imba_weaver_shukuchi",
        "modifier_treant_natures_guise_invis",
        "modifier_templar_assassin_meld",
        "modifier_imba_templar_assassin_meld",
        "modifier_imba_skeleton_walk_dummy",
        "modifier_invoker_ghost_walk_self",
        "modifier_chess_rune_invis",
        "modifier_imba_skeleton_walk_invis",
        "modifier_imba_riki_invisibility",
        "modifier_imba_riki_cloak_and_dagger_723",
        "modifier_imba_riki_smoke_screen_723_buff",
        "modifier_imba_shadow_walk_buff_invis",
        "modifier_imba_invisibility_rune",
        "modifier_imba_blur_smoke",
        "modifier_windrunner_windrun_invis",
        "modifier_imba_windranger_windrun_invis",
    ]
    for (const modifier of (IMBA_INVISIBLE_MODIFIERS)) {
        if (this.HasModifier(modifier)) {
            return true;
        }
    }
    return false;
}

BaseNPC.RemoveItemByName = function (ItemName, bStash) {
    let count = 8;
    if (bStash) {
        count = 14;
    }
    for (let slot = 0; slot <= count; slot += 1) {
        let item = this.GetItemInSlot(slot);
        if (item) {
            if (item.GetAbilityName() == ItemName) {
                this.RemoveItem(item);
                return;
            }
        }
    }
}

BaseNPC.IsFriendly = function (hTarget: CDOTA_BaseNPC) {
    if (IsValid(this) && IsValid(hTarget)) {
        return this.GetTeamNumber() == hTarget.GetTeamNumber();
    }
    return false;
};

BaseNPC.HasTalent = function (sTalentName: string): IBaseAbility_Plus {
    if (!IsValid(this)) return;
    let hTalent = this.FindAbilityByName(sTalentName);
    // switch (typeof sTalentName) {
    //     case "string":
    //         hTalent = this.FindAbilityByName(sTalentName);
    //         break;
    // }
    if (hTalent == null) return;
    if (hTalent.GetLevel() <= 0) return;
    return hTalent as IBaseAbility_Plus;
}

BaseNPC.GetTalentValue = function (sTalentName: string, sSpecialName: string = "value", default_V: number = 0): number {
    if (!IsValid(this)) return default_V;
    let hTalent = this.HasTalent(sTalentName);
    if (hTalent) {
        return hTalent.GetSpecialValueFor(sSpecialName);
    }
    return default_V;
}
BaseNPC.GetPlayerID = function () {
    if (!IsValid(this)) return -1;
    if (this.ETRoot && IsServer()) return this.ETRoot.BelongPlayerid;
    return this.GetPlayerOwnerID();
}

BaseNPC.IsRealUnit = function () {
    if (!IsValid(this)) return false;
    return !(this.IsIllusion() || this.IsSummoned());
}

BaseNPC.GetIntellect = function () {
    if (!IsValid(this)) return 0;
    return PropertyCalculate.GetIntellect(this)
}

BaseNPC.GetStrength = function () {
    if (!IsValid(this)) return 0;
    return PropertyCalculate.GetStrength(this)
}

BaseNPC.GetAgility = function () {
    if (!IsValid(this)) return 0;
    return PropertyCalculate.GetAgility(this)
}

BaseNPC.GetAllStats = function () {
    if (!IsValid(this)) return 0;
    return this.GetIntellect() + this.GetStrength() + this.GetAgility();
}

BaseNPC.GetPrimaryStatValue = function () {
    if (!IsValid(this)) return 0;
    const Primary = this.GetPrimaryAttribute();
    if (Primary == Attributes.DOTA_ATTRIBUTE_AGILITY) {
        return this.GetAgility()
    } else if (Primary == Attributes.DOTA_ATTRIBUTE_STRENGTH) {
        return this.GetStrength()
    } else if (Primary == Attributes.DOTA_ATTRIBUTE_INTELLECT) {
        return this.GetIntellect()
    }
    return 0;
}

BaseNPC.GetPrimaryAttribute = function () {
    const herobuff = GPropertyConfig.HERO_PROPERTY_BUFF_NAME;
    if (this.HasModifier(herobuff)) {
        return this.GetModifierStackCount(herobuff, this)
    }
    return Attributes.DOTA_ATTRIBUTE_INVALID
}

BaseNPC.GetStatusResistanceFactor = function (hCaster: CDOTA_BaseNPC) {
    let d: number = 1 - PropertyCalculate.GetStatusResistance(this) * 0.01;
    if (IsValid(hCaster)) {
        d = d * (1 + PropertyCalculate.GetStatusResistanceCaster(hCaster) * 0.01)
    }
    return d
}
BaseNPC.findBuffStack = function (buffname: string, caster: CDOTA_BaseNPC = null) {
    return this.GetModifierStackCount(buffname, caster)
}

BaseNPC.IsChilled = function () {
    return this.HasModifier("modifier_generic_chill");
}

BaseNPC.IsFreeze = function () {
    return this.HasModifier("modifier_generic_frozen");
}

BaseNPC.IsDazed = function () {
    return this.HasModifier("modifier_generic_daze");
}

BaseNPC.IsSleeped = function () {
    return this.HasModifier("modifier_generic_sleep");
}

BaseNPC.GetAttackRangePlus = function () {
    return this.Script_GetAttackRange();
}


if (IsServer()) {

    BaseNPC.UpdateOnRemove = function () {
        if (this.__safedestroyed__) { return }
        this.ClearSelf();
    }
    BaseNPC.GetOwnerPlus = function () {
        return this.GetOwner() as IBaseNpc_Plus;
    }

    BaseNPC.GetKVData = function (key: string, defaultValue: any = "") {
        return KVHelper.KvUnits[this.GetUnitName()][key] || defaultValue;
    }

    BaseNPC.SetPrimaryAttribute = function (iPrimaryAttribute: Attributes) {
        if (iPrimaryAttribute > Attributes.DOTA_ATTRIBUTE_INVALID && iPrimaryAttribute < Attributes.DOTA_ATTRIBUTE_MAX) {
            const herobuff = GPropertyConfig.HERO_PROPERTY_BUFF_NAME;
            const buff = this.findBuff(herobuff, this) as Imodifier_hero_property;
            if (buff) {
                buff.SetPrimaryStat(iPrimaryAttribute)
            }
        }
    }
    BaseNPC.ModifyMaxHealth = function (fChanged: number) {
        if (IsValid(this)) {
            PropertyCalculate.SetUnitCache(this, "StatusHealth", PropertyCalculate.GetUnitCache(this, "StatusHealth") + fChanged)
        }
    }
    BaseNPC.addAbilityPlus = function (abilityname: string, level: number = 1) {
        let ability = this.AddAbility(abilityname);
        if (ability) {
            ability.SetActivated(true);
            ability.SetLevel(level);
        } else {
            GLogHelper.error("addAbilityPlus ERROR ", abilityname, level)
        }
        return ability as IBaseAbility_Plus;
    };
    BaseNPC.findAbliityPlus = function (abilityname: string) {
        let ability = this.FindAbilityByName(abilityname);
        return ability as IBaseAbility_Plus;
    };
    BaseNPC.removeAbilityPlus = function (abilityname: string) {
        let ability = this.FindAbilityByName(abilityname) as IBaseAbility_Plus;
        if (ability) {
            GFuncEntity.SafeDestroyAbility(ability);
            this.RemoveAbility(abilityname);
        } else {
            GLogHelper.error("removeAbilityPlus ERROR ", abilityname)
        }
    }
    BaseNPC.addBuff = function (buffname: string, caster?: IBaseNpc_Plus, ability?: IBaseAbility_Plus, modifierTable?: IModifierTable) {
        if (IsServer()) {
            let m = this.AddNewModifier(caster, ability, buffname, modifierTable);
            return m;
        }
    }
    BaseNPC.addOnlyBuff = function (buffname: string, caster?: IBaseNpc_Plus, ability?: IBaseAbility_Plus, modifierTable?: IModifierTable) {
        if (IsServer()) {
            if (this.HasModifier(buffname)) {
                return this.findBuff(buffname, caster);
            } else {
                return this.addBuff(buffname, caster, ability, modifierTable);
            }
        }
    }
    BaseNPC.removeBuff = function (buffname: string, caster?: CDOTA_BaseNPC) {
        if (IsServer()) {
            if (caster) {
                let modef = this.findBuff(buffname, caster);
                if (modef) {
                    modef.Destroy();
                }
            } else {
                let modef = this.findBuff(buffname);
                if (modef) {
                    modef.Destroy();
                }
            }
        }
    }


    BaseNPC.SetUnitOnClearGround = function () {
        GTimerHelper.AddTimer(1, GHandler.create(this, () => {
            let pos = this.GetAbsOrigin();
            this.SetAbsOrigin(Vector(pos.x, pos.y, GetGroundPosition(pos, this).z));
            FindClearSpaceForUnit(this, this.GetAbsOrigin(), true);
            ResolveNPCPositions(this.GetAbsOrigin(), 64);
        }));
    }
    BaseNPC.ApplyCharm = function (hAbility: IBaseAbility_Plus, hCaster: IBaseNpc_Plus, duration: number) {
        return this.AddNewModifier(hCaster, hAbility, "modifier_generic_charm", { duration: duration });
    }
    BaseNPC.ApplyHeal = function (amount: number, inflictor: CDOTABaseAbility) {
        this.Heal(amount, inflictor);
        let healer = null;
        if (inflictor) {
            healer = inflictor.GetCasterPlus();
        }
        SendOverheadEventMessage(this.GetPlayerOwner(), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, this, amount, healer as any);
        Gmodifier_event.FireEvent({
            attacker: this,
            abiity: inflictor,
            target: healer,
            eventType: 1 + 4,
        }, GEMODIFIER_EVENT.ON_HEAL_TYPE_LIFESTEAL)
    }
    BaseNPC.Lifesteal = function (source: IBaseAbility_Plus, lifestealPct: number, damage: number, target: IBaseNpc_Plus, damage_type: DAMAGE_TYPES = null, iSource = DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK, bParticles = true) {
        let damageDealt = damage || 0;
        let sourceType = iSource;
        let particles = true;
        if (bParticles == false) {
            particles = false;
        }
        if (sourceType == DamageCategory_t.DOTA_DAMAGE_CATEGORY_SPELL && source) {
            damageDealt = source.DealDamage(this, target, damage, {
                damage_type: damage_type
            });
        } else if (sourceType == DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK) {
            let oldHP = target.GetHealth();
            this.PerformAttack(target, true, true, true, true, false, false, false);
            damageDealt = math.abs(oldHP - target.GetHealth());
        }
        if (particles) {
            if (sourceType == DamageCategory_t.DOTA_DAMAGE_CATEGORY_SPELL) {
                let p = ResHelper.CreateParticleEx("particles/items3_fx/octarine_core_lifesteal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this);
                ParticleManager.ReleaseParticleIndex(p);
            } else {
                let lifesteal = ResHelper.CreateParticleEx("particles/units/heroes/hero_skeletonking/wraith_king_vampiric_aura_lifesteal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this);
                ParticleManager.SetParticleControlEnt(lifesteal, 0, this, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(lifesteal, 1, this, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(lifesteal);
            }
        }
        let flHeal = damageDealt * lifestealPct / 100;
        this.ApplyHeal(flHeal, source);
        return flHeal;
    }
    BaseNPC.ApplyFear = function (hAbility: IBaseAbility_Plus, hCaster: IBaseNpc_Plus, duraiton: number) {
        return this.AddNewModifier(hCaster, hAbility, "modifier_generic_fear", {
            duration: duraiton
        }) as IBaseModifier_Plus;
    }
    BaseNPC.ApplyKnockBack = function (hAbility: IBaseAbility_Plus, hCaster: IBaseNpc_Plus, kv: {
        distance?: number,
        height?: number,
        duration?: number,
        direction_x?: number,
        direction_y?: number,
        tree_destroy_radius?: number,
        IsStun?: boolean,
        IsFlail?: boolean,
    }) {
        return this.AddNewModifier(hCaster, hAbility, "modifier_generic_knockback", kv) as IBaseModifier_Plus;
        ;
    }
    BaseNPC.ApplyStunned = function (hAbility: IBaseAbility_Plus, hCaster: IBaseNpc_Plus, stunDuration: number) {
        return this.AddNewModifier(hCaster, hAbility, "modifier_generic_stunned", {
            duration: stunDuration
        }) as IBaseModifier_Plus;
        ;
    }
    BaseNPC.ApplyDaze = function (hAbility: IBaseAbility_Plus, hCaster: IBaseNpc_Plus, dazeDuration: number) {
        return this.AddNewModifier(hCaster, hAbility, "modifier_generic_daze", {
            duration: dazeDuration
        }) as IBaseModifier_Plus;
        ;
    }
    BaseNPC.ApplyFreeze = function (hAbility: IBaseAbility_Plus, hCaster: IBaseNpc_Plus, duration: number) {
        this.RemoveModifierByName("modifier_generic_chill")
        return this.AddNewModifier(hCaster, hAbility, "modifier_generic_frozen", { duration: duration }) as IBaseModifier_Plus;
    }
    BaseNPC.ApplyChilled = function (hAbility: IBaseAbility_Plus, hCaster: IBaseNpc_Plus, duration: number) {
        return this.AddNewModifier(hCaster, hAbility, "modifier_generic_chill", { duration: duration }) as IBaseModifier_Plus;
        ;
    }

    BaseNPC.RemoveChilled = function () {
        if (this.IsChilled()) {
            return this.RemoveModifierByName("modifier_generic_chill");
        }
    }
}


//#endregion BaseNPC

export class BaseClassExt {
    static Init(): void {

    }
}