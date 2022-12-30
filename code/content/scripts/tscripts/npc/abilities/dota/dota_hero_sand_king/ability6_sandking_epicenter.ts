
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_sandking_epicenter = {"ID":"5105","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"2","AbilitySound":"Ability.SandKing_Epicenter","HasShardUpgrade":"1","AbilityCooldown":"120 110 100","AbilityDuration":"3.0","AbilityCastPoint":"2.0","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityChannelAnimation":"ACT_DOTA_CHANNEL_ABILITY_4","AbilityManaCost":"150 225 300","AbilityModifierSupportValue":"0.2","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","epicenter_radius":"500 525 550 575 600 625 650 675 700 725 750 775 800 825"},"02":{"var_type":"FIELD_INTEGER","epicenter_pulses":"6 8 10","LinkedSpecialBonus":"special_bonus_unique_sand_king"},"03":{"var_type":"FIELD_INTEGER","epicenter_damage":"110 120 130","LinkedSpecialBonus":"special_bonus_unique_sand_king_5"},"04":{"var_type":"FIELD_INTEGER","epicenter_slow":"-30 -30 -30"},"05":{"var_type":"FIELD_INTEGER","epicenter_slow_as":"-30","LinkedSpecialBonus":"special_bonus_unique_sand_king_3"}}} ;

@registerAbility()
export class ability6_sandking_epicenter extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "sandking_epicenter";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_sandking_epicenter = Data_sandking_epicenter ;
}
    