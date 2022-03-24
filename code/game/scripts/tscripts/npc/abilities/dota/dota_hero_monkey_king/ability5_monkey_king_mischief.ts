
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_monkey_king_mischief = {"ID":"5719","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE","FightRecapLevel":"2","MaxLevel":"1","AbilitySound":"Hero_MonkeyKing.Transform.On","AbilityCastPoint":"0","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"15","AbilityManaCost":"0 0 0 0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","movespeed":"200"},"02":{"var_type":"FIELD_INTEGER","reveal_radius":"200"},"03":{"var_type":"FIELD_FLOAT","invul_duration":"0.2"}}} ;

@registerAbility()
export class ability5_monkey_king_mischief extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "monkey_king_mischief";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_monkey_king_mischief = Data_monkey_king_mischief ;
}
    