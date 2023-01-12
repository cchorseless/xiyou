import { ET, serializeETProps } from "../../lib/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";


@GReloadable
export class TActivityData extends ET.Entity {


    @serializeETProps()
    public ConfigId: number;
    @serializeETProps()
    public StartTime: string;
    @serializeETProps()
    public EndTime: string;
    get CharacterActivity() { return this.GetParent<CharacterActivityComponent>(); }

}