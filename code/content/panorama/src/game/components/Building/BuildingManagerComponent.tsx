import { NetHelper } from "../../../helper/NetHelper";
import { ET, registerET } from "../../../libs/Entity";
import { BuildingConfig } from "../../system/Building/BuildingConfig";
import { PlayerScene } from "../Player/PlayerScene";
import { BuildingEntityRoot } from "./BuildingEntityRoot";

@registerET()
export class BuildingManagerComponent extends ET.Component {
    onSerializeToEntity(): void {
        PlayerScene.GetPlayer(this.BelongPlayerid)?.AddOneComponent(this);
    }
    buildingDamageInfo: { [k: string]: BuildingConfig.I.IBuildingDamageInfo } = {};

}
