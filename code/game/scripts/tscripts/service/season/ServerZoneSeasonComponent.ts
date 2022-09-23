import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";
import { TServerZone } from "../serverzone/TServerZone";
import { TServerZoneSeason } from "./TServerZoneSeason";

@registerET()
export class ServerZoneSeasonComponent extends ET.Component {
    public CurSeasonConfigId: number;
    private _Seasons: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get Seasons() {
        return this._Seasons;
    }
    public set Seasons(data: Dictionary<number, string>) {
        this._Seasons.copyData((data as any)[0], (data as any)[1]);
    }
    public ServerZone(): TServerZone { return this.GetParent<TServerZone>(); }
    public CurSeason(): TServerZoneSeason {
        if (this.Seasons.containsKey(this.CurSeasonConfigId)) {
            return this.GetChild<TServerZoneSeason>(this.Seasons.get(this.CurSeasonConfigId));
        }
        return null as any;
    }


    onSerializeToEntity() {
        let serverzone = ET.EntityEventSystem.GetEntity(this.Id + "TServerZone");
        if (serverzone != null) {
            serverzone.AddOneComponent(this);
            this.onReload();
        }
    }
    onReload() {
        GameRules.Addon.ETRoot.PlayerSystem().SyncClientEntity(this, true);
    }
}
