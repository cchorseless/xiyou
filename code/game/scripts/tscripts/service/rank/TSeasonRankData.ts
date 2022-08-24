import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET } from "../../rules/Entity/Entity";

@registerET()
export class TSeasonRankData extends ET.Entity {
    public SeasonConfigId: number;
    private _Ranks: Dictionary<string, string> = new Dictionary<
        string,
        string
    >();
    public get Ranks() {
        return this._Ranks;
    }
    public set Ranks(data: Dictionary<string, string>) {
        this._Ranks.clear();
        for (let _d of data as any) {
            this._Ranks.add(_d[0], _d[1]);
        }
    }
}