import { GameEnum } from "../../../../GameEnum";
import { EntityHelper } from "../../../../helper/EntityHelper";
import { LogHelper } from "../../../../helper/LogHelper";
import { BuildingEntityRoot } from "../../../../rules/Components/Building/BuildingEntityRoot";
import { RoundSystem } from "../../../../rules/System/Round/RoundSystem";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

// 回收
@registerAbility()
export class courier_recovery_chess extends BaseAbility_Plus {
    CastFilterResultTarget(target: BaseNpc_Plus) {
        // if (target.ETRoot == null || !target.ETRoot.AsValid<BuildingEntityRoot>("BuildingEntityRoot")) {
        //     this.errorStr = "dota_hud_error_only_can_cast_on_building";
        //     return UnitFilterResult.UF_FAIL_CUSTOM;
        // }
        let caster = this.GetCasterPlus();
        if (caster.GetPlayerOwnerID() != target.GetPlayerOwnerID()) {
            return UnitFilterResult.UF_FAIL_NOT_PLAYER_CONTROLLED;
        }
        return UnitFilter(
            target,
            DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY,
            DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE,
            caster.GetTeamNumber()
        );
    }

    GetChannelTime() {
        if (IsInToolsMode()) {
            return 0.01;
        } else {
            return super.GetChannelTime();
        }
    }

    OnChannelFinish(bInterrupted: boolean) {
        if (bInterrupted) {
            return;
        }
        let caster = this.GetCasterPlus();
        //  断线不能卖塔（这应该是队友操作的）
        let iPlayerID = caster.GetPlayerOwnerID();
        if (PlayerResource.GetConnectionState(iPlayerID) == DOTAConnectionState_t.DOTA_CONNECTION_STATE_DISCONNECTED) {
            return;
        }
        let target = this.GetCursorTarget() as BaseNpc_Plus;
        let gold_return = this.GetSpecialValueFor("gold_return");
        caster.ETRoot.AsPlayer().BuildingManager().sellBuilding(target.ETRoot.As<BuildingEntityRoot>());
    }

    ProcsMagicStick() {
        return false;
    }

    OnUpgrade() {
        if (this.GetLevel() == 1) {
            this.ToggleAutoCast();
        }
    }
}
