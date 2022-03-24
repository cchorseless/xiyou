
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_invoker_forge_spirit = {"ID":"5387","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","MaxLevel":"1","HotKeyOverride":"F","AbilitySound":"Hero_Invoker.ForgeSpirit","AbilityCooldown":"30","AbilityManaCost":"75","AbilityCastPoint":"0.05","AbilityCastAnimation":"ACT_INVALID","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","spirit_damage":"22 32 42 52 62 72 82 92","levelkey":"exortlevel"},"02":{"var_type":"FIELD_INTEGER","spirit_mana":"100 150 200 250 300 350 400 450","levelkey":"exortlevel"},"03":{"var_type":"FIELD_INTEGER","spirit_armor":"0 1 2 3 4 5 6 7","levelkey":"exortlevel"},"04":{"var_type":"FIELD_FLOAT","spirit_attack_range":"300 365 430 495 560 625 690 755","levelkey":"quaslevel"},"05":{"var_type":"FIELD_INTEGER","spirit_hp":"300 400 500 600 700 800 900 1000","levelkey":"quaslevel"},"06":{"var_type":"FIELD_FLOAT","spirit_duration":"20 30 40 50 60 70 80 90","levelkey":"quaslevel"}}} ;

@registerAbility()
export class ability14_invoker_forge_spirit extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "invoker_forge_spirit";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_invoker_forge_spirit = Data_invoker_forge_spirit ;
}
    