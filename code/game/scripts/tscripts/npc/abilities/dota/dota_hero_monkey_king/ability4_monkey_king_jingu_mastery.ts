import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_monkey_king_jingu_mastery = { "ID": "5723", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_MonkeyKing.IronCudgel", "AbilityCastAnimation": "ACT_INVALID", "AbilityCooldown": "0", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "required_hits": "4" }, "02": { "var_type": "FIELD_INTEGER", "counter_duration": "7 8 9 10" }, "03": { "var_type": "FIELD_INTEGER", "charges": "4" }, "04": { "var_type": "FIELD_INTEGER", "bonus_damage": "40 70 100 130", "LinkedSpecialBonus": "special_bonus_unique_monkey_king_2" }, "05": { "var_type": "FIELD_INTEGER", "lifesteal": "15 30 45 60" }, "06": { "var_type": "FIELD_INTEGER", "max_duration": "35" } } };

@registerAbility()
export class ability4_monkey_king_jingu_mastery extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "monkey_king_jingu_mastery";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_monkey_king_jingu_mastery = Data_monkey_king_jingu_mastery;
}
