import { KV_DATA } from "../../../config/KvAllInterface";
import { KVHelper } from "../../../helper/KVHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { registerET, ET } from "../../../libs/Entity";
import { PlayerScene } from "../Player/PlayerScene";


@registerET()
export class ECombination extends ET.Entity {
    public combinationName: string;
    public combinationId: string;
    public activeNeedCount: number;
    public uniqueConfigList: string[] = [];

    onSerializeToEntity(): void {
        this.onReload();
    }
    onReload(): void {
        if (this.IsEmpty()) { return; }
        let playerid = NetHelper.GetPlayerIdByNetTableName(this.NetTableName);
        PlayerScene.EntityRootManage.getPlayer(playerid)?.CombinationManager.addOneCombination(this);
    }

    isFakerCombination() {
        return false;
    }

    IsEmpty() {
        return this.uniqueConfigList.length == 0;
    }
}