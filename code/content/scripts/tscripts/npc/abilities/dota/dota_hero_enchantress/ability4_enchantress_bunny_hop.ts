
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_enchantress_bunny_hop = {"ID":"320","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitTargetType":"DOTA_UNIT_TARGET_TREE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByScepter":"1","HasScepterUpgrade":"1","AbilitySound":"Hero_Enchantress.EnchantCreep","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCastGestureSlot":"DEFAULT","AbilityCooldown":"5","AbilityManaCost":"50","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","hop_distance":"500","RequiresScepter":"1"},"02":{"var_type":"FIELD_FLOAT","hop_duration":"0.4","RequiresScepter":"1"},"03":{"var_type":"FIELD_INTEGER","hop_height":"150","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability4_enchantress_bunny_hop extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "enchantress_bunny_hop";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_enchantress_bunny_hop = Data_enchantress_bunny_hop ;
}
    