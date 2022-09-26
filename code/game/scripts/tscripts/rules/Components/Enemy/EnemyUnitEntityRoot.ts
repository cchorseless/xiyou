import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { AbilityManagerComponent } from "../Ability/AbilityManagerComponent";
import { BattleUnitManagerComponent } from "../BattleUnit/BattleUnitManagerComponent";
import { ChessComponent } from "../ChessControl/ChessComponent";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { ItemManagerComponent } from "../Item/ItemManagerComponent";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
import { PlayerCreateUnitEntityRoot, PlayerCreateUnitType } from "../Player/PlayerCreateUnitEntityRoot";
import { ERound } from "../Round/ERound";
import { ERoundBoard } from "../Round/ERoundBoard";
import { RoundEnemyComponent } from "../Round/RoundEnemyComponent";
import { WearableComponent } from "../Wearable/WearableComponent";
import { EnemyKillPrizeComponent } from "./EnemyKillPrizeComponent";
import { EnemyMoveComponent } from "./EnemyMoveComponent";
import { EnemyPropsComponent } from "./EnemyPropsComponent";
import { EnemyUnitComponent } from "./EnemyUnitComponent";

export class EnemyUnitEntityRoot extends PlayerCreateBattleUnitEntityRoot {
    readonly RoundID: string;
    readonly OnlyKey: string;

    onAwake(playerid: PlayerID, confid: string, roundid: string, onlyKey: string = null) {
        (this as any).Playerid = playerid;
        (this as any).ConfigID = confid;
        (this as any).RoundID = roundid;
        (this as any).OnlyKey = onlyKey;
        (this as any).EntityId = this.GetDomain<BaseNpc_Plus>().GetEntityIndex();
        this.AddComponent(PrecacheHelper.GetRegClass<typeof BattleUnitManagerComponent>("BattleUnitManagerComponent"));
        this.addBattleComp();
        this.AddComponent(PrecacheHelper.GetRegClass<typeof EnemyUnitComponent>("EnemyUnitComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof EnemyKillPrizeComponent>("EnemyKillPrizeComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof EnemyPropsComponent>("EnemyPropsComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof RoundEnemyComponent>("RoundEnemyComponent"));
    }

    onDestroy(): void {
        let npc = this.GetDomain<BaseNpc_Plus>();
        if (npc && !npc.__safedestroyed__) {
            npc.StartGesture(GameActivity_t.ACT_DOTA_DIE);
            TimerHelper.addTimer(
                3,
                () => {
                    npc.SafeDestroy();
                },
                this
            );
        }
    }

    OnSpawnAnimalFinish() {
        let player = GameRules.Addon.ETRoot.PlayerSystem().GetPlayer(this.Playerid);
        if (player) {
            player.SyncClientEntity(this.EnemyUnitComp());
        }
    }

    onKilled(events: EntityKilledEvent): void {
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
    EnemyPropsComp() {
        return this.GetComponentByName<EnemyPropsComponent>("EnemyPropsComponent");
    }
    RoundEnemyComp() {
        return this.GetComponentByName<RoundEnemyComponent>("RoundEnemyComponent");
    }
    BattleUnitManager() {
        return this.GetComponentByName<BattleUnitManagerComponent>("BattleUnitManagerComponent");
    }
}
