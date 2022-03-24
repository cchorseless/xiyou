
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_lich_sinister_gaze = {"ID":"7325","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_CHANNELLED | DOTA_ABILITY_BEHAVIOR_DONT_CANCEL_CHANNEL","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","HasScepterUpgrade":"1","AbilityChannelTime":"1.4 1.7 2.0 2.3","AbilityCooldown":"24 22 20 18","AbilityManaCost":"120 130 140 150","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"1.4 1.7 2.0 2.3"},"02":{"var_type":"FIELD_INTEGER","destination":"32 38 44 50"},"03":{"var_type":"FIELD_INTEGER","mana_drain":"10 15 20 25"},"04":{"var_type":"FIELD_INTEGER","cast_range":"500 525 550 575"},"05":{"var_type":"FIELD_INTEGER","aoe_scepter":"400","RequiresScepter":"1"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_lich_sinister_gaze extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lich_sinister_gaze";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lich_sinister_gaze = Data_lich_sinister_gaze ;
}
    