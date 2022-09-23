import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";

@registerET()
export class TRankHeroBattleScoreGroup extends ET.Entity {
    public ConfigId: number;
    public SeasonConfigId: number;
    public Name: string;
    public HeroBattllelScoreRank: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();

    public set _HeroBattllelScoreRank(data: Dictionary<number, string>) {
        this.HeroBattllelScoreRank.copy(data);
    }
}