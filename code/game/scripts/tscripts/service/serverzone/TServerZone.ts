import { ET } from "../../rules/Entity/Entity";
import { ServerZoneActivityComponent } from "../activity/ServerZoneActivityComponent";
import { ServerZoneBuffComponent } from "../buff/ServerZoneBuffComponent";
import { ServerZoneGameRecordComponent } from "../gamerecord/ServerZoneGameRecordComponent";
import { ServerZoneRankComponent } from "../rank/ServerZoneRankComponent";
import { ServerZoneSeasonComponent } from "../season/ServerZoneSeasonComponent";
import { ServerZoneShopComponent } from "../shop/ServerZoneShopComponent";
import { reloadable } from "../../GameCache";


@reloadable
export class TServerZone extends ET.SingletonComponent {
    public ServerName: string;
    public ZoneID: number;
    public ServerID: number;
    public CreateTime: string;
    onSerializeToEntity() {
        GGameEntityRoot.GetInstance().AddOneComponent(this);
        this.onReload();
    }

    onReload() {
        GGameEntityRoot.GetInstance().SyncClientEntity(this, true);
    }


    public SeasonComp() { return this.GetComponentByName<ServerZoneSeasonComponent>("ServerZoneSeasonComponent"); }
    public ShopComp() { return this.GetComponentByName<ServerZoneShopComponent>("ServerZoneShopComponent"); }
    public ActivityComp() { return this.GetComponentByName<ServerZoneActivityComponent>("ServerZoneActivityComponent"); }
    public RankComp() { return this.GetComponentByName<ServerZoneRankComponent>("ServerZoneRankComponent"); }
    public BuffComp() { return this.GetComponentByName<ServerZoneBuffComponent>("ServerZoneBuffComponent"); }
    public GameRecordComp() { return this.GetComponentByName<ServerZoneGameRecordComponent>("ServerZoneGameRecordComponent"); }
}

declare global {
    /**
     * @ServerOnly
     */
    var GTServerZone: typeof TServerZone;
}
if (_G.GTServerZone == undefined) {
    _G.GTServerZone = TServerZone;
}