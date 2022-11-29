import { Shop } from "../../../../../../game/scripts/tscripts/shared/Gen/Types";
import { ET, registerET } from "../../../libs/Entity";

@registerET()
export class TShopSellItem extends ET.Entity {
    public ConfigId: number;
    public ShopId: number;
    public LeftCount: number;
    public SellConfig: Shop.ShopSellItemBean;

}