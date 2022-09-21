import { ET, registerET } from "../../../libs/Entity";
import { PlayerConfig } from "../../system/Player/PlayerConfig";
import { PlayerScene } from "../Player/PlayerScene";

@registerET()
export class AbilityEntityRoot extends ET.Entity implements PlayerConfig.I.INetTableETEntity {
    EntityId: EntityIndex;
    costType: number;
    costCount: number;

    onSerializeToEntity() {
        PlayerScene.EntityRootManage.addAbility(this);
    }
    onDestroy() {
        PlayerScene.EntityRootManage.removeAbility(this);
    }
}
