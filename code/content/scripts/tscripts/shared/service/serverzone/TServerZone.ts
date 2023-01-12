import { ET, serializeETProps } from "../../lib/Entity";
import { ServerZoneActivityComponent } from "../activity/ServerZoneActivityComponent";
import { ServerZoneBuffComponent } from "../buff/ServerZoneBuffComponent";
import { ServerZoneGameRecordComponent } from "../gamerecord/ServerZoneGameRecordComponent";
import { ServerZoneRankComponent } from "../rank/ServerZoneRankComponent";
import { ServerZoneSeasonComponent } from "../season/ServerZoneSeasonComponent";
import { ServerZoneShopComponent } from "../shop/ServerZoneShopComponent";



@GReloadable
export class TServerZone extends ET.SingletonComponent {
    @serializeETProps()
    public ServerName: string;
    @serializeETProps()
    public ZoneID: number;
    @serializeETProps()
    public ServerID: number;
    public CreateTime: string;
    onSerializeToEntity() {
        ET.GameSceneRoot.GetInstance().AddOneComponent(this)
        this.onReload();
    }

    onReload() {
        this.SyncClient(true);
    }


    get SeasonComp() { return this.GetComponentByName<ServerZoneSeasonComponent>("ServerZoneSeasonComponent")!; }
    get ShopComp() { return this.GetComponentByName<ServerZoneShopComponent>("ServerZoneShopComponent")!; }
    get ActivityComp() { return this.GetComponentByName<ServerZoneActivityComponent>("ServerZoneActivityComponent")!; }
    get RankComp() { return this.GetComponentByName<ServerZoneRankComponent>("ServerZoneRankComponent")!; }
    get BuffComp() { return this.GetComponentByName<ServerZoneBuffComponent>("ServerZoneBuffComponent")!; }
    get GameRecordComp() { return this.GetComponentByName<ServerZoneGameRecordComponent>("ServerZoneGameRecordComponent")!; }
}

declare global {
    /**
     * @ServerOnly
     */
    var GTServerZone: typeof TServerZone;
    type ITServerZone = TServerZone;
}
if (_G.GTServerZone == undefined) {
    _G.GTServerZone = TServerZone;
}