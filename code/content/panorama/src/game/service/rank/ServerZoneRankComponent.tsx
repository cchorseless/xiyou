import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { TCharacter } from "../account/TCharacter";
import { TServerZone } from "../serverzone/TServerZone";
import { TSeasonRankData } from "./TSeasonRankData";

@registerET()
export class ServerZoneRankComponent extends ET.Component {
    public SeasonConfigId: number;
    public SeasonRankData: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();

    public set _SeasonRankData(data: Dictionary<number, string>) {
        this.SeasonRankData.copy(data);
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
        }
    }
}
