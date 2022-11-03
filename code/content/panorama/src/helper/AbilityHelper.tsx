import { FuncHelper } from "./FuncHelper";

export module AbilityHelper {

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

    export function AbilityDescriptionCompose(aValues: number[], iLevel: number = -1, bOnlyNowLevelValue: boolean = false) {
        let sTemp = "";
        let sTempPS = "";
        if (iLevel != -1 && bOnlyNowLevelValue && aValues.length > 0) {
            let value = aValues[FuncHelper.Clamp(iLevel, 0, aValues.length - 1)];
            let sValue = FuncHelper.BigNumber.FormatNumber((Math.abs(value)));
            let sValuePS = sValue + "%";
            sTemp = "<span class='GameplayVariable GameplayVariable'>" + sValue + "</span>";
            sTempPS = "<span class='GameplayVariable GameplayVariable'>" + sValuePS + "</span>";
        } else {
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

    export function GetAbilityDescription({ sStr, sheetConfig, abilityName, iLevel, bOnlyNowLevelValue = false }: { sStr: string, sheetConfig: any, abilityName: string, iLevel: number, bOnlyNowLevelValue?: boolean }) {
        let tData = sheetConfig[abilityName];
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
        let tAbilityKeyValues = CustomUIConfig.AbilitiesKv[sAbilityName];
        let tItemKeyValues = CustomUIConfig.ItemsKv[sAbilityName];
        let tKeyValues = tAbilityKeyValues || tItemKeyValues;

        if (iEntityIndex != -1) {
            let aValues = GetAbilityMechanicsUpgradeSpecialValues(iEntityIndex, sAbilityName, sName);
            if (aValues != undefined) {
                return aValues;
            }
        }

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
                                aValues[i] = parseInt(value);
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
    export function GetSpecialNames(sheetConfig: any, sAbilityName: string, iEntityIndex = -1) {
        let aSpecials: string[] = [];
        let tKeyValues = sheetConfig[sAbilityName];
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
        // todo
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
    export function GetSpecialValueProperty(sheetConfig: any, sAbilityName: string, sName: string, sPropertyName: string, iEntityIndex = -1): string {
        let tKeyValues = sheetConfig[sAbilityName];
        if (iEntityIndex != -1) {
            // let sPropertyValue = GetAbilityMechanicsUpgradeLevelSpecialValueProperty(iEntityIndex, sAbilityName, sName, sPropertyName);
            // if (sPropertyValue != undefined) {
            //     return sPropertyValue.toString();
            // }
        }
        if (tKeyValues) {
            let tSpecials = tKeyValues.AbilitySpecial;
            if (tSpecials) {
                for (let sIndex in tSpecials) {
                    let tData = tSpecials[sIndex];
                    if (tData[sName] != undefined && tData[sName] != null) {
                        if (tData[sPropertyName] != undefined && tData[sPropertyName] != null) {
                            return tData[sPropertyName].toString();
                        }
                    }
                }
            }
        }
        return "";
    }
    export function GetSpecialValuesWithCalculated(sAbilityName: string, sName: string, iEntityIndex = -1) {
        let aOriginalValues = GetSpecialValues(sAbilityName, sName, iEntityIndex);
        for (let i = 0; i < aOriginalValues.length; i++) {
            let v = aOriginalValues[i];
            aOriginalValues[i] = CalcSpecialValueUpgrade(iEntityIndex, sAbilityName, sName, v);
        }
        let aValues = JSON.parse(JSON.stringify(aOriginalValues));
        let tAddedValues = {};
        let tAddedFactors = {};
        let aMinValues = GetSpecialValueProperty(sAbilityName, sName, "_min", iEntityIndex);
        if (aMinValues) {
            aMinValues = StringToValues(aMinValues);
            for (let i = 0; i < aMinValues.length; i++) {
                let v = aMinValues[i];
                aMinValues[i] = CalcSpecialValuePropertyUpgrade(iEntityIndex, sAbilityName, sName, "_min", v);
            }
        }
        let aMaxValues = GetSpecialValueProperty(sAbilityName, sName, "_max", iEntityIndex);
        if (aMaxValues) {
            aMaxValues = StringToValues(aMaxValues);
            for (let i = 0; i < aMaxValues.length; i++) {
                let v = aMaxValues[i];
                aMaxValues[i] = CalcSpecialValuePropertyUpgrade(iEntityIndex, sAbilityName, sName, "_max", v);
            }
        }
        let sType = GetSpecialVarType(sAbilityName, sName);
        let iMaxLevel = aValues.length;
        for (const key in tAddedProperties) {
            const sFuncName = tAddedProperties[key];
            let func = Entities[sFuncName];
            if (typeof (func) != "function") continue;
            let sFactors = GetSpecialValueProperty(sAbilityName, sName, key, iEntityIndex);
            if (sFactors) {
                tAddedValues[key] = [];
                tAddedFactors[key] = [];
                let aFactors = StringToValues(sFactors);
                iMaxLevel = Math.max(aFactors.length, iMaxLevel);
                for (let i = 0; i < Math.max(aFactors.length, aValues.length); i++) {
                    let factor = aFactors[Clamp(i, 0, aFactors.length - 1)];
                    factor = CalcSpecialValuePropertyUpgrade(iEntityIndex, sAbilityName, sName, key, factor);
                    tAddedFactors[key][i] = factor;
                    let addedValue = factor * Entities[sFuncName](iEntityIndex);
                    if (sType == "FIELD_INTEGER") {
                        addedValue = parseInt(addedValue);
                    } else if (sType == "FIELD_FLOAT") {
                        addedValue = Float(addedValue);
                    }
                    tAddedValues[key][i] = addedValue;
                }
            } else {
                let extra_factor = GetSpecialValuePropertyUpgrade(iEntityIndex, sAbilityName, sName, key, AbilityUpgradeOperator.ABILITY_UPGRADES_OP_ADD);
                if (extra_factor != 0) {
                    tAddedValues[key] = [];
                    tAddedFactors[key] = [];
                    for (let i = 0; i < aValues.length; i++) {
                        let factor = extra_factor;
                        tAddedFactors[key][i] = factor;
                        let addedValue = factor * Entities[sFuncName](iEntityIndex);
                        if (sType == "FIELD_INTEGER") {
                            addedValue = parseInt(addedValue);
                        } else if (sType == "FIELD_FLOAT") {
                            addedValue = Float(addedValue);
                        }
                        tAddedValues[key][i] = addedValue;
                    }
                }
            }
        }
        Object.keys(tAddedValues).forEach(key => {
            let aNewValues = JSON.parse(JSON.stringify(aValues));
            for (let i = 0; i < iMaxLevel; i++) {
                let value = aValues[Clamp(i, 0, aValues.length - 1)] || 0;
                value = value + tAddedValues[key][Clamp(i, 0, tAddedValues[key].length - 1)];
                aNewValues[i] = value;
            }
            aValues = aNewValues;
        });

        if (aMinValues) {
            for (let i = 0; i < aValues.length; i++) {
                aValues[i] = Math.max(aValues[i], aMinValues[Clamp(i, 0, aMinValues.length - 1)]);
            }
        }

        if (aMaxValues) {
            for (let i = 0; i < aValues.length; i++) {
                aValues[i] = Math.min(aValues[i], aMaxValues[Clamp(i, 0, aMaxValues.length - 1)]);
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
    export function ReplaceAbilityValues({ sStr, sheetConfig, bShowExtra, sAbilityName, iLevel, iEntityIndex = -1 as EntityIndex, bIsDescription = false, bOnlyNowLevelValue = false }: { sStr: string, sheetConfig: any, bShowExtra: boolean, sAbilityName: string, iLevel: number, iEntityIndex?: EntityIndex, bIsDescription?: boolean, bOnlyNowLevelValue?: boolean; }) {
        let tData = sheetConfig[sAbilityName];
        if (!tData) { return sStr }
        let aValueNames = GetSpecialNames(sheetConfig, sAbilityName, iEntityIndex);
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
                let CalculateSpellDamageTooltip = GetSpecialValueProperty(sAbilityName, sValueName, "CalculateSpellDamageTooltip", iEntityIndex);
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
}