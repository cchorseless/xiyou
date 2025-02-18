import { ET, serializeETProps } from "../../lib/Entity";


@GReloadable
export class TShopSellItem extends ET.Entity {
    @serializeETProps()
    public ConfigId: number;
    @serializeETProps()
    public ShopId: number;
    @serializeETProps()
    public BuyCount: number;
    @serializeETProps()
    public CharacterId: number;
    public get SellConfig() {
        const json = GJSONConfig.ShopConfig.get(this.ShopId);
        if (json) {
            return json.sellinfo.find(info => info.SellConfigid == this.ConfigId)
        }
    }
    // public _ConfigJson: string;
    // @serializeETProps()
    // public get ConfigJson() {
    //     return this._ConfigJson;
    // }
    // public set ConfigJson(s: string) {
    //     this.SellConfig = GFromJson(s);
    //     this._ConfigJson = s;
    // }


    static GetOneByItemConfigId(playerid: PlayerID, ItemConfigId: number | string) {
        let all = TShopSellItem.GetGroupInstance(playerid);
        for (let e of all) {
            const SellConfig = e.SellConfig;
            if (SellConfig && SellConfig.ItemConfigId + "" == ItemConfigId) {
                return e
            }
        }
    }
    onSerializeToEntity() {
        this.onReload();
    }
    onReload(): void {
        this.SyncClient()
    }

}