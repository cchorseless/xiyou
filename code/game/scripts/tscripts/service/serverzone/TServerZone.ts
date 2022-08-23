import { ET, registerET } from "../../rules/Entity/Entity";
import { ServerZoneSeasonComponent } from "../season/ServerZoneSeasonComponent";
import { ServerZoneShopComponent } from "../shop/ServerZoneShopComponent";


@registerET()
export class TServerZone extends ET.Entity {
    public ServerName: string;
    public ZoneID: number;
    public ServerID: number;
    public CreateTime: string;

    public get SeasonComp() { return this.GetComponentByName<ServerZoneSeasonComponent>("ServerZoneSeasonComponent"); }
    public get ShopComp() { return this.GetComponentByName<ServerZoneShopComponent>("ServerZoneShopComponent"); }
}