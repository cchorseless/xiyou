import { KVHelper } from "../../../helper/KVHelper";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { BattleUnitManagerComponent } from "../BattleUnit/BattleUnitManagerComponent";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
import { RoundBuildingComponent } from "../Round/RoundBuildingComponent";
import { BuildingComponent } from "./BuildingComponent";
import { BuildingPropsComponent } from "./BuildingPropsComponent";

export class BuildingEntityRoot extends PlayerCreateBattleUnitEntityRoot {
    public onAwake(playerid: PlayerID, conf: string) {
        (this as any).Playerid = playerid;
        (this as any).ConfigID = conf;
        (this as any).EntityId = this.GetDomain<BaseNpc_Plus>().GetEntityIndex();
        this.AddComponent(PrecacheHelper.GetRegClass<typeof BattleUnitManagerComponent>("BattleUnitManagerComponent"));
        this.addBattleComp();
        this.AddComponent(PrecacheHelper.GetRegClass<typeof BuildingComponent>("BuildingComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof RoundBuildingComponent>("RoundBuildingComponent"));
        this.SyncClientEntity(this);
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

    onKilled(events: EntityKilledEvent): void {
        let npc = this.GetDomain<BaseNpc_Plus>();
        npc.StartGesture(GameActivity_t.ACT_DOTA_DIE);
    }

    Config() {
        return KVHelper.KvConfig().building_unit_tower["" + this.ConfigID];
    }

    GetDotaHeroName() {
        return this.Config().DotaHeroName;
    }

    BuildingComp() {
        return this.GetComponentByName<BuildingComponent>("BuildingComponent");
    }
    BuildingPropComp() {
        return this.GetComponentByName<BuildingPropsComponent>("BuildingPropsComponent");
    }
    RoundBuildingComp() {
        return this.GetComponentByName<RoundBuildingComponent>("RoundBuildingComponent");
    }

    BattleUnitManager() {
        return this.GetComponentByName<BattleUnitManagerComponent>("BattleUnitManagerComponent");
    }
}
