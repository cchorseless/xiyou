import { GameProtocol } from "../../../scripts/tscripts/shared/GameProtocol";
import { CSSHelper } from "../helper/CSSHelper";
import { FuncHelper } from "../helper/FuncHelper";
import { KVHelper } from "../helper/KVHelper";
import { NetHelper } from "../helper/NetHelper";

declare global {
    interface CScriptBindingPR_Abilities {
        IsBehaviorActive(iBehavior: DOTA_ABILITY_BEHAVIOR): boolean;
        GetCastTypeDes(iBehavior: DOTA_ABILITY_BEHAVIOR): string;
        GetTargetTypeDes(iTeam: DOTA_UNIT_TARGET_TEAM, iType: DOTA_UNIT_TARGET_TYPE): string;
        GetDamageTypeDes(iDamageType: DAMAGE_TYPES): string;
        GetSpellImmunityDes(iSpellImmunityType: SPELL_IMMUNITY_TYPES | string): string;
        GetDispelTypeDes(sSpellDispellableType: string): string;
        SDamageType2IDamageType(sDamageTypes: string): number;
        SBehavior2IBehavior(sBehaviors: string): number;
        STeam2ITeam(sTeams: string): number;
        SType2IType(sTypes: string): number;
        GetCustomAbilityType(sCustomAbilityType: string): string[];
        GetItemDispelTypeDes(sSpellDispellableType: string): string;
        GetSpecialValueUpgrade(iEntityIndex: EntityIndex | any, sAbilityName: string, sSpecialValueName: string, iOperator: AbilityUpgradeOperator): number;
        CalcSpecialValueUpgrade(iEntityIndex: number, sAbilityName: string, sSpecialValueName: string, fValue: number): number;
        AbilityDescriptionCompose(aValues: number[], iLevel?: number, bOnlyNowLevelValue?: boolean): [string, string]
        SimplifyValuesArray(aValues: number[]): number[];
        GetAbilityOrBuffDescription(sStr: string, abilityName: string, iLevel?: number, bOnlyNowLevelValue?: boolean): string;
        GetAbilityDescriptionByName(sAbilityName: string): string;
        StringToValues(sValues: string): number[];
        GetAllSpecialValues(sAbilityName: string): { [key: string]: number[] };
        GetSpecialValues(sAbilityName: string, sName: string, EntityIndex?: EntityIndex): number[]
        GetSpecialNames(sAbilityName: string, iEntityIndex?: EntityIndex): string[]
        GetSpecialNameData(sAbilityName: string, sName: string): { var_type: "FIELD_INTEGER" | "FIELD_FLOAT", [k: string]: string };
        GetSpecialVarType(sAbilityName: string, sName: string): "FIELD_INTEGER" | "FIELD_FLOAT";
        GetSpecialValueWithTag(sAbilityName: string, sName: string, tagname: AbilitySpecialValueTag | string, iEntityIndex?: EntityIndex): string;
        GetSpecialValuePropertyUpgrade(iEntityIndex: EntityIndex, sAbilityName: string, sSpecialValueName: string, sSpecialValueProperty: string, iOperator: AbilityUpgradeOperator): number;
        CalcSpecialValuePropertyUpgrade(iEntityIndex: EntityIndex, sAbilityName: string, sSpecialValueName: string, sSpecialValueProperty: string, fValue: number): number;
        GetSpecialValuesWithCalculated(sAbilityName: string, sName: string, iEntityIndex?: EntityIndex): {
            aValues: number[],
            aOriginalValues: number[],
            aMinValues: number[],
            aMaxValues: number[],
            tAddedFactors: { [key: string]: number[] },
            tAddedValues: { [key: string]: number[] },
        };
        ReplaceAbilityValues(a: { sStr: string, bShowExtra: boolean, sAbilityName: string, iLevel: number, iEntityIndex?: EntityIndex, bIsDescription?: boolean, bOnlyNowLevelValue?: boolean }): string;
        ReplaceAbilityValuesDes(a: { sStr: string, sAbilityName: string, iLevel: number, iEntityIndex?: EntityIndex }): string;
        GetAbilitySpecialDes(sAbilityName: string, iLevel?: number, iEntityIndex?: EntityIndex | number): string[];
        GetAbilityData(iEntityIndex: AbilityEntityIndex, key: string, iLevel?: number): string;
        GetLevelCooldown(iEntityIndex: AbilityEntityIndex, iLevel?: number): number;
        GetLevelManaCost(iEntityIndex: AbilityEntityIndex, iLevel?: number): number;
        GetLevelGoldCost(iEntityIndex: AbilityEntityIndex, iLevel?: number): number;
        GetLevelWoodCost(iEntityIndex: AbilityEntityIndex, iLevel?: number): number;
        GetLevelSoulCrystal(iEntityIndex: AbilityEntityIndex, iLevel?: number): number;
        GetAbilityIndex(iEntityIndex: EntityIndex, iAbilityEntIndex: AbilityEntityIndex): number;
        /**
         * 获取技能名称
         * @param sAbilityName 
         */
        GetLocalizeAbilityName(sAbilityName: string): string;
        /**获取技能稀有度 */
        GetAbilityRarity(sAbilityName: string): IRarity;
        GetAbilityRarityNumber(sAbilityName: string): IRarityNumber;
        /**获取技能颜色 */
        GetAbilityColor(sAbilityName: string): string;
        /**获取技能进度相关 */
        GetAbilityJinDuInfo(sAbilityName: string | AbilityEntityIndex): { min: number, max: number, now: number } | undefined;

    }

}
enum AbilityUpgradeOperator {
    ABILITY_UPGRADES_OP_ADD = 0,
    ABILITY_UPGRADES_OP_MUL = 1
}

enum AbilityUpgradeType {
    ABILITY_UPGRADES_TYPE_SPECIAL_VALUE = 0,
    ABILITY_UPGRADES_TYPE_SPECIAL_VALUE_PROPERTY = 1,
    ABILITY_UPGRADES_TYPE_STATS,
    ABILITY_UPGRADES_TYPE_ABILITY_MECHANICS,
    ABILITY_UPGRADES_TYPE_ADD_ABILITY
}
enum AbilityUpgradeKeyType {
    UPGRADES_KEY_DATA = 0,
    UPGRADES_KEY_CACHED_RESULT = 1
}

enum AbilitySpecialValueTag {
    var_type = "var_type",
    LinkedSpecialBonus = "LinkedSpecialBonus",
    LinkedSpecialBonusField = "LinkedSpecialBonusField",
    LinkedSpecialBonusOperation = "LinkedSpecialBonusOperation",
    /**神杖升级 */
    RequiresScepter = "RequiresScepter",
    /**最小值 */
    _min = "_min",
    _max = "_max",
    /** */
    CalculateSpellDamageTooltip = "CalculateSpellDamageTooltip",
}
const tAddedProperties = {
    _str: "GetStrength",
    _agi: "GetAgility",
    _int: "GetIntellect",
    _all: "GetAllStats",
    _attack_damage: "GetAttackDamage",
    _attack_speed: "GetAttackSpeedPercent",
    _health: "GetCustomMaxHealth",
    _mana: "GetMaxMana",
    _armor: "GetArmor",
    _magical_armor: "GetMagicalArmor",
    _move_speed: "GetMoveSpeed",
    _ulti: "GetUltiPower",
};
Abilities.IsBehaviorActive = function (iBehavior: DOTA_ABILITY_BEHAVIOR) {
    if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE) {
        return true;
    }
    if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET) {
        return true;
    }
    if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT) {
        return true;
    }
    if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) {
        return true;
    }
    return false;
}

Abilities.GetCastTypeDes = function (iBehavior: DOTA_ABILITY_BEHAVIOR) {
    // "DOTA_ToolTip_Ability_NoTarget" "无目标"
    // "DOTA_ToolTip_Ability_Passive" "被动"
    // "DOTA_ToolTip_Ability_Channeled" "持续施法"
    // "DOTA_ToolTip_Ability_AutoCast" "自动施放"
    // "DOTA_ToolTip_Ability_Aura" "光环"
    // "DOTA_ToolTip_Ability_Toggle" "切换"
    // "DOTA_ToolTip_Ability_Target" "单位目标"
    // "DOTA_ToolTip_Ability_Point" "点目标"
    // "DOTA_ToolTip_Ability_UnitOrPoint_Target" "点目标"

    if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AURA) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AURA) {
        return "DOTA_ToolTip_Ability_Aura";
    }
    if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST) {
        return "DOTA_ToolTip_Ability_AutoCast";
    }
    if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE) {
        return "DOTA_ToolTip_Ability_Passive";
    }
    if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE) {
        return "DOTA_ToolTip_Ability_Toggle";
    }
    if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_CHANNELLED) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_CHANNELLED) {
        return "DOTA_ToolTip_Ability_Channeled";
    }
    if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET) {
        return "DOTA_ToolTip_Ability_NoTarget";
    }
    if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) {
        return "DOTA_ToolTip_Ability_UnitOrPoint_Target";
    }
    if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT) {
        return "DOTA_ToolTip_Ability_Point";
    }
    if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) {
        return "DOTA_ToolTip_Ability_Target";
    }
    return "";
}

