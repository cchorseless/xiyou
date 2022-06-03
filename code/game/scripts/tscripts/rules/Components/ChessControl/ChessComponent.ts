import { GameFunc } from "../../../GameFunc";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_jump } from "../../../npc/modifier/modifier_jump";
import { modifier_run } from "../../../npc/modifier/modifier_run";
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
    is_moving: boolean;
    public blinkChessX(v: Vector, isjump: boolean = true) {
        if (this.is_moving) {
            return;
        }
        this.is_moving = true;
        let domain = this.GetDomain<BaseNpc_Plus>();
        domain.Stop();
        domain.SetForwardVector(((v - domain.GetAbsOrigin()) as Vector).Normalized());
        domain.MoveToPosition(v);
        this.RemoveMovingModifier();
        let chessPos = GameRules.Addon.ETRoot.ChessControlSystem().GetBoardLocalVector2(v);
        GameRules.Addon.ETRoot.ChessControlSystem().RegistBlinkTargetGird(chessPos, true);
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
        this.blink_start_p = domain.GetAbsOrigin();
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
            let pos = sys.GetBoardEmptyGirdRandom(chessPos);
            if (pos != null) {
                this.blinkChessX(sys.GetBoardGirdCenterVector3(pos));
                return;
            }
        }
    }

    FindClosePosToEnemy(enemy: PlayerCreateUnitEntityRoot): Vector {
        let targetUnit = enemy.GetDomain<BaseNpc_Plus>();
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

    IsCanAttackTarget(target: PlayerCreateUnitEntityRoot, x?: number, y?: number) {
        if (target == null) {
            return false;
        }
        let attacker = this.GetDomain<BaseNpc_Plus>();
        let targetUnit = target.GetDomain<BaseNpc_Plus>();
        if (!GameFunc.IsValid(attacker) || !GameFunc.IsValid(targetUnit)) {
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
