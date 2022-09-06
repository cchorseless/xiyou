import { ET, registerET } from "../../rules/Entity/Entity";

@registerET()
export class TShopSellItem extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;
    public ConfigId: number;
    public ShopId: number;
    public LeftCount: number;

}