Abilities.GetTargetTypeDes = function (iTeam: DOTA_UNIT_TARGET_TEAM, iType: DOTA_UNIT_TARGET_TYPE) {
    if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_TREE) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_TREE) {
        return "DOTA_ToolTip_Targeting_Trees";
    }
    if (iTeam == DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY) {
        if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING) {
            return "DOTA_ToolTip_Targeting_AlliedUnitsAndBuildings";
        }
        if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING) {
            return "DOTA_ToolTip_Targeting_AlliedHeroesAndBuildings";
        }
        if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO) {
            return "DOTA_ToolTip_Targeting_AlliedUnits";
        }
        if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO) {
            return "DOTA_ToolTip_Targeting_AlliedHeroes";
        }
        if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP) {
            return "DOTA_ToolTip_Targeting_AlliedCreeps";
        }
        return "DOTA_ToolTip_Targeting_Allies";
    }
    if (iTeam == DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY) {
        if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING) {
            return "DOTA_ToolTip_Targeting_EnemyUnitsAndBuildings";
        }
        if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING) {
            return "DOTA_ToolTip_Targeting_EnemyHeroesAndBuildings";
        }
        if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO) {
            return "DOTA_ToolTip_Targeting_EnemyUnits";
        }
        if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO) {
            return "DOTA_ToolTip_Targeting_EnemyHero";
        }
        if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP) {
            return "DOTA_ToolTip_Targeting_EnemyCreeps";
        }
        return "DOTA_ToolTip_Targeting_Enemy";
    }
    if (iTeam == DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH) {
        if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO) {
            return "DOTA_Tooltip_Targeting_All_Heroes";
        }
        return "DOTA_ToolTip_Targeting_Units";
    }
    return "";
}

Abilities.GetDamageTypeDes = function (iDamageType: DAMAGE_TYPES) {
    if (iDamageType == DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL) {
        return "DOTA_ToolTip_Damage_Physical";
    }
    if (iDamageType == DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) {
        return "DOTA_ToolTip_Damage_Magical";
    }
    if (iDamageType == DAMAGE_TYPES.DAMAGE_TYPE_PURE) {
        return "DOTA_ToolTip_Damage_Pure";
    }
    return "";
}

Abilities.GetSpellImmunityDes = function (iSpellImmunityType: SPELL_IMMUNITY_TYPES | string) {
    if (iSpellImmunityType == SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ALLIES_YES || iSpellImmunityType == "SPELL_IMMUNITY_ALLIES_YES") {
        return "DOTA_ToolTip_PiercesSpellImmunity_Yes";
    }
    if (iSpellImmunityType == SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ALLIES_NO || iSpellImmunityType == "SPELL_IMMUNITY_ALLIES_NO") {
        return "DOTA_ToolTip_PiercesSpellImmunity_No";
    }
    if (iSpellImmunityType == SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ENEMIES_YES || iSpellImmunityType == "SPELL_IMMUNITY_ENEMIES_YES") {
        return "DOTA_ToolTip_PiercesSpellImmunity_Yes";
    }
    if (iSpellImmunityType == SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ENEMIES_NO || iSpellImmunityType == "SPELL_IMMUNITY_ENEMIES_NO") {
        return "DOTA_ToolTip_PiercesSpellImmunity_No";
    }
    if (iSpellImmunityType == SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ALLIES_YES_ENEMIES_NO || iSpellImmunityType == "SPELL_IMMUNITY_ALLIES_YES_ENEMIES_NO") {
        return "DOTA_ToolTip_PiercesSpellImmunity_AlliesYesEnemiesNo";
    }
    return "";
}
Abilities.GetDispelTypeDes = function (sSpellDispellableType: string) {
    if (sSpellDispellableType == "SPELL_DISPELLABLE_YES") {
        return "DOTA_ToolTip_Dispellable_Yes_Soft";
    }
    if (sSpellDispellableType == "SPELL_DISPELLABLE_NO") {
        return "DOTA_ToolTip_Dispellable_No";
    }
    if (sSpellDispellableType == "SPELL_DISPELLABLE_YES_STRONG") {
        return "DOTA_ToolTip_Dispellable_Yes_Strong";
    }
    return "";
}
Abilities.SDamageType2IDamageType = function (sDamageTypes: string) {
    sDamageTypes = sDamageTypes.replace(/\s/g, "");
    let aDamageTypes = sDamageTypes.split(/\|/g);
    let iDamageTypes = 0;
    for (let sDamageType of aDamageTypes) {
        let iDamageType = parseInt((DAMAGE_TYPES as any)[sDamageType]);
        if (iDamageType) {
            iDamageTypes = iDamageTypes + iDamageType;
        }
    }
    return iDamageTypes || 0;
}
Abilities.SBehavior2IBehavior = function (sBehaviors: string) {
    sBehaviors = sBehaviors.replace(/\s/g, "");
    let aBehaviors = sBehaviors.split(/\|/g);
    let iBehaviors = 0;
    for (const sBehavior of aBehaviors) {
        let iBehavior = parseInt((DOTA_ABILITY_BEHAVIOR as any)[sBehavior]);
        if (iBehavior) {
            iBehaviors = iBehaviors + iBehavior;
        }
    }
    return iBehaviors;
}

Abilities.STeam2ITeam = function (sTeams: string) {
    sTeams = sTeams.replace(/\s/g, "");
    let aTeams = sTeams.split(/\|/g);
    let iTeams = 0;
    for (const sTeam of aTeams) {
        let iTeam = parseInt((DOTA_UNIT_TARGET_TEAM as any)[sTeam]);
        if (iTeam) {
            iTeams = iTeams + iTeam;
        }
    }
    return iTeams || 0;
}

Abilities.SType2IType = function (sTypes: string) {
    sTypes = sTypes.replace(/\s/g, "");
    let aTypes = sTypes.split(/\|/g);
    let iTypes = 0;
    for (const sType of aTypes) {
        let iType = parseInt((DOTA_UNIT_TARGET_TYPE as any)[sType]);
        if (iType) {
            iTypes = iTypes + iType;
        }
    }
    return iTypes;
}

Abilities.GetCustomAbilityType = function (sCustomAbilityType: string) {
    let result: string[] = [];
    let CustomAbilityType: { [key: string]: string; } = {
        CUSTOM_TYPE_SURROUND: "Surround",
        CUSTOM_TYPE_SPLIT: "Split",
        CUSTOM_TYPE_POISON: "Poison",
        CUSTOM_TYPE_IGNITE: "Ignite",
        CUSTOM_TYPE_STUN: "Stun",
        CUSTOM_TYPE_ENERGY_STRIKE: "EnergyStrike",
        CUSTOM_TYPE_MAGIC_PROJECTILE: "MagicProjectile",
    };
    if (sCustomAbilityType != "") {
        let types = sCustomAbilityType.split(",");

        for (let index = 0; index < types.length; index++) {
            const element = types[index];
            result.push(CustomAbilityType[element]);
        }
    }
    return result;
}

Abilities.GetItemDispelTypeDes = function (sSpellDispellableType: string) {
    if (sSpellDispellableType == "SPELL_DISPELLABLE_YES") {
        return "DOTA_ToolTip_Dispellable_Item_Yes_Soft";
    }
    if (sSpellDispellableType == "SPELL_DISPELLABLE_YES_STRONG") {
        return "DOTA_ToolTip_Dispellable_Item_Yes_Strong";
    }
    return "";
}

Abilities.GetSpecialValueUpgrade = function (iEntityIndex: EntityIndex | any, sAbilityName: string, sSpecialValueName: string, iOperator: AbilityUpgradeOperator) {
    // if (!Entities.IsValidEntity(iEntityIndex)) return 0;
    // let t = CustomNetTables.GetTableValue("ability_upgrades_result", iEntityIndex.toString());
    // if (!t || typeof (t.json) != "string") return 0;
    // let tCachedResult = JSON.parse(t.json);
    // if (!tCachedResult) return 0;
    // let tAllSpecialValueCachedResult = tCachedResult[AbilityUpgradeType.ABILITY_UPGRADES_TYPE_SPECIAL_VALUE];
    // if (typeof (tAllSpecialValueCachedResult) != "object" || typeof (tAllSpecialValueCachedResult[sAbilityName]) != "object" || typeof (tAllSpecialValueCachedResult[sAbilityName][sSpecialValueName]) != "object") return 0;
    // return tAllSpecialValueCachedResult[sAbilityName][sSpecialValueName][iOperator] || 0;
    return 0
}

Abilities.CalcSpecialValueUpgrade = function (iEntityIndex: number, sAbilityName: string, sSpecialValueName: string, fValue: number) {
    return fValue;
    // return FuncHelper.ToFloat((fValue + GetSpecialValueUpgrade(iEntityIndex, sAbilityName, sSpecialValueName, AbilityUpgradeOperator.ABILITY_UPGRADES_OP_ADD)) * (1 + GetSpecialValueUpgrade(iEntityIndex, sAbilityName, sSpecialValueName, AbilityUpgradeOperator.ABILITY_UPGRADES_OP_MUL) * 0.01));
}
/**
 * 优化显示能力描述
 * @param aValues 
 * @param iLevel 
 * @param bOnlyNowLevelValue 是否只显示当前等级的值
 * @returns 
 */
Abilities.AbilityDescriptionCompose = function (aValues: number[], iLevel: number = -1, bOnlyNowLevelValue: boolean = false) {
    let sTemp = "";
    let sTempPS = "";
    if (iLevel != -1 && bOnlyNowLevelValue && aValues.length > 0) {
        let value = aValues[FuncHelper.Clamp(iLevel, 0, aValues.length - 1)];
        let sValue = (value > 0 ? "+" : "-") + FuncHelper.BigNumber.FormatNumber((Math.abs(value)));
        let sValuePS = sValue + "%";
        sTemp = "<span class='GameplayVariable GameplayVariable'>" + sValue + "</span>";
        sTempPS = "<span class='GameplayVariable GameplayVariable'>" + sValuePS + "</span>";
    }
    else {
        for (let level = 0; level < aValues.length; level++) {
            const value = aValues[level];
            if (sTemp != "") {
                sTemp = sTemp + " / ";
                sTempPS = sTempPS + " / ";
            }
            let sValue = (value > 0 ? "+" : "-") + FuncHelper.BigNumber.FormatNumber((Math.abs(value)));
            let sValuePS = sValue + "%";
            if (iLevel != -1 && (level + 1 == Math.min(iLevel, aValues.length))) {
                sValue = "<span class='GameplayVariable'>" + sValue + "</span>";
                sValuePS = "<span class='GameplayVariable'>" + sValuePS + "</span>";
            }
            sTemp = sTemp + sValue;
            sTempPS = sTempPS + sValuePS;
        }
    }
    if (iLevel == -1) {
        sTemp = "<span class='GameplayValues GameplayVariable'>" + sTemp + "</span>";
        sTempPS = "<span class='GameplayValues GameplayVariable'>" + sTempPS + "</span>";
    } else {
        sTemp = "<span class='GameplayValues'>" + sTemp + "</span>";
        sTempPS = "<span class='GameplayValues'>" + sTempPS + "</span>";
    }
    return [sTemp, sTempPS];
}

