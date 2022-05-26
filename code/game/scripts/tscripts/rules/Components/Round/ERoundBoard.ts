import { KVHelper } from "../../../helper/KVHelper";
import { ISpawnEffectInfo, ResHelper } from "../../../helper/ResHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { building_round_board } from "../../../kvInterface/building/building_round_board";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ERound } from "./ERound";

export class ERoundBoard extends ERound {
    config: building_round_board.OBJ_2_1 = null;
    onAwake(configid: string): void {
        this.configID = configid;
        this.config = KVHelper.KvServerConfig.building_round_board["" + configid];
    }
    OnStart() {
        this.unitSpawned = 0;
        this.bRunning = true;
        let domain = this.GetDomain<BaseNpc_Plus>();
        let enemyManager = domain.ETRoot.AsPlayer().EnemyManagerComp();
      
    }

    async CreateOneEnemy(enemyName: string, roundid: string, pos: Vector, spawnEffect: ISpawnEffectInfo = null) {
        if (spawnEffect != null && spawnEffect.tp_effect != null) {
            let delay = RandomFloat(0.1, 2.1);
            ResHelper.ShowTPEffectAtPosition(pos, spawnEffect.tp_effect, delay);
            await TimerHelper.delayTimer(delay);
        }
        let domain = this.GetDomain<BaseNpc_Plus>();
        let enemyManager = domain.ETRoot.AsPlayer().EnemyManagerComp();
        enemyManager.addEnemy(enemyName, roundid, pos, spawnEffect);
    }
}
