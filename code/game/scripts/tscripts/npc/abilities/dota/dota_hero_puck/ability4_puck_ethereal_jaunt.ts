import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_puck_ethereal_jaunt = { "ID": "5070", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES", "AbilitySound": "Hero_Puck.EtherealJaunt", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityCastAnimation": "ACT_INVALID" };

@registerAbility()
export class ability4_puck_ethereal_jaunt extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "puck_ethereal_jaunt";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_puck_ethereal_jaunt = Data_puck_ethereal_jaunt;
}
