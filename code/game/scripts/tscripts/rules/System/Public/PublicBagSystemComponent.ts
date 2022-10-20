import { reloadable } from "../../../GameCache";
import { KVHelper } from "../../../helper/KVHelper";
import { BaseItem_Plus } from "../../../npc/entityPlus/BaseItem_Plus";
import { ActiveRootItem } from "../../../npc/items/ActiveRootItem";
import { ItemEntityRoot } from "../../Components/Item/ItemEntityRoot";
import { ET } from "../../Entity/Entity";
import { PublicBagConfig } from "./PublicBagConfig";



@reloadable
export class PublicBagSystemComponent extends ET.Component {
    public onAwake() {
        this.addEvent();
    }
    public addEvent() {
    }
    AllItem: { [key: string]: string } = {};
    getItemByIndex(key: string) {
        let entityid = this.AllItem[key];
        if (entityid == null) return;
        return GameRules.Addon.ETRoot.GetDomainChild<ItemEntityRoot>(entityid);
    }
    IsEmpty() {
        return Object.values(this.AllItem).length < PublicBagConfig.MAX_ITEM_COUNT;
    }

    addBuildingItem(towername: string) {
        if (!this.IsEmpty()) { return; }
        let cardItemName = KVHelper.KvServerConfig.building_unit_tower[towername].CardName;
        let item = ActiveRootItem.CreateItem(cardItemName);
        if (item) {
            return item.ETRoot;
        }
    }

    putInItem(item: ItemEntityRoot) {
        if (!this.IsEmpty()) { return; }
        if (Object.values(this.AllItem).includes(item.Id)) { return; }
        for (let i = 0; i < PublicBagConfig.MAX_ITEM_COUNT; i++) {
            if (this.AllItem[i] == null) {
                this.AllItem[i] = item.Id;
                GameRules.Addon.ETRoot.AddDomainChild(item);
            }
        }
    }

    getOutItem(item: ItemEntityRoot) {

    }
}