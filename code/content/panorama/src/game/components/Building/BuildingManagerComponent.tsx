import { BuildingConfig } from "../../../../../../game/scripts/tscripts/shared/BuildingConfig";
import { NetHelper } from "../../../helper/NetHelper";
import { ET, registerET } from "../../../libs/Entity";
import { PlayerScene } from "../Player/PlayerScene";
import { BuildingEntityRoot } from "./BuildingEntityRoot";

@registerET()
export class BuildingManagerComponent extends ET.Component {
    onSerializeToEntity(): void {
        PlayerScene.GetPlayer(this.BelongPlayerid)?.AddOneComponent(this);
        BuildingConfig.BUILDING_SIZE;
    }

}
