import Dictionary from "../../helper/DataContainerHelper";
import { ET } from "../../rules/Entity/Entity";
import { reloadable } from "../../GameCache";

@reloadable
export class TRankCommon extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

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
        this._CharacterRankData.copyData((data as any)[0], (data as any)[1]);

    }
}