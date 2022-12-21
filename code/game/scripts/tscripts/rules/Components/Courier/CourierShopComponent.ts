import { reloadable } from "../../../GameCache";
import { ET, serializeETProps } from "../../Entity/Entity";

@reloadable
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