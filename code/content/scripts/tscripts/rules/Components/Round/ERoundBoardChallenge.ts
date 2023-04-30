import { Assert_SpawnEffect, ISpawnEffectInfo } from "../../../assert/Assert_SpawnEffect";
import { ChessControlConfig } from "../../../shared/ChessControlConfig";
import { Dota } from "../../../shared/Gen/Types";
import { ChessVector } from "../ChessControl/ChessVector";

import { ERound } from "./ERound";

@GReloadable
export class ERoundBoardChallenge extends ERound {
    config: Dota.RoundBoardChallengeConfigRecord = null;
    challengelevel: number;
    onAwake(configid: string): void {
        this.configID = configid;
        this.config = GJSONConfig.RoundBoardChallengeConfig.get("" + configid);
    }

    IsRoundChallenge() {
        return true
    }
    OnRound_Start(lvl?: number): void {
        this.challengelevel = lvl;
        let unitcount = this.config.enemyCount;
        let unitinfoid: string[] = [];
        let unitWeight: number[] = [];
        let enemys = this.config.enemyinfo.filter((v) => { return v.challengelevel <= lvl && v.issummoned == false });
        for (let info of enemys) {
            unitinfoid.push(info.id);
            unitWeight.push(info.unitWeight);
        }
        for (let i = 0; i < unitcount; i++) {
            let enemy = GFuncRandom.RandomArrayByWeight(unitinfoid, unitWeight);
            this.CreateChallengeEnemy(enemy[0], Assert_SpawnEffect.Effect.Spawn_portal);
        }
    }
    GetBoardRandomEmptyEnemyGird(playerid: PlayerID) {
        let min_x = 0;
        let min_y = 4;
        let max_y = 8;
        let validPos: [number, number][] = [];
        for (let y = min_y; y < max_y; y++) {
            for (let x = min_x; x < ChessControlConfig.Gird_Max_X; x++) {
                validPos.push([x, y])
            }
        }
        let r = GFuncRandom.RandomArray(validPos)[0];
        return new ChessVector(r[0], r[1], playerid);
    }
    CreateChallengeEnemy(unit_index: string, spawnEffect: ISpawnEffectInfo = null, npcOwner: IBaseNpc_Plus = null) {
        const playerid = this.BelongPlayerid;
        const enemyinfo = this.config.enemyinfo.find((v) => { return v.id == unit_index });
        let _boardVec: ChessVector;
        if (enemyinfo.issummoned) {
            _boardVec = this.GetBoardRandomEmptyEnemyGird(playerid);
        }
        else {
            _boardVec = new ChessVector((enemyinfo.positionX), (enemyinfo.positionY), playerid);
        }
        // let _boardVec = new ChessControlConfig.ChessVector(Number(allenemy[unit_index].position_x), Number(allenemy[unit_index].position_y), playerid);
        let pos = _boardVec.getVector3();
        let angle = Vector(enemyinfo.anglesX, enemyinfo.anglesY, enemyinfo.anglesZ);
        let enemyName = enemyinfo.unitname;
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
                        enemyManager.AddEnemy(enemyName, this.configID, unit_index, pos, angle, spawnEffect, npcOwner);
                    })
            );
        } else {
            enemyManager.AddEnemy(enemyName, this.configID, unit_index, pos, angle, spawnEffect, npcOwner);
        }
        return pos;
    }

    CreateRoundSummonEnemy(count: number, spawnEffect: ISpawnEffectInfo = null, npcOwner: IBaseNpc_Plus = null) {
        let baseenemys = this.config.enemyinfo.filter((value) => { return value.issummoned && (this.challengelevel == null || value.challengelevel == this.challengelevel) });
        if (baseenemys.length == 0) { return }
        let weightarr = baseenemys.map((value) => { return value.unitWeight });
        let posArr: Vector[] = [];
        for (let i = 0; i < count; i++) {
            let enemyinfo = GFuncRandom.RandomArrayByWeight(baseenemys, weightarr)[0];
            if (enemyinfo == null) { continue }
            let pos = this.CreateChallengeEnemy(enemyinfo.id, spawnEffect, npcOwner);
            posArr.push(pos);
        }
        return posArr;
    }
}

