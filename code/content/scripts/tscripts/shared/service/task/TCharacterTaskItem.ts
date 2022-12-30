import { ET } from "../../lib/Entity";
import { CharacterTaskComponent } from "./CharacterTaskComponent";


@GReloadable
export class TCharacterTaskItem extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public ConfigId: number;
    public Progress: number;
    public IsAchieve: boolean;
    public IsPrizeGet: boolean;

    public get CharacterTaskComp(): CharacterTaskComponent { return this.GetParent<CharacterTaskComponent>(); }
}