import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_nevermore_necromastery = { "ID": "5062", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "OnCastbar": "0", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "necromastery_damage_per_soul": "1 2 3 4", "CalculateSpellDamageTooltip": "0", "LinkedSpecialBonus": "special_bonus_unique_nevermore_1" }, "02": { "var_type": "FIELD_INTEGER", "necromastery_max_souls": "11 14 17 20", "LinkedSpecialBonus": "special_bonus_unique_nevermore_4" }, "03": { "var_type": "FIELD_FLOAT", "necromastery_soul_release": "0.6" }, "04": { "var_type": "FIELD_INTEGER", "necromastery_max_souls_scepter": "25", "RequiresScepter": "1" } } };

@registerAbility()
export class ability4_nevermore_necromastery extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "nevermore_necromastery";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_nevermore_necromastery = Data_nevermore_necromastery;
}
