
import { ET, serializeETProps } from "../../lib/Entity";


@GReloadable
export class TRankCommon extends ET.Entity {


    @serializeETProps()
    public ConfigId: number;
    @serializeETProps()
    public SeasonConfigId: number;
    @serializeETProps()
    public Name: string;
    @serializeETProps()
    public RankData: string[];
    private _CharacterRankData: IGDictionary<string, string> = new GDictionary<
        string,
        string
    >();
    @serializeETProps()
    public get CharacterRankData() {
        return this._CharacterRankData;
    }
    public set CharacterRankData(data: IGDictionary<string, string>) {
        this._CharacterRankData.copy(data);

    }
}