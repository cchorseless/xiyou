import { ET, registerET } from "../../rules/Entity/Entity";

@registerET()
export class TServerZoneSeason extends ET.Entity {
    public ConfigId: number;
    public StartTime: string;
    public EndTime: string;
}