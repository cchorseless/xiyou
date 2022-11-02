import { NetHelper } from "../../../helper/NetHelper";
import { ET, registerET } from "../../../libs/Entity";
import { CombinationManagerComponent } from "../Combination/CombinationManagerComponent";
import { PlayerScene } from "../Player/PlayerScene";


@registerET()
export class FHeroCombinationManagerComponent extends CombinationManagerComponent {
    onSerializeToEntity(): void {
        PlayerScene.EntityRootManage.getFakerHero(this.BelongPlayerid)?.AddOneComponent(this);
    }
}