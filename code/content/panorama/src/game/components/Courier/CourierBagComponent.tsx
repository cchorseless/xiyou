import { GameProtocol } from "../../../../../scripts/tscripts/shared/GameProtocol";
import { PublicBagConfig } from "../../../../../scripts/tscripts/shared/PublicBagConfig";
import { CourierBag } from "../../../../../scripts/tscripts/shared/rules/Courier/CourierBag";
import { NetHelper } from "../../../helper/NetHelper";
import { ItemEntityRoot } from "../Item/ItemEntityRoot";

@GReloadable
export class CourierBagComponent extends CourierBag {
    setBuyItem2Bag(b: boolean) {
        NetHelper.SendToLua(GameProtocol.Protocol.req_SetBuyItem2Bag, b)
    }

    sellAllItem() {
        NetHelper.SendToLua(GameProtocol.Protocol.req_sellAllItem)
    }


    onEquipCombine() {

    }


    selectArtifact(itemName?: string, refresh?: 0 | 1, random?: 0 | 1) {

    }

    getAllArtifact() {
        let items = this.AllItem[PublicBagConfig.EBagSlotType.ArtifactSlot] || {};
        let artifacts: ItemEntityRoot[] = [];
        let keys = Object.keys(items);
        keys.sort((a, b) => { return Number(a) - Number(b) });
        keys.forEach(slot => {
            let entity = GItemEntityRoot.GetEntityById(items[slot]);
            if (entity) {
                artifacts.push(entity);
            }
        })
        return artifacts;
    }

    getItemByIndex(slot: string, itemtype = PublicBagConfig.EBagSlotType.BackPackSlot) {
        let items = this.AllItem[itemtype] || {};
        let entityid = items[slot];
        if (entityid == null) return;
        return GItemEntityRoot.GetEntityById(entityid);
    }

    GiveItemToNpc(tonpc: number, item_slot: number, itementityid: ItemEntityIndex) {
        NetHelper.SendToLua(GameProtocol.Protocol.req_ITEM_GIVE_NPC, {
            npc: tonpc,
            slot: item_slot,
            itementityid: itementityid
        })
    }

    DropItem(item_slot: number, itementityid: ItemEntityIndex, pos: [number, number, number]) {
        NetHelper.SendToLua(GameProtocol.Protocol.req_ITEM_DROP_POSITION, {
            pos: { x: pos[0], y: pos[1], z: pos[2] },
            slot: item_slot,
            itementityid: itementityid
        })
    }



    MoveItem(from: PublicBagConfig.EBagSlotType, fromslot: number, to: PublicBagConfig.EBagSlotType, toslot: number, toNpc?: EntityIndex) {
        NetHelper.SendToLua(GameProtocol.Protocol.req_MoveItem, {
            from: from,
            fromslot: fromslot,
            to: to,
            toslot: toslot,
            tonpc: toNpc,
        })

    }

}