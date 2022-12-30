
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_visage_silent_as_the_grave = {"ID":"683","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","MaxLevel":"1","IsGrantedByScepter":"1","HasScepterUpgrade":"1","AbilityCastPoint":"0.0","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_5","AbilityCastGestureSlot":"DEFAULT","AbilityCooldown":"45.0","AbilityManaCost":"100","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","bonus_duration":"4"},"02":{"var_type":"FIELD_INTEGER","bonus_damage":"30"},"03":{"var_type":"FIELD_FLOAT","invis_duration":"35.0"}}} ;

@registerAbility()
export class ability5_visage_silent_as_the_grave extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "visage_silent_as_the_grave";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_visage_silent_as_the_grave = Data_visage_silent_as_the_grave ;
}
    