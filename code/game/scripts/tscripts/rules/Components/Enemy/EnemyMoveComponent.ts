import { EntityHelper } from "../../../helper/EntityHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { EnemyConfig } from "../../System/Enemy/EnemyConfig";
import { EnemyState } from "../../System/Enemy/EnemyState";
import { EnemyUnitComponent } from "./EnemyUnitComponent";

export class EnemyMoveComponent extends ET.Component {

    public lastCornerName: string;
    public targetCornerName: string;

    get EnemyUnit() {
        let domain = this.GetDomain<BaseNpc_Plus>();
        let unitComp = domain.ETRoot.GetComponentByName<EnemyUnitComponent>("EnemyUnitComponent");
        return unitComp;
    }

    onAwake(...args: any[]): void {

    }
    public getMoveWay() {
        let unitComp = this.EnemyUnit;
        if (unitComp.IsWave) {
            return EnemyConfig.ENEMY_CORNERS[unitComp.PlayerID];
        }
        else if (unitComp.IsBoss) {
            return EnemyConfig.BOSS_CORNERS[unitComp.PlayerID];
        }
        else if (unitComp.IsGOLD_BOSS) {
            return EnemyConfig.CHALLENGE_CORNERS[unitComp.PlayerID];
        }
        else if (unitComp.IsCANDY_WAVE) {
            return EnemyConfig.CHALLENGE_CORNERS[unitComp.PlayerID];
        }
        else if (unitComp.IsCANDY_BOSS) {
            return EnemyConfig.CANDY_BOSS_CORNERS[unitComp.PlayerID];
        }
    }


    //  到拐角拐弯
    CornerTurning(cornerName: string) {
        if (this.lastCornerName == null) {
            this.lastCornerName = cornerName;
        }
        else if (this.lastCornerName == cornerName) {
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
            let domain = this.GetDomain<BaseNpc_Hero_Plus>();
            let unitComp = this.EnemyUnit;
            unitComp.EnemyUnitManager.missEnemy(domain.ETRoot);
            return;
        }
        this.lastCornerName = cornerName;
        this.targetCornerName = myway[index + 1];
        this.MoveOrder()
    }

    private moveTimer: string;
    //  移动命令
    MoveOrder(ismove: boolean = true) {
        if (!ismove) {
            if (this.moveTimer != null) {
                TimerHelper.removeTimer(this.moveTimer);
                this.moveTimer = null;
                return;
            }
        }
        if (this.targetCornerName == null) {
            return
        }
        let hUnit = this.GetDomain<BaseNpc_Plus>();
        let corner = EnemyState.getEnemyWayPos(this.targetCornerName);
        if (corner) {
            hUnit.MoveToPosition(corner);
            if (this.moveTimer != null) {
                TimerHelper.removeTimer(this.moveTimer);
                this.moveTimer = null;
                return;
            }
            this.moveTimer = TimerHelper.addTimer(0.2, () => {
                hUnit.MoveToPosition(corner);
                return 0.2;
            })
        } else {
            LogHelper.print("error: can !find corner")
        }
    }

    public Dispose(): void {
        this.MoveOrder(false);
        super.Dispose();
    }
}