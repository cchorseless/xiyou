import { BaseEntityRoot } from "../../../libs/BaseEntityRoot";
import { ET, registerET } from "../../../libs/Entity";
import { PlayerScene } from "../Player/PlayerScene";

@registerET()
export class ItemEntityRoot extends BaseEntityRoot {

    onSerializeToEntity() {
        PlayerScene.EntityRootManage.addItem(this);
    }
    onDestroy() {
        PlayerScene.EntityRootManage.removeItem(this);
    }
}
