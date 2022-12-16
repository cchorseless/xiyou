import { LogHelper } from "../../../helper/LogHelper";
import { registerET, ET } from "../../../libs/Entity";
import { PlayerScene } from "../Player/PlayerScene";

@registerET()
export class CourierShopComponent extends ET.Component {
    onSerializeToEntity() {
        PlayerScene.GetPlayer(this.BelongPlayerid)?.AddOneComponent(this);
    }



}