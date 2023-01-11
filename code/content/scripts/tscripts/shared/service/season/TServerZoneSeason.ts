import { ET } from "../../lib/Entity";


@GReloadable
export class TServerZoneSeason extends ET.Entity {


    public ConfigId: number;
    public StartTime: string;
    public EndTime: string;
}