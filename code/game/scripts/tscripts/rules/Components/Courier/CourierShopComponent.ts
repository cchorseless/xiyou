import { reloadable } from "../../../GameCache";
import { serializeETProps } from "../../Entity/Entity";
import { OnCourierComponent } from "../../Entity/OnCourierComponent";

@reloadable
export class CourierShopComponent extends OnCourierComponent {

    onAwake(...args: any[]): void {

    }

    @serializeETProps()
    AllSellItem: { [shoptype: string]: { [slot: string]: IPublicShopItem } } = {};
    @serializeETProps()
    randomLockRound = 16;
    @serializeETProps()
    refreshPrice = 20;

}