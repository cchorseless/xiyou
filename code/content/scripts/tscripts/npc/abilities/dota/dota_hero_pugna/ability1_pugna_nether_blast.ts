
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_pugna_nether_blast = {"ID":"5186","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","FightRecapLevel":"1","AbilitySound":"Hero_Pugna.NetherBlast","AbilityCastRange":"400","AbilityCastPoint":"0.2 0.2 0.2 0.2","AbilityCooldown":"5","AbilityManaCost":"85 105 125 145","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","structure_damage_mod":"0.5"},"02":{"var_type":"FIELD_FLOAT","delay":"0.8"},"03":{"var_type":"FIELD_INTEGER","radius":"400 400 400 400"},"04":{"var_type":"FIELD_INTEGER","blast_damage":"100 175 250 325","LinkedSpecialBonus":"special_bonus_unique_pugna_2"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_pugna_nether_blast extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "pugna_nether_blast";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_pugna_nether_blast = Data_pugna_nether_blast ;
}
    