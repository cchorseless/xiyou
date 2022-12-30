
import { KVHelper } from "../../helper/KVHelper";
import { ActiveRootItem } from "../../npc/items/ActiveRootItem";
import { PublicBagConfig } from "../../shared/PublicBagConfig";
import { PublicBagSystem } from "../../shared/rules/System/PublicBagSystem";



@GReloadable
export class PublicBagSystemComponent extends PublicBagSystem {
    public onAwake() {
        this.addEvent();
    }
    public addEvent() {
    }


    addBuildingItem(towername: string) {
        if (!this.IsEmpty()) { return; }
        let cardItemName = KVHelper.KvServerConfig.building_unit_tower[towername].CardName;
        let item = ActiveRootItem.CreateItem(cardItemName);
        if (item) {
            return item.ETRoot;
        }
    }

    putInItem(item: IItemEntityRoot) {
        if (!this.IsEmpty()) { return; }
        if (Object.values(this.AllItem).includes(item.Id)) { return; }
        for (let i = PublicBagConfig.PUBLIC_ITEM_SLOT_MIN; i < PublicBagConfig.PUBLIC_ITEM_SLOT_MAX + 1; i++) {
            if (this.AllItem[i + ""] == null) {
                this.AllItem[i + ""] = item.Id;
                GGameScene.Scene.AddDomainChild(item);
                item.SyncClient();
                this.SyncClient();
                break;
            }
        }
    }

    getOutItem(item: IItemEntityRoot) {

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