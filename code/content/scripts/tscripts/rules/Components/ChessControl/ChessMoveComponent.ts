
import { GameFunc } from "../../../GameFunc";
import { modifier_jump } from "../../../npc/modifier/modifier_jump";
import { modifier_run } from "../../../npc/modifier/modifier_run";
import { ChessControlConfig } from "../../../shared/ChessControlConfig";
import { ET } from "../../../shared/lib/Entity";
import { GEventHelper } from "../../../shared/lib/GEventHelper";
import { ChessVector } from "./ChessVector";

@GReloadable
export class ChessMoveComponent extends ET.Component {
    public ChessVector: ChessVector;
    readonly isAlive: boolean = true;
    onAwake(): void {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        domain.SetForwardVector(Vector(0, 1, 0));
        this.updateBoardPos();
        let etroot = domain.ETRoot.As<IBattleUnitEntityRoot>()
        if (etroot.IsBuilding()) {
            this.setMoving(false);
        }
    }


    updateBoardPos() {
        let location = this.GetDomain<IBaseNpc_Plus>().GetAbsOrigin();
        this.ChessVector = GChessControlSystem.GetInstance().GetBoardLocalVector2(location);
    }

    updateForward(position: Vector) {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        domain.SetForwardVector(((position - domain.GetAbsOrigin()) as Vector).Normalized());
        domain.MoveToPosition(position);
    }
    changeAliveState(state: boolean) {
        (this.isAlive as any) = state;
    }

    isInBoardAndBattle() {
        return this.ChessVector.y >= 1 && this.isInBoard();
    }

    isInBattleAlive() {
        return this.isInBattle() && this.isAlive;
    }

    isInBattle() {
        return !this.ChessVector.isY(0);
    }

    isInBoard() {
        let location = this.GetDomain<IBaseNpc_Plus>().GetAbsOrigin();
        let playerid = this.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBattleUnitEntityRoot>().BelongPlayerid;
        return GChessControlSystem.GetInstance().IsInBoard(playerid, location);
    }
    isInBaseRoom() {
        let location = this.GetDomain<IBaseNpc_Plus>().GetAbsOrigin();
        return GChessControlSystem.GetInstance().IsInBaseRoom(location);
    }

    setMoving(ismoving: boolean) {
        (this.isMoving as any) = ismoving;
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (ismoving) {
            npc.SetMoveCapability(DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_GROUND);
        }
        else {
            npc.SetMoveCapability(DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_NONE);
        }
    }


    blink_start_p: Vector;
    readonly isMoving: boolean = false;
    blinkChessX(v: Vector, isjump: boolean = true) {
        if (this.isMoving) {
            return;
        }
        this.setMoving(true);
        let domain = this.GetDomain<IBaseNpc_Plus>();
        domain.Stop();
        domain.SetForwardVector(((v - domain.GetAbsOrigin()) as Vector).Normalized());
        domain.MoveToPosition(v);
        this.RemoveMovingModifier();
        this.blink_start_p = domain.GetAbsOrigin();
        let chessPos = GChessControlSystem.GetInstance().GetBoardLocalVector2(v);
        GChessControlSystem.GetInstance().RegistBlinkTargetGird(chessPos, true);
        this.OnblinkChessStart(chessPos);
        if (isjump) {
            modifier_jump.applyOnly(domain, domain, null, {
                vx: v.x,
                vy: v.y,
            });
        } else {
            domain.MoveToPositionAggressive(v)
            // modifier_run.applyOnly(domain, domain, null, {
            //     vx: v.x,
            //     vy: v.y,
            // });

        }
    }
    OnblinkChessStart(to: ChessVector) {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        let etroot = npc.ETRoot.As<IBattleUnitEntityRoot>()
        if (!etroot.IsBuilding()) { return }
        let building = etroot.As<IBuildingEntityRoot>();
        if (this.isInBattle()) {
            if (to.isY(0)) {
                GEventHelper.FireEvent(ChessControlConfig.Event.ChessControl_LeaveBattle, null,
                    building.BelongPlayerid, building)
            }
        }
        else {
            if (!to.isY(0)) {
                GEventHelper.FireEvent(ChessControlConfig.Event.ChessControl_JoinBattle, null,
                    building.BelongPlayerid, building)
            }
        }
    }
    OnblinkChessFinish() {
        let sys = GChessControlSystem.GetInstance();
        let domain = this.GetDomain<IBaseNpc_Plus>();
        let v = domain.GetAbsOrigin();
        let chessPos = sys.GetBoardLocalVector2(v);
        sys.RegistBlinkTargetGird(chessPos, false);
        this.blink_start_p = null;
        let chess = sys.FindBoardInGirdChess(chessPos);
        if (chess.length > 1) {
            let pos = sys.GetBoardEmptyGirdRandomAround(chessPos);
            if (pos != null) {
                this.blinkChessX(sys.GetBoardGirdCenterVector3(pos));
                return;
            }
        }
        this.setMoving(false);
        this.updateBoardPos();
    }

    FindClosePosToEnemy(enemy: IBattleUnitEntityRoot): Vector {
        let targetUnit = enemy.GetDomain<IBaseNpc_Plus>();
        if (!targetUnit) {
            return;
        }
        let targetpos = targetUnit.GetAbsOrigin();
        let sys = GChessControlSystem.GetInstance();
        let enemyChessVector = sys.GetBoardLocalVector2(targetpos);
        let attacker = this.GetDomain<IBaseNpc_Plus>();
        let location = attacker.GetAbsOrigin();
        let ChessVector = sys.GetBoardLocalVector2(location);
        let distance = attacker.Script_GetAttackRange() + targetUnit.GetHullRadius() + attacker.GetHullRadius();
        let around = sys.GetBoardGirdAroundCircle(enemyChessVector, distance);
        around.sort((a, b) => {
            return a.distance(ChessVector) - b.distance(ChessVector);
        });
        for (let pos of around) {
            if (sys.IsBoardEmptyGird(pos) && !sys.IsBlinkTargetGird(pos)) {
                return sys.GetBoardGirdCenterVector3(pos);
            }
        }
    }

    IsCanAttackTarget(target: IBattleUnitEntityRoot, x?: number, y?: number) {
        if (target == null) {
            return false;
        }
        let attacker = this.GetDomain<IBaseNpc_Plus>();
        let targetUnit = target.GetDomain<IBaseNpc_Plus>();
        if (!GameFunc.IsValid(attacker) || !GameFunc.IsValid(targetUnit)) {
            return false;
        }
        if (!attacker.IsAlive() || !targetUnit.IsAlive()) {
            return false;
        }
        if (x == null || y == null) {
            let pos = attacker.GetAbsOrigin();
            x = pos.x;
            y = pos.y;
        }
        let targetpos = targetUnit.GetAbsOrigin();
        let p = Vector(x, y, targetpos.z);
        let p2 = targetpos;
        if (!targetUnit.IsInvisible() && GameFunc.AsVector(p - p2).Length2D() < attacker.Script_GetAttackRange() + targetUnit.GetHullRadius() + attacker.GetHullRadius()) {
            return true;
        } else {
            return false;
        }
    }


    RemoveMovingModifier() {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        modifier_jump.remove(domain);
        modifier_run.remove(domain);
    }
}