/**
 * 特殊值处理
 * @param aValues 
 * @returns 
 */
Abilities.SimplifyValuesArray = function (aValues: number[]) {
    if (aValues && aValues.length > 1) {
        let a = aValues[0];
        for (let i = 1; i < aValues.length; i++) {
            const value = aValues[i];
            if (a != value) {
                return aValues;
            }
        }
        return [a];
    }
    return aValues;
}
/**
 * 
 * @param sStr 技能或者Buff描述文本
 * @param abilityName 技能名称
 * @param iLevel 
 * @param bOnlyNowLevelValue 只显示当前等级的值
 * @returns 
 */
Abilities.GetAbilityOrBuffDescription = function (sStr: string, abilityName: string, iLevel = -1, bOnlyNowLevelValue: boolean = false) {
    let [isitem, tData] = KVHelper.GetAbilityOrItemData(abilityName);
    if (!tData) { return sStr; }
    let SpecialValues = Abilities.GetAllSpecialValues(abilityName);
    let aValueNames = Object.keys(SpecialValues);
    for (let index = 0; index < aValueNames.length; index++) {
        const sValueName = aValueNames[index];
        let block = new RegExp("%" + sValueName + "%", "g");
        let blockPS = new RegExp("%" + sValueName + "%%", "g");
        let iResult = sStr.search(block);
        let iResultPS = sStr.search(blockPS);
        if (iResult == -1 && iResultPS == -1) continue;
        let aValues = SpecialValues[sValueName];
        let [sValues, sValuesPS] = Abilities.AbilityDescriptionCompose(aValues, iLevel, bOnlyNowLevelValue);
        sStr = sStr.replace(blockPS, sValuesPS);
        sStr = sStr.replace(block, sValues);
    }
    return sStr;
}

/**
 * 获取技能的描述文本
 * @param sAbilityName 
 * @returns 
 */
Abilities.GetAbilityDescriptionByName = function (sAbilityName: string) {
    const str = $.Localize("#DOTA_Tooltip_ability_" + sAbilityName + "_Description");
    return Abilities.GetAbilityOrBuffDescription(str, sAbilityName);
}

Abilities.StringToValues = function (sValues: string) {
    let aStr = sValues.toString().split(" ");
    let aValues = [];
    for (let i = 0; i < aStr.length; i++) {
        let n = Number(aStr[i]);
        if (isFinite(n)) {
            aValues.push(n);
        }
    }
    return Abilities.SimplifyValuesArray(aValues);
}
/**
 * 获取技能的所有特殊值
 * @param sAbilityName 
 * @returns 
 */
Abilities.GetAllSpecialValues = function (sAbilityName: string) {
    let [isitem, tKeyValues] = KVHelper.GetAbilityOrItemData(sAbilityName);
    let r: { [k: string]: number[] } = {};
    if (tKeyValues) {
        let tSpecials = tKeyValues.AbilitySpecial;
        if (tSpecials) {
            for (let sIndex in tSpecials) {
                let tData = tSpecials[sIndex];
                let sType = tData.var_type;
                for (let sName in tData) {
                    if (sName[0] != "_" && tData[sName] != null && (AbilitySpecialValueTag as any)[sName] == null) {
                        let sValues = tData[sName] + "";
                        let aValues = sValues.split(" ").map((v) => GToNumber(v));
                        for (let i = 0; i < aValues.length; i++) {
                            let value = aValues[i];
                            if (sType == "FIELD_INTEGER") {
                                aValues[i] = parseInt(value + "");
                            } else if (sType == "FIELD_FLOAT") {
                                aValues[i] = parseFloat(value.toFixed(6));
                            }
                        }
                        r[sName] = Abilities.SimplifyValuesArray(aValues);
                    }
                }

            }
        }
    }
    return r;
}

/**
 * 获取技能的特殊值
 * @param sAbilityName 
 * @param sName 
 * @returns 
 */
Abilities.GetSpecialValues = function (sAbilityName: string, sName: string, EntityIndex = -1 as EntityIndex) {
    let r = Abilities.GetAllSpecialValues(sAbilityName);
    if (r[sName]) {
        return r[sName];
    }
    return [];
}


/**
 * 获取技能的特殊值Key
 */
Abilities.GetSpecialNames = function (sAbilityName: string, iEntityIndex = -1 as EntityIndex) {
    let aSpecials: string[] = Object.keys(Abilities.GetAllSpecialValues(sAbilityName));
    aSpecials = aSpecials.concat(
        "abilitycastrange",
        "abilitycastpoint",
        "abilityduration",
        "abilitychanneltime",
        "abilitydamage",
        "abilitycooldown");
    if (iEntityIndex != -1) {
        // let a = GetAbilityMechanicsUpgradeSpecialNames(iEntityIndex, sAbilityName);
        // for (let index = 0; index < a.length; index++) {
        //     const v = a[index];
        //     if (!FindKey(aSpecials, v)) {
        //         aSpecials.push(v);
        //     }
        // }
    }
    return aSpecials;
}
/**
 * 获取技能的特殊值Data
 * @param sAbilityName 
 * @param sName 
 * @returns 
 */
Abilities.GetSpecialNameData = function (sAbilityName: string, sName: string) {
    let [isitem, tKeyValues] = KVHelper.GetAbilityOrItemData(sAbilityName);
    if (tKeyValues) {
        let tSpecials = tKeyValues.AbilitySpecial;
        if (tSpecials) {
            for (let sIndex in tSpecials) {
                let tData = tSpecials[sIndex];
                if (tData[sName] != null) {
                    return tData as any
                }
            }
        }
    }
}

/**
 * 获取技能的特殊值数值类型
 * @param sAbilityName 
 * @param sName 
 * @returns 
 */
Abilities.GetSpecialVarType = function (sAbilityName: string, sName: string): "FIELD_INTEGER" | "FIELD_FLOAT" {
    let tData = Abilities.GetSpecialNameData(sAbilityName, sName);
    if (tData && tData[sName] != null && tData.var_type != null) {
        return tData.var_type;
    }
    return "FIELD_INTEGER";
}


/**
 * 获取特殊值
 * @param sAbilityName
 * @param sName
 * @param tagname
 * @param iEntityIndex
 * @returns
 */
Abilities.GetSpecialValueWithTag = function (sAbilityName: string, sName: string, tagname: AbilitySpecialValueTag | string, iEntityIndex = -1 as EntityIndex): string {
    let tData = Abilities.GetSpecialNameData(sAbilityName, sName);
    if (tData && tData[sName] != null && tData[tagname] != null) {
        return tData[tagname].toString();
    }
    return "";
}

Abilities.GetSpecialValuePropertyUpgrade = function (iEntityIndex: EntityIndex, sAbilityName: string, sSpecialValueName: string, sSpecialValueProperty: string, iOperator: AbilityUpgradeOperator) {
    if (!Entities.IsValidEntity(iEntityIndex)) return 0;
    // let t = CustomNetTables.GetTableValue("ability_upgrades_result", iEntityIndex.toString());
    // if (!t || typeof (t.json) != "string") return 0;

    // let tCachedResult = JSON.parse(t.json);
    // if (!tCachedResult) return 0;

    // let tAllSpecialValuePropertyCachedResult = tCachedResult[AbilityUpgradeType.ABILITY_UPGRADES_TYPE_SPECIAL_VALUE_PROPERTY];
    // if (typeof (tAllSpecialValuePropertyCachedResult) != "object" || typeof (tAllSpecialValuePropertyCachedResult[sAbilityName]) != "object" || typeof (tAllSpecialValuePropertyCachedResult[sAbilityName][sSpecialValueName]) != "object" || typeof (tAllSpecialValuePropertyCachedResult[sAbilityName][sSpecialValueName][sSpecialValueProperty]) != "object") return 0;

    // return tAllSpecialValuePropertyCachedResult[sAbilityName][sSpecialValueName][sSpecialValueProperty][iOperator] || 0;
    return 0
}

Abilities.CalcSpecialValuePropertyUpgrade = function (iEntityIndex: EntityIndex, sAbilityName: string, sSpecialValueName: string, sSpecialValueProperty: string, fValue: number) {
    return FuncHelper.ToFloat((fValue + Abilities.GetSpecialValuePropertyUpgrade(iEntityIndex, sAbilityName, sSpecialValueName, sSpecialValueProperty, AbilityUpgradeOperator.ABILITY_UPGRADES_OP_ADD)) * (1 + Abilities.GetSpecialValuePropertyUpgrade(iEntityIndex, sAbilityName, sSpecialValueName, sSpecialValueProperty, AbilityUpgradeOperator.ABILITY_UPGRADES_OP_MUL) * 0.01));
}

