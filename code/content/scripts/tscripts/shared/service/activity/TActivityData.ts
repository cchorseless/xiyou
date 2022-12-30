import { ET } from "../../lib/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";


@GReloadable
export class TActivityData extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public ConfigId: number;
    public StartTime: string;
    public EndTime: string;
    get CharacterActivity() { return this.GetParent<CharacterActivityComponent>(); }

}