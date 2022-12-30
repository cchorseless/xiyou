import { ET } from "../../lib/Entity";
import { CharacterTitleComponent } from "./CharacterTitleComponent";


@GReloadable
export class CharacterTitleItem extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public ConfigId: number;
    public IsValid: boolean;
    public DisabledTime: string;
    public TitleBuff: number[];

    public CharacterTitleComp(): CharacterTitleComponent { return this.GetParent<CharacterTitleComponent>(); }
}