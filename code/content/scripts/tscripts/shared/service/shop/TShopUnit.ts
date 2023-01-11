
import { ET } from "../../lib/Entity";


@GReloadable
export class TShopUnit extends ET.Entity {

    public ConfigId: number;
    public IsValid: boolean;
    private _ShopSellItem = new GDictionary<
        number,
        string
    >();
    public get ShopSellItem() {
        return this._ShopSellItem;
    }
    public set ShopSellItem(data) {
        this._ShopSellItem.copy(data);

    }
}