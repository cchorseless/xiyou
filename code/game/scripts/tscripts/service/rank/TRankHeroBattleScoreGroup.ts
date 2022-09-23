import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET } from "../../rules/Entity/Entity";

@registerET()
export class TRankHeroBattleScoreGroup extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

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
        this._HeroBattllelScoreRank.copyData((data as any)[0], (data as any)[1]);

    }
}