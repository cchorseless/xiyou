
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_hoodwink_hunters_boomerang = {"ID":"9627","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_BOTH","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_VengefulSpirit.MagicMissile","MaxLevel":"1","IsGrantedByScepter":"1","HasScepterUpgrade":"1","AbilityCastRange":"1000","AbilityCastPoint":"0.2","AbilityCooldown":"18","AbilityManaCost":"125","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","max_throw_duration":"1.2"},"01":{"var_type":"FIELD_INTEGER","speed":"900"},"02":{"var_type":"FIELD_INTEGER","radius":"150"},"03":{"var_type":"FIELD_INTEGER","damage":"350"},"04":{"var_type":"FIELD_FLOAT","mark_duration":"7.0"},"05":{"var_type":"FIELD_INTEGER","slow_pct":"20"},"06":{"var_type":"FIELD_INTEGER","spell_amp":"25"},"07":{"var_type":"FIELD_INTEGER","status_resistance":"25"},"08":{"var_type":"FIELD_INTEGER","spread":"400"},"09":{"var_type":"FIELD_FLOAT","min_throw_duration":"0.5"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability5_hoodwink_hunters_boomerang extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "hoodwink_hunters_boomerang";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_hoodwink_hunters_boomerang = Data_hoodwink_hunters_boomerang ;
}
    