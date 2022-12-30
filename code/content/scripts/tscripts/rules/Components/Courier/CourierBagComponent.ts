
import { PublicBagConfig } from "../../../shared/PublicBagConfig";
import { CourierBag } from "../../../shared/rules/Courier/CourierBag";

@GReloadable
export class CourierBagComponent extends CourierBag {

    public onAwake() {
        this.addEvent();
        this.SyncClient()
    }
    public addEvent() {
    }

    getItemByIndex(slot: string, itemtype: number = PublicBagConfig.EBagItemType.COMMON) {
        const iteminfo = this.AllItem[itemtype + ""];
        if (iteminfo == null) return;
        let entityid = iteminfo[slot + ""];
        if (entityid == null) return;
        let hero = this.GetDomain<IBaseNpc_Hero_Plus>();
        return hero.ETRoot.GetDomainChild<IItemEntityRoot>(entityid);
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

    putInItem(item: IItemEntityRoot) {
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
                let root = this.Domain.ETRoot.As<ICourierEntityRoot>();
                root.AddDomainChild(item);
                item.SyncClient();
                this.SyncClient();
                break;
            }
        }
    }

    getOutItem(item: IItemEntityRoot) {

    }





}