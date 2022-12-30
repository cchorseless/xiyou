
import { ET } from "../../lib/Entity";


@GReloadable
export class TRankCommon extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public ConfigId: number;
    public SeasonConfigId: number;
    public Name: string;
    public RankData: string[];
    private _CharacterRankData: IGDictionary<string, string> = new GDictionary<
        string,
        string
    >();
    public get CharacterRankData() {
        return this._CharacterRankData;
    }
    public set CharacterRankData(data: IGDictionary<string, string>) {
        this._CharacterRankData.copy(data);

    }
}