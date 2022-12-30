
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_ancient_apparition_ice_vortex = {"ID":"5346","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilitySound":"Hero_Ancient_Apparition.IceVortexCast","HasShardUpgrade":"1","AbilityCastAnimation":"ACT_DOTA_ICE_VORTEX","AbilityCastGestureSlot":"DEFAULT","AbilityCastRange":"1500 1500 1500 1500","AbilityCastPoint":"0.01 0.01 0.01 0.01","AbilityCooldown":"7 6 5 4","AbilityDuration":"16","AbilityManaCost":"40 50 60 70","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"275 275 275 275"},"02":{"var_type":"FIELD_INTEGER","drag_speed":"40 50 60 70"},"03":{"var_type":"FIELD_INTEGER","movement_speed_pct":"-15 -20 -25 -30","LinkedSpecialBonus":"special_bonus_unique_ancient_apparition_4"},"04":{"var_type":"FIELD_INTEGER","spell_resist_pct":"-15 -20 -25 -30","LinkedSpecialBonus":"special_bonus_unique_ancient_apparition_4"},"05":{"var_type":"FIELD_INTEGER","vision_aoe":"200 200 200 200"},"06":{"var_type":"FIELD_INTEGER","vortex_duration":"16"}}} ;

@registerAbility()
export class ability2_ancient_apparition_ice_vortex extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "ancient_apparition_ice_vortex";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_ancient_apparition_ice_vortex = Data_ancient_apparition_ice_vortex ;
}
    