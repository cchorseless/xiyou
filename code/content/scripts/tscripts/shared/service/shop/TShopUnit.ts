
import { ET, serializeETProps } from "../../lib/Entity";


@GReloadable
export class TShopUnit extends ET.Entity {

    @serializeETProps()
    public ConfigId: number;
    @serializeETProps()
    public IsValid: boolean;
    private _ShopSellItem = new GDictionary<
        number,
        string
    >();
    @serializeETProps()
    public get ShopSellItem() {
        return this._ShopSellItem;
    }
    public set ShopSellItem(data) {
        this._ShopSellItem.copy(data);

    }
}