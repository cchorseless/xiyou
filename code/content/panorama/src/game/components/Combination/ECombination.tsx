import { registerET, ET } from "../../../libs/Entity";
import { PlayerScene } from "../Player/PlayerScene";


@registerET()
export class ECombination extends ET.Entity {
    onSerializeToEntity(): void {
        if (this.IsFromLocalNetTable()) {
            PlayerScene.Local.CombinationManager.AddOneChild(this);
        }
    }
}