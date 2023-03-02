import { Assert_SpawnEffect, ISpawnEffectInfo } from "../../../assert/Assert_SpawnEffect";

import { KVHelper } from "../../../helper/KVHelper";
import { ERound } from "./ERound";

@GReloadable
export class ERoundBoardChallenge extends ERound {
    config: building_round_board_challenge.OBJ_2_1 = null;
    onAwake(configid: string): void {
        this.configID = configid;
        this.config = KVHelper.KvServerConfig.building_round_board_challenge["" + configid];
    }
    OnStart(): void {
        let unitcount = tonumber(this.config.round_unitcount);
        let unitinfoid: string[] = [];
        let unitWeight: number[] = [];
        for (let k in this.config.unitinfo) {
            unitinfoid.push(k);
            unitWeight.push(tonumber(this.config.unitinfo[k].unit_weight));
        }
        for (let i = 0; i < unitcount; i++) {
            let enemy = GFuncRandom.RandomArrayByWeight(unitinfoid, unitWeight);
            this.CreateChallengeEnemy(enemy[0], Assert_SpawnEffect.Effect.Spawn_portal);
        }
    }

    CreateChallengeEnemy(unit_index: string, spawnEffect: ISpawnEffectInfo = null) {
        let playerid = this.BelongPlayerid;
        let allenemy = this.config.unitinfo;
        let _boardVec = GChessControlSystem.GetInstance().GetBoardEmptyGirdRandom(playerid, true, true);
        // let _boardVec = new ChessControlConfig.ChessVector(Number(allenemy[unit_index].position_x), Number(allenemy[unit_index].position_y), playerid);
        let pos = _boardVec.getVector3();
        let angle = Vector(Number(allenemy[unit_index].angles_x), Number(allenemy[unit_index].angles_y), Number(allenemy[unit_index].angles_z));
        let enemyName = allenemy[unit_index].unit;
        let delay = 0;
        if (spawnEffect != null && spawnEffect.tp_effect != null) {
            delay = RandomFloat(0.1, 2.1);
            Assert_SpawnEffect.ShowTPEffectAtPosition(pos, spawnEffect.tp_effect, delay);
        }
        let domain = this.GetDomain<IBaseNpc_Plus>();
        let enemyManager = domain.ETRoot.As<IPlayerEntityRoot>().EnemyManagerComp();
        if (delay > 0) {
            GTimerHelper.AddTimer(
                delay, GHandler.create(this,
                    () => {
                        enemyManager.addEnemy(enemyName, this.configID, unit_index, pos, spawnEffect);
                    })
            );
        } else {
            enemyManager.addEnemy(enemyName, this.configID, unit_index, pos, spawnEffect);
        }
    }
}
