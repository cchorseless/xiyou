import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET } from "../../rules/Entity/Entity";

@registerET()
export class TRankCommon extends ET.Entity {
    public ConfigId: number;
    public SeasonConfigId: number;
    public Name: string;
    public RankData: string[];
    private _CharacterRankData: Dictionary<string, string> = new Dictionary<
        string,
        string
    >();
    public get CharacterRankData() {
        return this._CharacterRankData;
    }
    public set CharacterRankData(data: Dictionary<string, string>) {
        this._CharacterRankData.clear();
        for (let _d of data as any) {
            this._CharacterRankData.add(_d[0], _d[1]);
        }
    }
}