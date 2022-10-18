import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { TCharacter } from "../account/TCharacter";
import { TServerZone } from "../serverzone/TServerZone";
import { TServerZoneSeason } from "./TServerZoneSeason";

@registerET()
export class ServerZoneSeasonComponent extends ET.Component {
    public CurSeasonConfigId: number;
    public Seasons: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();

    public set _Seasons(data: Dictionary<number, string>) {
        this.Seasons.copy(data);
    }
    public get ServerZone(): TServerZone { return this.GetParent<TServerZone>(); }
    public get CurSeason(): TServerZoneSeason {
        if (this.Seasons.containsKey(this.CurSeasonConfigId)) {
            return this.GetChild<TServerZoneSeason>(this.Seasons.get(this.CurSeasonConfigId))!;
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
