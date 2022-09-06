import { ET, registerET } from "../../rules/Entity/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";

@registerET()
export class TActivityData extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public ConfigId: number;
    public StartTime: string;
    public EndTime: string;
    public CharacterActivity() { return this.GetParent<CharacterActivityComponent>(); }

}