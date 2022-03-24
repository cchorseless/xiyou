
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_tidehunter_anchor_smash = {"ID":"5120","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityUnitDamageType":"DAMAGE_TYPE_PHYSICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_Tidehunter.AnchorSmash","HasShardUpgrade":"1","AbilityCastRange":"375","AbilityCastPoint":"0.4","AbilityCooldown":"7.0 6.0 5.0 4.0","AbilityManaCost":"30 40 50 60","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","attack_damage":"45 90 135 180"},"02":{"var_type":"FIELD_INTEGER","damage_reduction":"-30 -40 -50 -60","LinkedSpecialBonus":"special_bonus_unique_tidehunter_3","CalculateSpellDamageTooltip":"0"},"03":{"var_type":"FIELD_FLOAT","reduction_duration":"6.0 6.0 6.0 6.0"},"04":{"var_type":"FIELD_INTEGER","radius":"375"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_tidehunter_anchor_smash extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tidehunter_anchor_smash";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tidehunter_anchor_smash = Data_tidehunter_anchor_smash ;
}
    