import { GameFunc } from "../../../GameFunc";
import { EventHelper } from "../../../helper/EventHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_jump } from "../../../npc/modifier/modifier_jump";
import { modifier_run } from "../../../npc/modifier/modifier_run";
import { ET, registerET } from "../../Entity/Entity";
import { ChessControlConfig } from "../../System/ChessControl/ChessControlConfig";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";

@registerET()
export class ChessComponent extends ET.Component {
    public ChessVector: ChessControlConfig.ChessVector;
    readonly isAlive: boolean = true;
    onAwake(): void {
        let domain = this.GetDomain<BaseNpc_Plus>();
        domain.SetForwardVector(Vector(0, 1, 0));
        this.updateBoardPos();
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
    changeAliveState(state: boolean) {
        (this as any).isAlive = state;
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
        let location = this.GetDomain<BaseNpc_Plus>().GetAbsOrigin();
        let playerid = this.GetDomain<BaseNpc_Plus>().ETRoot.As<PlayerCreateBattleUnitEntityRoot>().Playerid;
        return GameRules.Addon.ETRoot.ChessControlSystem().IsInBoard(playerid, location);
    }
    isInBaseRoom() {
        let location = this.GetDomain<BaseNpc_Plus>().GetAbsOrigin();
        return GameRules.Addon.ETRoot.ChessControlSystem().IsInBaseRoom(location);
    }

    blink_start_p: Vector;
    is_moving: boolean;
    blinkChessX(v: Vector, isjump: boolean = true) {
        if (this.is_moving) {
            return;
        }
        this.is_moving = true;
        let domain = this.GetDomain<BaseNpc_Plus>();
        domain.Stop();
        domain.SetForwardVector(((v - domain.GetAbsOrigin()) as Vector).Normalized());
        domain.MoveToPosition(v);
        this.RemoveMovingModifier();
        this.blink_start_p = domain.GetAbsOrigin();
        let chessPos = GameRules.Addon.ETRoot.ChessControlSystem().GetBoardLocalVector2(v);
        GameRules.Addon.ETRoot.ChessControlSystem().RegistBlinkTargetGird(chessPos, true);
        this.OnblinkChessStart(chessPos);
        if (isjump) {
            modifier_jump.applyOnly(domain, domain, null, {
                vx: v.x,
                vy: v.y,
            });
        } else {
            modifier_run.applyOnly(domain, domain, null, {
                vx: v.x,
                vy: v.y,
            });
        }
    }
    OnblinkChessStart(to: ChessControlConfig.ChessVector) {
        let etroot = this.GetDomain<BaseNpc_Plus>().ETRoot;
        if (!etroot.AsValid<BuildingEntityRoot>("BuildingEntityRoot")) { return }
        let building = etroot.As<BuildingEntityRoot>()
        if (this.isInBattle()) {
            if (to.isY(0)) {
                EventHelper.fireServerEvent(ChessControlConfig.Event.ChessControl_LeaveBattle,
                    building.Playerid, building)
            }
        }
        else {
            if (!to.isY(0)) {
                EventHelper.fireServerEvent(ChessControlConfig.Event.ChessControl_JoinBattle,
                    building.Playerid, building)
            }
        }
    }
    OnblinkChessFinish() {
        let sys = GameRules.Addon.ETRoot.ChessControlSystem();
        let domain = this.GetDomain<BaseNpc_Plus>();
        let v = domain.GetAbsOrigin();
        let chessPos = sys.GetBoardLocalVector2(v);
        sys.RegistBlinkTargetGird(chessPos, false);
        this.blink_start_p = null;
        this.is_moving = false;
        let chess = sys.FindBoardInGirdChess(chessPos);
        if (chess.length > 1) {
            let pos = sys.GetBoardEmptyGirdRandomAround(chessPos);
            if (pos != null) {
                this.blinkChessX(sys.GetBoardGirdCenterVector3(pos));
                return;
            }
        }
        this.updateBoardPos();
    }

    FindClosePosToEnemy(enemy: PlayerCreateBattleUnitEntityRoot): Vector {
        let targetUnit = enemy.GetDomain<BaseNpc_Plus>();
        if (!targetUnit) {
            return;
        }
        let targetpos = targetUnit.GetAbsOrigin();
        let sys = GameRules.Addon.ETRoot.ChessControlSystem();
        let enemyChessVector = sys.GetBoardLocalVector2(targetpos);
        let attacker = this.GetDomain<BaseNpc_Plus>();
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

    IsCanAttackTarget(target: PlayerCreateBattleUnitEntityRoot, x?: number, y?: number) {
        if (target == null) {
            return false;
        }
        let attacker = this.GetDomain<BaseNpc_Plus>();
        let targetUnit = target.GetDomain<BaseNpc_Plus>();
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
        let domain = this.GetDomain<BaseNpc_Plus>();
        modifier_jump.remove(domain);
        modifier_run.remove(domain);
    }
}
