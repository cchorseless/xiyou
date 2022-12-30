
import { ET, serializeETProps } from "../../../shared/lib/Entity";

@GReloadable
export class CourierShopComponent extends ET.Component {

    onAwake(...args: any[]): void {

    }

    @serializeETProps()
    AllSellItem: { [shoptype: string]: { [slot: string]: IPublicShopItem } } = {};
    @serializeETProps()
    randomLockRound = 16;
    @serializeETProps()
    refreshPrice = 20;

}