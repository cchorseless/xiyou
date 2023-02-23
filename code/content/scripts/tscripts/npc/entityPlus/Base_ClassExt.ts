/** @noSelfInFile */

import { GameFunc } from "../../GameFunc";
import { AoiHelper } from "../../helper/AoiHelper";
import { KVHelper } from "../../helper/KVHelper";
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
    fPercent = GameFunc.mathUtil.Clamp(fPercent, 0, 1);
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
    interface CDOTABaseAbility {
        /**默认值 */
        __DefaultSpecialValue__: { [k: string]: number | number[] };
        /**是否销毁 */
        __safedestroyed__: boolean;

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
        /**
         * 获取技能等级键值
         * @param sKey 键名
         * @param iLevel 等级，-1为取当前等级，1级填值为0
         * @param bAbilityUpgrade 是否为计算技能升级，不填默认为true
         * @param bAdded 是否计算附加值，不填默认为true
         * @param hUnit 附加值函数计算者，不填默认为技能拥有者
         * @returns 值
         */
        GetLevelSpecialValue(sKey: string, iLevel: number, bAbilityUpgrade?: boolean, bAdded?: boolean, hUnit?: CDOTA_BaseNPC): number;
        /**
         * 获取技能等级键附加值
         * @param sKey 键名
         * @param iLevel 等级，-1为取当前等级，1级填值为0
         * @param sAddedKey 键附加值名
         * @param bAbilityUpgrade 是否为计算技能升级，不填默认为true
         * @returns 值
         */
        GetLevelSpecialAddedValue(sKey: string, iLevel: number, sAddedKey: string, bAbilityUpgrade?: boolean): string | number | undefined;


        SetDefaultSpecialValue(sKey: string, v: any): void;
        /**
         * 获取技能当前等级键值
         * @param sKey 键名
         * @param bAbilityUpgrade 是否为计算技能升级，不填默认为true
         * @param bAdded 是否计算附加值，不填默认为true
         * @param hUnit 附加值函数计算者，不填默认为技能拥有者
         * @returns 值
         */
        GetSpecialValue(sKey: string, bAbilityUpgrade?: boolean, bAdded?: boolean, hUnit?: CDOTA_BaseNPC): number;
        /**
         * 获取技能当前等级键附加值
         * @param sKey 键名
         * @param sAddedKey 键附加值名
         * @param bAbilityUpgrade 是否为计算技能升级，不填默认为true
         * @returns 值
         */
        GetSpecialAddedValue(sKey: string, sAddedKey: string, bAbilityUpgrade?: boolean): string | number | undefined;

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
        HasTalent(sTalent: string): boolean;
        /**
         * 获取天赋数值
         * @param sKey 键名
         * @returns 值
         */
        GetTalentValue(sTalent: string, sKey: string): number;
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
    }
    else if (this.__DefaultSpecialValue__ && this.__DefaultSpecialValue__[s] && this.__DefaultSpecialValue__[s] != 0) {
        let data = this.__DefaultSpecialValue__[s];
        if (type(data) == 'number') {
            return data as number
        }
        else {
            let level = this.GetLevel();
            return (data as number[])[level - 1] as number
        }
    }
    else {
        return default_V
    }
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
// CBaseAbility.GetLevelSpecialValueFor = function (sKey: string, iLevel: number) {
//     if (!IsValid(this)) return 0;
//     return this.GetLevelSpecialValue(sKey, iLevel);
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

// if (CBaseAbility.GetSpecialValueFor_Engine == undefined) {
//     CBaseAbility.GetSpecialValueFor_Engine = CBaseAbility.GetSpecialValueFor;
// }
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
// CBaseAbility.GetSpecialValueFor = function (sKey: string) {
//     if (!IsValid(this)) return 0;
//     return this.GetSpecialValue(sKey);
// };
// CBaseAbility.GetSpecialAddedValue = function (sKey: string, sAddedKey: string, bAbilityUpgrade: boolean = true) {
//     return this.GetLevelSpecialAddedValue(sKey, this.GetLevel() - 1, sAddedKey, bAbilityUpgrade);
// };

