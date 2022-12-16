import { Assert_SpawnEffect, ISpawnEffectInfo } from "../../../assert/Assert_SpawnEffect";
import { reloadable } from "../../../GameCache";
import { GameFunc } from "../../../GameFunc";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ChessControlConfig } from "../../../shared/ChessControlConfig";
import { ERound } from "./ERound";

@reloadable
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
            let enemy = GameFunc.ArrayFunc.RandomArrayByWeight(unitinfoid, unitWeight);
            this.CreateChallengeEnemy(enemy[0], Assert_SpawnEffect.Effect.Spawn_portal);
        }
    }

    CreateChallengeEnemy(unit_index: string, spawnEffect: ISpawnEffectInfo = null) {
        let playerid = this.Domain.ETRoot.AsPlayer().Playerid;
        let allenemy = this.config.unitinfo;
        let _boardVec = GameRules.Addon.ETRoot.ChessControlSystem().GetBoardEmptyGirdRandom(playerid, true, true);
        // let _boardVec = new ChessControlConfig.ChessVector(Number(allenemy[unit_index].position_x), Number(allenemy[unit_index].position_y), playerid);
        let pos = _boardVec.getVector3();
        let angle = Vector(Number(allenemy[unit_index].angles_x), Number(allenemy[unit_index].angles_y), Number(allenemy[unit_index].angles_z));
        let enemyName = allenemy[unit_index].unit;
        let delay = 0;
        if (spawnEffect != null && spawnEffect.tp_effect != null) {
            delay = RandomFloat(0.1, 2.1);
            Assert_SpawnEffect.ShowTPEffectAtPosition(pos, spawnEffect.tp_effect, delay);
        }
        let domain = this.GetDomain<BaseNpc_Plus>();
        let enemyManager = domain.ETRoot.AsPlayer().EnemyManagerComp();
        if (delay > 0) {
            TimerHelper.addTimer(
                delay,
                () => {
                    enemyManager.addEnemy(enemyName, this.configID, unit_index, pos, spawnEffect);
                },
                this
            );
        } else {
            enemyManager.addEnemy(enemyName, this.configID, unit_index, pos, spawnEffect);
        }
    }
}
