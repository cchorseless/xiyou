import { NetHelper } from "../../../helper/NetHelper";
import { registerET, ET } from "../../../libs/Entity";
import { PlayerScene } from "../Player/PlayerScene";


@registerET()
export class ECombination extends ET.Entity {
    public combinationId: string;
    public activeNeedCount: number;
    public uniqueConfigList: string[] = [];

    onSerializeToEntity(): void {
        let playerid = NetHelper.GetPlayerIdByNetTableName(this.NetTableName);
        PlayerScene.EntityRootManage.getPlayer(playerid)?.CombinationManager.addCombination(this);
    }


}