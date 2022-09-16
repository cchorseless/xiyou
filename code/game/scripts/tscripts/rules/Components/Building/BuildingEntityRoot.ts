import { KVHelper } from "../../../helper/KVHelper";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { AbilityManagerComponent } from "../Ability/AbilityManagerComponent";
import { ChessComponent } from "../ChessControl/ChessComponent";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { ItemManagerComponent } from "../Item/ItemManagerComponent";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
import { RoundBuildingComponent } from "../Round/RoundBuildingComponent";
import { WearableComponent } from "../Wearable/WearableComponent";
import { BuildingComponent } from "./BuildingComponent";
import { BuildingPropsComponent } from "./BuildingPropsComponent";

export class BuildingEntityRoot extends PlayerCreateBattleUnitEntityRoot {
    public onAwake(playerid: PlayerID, conf: string, location: Vector, angle: number) {
        (this as any).Playerid = playerid;
        (this as any).ConfigID = conf;
        (this as any).EntityId = this.GetDomain<BaseNpc_Plus>().GetEntityIndex();
        this.addBattleComp();
        this.AddComponent(PrecacheHelper.GetRegClass<typeof BuildingComponent>("BuildingComponent"), location, angle);
        this.AddComponent(PrecacheHelper.GetRegClass<typeof RoundBuildingComponent>("RoundBuildingComponent"));
        this.updateNetTable();
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

    updateNetTable() {
        this.GetPlayer().SyncClientEntity(this);
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
}
