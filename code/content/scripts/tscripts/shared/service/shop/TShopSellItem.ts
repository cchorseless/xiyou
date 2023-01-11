import { Shop } from "../../Gen/Types";
import { ET } from "../../lib/Entity";


@GReloadable
export class TShopSellItem extends ET.Entity {
    public ConfigId: number;
    public ShopId: number;
    public BuyCount: number;
    public SellConfig: Shop.ShopSellItemBean;
    public _ConfigJson: string;
    public get ConfigJson() {
        return this._ConfigJson;
    }
    public set ConfigJson(s: string) {
        this.SellConfig = GFromJson(s);
        this._ConfigJson = s;
    }
}