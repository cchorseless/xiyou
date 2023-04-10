
import { EventHelper } from "../../../helper/EventHelper";
import { GameProtocol } from "../../../shared/GameProtocol";
import { PublicBagConfig } from "../../../shared/PublicBagConfig";
import { CourierBag } from "../../../shared/rules/Courier/CourierBag";

@GReloadable
export class CourierBagComponent extends CourierBag {


    public onAwake() {
        this.addEvent();
        this.SyncClient()
    }

    public addEvent() {
        EventHelper.addProtocolEvent(GameProtocol.Protocol.req_SetBuyItem2Bag,
            GHandler.create(this, (e: JS_TO_LUA_DATA) => {
                if (e.PlayerID != this.BelongPlayerid) { return }
                this.bBuyItem2Bag = GToBoolean(e.data);
                this.SyncClient();
            }));
        EventHelper.addProtocolEvent(GameProtocol.Protocol.req_sellAllItem,
            GHandler.create(this, (e: JS_TO_LUA_DATA) => {
                if (e.PlayerID != this.BelongPlayerid) { return }
                this.sellAllItem();
                this.SyncClient();
            }));

        EventHelper.addProtocolEvent(GameProtocol.Protocol.req_MoveItem,
            GHandler.create(this, (e: JS_TO_LUA_DATA) => {
                if (e.PlayerID != this.BelongPlayerid) { return }
                let from = e.data.from;
                let fromslot = e.data.fromslot;
                let to = e.data.to;
                let toslot = e.data.toslot;
                let tonpc = e.data.tonpc;
                let hnpc: IBaseNpc_Plus;
                if (tonpc) {
                    hnpc = EntIndexToHScript(tonpc) as IBaseNpc_Plus;
                }
                this.MoveItem(from, fromslot, to, toslot, hnpc);
            }));

    }

    getItemByIndex(slot: string, itemtype = PublicBagConfig.EBagSlotType.BackPackSlot) {
        const iteminfo = this.AllItem[itemtype + ""];
        if (iteminfo == null) return;
        let entityid = iteminfo[slot + ""];
        if (entityid == null) return;
        let hero = this.GetDomain<IBaseNpc_Hero_Plus>();
        return hero.ETRoot.GetDomainChild<IItemEntityRoot>(entityid);
    }

    IsItemEmpty(itemtype = PublicBagConfig.EBagSlotType.BackPackSlot) {
        const iteminfo = this.AllItem[itemtype + ""] || {};
        let maxcount = 0;
        if (itemtype == PublicBagConfig.EBagSlotType.BackPackSlot) {
            maxcount = PublicBagConfig.DOTA_ITEM_BAG_MAX - PublicBagConfig.DOTA_ITEM_BAG_MIN + 1;
        }
        else if (itemtype == PublicBagConfig.EBagSlotType.ArtifactSlot) {
            maxcount = PublicBagConfig.DOTA_ITEM_ARTIFACT_MAX - PublicBagConfig.DOTA_ITEM_ARTIFACT_MIN + 1;
        }
        else if (itemtype == PublicBagConfig.EBagSlotType.EquipCombineSlot) {
            maxcount = PublicBagConfig.CUSTOM_COMBINE_SLOT_MAX - PublicBagConfig.CUSTOM_COMBINE_SLOT_MIN + 1;
        }
        else if (itemtype == PublicBagConfig.EBagSlotType.GroundSlot) {
            maxcount = PublicBagConfig.Ground_ITEM_SLOT_MAX - PublicBagConfig.Ground_ITEM_SLOT_MIN + 1;
        }
        return Object.values(iteminfo).length < maxcount;

    }

