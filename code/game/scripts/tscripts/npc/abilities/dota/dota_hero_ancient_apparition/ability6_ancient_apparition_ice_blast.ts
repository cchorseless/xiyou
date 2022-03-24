
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_ancient_apparition_ice_blast = {"ID":"5348","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"2","AbilitySound":"Hero_Ancient_Apparition.IceBlast.Target","AbilityCastPoint":"0.01 0.01 0.01","AbilityCastRange":"0","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"40.0","AbilityManaCost":"175","AbilityDamage":"250 350 450","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius_min":"275"},"02":{"var_type":"FIELD_FLOAT","radius_grow":"50.0"},"03":{"var_type":"FIELD_INTEGER","radius_max":"1000"},"04":{"var_type":"FIELD_INTEGER","path_radius":"275"},"05":{"var_type":"FIELD_FLOAT","frostbite_duration":"10 11 12"},"06":{"var_type":"FIELD_FLOAT","dot_damage":"12.5 20.0 32.0"},"07":{"var_type":"FIELD_INTEGER","speed":"1500 1500 1500 1500"},"08":{"var_type":"FIELD_FLOAT","kill_pct":"12 13 14","LinkedSpecialBonus":"special_bonus_unique_ancient_apparition_5"},"09":{"var_type":"FIELD_INTEGER","target_sight_radius":"500 500 500"}}} ;

@registerAbility()
export class ability6_ancient_apparition_ice_blast extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "ancient_apparition_ice_blast";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_ancient_apparition_ice_blast = Data_ancient_apparition_ice_blast ;
}
    