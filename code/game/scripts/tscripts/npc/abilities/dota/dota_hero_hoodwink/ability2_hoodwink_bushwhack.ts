
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_hoodwink_bushwhack = {"ID":"8158","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE","AbilityUnitTargetType":"DOTA_UNIT_TARGET_TREE | DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_CREEP","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","AbilityCastRange":"1000","AbilityCastPoint":"0.2","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2","AbilityCooldown":"14","AbilityManaCost":"90 100 110 120","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","trap_radius":"265"},"02":{"var_type":"FIELD_FLOAT","debuff_duration":"1.5 1.8 2.1 2.4"},"03":{"var_type":"FIELD_INTEGER","projectile_speed":"1200"},"04":{"var_type":"FIELD_INTEGER","total_damage":"75 150 225 300"},"05":{"var_type":"FIELD_FLOAT","animation_rate":"0.3"},"06":{"var_type":"FIELD_INTEGER","visual_height":"50"}}} ;

@registerAbility()
export class ability2_hoodwink_bushwhack extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "hoodwink_bushwhack";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_hoodwink_bushwhack = Data_hoodwink_bushwhack ;
}
    