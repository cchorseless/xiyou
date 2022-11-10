import { NetHelper } from "../../../helper/NetHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { registerET } from "../../../libs/Entity";
import { ECombination } from "../Combination/ECombination";
import { PlayerScene } from "../Player/PlayerScene";

@registerET()
export class FHeroCombination extends ECombination {
    onSerializeToEntity(): void {
        this.onReload();
    }

    onReload() {
        if (this.IsEmpty()) { return; }
        let player = PlayerScene.EntityRootManage.getFakerHero(this.BelongPlayerid)
        player!.FHeroCombinationManager.addOneCombination(this);
    }
    isFakerCombination() {
        return true;
    }
}