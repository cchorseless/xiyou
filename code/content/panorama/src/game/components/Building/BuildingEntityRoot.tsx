import { KvAllInterface } from "../../../config/KvAllInterface";
import { ET, registerET } from "../../../libs/Entity";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
import { PlayerScene } from "../Player/PlayerScene";
import { BuildingComponent } from "./BuildingComponent";

@registerET()
export class BuildingEntityRoot extends PlayerCreateBattleUnitEntityRoot {

    Config() {
        return (GameUI.CustomUIConfig() as KvAllInterface).building_unit_tower.building_unit_tower[this.ConfigID];
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
