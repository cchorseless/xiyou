
import { modifier_jiaoxie_wudi } from "../../../npc/modifier/battle/modifier_jiaoxie_wudi";
import { modifier_building_battle_buff } from "../../../npc/modifier/building/modifier_building_battle_buff";
import { modifier_chess_jump } from "../../../npc/modifier/move/modifier_chess_jump";
import { modifier_chess_run } from "../../../npc/modifier/move/modifier_chess_run";
import { ChessControlConfig } from "../../../shared/ChessControlConfig";
import { RoundConfig } from "../../../shared/RoundConfig";
import { ET } from "../../../shared/lib/Entity";
import { GEventHelper } from "../../../shared/lib/GEventHelper";
import { ChessVector } from "./ChessVector";

@GReloadable
export class ChessMoveComponent extends ET.Component {
    public ChessVector: ChessVector;
    readonly isInBattle: boolean = false;
    readonly isMoving: boolean = false;
    onAwake(): void {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        this.updateBoardPos();
        let etroot = domain.ETRoot.As<IBattleUnitEntityRoot>();
        if (!this.isInBattle) {
            modifier_jiaoxie_wudi.applyOnly(domain, domain);
        }
        if (etroot.IsBuilding()) {
            this.setMoving(false);
        }
        if (etroot.IsFriendly()) {
            domain.SetForwardVector(Vector(0, 1, 0));
        }
        else {
            domain.SetForwardVector(Vector(0, -1, 0));
        }

    }


    updateBoardPos() {
        let location = this.GetDomain<IBaseNpc_Plus>().GetAbsOrigin();
        this.ChessVector = GChessControlSystem.GetInstance().GetBoardLocalVector2(location);
        if (!this.isMoving) {
            (this.isInBattle as any) = this.isPosInBattle();
        }
    }

    updateForward(position: Vector) {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        domain.SetForwardVector(((position - domain.GetAbsOrigin()) as Vector).Normalized());
        domain.MoveToPosition(position);
    }
    /**
     * 棋盘内且在战斗区域
     */
    isInBoardAndBattle() {
        return this.isInBattle && this.isInBoard();
    }
    /**
     * 是否在战斗区域
     * @returns 
     */
    isPosInBattle() {
        return !this.ChessVector.isY(0);
    }
    /**
     * 在棋盘内
     * @returns 
     */
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
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (ismoving) {
            npc.SetMoveCapability(DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_GROUND);
        }
        else {
            npc.SetMoveCapability(DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_NONE);
        }
    }


    blink_start_p: Vector;
    blinkChessX(v: Vector, isjump: boolean = true) {
        if (this.isMoving) {
            return;
        }
        (this.isMoving as any) = true;
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
            modifier_chess_jump.applyOnly(domain, domain, null, {
                vx: v.x,
                vy: v.y,
            }).DestroyHandler = GHandler.create(this, () => {
                this.OnblinkChessFinish();
            })
        } else {
            // todo
            domain.MoveToPositionAggressive(v)
            // modifier_chess_run.applyOnly(domain, domain, null, {
            //     vx: v.x,
            //     vy: v.y,
            // }).DestroyHandler = GHandler.create(this, () => {
            //     this.OnblinkChessFinish();
            // });

        }
    }
    OnblinkChessStart(to: ChessVector) {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        let etroot = npc.ETRoot.As<IBattleUnitEntityRoot>()
        if (!etroot.IsBuilding()) { return }
        let building = etroot.As<IBuildingEntityRoot>();
        if (this.isInBattle) {
            if (to.isY(0)) {
                modifier_jiaoxie_wudi.applyOnly(npc, npc);
                (this.isInBattle as any) = false;
                GEventHelper.FireEvent(ChessControlConfig.Event.ChessControl_LeaveBattle, null,
                    building.BelongPlayerid, building)
            }
        }
        else {
            if (!to.isY(0)) {
                (this.isInBattle as any) = true;
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
                this.blinkChessX(sys.GetBoardGirdVector3(pos));
                return;
            }
        }
        this.setMoving(false);
        (this.isMoving as any) = false;
        this.updateBoardPos();
        // 更新棋子BUFF
        let playerRoot = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid);
        let currentround = playerRoot.RoundManagerComp().getCurrentBoardRound();
        if (currentround.roundState != RoundConfig.ERoundBoardState.start && this.isInBoard()) {
            if (this.isPosInBattle()) {
                modifier_building_battle_buff.applyOnly(domain, domain);
            }
            else {
                modifier_building_battle_buff.remove(domain);
            }
        }
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
                return sys.GetBoardGirdVector3(pos);
            }
        }
    }

    FindAroundFriendChess() {
        let attacker = this.GetDomain<IBaseNpc_Plus>();
        let r: IBaseNpc_Plus[] = [];
        let up = new ChessVector(this.ChessVector.x, this.ChessVector.y + 1, this.ChessVector.playerid);
        let down = new ChessVector(this.ChessVector.x, this.ChessVector.y - 1, this.ChessVector.playerid);
        let left = new ChessVector(this.ChessVector.x - 1, this.ChessVector.y, this.ChessVector.playerid);
        let right = new ChessVector(this.ChessVector.x + 1, this.ChessVector.y, this.ChessVector.playerid);
        let friends = attacker.FindUnitsInRadiusPlus(ChessControlConfig.Gird_Width * 1.5, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY)
        friends.forEach((v) => {
            let chess = v.ETRoot.As<IBattleUnitEntityRoot>();
            if (chess && chess.ChessComp && chess.ChessComp()) {
                if (chess.IsBuilding()) {
                    return
                }
                let cv = chess.ChessComp().ChessVector;
                if (cv.isSame(up) || cv.isSame(down) || cv.isSame(left) || cv.isSame(right)) {
                    r.push(v);
                }
            }
        });
        return r;
    }

    RemoveMovingModifier() {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        modifier_chess_jump.remove(domain);
        modifier_chess_run.remove(domain);
    }
}
