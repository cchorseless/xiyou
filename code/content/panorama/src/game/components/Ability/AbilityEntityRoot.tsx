import { ET, registerET } from "../../../libs/Entity";
import { PlayerCreateUnitEntityRoot } from "../Player/PlayerCreateUnitEntityRoot";
import { PlayerScene } from "../Player/PlayerScene";

@registerET()
export class AbilityEntityRoot extends PlayerCreateUnitEntityRoot {
    costType: number;
    costCount: number;

    onSerializeToEntity() {
        PlayerScene.EntityRootManage.addAbility(this);
    }
    onDestroy() {
        PlayerScene.EntityRootManage.removeAbility(this);
    }
}
