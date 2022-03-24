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
export const Data_templar_assassin_trap = { "ID": "5198", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "MaxLevel": "3", "AbilityCastPoint": "0.0", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "0.5", "AbilityManaCost": "0", "AbilityModifierSupportBonus": "100", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "trap_radius": "400" }, "02": { "var_type": "FIELD_FLOAT", "trap_duration": "5.0" }, "03": { "var_type": "FIELD_INTEGER", "trap_bonus_damage": "250 300 350" }, "04": { "var_type": "FIELD_INTEGER", "movement_speed_min": "30" }, "05": { "var_type": "FIELD_INTEGER", "movement_speed_max": "60" }, "06": { "var_type": "FIELD_FLOAT", "trap_max_charge_duration": "4" } } };

@registerAbility()
export class ability4_templar_assassin_trap extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "templar_assassin_trap";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_templar_assassin_trap = Data_templar_assassin_trap;
}
