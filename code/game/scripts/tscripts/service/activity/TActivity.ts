import { ET, registerET } from "../../rules/Entity/Entity";
import { ServerZoneActivityComponent } from "./ServerZoneActivityComponent";

@registerET()
export class TActivity extends ET.Entity {
    public ActivityId: number;
    public ConfigId: number;
    public ValidState: boolean;
    public StartTime: string;
    public EndTime: string;
    public get ServerZoneActivity() { return this.GetParent<ServerZoneActivityComponent>(); }

}