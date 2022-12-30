
import { ET } from "../../lib/Entity";


@GReloadable
export class TSeasonRankData extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public SeasonConfigId: number;
    private _Ranks: IGDictionary<string, string> = new GDictionary<
        string,
        string
    >();
    public get Ranks() {
        return this._Ranks;
    }
    public set Ranks(data: IGDictionary<string, string>) {
        this._Ranks.copy(data);

    }
}