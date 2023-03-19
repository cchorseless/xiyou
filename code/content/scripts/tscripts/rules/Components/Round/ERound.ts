
import { ET, serializeETProps } from "../../../shared/lib/Entity";

export class ERound extends ET.Entity {
    @serializeETProps()
    configID: string;
    @serializeETProps()
    unitSpawned: number = 0;
    @serializeETProps()
    bRunning: boolean = false;
    @serializeETProps()
    tTotalDamage: number = 0; // 回合总伤害
    @serializeETProps()
    tTowerDamage: { [entityIndex: string]: number } = {}; // 回合伤害

    // onAwake(configid: string): void {
    //     this.configID = configid;
    // }

    OnRound_Start() {
        // this.unitSpawned = 0;
        // this.bRunning = true;
        // let domain = this.GetDomain<IBaseNpc_Plus>();
        // let spawn_interval = tonumber(this.config.spawn_interval) || 1;
        // let spawn_num = tonumber(this.config.spawn_num);
        // let enemyManager = domain.ETRoot.As<IPlayerEntityRoot>().EnemyManagerComp();
        // GTimerHelper.AddTimer(spawn_interval, GHandler.create(this, () => {
        //     if (this.bRunning && this.config.unit && this.unitSpawned <= spawn_num) {
        //         this.unitSpawned += 1;
        //         let enemy = enemyManager.addEnemy(this.config.unit, this.configID);
        //         this.onEntitySpawn(enemy);
        //         return spawn_interval
        //     }
        // }));
    }

    OnRound_End() {
        this.bRunning = false;
        GRoundSystem.GetInstance().endBoardRound();
    }

    private onEntitySpawn(enemy: IBaseNpc_Plus) { }
    onEntityHurt(entindex: EntityIndex, damage: number) {
        this.tTowerDamage[entindex] = this.tTowerDamage[entindex] || 0;
        this.tTowerDamage[entindex] += damage;
        this.tTotalDamage += damage;
    }
}
