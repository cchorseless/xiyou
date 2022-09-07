import { ET, registerET } from "../../rules/Entity/Entity";
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
        GameRules.Addon.ETRoot.AddOneComponent(this);
        this.onReload();
    }

    onReload() {
        GameRules.Addon.ETRoot.PlayerSystem().SyncClientEntity(this, true);
    }


    public SeasonComp() { return this.GetComponentByName<ServerZoneSeasonComponent>("ServerZoneSeasonComponent"); }
    public ShopComp() { return this.GetComponentByName<ServerZoneShopComponent>("ServerZoneShopComponent"); }
    public ActivityComp() { return this.GetComponentByName<ServerZoneActivityComponent>("ServerZoneActivityComponent"); }
    public RankComp() { return this.GetComponentByName<ServerZoneRankComponent>("ServerZoneRankComponent"); }
    public BuffComp() { return this.GetComponentByName<ServerZoneBuffComponent>("ServerZoneBuffComponent"); }
    public GameRecordComp() { return this.GetComponentByName<ServerZoneGameRecordComponent>("ServerZoneGameRecordComponent"); }
}