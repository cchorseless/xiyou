import { ET, registerET } from "../../../libs/Entity";
import { ItemEntityRoot } from "../../components/Item/ItemEntityRoot";
import { PlayerScene } from "../../components/Player/PlayerScene";

@registerET()
export class PublicBagSystemComponent extends ET.Component {
    AllItem: { [slot: string]: string } = {};
    onSerializeToEntity(): void {
        PlayerScene.Scene.AddOneComponent(this);
    }


    getItemByIndex(slot: string) {
        let entityid = this.AllItem[slot];
        if (entityid == null) return;
        return PlayerScene.EntityRootManage.GetChild<ItemEntityRoot>(entityid);
    }
}