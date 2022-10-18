import { ET } from "../../rules/Entity/Entity";
import { CharacterBuffComponent } from "./CharacterBuffComponent";
import { reloadable } from "../../GameCache";

@reloadable
export class TBuffItem extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public ConfigId: number;

    public BuffLayerCount: number;

    public DisabledTime: string;

    public IsValid: boolean;

    public get BuffComp(): CharacterBuffComponent { return this.GetParent<CharacterBuffComponent>(); }

    onSerializeToEntity() {

    }
}
