
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_weaver_the_swarm = {"ID":"5289","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitDamageType":"DAMAGE_TYPE_PHYSICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilitySound":"Hero_Weaver.Swarm.Cast","HasShardUpgrade":"1","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCastRange":"3000","AbilityCooldown":"44 36 28 20","AbilityManaCost":"110","AbilityModifierSupportValue":"0.2","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage":"18 20 22 24"},"02":{"var_type":"FIELD_FLOAT","attack_rate":"1.15 1.0 0.85 0.7"},"03":{"var_type":"FIELD_INTEGER","count":"12 12 12 12"},"04":{"var_type":"FIELD_FLOAT","armor_reduction":"1 1 1 1","LinkedSpecialBonus":"special_bonus_unique_weaver_3"},"05":{"var_type":"FIELD_FLOAT","duration":"16"},"06":{"var_type":"FIELD_INTEGER","destroy_attacks":"8 8 8 8","LinkedSpecialBonus":"special_bonus_unique_weaver_4"},"07":{"var_type":"FIELD_INTEGER","radius":"100 100 100 100"},"08":{"var_type":"FIELD_INTEGER","speed":"600 600 600 600"},"09":{"var_type":"FIELD_INTEGER","spawn_radius":"300 300 300 300"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_weaver_the_swarm extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "weaver_the_swarm";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_weaver_the_swarm = Data_weaver_the_swarm ;
}
    