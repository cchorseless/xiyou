import { ET, serializeETProps } from "../../lib/Entity";
import { CharacterTaskComponent } from "./CharacterTaskComponent";


@GReloadable
export class TCharacterTaskItem extends ET.Entity {


    @serializeETProps()
    public ConfigId: number;
    @serializeETProps()
    public Progress: number;
    @serializeETProps()
    public IsAchieve: boolean;
    @serializeETProps()
    public IsPrizeGet: boolean;

    public get CharacterTaskComp(): CharacterTaskComponent { return this.GetParent<CharacterTaskComponent>(); }
}