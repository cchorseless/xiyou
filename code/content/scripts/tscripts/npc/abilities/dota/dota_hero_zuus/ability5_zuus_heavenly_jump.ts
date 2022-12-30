
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_zuus_heavenly_jump = { "ID": "641", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_TREE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "MaxLevel": "1", "FightRecapLevel": "1", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCastGestureSlot": "DEFAULT", "AbilityCooldown": "6", "AbilityManaCost": "75", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "hop_distance": "350" }, "02": { "var_type": "FIELD_FLOAT", "hop_duration": "0.5" }, "03": { "var_type": "FIELD_INTEGER", "hop_height": "250" } } };

@registerAbility()
export class ability5_zuus_heavenly_jump extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "zuus_heavenly_jump";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_zuus_heavenly_jump = Data_zuus_heavenly_jump;
}
