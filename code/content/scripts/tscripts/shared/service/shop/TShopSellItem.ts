import { JSONConfig } from "../../Gen/JsonConfig";
import { Shop } from "../../Gen/Types";
import { ET, serializeETProps } from "../../lib/Entity";


@GReloadable
export class TShopSellItem extends ET.Entity {
    @serializeETProps()
    public ConfigId: number;
    @serializeETProps()
    public ShopId: number;
    @serializeETProps()
    public BuyCount: number;
    public get SellConfig(): Shop.ShopSellItemBean {
        const json = JSONConfig.ShopConfig.get(this.ShopId);
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
}