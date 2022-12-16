import { PublicBagConfig } from "../../../../../../game/scripts/tscripts/shared/PublicBagConfig";
import { LogHelper } from "../../../helper/LogHelper";
import { registerET, ET } from "../../../libs/Entity";
import { PlayerScene } from "../Player/PlayerScene";

@registerET()
export class CourierBagComponent extends ET.Component {
    onSerializeToEntity() {
        PlayerScene.GetPlayer(this.BelongPlayerid)?.AddOneComponent(this);
    }
    AllItem: { [itemtype: string]: { [slot: string]: string } } = {};


    getAllArtifact() {
        let items = this.AllItem[PublicBagConfig.EBagItemType.ARTIFACT];

    }

}