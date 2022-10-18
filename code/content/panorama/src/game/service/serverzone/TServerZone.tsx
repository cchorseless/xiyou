import { ET, registerET } from "../../../libs/Entity";
import { PlayerScene } from "../../components/Player/PlayerScene";
import { ServerZoneActivityComponent } from "../activity/ServerZoneActivityComponent";
import { ServerZoneBuffComponent } from "../buff/ServerZoneBuffComponent";
import { ServerZoneGameRecordComponent } from "../gamerecord/ServerZoneGameRecordComponent";
import { ServerZoneRankComponent } from "../rank/ServerZoneRankComponent";
import { ServerZoneSeasonComponent } from "../season/ServerZoneSeasonComponent";
import { ServerZoneShopComponent } from "../shop/ServerZoneShopComponent";


@registerET()
export class TServerZone extends ET.Component {
    public ServerName: string;
    public ZoneID: number;
    public ServerID: number;
    public CreateTime: string;
    onSerializeToEntity() {
        PlayerScene.Scene.AddOneComponent(this);
    }
    public get SeasonComp() { return this.GetComponentByName<ServerZoneSeasonComponent>("ServerZoneSeasonComponent"); }
    public get ShopComp() { return this.GetComponentByName<ServerZoneShopComponent>("ServerZoneShopComponent"); }
    public get ActivityComp() { return this.GetComponentByName<ServerZoneActivityComponent>("ServerZoneActivityComponent"); }
    public get RankComp() { return this.GetComponentByName<ServerZoneRankComponent>("ServerZoneRankComponent"); }
    public get BuffComp() { return this.GetComponentByName<ServerZoneBuffComponent>("ServerZoneBuffComponent"); }
    public get GameRecordComp() { return this.GetComponentByName<ServerZoneGameRecordComponent>("ServerZoneGameRecordComponent"); }
}