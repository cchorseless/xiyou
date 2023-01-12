
import { ET, serializeETProps } from "../../lib/Entity";
import { ServerZoneActivityComponent } from "./ServerZoneActivityComponent";

@GReloadable
export class TActivity extends ET.Entity {

    @serializeETProps()
    public ActivityId: number;
    @serializeETProps()
    public ConfigId: number;
    @serializeETProps()
    public ValidState: boolean;
    @serializeETProps()
    public StartTime: string;
    @serializeETProps()
    public EndTime: string;
    public ServerZoneActivity() { return this.GetParent<ServerZoneActivityComponent>(); }

}