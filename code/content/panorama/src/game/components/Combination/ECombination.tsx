import { KVHelper } from "../../../helper/KVHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
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
    async onReload() {
        if (this.IsEmpty()) { return; }
        let playerid = NetHelper.GetPlayerIdByNetTableName(this.NetTableName);
        let player = PlayerScene.EntityRootManage.getPlayer(playerid)
        if (player?.CombinationManager == null) {
            await TimerHelper.DelayTime(0.1);
        }
        await player?.CombinationManager.addOneCombination(this);
    }

    isFakerCombination() {
        return false;
    }

    IsEmpty() {
        return this.uniqueConfigList.length == 0;
    }
}