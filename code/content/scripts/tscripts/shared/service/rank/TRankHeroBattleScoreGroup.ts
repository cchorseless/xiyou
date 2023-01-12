
import { ET, serializeETProps } from "../../lib/Entity";


@GReloadable
export class TRankHeroBattleScoreGroup extends ET.Entity {


    @serializeETProps()
    public ConfigId: number;
    @serializeETProps()
    public SeasonConfigId: number;
    @serializeETProps()
    public Name: string;
    private _HeroBattllelScoreRank = new GDictionary<
        number,
        string
    >();
    @serializeETProps()
    public get HeroBattllelScoreRank() {
        return this._HeroBattllelScoreRank;
    }
    public set HeroBattllelScoreRank(data) {
        this._HeroBattllelScoreRank.copy(data);

    }
}