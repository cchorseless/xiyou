import { BaseAbility_Plus } from "../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../entityPlus/Base_Plus";


@registerAbility()
export class ability_propertytool extends BaseAbility_Plus {
    static call_level: number;
    static call_key: string;
    static call_ability: EntityIndex;
    static call_unit: EntityIndex;
    static call_func: string;

    GetAbilityTextureName(): string {
        if (ability_propertytool.call_ability != null) {
            let hAbility = EntIndexToHScript(ability_propertytool.call_ability) as IBaseAbility_Plus;
            let iLevel = ability_propertytool.call_ability!;
            let sKeyName = ability_propertytool.call_key!;
            ability_propertytool.call_ability = null;
            ability_propertytool.call_ability = null;
            ability_propertytool.call_key = null;
            if (GFuncEntity.IsValid(hAbility) && hAbility.GetLevelSpecialValueFor != null) {
                switch (sKeyName) {
                    case "cool_down":
                        return tostring(hAbility.GetCooldown(iLevel));
                    case "mana_cost":
                        return tostring(hAbility.GetManaCost(iLevel));
                    case "gold_cost":
                        return tostring(hAbility.GetGoldCost(iLevel));
                    default:
                        return tostring(hAbility.GetLevelSpecialValueFor(sKeyName, iLevel));
                }
            }
            return "";
        }
        if (ability_propertytool.call_unit != null) {
            let hUnit = EntIndexToHScript(ability_propertytool.call_unit) as IBaseNpc_Plus;
            let sFunctionName = ability_propertytool.call_func!;
            ability_propertytool.call_unit = null;
            ability_propertytool.call_func = null;
            let func = (hUnit as any)[sFunctionName];
            if (GFuncEntity.IsValid(hUnit) && func != null && typeof func == "function") {
                return tostring(func());
            }
            return "";
        }
        return "";
    }
}