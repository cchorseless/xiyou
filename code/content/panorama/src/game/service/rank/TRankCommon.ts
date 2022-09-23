import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";

@registerET()
export class TRankCommon extends ET.Entity {
    public ConfigId: number;
    public SeasonConfigId: number;
    public Name: string;
    public RankData: string[];
    public CharacterRankData: Dictionary<string, string> = new Dictionary<
        string,
        string
    >();

    public set _CharacterRankData(data: Dictionary<string, string>) {
        this.CharacterRankData.copy(data);
    }
}