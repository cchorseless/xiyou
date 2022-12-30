
import { ET } from "../../lib/Entity";
import { ServerZoneActivityComponent } from "./ServerZoneActivityComponent";

@GReloadable
export class TActivity extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;
    public ActivityId: number;
    public ConfigId: number;
    public ValidState: boolean;
    public StartTime: string;
    public EndTime: string;
    public ServerZoneActivity() { return this.GetParent<ServerZoneActivityComponent>(); }

}