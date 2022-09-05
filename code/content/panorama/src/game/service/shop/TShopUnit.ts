import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";

@registerET()
export class TShopUnit extends ET.Entity {
    public ConfigId: number;
    public IsValid: boolean;
    private _ShopSellItem: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get ShopSellItem() {
        return this._ShopSellItem;
    }
    public set ShopSellItem(data: Dictionary<number, string>) {
        this._ShopSellItem.clear();
        for (let _d of data as any) {
            this._ShopSellItem.add(_d[0], _d[1]);
        }
    }
}