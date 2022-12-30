
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_ancient_apparition_chilling_touch = {"ID":"5347","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AUTOCAST | DOTA_ABILITY_BEHAVIOR_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySound":"Hero_Ancient_Apparition.ChillingTouchCast","HasScepterUpgrade":"1","AbilityCooldown":"15 11 7 3","AbilityManaCost":"30 45 60 75","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage":"50 90 130 170","LinkedSpecialBonus":"special_bonus_unique_ancient_apparition_2"},"02":{"var_type":"FIELD_INTEGER","slow":"100"},"03":{"var_type":"FIELD_FLOAT","duration":"0.5"},"04":{"var_type":"FIELD_INTEGER","attack_range_bonus":"60 120 180 240"}}} ;

@registerAbility()
export class ability3_ancient_apparition_chilling_touch extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "ancient_apparition_chilling_touch";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_ancient_apparition_chilling_touch = Data_ancient_apparition_chilling_touch ;
}
    