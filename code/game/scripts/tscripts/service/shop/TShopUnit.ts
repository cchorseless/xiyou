import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET } from "../../rules/Entity/Entity";

@registerET()
export class TShopUnit extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;
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
        this._ShopSellItem.copyData((data as any)[0], (data as any)[1]);

    }
}