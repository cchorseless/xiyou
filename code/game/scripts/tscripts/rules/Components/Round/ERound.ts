import { EntityHelper } from "../../../helper/EntityHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { building_round } from "../../../kvInterface/building/building_round";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { RoundConfig } from "../../System/Round/RoundConfig";
import { EnemyKillPrizeComponent } from "../Enemy/EnemyKillPrizeComponent";
import { EnemyManagerComponent } from "../Enemy/EnemyManagerComponent";
import { EnemyMoveComponent } from "../Enemy/EnemyMoveComponent";





export class ERound extends ET.Entity {

    configID: string;
    config: building_round.OBJ_2_1;
    unitSpawned: number = 0;
    bRunning: boolean = false

    tTotalDamage: number = 0; // 回合总伤害
    tTowerDamage: { [entityIndex: string]: number } = {}; // 回合伤害

    onAwake(configid: string): void {
        this.configID = configid;
        this.config = KVHelper.KvServerConfig.building_round["" + configid as "1"];
    }


    OnStart() {
        this.unitSpawned = 0;
        this.bRunning = true;
        let domain = this.GetDomain<BaseNpc_Plus>();
        let spawn_interval = tonumber(this.config.spawn_interval) || 1;
        let spawn_num = tonumber(this.config.spawn_num);
        let enemyManager = domain.ETRoot.GetComponent(EnemyManagerComponent);
        TimerHelper.addTimer(spawn_interval, () => {
            if (this.bRunning && this.config.unit && this.unitSpawned <= spawn_num) {
                this.unitSpawned += 1;
                let enemy = enemyManager.addEnemy(this.config.unit, this.configID);
                this.onEntitySpawn(enemy);
                return spawn_interval;
            }
        }, this, true)
    }

    OnEnd() {
        this.bRunning = false;
    }
    private onEntitySpawn(enemy: BaseNpc_Plus) {
    }
    onEntityHurt(entindex: EntityIndex, damage: number) {
        this.tTowerDamage[entindex] = this.tTowerDamage[entindex] || 0;
        this.tTowerDamage[entindex] += damage;
        this.tTotalDamage += damage;
    }

    get IsBasic() {
        return this.config.round_type == RoundConfig.EERoundType.basic;
    }
    get IsGold() {
        return this.config.round_type == RoundConfig.EERoundType.gold;
    }
    get IsBoss() {
        return this.config.round_type == RoundConfig.EERoundType.boss;
    }
    get IsCandyBoss() {
        return this.config.round_type == RoundConfig.EERoundType.candy_boss;
    }
    get IsEndless() {
        return this.config.round_type == RoundConfig.EERoundType.endless;
    }
    get IsChallenge() {
        return this.config.round_type == RoundConfig.EERoundType.challenge;
    }

}