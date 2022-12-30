
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_earth_spirit_petrify = {"ID":"5648","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_CUSTOM","AbilityUnitTargetType":"DOTA_UNIT_TARGET_CUSTOM","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByScepter":"1","AbilitySound":"Hero_EarthSpirit.Petrify","HasScepterUpgrade":"1","AbilityCastRange":"125","AbilityCastPoint":"0.2","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_5","AbilityCooldown":"45","AbilityManaCost":"150","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"3","RequiresScepter":"1"},"02":{"var_type":"FIELD_FLOAT","damage":"450","RequiresScepter":"1"},"03":{"var_type":"FIELD_FLOAT","aoe":"450","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability5_earth_spirit_petrify extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "earth_spirit_petrify";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_earth_spirit_petrify = Data_earth_spirit_petrify ;
}
    