import { ET, registerET } from "../../../libs/Entity";
import { CharacterTitleComponent } from "./CharacterTitleComponent";

@registerET()
export class CharacterTitleItem extends ET.Entity {
    public ConfigId: number;
    public IsValid: boolean;
    public DisabledTime: string;
    public TitleBuff: number[];

    public get CharacterTitleComp(): CharacterTitleComponent { return this.GetParent<CharacterTitleComponent>(); }
}