
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_abaddon_borrowed_time = {"ID":"5588","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"2","AbilitySound":"Hero_Abaddon.BorrowedTime","HasShardUpgrade":"0","HasScepterUpgrade":"1","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCastGestureSlot":"ABSOLUTE","AbilityCooldown":"60.0 50.0 40.0","AbilityManaCost":"0 0 0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","hp_threshold":"400"},"02":{"var_type":"FIELD_FLOAT","duration":"4.0 5.0 6.0"},"03":{"var_type":"FIELD_FLOAT","duration_scepter":"7 8 9","RequiresScepter":"1"},"04":{"var_type":"FIELD_INTEGER","ally_threshold_scepter":"525","RequiresScepter":"1"},"05":{"var_type":"FIELD_INTEGER","redirect_range_scepter":"1600","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability6_abaddon_borrowed_time extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "abaddon_borrowed_time";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_abaddon_borrowed_time = Data_abaddon_borrowed_time ;
}
    