import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";

@registerET()
export class TRankHeroBattleScoreGroup extends ET.Entity {
    public ConfigId: number;
    public SeasonConfigId: number;
    public Name: string;
    private _HeroBattllelScoreRank: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get HeroBattllelScoreRank() {
        return this._HeroBattllelScoreRank;
    }
    public set HeroBattllelScoreRank(data: Dictionary<number, string>) {
        this._HeroBattllelScoreRank.clear();
        for (let _d of data as any) {
            this._HeroBattllelScoreRank.add(_d[0], _d[1]);
        }
    }
}