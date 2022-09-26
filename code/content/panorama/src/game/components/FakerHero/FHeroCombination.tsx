import { NetHelper } from "../../../helper/NetHelper";
import { registerET } from "../../../libs/Entity";
import { ECombination } from "../Combination/ECombination";
import { PlayerScene } from "../Player/PlayerScene";

@registerET()
export class FHeroCombination extends ECombination {
    onSerializeToEntity(): void {
        this.onReload();
    }

    onReload(): void {
        if (this.IsEmpty()) { return; }
        let playerid = NetHelper.GetPlayerIdByNetTableName(this.NetTableName);
        PlayerScene.EntityRootManage.getFakerHero(playerid)!.FHeroCombinationManager.addOneCombination(this);
    }
    isFakerCombination() {
        return true;
    }
}