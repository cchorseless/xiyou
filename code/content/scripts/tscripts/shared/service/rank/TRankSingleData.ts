
import { ET, serializeETProps } from "../../lib/Entity";


@GReloadable
export class TRankSingleData extends ET.Entity {


    @serializeETProps()
    public Score: number;
    @serializeETProps()
    public RankIndex: number;
    @serializeETProps()
    public CharacterId: string;

    @serializeETProps()
    public RankType: number;

    @serializeETProps()
    public SteamAccountId: string;


    GetLevel() {
        const t = GJSONConfig.RankBattleScoreExpConfig.getDataList();
        for (const _t of t) {
            if (_t.ScoreMin <= this.Score && (_t.ScoreMax > this.Score || _t.ScoreMax == 0)) {
                return _t.id;
            }
        }
        return 1;
    }

    onSerializeToEntity() {
        this.onReload();
    }

    onReload() {
        this.SyncClient();
    }
}