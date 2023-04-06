import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../entityPlus/Base_Plus";

// 回收
@registerAbility()
export class courier_recovery_chess extends BaseAbility_Plus {
    CastFilterResultTarget(target: IBaseNpc_Plus) {
        // if (target.ETRoot == null || !target.ETRoot.AsValid<IBuildingEntityRoot>("BuildingEntityRoot")) {
        //     this.errorStr = "dota_hud_error_only_can_cast_on_building";
        //     return UnitFilterResult.UF_FAIL_CUSTOM;
        // }
        let caster = this.GetCasterPlus();
        if (caster.GetPlayerID() != target.GetPlayerID()) {
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


    ProcsMagicStick() {
        return false;
    }

    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        //  断线不能卖塔（这应该是队友操作的）
        let iPlayerID = caster.GetPlayerID();
        if (PlayerResource.GetConnectionState(iPlayerID) == DOTAConnectionState_t.DOTA_CONNECTION_STATE_DISCONNECTED) {
            return;
        }
        let target = this.GetCursorTarget() as IBaseNpc_Plus;
        let gold_return = this.GetSpecialValueFor("gold_pect") * 0.01;
        GGameScene.GetPlayer(caster.ETRoot.BelongPlayerid).BuildingManager().sellBuilding(target.ETRoot.As<IBuildingEntityRoot>(), gold_return);
    }

}
