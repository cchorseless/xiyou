
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_alchemist_berserk_potion = {"ID":"642","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_YES","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByShard":"1","HasShardUpgrade":"1","AbilityCastRange":"800","AbilityCastPoint":"0.2","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"35","AbilityManaCost":"125","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"10"},"02":{"var_type":"FIELD_INTEGER","attack_speed":"50"},"03":{"var_type":"FIELD_INTEGER","hp_regen":"40"},"04":{"var_type":"FIELD_INTEGER","movement_speed":"900"}}} ;

@registerAbility()
export class ability4_alchemist_berserk_potion extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "alchemist_berserk_potion";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_alchemist_berserk_potion = Data_alchemist_berserk_potion ;
}
    