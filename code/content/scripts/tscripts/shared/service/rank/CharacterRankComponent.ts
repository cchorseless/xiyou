
import { GameProtocol } from "../../GameProtocol";
import { ET, serializeETProps } from "../../lib/Entity";
import { TCharacter } from "../account/TCharacter";
import { TSeasonCharacterRankData } from "./TSeasonCharacterRankData";


@GReloadable
export class CharacterRankComponent extends ET.Component {

    @serializeETProps()
    public SeasonConfigId: number;

    private _SeasonRankData = new GDictionary<
        number,
        string
    >();
    @serializeETProps()
    public get SeasonRankData() {
        return this._SeasonRankData;
    }
    public set SeasonRankData(data) {
        this._SeasonRankData.copy(data);

    }

    public GetSeasonRankData(SeasonConfigId: number | null = null): TSeasonCharacterRankData {
        SeasonConfigId = SeasonConfigId || this.SeasonConfigId;
        if (this.SeasonRankData.containsKey(SeasonConfigId)) {
            return TSeasonCharacterRankData.GetOneInstanceById(this.SeasonRankData.get(SeasonConfigId));
        }
        return null as any;
    }

    GetRankData(ranktype: GameProtocol.ERankType, SeasonConfigId: number | null = null) {
        const seasondata = this.GetSeasonRankData(SeasonConfigId as any);
        if (seasondata) {
            return seasondata.GetRankData(ranktype)
        }
    }

    onGetBelongPlayerid() {
        let character = GTCharacter.GetOneInstanceById(this.Id);
        if (character != null) {
            return character.BelongPlayerid;
        }
        return -1;
    }
    onSerializeToEntity() {
        GTCharacter.GetOneInstance(this.BelongPlayerid).AddOneComponent(this);
        this.onReload();
    }

    onReload() {
        this.SyncClient();
    }

    get Character(): TCharacter { return this.GetParent<TCharacter>(); }
}