import { GameFunc } from "../../../GameFunc";
import { KVHelper } from "../../../helper/KVHelper";
import { EnemyConfig } from "../../../shared/EnemyConfig";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";
import { BattleUnitManagerComponent } from "../BattleUnit/BattleUnitManagerComponent";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { ERound } from "../Round/ERound";
import { ERoundBoard } from "../Round/ERoundBoard";
import { EnemyMoveComponent } from "./EnemyMoveComponent";

@GReloadable
export class EnemyUnitEntityRoot extends BattleUnitEntityRoot {
    readonly RoundID: string;
    readonly OnlyKey: string;

    onAwake(playerid: PlayerID, confid: string, roundid: string, onlyKey: string = null) {
        (this.BelongPlayerid as any) = playerid;
        (this.ConfigID as any) = confid;
        (this.RoundID as any) = roundid;
        (this.OnlyKey as any) = onlyKey;
        const domain = this.GetDomain<IBaseNpc_Plus>();
        (this.EntityId as any) = domain.GetEntityIndex();
        this.AddComponent(GGetRegClass<typeof BattleUnitManagerComponent>("BattleUnitManagerComponent"));
        this.AddComponent(GGetRegClass<typeof CombinationComponent>("CombinationComponent"));
        this.addBattleComp();
        this.onInit()
    }

    GetPlayerId() {
        return this.Domain.ETRoot.As<IEnemyUnitEntityRoot>().BelongPlayerid;
    }
    EnemyUnitType() {
        return this.Domain.ETRoot.As<IEnemyUnitEntityRoot>().Config().UnitLabel;
    }
    IsWave() {
        return this.EnemyUnitType() == EnemyConfig.EEnemyUnitType.wave;
    }
    IsBoss() {
        return this.EnemyUnitType() == EnemyConfig.EEnemyUnitType.BOSS;
    }
    IsGOLD_BOSS() {
        return this.EnemyUnitType() == EnemyConfig.EEnemyUnitType.GOLD_BOSS;
    }
    IsCANDY_BOSS() {
        return this.EnemyUnitType() == EnemyConfig.EEnemyUnitType.CANDY_BOSS;
    }
    IsCANDY_WAVE() {
        return this.EnemyUnitType() == EnemyConfig.EEnemyUnitType.CANDY_WAVE;
    }

    onDestroy(): void {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (GameFunc.IsValid(npc)) {
            GDestroyUnit(npc);
        }
    }

    OnSpawnAnimalFinish() {
        this.SyncClient()
    }

    onKilled(events: EntityKilledEvent): void {
        super.onKilled(events);
        this.GetPlayer().EnemyManagerComp().killEnemy(this);
    }

    Config() {
        return KVHelper.KvServerConfig.building_unit_enemy[this.ConfigID];
    }
    GetDotaHeroName() {
        return this.Config().DotaHeroName as string;
    }
    GetRound<T extends ERound>(): T {
        return this.GetPlayer().RoundManagerComp().RoundInfo[this.RoundID] as T;
    }

    GetRoundBasicUnitConfig() {
        if (this.OnlyKey != null) {
            return this.GetRound<ERoundBoard>().config.unitinfo[this.OnlyKey];
        }
    }

    EnemyMoveComp() {
        return this.GetComponentByName<EnemyMoveComponent>("EnemyMoveComponent");
    }

    BattleUnitManager() {
        return this.GetComponentByName<BattleUnitManagerComponent>("BattleUnitManagerComponent");
    }
}
declare global {
    type IEnemyUnitEntityRoot = EnemyUnitEntityRoot;
    var GEnemyUnitEntityRoot: typeof EnemyUnitEntityRoot;
}