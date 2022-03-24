
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_furion_sprout = {"ID":"5245","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_POINT","FightRecapLevel":"1","AbilitySound":"Hero_Furion.Sprout","HasShardUpgrade":"1","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_BOTH","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS","AbilityCastRange":"625 700 775 850","AbilityCastPoint":"0.35","AbilityCooldown":"11 10 9 8","AbilityManaCost":"70 90 110 130","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","vision_range":"500"},"02":{"var_type":"FIELD_FLOAT","duration":"3 4 5 6"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_furion_sprout extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "furion_sprout";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_furion_sprout = Data_furion_sprout ;
}
    