import { ET } from "../../rules/Entity/Entity";
import { reloadable } from "../../GameCache";
import { Shop } from "../../shared/Gen/Types";

@reloadable
export class TShopSellItem extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;
    public ConfigId: number;
    public ShopId: number;
    public LeftCount: number;
    public SellConfig: Shop.ShopSellItemBean;
}