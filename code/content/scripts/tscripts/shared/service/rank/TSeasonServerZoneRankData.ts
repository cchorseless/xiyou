
import { ET, serializeETProps } from "../../lib/Entity";


@GReloadable
export class TSeasonServerZoneRankData extends ET.Entity {


    @serializeETProps()
    public SeasonConfigId: number;
    private _Ranks: IGDictionary<string, string> = new GDictionary<
        string,
        string
    >();
    @serializeETProps()
    public get Ranks() {
        return this._Ranks;
    }
    public set Ranks(data: IGDictionary<string, string>) {
        this._Ranks.copy(data);

    }
}