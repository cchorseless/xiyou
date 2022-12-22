import { reloadable } from "../../../GameCache";
import { KVHelper } from "../../../helper/KVHelper";
import { BaseItem_Plus } from "../../../npc/entityPlus/BaseItem_Plus";
import { ActiveRootItem } from "../../../npc/items/ActiveRootItem";
import { PublicBagConfig } from "../../../shared/PublicBagConfig";
import { ItemEntityRoot } from "../../Components/Item/ItemEntityRoot";
import { ET, serializeETProps } from "../../Entity/Entity";



@reloadable
export class PublicBagSystemComponent extends ET.SingletonComponent {
    public onAwake() {
        this.addEvent();
    }
    public addEvent() {
    }
    @serializeETProps()
    AllItem: { [key: string]: string } = {};
    getItemByIndex(key: string) {
        let entityid = this.AllItem[key];
        if (entityid == null) return;
        return GGameEntityRoot.GetInstance().GetDomainChild<ItemEntityRoot>(entityid);
    }
    IsEmpty() {
        const count = PublicBagConfig.PUBLIC_ITEM_SLOT_MAX - PublicBagConfig.PUBLIC_ITEM_SLOT_MIN + 1
        return Object.values(this.AllItem).length < count;
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
        for (let i = PublicBagConfig.PUBLIC_ITEM_SLOT_MIN; i < PublicBagConfig.PUBLIC_ITEM_SLOT_MAX + 1; i++) {
            if (this.AllItem[i + ""] == null) {
                this.AllItem[i + ""] = item.Id;
                GGameEntityRoot.GetInstance().AddDomainChild(item);
                GGameEntityRoot.GetInstance().SyncClientEntity(item);
                GGameEntityRoot.GetInstance().SyncClientEntity(this);
                break;
            }
        }
    }

    getOutItem(item: ItemEntityRoot) {

    }
}

declare global {
    /**
     * @ServerOnly
     */
    var GPublicBagSystem: typeof PublicBagSystemComponent;
}
if (_G.GPublicBagSystem == undefined) {
    _G.GPublicBagSystem = PublicBagSystemComponent;
}