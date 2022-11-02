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
        await PlayerScene.GetPlayer(this.BelongPlayerid)?.CombinationManager.addOneCombination(this);
    }

    isFakerCombination() {
        return false;
    }

    IsEmpty() {
        return this.uniqueConfigList.length == 0;
    }
}