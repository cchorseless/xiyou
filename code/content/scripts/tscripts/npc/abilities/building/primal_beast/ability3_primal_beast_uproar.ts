import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";
import { ActiveRootAbility } from "../../ActiveRootAbility";

/** dota原技能数据 */
export const Data_primal_beast_uproar = {}
@registerAbility()
export class ability3_primal_beast_uproar extends ActiveRootAbility {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "primal_beast_uproar";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_primal_beast_uproar = Data_primal_beast_uproar ;
}