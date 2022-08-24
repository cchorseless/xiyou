import { ET, registerET } from "../../rules/Entity/Entity";
import { ServerZoneActivityComponent } from "../activity/ServerZoneActivityComponent";
import { ServerZoneBuffComponent } from "../buff/ServerZoneBuffComponent";
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
        GameRules.Addon.ETRoot.AddOneComponent(this);
    }
    public get SeasonComp() { return this.GetComponentByName<ServerZoneSeasonComponent>("ServerZoneSeasonComponent"); }
    public get ShopComp() { return this.GetComponentByName<ServerZoneShopComponent>("ServerZoneShopComponent"); }
    public get ActivityComp() { return this.GetComponentByName<ServerZoneActivityComponent>("ServerZoneActivityComponent"); }
    public get RankComp() { return this.GetComponentByName<ServerZoneRankComponent>("ServerZoneRankComponent"); }
    public get BuffComp() { return this.GetComponentByName<ServerZoneBuffComponent>("ServerZoneBuffComponent"); }
}