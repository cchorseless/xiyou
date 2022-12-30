import { PublicBagConfig } from "../../../../../scripts/tscripts/shared/PublicBagConfig";
import { CourierBag } from "../../../../../scripts/tscripts/shared/rules/Courier/CourierBag";
import { LogHelper } from "../../../helper/LogHelper";
import { ItemEntityRoot } from "../Item/ItemEntityRoot";

@GReloadable
export class CourierBagComponent extends CourierBag {
    onSerializeToEntity() {
        LogHelper.print("CourierBagComponent", GGameScene.GetPlayer(this.BelongPlayerid) == null, GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid) == null, this.BelongPlayerid);

        GGameScene.GetPlayer(this.BelongPlayerid).AddOneComponent(this);
    }

    setBuyItem2Bag(b: boolean) {

    }

    sellAllItem() {

    }


    onEquipCombine() {

    }


    selectArtifact(itemName?: string, refresh?: 0 | 1, random?: 0 | 1) {

    }

    getAllArtifact() {
        let items = this.AllItem[PublicBagConfig.EBagItemType.ARTIFACT] || {};
        let artifacts: ItemEntityRoot[] = [];
        let keys = Object.keys(items);
        keys.sort((a, b) => { return Number(a) - Number(b) });
        keys.forEach(slot => {
            let entity = GItemEntityRoot.GetEntity(items[slot]);
            if (entity) {
                artifacts.push(entity);
            }
        })
        return artifacts;
    }

    getItemByIndex(slot: string, itemtype = PublicBagConfig.EBagItemType.COMMON) {
        let items = this.AllItem[itemtype] || {};
        let entityid = items[slot];
        if (entityid == null) return;
        return GItemEntityRoot.GetEntity(entityid);
    }




}