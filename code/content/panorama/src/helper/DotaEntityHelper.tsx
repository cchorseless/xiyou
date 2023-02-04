import { GameProtocol } from "../../../scripts/tscripts/shared/GameProtocol";
import { JsonConfigHelper } from "../../../scripts/tscripts/shared/Gen/JsonConfigHelper";
import { FuncHelper } from "./FuncHelper";
import { KVHelper } from "./KVHelper";


export module AbilityHelper {



    export enum AbilityUpgradeOperator {
        ABILITY_UPGRADES_OP_ADD = 0,
        ABILITY_UPGRADES_OP_MUL = 1
    }

    export enum AbilityUpgradeType {
        ABILITY_UPGRADES_TYPE_SPECIAL_VALUE = 0,
        ABILITY_UPGRADES_TYPE_SPECIAL_VALUE_PROPERTY = 1,
        ABILITY_UPGRADES_TYPE_STATS,
        ABILITY_UPGRADES_TYPE_ABILITY_MECHANICS,
        ABILITY_UPGRADES_TYPE_ADD_ABILITY
    }
    export enum AbilityUpgradeKeyType {
        UPGRADES_KEY_DATA = 0,
        UPGRADES_KEY_CACHED_RESULT = 1
    }

    export enum AbilitySpecialValueTag {
        /**神杖升级 */
        RequiresScepter = "RequiresScepter",
        /**最小值 */
        _min = "_min",
        _max = "_max",
        /** */
        CalculateSpellDamageTooltip = "CalculateSpellDamageTooltip",
    }

