
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_visage_summon_familiars = {"ID":"5483","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","HasScepterUpgrade":"1","AbilityDraftUltScepterAbility":"visage_silent_as_the_grave","AbilitySound":"Hero_Visage.SummonFamiliars.Cast","AbilityCastPoint":"0 0 0","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"130","AbilityManaCost":"150 150 150","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","familiar_hp":"500 600 700"},"02":{"var_type":"FIELD_INTEGER","familiar_armor":"0 1 2"},"03":{"var_type":"FIELD_INTEGER","familiar_speed":"430","LinkedSpecialBonus":"special_bonus_unique_visage_2"},"04":{"var_type":"FIELD_INTEGER","familiar_attack_damage":"25 50 75"},"05":{"var_type":"FIELD_INTEGER","tooltip_scepter_total_familiars":"3","LinkedSpecialBonus":"special_bonus_unique_visage_6","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability6_visage_summon_familiars extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "visage_summon_familiars";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_visage_summon_familiars = Data_visage_summon_familiars ;
}
    