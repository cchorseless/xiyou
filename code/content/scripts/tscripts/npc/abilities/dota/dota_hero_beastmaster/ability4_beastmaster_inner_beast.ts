
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_beastmaster_inner_beast = {"ID":"5172","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_YES","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"1200"},"02":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"15 25 35 45","LinkedSpecialBonus":"special_bonus_unique_beastmaster_4"},"03":{"var_type":"FIELD_FLOAT","scepter_multiplier":"2"},"04":{"var_type":"FIELD_FLOAT","scepter_duration":"4"},"05":{"var_type":"FIELD_INTEGER","scepter_radius":"1200"},"06":{"var_type":"FIELD_INTEGER","scepter_cooldown":"35"},"07":{"var_type":"FIELD_INTEGER","scepter_manacost":"50"}}} ;

@registerAbility()
export class ability4_beastmaster_inner_beast extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "beastmaster_inner_beast";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_beastmaster_inner_beast = Data_beastmaster_inner_beast ;
}
    