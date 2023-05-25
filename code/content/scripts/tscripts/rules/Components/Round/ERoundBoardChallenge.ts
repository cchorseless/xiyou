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
        let enemys = this.config.enemyinfo.filter((v) => { return v.challengelevel <= lvl && v.enemycreatetype == GEEnum.EEnemyCreateType.SummedBattle });
        for (let info of enemys) {
            unitinfoid.push(info.id);
            unitWeight.push(info.unitWeight);
        }
        for (let i = 0; i < unitcount; i++) {
            GTimerHelper.AddFrameTimer(i + 1, GHandler.create(this, () => {
                let enemy = GFuncRandom.RandomArrayByWeight(unitinfoid, unitWeight);
                this.CreateChallengeEnemy(enemy[0], Assert_SpawnEffect.Effect.Spawn_portal);
            }))
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
        // 全图刷怪
        // let min_x = -3;
        // let max_x = 9;
        // let min_y = 1;
        // let max_y = 12;
        // return new ChessVector(RandomFloat(min_x, max_x), RandomFloat(min_y, max_y), playerid);
    }
    GetBoardRandomEggPos(playerid: PlayerID) {
        let validPos = [
            [0, ChessControlConfig.Gird_Max_Y],
            [1, ChessControlConfig.Gird_Max_Y],
            [2, ChessControlConfig.Gird_Max_Y],
            [5, ChessControlConfig.Gird_Max_Y],
            [6, ChessControlConfig.Gird_Max_Y],
            [7, ChessControlConfig.Gird_Max_Y],
        ]
        let r = GFuncRandom.RandomArray(validPos)[0];
        return new ChessVector(r[0], r[1], playerid);
    }
    CreateChallengeEnemy(unit_index: string, spawnEffect: ISpawnEffectInfo = null, npcOwner: IBaseNpc_Plus = null) {
        const playerid = this.BelongPlayerid;
        const enemyinfo = this.config.enemyinfo.find((v) => { return v.id == unit_index });
        let _boardVec: ChessVector;
        if (enemyinfo.enemycreatetype == GEEnum.EEnemyCreateType.None) {
            _boardVec = new ChessVector((enemyinfo.positionX), (enemyinfo.positionY), playerid);
        }
        else if (enemyinfo.enemycreatetype == GEEnum.EEnemyCreateType.SummedBattle) {
            _boardVec = this.GetBoardRandomEmptyEnemyGird(playerid);
        }
        else if (enemyinfo.enemycreatetype == GEEnum.EEnemyCreateType.SummedEgg) {
            _boardVec = this.GetBoardRandomEggPos(playerid);
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

    CreateRoundSummonBattleEnemy(count: number, spawnEffect: ISpawnEffectInfo = null, npcOwner: IBaseNpc_Plus = null) {
        let baseenemys = this.config.enemyinfo.filter((value) => { return value.enemycreatetype == GEEnum.EEnemyCreateType.SummedBattle && (this.challengelevel == null || value.challengelevel == this.challengelevel) });
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

