import { ET, registerET } from "../../../libs/Entity";
import { PlayerConfig } from "../../system/Player/PlayerConfig";
import { PlayerCreateUnitEntityRoot } from "../Player/PlayerCreateUnitEntityRoot";
import { PlayerScene } from "../Player/PlayerScene";


@registerET()
export class FakerHeroEntityRoot extends PlayerCreateUnitEntityRoot {
    onSerializeToEntity() {
        PlayerScene.EntityRootManage.addFakerHero(this);
    }
}