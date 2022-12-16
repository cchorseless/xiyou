import { PublicBagConfig } from "../../../../../../game/scripts/tscripts/shared/PublicBagConfig";
import { LogHelper } from "../../../helper/LogHelper";
import { registerET, ET } from "../../../libs/Entity";
import { ItemEntityRoot } from "../Item/ItemEntityRoot";
import { PlayerScene } from "../Player/PlayerScene";

@registerET()
export class CourierBagComponent extends ET.Component {
    onSerializeToEntity() {
        LogHelper.print("CourierBagComponent", this.BelongPlayerid);
        PlayerScene.GetPlayer(this.BelongPlayerid)?.AddOneComponent(this);
    }
    AllItem: { [itemtype: string]: { [slot: string]: string } } = {};
    iMaxArtifact = 6;
    getAllArtifact() {
        let items = this.AllItem[PublicBagConfig.EBagItemType.ARTIFACT] || {};
        let artifacts: ItemEntityRoot[] = [];
        let keys = Object.keys(items);
        keys.sort((a, b) => { return Number(a) - Number(b) });
        keys.forEach(slot => {
            let entity = PlayerScene.EntityRootManage.GetChild<ItemEntityRoot>(items[slot]);
            if (entity) {
                artifacts.push(entity);
            }
        })
        return artifacts;
    }

}