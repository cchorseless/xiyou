
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
export const Data_spectre_reality = { "ID": "5338", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_POINT", "AbilityType": "DOTA_ABILITY_TYPE_BASIC", "MaxLevel": "1", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_5", "AbilityCastPoint": "0", "AbilityCooldown": "0" };

@registerAbility()
export class ability4_spectre_reality extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "spectre_reality";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_spectre_reality = Data_spectre_reality;
}
