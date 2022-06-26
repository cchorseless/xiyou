import { KV_DATA } from "../../../config/KvAllInterface";
import { ET, registerET } from "../../../libs/Entity";
import { PlayerConfig } from "../../system/Player/PlayerConfig";
import { PlayerScene } from "../Player/PlayerScene";
import { BuildingComponent } from "./BuildingComponent";

@registerET()
export class BuildingEntityRoot extends ET.Entity implements PlayerConfig.I.INetTableETEntity {
    EntityId: EntityIndex;
    Playerid: PlayerID;
    ConfigID: string;

    Config() {
        return KV_DATA.building_unit_tower.building_unit_tower[this.ConfigID];
    }

    onSerializeToEntity() {
        PlayerScene.PlayerEntityRootComp.addBuilding(this);
    }
    onDestroy() {
        PlayerScene.PlayerEntityRootComp.removeBuilding(this);
    }
    get BuildingComp() {
        return this.GetComponentByName<typeof BuildingComponent>("BuildingComponent");
    }
}
