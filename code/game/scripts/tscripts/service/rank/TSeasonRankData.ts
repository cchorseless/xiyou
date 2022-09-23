import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET } from "../../rules/Entity/Entity";

@registerET()
export class TSeasonRankData extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public SeasonConfigId: number;
    private _Ranks: Dictionary<string, string> = new Dictionary<
        string,
        string
    >();
    public get Ranks() {
        return this._Ranks;
    }
    public set Ranks(data: Dictionary<string, string>) {
        this._Ranks.copyData((data as any)[0], (data as any)[1]);

    }
}