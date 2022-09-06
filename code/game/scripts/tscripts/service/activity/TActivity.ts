import { ET, registerET } from "../../rules/Entity/Entity";
import { ServerZoneActivityComponent } from "./ServerZoneActivityComponent";

@registerET()
export class TActivity extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;
    public ActivityId: number;
    public ConfigId: number;
    public ValidState: boolean;
    public StartTime: string;
    public EndTime: string;
    public ServerZoneActivity() { return this.GetParent<ServerZoneActivityComponent>(); }

}