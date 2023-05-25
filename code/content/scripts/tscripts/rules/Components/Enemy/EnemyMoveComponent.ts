
import { LogHelper } from "../../../helper/LogHelper";
import { ChessControlConfig } from "../../../shared/ChessControlConfig";
import { EnemyConfig } from "../../../shared/EnemyConfig";
import { ET } from "../../../shared/lib/Entity";
@GReloadable
export class EnemyMoveComponent extends ET.Component {
    public lastCornerName: string;
    public targetCornerName: string;
    public targetCornerIndex: number;
    public targetCornerIsLeft: boolean;
    public targetCornerPos: Vector;


    onAwake(): void {
        let unitComp = this.Domain.ETRoot as IEnemyUnitEntityRoot
        if (unitComp.AiAttackComp()) {
            unitComp.AiAttackComp().endFindToAttack();
        }
    }
    public getMoveWay() {
        let unitComp = this.Domain.ETRoot.As<IEnemyUnitEntityRoot>()
        if (unitComp.IsWave()) {
            return EnemyConfig.ENEMY_CORNERS[this.BelongPlayerid];
        } else if (unitComp.IsBoss()) {
            return EnemyConfig.BOSS_CORNERS[this.BelongPlayerid];
        } else if (unitComp.IsGOLD_BOSS()) {
            return EnemyConfig.CHALLENGE_CORNERS[this.BelongPlayerid];
            // } else if (unitComp.IsCANDY_WAVE()) {
            //     return EnemyConfig.CHALLENGE_CORNERS[this.BelongPlayerid];
        }
        // else if (unitComp.IsCANDY_BOSS()) {
        //     return EnemyConfig.CANDY_BOSS_CORNERS[this.BelongPlayerid];
        // }
    }

    StartMoveToEgg() {
        if (this.moveTimer) {
            this.moveTimer.Clear();
            this.moveTimer = null;
        }
        this.moveTimer = GTimerHelper.AddTimer(0.1, GHandler.create(this, () => {
            if (this.IsDisposed()) { return }
            let u = this.GetDomain<IBaseNpc_Plus>();
            let unitComp = this.Domain.ETRoot as IEnemyUnitEntityRoot
            if (u.IsCommandRestricted() || u.IsStunned() || u.IsFeared() || u.IsFreeze() || u.IsOutOfGame()) {
                return 0.5;
            }
            if (u.IsChanneling()) {
                return 0.5;
            }
            let casttime = unitComp.AiAttackComp().castAbilityAndItem();
            if (!u.IsIllusion() && casttime > 0) {
                return casttime;
            }
            if (this.MoveToCorner()) {
                return 0.5;
            }
        }))
    }

    EndMoveToEgg() {
        if (this.moveTimer) {
            this.moveTimer.Clear();
            this.moveTimer = null;
        }
    }

    MoveToCorner() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        let pos = npc.GetAbsOrigin()
        let playerroot = GGameScene.GetPlayer(this.BelongPlayerid);
        if (playerroot) {
            let courierEgg = playerroot.CourierRoot().CourierEggComp();
            if (courierEgg && playerroot.Hero.IsAlive()) {
                let isReachFinish = false;
                if (this.targetCornerPos == null) {
                    let firstCorner = courierEgg.GetFirstCorner(pos);
                    this.targetCornerIndex = firstCorner.index;
                    this.targetCornerIsLeft = firstCorner.isleft;
                    this.targetCornerPos = firstCorner.pos;
                }
                else {
                    if (!GChessControlSystem.GetInstance().IsBoardEmptyGirdByVector(this.BelongPlayerid, this.targetCornerPos) ||
                        GFuncVector.CalculateDistance(pos, this.targetCornerPos) <= ChessControlConfig.Gird_Width / 2) {
                        this.targetCornerIndex++;
                        if (this.targetCornerIsLeft) {
                            if (courierEgg.PathConnerLeft.length > this.targetCornerIndex) {
                                this.targetCornerPos = courierEgg.PathConnerLeft[this.targetCornerIndex];
                            } else {
                                isReachFinish = true;
                            }
                        }
                        else {
                            if (courierEgg.PathConnerRight.length > this.targetCornerIndex) {
                                this.targetCornerPos = courierEgg.PathConnerRight[this.targetCornerIndex];
                            } else {
                                isReachFinish = true;
                            }
                        }
                    }
                }
                if (isReachFinish) {
                    // 目的地是蛋
                    // let egg = courierEgg.EggUnit;
                    // if (IsValid(egg) && egg.IsAlive()) {
                    //     let buff = modifier_courier_egg_honor.findIn(egg);
                    //     if (buff) {
                    //         buff.OnEggAttackLanded(npc)
                    //     }
                    // }
                    return false;
                }
                else {
                    npc.MoveToPosition(this.targetCornerPos);
                    return true;
                }
            }
            return false
        }
    }

    //  到拐角拐弯
    CornerTurning(cornerName: string) {
        if (this.lastCornerName == null) {
            this.lastCornerName = cornerName;
        } else if (this.lastCornerName == cornerName) {
            return;
        }
        if (this.targetCornerName && this.targetCornerName != cornerName) {
            return;
        }
        let myway = this.getMoveWay();
        let index = myway.indexOf(cornerName);
        if (index == -1) {
            return;
        }
        // 最后一个 miss
        else if (index == myway.length - 1) {
            this.MoveOrder(false);
            // this.Domain.ETRoot.As<IEnemyUnitEntityRoot>().GetPlayer().EnemyManagerComp().missEnemy(this.Domain.ETRoot.As<IEnemyUnitEntityRoot>());
            return;
        }
        this.lastCornerName = cornerName;
        this.targetCornerName = myway[index + 1];
        this.MoveOrder();
    }

    private moveTimer: ITimerTask;
    //  移动命令
    MoveOrder(ismove: boolean = true) {
        if (!ismove) {
            if (this.moveTimer != null) {
                this.moveTimer.Clear()
                this.moveTimer = null;
                return;
            }
        }
        if (this.targetCornerName == null) {
            return;
        }
        let hUnit = this.GetDomain<IBaseNpc_Plus>();
        let corner = GEnemySystem.GetInstance().getEnemyWayPos(this.targetCornerName);
        if (corner) {
            hUnit.MoveToPosition(corner);
            if (this.moveTimer != null) {
                this.moveTimer.Clear()
                this.moveTimer = null;
                return;
            }
            this.moveTimer = GTimerHelper.AddTimer(0.2, GHandler.create(this, () => {
                hUnit.MoveToPosition(corner);
                return 0.2
            }));
        } else {
            LogHelper.print("error: can !find corner");
        }
    }

    public Dispose(): void {
        this.MoveOrder(false);
        super.Dispose();
    }
}