// CBaseAbility.HasTalent = function (sTalent: string) {
//     if (!IsValid(this)) return false;
//     const hCaster = this.GetCaster();
//     const hTalent = hCaster?.FindAbilityByName(sTalent);
//     if (!IsValid(hTalent) || hTalent.GetLevel() == 0) {
//         return false;
//     }
//     return true;
// };
// CBaseAbility.GetTalentValue = function (sTalent: string, sKey: string) {
//     if (!IsValid(this)) return 0;
//     const hCaster = this.GetCaster();
//     const hTalent = hCaster?.FindAbilityByName(sTalent);
//     if (!IsValid(hTalent) || hTalent.GetLevel() == 0) {
//         return 0;
//     }
//     return hTalent.GetSpecialValueFor(sKey);
// };
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
        return this.GetOwner() as IBaseNpc_Plus
    }
    CBaseAbility.IsAbilityReady = function () {
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

        if (!this.IsOwnersGoldEnough(hCaster.GetPlayerOwnerID())) {
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
    CBaseAbility.AutoSpellSelf = function () { return true; }
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
        __destroyed: boolean;
        /**是否被销毁
         * @Both
         */
        IsNull(): boolean;
        /**获取施法技能 
         * @Both
         * 
        */
        GetAbilityPlus<T extends IBaseAbility_Plus>(): T;
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
    return this.__destroyed;
}
CDOTA_Buff.GetAbilityPlus = function () {
    return this.GetAbility() as IBaseAbility_Plus;
}

CDOTA_Buff.GetCasterPlus = function () {
    return this.GetCaster() as IBaseNpc_Plus;
}

CDOTA_Buff.GetParentPlus = function () {
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
         * 是否是真实单位
         * @Both
         */
        IsRealUnit(): boolean;

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
        addAbilityPlus(abilityname: string, level?: number): IBaseAbility_Plus;

        /**
         * @BOTH
         * @param abilityname 
         */
        findAbliityPlus<T extends CDOTABaseAbility>(abilityname: string): T | null;
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
         * @Server
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

    }
}

const BaseNPC = IsServer() ? CDOTA_BaseNPC : C_DOTA_BaseNPC;
BaseNPC.IsFriendly = function (hTarget: CDOTA_BaseNPC) {
    if (IsValid(this) && IsValid(hTarget)) {
        return this.GetTeamNumber() == hTarget.GetTeamNumber();
    }
    return false;
};

BaseNPC.HasTalent = function (sTalentName: string): IBaseAbility_Plus {
    if (this == null) return;
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
    let hTalent = this.HasTalent(sTalentName);
    if (hTalent) {
        return hTalent.GetSpecialValueFor(sSpecialName);
    }
    return default_V;
}

BaseNPC.IsRealUnit = function () {
    return !(this.IsIllusion() || this.IsSummoned());
}

BaseNPC.GetIntellect = function () {
    return PropertyCalculate.GetIntellect(this)
}

BaseNPC.GetStrength = function () {
    return PropertyCalculate.GetStrength(this)
}

BaseNPC.GetAgility = function () {
    return PropertyCalculate.GetAgility(this)
}

BaseNPC.GetAllStats = function () {
    return this.GetIntellect() + this.GetStrength() + this.GetAgility();
}

BaseNPC.GetPrimaryStatValue = function () {
    const Primary = this.GetPrimaryAttribute();
    if (Primary == Attributes.DOTA_ATTRIBUTE_AGILITY) {
        return this.GetAgility()
    }
    else if (Primary == Attributes.DOTA_ATTRIBUTE_STRENGTH) {
        return this.GetStrength()
    }
    else if (Primary == Attributes.DOTA_ATTRIBUTE_INTELLECT) {
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
if (IsServer()) {
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
        }
        else {
            GLogHelper.error("addAbilityPlus ERROR ", abilityname, level)
        }
        return ability as IBaseAbility_Plus;
    };
    BaseNPC.findAbliityPlus = function (abilityname: string) {
        let ability = this.FindAbilityByName(abilityname);
        return ability;
    };
    BaseNPC.removeAbilityPlus = function (abilityname: string) {
        let ability = this.FindAbilityByName(abilityname) as IBaseAbility_Plus;
        if (ability) {
            GDestroyAbility(ability);
            this.RemoveAbility(abilityname);
        }
        else {
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
    BaseNPC.findBuff = function (buffname: string, caster: CDOTA_BaseNPC = null) {
        if (buffname && this.HasModifier(buffname)) {
            if (caster) {
                return this.FindModifierByNameAndCaster(buffname, caster);
            }
            return this.FindModifierByName(buffname);
        }
    }
}


//#endregion BaseNPC

export class BaseClassExt {
    static Init(): void {

    }
}