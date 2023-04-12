
import { ActiveRootItem } from "../../../npc/items/ActiveRootItem";
import { PublicBagConfig } from "../../../shared/PublicBagConfig";
import { ET } from "../../../shared/lib/Entity";
import { ERoundBoard } from "../Round/ERoundBoard";

@GReloadable
export class InventoryComponent extends ET.Component implements IRoundStateCallback {
    AllItem: { [itemtype: string]: string[] } = {};
    onAwake(...args: any[]): void {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        npc.SetHasInventory(true);
        for (let i = DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1; i <= DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_9; i++) {
            let item = npc.GetItemInSlot(i) as IBaseItem_Plus;
            if (item && item.IsValidItem() && item.ETRoot) {
                this.putInItem(item.ETRoot as IItemEntityRoot);
            }
        }
    }
    OnRound_Start(round?: ERoundBoard): void { }
    OnRound_WaitingEnd(): void { };
    // 战吼
    OnRound_Battle() {
        let allItem = this.getAllValidCombinationItem();
        allItem.forEach(item => {
            if (item.OnRoundStartBattle) {
                item.OnRoundStartBattle()
            }
        })
    }

    OnRound_Prize(round: ERoundBoard) {
        let allItem = this.getAllValidCombinationItem();
        allItem.forEach(item => {
            if (item.OnRoundStartPrize) {
                item.OnRoundStartPrize(round)
            }
        })
    }

    cloneItem(source: InventoryComponent) {
        let allItem = source.getAllValidCombinationItem();
        let npc = this.GetDomain<IBaseNpc_Plus>();
        allItem.forEach(item => {
            let hItem = npc.AddItemOrInGround(item.GetAbilityName());
            GItemEntityRoot.Active(item);
            if (item.IsStackable()) {
                hItem.SetCurrentCharges(item.GetCurrentCharges())
            }
        });
    }

    getItemRoot(childid: string) {
        let battleunit = this.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBattleUnitEntityRoot>();
        return battleunit.GetDomainChild<IItemEntityRoot>(childid);
    }




    getItemRootByName(itemname: string) {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        let item = npc.FindItemInInventory(itemname) as IBaseItem_Plus;
        if (item && item.ETRoot) {
            return item.ETRoot as IItemEntityRoot
        }
    }


