import Dictionary from "../../helper/DataContainerHelper";
import { ET } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";
import { TServerZone } from "../serverzone/TServerZone";
import { TSeasonRankData } from "./TSeasonRankData";
import { reloadable } from "../../GameCache";

@reloadable
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
        this._SeasonRankData.copyData((data as any)[0], (data as any)[1]);

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
        GGameEntityRoot.GetInstance().SyncClientEntity(this, true);
    }
}
