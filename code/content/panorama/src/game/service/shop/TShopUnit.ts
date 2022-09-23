import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";

@registerET()
export class TShopUnit extends ET.Entity {
    public ConfigId: number;
    public IsValid: boolean;
    public ShopSellItem: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();

    public set _ShopSellItem(data: Dictionary<number, string>) {
        this.ShopSellItem.copy(data);
    }
}