
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_lich_ice_spire = {"ID":"8028","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilitySound":"Ability.FrostNova","MaxLevel":"1","IsShardUpgrade":"1","IsGrantedByShard":"1","AbilityCastRange":"750","AbilityCastPoint":"0.3","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_5","AbilityCastGestureSlot":"DEFAULT","AbilityCooldown":"25","AbilityManaCost":"150","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_movespeed":"-30"},"02":{"var_type":"FIELD_INTEGER","aura_radius":"750"},"03":{"var_type":"FIELD_INTEGER","max_hero_attacks":"2"},"04":{"var_type":"FIELD_FLOAT","duration":"15.0"},"05":{"var_type":"FIELD_FLOAT","slow_duration":"0.5"}}} ;

@registerAbility()
export class ability4_lich_ice_spire extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lich_ice_spire";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lich_ice_spire = Data_lich_ice_spire ;
}
    