Abilities.GetSpecialValuesWithCalculated = function (sAbilityName: string, sName: string, iEntityIndex: EntityIndex = -1 as EntityIndex) {
    let aOriginalValues = Abilities.GetSpecialValues(sAbilityName, sName, iEntityIndex);
    // for (let i = 0; i < aOriginalValues.length; i++) {
    //     let v = aOriginalValues[i];
    //     aOriginalValues[i] = CalcSpecialValueUpgrade(iEntityIndex, sAbilityName, sName, v);
    // }
    let aValues = [...aOriginalValues];
    let tAddedValues: { [k: string]: number[] } = {};
    let tAddedFactors: { [k: string]: number[] } = {};
    let aMinValues: number[] = [];
    let aMaxValues: number[] = [];
    let _aMinValues = Abilities.GetSpecialValueWithTag(sAbilityName, sName, AbilitySpecialValueTag._min, iEntityIndex);
    if (_aMinValues) {
        aMinValues = Abilities.StringToValues(_aMinValues);
        // for (let i = 0; i < aMinValues.length; i++) {
        //     let v = aMinValues[i];
        //     aMinValues[i] = CalcSpecialValuePropertyUpgrade(iEntityIndex, sAbilityName, sName, "_min", v);
        // }
    }
    let _aMaxValues = Abilities.GetSpecialValueWithTag(sAbilityName, sName, AbilitySpecialValueTag._max, iEntityIndex);
    if (_aMaxValues) {
        aMaxValues = Abilities.StringToValues(_aMaxValues);
        // for (let i = 0; i < aMaxValues.length; i++) {
        //     let v = aMaxValues[i];
        //     aMaxValues[i] = CalcSpecialValuePropertyUpgrade(iEntityIndex, sAbilityName, sName, "_max", v);
        // }
    }
    let sType = Abilities.GetSpecialVarType(sAbilityName, sName);
    let iMaxLevel = aValues.length;
    for (const key in tAddedProperties) {
        const sFuncName = (tAddedProperties as any)[key] as string;
        let func = (Entities as any)[sFuncName];
        if (typeof (func) != "function") continue;
        let sFactors = Abilities.GetSpecialValueWithTag(sAbilityName, sName, key, iEntityIndex);
        if (sFactors) {
            tAddedValues[key] = [];
            tAddedFactors[key] = [];
            let aFactors = Abilities.StringToValues(sFactors);
            iMaxLevel = Math.max(aFactors.length, iMaxLevel);
            for (let i = 0; i < Math.max(aFactors.length, aValues.length); i++) {
                let factor = aFactors[FuncHelper.Clamp(i, 0, aFactors.length - 1)];
                // factor = CalcSpecialValuePropertyUpgrade(iEntityIndex, sAbilityName, sName, key, factor);
                tAddedFactors[key][i] = factor;
                let addedValue = factor * func(iEntityIndex) as any;
                if (sType == "FIELD_INTEGER") {
                    addedValue = parseInt(addedValue);
                } else if (sType == "FIELD_FLOAT") {
                    addedValue = FuncHelper.ToFloat(addedValue);
                }
                tAddedValues[key][i] = addedValue;
            }
        }
        else {
            // let extra_factor = GetSpecialValuePropertyUpgrade(iEntityIndex, sAbilityName, sName, key, AbilityUpgradeOperator.ABILITY_UPGRADES_OP_ADD);
            // if (extra_factor != 0) {
            //     tAddedValues[key] = [];
            //     tAddedFactors[key] = [];
            //     for (let i = 0; i < aValues.length; i++) {
            //         let factor = extra_factor;
            //         tAddedFactors[key][i] = factor;
            //         let addedValue = factor * (UnitHelper as any)[sFuncName](iEntityIndex);
            //         if (sType == "FIELD_INTEGER") {
            //             addedValue = parseInt(addedValue + "");
            //         } else if (sType == "FIELD_FLOAT") {
            //             addedValue = FuncHelper.ToFloat(addedValue);
            //         }
            //         tAddedValues[key][i] = addedValue;
            //     }
            // }
        }
    }
    Object.keys(tAddedValues).forEach(key => {
        let aNewValues = JSON.parse(JSON.stringify(aValues));
        for (let i = 0; i < iMaxLevel; i++) {
            let value = aValues[FuncHelper.Clamp(i, 0, aValues.length - 1)] || 0;
            value = value + tAddedValues[key][FuncHelper.Clamp(i, 0, tAddedValues[key].length - 1)];
            aNewValues[i] = value;
        }
        aValues = aNewValues;
    });
    if (aMinValues) {
        for (let i = 0; i < aValues.length; i++) {
            aValues[i] = Math.max(aValues[i], aMinValues[FuncHelper.Clamp(i, 0, aMinValues.length - 1)]);
        }
    }
    if (aMaxValues) {
        for (let i = 0; i < aValues.length; i++) {
            aValues[i] = Math.min(aValues[i], aMaxValues[FuncHelper.Clamp(i, 0, aMaxValues.length - 1)]);
        }
    }
    return {
        aValues: aValues,
        aOriginalValues: aOriginalValues,
        aMinValues: aMinValues,
        aMaxValues: aMaxValues,
        tAddedFactors: tAddedFactors,
        tAddedValues: tAddedValues,
    };
}
/**
 * @deprecated
 * @param param0 
 * @returns 
 */
Abilities.ReplaceAbilityValues = function ({ sStr, bShowExtra, sAbilityName, iLevel, iEntityIndex = -1 as EntityIndex, bIsDescription = false, bOnlyNowLevelValue = false }: { sStr: string, bShowExtra: boolean, sAbilityName: string, iLevel: number, iEntityIndex?: EntityIndex, bIsDescription?: boolean, bOnlyNowLevelValue?: boolean; }) {
    let [isitem, tData] = KVHelper.GetAbilityOrItemData(sAbilityName);
    if (!tData) { return sStr }
    let aValueNames = Abilities.GetSpecialNames(sAbilityName, iEntityIndex);
    for (let index = 0; index < aValueNames.length; index++) {
        const sValueName = aValueNames[index];
        let block = new RegExp("%" + sValueName + "%", "g");
        let blockPS = new RegExp("%" + sValueName + "%%", "g");
        let iResult = sStr.search(block);
        let iResultPS = sStr.search(blockPS);
        if (iResult == -1 && iResultPS == -1) continue;
        let tResult = Abilities.GetSpecialValuesWithCalculated(sAbilityName, sValueName, iEntityIndex);
        let aValues: number[];
        switch (sValueName) {
            case "abilitycastrange":
                aValues = Abilities.StringToValues(tData.AbilityCastRange || "");
                break;
            case "abilitycastpoint":
                aValues = Abilities.StringToValues(tData.AbilityCastPoint || "");
                break;
            case "abilityduration":
                aValues = Abilities.StringToValues(tData.AbilityDuration || "");
                break;
            case "abilitychanneltime":
                aValues = Abilities.StringToValues(tData.AbilityChannelTime || "");
                break;
            case "abilitydamage":
                aValues = Abilities.StringToValues(tData.AbilityDamage || "");
                break;
            case "abilitycooldown":
                aValues = Abilities.StringToValues(tData.AbilityCooldown || "");
                break;
            default:
                if (bIsDescription) {
                    aValues = tResult.aValues;
                } else {
                    aValues = tResult.aOriginalValues;
                }
                break;
        }
        if (!bIsDescription) {
            let CalculateSpellDamageTooltip = Abilities.GetSpecialValueWithTag(sAbilityName, sValueName, AbilitySpecialValueTag.CalculateSpellDamageTooltip, iEntityIndex);
            let bCalculateSpellDamage = CalculateSpellDamageTooltip != undefined ? Number(CalculateSpellDamageTooltip) == 1 : sValueName.indexOf("damage") != -1;
            bCalculateSpellDamage = bCalculateSpellDamage && iEntityIndex && Entities.IsValidEntity(iEntityIndex);
            let fSpellAmplify = Entities.GetSpellAmplify(iEntityIndex) * 0.01;
            if (bShowExtra && bCalculateSpellDamage) {
                for (let j = 0; j < aValues.length; j++) {
                    const value = aValues[j];
                    aValues[j] = Math.round(value * (1 + fSpellAmplify) * 100) / 100;
                }
                for (let j = 0; j < tResult.aValues.length; j++) {
                    const value = tResult.aValues[j];
                    tResult.aValues[j] = Math.round(value * (1 + fSpellAmplify) * 100) / 100;
                }
                if (tResult.aMinValues) {
                    for (let j = 0; j < tResult.aMinValues.length; j++) {
                        const value = tResult.aMinValues[j];
                        tResult.aMinValues[j] = Math.round(value * (1 + fSpellAmplify) * 100) / 100;
                    }
                }
                if (tResult.aMaxValues) {
                    for (let j = 0; j < tResult.aMaxValues.length; j++) {
                        const value = tResult.aMaxValues[j];
                        tResult.aMaxValues[j] = Math.round(value * (1 + fSpellAmplify) * 100) / 100;
                    }
                }
                for (const key in tResult.tAddedValues) {
                    const aAddedValues = tResult.tAddedValues[key];
                    if (aAddedValues) {
                        for (let j = 0; j < aAddedValues.length; j++) {
                            const value = aAddedValues[j];
                            aAddedValues[j] = Math.round(value * (1 + fSpellAmplify) * 100) / 100;
                        }
                    }
                }
            }
        }
        let [sValues, sValuesPS] = Abilities.AbilityDescriptionCompose(aValues, iLevel, bOnlyNowLevelValue);
        if (!bIsDescription) {
            if (!bShowExtra || !(iEntityIndex && Entities.IsValidEntity(iEntityIndex))) {
                let tAddedFactors = tResult.tAddedFactors;
                Object.keys(tAddedFactors).forEach((key, n) => {
                    const aAddedFactors = tAddedFactors[key];
                    if (aAddedFactors) {
                        if (key == "_ulti") {
                            sValues = sValues.replace("GameplayValues", "UltimateValues");
                        } else {
                            let [sTemp, sTempPS] = Abilities.AbilityDescriptionCompose(aAddedFactors, iLevel, bOnlyNowLevelValue);
                            if (aValues.length == 1 && aValues[0] == 0) {
                                if (n == 0) {
                                    sValues = $.Localize("#dota_ability_variable" + key) + "×" + sTemp;
                                    sValuesPS = $.Localize("#dota_ability_variable" + key) + "×" + sTempPS;
                                } else {
                                    sValues = sValues + " + " + $.Localize("#dota_ability_variable" + key) + "×" + sTemp;
                                    sValuesPS = sValuesPS + " + " + $.Localize("#dota_ability_variable" + key) + "×" + sTempPS;
                                }
                            } else {
                                sValues = sValues + "[+" + $.Localize("#dota_ability_variable" + key) + "×" + sTemp + "]";
                                sValuesPS = sValuesPS + "[+" + $.Localize("#dota_ability_variable" + key) + "×" + sTempPS + "]";
                            }
                        }
                    }
                });
            } else {
                let tAddedValues = tResult.tAddedValues;
                let bHasOperation = false;
                Object.keys(tAddedValues).forEach((key, n) => {
                    const aAddedValues = tAddedValues[key];
                    if (aAddedValues) {
                        let [sTemp, sTempPS] = Abilities.AbilityDescriptionCompose(aAddedValues, iLevel, bOnlyNowLevelValue);
                        if (aValues.length == 1 && aValues[0] == 0) {
                            if (n == 0) {
                                sValues = sTemp;
                                sValuesPS = sTempPS;
                            } else {
                                bHasOperation = true;
                                sValues = sValues + " + " + sTemp;
                                sValuesPS = sValuesPS + " + " + sTempPS;
                            }
                        } else {
                            bHasOperation = true;
                            sValues = sValues + "[+" + sTemp + "]";
                            sValuesPS = sValuesPS + "[+" + sTempPS + "]";
                        }
                    }
                });
                let [sTemp, sTempPS] = Abilities.AbilityDescriptionCompose(tResult.aValues, iLevel, bOnlyNowLevelValue);
                if (bHasOperation) {
                    sValues = sValues + " = " + sTemp;
                    sValuesPS = sValuesPS + " = " + sTempPS;
                } else {
                    sValues = sTemp;
                    sValuesPS = sTempPS;
                }
            }
            if (bShowExtra && (tResult.aMinValues || tResult.aMaxValues)) {
                if (tResult.aMinValues) {
                    let [sTemp, sTempPS] = Abilities.AbilityDescriptionCompose(tResult.aMinValues, iLevel, bOnlyNowLevelValue);
                    sValues = sValues + "[" + $.Localize("#dota_ability_variable_min") + sTemp + "]";
                    sValuesPS = sValuesPS + "[" + $.Localize("#dota_ability_variable_min") + sTempPS + "]";
                }
                if (tResult.aMaxValues) {
                    let [sTemp, sTempPS] = Abilities.AbilityDescriptionCompose(tResult.aMaxValues, iLevel, bOnlyNowLevelValue);
                    sValues = sValues + "[" + $.Localize("#dota_ability_variable_max") + sTemp + "]";
                    sValuesPS = sValuesPS + "[" + $.Localize("#dota_ability_variable_max") + sTempPS + "]";
                }
            }
        }
        sStr = sStr.replace(blockPS, sValuesPS);
        sStr = sStr.replace(block, sValues);
    }
    return sStr;
}

