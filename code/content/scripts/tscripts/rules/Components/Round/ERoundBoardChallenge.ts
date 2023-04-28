import { Assert_SpawnEffect, ISpawnEffectInfo } from "../../../assert/Assert_SpawnEffect";
import { Dota } from "../../../shared/Gen/Types";

import { ERound } from "./ERound";

@GReloadable
export class ERoundBoardChallenge extends ERound {
    config: Dota.RoundBoardChallengeConfigRecord = null;
    onAwake(configid: string): void {
        this.configID = configid;
        this.config = GJSONConfig.RoundBoardChallengeConfig.get("" + configid);
    }
    OnRound_Start(): void {
        let unitcount = this.config.roundUnitcount;
        let unitinfoid: string[] = [];
        let unitWeight: number[] = [];
        for (let info of this.config.enemyinfo) {
            unitinfoid.push(info.id);
            unitWeight.push(info.unitWeight);
        }
        for (let i = 0; i < unitcount; i++) {
            let enemy = GFuncRandom.RandomArrayByWeight(unitinfoid, unitWeight);
            this.CreateChallengeEnemy(enemy[0], Assert_SpawnEffect.Effect.Spawn_portal);
        }
    }

    CreateChallengeEnemy(unit_index: string, spawnEffect: ISpawnEffectInfo = null) {
        let playerid = this.BelongPlayerid;
        let info = this.config.enemyinfo.find((v) => { return v.id == unit_index });
        let _boardVec = GChessControlSystem.GetInstance().GetBoardEmptyGirdRandom(playerid, true, true);
        // let _boardVec = new ChessControlConfig.ChessVector(Number(allenemy[unit_index].position_x), Number(allenemy[unit_index].position_y), playerid);
        let pos = _boardVec.getVector3();
        let angle = Vector(info.anglesX, info.anglesY, info.anglesZ);
        let enemyName = info.unitname;
        let delay = 0;
        if (spawnEffect != null && spawnEffect.tp_effect != null) {
            delay = Assert_SpawnEffect.ShowTPEffectAtPosition(pos, spawnEffect);
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
