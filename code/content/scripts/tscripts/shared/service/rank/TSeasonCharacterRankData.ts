
import { GameProtocol } from "../../GameProtocol";
import { ET, serializeETProps } from "../../lib/Entity";
import { TRankSingleData } from "./TRankSingleData";


@GReloadable
export class TSeasonCharacterRankData extends ET.Entity {


    @serializeETProps()
    public SeasonConfigId: number;

    private _RankDatas: IGDictionary<number, string> = new GDictionary<
        number,
        string
    >();
    @serializeETProps()
    public get RankDatas() {
        return this._RankDatas;
    }
    public set RankDatas(data: IGDictionary<number, string>) {
        this._RankDatas.copy(data);

    }


    public GetRankData(ranktype: GameProtocol.ERankType): TRankSingleData {
        if (this.RankDatas.containsKey(ranktype)) {
            return TRankSingleData.GetOneInstanceById(this.RankDatas.get(ranktype));
        }
        return null as any;
    }

    onSerializeToEntity() {
        this.onReload();
    }

    onReload() {
        this.SyncClient();
    }
}