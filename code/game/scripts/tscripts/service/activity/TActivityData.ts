import { ET } from "../../rules/Entity/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";
import { reloadable } from "../../GameCache";

@reloadable
export class TActivityData extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public ConfigId: number;
    public StartTime: string;
    public EndTime: string;
    public CharacterActivity() { return this.GetParent<CharacterActivityComponent>(); }

}