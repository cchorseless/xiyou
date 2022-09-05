import { ET, registerET } from "../../../libs/Entity";
import { CharacterBuffComponent } from "./CharacterBuffComponent";

@registerET()
export class TBuffItem extends ET.Entity {
    public ConfigId: number;

    public BuffLayerCount: number;

    public DisabledTime: string;

    public IsValid: boolean;

    public get BuffComp(): CharacterBuffComponent { return this.GetParent<CharacterBuffComponent>(); }

    onSerializeToEntity() {

    }
}
