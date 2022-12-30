
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_earth_spirit_stone_caller = {"ID":"5611","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityType":"DOTA_ABILITY_TYPE_BASIC","MaxLevel":"1","AbilitySound":"Hero_EarthSpirit.StoneRemnant.Impact","HasShardUpgrade":"1","AbilityCastAnimation":"ACT_DOTA_ES_STONE_CALLER","AbilityCastGestureSlot":"DEFAULT","AbilityCastRange":"1100","AbilityCastPoint":"0.0","HasScepterUpgrade":"1","AbilityCooldown":"0.0","AbilityCharges":"7","AbilityChargeRestoreTime":"25","AbilityManaCost":"0","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"60.0"}}} ;

@registerAbility()
export class ability4_earth_spirit_stone_caller extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "earth_spirit_stone_caller";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_earth_spirit_stone_caller = Data_earth_spirit_stone_caller ;
}
    