import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";
import { TServerZone } from "../serverzone/TServerZone";
import { TSeasonRankData } from "./TSeasonRankData";

@registerET()
export class ServerZoneRankComponent extends ET.Component {
    public SeasonConfigId: number;
    private _SeasonRankData: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get SeasonRankData() {
        return this._SeasonRankData;
    }
    public set SeasonRankData(data: Dictionary<number, string>) {
        this._SeasonRankData.clear();
        for (let _d of data as any) {
            this._SeasonRankData.add(_d[0], _d[1]);
        }
    }
    public get ServerZone(): TServerZone { return this.GetParent<TServerZone>(); }
    public get CurSeasonRank() {
        if (this.SeasonRankData.containsKey(this.SeasonConfigId)) {
            return this.GetChild<TSeasonRankData>(this.SeasonRankData.get(this.SeasonConfigId));
        }
        return null as any;
    }


    onSerializeToEntity() {
        let serverzone = ET.EntityEventSystem.GetEntity(this.Id + "TServerZone");
        if (serverzone) {
            serverzone.AddOneComponent(this);
            this.onReload()
        }
    }
    onReload() {
        GameRules.Addon.ETRoot.PlayerSystem().SyncClientEntity(this, true);
    }
}