/**
 * @deprecated
 * @param param0 
 * @returns 
 */
Abilities.ReplaceAbilityValuesDes = function ({ sStr, sAbilityName, iLevel, iEntityIndex = -1 as EntityIndex }: { sStr: string, sAbilityName: string, iLevel: number, iEntityIndex?: EntityIndex }) {
    let [isitem, tData] = KVHelper.GetAbilityOrItemData(sAbilityName);
    if (!tData) { return sStr }
    let aValueNames = Abilities.GetSpecialNames(sAbilityName, iEntityIndex);
    for (let index = 0; index < aValueNames.length; index++) {
        const sValueName = aValueNames[index];
        let block = new RegExp("%" + sValueName + "%", "g");
        let blockPS = new RegExp("%" + sValueName + "%%", "g");
        let iResult = sStr.search(block);
        let iResultPS = sStr.search(blockPS);
        if (iResult == -1 && iResultPS == -1) continue;
        // let tResult = GetSpecialValuesWithCalculated(sAbilityName, sValueName, iEntityIndex);
        let aValues: number[] = Abilities.GetSpecialValues(sAbilityName, sValueName, iEntityIndex);
        switch (sValueName) {
            case "abilitycastrange":
                aValues = Abilities.StringToValues(tData.AbilityCastRange || "");
                break;
            case "abilitycastpoint":
                aValues = Abilities.StringToValues(tData.AbilityCastPoint || "");
                break;
            case "abilityduration":
                aValues = Abilities.StringToValues(tData.AbilityDuration || "");
                break;
            case "abilitychanneltime":
                aValues = Abilities.StringToValues(tData.AbilityChannelTime || "");
                break;
            case "abilitydamage":
                aValues = Abilities.StringToValues(tData.AbilityDamage || "");
                break;
            case "abilitycooldown":
                aValues = Abilities.StringToValues(tData.AbilityCooldown || "");
                break;
            default:
                break;
        }
        let [sValues, sValuesPS] = Abilities.AbilityDescriptionCompose(aValues, iLevel, iLevel != -1);
        sStr = sStr.replace(blockPS, sValuesPS);
        sStr = sStr.replace(block, sValues);
        // GLogHelper.print(sStr);

        // $.Msg(sStr)
    }
    return sStr;
}




/**
 * 技能物品词条描述
 * @param sAbilityName
 * @param iLevel
 * @param iEntityIndex
 * @param bOnlyNowLevelValue
 * @returns
 */
Abilities.GetAbilitySpecialDes = function (sAbilityName: string, iLevel: number = -1, iEntityIndex: EntityIndex | number = -1) {
    let [isitem, tData] = KVHelper.GetAbilityOrItemData(sAbilityName);
    let r: string[] = [];
    if (!tData) { return r }
    let aValueNames = Abilities.GetSpecialNames(sAbilityName, iEntityIndex as EntityIndex);
    let allspecval = Abilities.GetAllSpecialValues(sAbilityName);
    for (let index = 0; index < aValueNames.length; index++) {
        const sValueName = aValueNames[index];
        // let tResult = GetSpecialValuesWithCalculated(sAbilityName, sValueName, iEntityIndex);
        let aValues: number[] = null as any;
        switch (sValueName) {
            case "abilitycastrange":
                aValues = Abilities.StringToValues(tData.AbilityCastRange || "");
                break;
            case "abilitycastpoint":
                aValues = Abilities.StringToValues(tData.AbilityCastPoint || "");
                break;
            case "abilityduration":
                aValues = Abilities.StringToValues(tData.AbilityDuration || "");
                break;
            case "abilitychanneltime":
                aValues = Abilities.StringToValues(tData.AbilityChannelTime || "");
                break;
            case "abilitydamage":
                aValues = Abilities.StringToValues(tData.AbilityDamage || "");
                break;
            case "abilitycooldown":
                aValues = Abilities.StringToValues(tData.AbilityCooldown || "");
                break;
            default:
                aValues = allspecval[sValueName];
                break;
        }
        if (aValues == null || aValues.length == 1 && aValues[0] == 0) {
            continue;
        }
        let [sValues, sValuesPS] = Abilities.AbilityDescriptionCompose(aValues, iLevel, iLevel != -1);
        const isPect = sValueName.toUpperCase().includes("CHANCE") || sValueName.toUpperCase().includes("PERCENTAGE");
        r.push(`${$.Localize("#DOTA_HUD_" + sValueName.toUpperCase())} : ${isPect ? sValuesPS : sValues}`)
    }
    return r;
}

Abilities.GetAbilityData = function (iEntityIndex: AbilityEntityIndex, key: string, iLevel = -1) {
    GameEvents.SendEventClientSide(GameProtocol.Protocol.custom_call_get_ability_data as any, {
        ability_entindex: iEntityIndex,
        level: iLevel,
        key_name: key
    });
    let iCasterIndex = Abilities.GetCaster(iEntityIndex);
    let ibuffid = Entities.GetBuffByName(iCasterIndex, GPropertyConfig.UNIT_PROPERTY_BUFF_NAME);
    if (ibuffid != -1) {
        return Buffs.GetTexture(iCasterIndex, ibuffid as BuffID);
    }
    return "";
};

Abilities.GetLevelCooldown = function (iEntityIndex: AbilityEntityIndex, iLevel = -1) {
    let sCooldown = Abilities.GetAbilityData(iEntityIndex, "GetCooldown", iLevel)
    // if (sCooldown == "") {
    //     let sAbilityName = Abilities.GetAbilityName(iEntityIndex);
    //     let [isitem, tData] = KVHelper.GetAbilityOrItemData(sAbilityName);
    //     if (tData) {
    //         if (iLevel == -1) iLevel = Abilities.GetLevel(iEntityIndex) - 1;
    //         let aCooldowns = StringToValues(tData.AbilityCooldown || "");
    //         if (iLevel >= 0 && aCooldowns.length > 0) {
    //             return aCooldowns[Math.min(iLevel, aCooldowns.length - 1)];
    //         }
    //     }
    //     return 0;
    // }
    return GToNumber(sCooldown);
};

Abilities.GetLevelManaCost = function (iEntityIndex: AbilityEntityIndex, iLevel = -1) {
    let sManaCost = Abilities.GetAbilityData(iEntityIndex, "GetManaCost", iLevel)
    // if (sManaCost == "") {
    //     let sAbilityName = Abilities.GetAbilityName(iEntityIndex);
    //     let [isitem, tData] = KVHelper.GetAbilityOrItemData(sAbilityName);
    //     if (tData) {
    //         if (iLevel == -1) iLevel = Abilities.GetLevel(iEntityIndex) - 1;
    //         let aManaCosts = StringToValues(tData.AbilityManaCost || "");
    //         if (iLevel >= 0 && aManaCosts.length > 0) {
    //             return aManaCosts[Math.min(iLevel, aManaCosts.length - 1)];
    //         }
    //     }
    //     return 0;
    // }
    return GToNumber(sManaCost);
};
Abilities.GetLevelGoldCost = function (iEntityIndex: AbilityEntityIndex, iLevel = -1) {
    let sGoldCost = Abilities.GetAbilityData(iEntityIndex, "GetGoldCost", iLevel)
    return GToNumber(sGoldCost);
};
Abilities.GetLevelWoodCost = function (iEntityIndex: AbilityEntityIndex, iLevel = -1) {
    let sWoodCost = Abilities.GetAbilityData(iEntityIndex, "GetWoodCost", iLevel)
    return GToNumber(sWoodCost);
};
Abilities.GetLevelSoulCrystal = function (iEntityIndex: AbilityEntityIndex, iLevel = -1) {
    let sSoulCrystal = Abilities.GetAbilityData(iEntityIndex, "GetSoulCrystal", iLevel)
    return GToNumber(sSoulCrystal);
};

