import { PublicBagConfig } from "../../../../../../game/scripts/tscripts/shared/PublicBagConfig";
import { LogHelper } from "../../../helper/LogHelper";
import { registerET, ET } from "../../../libs/Entity";
import { PlayerScene } from "../Player/PlayerScene";

@registerET()
export class CourierShopComponent extends ET.Component {
    onSerializeToEntity() {
        PlayerScene.GetPlayer(this.BelongPlayerid)?.AddOneComponent(this);
    }

    AllSellItem: { [shoptype: string]: { [slot: string]: IPublicShopItem } } = {};
    getSellItem(selltype: PublicBagConfig.EPublicShopType) {
        let items = this.AllSellItem[selltype] || {};
        let sellitems: IPublicShopItem[] = [];
        let keys = Object.keys(items);
        keys.sort((a, b) => { return Number(a) - Number(b) });
        keys.forEach(slot => {
            sellitems.push(items[slot]);
        })
        return sellitems;
    }
    /**随机商店解锁回合数 */
    randomLockRound = 16;
    /**随机商店刷新价格 */
    refreshPrice = 20;
    /**折扣 */
    iDiscount = 100;
    refreshRandomShop() {

    }
}