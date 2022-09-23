import { NetHelper } from "../../../helper/NetHelper";
import { ET, registerET } from "../../../libs/Entity";
import { BuildingConfig } from "../../system/Building/BuildingConfig";
import { PlayerScene } from "../Player/PlayerScene";
import { BuildingEntityRoot } from "./BuildingEntityRoot";

@registerET()
export class BuildingManagerComponent extends ET.Component {
    onSerializeToEntity(): void {
        let playerid = NetHelper.GetPlayerIdByNetTableName(this.NetTableName);
        PlayerScene.EntityRootManage.getPlayer(playerid)?.AddOneComponent(this);
    }
    buildingDamageInfo: { [k: string]: BuildingConfig.I.IBuildingDamageInfo } = {};

}
