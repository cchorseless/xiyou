import { ET, registerET } from "../../../libs/Entity";
import { PlayerScene } from "../../components/Player/PlayerScene";

@registerET()
export class PublicShopComponent extends ET.Component {
    shopDiscount: number = 100;

    onSerializeToEntity(): void {
        PlayerScene.Scene.AddOneComponent(this);
    }
}