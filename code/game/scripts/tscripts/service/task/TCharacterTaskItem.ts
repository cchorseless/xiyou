import { ET, registerET } from "../../rules/Entity/Entity";
import { CharacterTaskComponent } from "./CharacterTaskComponent";

@registerET()
export class TCharacterTaskItem extends ET.Entity {
    public ConfigId: number;
    public Progress: number;
    public IsAchieve: boolean;
    public IsPrizeGet: boolean;

    public get CharacterTaskComp(): CharacterTaskComponent { return this.GetParent<CharacterTaskComponent>(); }
}