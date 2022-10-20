import { ET, registerET } from "../../../libs/Entity";
import { PlayerScene } from "../../components/Player/PlayerScene";

@registerET()
export class PublicBagSystemComponent extends ET.Component {
    onSerializeToEntity(): void {
        PlayerScene.Scene.AddOneComponent(this);
    }
}