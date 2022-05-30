import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_jump } from "../../../npc/modifier/modifier_jump";
import { ET, registerET } from "../../Entity/Entity";
import { ChessControlConfig } from "../../System/ChessControl/ChessControlConfig";
import { PlayerCreateUnitEntityRoot } from "../Player/PlayerCreateUnitEntityRoot";

@registerET()
export class ChessComponent extends ET.Component {
    public ChessVector: ChessControlConfig.ChessVector;

    onAwake(): void {
        this.updateBoardPos();
        let domain = this.GetDomain<BaseNpc_Plus>();
        domain.SetForwardVector(Vector(0, 1, 0));
        // this.updateForward();
    }
    updateBoardPos() {
        let location = this.GetDomain<BaseNpc_Plus>().GetAbsOrigin();
        this.ChessVector = GameRules.Addon.ETRoot.ChessControlSystem().GetBoardLocalVector2(location);
    }

    updateForward(position: Vector) {
        let domain = this.GetDomain<BaseNpc_Plus>();
        domain.SetForwardVector(((position - domain.GetAbsOrigin()) as Vector).Normalized());
        domain.MoveToPosition(position);
    }
    isInBattle() {
        return this.ChessVector.y >= 1;
    }

    isInBoard() {
        let location = this.GetDomain<BaseNpc_Plus>().GetAbsOrigin();
        let playerid = this.GetDomain<BaseNpc_Plus>().ETRoot.As<PlayerCreateUnitEntityRoot>().Playerid;
        return GameRules.Addon.ETRoot.ChessControlSystem().IsInBoard(playerid, location);
    }
    isInBaseRoom() {
        let location = this.GetDomain<BaseNpc_Plus>().GetAbsOrigin();
        return GameRules.Addon.ETRoot.ChessControlSystem().IsInBaseRoom(location);
    }

    blink_start_p: Vector;
    blink_stop_count: number;
    is_moving: boolean;
    is_removing: boolean;
    transfer_chess: boolean;
    public blinkChessX(v: Vector) {
        let domain = this.GetDomain<BaseNpc_Plus>();
        domain.Stop();
        domain.SetForwardVector(((v - domain.GetAbsOrigin()) as Vector).Normalized());
        domain.MoveToPosition(v);
        this.RemoveMovingModifier();
        modifier_jump.applyOnly(domain, domain, null, {
            vx: v.x,
            vy: v.y,
        });
        this.blink_start_p = domain.GetAbsOrigin();
        this.blink_stop_count = 0;
        // TimerHelper.addTimer(0.1, () => {

        // }, this, true);
    }

    RemoveMovingModifier() {
        let domain = this.GetDomain<BaseNpc_Plus>();
        modifier_jump.remove(domain);
    }
}
