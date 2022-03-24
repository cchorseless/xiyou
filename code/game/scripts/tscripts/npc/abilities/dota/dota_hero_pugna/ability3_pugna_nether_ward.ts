
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_pugna_nether_ward = {"ID":"5188","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","FightRecapLevel":"1","AbilitySound":"Hero_Pugna.NetherWard","AbilityCastPoint":"0.2 0.2 0.2 0.2","AbilityCastRange":"150","AbilityCooldown":"35.0 35.0 35.0 35.0","AbilityDuration":"18 22 26 30","AbilityManaCost":"80 80 80 80","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"1600"},"02":{"var_type":"FIELD_INTEGER","base_damage":"50"},"03":{"var_type":"FIELD_FLOAT","mana_multiplier":"1.0 1.25 1.50 1.75","LinkedSpecialBonus":"special_bonus_unique_pugna_3"},"04":{"var_type":"FIELD_FLOAT","mana_regen":"-0.6 -0.8 -1.0 -1.2"},"05":{"var_type":"FIELD_INTEGER","attacks_to_destroy_tooltip":"4 4 4 4","LinkedSpecialBonus":"special_bonus_unique_pugna_6"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_pugna_nether_ward extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "pugna_nether_ward";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_pugna_nether_ward = Data_pugna_nether_ward ;
}
    