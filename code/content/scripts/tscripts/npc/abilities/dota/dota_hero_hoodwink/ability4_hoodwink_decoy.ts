
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_hoodwink_decoy = {"ID":"8107","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","IsGrantedByShard":"1","HasShardUpgrade":"1","MaxLevel":"1","AbilityCastPoint":"0","AbilityCooldown":"60.0","AbilityManaCost":"50","AbilityCastRange":"0","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"12.0"},"02":{"var_type":"FIELD_INTEGER","decoy_detonate_radius":"250"},"03":{"var_type":"FIELD_FLOAT","decoy_stun_duration":"1.0"},"04":{"var_type":"FIELD_INTEGER","images_do_damage_percent":"-100"},"05":{"var_type":"FIELD_INTEGER","images_take_damage_percent":"100"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability4_hoodwink_decoy extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "hoodwink_decoy";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_hoodwink_decoy = Data_hoodwink_decoy ;
}
    