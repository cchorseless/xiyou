import { KVHelper } from "../../../helper/KVHelper";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { AbilityManagerComponent } from "../Ability/AbilityManagerComponent";
import { ChessComponent } from "../ChessControl/ChessComponent";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { ItemManagerComponent } from "../Item/ItemManagerComponent";
import { PlayerCreateUnitEntityRoot } from "../Player/PlayerCreateUnitEntityRoot";
import { RoundBuildingComponent } from "../Round/RoundBuildingComponent";
import { WearableComponent } from "../Wearable/WearableComponent";
import { BuildingComponent } from "./BuildingComponent";
import { BuildingPropsComponent } from "./BuildingPropsComponent";

export class BuildingEntityRoot extends PlayerCreateUnitEntityRoot {
    public onAwake(playerid: PlayerID, conf: string, location: Vector, angle: number) {
        (this as any).Playerid = playerid;
        (this as any).ConfigID = conf;
        (this as any).EntityId = this.GetDomain<BaseNpc_Plus>().GetEntityIndex();
        this.AddComponent(PrecacheHelper.GetRegClass<typeof BuildingComponent>("BuildingComponent"), location, angle);
        this.AddComponent(PrecacheHelper.GetRegClass<typeof ChessComponent>("ChessComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof CombinationComponent>("CombinationComponent"));
        if (this.GetDotaHeroName()) {
            this.AddComponent(PrecacheHelper.GetRegClass<typeof WearableComponent>("WearableComponent"), this.GetDotaHeroName());
        }
        this.AddComponent(PrecacheHelper.GetRegClass<typeof AbilityManagerComponent>("AbilityManagerComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof ItemManagerComponent>("ItemManagerComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof RoundBuildingComponent>("RoundBuildingComponent"));
        this.updateNetTable();
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
    AbilityManagerComp() {
        return this.GetComponentByName<AbilityManagerComponent>("AbilityManagerComponent");
    }
    ItemManagerComp() {
        return this.GetComponentByName<ItemManagerComponent>("ItemManagerComponent");
    }
    CombinationComp() {
        return this.GetComponentByName<CombinationComponent>("CombinationComponent");
    }
    ChessComp() {
        return this.GetComponentByName<ChessComponent>("ChessComponent");
    }
    RoundBuildingComp() {
        return this.GetComponentByName<RoundBuildingComponent>("RoundBuildingComponent");
    }
}
