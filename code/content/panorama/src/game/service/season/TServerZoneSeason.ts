import { ET, registerET } from "../../../libs/Entity";

@registerET()
export class TServerZoneSeason extends ET.Entity {
    public ConfigId: number;
    public StartTime: string;
    public EndTime: string;
}