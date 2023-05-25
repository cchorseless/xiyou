import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../entityPlus/Base_Plus";

// 回收
@registerAbility()
export class courier_recovery_chess extends BaseAbility_Plus {

    CastFilterResultTarget(target: IBaseNpc_Plus) {
        let caster = this.GetCasterPlus();
        if (caster.GetPlayerID() != target.GetPlayerID()) {
            return UnitFilterResult.UF_FAIL_NOT_PLAYER_CONTROLLED;
        }
        if (target.HasModifier("modifier_building")) {
            return UnitFilterResult.UF_SUCCESS
        }
        else {
            return UnitFilterResult.UF_FAIL_NOT_PLAYER_CONTROLLED;
        }
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