Abilities.GetAbilityIndex = function (iEntityIndex: EntityIndex, iAbilityEntIndex: AbilityEntityIndex) {
    for (let i = 0; i < Entities.GetAbilityCount(iEntityIndex); i++) {
        const _iAbilityEntIndex = Entities.GetAbility(iEntityIndex, i);
        if (_iAbilityEntIndex == iAbilityEntIndex) {
            return i;
        }
    }
    return -1;
};
Abilities.GetLocalizeAbilityName = function (sAbilityName: string) {
    const str = $.Localize("#DOTA_Tooltip_ability_" + sAbilityName);
    return str;
}

Abilities.GetAbilityRarity = function (sAbilityName: string) {
    return (KVHelper.GetAbilityOrItemDataForKey(sAbilityName, "Rarity") || "B") as IRarity;
}

Abilities.GetAbilityRarityNumber = function (sAbilityName: string) {
    const rarity = Abilities.GetAbilityRarity(sAbilityName);
    return GToNumber(GEEnum.ERarity[rarity]);
}

Abilities.GetAbilityColor = function (sAbilityName: string) {
    const rarity = Abilities.GetAbilityRarity(sAbilityName);
    if (rarity == "SS") {
        return CSSHelper.EColor.Red;
    }
    else if (rarity == "S") {
        return CSSHelper.EColor.Gold;
    }
    else if (rarity == "A") {
        return CSSHelper.EColor.Purple;
    } else if (rarity == "B") {
        return CSSHelper.EColor.Blue;
    } else if (rarity == "C") {
        return CSSHelper.EColor.Green;
    } else if (rarity == "D") {
        return CSSHelper.EColor.White;
    }
    return CSSHelper.EColor.White;
}

Abilities.GetAbilityJinDuInfo = function (sAbilityName: string | AbilityEntityIndex) {
    if (sAbilityName == null) { return }
    if (typeof sAbilityName == "number") {
        if (Entities.IsValidEntity(sAbilityName)) {
            let info = Abilities.GetAbilityData(sAbilityName as AbilityEntityIndex, "GetAbilityJinDuInfo");
            if (info && info.length > 0) {
                let [min, max, now] = info.split(",");
                return { min: GToNumber(min), max: GToNumber(max), now: GToNumber(now) };
            }
            else {
                sAbilityName = Abilities.GetAbilityName(sAbilityName as AbilityEntityIndex);
                return Abilities.GetAbilityJinDuInfo(sAbilityName);
            }
        }
    }
    else if (typeof sAbilityName == "string") {
        let data = Abilities.GetSpecialNameData(sAbilityName + "", "_jindu_max");
        if (data && data["_jindu_max"]) {
            return { min: 0, max: GToNumber(data["_jindu_max"]), now: 0 };
        }
    }
}

/***************************道具******************************** */

declare global {
    interface CScriptBindingPR_Items {
        /**
         * 物品是否可以合成
         * @param iItemIndex 物品实体index
         */
        IsCombinable(sItemName: ItemEntityIndex): boolean;
        /**是否可以拆分 */
        IsDisassemblable(iItemEntIndex: ItemEntityIndex): boolean;
        /**设置合成锁定 */
        SetCombineLocked(iItemEntIndex: ItemEntityIndex, block: boolean): void;
        /**道具合成锁定 */
        IsCombineLocked(iItemEntIndex: ItemEntityIndex): boolean;
        /**拆分道具 */
        DisassembleItem(iItemEntIndex: ItemEntityIndex): void;
        GetItemValue(sItemName: string, sKeyName: string): string | undefined;
        GetItemCost(sItemName: string): number;
        GetItemRecipes(sItemName: string): string[][];
        GetItemRelatedRecipes(sItemName: string): string[][];
        GetItemRelatedRecipesWithResults(sItemName: string): [string[][], string[]];
        GetItemName(item: string | ItemEntityIndex): string;
        /**
         * 获取物品木材价格
         * @param item 物品名字或者index
         * @returns 返回物品价格
         */
        GetItemWoodCost(sItemName: string): number;
        /**
         * 获取物品挑战点数价格
         * @param item 物品名字或者index
         * @returns 返回物品价格
         */
        GetItemPointCost(sItemName: string): number;
        /**
         * 获取物品魂晶价格
         * @param item 物品名字或者index
         * @returns 返回物品价格
         */
        GetItemSoulCrystalCost(sItemName: string): number;
        /**
         * 获取物品对应等级的价格
         * @param sItemName 物品名字
         * @param iLevel 物品等级
         * @returns 返回物品价格
         */
        GetItemCostLV(sItemName: string, iLevel: number): number;

        /**
         * 物品是否可以重铸
         * @param iItemIndex 物品实体index 物品名
         */
        IsRemakable(sItemName: string | ItemEntityIndex): boolean;
        IsHeroUniqueItem(sItemName: string | ItemEntityIndex): boolean;
        /**
         * 物品是否是多级物品
         * @param item 物品名 | 实体index
         */
        IsMultiLevelItem(sItemName: string | ItemEntityIndex): boolean;
        /**
         * 物品是否可以升级，必须是多级物品
         * @param iItemIndex 物品实体index
         */
        IsUpgradable(sItemName: string | ItemEntityIndex): boolean;
    }

}
Items.IsDisassemblable = (iItemEntIndex: ItemEntityIndex) => {
    if (iItemEntIndex == null || iItemEntIndex == -1) { return false }
    return Abilities.GetAbilityData(iItemEntIndex, "IsDisassemblable") == "true";
}
Items.IsCombinable = (iItemEntIndex: ItemEntityIndex) => {
    if (iItemEntIndex == null || iItemEntIndex == -1) { return false }
    return Abilities.GetAbilityData(iItemEntIndex, "IsCombinable") == "true";
}
Items.SetCombineLocked = (iItemEntIndex: ItemEntityIndex, block: boolean) => {
    if (iItemEntIndex == null || iItemEntIndex == -1 || !Abilities.IsItem(iItemEntIndex)) { return }
    NetHelper.SendToLua(GameProtocol.Protocol.req_ITEM_LOCK_CHANGE, { entindex: iItemEntIndex, block: block });
}
Items.IsCombineLocked = (iItemEntIndex: ItemEntityIndex) => {
    if (iItemEntIndex == null || iItemEntIndex == -1) { return false }
    return Abilities.GetAbilityData(iItemEntIndex, "IsCombineLocked") == "true";
}
Items.DisassembleItem = (iItemEntIndex: ItemEntityIndex) => {
    if (iItemEntIndex == null || iItemEntIndex == -1 || !Abilities.IsItem(iItemEntIndex)) { return }
    NetHelper.SendToLua(GameProtocol.Protocol.req_ITEM_DisassembleItem, { entindex: iItemEntIndex });
}
Items.GetItemValue = (sItemName: string, sKeyName: string) => {
    let tItemKeyValues = KVHelper.KVItems()[sItemName];
    if (tItemKeyValues) {
        return tItemKeyValues[sKeyName] as string;
    }
}
Items.GetItemCost = (sItemName: string) => {
    return GToNumber(Items.GetItemValue(sItemName, "ItemCost")) || 0;
}

Items.GetItemRecipes = (sItemName: string) => {
    let aList = [];
    let sItemRecipe = Items.GetItemValue(sItemName, "ItemRecipe");
    if (typeof sItemRecipe == "string") {
        sItemRecipe = sItemRecipe.replace(/\s/g, "");
        let a = sItemRecipe.split(/\|/g);
        for (let i = 0; i < a.length; i++) {
            let _a = a[i].split(/\+/g);
            let l = [];
            for (let j = 0; j < _a.length; j++) {
                l.push(_a[j]);
            }
            aList.push(l);
        }
    }
    return aList;
}
Items.GetItemRelatedRecipes = (sItemName: string) => {
    let aList = [];
    let ItemsKv = KVHelper.KVItems()
    for (const _sItemName in ItemsKv) {
        let aRecipes = Items.GetItemRecipes(_sItemName);
        if (aRecipes.length > 0) {
            for (let i = 0; i < aRecipes.length; i++) {
                const aRecipe = aRecipes[i];
                if (aRecipe.indexOf(sItemName) != -1) {
                    aList.push(aRecipe);
                }
            }
        }
    }
    return aList;
}

Items.GetItemRelatedRecipesWithResults = (sItemName: string) => {
    let aList = [];
    let aResults = [];
    let ItemsKv = KVHelper.KVItems()
    for (const _sItemName in ItemsKv) {
        let aRecipes = Items.GetItemRecipes(_sItemName);
        if (aRecipes.length > 0) {
            for (let i = 0; i < aRecipes.length; i++) {
                const aRecipe = aRecipes[i];
                if (aRecipe.indexOf(sItemName) != -1) {
                    aList.push(aRecipe);
                    aResults.push(_sItemName);
                }
            }
        }
    }
    return [aList, aResults];
}

Items.GetItemName = (item: string | ItemEntityIndex) => {
    let sItemName: string = "";
    if (!item) return "";
    if (typeof (item) == "string") {
        sItemName = item;
    } else if (typeof (item) == "number") {
        sItemName = Abilities.GetAbilityName(item);
    }
    return sItemName;
}

