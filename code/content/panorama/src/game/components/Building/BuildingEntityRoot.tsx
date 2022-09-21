import { KV_DATA } from "../../../config/KvAllInterface";
import { ET, registerET } from "../../../libs/Entity";
import { PlayerCreateUnitEntityRoot } from "../Player/PlayerCreateUnitEntityRoot";
import { PlayerScene } from "../Player/PlayerScene";
import { BuildingComponent } from "./BuildingComponent";

@registerET()
export class BuildingEntityRoot extends PlayerCreateUnitEntityRoot {

    Config() {
        return KV_DATA.building_unit_tower.building_unit_tower[this.ConfigID];
    }

    onSerializeToEntity() {
        PlayerScene.EntityRootManage.addBuilding(this);
    }
    onDestroy() {
        PlayerScene.EntityRootManage.removeBuilding(this);
    }
    get BuildingComp() {
        return this.GetComponentByName<BuildingComponent>("BuildingComponent");
    }
}
