
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_gyrocopter_rocket_barrage = {"ID":"5361","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","HasShardUpgrade":"1","AbilityCastRange":"0","AbilityCastPoint":"0","AbilityCooldown":"7.0 6.5 6 5.5","AbilityDuration":"3","AbilityManaCost":"90","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"400"},"02":{"var_type":"FIELD_INTEGER","rockets_per_second":"10"},"03":{"var_type":"FIELD_INTEGER","rocket_damage":"7 12 17 22","LinkedSpecialBonus":"special_bonus_unique_gyrocopter_3"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_gyrocopter_rocket_barrage extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "gyrocopter_rocket_barrage";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_gyrocopter_rocket_barrage = Data_gyrocopter_rocket_barrage ;
}
    