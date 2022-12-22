import { GetRegClass } from "../../../GameCache";
import { GameFunc } from "../../../GameFunc";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { BattleUnitManagerComponent } from "../BattleUnit/BattleUnitManagerComponent";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";
import { ERound } from "../Round/ERound";
import { ERoundBoard } from "../Round/ERoundBoard";
import { EnemyKillPrizeComponent } from "./EnemyKillPrizeComponent";
import { EnemyMoveComponent } from "./EnemyMoveComponent";
import { EnemyUnitComponent } from "./EnemyUnitComponent";

export class EnemyUnitEntityRoot extends BattleUnitEntityRoot {
    readonly RoundID: string;
    readonly OnlyKey: string;

    onAwake(playerid: PlayerID, confid: string, roundid: string, onlyKey: string = null) {
        (this as any).Playerid = playerid;
        (this as any).ConfigID = confid;
        (this as any).RoundID = roundid;
        (this as any).OnlyKey = onlyKey;
        (this as any).EntityId = this.GetDomain<BaseNpc_Plus>().GetEntityIndex();
        this.AddComponent(GetRegClass<typeof BattleUnitManagerComponent>("BattleUnitManagerComponent"));
        this.AddComponent(GetRegClass<typeof CombinationComponent>("CombinationComponent"));
        this.addBattleComp();
        this.AddComponent(GetRegClass<typeof EnemyUnitComponent>("EnemyUnitComponent"));
        this.AddComponent(GetRegClass<typeof EnemyKillPrizeComponent>("EnemyKillPrizeComponent"));
    }

    onDestroy(): void {
        let npc = this.GetDomain<BaseNpc_Plus>();
        if (GameFunc.IsValid(npc)) {
            npc.SafeDestroy();
        }
    }

    OnSpawnAnimalFinish() {
        let player = GPlayerSystem.GetInstance().GetPlayer(this.Playerid);
        if (player) {
            player.SyncClientEntity(this.EnemyUnitComp());
        }
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
    EnemyUnitComp() {
        return this.GetComponentByName<EnemyUnitComponent>("EnemyUnitComponent");
    }
    EnemyKillPrize() {
        return this.GetComponentByName<EnemyKillPrizeComponent>("EnemyKillPrizeComponent");
    }
    EnemyMoveComp() {
        return this.GetComponentByName<EnemyMoveComponent>("EnemyMoveComponent");
    }


    BattleUnitManager() {
        return this.GetComponentByName<BattleUnitManagerComponent>("BattleUnitManagerComponent");
    }
}
