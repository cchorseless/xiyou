import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";
import { ActiveRootAbility } from "../../ActiveRootAbility";

/** dota原技能数据 */
export const Data_primal_beast_pulverize = {}
@registerAbility()
export class ability6_primal_beast_pulverize extends ActiveRootAbility {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "primal_beast_pulverize";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_primal_beast_pulverize = Data_primal_beast_pulverize ;
}