import { LogHelper } from "../../../helper/LogHelper";
import { ET, registerET } from "../../../libs/Entity";
import { PlayerScene } from "../../components/Player/PlayerScene";
import { BagComponent } from "../bag/BagComponent";
import { CharacterDataComponent } from "./CharacterDataComponent";
import { SeedRandomComponent } from "./SeedRandomComponent";

@registerET()
export class TCharacter extends ET.Component {
    PlayerId: string;
    Name: string;

    onSerializeToEntity() {
        PlayerScene.Scene.AddOneComponent(this);
    }
    get BagComp() {
        return this.GetComponentByName<typeof BagComponent>("BagComponent");
    }
    get SeedRandomComp() {
        return this.GetComponentByName<typeof SeedRandomComponent>("SeedRandomComponent");
    }
    get CharacterDataComp() {
        return this.GetComponentByName<typeof CharacterDataComponent>("CharacterDataComponent");
    }
}
