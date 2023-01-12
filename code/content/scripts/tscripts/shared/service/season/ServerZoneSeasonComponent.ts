
import { ET, serializeETProps } from "../../lib/Entity";
import { TServerZone } from "../serverzone/TServerZone";
import { TServerZoneSeason } from "./TServerZoneSeason";


@GReloadable
export class ServerZoneSeasonComponent extends ET.Component {
    @serializeETProps()
    public CurSeasonConfigId: number;
    private _Seasons = new GDictionary<
        number,
        string
    >();
    @serializeETProps()
    public get Seasons() {
        return this._Seasons;
    }
    public set Seasons(data) {
        this._Seasons.copy(data);
    }
    public ServerZone(): TServerZone { return this.GetParent<TServerZone>(); }
    public CurSeason() {
        if (this.Seasons.containsKey(this.CurSeasonConfigId)) {
            return this.GetChild<TServerZoneSeason>(this.Seasons.get(this.CurSeasonConfigId));
        }
        return null;
    }


    onSerializeToEntity() {
        let serverzone = ET.EntitySystem.GetEntity(this.Id + "TServerZone");
        if (serverzone != null) {
            serverzone.AddOneComponent(this);
            this.onReload();
        }
    }
    onReload() {
        this.SyncClient(true);
    }
}
