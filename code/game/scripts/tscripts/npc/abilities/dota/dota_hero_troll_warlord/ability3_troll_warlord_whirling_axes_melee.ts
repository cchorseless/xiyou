
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_troll_warlord_whirling_axes_melee = {"ID":"5510","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_TrollWarlord.WhirlingAxes.Melee","HasScepterUpgrade":"1","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3","AbilityCastGestureSlot":"DEFAULT","AbilityCastPoint":"0.0","AbilityCooldown":"9","AbilityManaCost":"50","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage":"50 100 150 200","LinkedSpecialBonus":"special_bonus_unique_troll_warlord_3"},"02":{"var_type":"FIELD_INTEGER","hit_radius":"100"},"03":{"var_type":"FIELD_FLOAT","max_range":"450.0"},"04":{"var_type":"FIELD_INTEGER","axe_movement_speed":"1250"},"05":{"var_type":"FIELD_FLOAT","blind_duration":"5"},"06":{"var_type":"FIELD_INTEGER","blind_pct":"60"},"07":{"var_type":"FIELD_FLOAT","whirl_duration":"3.0"},"08":{"var_type":"FIELD_FLOAT","scepter_cooldown":"4"}}} ;

@registerAbility()
export class ability3_troll_warlord_whirling_axes_melee extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "troll_warlord_whirling_axes_melee";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_troll_warlord_whirling_axes_melee = Data_troll_warlord_whirling_axes_melee ;
}
    