    putInItem(item: IItemEntityRoot, _itemtype = PublicBagConfig.EBagSlotType.BackPackSlot) {
        const itemtype = _itemtype;
        if (!this.IsItemEmpty(itemtype)) { return; }
        this.AllItem[itemtype] = this.AllItem[itemtype] || {};
        const items = this.AllItem[itemtype];
        if (Object.values(items).includes(item.Id)) { return; }
        let beginindex = 0;
        let endindex = 0;
        if (itemtype == PublicBagConfig.EBagSlotType.BackPackSlot) {
            endindex = PublicBagConfig.DOTA_ITEM_BAG_MAX;
            beginindex = PublicBagConfig.DOTA_ITEM_BAG_MIN;
        }
        else if (itemtype == PublicBagConfig.EBagSlotType.ArtifactSlot) {
            endindex = PublicBagConfig.DOTA_ITEM_ARTIFACT_MAX;
            beginindex = PublicBagConfig.DOTA_ITEM_ARTIFACT_MIN;
        }
        else if (itemtype == PublicBagConfig.EBagSlotType.EquipCombineSlot) {
            endindex = PublicBagConfig.CUSTOM_COMBINE_SLOT_MAX;
            beginindex = PublicBagConfig.CUSTOM_COMBINE_SLOT_MIN;
        }
        else if (itemtype == PublicBagConfig.EBagSlotType.GroundSlot) {
            endindex = PublicBagConfig.Ground_ITEM_SLOT_MAX;
            beginindex = PublicBagConfig.Ground_ITEM_SLOT_MIN;
        }
        let root = this.Domain.ETRoot.As<ICourierEntityRoot>();
        for (let i = beginindex; i < endindex + 1; i++) {
            if (items[i + ""] == null) {
                items[i + ""] = item.Id;
                root.AddDomainChild(item);
                item.SyncClient();
                GTimerHelper.AddTimer(0.1, GHandler.create(this, () => { this.SyncClient() }));
                break;
            }
        }
    }


    sellAllItem() {
        let beginindex = PublicBagConfig.DOTA_ITEM_BAG_MIN;
        let endindex = PublicBagConfig.DOTA_ITEM_BAG_MAX;
        const items = this.AllItem[PublicBagConfig.EBagSlotType.BackPackSlot];
        let root = this.Domain.ETRoot.As<ICourierEntityRoot>();
        for (let i = beginindex; i < endindex + 1; i++) {
            if (items[i + ""] != null) {
                let item = root.GetDomainChild<IItemEntityRoot>(items[i + ""]);
                delete items[i + ""];
                if (item == null) continue;
                item.Dispose();
            }
        }
        this.AllItem[PublicBagConfig.EBagSlotType.BackPackSlot] = {};
    }


    getOutItem(item: IItemEntityRoot, _itemtype = PublicBagConfig.EBagSlotType.BackPackSlot) {
        const itemtype = _itemtype;
        this.AllItem[itemtype] = this.AllItem[itemtype] || {};
        const items = this.AllItem[itemtype];
        if (!Object.values(items).includes(item.Id)) { return; }
        let beginindex = 0;
        let endindex = 0;
        if (itemtype == PublicBagConfig.EBagSlotType.BackPackSlot) {
            endindex = PublicBagConfig.DOTA_ITEM_BAG_MAX;
            beginindex = PublicBagConfig.DOTA_ITEM_BAG_MIN;
        }
        else if (itemtype == PublicBagConfig.EBagSlotType.ArtifactSlot) {
            endindex = PublicBagConfig.DOTA_ITEM_ARTIFACT_MAX;
            beginindex = PublicBagConfig.DOTA_ITEM_ARTIFACT_MIN;
        }
        else if (itemtype == PublicBagConfig.EBagSlotType.EquipCombineSlot) {
            endindex = PublicBagConfig.CUSTOM_COMBINE_SLOT_MAX;
            beginindex = PublicBagConfig.CUSTOM_COMBINE_SLOT_MIN;
        }
        else if (itemtype == PublicBagConfig.EBagSlotType.GroundSlot) {
            endindex = PublicBagConfig.Ground_ITEM_SLOT_MAX;
            beginindex = PublicBagConfig.Ground_ITEM_SLOT_MIN;
        }
        let root = this.Domain.ETRoot.As<ICourierEntityRoot>();
        for (let i = beginindex; i < endindex + 1; i++) {
            if (items[i + ""] == item.Id) {
                delete items[i + ""];
                root.RemoveDomainChild(item);
                this.SyncClient();
                break;
            }
        }
    }


