import { ET, registerET } from "../../rules/Entity/Entity";

@registerET()
export class TServerZoneSeason extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public ConfigId: number;
    public StartTime: string;
    public EndTime: string;
}