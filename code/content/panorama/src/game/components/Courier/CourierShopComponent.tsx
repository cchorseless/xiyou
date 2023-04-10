import { GameProtocol } from "../../../../../scripts/tscripts/shared/GameProtocol";
import { ET } from "../../../../../scripts/tscripts/shared/lib/Entity";
import { PublicBagConfig } from "../../../../../scripts/tscripts/shared/PublicBagConfig";
import { NetHelper } from "../../../helper/NetHelper";

@GReloadable
export class CourierShopComponent extends ET.Component {

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
    iDiscount = 0;

    refreshRandomShop() {

    }


    BuyItem(toNpc: EntityIndex, shoptype: PublicBagConfig.EPublicShopType, slot: number) {
        Game.EmitSound("General.Buy");
        NetHelper.SendToLua(GameProtocol.Protocol.req_BuyPublicBagItem, {
            shoptype: shoptype,
            slot: slot,
            entityIndex: toNpc,
        })

    }
}