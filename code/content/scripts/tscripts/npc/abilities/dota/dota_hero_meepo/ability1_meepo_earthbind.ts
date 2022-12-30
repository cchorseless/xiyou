
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_meepo_earthbind = {"ID":"5430","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_Meepo.Earthbind.Cast","AbilityCastRange":"500 750 1000 1250","AbilityCastPoint":"0.3","AbilityCooldown":"20 16 12 8","AbilityManaCost":"100","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"2.0"},"02":{"var_type":"FIELD_INTEGER","radius":"220"},"03":{"var_type":"FIELD_INTEGER","speed":"900"},"04":{"var_type":"FIELD_INTEGER","abilitycastrange":"","LinkedSpecialBonus":"special_bonus_unique_meepo_4"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_meepo_earthbind extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "meepo_earthbind";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_meepo_earthbind = Data_meepo_earthbind ;
}
    