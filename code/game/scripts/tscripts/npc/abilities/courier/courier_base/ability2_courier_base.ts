import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { LogHelper } from "../../../../helper/LogHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";
import { modifier_task } from "../../../modifier/modifier_task";

/**删除 */
@registerAbility()
export class ability2_courier_base extends BaseAbility_Plus {

    GetBehavior() {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET
    }

    GetAbilityTargetTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH
    }

    GetAbilityTargetType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
    }

    GetCooldown() {
        return 0
    }

    GetManaCost() {
        return 0
    }

    OnSpellStart() {
        LogHelper.print("OnSpellStart")
        let target = this.GetCursorTarget() as BaseNpc_Plus;
        target.SafeDestroy()
    }



}