Items.GetItemWoodCost = (item: string | ItemEntityIndex) => {
    let sItemName = Items.GetItemName(item);
    let total = GToNumber(Items.GetItemValue(sItemName, "WoodCost")) || 0;
    if (typeof (item) != "string") {
        if (Items.IsStackable(item)) {
            total *= Items.GetCurrentCharges(item) / Items.GetInitialCharges(item);
        }
    }
    return total;
}


Items.GetItemPointCost = (item: string | ItemEntityIndex) => {
    let sItemName = Items.GetItemName(item);
    let total = GToNumber(Items.GetItemValue(sItemName, "PointCost")) || 0;
    if (typeof (item) != "string") {
        if (Items.IsStackable(item)) {
            total *= Items.GetCurrentCharges(item) / Items.GetInitialCharges(item);
        }
    }
    return total;

}


Items.GetItemSoulCrystalCost = (item: string | ItemEntityIndex) => {
    let sItemName = Items.GetItemName(item);
    let total = GToNumber(Items.GetItemValue(sItemName, "SoulCrystalCost")) || 0;
    if (typeof (item) != "string") {
        if (Items.IsStackable(item)) {
            total *= Items.GetCurrentCharges(item) / Items.GetInitialCharges(item);
        }
    }
    return total;
}


Items.GetItemCostLV = (sItemName: string, iLevel: number) => {
    if (iLevel >= 1 && iLevel <= 5) {
        return GToNumber(Items.GetItemValue(sItemName, "ItemCost" + iLevel)) || Items.GetItemCost(sItemName) || 0;
    } else {
        return Items.GetItemCost(sItemName);
    }
}



// let tRemakeGroups = {};
// let tRemakeItem2Group = {};
// for (let sItemName in CustomUIConfig.ItemsKv) {
//     let Info = CustomUIConfig.ItemsKv[sItemName];
//     if (Info.RemakeGroup) {
//         if (tRemakeGroups[Info.RemakeGroup] == undefined) {
//             tRemakeGroups[Info.RemakeGroup] = {};
//         }
//         tRemakeGroups[Info.RemakeGroup][sItemName] = 1;
//         tRemakeItem2Group[sItemName] = Info.RemakeGroup;
//     }
// }

Items.IsRemakable = (item: string | ItemEntityIndex) => {
    let sItemName = Items.GetItemName(item);
    return false;
}

Items.IsHeroUniqueItem = (iItemIndex: ItemEntityIndex) => {
    return Items.GetItemValue(Abilities.GetAbilityName(iItemIndex), "hero") != undefined;
}


Items.IsMultiLevelItem = (item: ItemEntityIndex | string) => {
    if (item == -1 || item == "") {
        return false;
    }
    let sItemName = Items.GetItemName(item);
    let ItemsKv = KVHelper.KVItems()
    let data = ItemsKv[sItemName];
    if (data == null) {
        return false;
    }
    return (typeof (data.ItemBaseLevel) == "number" && typeof (data.MaxUpgradeLevel) == "number");
}


Items.IsUpgradable = (iItemIndex: ItemEntityIndex) => {
    if (!Items.IsMultiLevelItem(iItemIndex)) {
        return false;
    }
    let ItemsKv = KVHelper.KVItems()
    let data = ItemsKv[Abilities.GetAbilityName(iItemIndex)];
    if (Abilities.GetLevel(iItemIndex) >= (Number(data.MaxUpgradeLevel) ?? 0)) {
        return false;
    }
    return true;
}

declare global {
    interface CScriptBindingPR_Entities {
        GetCursorUnit(iTeam?: number): EntityIndex;
        GetAbilityIndex(iEntityIndex: EntityIndex, iAbilityEntIndex: AbilityEntityIndex): number;
        IsCustomCourier(unitEntIndex: EntityIndex): boolean;
        IsFakerCourier(unitEntIndex: EntityIndex): boolean;
        GetCourierName(unitEntIndex: EntityIndex): string;
        HasBuff(unitEntIndex: EntityIndex, buffName: string): boolean;
        GetUnitRarity(unitname: string): IRarity;
        GetUnitRarityNumber(unitname: string): IRarityNumber;
        GetAttackSpeedPect(iUnitEntIndex: EntityIndex): number;
        GetMoveSpeed(iUnitEntIndex: EntityIndex): number;
        GetUltiPower(iUnitEntIndex: EntityIndex): number;
        GetMaximumAttackSpeed(iUnitEntIndex: EntityIndex): number;
        GetBuffByName(iUnitEntIndex: EntityIndex, buffName: string): BuffID;
        GetUnitData(iUnitEntIndex: EntityIndex, sFuncName: string): any;
        GetStar(iUnitEntIndex: EntityIndex): number;
        GetEntityIndex(iUnitEntIndex: EntityIndex): number;
        GetCustomMaxHealth(iUnitEntIndex: EntityIndex): number;
        GetBaseAttackDamage(iUnitEntIndex: EntityIndex): number;
        GetAttackDamage(iUnitEntIndex: EntityIndex): number;
        GetPhysicalCriticalStrikeChance(iUnitEntIndex: EntityIndex): number;
        GetCastRange(iUnitEntIndex: EntityIndex): number;
        GetBaseArmor(iUnitEntIndex: EntityIndex): number;
        GetArmor(iUnitEntIndex: EntityIndex): number;
        GetBaseMagicalArmor(iUnitEntIndex: EntityIndex): number;
        GetMagicalArmor(iUnitEntIndex: EntityIndex): number;
        GetBaseSpellAmplify(iUnitEntIndex: EntityIndex): number;
        GetSpellAmplify(iUnitEntIndex: EntityIndex): number;
        GetSpellLifeStealPercent(iUnitEntIndex: EntityIndex): number;
        GetLifeStealPercent(iUnitEntIndex: EntityIndex): number;
        GetOutgoingDamagePercent(iUnitEntIndex: EntityIndex): number;
        GetOutgoingPhysicalDamagePercent(iUnitEntIndex: EntityIndex): number;
        GetOutgoingMagicalDamagePercent(iUnitEntIndex: EntityIndex): number;
        GetOutgoingPureDamagePercent(iUnitEntIndex: EntityIndex): number;
        GetIncomingDamagePercent(iUnitEntIndex: EntityIndex): number;
        GetIncomingPhysicalDamagePercent(iUnitEntIndex: EntityIndex): number;
        GetIncomingMagicalDamagePercent(iUnitEntIndex: EntityIndex): number;
        GetIncomingPureDamagePercent(iUnitEntIndex: EntityIndex): number;
        GetIgnorePhysicalArmorPercentage(iUnitEntIndex: EntityIndex): number;
        GetManaRegen(iUnitEntIndex: EntityIndex): number;
        GetIgnoreMagicalArmorPercentage(iUnitEntIndex: EntityIndex): number;
        GetCriticalStrikeChance(iUnitEntIndex: EntityIndex): number;
        GetCriticalStrikeDamage(iUnitEntIndex: EntityIndex): number;
        GetSpellCriticalStrikeChance(iUnitEntIndex: EntityIndex): number;
        GetEnergyRegenPercentage(iUnitEntIndex: EntityIndex): number;
        GetSpellCriticalStrikeDamage(iUnitEntIndex: EntityIndex): number;
        GetPhysicalArmor(iUnitEntIndex: EntityIndex): number;
        GetBasePhysicalArmor(iUnitEntIndex: EntityIndex): number;
        GetPhysicalReduction(iUnitEntIndex: EntityIndex): number;
        GetMagicalReduction(iUnitEntIndex: EntityIndex): number;
        GetStatusResistance(iUnitEntIndex: EntityIndex): number;
        GetEvasion(iUnitEntIndex: EntityIndex): number;
        GetCooldownReduction(iUnitEntIndex: EntityIndex): number;
        HasHeroAttribute(iUnitEntIndex: EntityIndex): boolean;
        GetBaseStrength(iUnitEntIndex: EntityIndex): number;
        GetStrength(iUnitEntIndex: EntityIndex): number;
        GetBaseAgility(iUnitEntIndex: EntityIndex): number;
        GetAgility(iUnitEntIndex: EntityIndex): number;
        GetBaseIntellect(iUnitEntIndex: EntityIndex): number;
        GetIntellect(iUnitEntIndex: EntityIndex): number;
        GetAllStats(iUnitEntIndex: EntityIndex): number;
        GetBaseAllStats(iUnitEntIndex: EntityIndex): number;
        GetPrimaryAttribute(iUnitEntIndex: EntityIndex): number;
        GetHealthBarWidth(iUnitEntIndex: EntityIndex): number;
        GetHealthBarHeight(iUnitEntIndex: EntityIndex): number;
        /**
         * 获取单位名称
         * @param unitname 
         */
        GetLocalizeUnitName(unitname: string): string;
    }
}
Entities.NoHealthBar = (iUnitEntIndex) => {
    return true;
};
Entities.GetCursorUnit = (iTeam: number = -1) => {
    let vPosCursor = GameUI.GetCursorPosition();
    let world_position = GameUI.GetScreenWorldPosition(vPosCursor);
    if (world_position == null) {
        return -1 as EntityIndex;
    }
    let targets = GameUI.FindScreenEntities(vPosCursor);
    targets = targets.filter(e => e.accurateCollision);
    if (iTeam != -1) {
        targets = targets.filter(e => Entities.GetTeamNumber(e.entityIndex) == iTeam);
    }
    targets = targets.filter(e => (!Entities.IsIllusion(e.entityIndex)) && (Entities.IsCreature(e.entityIndex) || Entities.IsConsideredHero(e.entityIndex) || Entities.IsRealHero(e.entityIndex)) && Entities.IsInventoryEnabled(e.entityIndex));
    if (targets.length == 0) {
        return -1 as EntityIndex;
    }
    targets.sort((a, b) => Game.Length2D(Entities.GetAbsOrigin(a.entityIndex), world_position!) - Game.Length2D(Entities.GetAbsOrigin(b.entityIndex), world_position!));
    return targets[0].entityIndex;
};

