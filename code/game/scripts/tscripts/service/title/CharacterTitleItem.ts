import { ET, registerET } from "../../rules/Entity/Entity";
import { CharacterTitleComponent } from "./CharacterTitleComponent";

@registerET()
export class CharacterTitleItem extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public ConfigId: number;
    public IsValid: boolean;
    public DisabledTime: string;
    public TitleBuff: number[];

    public CharacterTitleComp(): CharacterTitleComponent { return this.GetParent<CharacterTitleComponent>(); }
}