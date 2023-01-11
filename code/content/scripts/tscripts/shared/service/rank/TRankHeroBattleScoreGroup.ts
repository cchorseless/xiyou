
import { ET } from "../../lib/Entity";


@GReloadable
export class TRankHeroBattleScoreGroup extends ET.Entity {


    public ConfigId: number;
    public SeasonConfigId: number;
    public Name: string;
    private _HeroBattllelScoreRank = new GDictionary<
        number,
        string
    >();
    public get HeroBattllelScoreRank() {
        return this._HeroBattllelScoreRank;
    }
    public set HeroBattllelScoreRank(data) {
        this._HeroBattllelScoreRank.copy(data);

    }
}