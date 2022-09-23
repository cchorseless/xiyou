import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";

@registerET()
export class TSeasonRankData extends ET.Entity {
    public SeasonConfigId: number;
    public Ranks: Dictionary<string, string> = new Dictionary<
        string,
        string
    >();

    public set _Ranks(data: Dictionary<string, string>) {
        this.Ranks.copy(data);
    }
}