    getAllValidCombinationItem() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        let len = DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_6;
        let r: ActiveRootItem[] = []
        for (let i = 0; i <= len; i++) {
            let item = npc.GetItemInSlot(i) as ActiveRootItem;
            if (item && item.IsValidItem()) {
                r.push(item)
            }
        }
        return r;
    }
    /**玩家物品信息 */
    itemSlotData: EntityIndex[] = [];
    /**
     * 检查位置是否变动
     * 获取|丢失|位置更换 0|1|2
     * @returns 改变的slot [number[],0 | 1 | 2]
     */
    CheckItemSlotChange() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        let data: EntityIndex[] = [];
        for (let i = 0; i < DOTAScriptInventorySlot_t.DOTA_ITEM_TRANSIENT_ITEM; i++) {
            let itemEnity = npc.GetItemInSlot(i);
            if (itemEnity != null) {
                data.push(itemEnity.entindex());
            } else {
                data.push(-1 as EntityIndex);
            }
        }
        let r = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i] != this.itemSlotData[i]) {
                r.push(i);
            }
        }
        this.itemSlotData = data;
        if (r.length > 0) {
            /**获取|丢失|位置更换 */
            let state: 0 | 1 | 2 = 0;
            if (r.length == 1) {
                if (data[r[0]] > 0) {
                    state = 0;
                } else {
                    state = 1;
                }
            } else if (r.length == 2) {
                state = 2;
                // 换位置刷新羁绊
                this.changeSlotItem(r[0], r[1]);

            }
            return [r, state];
        }
    }
    /**
     * 查找道具数量
     * @param playerid
     * @param itemname
     * @returns
     */
    GetItemCount(itemname: string): number {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        let r = 0;
        for (let i = 0; i < DOTAScriptInventorySlot_t.DOTA_ITEM_TRANSIENT_ITEM; i++) {
            let item = npc.GetItemInSlot(i);
            if (item && item.GetAbilityName() == itemname) {
                r += 1;
            }
        }
        return r;
    }
    GetInventorySlot(itemroot: IItemEntityRoot) {
        let item = itemroot.GetDomain<IBaseItem_Plus>();
        return item.GetItemSlot();
    }
    IsValidCombinationSlot(slot: number) {
        return slot >= DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1 && slot <= DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_6;
    }
    getItemRootBySlot(slot: number) {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        let item = npc.GetItemInSlot(slot) as IBaseItem_Plus;
        if (item && item.ETRoot) {
            return item.ETRoot as IItemEntityRoot
        }
    }
    /**
     * 换位置刷新羁绊
     * @param slot1 
     * @param slot2 
     */
    changeSlotItem(slot1: number, slot2: number) {
        let root = this.Domain.ETRoot.As<IBattleUnitEntityRoot>();
        if (!root.CombinationComp || !root.CombinationComp()) {
            return
        }
        let isvalidSlot = -1;
        let isnotvalidSlot = -1;
        [slot1, slot2].forEach(slot => {
            if (this.IsValidCombinationSlot(slot)) {
                isvalidSlot = slot;
            }
            if (!this.IsValidCombinationSlot(slot)) {
                isnotvalidSlot = slot;
            }
        });
        if (isvalidSlot != -1 && isnotvalidSlot != -1) {
            root.CombinationComp().addItemRoot(this.getItemRootBySlot(isvalidSlot));
            root.CombinationComp().removeItemRoot(this.getItemRootBySlot(isnotvalidSlot));
        }
    }

    putInItem(item: IItemEntityRoot) {
        let slot = this.GetInventorySlot(item);
        const itemtype = slot >= 0 ? PublicBagConfig.EBagSlotType.InventorySlot : PublicBagConfig.EBagSlotType.GroundSlot;
        this.AllItem[itemtype] = this.AllItem[itemtype] || [];
        const items = this.AllItem[itemtype];
        if (items.includes(item.Id)) { return; }
        items.push(item.Id);
        let root = this.Domain.ETRoot.As<IBattleUnitEntityRoot>();
        root.AddDomainChild(item);
        // item.GetDomain<IBaseItem_Plus>().SetActivated(!root.IsCourierRoot())
        if (root.CombinationComp && root.CombinationComp() &&
            itemtype == PublicBagConfig.EBagSlotType.InventorySlot && this.IsValidCombinationSlot(slot)
        ) {
            root.CombinationComp().addItemRoot(item);
        }
        item.SyncClient();
        // GTimerHelper.AddTimer(0.1, GHandler.create(this, () => { this.SyncClient() }));
    }

    getOutItem(item: IItemEntityRoot, oldslot: number) {
        const itemtype = oldslot >= 0 ? PublicBagConfig.EBagSlotType.InventorySlot : PublicBagConfig.EBagSlotType.GroundSlot;
        this.AllItem[itemtype] = this.AllItem[itemtype] || [];
        const items = this.AllItem[itemtype];
        if (!items.includes(item.Id)) { return; }
        items.splice(items.indexOf(item.Id), 1);
        let root = this.Domain.ETRoot.As<IBattleUnitEntityRoot>();
        root.RemoveDomainChild(item);
        if (root.CombinationComp && root.CombinationComp() &&
            itemtype == PublicBagConfig.EBagSlotType.InventorySlot && this.IsValidCombinationSlot(oldslot)
        ) {
            root.CombinationComp().removeItemRoot(item);
        }
        // this.SyncClient();

    }
    dropGroundItem(item: IItemEntityRoot, oldslot: number) {
        const itemtype = PublicBagConfig.EBagSlotType.InventorySlot;
        const itemtypeGround = PublicBagConfig.EBagSlotType.GroundSlot;
        this.AllItem[itemtype] = this.AllItem[itemtype] || [];
        this.AllItem[itemtypeGround] = this.AllItem[itemtypeGround] || [];
        const items = this.AllItem[itemtype];
        const itemGround = this.AllItem[itemtypeGround];
        if (items.includes(item.Id)) {
            items.splice(items.indexOf(item.Id), 1);
            let root = this.Domain.ETRoot.As<IBattleUnitEntityRoot>();
            if (root.CombinationComp && root.CombinationComp() && this.IsValidCombinationSlot(oldslot)) {
                root.CombinationComp().removeItemRoot(item);
            }
        }
        if (itemGround.includes(item.Id)) { return; }
        itemGround.push(item.Id);
        // this.SyncClient();
    }


}
