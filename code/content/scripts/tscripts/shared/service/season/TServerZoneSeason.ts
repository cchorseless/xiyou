import { ET, serializeETProps } from "../../lib/Entity";


@GReloadable
export class TServerZoneSeason extends ET.Entity {


    @serializeETProps()
    public ConfigId: number;
    @serializeETProps()
    public StartTime: string;
    @serializeETProps()
    public EndTime: string;
}