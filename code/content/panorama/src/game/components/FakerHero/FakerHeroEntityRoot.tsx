import { BaseEntityRoot } from "../../../libs/BaseEntityRoot";
import { ET, registerET } from "../../../libs/Entity";
import { PlayerScene } from "../Player/PlayerScene";
import { FHeroCombinationManagerComponent } from "./FHeroCombinationManagerComponent";


@registerET()
export class FakerHeroEntityRoot extends BaseEntityRoot {
    onSerializeToEntity() {
        PlayerScene.EntityRootManage.addFakerHero(this);
    }

    get FHeroCombinationManager() {
        return this.GetComponentByName<FHeroCombinationManagerComponent>("FHeroCombinationManagerComponent")!;
    }
}