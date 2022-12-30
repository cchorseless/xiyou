
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_visage_gravekeepers_cloak = {"ID":"5482","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","HasShardUpgrade":"1","AbilityDraftPreAbility":"visage_summon_familiars_stone_form","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","max_layers":"4","LinkedSpecialBonus":"special_bonus_unique_visage_5"},"02":{"var_type":"FIELD_INTEGER","damage_reduction":"8 12 16 20"},"03":{"var_type":"FIELD_INTEGER","recovery_time":"6 5 4 3"},"04":{"var_type":"FIELD_INTEGER","minimum_damage":"40"},"05":{"var_type":"FIELD_INTEGER","radius":"1200"},"06":{"var_type":"FIELD_INTEGER","max_damage_reduction":"80"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_visage_gravekeepers_cloak extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "visage_gravekeepers_cloak";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_visage_gravekeepers_cloak = Data_visage_gravekeepers_cloak ;
}
    