
import { LogHelper } from "../../../helper/LogHelper";
import { EnemyConfig } from "../../../shared/EnemyConfig";
import { ET } from "../../../shared/lib/Entity";
@GReloadable
export class EnemyMoveComponent extends ET.Component {
    public lastCornerName: string;
    public targetCornerName: string;

    onAwake(...args: any[]): void { }
    public getMoveWay() {
        let unitComp = this.Domain.ETRoot.As<IEnemyUnitEntityRoot>()
        if (unitComp.IsWave()) {
            return EnemyConfig.ENEMY_CORNERS[this.BelongPlayerid];
        } else if (unitComp.IsBoss()) {
            return EnemyConfig.BOSS_CORNERS[this.BelongPlayerid];
        } else if (unitComp.IsGOLD_BOSS()) {
            return EnemyConfig.CHALLENGE_CORNERS[this.BelongPlayerid];
        } else if (unitComp.IsCANDY_WAVE()) {
            return EnemyConfig.CHALLENGE_CORNERS[this.BelongPlayerid];
        } else if (unitComp.IsCANDY_BOSS()) {
            return EnemyConfig.CANDY_BOSS_CORNERS[this.BelongPlayerid];
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
