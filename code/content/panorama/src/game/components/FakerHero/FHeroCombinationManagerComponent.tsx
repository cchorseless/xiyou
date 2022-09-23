import { NetHelper } from "../../../helper/NetHelper";
import { ET, registerET } from "../../../libs/Entity";
import { CombinationManagerComponent } from "../Combination/CombinationManagerComponent";
import { PlayerScene } from "../Player/PlayerScene";


@registerET()
export class FHeroCombinationManagerComponent extends CombinationManagerComponent {
    onSerializeToEntity(): void {
        let playerid = NetHelper.GetPlayerIdByNetTableName(this.NetTableName);
        PlayerScene.EntityRootManage.getFakerHero(playerid)!.AddOneComponent(this);
    }
}