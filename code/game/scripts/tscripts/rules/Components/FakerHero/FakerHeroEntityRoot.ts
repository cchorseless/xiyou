import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { PlayerCreateUnitEntityRoot } from "../Player/PlayerCreateUnitEntityRoot";
import { FHeroCombinationManagerComponent } from "./FHeroCombinationManagerComponent";

export class FakerHeroEntityRoot extends PlayerCreateUnitEntityRoot {
    public readonly IsSerializeEntity: boolean = true;

    onAwake(playerid: PlayerID, conf: string) {
        let npc = this.GetDomain<BaseNpc_Plus>();
        (this as any).Playerid = playerid;
        (this as any).ConfigID = conf;
        (this as any).EntityId = npc.GetEntityIndex();
        this.SyncClientEntity(this, true);
        this.AddComponent(PrecacheHelper.GetRegClass<typeof FHeroCombinationManagerComponent>("FHeroCombinationManagerComponent"));
    }

    FHeroCombinationManager() {
        return this.GetComponentByName<FHeroCombinationManagerComponent>("FHeroCombinationManagerComponent");
    }
}