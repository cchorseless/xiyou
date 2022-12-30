
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_rattletrap_rocket_flare = {"ID":"5239","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","FightRecapLevel":"1","AbilitySound":"Hero_Rattletrap.Rocket_Flare.Fire","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCastRange":"0","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3","AbilityCastGestureSlot":"ABSOLUTE","AbilityCooldown":"20.0 18.0 16.0 14.0","AbilityManaCost":"35 40 45 50","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"600"},"02":{"var_type":"FIELD_FLOAT","duration":"6.0"},"03":{"var_type":"FIELD_INTEGER","speed":"2250"},"04":{"var_type":"FIELD_INTEGER","vision_radius":"600"},"05":{"var_type":"FIELD_INTEGER","damage":"80 120 160 200","LinkedSpecialBonus":"special_bonus_unique_clockwerk_2"}}} ;

@registerAbility()
export class ability3_rattletrap_rocket_flare extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "rattletrap_rocket_flare";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_rattletrap_rocket_flare = Data_rattletrap_rocket_flare ;
}
    