    export function isActive(iBehavior: DOTA_ABILITY_BEHAVIOR) {
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

    export function getCastType(iBehavior: DOTA_ABILITY_BEHAVIOR) {
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

    export function getTargetType(iTeam: DOTA_UNIT_TARGET_TEAM, iType: DOTA_UNIT_TARGET_TYPE) {
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

    export function getDamageType(iDamageType: DAMAGE_TYPES) {
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

    export function getSpellImmunity(iSpellImmunityType: SPELL_IMMUNITY_TYPES | string) {
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

    export function SDamageType2IDamageType(sDamageTypes: string) {
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
    export function SBehavior2IBehavior(sBehaviors: string) {
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

    export function STeam2ITeam(sTeams: string) {
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

    export function SType2IType(sTypes: string) {
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
    export function getDispelType(sSpellDispellableType: string) {
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

    export function getCustomAbilityType(sCustomAbilityType: string) {
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

    export function getItemDispelType(sSpellDispellableType: string) {
        if (sSpellDispellableType == "SPELL_DISPELLABLE_YES") {
            return "DOTA_ToolTip_Dispellable_Item_Yes_Soft";
        }
        if (sSpellDispellableType == "SPELL_DISPELLABLE_YES_STRONG") {
            return "DOTA_ToolTip_Dispellable_Item_Yes_Strong";
        }
        return "";
    }

    export function GetSpecialValueUpgrade(iEntityIndex: EntityIndex | any, sAbilityName: string, sSpecialValueName: string, iOperator: AbilityUpgradeOperator) {
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

    export function CalcSpecialValueUpgrade(iEntityIndex: number, sAbilityName: string, sSpecialValueName: string, fValue: number) {
        return fValue;
        // return FuncHelper.ToFloat((fValue + GetSpecialValueUpgrade(iEntityIndex, sAbilityName, sSpecialValueName, AbilityUpgradeOperator.ABILITY_UPGRADES_OP_ADD)) * (1 + GetSpecialValueUpgrade(iEntityIndex, sAbilityName, sSpecialValueName, AbilityUpgradeOperator.ABILITY_UPGRADES_OP_MUL) * 0.01));
    }
    export function AbilityDescriptionCompose(aValues: number[], iLevel: number = -1, bOnlyNowLevelValue: boolean = false) {
        let sTemp = "";
        let sTempPS = "";
        if (iLevel != -1 && bOnlyNowLevelValue && aValues.length > 0) {
            let value = aValues[FuncHelper.Clamp(iLevel, 0, aValues.length - 1)];
            let sValue = FuncHelper.BigNumber.FormatNumber((Math.abs(value)));
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
                let sValue = FuncHelper.BigNumber.FormatNumber((Math.abs(value)));
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

    export function SimplifyValuesArray(aValues: number[]) {
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
    export function GetAbilityDescription({ sStr, abilityName, iLevel, bOnlyNowLevelValue = false }: { sStr: string, abilityName: string, iLevel: number, bOnlyNowLevelValue?: boolean }) {
        let [isitem, tData] = KVHelper.GetAbilityOrItemData(abilityName);
        if (!tData) { return sStr; }
        let aValueNames = Object.keys(tData?.AbilityValues ?? {});
        for (let index = 0; index < aValueNames.length; index++) {
            const sValueName = aValueNames[index];
            let block = new RegExp("%" + sValueName + "%", "g");
            let blockPS = new RegExp("%" + sValueName + "%%", "g");
            let iResult = sStr.search(block);
            let iResultPS = sStr.search(blockPS);
            if (iResult == -1 && iResultPS == -1) continue;
            let aValues = tData.AbilityValues[sValueName].toString().split(" ").map((value: string) => { return Number(value); });
            let [sValues, sValuesPS] = AbilityDescriptionCompose(aValues, iLevel, bOnlyNowLevelValue);
            sStr = sStr.replace(blockPS, sValuesPS);
            sStr = sStr.replace(block, sValues);
        }
        return sStr;
    }
    export function GetAbilityDescriptionByName(sAbilityName: string) {
        const str = $.Localize("#DOTA_Tooltip_ability_" + sAbilityName + "_description");
        return GetAbilityDescription({
            sStr: str,
            abilityName: sAbilityName,
            iLevel: 1
        })
    }

    export function StringToValues(sValues: string) {
        let aStr = sValues.toString().split(" ");
        let aValues = [];
        for (let i = 0; i < aStr.length; i++) {
            let n = Number(aStr[i]);
            if (isFinite(n)) {
                aValues.push(n);
            }
        }
        return SimplifyValuesArray(aValues);
    }
    export function GetSpecialValues(sAbilityName: string, sName: string, iEntityIndex = -1) {
        let [isitem, tKeyValues] = KVHelper.GetAbilityOrItemData(sAbilityName);
        // if (iEntityIndex != -1) {
        //     let aValues = GetAbilityMechanicsUpgradeSpecialValues(iEntityIndex, sAbilityName, sName);
        //     if (aValues != undefined) {
        //         return aValues;
        //     }
        // }
        if (tKeyValues) {
            let tSpecials = tKeyValues.AbilitySpecial;
            if (tSpecials) {
                for (let sIndex in tSpecials) {
                    let tData = tSpecials[sIndex];
                    if (tData[sName] != undefined && tData[sName] != null) {
                        let sType = tData.var_type;
                        let sValues = tData[sName].toString();
                        let aValues = sValues.split(" ");
                        for (let i = 0; i < aValues.length; i++) {
                            let value = Number(aValues[i]);
                            if (sType == "FIELD_INTEGER") {
                                aValues[i] = parseInt(value + "");
                            } else if (sType == "FIELD_FLOAT") {
                                aValues[i] = parseFloat(value.toFixed(6));
                            }
                        }
                        return SimplifyValuesArray(aValues);
                    }
                }
            }
        }

        return [];
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

    const aPropertyNames = [
        "var_type",
        "abilitycastrange",
        "abilitycastpoint",
        "abilityduration",
        "abilitychanneltime",
        "LinkedSpecialBonus",
        "LinkedSpecialBonusField",
        "LinkedSpecialBonusOperation",
        "CalculateSpellDamageTooltip",
        "RequiresScepter",
        "levelkey",
        "_str",
        "_int",
        "_agi",
        "_all",
        "_attack_damage",
        "_attack_speed",
        "_health",
        "_armor",
        "_magical_armor",
        "_mana",
        "_max",
        "_min",
        "_move_speed",
    ];



    export function GetSpecialNames(sAbilityName: string, iEntityIndex = -1) {
        let aSpecials: string[] = [];
        let [isitem, tKeyValues] = KVHelper.GetAbilityOrItemData(sAbilityName);
        if (tKeyValues) {
            let tSpecials = tKeyValues.AbilitySpecial;
            if (tSpecials) {
                let sKey = Object.keys(tSpecials);
                sKey.sort((a, b) => { return Number(a) - Number(b) });
                for (let index = 0; index < sKey.length; index++) {
                    const sIndex = sKey[index];
                    let tData = tSpecials[sIndex];
                    for (let sName in tData) {
                        if (!aPropertyNames.includes(sName)) {
                            aSpecials.push(sName);
                            break;
                        }
                    }
                }
            }
            aSpecials = aSpecials.concat("abilitycastrange", "abilitycastpoint", "abilityduration", "abilitychanneltime", "abilitydamage");
        }
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

    export function GetSpecialVarType(sAbilityName: string, sName: string) {
        let [isitem, tKeyValues] = KVHelper.GetAbilityOrItemData(sAbilityName);
        if (tKeyValues) {
            let tSpecials = tKeyValues.AbilitySpecial;
            if (tSpecials) {
                for (let sIndex in tSpecials) {
                    let tData = tSpecials[sIndex];
                    if (tData[sName] != undefined && tData[sName] != null) {
                        return tData.var_type;
                    }
                }
            }
        }
        return [];
    }

    /**
     * 获取特殊值
     * @param sAbilityName
     * @param sName
     * @param tagname
     * @param iEntityIndex
     * @returns
     */
    export function GetSpecialValueWithTag(sAbilityName: string, sName: string, tagname: AbilitySpecialValueTag | string, iEntityIndex = -1): string {
        let [isitem, tKeyValues] = KVHelper.GetAbilityOrItemData(sAbilityName);
        if (iEntityIndex != -1) {
            // let sPropertyValue = GetAbilityMechanicsUpgradeLevelSpecialValueProperty(iEntityIndex:EntityIndex, sAbilityName, sName, sPropertyName);
            // if (sPropertyValue != undefined) {
            //     return sPropertyValue.toString();
            // }
        }
        if (tKeyValues) {
            let tSpecials = tKeyValues.AbilitySpecial;
            if (tSpecials) {
                for (let sIndex in tSpecials) {
                    let tData = tSpecials[sIndex];
                    if (tData[sName] != null && tData[tagname] != null) {
                        return tData[tagname].toString();
                    }
                }
            }
        }
        return "";
    }

    export function GetSpecialValuePropertyUpgrade(iEntityIndex: EntityIndex, sAbilityName: string, sSpecialValueName: string, sSpecialValueProperty: string, iOperator: AbilityUpgradeOperator) {
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

    export function CalcSpecialValuePropertyUpgrade(iEntityIndex: EntityIndex, sAbilityName: string, sSpecialValueName: string, sSpecialValueProperty: string, fValue: number) {
        return FuncHelper.ToFloat((fValue + GetSpecialValuePropertyUpgrade(iEntityIndex, sAbilityName, sSpecialValueName, sSpecialValueProperty, AbilityUpgradeOperator.ABILITY_UPGRADES_OP_ADD)) * (1 + GetSpecialValuePropertyUpgrade(iEntityIndex, sAbilityName, sSpecialValueName, sSpecialValueProperty, AbilityUpgradeOperator.ABILITY_UPGRADES_OP_MUL) * 0.01));
    }

    export function GetSpecialValuesWithCalculated(sAbilityName: string, sName: string, iEntityIndex: EntityIndex = -1 as EntityIndex) {
        let aOriginalValues = GetSpecialValues(sAbilityName, sName, iEntityIndex);
        // for (let i = 0; i < aOriginalValues.length; i++) {
        //     let v = aOriginalValues[i];
        //     aOriginalValues[i] = CalcSpecialValueUpgrade(iEntityIndex, sAbilityName, sName, v);
        // }
        let aValues = [...aOriginalValues];
        let tAddedValues: { [k: string]: number[] } = {};
        let tAddedFactors: { [k: string]: number[] } = {};
        let aMinValues: number[] = [];
        let aMaxValues: number[] = [];
        let _aMinValues = GetSpecialValueWithTag(sAbilityName, sName, AbilitySpecialValueTag._min, iEntityIndex);
        if (_aMinValues) {
            aMinValues = StringToValues(_aMinValues);
            // for (let i = 0; i < aMinValues.length; i++) {
            //     let v = aMinValues[i];
            //     aMinValues[i] = CalcSpecialValuePropertyUpgrade(iEntityIndex, sAbilityName, sName, "_min", v);
            // }
        }
        let _aMaxValues = GetSpecialValueWithTag(sAbilityName, sName, AbilitySpecialValueTag._max, iEntityIndex);
        if (_aMaxValues) {
            aMaxValues = StringToValues(_aMaxValues);
            // for (let i = 0; i < aMaxValues.length; i++) {
            //     let v = aMaxValues[i];
            //     aMaxValues[i] = CalcSpecialValuePropertyUpgrade(iEntityIndex, sAbilityName, sName, "_max", v);
            // }
        }
        let sType = GetSpecialVarType(sAbilityName, sName);
        let iMaxLevel = aValues.length;
        for (const key in tAddedProperties) {
            const sFuncName = (tAddedProperties as any)[key] as string;
            let func = (UnitHelper as any)[sFuncName];
            if (typeof (func) != "function") continue;
            let sFactors = GetSpecialValueWithTag(sAbilityName, sName, key, iEntityIndex);
            if (sFactors) {
                tAddedValues[key] = [];
                tAddedFactors[key] = [];
                let aFactors = StringToValues(sFactors);
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
    export function ReplaceAbilityValues({ sStr, bShowExtra, sAbilityName, iLevel, iEntityIndex = -1 as EntityIndex, bIsDescription = false, bOnlyNowLevelValue = false }: { sStr: string, bShowExtra: boolean, sAbilityName: string, iLevel: number, iEntityIndex?: EntityIndex, bIsDescription?: boolean, bOnlyNowLevelValue?: boolean; }) {
        let [isitem, tData] = KVHelper.GetAbilityOrItemData(sAbilityName);
        if (!tData) { return sStr }
        let aValueNames = GetSpecialNames(sAbilityName, iEntityIndex);
        for (let index = 0; index < aValueNames.length; index++) {
            const sValueName = aValueNames[index];
            let block = new RegExp("%" + sValueName + "%", "g");
            let blockPS = new RegExp("%" + sValueName + "%%", "g");
            let iResult = sStr.search(block);
            let iResultPS = sStr.search(blockPS);
            if (iResult == -1 && iResultPS == -1) continue;
            let tResult = GetSpecialValuesWithCalculated(sAbilityName, sValueName, iEntityIndex);
            let aValues: number[];
            switch (sValueName) {
                case "abilitycastrange":
                    aValues = StringToValues(tData.AbilityCastRange || "");
                    break;
                case "abilitycastpoint":
                    aValues = StringToValues(tData.AbilityCastPoint || "");
                    break;
                case "abilityduration":
                    aValues = StringToValues(tData.AbilityDuration || "");
                    break;
                case "abilitychanneltime":
                    aValues = StringToValues(tData.AbilityChannelTime || "");
                    break;
                case "abilitydamage":
                    aValues = StringToValues(tData.AbilityDamage || "");
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
                let CalculateSpellDamageTooltip = GetSpecialValueWithTag(sAbilityName, sValueName, AbilitySpecialValueTag.CalculateSpellDamageTooltip, iEntityIndex);
                let bCalculateSpellDamage = CalculateSpellDamageTooltip != undefined ? Number(CalculateSpellDamageTooltip) == 1 : sValueName.indexOf("damage") != -1;
                bCalculateSpellDamage = bCalculateSpellDamage && iEntityIndex && Entities.IsValidEntity(iEntityIndex);
                let fSpellAmplify = UnitHelper.GetSpellAmplify(iEntityIndex) * 0.01;
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
            let [sValues, sValuesPS] = AbilityDescriptionCompose(aValues, iLevel, bOnlyNowLevelValue);
            if (!bIsDescription) {
                if (!bShowExtra || !(iEntityIndex && Entities.IsValidEntity(iEntityIndex))) {
                    let tAddedFactors = tResult.tAddedFactors;
                    Object.keys(tAddedFactors).forEach((key, n) => {
                        const aAddedFactors = tAddedFactors[key];
                        if (aAddedFactors) {
                            if (key == "_ulti") {
                                sValues = sValues.replace("GameplayValues", "UltimateValues");
                            } else {
                                let [sTemp, sTempPS] = AbilityDescriptionCompose(aAddedFactors, iLevel, bOnlyNowLevelValue);
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
                            let [sTemp, sTempPS] = AbilityDescriptionCompose(aAddedValues, iLevel, bOnlyNowLevelValue);
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
                    let [sTemp, sTempPS] = AbilityDescriptionCompose(tResult.aValues, iLevel, bOnlyNowLevelValue);
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
                        let [sTemp, sTempPS] = AbilityDescriptionCompose(tResult.aMinValues, iLevel, bOnlyNowLevelValue);
                        sValues = sValues + "[" + $.Localize("#dota_ability_variable_min") + sTemp + "]";
                        sValuesPS = sValuesPS + "[" + $.Localize("#dota_ability_variable_min") + sTempPS + "]";
                    }
                    if (tResult.aMaxValues) {
                        let [sTemp, sTempPS] = AbilityDescriptionCompose(tResult.aMaxValues, iLevel, bOnlyNowLevelValue);
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


    export function ReplaceAbilityValuesDes({ sStr, sAbilityName, iLevel, iEntityIndex = -1 as EntityIndex }: { sStr: string, sAbilityName: string, iLevel: number, iEntityIndex?: EntityIndex }) {
        let [isitem, tData] = KVHelper.GetAbilityOrItemData(sAbilityName);
        if (!tData) { return sStr }
        let aValueNames = GetSpecialNames(sAbilityName, iEntityIndex);
        for (let index = 0; index < aValueNames.length; index++) {
            const sValueName = aValueNames[index];
            let block = new RegExp("%" + sValueName + "%", "g");
            let blockPS = new RegExp("%" + sValueName + "%%", "g");
            let iResult = sStr.search(block);
            let iResultPS = sStr.search(blockPS);
            if (iResult == -1 && iResultPS == -1) continue;
            // let tResult = GetSpecialValuesWithCalculated(sAbilityName, sValueName, iEntityIndex);
            let aValues: number[] = GetSpecialValues(sAbilityName, sValueName, iEntityIndex);
            switch (sValueName) {
                case "abilitycastrange":
                    aValues = StringToValues(tData.AbilityCastRange || "");
                    break;
                case "abilitycastpoint":
                    aValues = StringToValues(tData.AbilityCastPoint || "");
                    break;
                case "abilityduration":
                    aValues = StringToValues(tData.AbilityDuration || "");
                    break;
                case "abilitychanneltime":
                    aValues = StringToValues(tData.AbilityChannelTime || "");
                    break;
                case "abilitydamage":
                    aValues = StringToValues(tData.AbilityDamage || "");
                    break;
                default:
                    break;
            }
            let [sValues, sValuesPS] = AbilityDescriptionCompose(aValues, iLevel, iLevel != -1);
            sStr = sStr.replace(blockPS, sValuesPS);
            sStr = sStr.replace(block, sValues);
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
    export function GetAbilitySpecialDes(sAbilityName: string, iLevel: number = -1, iEntityIndex: EntityIndex | number = -1) {
        let [isitem, tData] = KVHelper.GetAbilityOrItemData(sAbilityName);
        let r: string[] = [];
        if (!tData) { return r }
        let aValueNames = GetSpecialNames(sAbilityName, iEntityIndex);
        for (let index = 0; index < aValueNames.length; index++) {
            const sValueName = aValueNames[index];
            // let tResult = GetSpecialValuesWithCalculated(sAbilityName, sValueName, iEntityIndex);
            let aValues: number[] = null as any;
            switch (sValueName) {
                case "abilitycastrange":
                    aValues = StringToValues(tData.AbilityCastRange || "");
                    break;
                case "abilitycastpoint":
                    aValues = StringToValues(tData.AbilityCastPoint || "");
                    break;
                case "abilityduration":
                    aValues = StringToValues(tData.AbilityDuration || "");
                    break;
                case "abilitychanneltime":
                    aValues = StringToValues(tData.AbilityChannelTime || "");
                    break;
                case "abilitydamage":
                    aValues = StringToValues(tData.AbilityDamage || "");
                    break;
                default:
                    if (GPropertyConfig.EMODIFIER_PROPERTY[sValueName.toUpperCase() as any] != null) {
                        aValues = GetSpecialValues(sAbilityName, sValueName, iEntityIndex);
                    }
                    break;
            }
            if (aValues == null || aValues.length == 1 && aValues[0] == 0) {
                continue;
            }
            let [sValues, sValuesPS] = AbilityDescriptionCompose(aValues, iLevel, iLevel != -1);
            const isPect = sValueName.toUpperCase().includes("CHANCE") || sValueName.toUpperCase().includes("PERCENTAGE");
            r.push(`${$.Localize(sValueName)} : ${isPect ? sValuesPS : sValues}`)
        }
        return r;
    }

    export function GetAbilityData(iEntityIndex: AbilityEntityIndex, key: string, iLevel = -1) {
        GameEvents.SendEventClientSide(GameProtocol.Protocol.custom_call_get_ability_data as any, {
            ability_entindex: iEntityIndex,
            level: iLevel,
            key_name: key
        });
        let iCasterIndex = Abilities.GetCaster(iEntityIndex);
        let ibuffid = UnitHelper.GetBuffByName(iCasterIndex, GPropertyConfig.UNIT_PROPERTY_BUFF_NAME);
        if (ibuffid != -1) {
            return Buffs.GetTexture(iCasterIndex, ibuffid as BuffID);
        }
        return "";
    };

    export function GetLevelCooldown(iEntityIndex: AbilityEntityIndex, iLevel = -1) {
        let sCooldown = GetAbilityData(iEntityIndex, "cool_down", iLevel)
        if (sCooldown == "") {
            let sAbilityName = Abilities.GetAbilityName(iEntityIndex);
            let [isitem, tData] = KVHelper.GetAbilityOrItemData(sAbilityName);
            if (tData) {
                if (iLevel == -1) iLevel = Abilities.GetLevel(iEntityIndex) - 1;
                let aCooldowns = StringToValues(tData.AbilityCooldown || "");
                if (iLevel >= 0 && aCooldowns.length > 0) {
                    return aCooldowns[Math.min(iLevel, aCooldowns.length - 1)];
                }
            }
            return 0;
        }
        return GToNumber(sCooldown);
    };

    export function GetLevelManaCost(iEntityIndex: AbilityEntityIndex, iLevel = -1) {
        let sManaCost = GetAbilityData(iEntityIndex, "mana_cost", iLevel)
        if (sManaCost == "") {
            let sAbilityName = Abilities.GetAbilityName(iEntityIndex);
            let [isitem, tData] = KVHelper.GetAbilityOrItemData(sAbilityName);
            if (tData) {
                if (iLevel == -1) iLevel = Abilities.GetLevel(iEntityIndex) - 1;
                let aManaCosts = StringToValues(tData.AbilityManaCost || "");
                if (iLevel >= 0 && aManaCosts.length > 0) {
                    return aManaCosts[Math.min(iLevel, aManaCosts.length - 1)];
                }
            }
            return 0;
        }
        return GToNumber(sManaCost);
    };
    export function GetLevelGoldCost(iEntityIndex: AbilityEntityIndex, iLevel = -1) {
        let sGoldCost = GetAbilityData(iEntityIndex, "gold_cost", iLevel)
        if (sGoldCost == "") {
            let sAbilityName = Abilities.GetAbilityName(iEntityIndex);
            let [isitem, tData] = KVHelper.GetAbilityOrItemData(sAbilityName);
            if (tData) {
                if (iLevel == -1) iLevel = Abilities.GetLevel(iEntityIndex) - 1;
                let aGoldCosts = StringToValues(tData.AbilityGoldCost || "");
                if (iLevel >= 0 && aGoldCosts.length > 0) {
                    return aGoldCosts[Math.min(iLevel, aGoldCosts.length - 1)];
                }
            }
            return 0;
        }
        return GToNumber(sGoldCost);
    };
    export function GetLevelEnergyCost(iEntityIndex: AbilityEntityIndex, iLevel = -1) {
        let sEnergyCost = GetAbilityData(iEntityIndex, "energy_cost", iLevel)
        if (sEnergyCost == "") {
            let sAbilityName = Abilities.GetAbilityName(iEntityIndex);
            let [isitem, tData] = KVHelper.GetAbilityOrItemData(sAbilityName);
            if (tData) {
                if (iLevel == -1) iLevel = Abilities.GetLevel(iEntityIndex) - 1;
                let aEnergyCosts = StringToValues(tData.AbilityEnergyCost || "");
                if (iLevel >= 0 && aEnergyCosts.length > 0) {
                    return aEnergyCosts[Math.min(iLevel, aEnergyCosts.length - 1)];
                }
            }
            return 0;
        }
        return GToNumber(sEnergyCost);
    };


    export function GetAbilityIndex(iEntityIndex: EntityIndex, iAbilityEntIndex: AbilityEntityIndex) {
        for (let i = 0; i < Entities.GetAbilityCount(iEntityIndex); i++) {
            const _iAbilityEntIndex = Entities.GetAbility(iEntityIndex, i);
            if (_iAbilityEntIndex == iAbilityEntIndex) {
                return i;
            }
        }
        return -1;
    };



}



export module UnitHelper {

    export function GetCursorUnit(iTeam: number = -1) {
        let vPosCursor = GameUI.GetCursorPosition();
        let world_position = GameUI.GetScreenWorldPosition(vPosCursor);
        if (world_position == null) {
            return -1;
        }
        let targets = GameUI.FindScreenEntities(vPosCursor);
        targets = targets.filter(e => e.accurateCollision);
        if (iTeam != -1) {
            targets.filter(e => Entities.GetTeamNumber(e.entityIndex) == iTeam);
        }
        targets = targets.filter(e => (!Entities.IsIllusion(e.entityIndex)) && (Entities.GetClassname(e.entityIndex) == "npc_dota_creature" || Entities.IsRealHero(e.entityIndex)) && Entities.IsInventoryEnabled(e.entityIndex));
        if (targets.length == 0) {
            return -1;
        }
        targets.sort((a, b) => Game.Length2D(Entities.GetAbsOrigin(a.entityIndex), world_position!) - Game.Length2D(Entities.GetAbsOrigin(b.entityIndex), world_position!));
        return targets[0].entityIndex;
    };

    export function GetAbilityIndex(iEntityIndex: EntityIndex, iAbilityEntIndex: AbilityEntityIndex) {
        for (let i = 0; i < Entities.GetAbilityCount(iEntityIndex); i++) {
            const _iAbilityEntIndex = Entities.GetAbility(iEntityIndex, i);
            if (_iAbilityEntIndex == iAbilityEntIndex) {
                return i;
            }
        }
        return -1;
    };

    export function HasBuff(unitEntIndex: EntityIndex, buffName: string) {
        for (let index = 0; index < Entities.GetNumBuffs(unitEntIndex); index++) {
            let buff = Entities.GetBuff(unitEntIndex, index);
            if (Buffs.GetName(unitEntIndex, buff) == buffName)
                return true;
        }
        return false;
    };

    export function GetUnitRarety(unitname: string): Rarity {
        let unitobj = KVHelper.KVUnits()[unitname];
        if (unitobj && unitobj.Rarity) {
            return unitobj.Rarity as Rarity
        }
        return ("A") as Rarity;
    };

    export function GetAttackSpeedPercent(iUnitEntIndex: EntityIndex) {
        return Entities.GetAttackSpeed(iUnitEntIndex) * 100;
    };



    export function GetMoveSpeed(iUnitEntIndex: EntityIndex) {
        return Entities.GetMoveSpeedModifier(iUnitEntIndex, Entities.GetBaseMoveSpeed(iUnitEntIndex));
    };
    export function GetUltiPower(iUnitEntIndex: EntityIndex) {
        return GetUnitData(iUnitEntIndex, "GetUltiPower");
    };

    export function GetMaximumAttackSpeed(iUnitEntIndex: EntityIndex) {
        return GToNumber(GetUnitData(iUnitEntIndex, "GetMaximumAttackSpeed"));
    };
    export function GetBuffByName(iUnitEntIndex: EntityIndex, buffName: string) {
        const count = Entities.GetNumBuffs(iUnitEntIndex);
        for (let i = 0; i < count; i++) {
            const buffid = Entities.GetBuff(iUnitEntIndex, i);
            if (Buffs.GetName(iUnitEntIndex, buffid) == buffName) {
                return buffid;
            }
        }
        return -1 as BuffID;
    };

    export function GetUnitData(iUnitEntIndex: EntityIndex, sFuncName: string) {
        GameEvents.SendEventClientSide(GameProtocol.Protocol.custom_call_get_unit_data as any, {
            unit_entindex: iUnitEntIndex,
            func_name: sFuncName,
        });
        let ibuffid = GetBuffByName(iUnitEntIndex, GPropertyConfig.UNIT_PROPERTY_BUFF_NAME);
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

    export function GetCustomMaxHealth(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetHealth")));
    };
    export function GetBaseAttackDamage(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetBaseAttackDamage")));
    };
    export function GetAttackDamage(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetAttackDamage")));
    };
    export function GetPhysicalCriticalStrikeChance(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetPhysicalCriticalStrikeChance")));
    };
    export function GetCastRange(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetCastRange")));
    };
    export function GetBaseArmor(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetBaseArmor")));
    };
    export function GetArmor(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetArmor")));
    };
    export function GetBaseMagicalArmor(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetBaseMagicalArmor")));
    };
    export function GetMagicalArmor(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetMagicalArmor")));
    };
    export function GetBaseSpellAmplify(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetBaseSpellAmplify")));
    };
    export function GetSpellAmplify(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetSpellAmplify")));
    };
    export function GetSpellLifeStealPercent(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetSpellLifeStealPercent")));
    };
    export function GetLifeStealPercent(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetLifeStealPercent")));
    };
    export function GetOutgoingDamagePercent(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetOutgoingDamagePercent")));
    };
    export function GetOutgoingPhysicalDamagePercent(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetOutgoingPhysicalDamagePercent")));
    };
    export function GetOutgoingMagicalDamagePercent(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetOutgoingMagicalDamagePercent")));
    };
    export function GetOutgoingPureDamagePercent(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetOutgoingPureDamagePercent")));
    };
    export function GetIgnorePhysicalArmorPercentage(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetIgnorePhysicalArmorPercentage")));
    };
    export function GetManaRegen(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetManaRegen")));
    };
    export function GetIgnoreMagicalArmorPercentage(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetIgnoreMagicalArmorPercentage")));
    };
    export function GetCriticalStrikeChance(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetCriticalStrikeChance")));
    };
    export function GetCriticalStrikeDamage(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetCriticalStrikeDamage")));
    };
    export function GetSpellCriticalStrikeChance(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetSpellCriticalStrikeChance")));
    };
    export function GetEnergyRegenPercentage(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetEnergyRegenPercentage")));
    };
    export function GetSpellCriticalStrikeDamage(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetSpellCriticalStrikeDamage")));
    };
    export function GetPhysicalArmor(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetPhysicalArmor")));
    };
    export function GetBasePhysicalArmor(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetBasePhysicalArmor")));
    };
    export function GetStatusResistance(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetStatusResistance")));
    };
    export function GetEvasion(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetEvasion")));
    };
    export function GetCooldownReduction(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetCooldownReduction")));
    };
    export function HasHeroAttribute(iUnitEntIndex: EntityIndex) {
        return HasBuff(iUnitEntIndex, GPropertyConfig.HERO_PROPERTY_BUFF_NAME);
    };
    export function GetBaseStrength(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetBaseStrength")));
    };
    export function GetStrength(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetStrength")));
    };
    export function GetBaseAgility(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetBaseAgility")));
    };
    export function GetAgility(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetAgility")));
    };
    export function GetBaseIntellect(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetBaseIntellect")));
    };
    export function GetIntellect(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetIntellect")));
    };
    export function GetAllStats(iUnitEntIndex: EntityIndex) {
        return GetStrength(iUnitEntIndex) + GetAgility(iUnitEntIndex) + GetIntellect(iUnitEntIndex);
    };
    export function GetBaseAllStats(iUnitEntIndex: EntityIndex) {
        return GetBaseStrength(iUnitEntIndex) + GetBaseAgility(iUnitEntIndex) + GetBaseIntellect(iUnitEntIndex);
    };
    export function GetPrimaryAttribute(iUnitEntIndex: EntityIndex) {
        if (HasHeroAttribute(iUnitEntIndex)) {
            let iBuffIndex = GetBuffByName(iUnitEntIndex, GPropertyConfig.HERO_PROPERTY_BUFF_NAME);
            if (iBuffIndex == -1) return -1;
            return Buffs.GetStackCount(iUnitEntIndex, iBuffIndex);
        }
        return -1;
    };

    export function GetHealthBarWidth(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetHealthBarWidth")), -1);
    };

    export function GetHealthBarHeight(iUnitEntIndex: EntityIndex) {
        return FuncHelper.ToFiniteNumber(Number(GetUnitData(iUnitEntIndex, "GetHealthBarHeight")), -1);
    };
}



export module ItemHelper {
    export function IsItemLocked(iItemEntIndex: ItemEntityIndex) {
        // let tData = CustomNetTables.GetTableValue("items", iItemEntIndex.toString());

        // if (tData && typeof (tData.bLocked) == "number") {
        //     return tData.bLocked == 1;
        // }

        return false;
    }
    export function GetItemValue(sItemName: string, sKeyName: string) {
        let tItemKeyValues = KVHelper.KVItems()[sItemName];
        if (tItemKeyValues) {
            return tItemKeyValues[sKeyName];
        }
        return;
    }

    export function GetItemCost(sItemName: string) {
        return Number(GetItemValue(sItemName, "ItemCost")) || 0;
    }
    export function GetItemRarity(sItemName: string) {
        return GetItemValue(sItemName, "Rarity") || "A";
    }
    export function GetItemRarityNumber(sItemName: string) {
        return JsonConfigHelper.ToRarityNumber(GetItemValue(sItemName, "Rarity") as any);
    }

    export function GetItemRecipes(sItemName: string) {
        let aList = [];
        let sItemRecipe = GetItemValue(sItemName, "ItemRecipe");
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

    export function GetItemRelatedRecipes(sItemName: string) {
        let aList = [];
        let ItemsKv = KVHelper.KVItems()
        for (const _sItemName in ItemsKv) {
            let aRecipes = GetItemRecipes(_sItemName);
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

    export function GetItemRelatedRecipesWithResults(sItemName: string) {
        let aList = [];
        let aResults = [];
        let ItemsKv = KVHelper.KVItems()
        for (const _sItemName in ItemsKv) {
            let aRecipes = GetItemRecipes(_sItemName);
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

    export function GetItemName(item: string | ItemEntityIndex) {
        let sItemName: string;
        if (typeof (item) == "string") {
            sItemName = item;
        } else {
            sItemName = Abilities.GetAbilityName(item);
        }
        return sItemName;
    }
    /**
     * 获取物品木材价格
     * @param item 物品名字或者index
     * @returns 返回物品价格
     */
    export function GetItemWoodCost(item: string | ItemEntityIndex) {
        let sItemName = GetItemName(item);
        let total = Number(GetItemValue(sItemName, "WoodCost")) || 0;
        if (typeof (item) != "string") {
            if (Items.IsStackable(item)) {
                total *= Items.GetCurrentCharges(item) / Items.GetInitialCharges(item);
            }
        }
        return total;
    }

    /**
     * 获取物品挑战点数价格
     * @param item 物品名字或者index
     * @returns 返回物品价格
     */
    export function GetItemPointCost(item: string | ItemEntityIndex) {
        let sItemName = GetItemName(item);
        let total = Number(GetItemValue(sItemName, "PointCost")) || 0;
        if (typeof (item) != "string") {
            if (Items.IsStackable(item)) {
                total *= Items.GetCurrentCharges(item) / Items.GetInitialCharges(item);
            }
        }
        return total;
    }

    /**
     * 获取物品糖果价格
     * @param item 物品名字或者index
     * @returns 返回物品价格
     */
    export function GetItemSoulCrystalCost(item: string | ItemEntityIndex) {
        let sItemName = GetItemName(item);
        let total = Number(GetItemValue(sItemName, "SoulCrystalCost")) || 0;
        if (typeof (item) != "string") {
            if (Items.IsStackable(item)) {
                total *= Items.GetCurrentCharges(item) / Items.GetInitialCharges(item);
            }
        }
        return total;
    }

    /**
     * 获取物品对应等级的价格
     * @param sItemName 物品名字
     * @param iLevel 物品等级
     * @returns 返回物品价格
     */
    export function GetItemCostLV(sItemName: string, iLevel: number) {
        if (iLevel >= 1 && iLevel <= 5) {
            return Number(GetItemValue(sItemName, "ItemCost" + iLevel)) || GetItemCost(sItemName) || 0;
        } else {
            return GetItemCost(sItemName);
        }
    }
    /**
     * 物品是否可以合成
     * @param iItemIndex 物品实体index
     */
    export function IsCombinable(iItemIndex: ItemEntityIndex) {
        return false;
        // const data = CustomNetTables.GetTableValue("common", "artifact");
        // const tLocalArtifacts = (data && (data[Players.GetLocalPlayer()])) ?? {};
        // const bCanCombine4Star = (() => {
        //     for (let i = 0; i < CustomUIConfig.ConfigsKV.artifact.PLAYER_MAX_ARTIFACT_WITH_EXTRA; i++) {
        //         let itemIndex: ItemEntityIndex | undefined = tLocalArtifacts[i + 1];
        //         if (itemIndex != undefined && Abilities.GetAbilityName(itemIndex) == "item_artifact_demagicking_maul") {
        //             return true;
        //         }
        //     }
        // })();
        // return IsUpgradable(iItemIndex)
        //     && CustomUIConfig.ItemsKv[Abilities.GetAbilityName(iItemIndex)].Combinable == 1
        //     && (bCanCombine4Star ? (Abilities.GetLevel(iItemIndex) < 5) : (Abilities.GetLevel(iItemIndex) < 4));
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
    // /**
    //  * 物品是否可以重铸
    //  * @param iItemIndex 物品实体index 物品名
    //  */
    // export function IsRemakable(item: string | ItemEntityIndex) {
    //     let sItemName = GetItemName(item);
    //     return Boolean(tRemakeItem2Group[sItemName]);
    // }

    export function IsHeroUniqueItem(iItemIndex: ItemEntityIndex) {
        return GetItemValue(Abilities.GetAbilityName(iItemIndex), "hero") != undefined;
    }


    /**
     * 物品是否是多级物品
     * @param item 物品名 | 实体index
     */
    export function IsMultiLevelItem(item: ItemEntityIndex | string) {
        if (item == -1 || item == "") {
            return false;
        }
        let sItemName = GetItemName(item);
        let ItemsKv = KVHelper.KVItems()
        let data = ItemsKv[sItemName];
        if (data == null) {
            return false;
        }
        return (typeof (data.ItemBaseLevel) == "number" && typeof (data.MaxUpgradeLevel) == "number");
    }

    /**
     * 物品是否可以升级，必须是多级物品
     * @param iItemIndex 物品实体index
     */
    export function IsUpgradable(iItemIndex: ItemEntityIndex) {
        if (!IsMultiLevelItem(iItemIndex)) {
            return false;
        }
        let ItemsKv = KVHelper.KVItems()
        let data = ItemsKv[Abilities.GetAbilityName(iItemIndex)];
        if (Abilities.GetLevel(iItemIndex) >= (Number(data.MaxUpgradeLevel) ?? 0)) {
            return false;
        }
        return true;
    }

}