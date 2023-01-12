import { ET, serializeETProps } from "../../lib/Entity";
import { CharacterTitleComponent } from "./CharacterTitleComponent";


@GReloadable
export class CharacterTitleItem extends ET.Entity {


    @serializeETProps()
    public ConfigId: number;
    @serializeETProps()
    public IsValid: boolean;
    @serializeETProps()
    public DisabledTime: string;
    @serializeETProps()
    public TitleBuff: number[];

    public CharacterTitleComp(): CharacterTitleComponent { return this.GetParent<CharacterTitleComponent>(); }
}