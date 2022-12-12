import { ET, registerET } from "../../../libs/Entity";
import { PlayerScene } from "../../components/Player/PlayerScene";

@registerET()
export class PublicBagSystemComponent extends ET.Component {
    AllItem: { [key: string]: string } = {};
    onSerializeToEntity(): void {
        PlayerScene.Scene.AddOneComponent(this);
    }


    getItemByIndex(key: string) {
        let entityid = this.AllItem[key];
        if (entityid == null) return;
        // return GameRules.Addon.ETRoot.GetDomainChild<ItemEntityRoot>(entityid);
    }
}