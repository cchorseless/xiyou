import { reloadable } from "../../../GameCache";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { PublicBagConfig } from "../../../shared/PublicBagConfig";
import { ET, serializeETProps } from "../../Entity/Entity";
import { ItemEntityRoot } from "../Item/ItemEntityRoot";
import { CourierEntityRoot } from "./CourierEntityRoot";

@reloadable
export class CourierBagComponent extends ET.Component {

    public onAwake() {
        this.addEvent();
        CourierEntityRoot.SyncClientEntity(this)
    }
    public addEvent() {
    }
    @serializeETProps()
    AllItem: { [itemtype: string]: { [slot: string]: string } } = {};
    @serializeETProps()
    iMaxArtifact: number = 6;
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
        const itemtype = item.ItemType;
        if (!this.IsItemEmpty(itemtype)) { return; }
        this.AllItem[itemtype] = this.AllItem[itemtype] || {};
        const items = this.AllItem[itemtype];
        if (Object.values(items).includes(item.Id)) { return; }
        let beginindex = 0;
        let endindex = 0;
        if (itemtype == PublicBagConfig.EBagItemType.COMMON) {
            endindex = PublicBagConfig.DOTA_ITEM_BAG_MAX;
            beginindex = PublicBagConfig.DOTA_ITEM_BAG_MIN;
        }
        else if (itemtype == PublicBagConfig.EBagItemType.ARTIFACT) {
            endindex = PublicBagConfig.DOTA_ITEM_ARTIFACT_MAX;
            beginindex = PublicBagConfig.DOTA_ITEM_ARTIFACT_MIN;
        }
        for (let i = beginindex; i < endindex + 1; i++) {
            if (items[i + ""] == null) {
                items[i + ""] = item.Id;
                let root = this.GetDomain<BaseNpc_Hero_Plus>().ETRoot.As<CourierEntityRoot>();
                root.AddDomainChild(item);
                root.SyncClientEntity(item);
                root.SyncClientEntity(this);
                break;
            }
        }
    }

    getOutItem(item: ItemEntityRoot) {

    }





}