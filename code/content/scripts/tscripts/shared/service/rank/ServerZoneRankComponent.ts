
import { ET, ETEntitySystem, serializeETProps } from "../../lib/Entity";
import { TServerZone } from "../serverzone/TServerZone";
import { TSeasonServerZoneRankData } from "./TSeasonServerZoneRankData";


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
    @serializeETProps()
    public SeasonRankType: number[] = []



    public get ServerZone(): TServerZone { return this.GetParent<TServerZone>(); }
    public get CurSeasonRank() {
        if (this.SeasonRankData.containsKey(this.SeasonConfigId)) {
            return this.GetChild<TSeasonServerZoneRankData>(this.SeasonRankData.get(this.SeasonConfigId));
        }
        return null as any;
    }

    TempRankData: { [ranktype: string]: { [page: string]: { str: string, time: number } } } = {}
    GetTempRankData(rankType: number, page: number) {
        const d = this.TempRankData[rankType + ""];
        if (d) {
            const dd = d[page + ""];
            if (dd && GameRules.GetGameTime() - dd.time <= 0) {
                return dd;
            }
        }
    }

    SetTempRankData(rankType: number, page: number, str: string, validtime = 600) {
        this.TempRankData[rankType + ""] = this.TempRankData[rankType + ""] || {};
        this.TempRankData[rankType + ""][page + ""] = {
            str: str,
            time: GameRules.GetGameTime() + validtime
        };
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
