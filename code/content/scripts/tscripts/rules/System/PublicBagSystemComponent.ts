
import { KVHelper } from "../../helper/KVHelper";
import { PublicBagConfig } from "../../shared/PublicBagConfig";
import { PublicBagSystem } from "../../shared/rules/System/PublicBagSystem";
import { ItemEntityRoot } from "../Components/Item/ItemEntityRoot";



@GReloadable
export class PublicBagSystemComponent extends PublicBagSystem {
    public onAwake() {
        GTimerHelper.AddTimer(0.1, GHandler.create(this, () => {
            this.SyncClient();
        }))
        this.addEvent();
    }
    public addEvent() {
    }


    addBuildingItem(playerid: PlayerID, towername: string) {
        let playerroot = GGameScene.GetPlayer(playerid);
        if (!this.IsEmpty()) { return; }
        let sItemName = KVHelper.GetUnitData(towername, "CardName") as string;
        if (!sItemName) { return; }
        let itemEntity = playerroot.Hero.CreateOneItem(sItemName);
        ItemEntityRoot.Active(itemEntity);
        this.putInItem(itemEntity.ETRoot as ItemEntityRoot);
        return itemEntity.ETRoot as ItemEntityRoot;
    }


    getItemByIndex(slot: string) {
        let entityid = this.AllItem[slot + ""];
        if (entityid == null) return;
        return GGameScene.Scene.GetDomainChild<IItemEntityRoot>(entityid);
    }
    putInItem(item: IItemEntityRoot) {
        if (!this.IsEmpty()) { return; }
        if (Object.values(this.AllItem).includes(item.Id)) { return; }
        for (let i = PublicBagConfig.PUBLIC_ITEM_SLOT_MIN; i < PublicBagConfig.PUBLIC_ITEM_SLOT_MAX + 1; i++) {
            if (this.AllItem[i + ""] == null) {
                this.AllItem[i + ""] = item.Id;
                GGameScene.Scene.AddDomainChild(item);
                item.SyncClient();
                GTimerHelper.AddTimer(0.1, GHandler.create(this, () => { this.SyncClient() }));
                break;
            }
        }
    }

    getOutItem(item: IItemEntityRoot) {
        if (!Object.values(this.AllItem).includes(item.Id)) { return; }
        for (let i = PublicBagConfig.PUBLIC_ITEM_SLOT_MIN; i < PublicBagConfig.PUBLIC_ITEM_SLOT_MAX + 1; i++) {
            if (this.AllItem[i + ""] == item.Id) {
                delete this.AllItem[i + ""];
                GGameScene.Scene.RemoveDomainChild(item);
                this.SyncClient();
                break;
            }
        }
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