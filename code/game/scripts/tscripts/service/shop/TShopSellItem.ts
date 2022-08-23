import { ET, registerET } from "../../rules/Entity/Entity";

@registerET()
export class TShopSellItem extends ET.Entity {
    public ConfigId: number;
    public ShopId: number;
    public LeftCount: number;

}