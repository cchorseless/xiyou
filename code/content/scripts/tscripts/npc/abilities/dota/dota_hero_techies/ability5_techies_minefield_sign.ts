
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_techies_minefield_sign = {"ID":"5644","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitDamageType":"DAMAGE_TYPE_NONE","MaxLevel":"1","HasScepterUpgrade":"1","AbilityCastRange":"10","AbilityCastPoint":"0.0 0.0 0.0 0.0","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"360.0","AbilityManaCost":"0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","aura_radius":"125","RequiresScepter":"1"},"02":{"var_type":"FIELD_INTEGER","lifetime":"180"}}} ;

@registerAbility()
export class ability5_techies_minefield_sign extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "techies_minefield_sign";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_techies_minefield_sign = Data_techies_minefield_sign ;
}
    