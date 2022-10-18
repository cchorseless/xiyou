import { ET } from "../../rules/Entity/Entity";
import { reloadable } from "../../GameCache";

@reloadable
export class TShopSellItem extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;
    public ConfigId: number;
    public ShopId: number;
    public LeftCount: number;

}