
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_troll_warlord_berserkers_rage = {"ID":"5508","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_TOGGLE | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","AbilitySound":"Hero_TrollWarlord.BerserkersRage.Toggle","AbilityCastPoint":"0.2 0.2 0.2 0.2","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_hp":"0"},"02":{"var_type":"FIELD_INTEGER","bonus_move_speed":"15 25 35 45"},"03":{"var_type":"FIELD_INTEGER","bonus_armor":"4 5 6 7"},"04":{"var_type":"FIELD_INTEGER","bonus_range":"350"},"05":{"var_type":"FIELD_FLOAT","base_attack_time":"1.45"},"07":{"var_type":"FIELD_INTEGER","ensnare_chance":"14 16 18 20"},"08":{"var_type":"FIELD_FLOAT","ensnare_duration":"0.8 1.2 1.6 2.0"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_troll_warlord_berserkers_rage extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "troll_warlord_berserkers_rage";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_troll_warlord_berserkers_rage = Data_troll_warlord_berserkers_rage ;
}
    