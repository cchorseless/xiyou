import { reloadable } from "../../../GameCache";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { PublicBagConfig } from "../../../shared/PublicBagConfig";
import { ET, serializeETProps } from "../../Entity/Entity";
import { ItemEntityRoot } from "../Item/ItemEntityRoot";

@reloadable
export class CourierBagComponent extends ET.Component {

    public onAwake() {
        this.addEvent();
    }
    public addEvent() {
    }
    @serializeETProps()
    AllItem: { [itemtype: string]: { [slot: string]: string } } = {};

    getItemByIndex(slot: string, itemtype: number = PublicBagConfig.EBagItemType.COMMON) {
        const iteminfo = this.AllItem[itemtype + ""];
        if (iteminfo == null) return;
        let entityid = iteminfo[slot + ""];
        if (entityid == null) return;
        let hero = this.GetDomain<BaseNpc_Hero_Plus>();
        return hero.ETRoot.GetDomainChild<ItemEntityRoot>(entityid);
    }

    IsItemEmpty(itemtype: number = PublicBagConfig.EBagItemType.COMMON) {
        const iteminfo = this.AllItem[itemtype + ""] || {};
        let maxcount = 0;
        if (itemtype == PublicBagConfig.EBagItemType.COMMON) {
            maxcount = PublicBagConfig.DOTA_ITEM_BAG_MAX - PublicBagConfig.DOTA_ITEM_BAG_MIN + 1;
        }
        else if (itemtype == PublicBagConfig.EBagItemType.ARTIFACT) {
            maxcount = PublicBagConfig.DOTA_ITEM_ARTIFACT_MAX - PublicBagConfig.DOTA_ITEM_ARTIFACT_MIN + 1;
        }
        return Object.values(iteminfo).length < maxcount;

    }

    putInItem(item: ItemEntityRoot) {
        if (!this.IsEmpty()) { return; }
        if (Object.values(this.AllItem).includes(item.Id)) { return; }
        for (let i = PublicBagConfig.PUBLIC_ITEM_SLOT_MIN; i < PublicBagConfig.PUBLIC_ITEM_SLOT_MAX + 1; i++) {
            if (this.AllItem[i + ""] == null) {
                this.AllItem[i + ""] = item.Id;
                GameRules.Addon.ETRoot.AddDomainChild(item);
                GameRules.Addon.ETRoot.SyncClientEntity(item);
                GameRules.Addon.ETRoot.SyncClientEntity(this);
                break;
            }
        }
    }

    getOutItem(item: ItemEntityRoot) {

    }



}