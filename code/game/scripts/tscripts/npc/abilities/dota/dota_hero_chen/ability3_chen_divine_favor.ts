
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_chen_divine_favor = {"ID":"7306","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_YES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_MAGIC_IMMUNE_ALLIES","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"1","AbilitySound":"Hero_Chen.TestOfFaith.Target","HasShardUpgrade":"1","AbilityCastPoint":"0.2","AbilityCastRange":"600","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","heal_amp":"6 10 14 18"},"02":{"var_type":"FIELD_FLOAT","heal_rate":"1.25 2.5 3.75 5"},"03":{"var_type":"FIELD_INTEGER","aura_radius":"1200"},"04":{"var_type":"FIELD_FLOAT","teleport_delay":"6"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability3_chen_divine_favor extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "chen_divine_favor";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_chen_divine_favor = Data_chen_divine_favor ;
}
    