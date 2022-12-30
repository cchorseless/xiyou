import { Shop } from "../../Gen/Types";
import { ET } from "../../lib/Entity";


@GReloadable
export class TShopSellItem extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;
    public ConfigId: number;
    public ShopId: number;
    public BuyCount: number;
    public SellConfig: Shop.ShopSellItemBean;
}