Entities.GetAbilityIndex = (iEntityIndex: EntityIndex, iAbilityEntIndex: AbilityEntityIndex) => {
    for (let i = 0; i < Entities.GetAbilityCount(iEntityIndex); i++) {
        const _iAbilityEntIndex = Entities.GetAbility(iEntityIndex, i);
        if (_iAbilityEntIndex == iAbilityEntIndex) {
            return i;
        }
    }
    return -1;
};

Entities.IsCustomCourier = (unitEntIndex: EntityIndex) => {
    return Entities.HasBuff(unitEntIndex, "modifier_courier")
}
Entities.IsFakerCourier = (unitEntIndex: EntityIndex) => {
    return Entities.HasBuff(unitEntIndex, "modifier_faker_courier")
}

Entities.GetCourierName = (unitEntIndex: EntityIndex) => {
    if (Entities.IsCustomCourier(unitEntIndex) || Entities.IsFakerCourier(unitEntIndex)) {
        let data = NetHelper.GetDotaEntityData(unitEntIndex, "CourierName") || {};
        return data.CourierName;
    }
}

Entities.HasBuff = (unitEntIndex: EntityIndex, buffName: string) => {
    for (let index = 0; index < Entities.GetNumBuffs(unitEntIndex); index++) {
        let buff = Entities.GetBuff(unitEntIndex, index);
        if (Buffs.GetName(unitEntIndex, buff) == buffName)
            return true;
    }
    return false;
};

Entities.GetUnitRarity = (unitname: string): IRarity => {
    let unitobj = KVHelper.KVUnits()[unitname];
    if (unitobj && unitobj.Rarity) {
        return unitobj.Rarity as IRarity
    }
    return ("A") as IRarity;
};

Entities.GetUnitRarityNumber = (unitname: string): IRarityNumber => {
    const rarity = Entities.GetUnitRarity(unitname);
    return GToNumber(GEEnum.ERarity[rarity]);
};

Entities.GetAttackSpeedPect = (iUnitEntIndex: EntityIndex) => {
    // let a = GetUnitData(iUnitEntIndex, "GetAttackSpeed");
    let b = Entities.GetAttackSpeed(iUnitEntIndex) * 100;
    // GLogHelper.print("GetAttackSpeed", a, b, 111)
    return b
};

Entities.GetMoveSpeed = (iUnitEntIndex: EntityIndex) => {
    return Entities.GetMoveSpeedModifier(iUnitEntIndex, Entities.GetBaseMoveSpeed(iUnitEntIndex));
};
Entities.GetUltiPower = (iUnitEntIndex: EntityIndex) => {
    return Entities.GetUnitData(iUnitEntIndex, "GetUltiPower");
};

Entities.GetMaximumAttackSpeed = (iUnitEntIndex: EntityIndex) => {
    return GToNumber(Entities.GetUnitData(iUnitEntIndex, "GetMaximumAttackSpeed"));
};
Entities.GetBuffByName = (iUnitEntIndex: EntityIndex, buffName: string) => {
    const count = Entities.GetNumBuffs(iUnitEntIndex);
    for (let i = 0; i < count; i++) {
        const buffid = Entities.GetBuff(iUnitEntIndex, i);
        if (Buffs.GetName(iUnitEntIndex, buffid) == buffName) {
            return buffid;
        }
    }
    return -1 as BuffID;
};
// Entities.GetEntityInventoryLock(iUnitEntIndex: EntityIndex) {
//     return NetHelper.GetDotaEntityData(iUnitEntIndex, "inventory_lock") as { [key: string]: number };
// };
Entities.GetUnitData = (iUnitEntIndex: EntityIndex, sFuncName: string) => {
    GameEvents.SendEventClientSide(GameProtocol.Protocol.custom_call_get_unit_data as any, {
        unit_entindex: iUnitEntIndex,
        func_name: sFuncName,
    });
    let ibuffid = Entities.GetBuffByName(iUnitEntIndex, GPropertyConfig.UNIT_PROPERTY_BUFF_NAME);
    if (ibuffid != -1) {
        let sValue = Buffs.GetTexture(iUnitEntIndex, ibuffid as BuffID);
        if (sValue == "nil") {
            return;
        }
        if (sValue == "true") {
            return true;
        }
        if (sValue == "false") {
            return false;
        }
        return GToNumber(sValue);
    }
    return 0;
};
Entities.GetStar = (iUnitEntIndex: EntityIndex): number => {
    if (iUnitEntIndex == null || iUnitEntIndex == -1) { return -1 }
    return (Number(Entities.GetUnitData(iUnitEntIndex, "GetStar")));
}
Entities.GetEntityIndex = (iUnitEntIndex: EntityIndex) => {
    return (Number(Entities.GetUnitData(iUnitEntIndex, "GetEntityIndex")));
};
Entities.GetCustomMaxHealth = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetHealth")));
};
Entities.GetBaseAttackDamage = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetBaseAttackDamage")));
};
Entities.GetAttackDamage = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetAttackDamage")));
};
Entities.GetPhysicalCriticalStrikeChance = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetPhysicalCriticalStrikeChance")));
};
Entities.GetCastRange = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetCastRange")));
};
Entities.GetBaseArmor = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetBaseArmor")));
};
Entities.GetArmor = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetArmor")));
};
Entities.GetBaseMagicalArmor = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetBaseMagicalArmor")));
};
Entities.GetMagicalArmor = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetMagicalArmor")));
};
Entities.GetBaseSpellAmplify = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetBaseSpellAmplify")));
};
Entities.GetSpellAmplify = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetSpellAmplify")));
};
Entities.GetSpellLifeStealPercent = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetSpellLifeStealPercent")));
};
Entities.GetLifeStealPercent = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetLifeStealPercent")));
};
Entities.GetIncomingDamagePercent = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetIncomingDamagePercent")));
};
Entities.GetIncomingPhysicalDamagePercent = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetIncomingPhysicalDamagePercent")));
};
Entities.GetIncomingMagicalDamagePercent = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetIncomingMagicalDamagePercent")));
};
Entities.GetIncomingPureDamagePercent = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetIncomingPureDamagePercent")));
};
Entities.GetOutgoingDamagePercent = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetOutgoingDamagePercent")));
};
Entities.GetOutgoingPhysicalDamagePercent = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetOutgoingPhysicalDamagePercent")));
};
Entities.GetOutgoingMagicalDamagePercent = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetOutgoingMagicalDamagePercent")));
};
Entities.GetOutgoingPureDamagePercent = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetOutgoingPureDamagePercent")));
};
Entities.GetIgnorePhysicalArmorPercentage = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetIgnorePhysicalArmorPercentage")));
};
Entities.GetManaRegen = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetManaRegen")));
};
Entities.GetIgnoreMagicalArmorPercentage = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetIgnoreMagicalArmorPercentage")));
};
Entities.GetCriticalStrikeChance = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetCriticalStrikeChance")));
};
Entities.GetCriticalStrikeDamage = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetCriticalStrikeDamage")));
};
Entities.GetSpellCriticalStrikeChance = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetSpellCriticalStrikeChance")));
};
Entities.GetEnergyRegenPercentage = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetEnergyRegenPercentage")));
};
Entities.GetSpellCriticalStrikeDamage = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetSpellCriticalStrikeDamage")));
};
Entities.GetPhysicalArmor = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetPhysicalArmor")));
};
Entities.GetBasePhysicalArmor = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetBasePhysicalArmor")));
};
Entities.GetPhysicalReduction = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetPhysicalReduction")));
};
Entities.GetMagicalReduction = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetMagicalReduction")));
};
Entities.GetStatusResistance = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetStatusResistance")));
};
Entities.GetEvasion = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetEvasion")));
};
Entities.GetCooldownReduction = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetCooldownReduction")));
};
Entities.HasHeroAttribute = (iUnitEntIndex: EntityIndex) => {
    return Entities.HasBuff(iUnitEntIndex, GPropertyConfig.HERO_PROPERTY_BUFF_NAME);
};
Entities.GetBaseStrength = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetBaseStrength")));
};
Entities.GetStrength = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetStrength")));
};
Entities.GetBaseAgility = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetBaseAgility")));
};
Entities.GetAgility = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetAgility")));
};
Entities.GetBaseIntellect = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetBaseIntellect")));
};
Entities.GetIntellect = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetIntellect")));
};
Entities.GetAllStats = (iUnitEntIndex: EntityIndex) => {
    return Entities.GetStrength(iUnitEntIndex) + Entities.GetAgility(iUnitEntIndex) + Entities.GetIntellect(iUnitEntIndex);
};
Entities.GetBaseAllStats = (iUnitEntIndex: EntityIndex) => {
    return Entities.GetBaseStrength(iUnitEntIndex) + Entities.GetBaseAgility(iUnitEntIndex) + Entities.GetBaseIntellect(iUnitEntIndex);
};
Entities.GetPrimaryAttribute = (iUnitEntIndex: EntityIndex) => {
    if (Entities.HasHeroAttribute(iUnitEntIndex)) {
        let iBuffIndex = Entities.GetBuffByName(iUnitEntIndex, GPropertyConfig.HERO_PROPERTY_BUFF_NAME);
        if (iBuffIndex == -1) return -1;
        return Buffs.GetStackCount(iUnitEntIndex, iBuffIndex);
    }
    return -1;
};

Entities.GetHealthBarWidth = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetHealthBarWidth")), -1);
};

Entities.GetHealthBarHeight = (iUnitEntIndex: EntityIndex) => {
    return FuncHelper.ToFiniteNumber(Number(Entities.GetUnitData(iUnitEntIndex, "GetHealthBarHeight")), -1);
};
Entities.GetLocalizeUnitName = (unitname: string) => {
    return $.Localize("#" + unitname)
};
export class BaseLibExt {
    static Init() {

    }
}