    MoveItem(from: PublicBagConfig.EBagSlotType, fromslot: number, to: PublicBagConfig.EBagSlotType, toslot: number, toNpc?: IBaseNpc_Plus) {
        if (from == to && fromslot == toslot) { return; }
        this.AllItem[PublicBagConfig.EBagSlotType.BackPackSlot] = this.AllItem[PublicBagConfig.EBagSlotType.BackPackSlot] || {};
        this.AllItem[PublicBagConfig.EBagSlotType.EquipCombineSlot] = this.AllItem[PublicBagConfig.EBagSlotType.EquipCombineSlot] || {};
        const items = this.AllItem[PublicBagConfig.EBagSlotType.BackPackSlot];
        const itemEquipCombine = this.AllItem[PublicBagConfig.EBagSlotType.EquipCombineSlot];
        if (from == PublicBagConfig.EBagSlotType.BackPackSlot) {
            let fromitem = this.getItemByIndex(fromslot + "");
            if (fromitem == null) { return; }
            if (to == PublicBagConfig.EBagSlotType.BackPackSlot) {
                let toitem = this.getItemByIndex(toslot + "");
                delete items[fromslot + ""];
                delete items[toslot + ""];
                if (fromitem != null) {
                    items[toslot + ""] = fromitem.Id;
                }
                if (toitem != null) {
                    items[fromslot + ""] = toitem.Id;
                }
                this.SyncClient();
                return
            }
            else if (to == PublicBagConfig.EBagSlotType.PublicBagSlot) {
                let publicbag = GPublicBagSystem.GetInstance();
                if (!publicbag.IsEmpty()) {
                    EventHelper.ErrorMessage("公共背包已满")
                    return;
                }
                this.getOutItem(fromitem);
                GPublicBagSystem.GetInstance().putInItem(fromitem);
                return
            }
            else if (to == PublicBagConfig.EBagSlotType.EquipCombineSlot) {
                delete items[fromslot + ""];
                let toitem = this.getItemByIndex(toslot + "", PublicBagConfig.EBagSlotType.EquipCombineSlot);
                if (toitem != null) {
                    delete itemEquipCombine[fromslot + ""];
                    items[fromslot + ""] = toitem.Id;
                }
                itemEquipCombine[toslot + ""] = fromitem.Id;
                this.SyncClient();
                return
            }
            else if (to == PublicBagConfig.EBagSlotType.InventorySlot) {
                if (toNpc == null) { return; }
                this.getOutItem(fromitem);
                toNpc.AddItemOrInGround(fromitem.GetDomain<IBaseItem_Plus>())
                this.SyncClient();
                return
            }
        }
        else if (from == PublicBagConfig.EBagSlotType.PublicBagSlot) {
            let publicbag = GPublicBagSystem.GetInstance();
            let fromitem = publicbag.getItemByIndex(fromslot + "");
            if (fromitem == null) { return; }
            if (to == PublicBagConfig.EBagSlotType.BackPackSlot) {
                if (!this.IsItemEmpty()) {
                    EventHelper.ErrorMessage("背包已满")
                    return;
                }
                publicbag.getOutItem(fromitem);
                this.putInItem(fromitem);
                return
            }
            else if (to == PublicBagConfig.EBagSlotType.EquipCombineSlot) {
                if (!this.IsItemEmpty(PublicBagConfig.EBagSlotType.EquipCombineSlot)) {
                    EventHelper.ErrorMessage("合成槽位已满")
                    return;
                }
                publicbag.getOutItem(fromitem);
                this.putInItem(fromitem, PublicBagConfig.EBagSlotType.EquipCombineSlot);
                return
            }
            else if (to == PublicBagConfig.EBagSlotType.InventorySlot) {
                if (toNpc == null) { return; }
                publicbag.getOutItem(fromitem);
                toNpc.AddItemOrInGround(fromitem.GetDomain<IBaseItem_Plus>())
                this.SyncClient();
                return
            }
        }
        else if (from == PublicBagConfig.EBagSlotType.EquipCombineSlot) {
            let fromitem = this.getItemByIndex(fromslot + "", PublicBagConfig.EBagSlotType.EquipCombineSlot);
            if (fromitem == null) { return; }
            if (to == PublicBagConfig.EBagSlotType.BackPackSlot) {
                delete itemEquipCombine[fromslot + ""];
                let toitem = this.getItemByIndex(toslot + "");
                if (toitem != null) {
                    delete items[fromslot + ""];
                    itemEquipCombine[fromslot + ""] = toitem.Id;
                }
                items[toslot + ""] = fromitem.Id;
                this.SyncClient();
                return
            }
            else if (to == PublicBagConfig.EBagSlotType.PublicBagSlot) {
                let publicbag = GPublicBagSystem.GetInstance();
                if (!publicbag.IsEmpty()) {
                    EventHelper.ErrorMessage("公共背包已满")
                    return;
                }
                this.getOutItem(fromitem, PublicBagConfig.EBagSlotType.EquipCombineSlot);
                publicbag.putInItem(fromitem);
                return
            }

        }





    }




}