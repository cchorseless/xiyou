
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_rattletrap_hookshot = {"ID":"5240","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","FightRecapLevel":"2","AbilitySound":"Hero_Rattletrap.Hookshot.Fire","HasScepterUpgrade":"1","AbilityDraftUltScepterAbility":"rattletrap_overclocking","AbilityDraftUltShardAbility":"rattletrap_jetpack","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCastRange":"2000 2500 3000","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"60.0 45.0 30.0","AbilityManaCost":"150 150 150","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","latch_radius":"125 125 125"},"02":{"var_type":"FIELD_INTEGER","stun_radius":"175 175 175"},"03":{"var_type":"FIELD_FLOAT","duration":"1.5 1.75 2.0"},"04":{"var_type":"FIELD_INTEGER","speed":"4000 5000 6000"},"05":{"var_type":"FIELD_INTEGER","damage":"75 175 275"},"06":{"var_type":"FIELD_FLOAT","cooldown_scepter":"12.0 12.0 12.0","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability6_rattletrap_hookshot extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "rattletrap_hookshot";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_rattletrap_hookshot = Data_rattletrap_hookshot ;
}
    