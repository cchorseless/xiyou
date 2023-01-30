
import { ET, ETEntitySystem, serializeETProps } from "../../lib/Entity";
import { TServerZone } from "../serverzone/TServerZone";
import { TSeasonRankData } from "./TSeasonRankData";


@GReloadable
export class ServerZoneRankComponent extends ET.Component {
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
    public get ServerZone(): TServerZone { return this.GetParent<TServerZone>(); }
    public get CurSeasonRank() {
        if (this.SeasonRankData.containsKey(this.SeasonConfigId)) {
            return this.GetChild<TSeasonRankData>(this.SeasonRankData.get(this.SeasonConfigId));
        }
        return null as any;
    }


    onSerializeToEntity() {
        let serverzone = ETEntitySystem.GetEntity(this.Id + "TServerZone");
        if (serverzone) {
            serverzone.AddOneComponent(this);
            this.onReload()
        }
    }
    onReload() {
        this.SyncClient(true);
    }
}
