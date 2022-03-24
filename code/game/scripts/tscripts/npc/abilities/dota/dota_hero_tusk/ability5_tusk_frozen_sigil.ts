
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_tusk_frozen_sigil = {"ID":"5567","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","AbilitySound":"Hero_Tusk.FrozenSigil","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByShard":"1","AbilityCastPoint":"0.1","AbilityCooldown":"30.0","AbilityManaCost":"70","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","sigil_radius":"650"},"02":{"var_type":"FIELD_FLOAT","sigil_duration":"25.0"},"03":{"var_type":"FIELD_INTEGER","move_slow":"40"},"04":{"var_type":"FIELD_INTEGER","attack_slow":"0"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_6"} ;

@registerAbility()
export class ability5_tusk_frozen_sigil extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tusk_frozen_sigil";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tusk_frozen_sigil = Data_tusk_frozen_sigil ;
}
    