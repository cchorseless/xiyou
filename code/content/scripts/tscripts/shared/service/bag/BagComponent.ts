import { GameServiceConfig } from "../../GameServiceConfig";
import { EEnum } from "../../Gen/Types";
import { ET, ETEntitySystem, serializeETProps } from "../../lib/Entity";
import { TItem } from "./TItem";


@GReloadable
export class BagComponent extends ET.Component {
    onGetBelongPlayerid() {
        let character = ETEntitySystem.GetEntity(this.Id + "TCharacter");
        if (character != null) {
            return character.BelongPlayerid;
        }
        return -1;
    }
    onSerializeToEntity() {
        GTCharacter.GetOneInstance(this.BelongPlayerid).AddOneComponent(this);
        this.onReload();
    }

    onReload() {
        this.SyncClient();
    }

    @serializeETProps()
    public Items: string[];
    @serializeETProps()
    public MaxSize: number;

    getItemByType(itemtype: EEnum.EItemType) {
        let items: TItem[] = [];
        this.Items.forEach(entityid => {
            let entity = this.GetChild<TItem>(entityid);
            if (entity && entity.IsValid && entity.Config && entity.Config.ItemType == itemtype) {
                items.push(entity)
            }
        })
        return items;
    }

    getAllCourierNames() {
        const courierunlock = this.getItemByType(EEnum.EItemType.Courier);
        const courierNames: string[] = [];
        courierNames.push(GameServiceConfig.DefaultCourier);
        courierunlock.forEach(item => {
            if (item.Config.ItemName && !courierNames.includes(item.Config.ItemName)) {
                courierNames.push(item.Config.ItemName)
            }
        })
        return courierNames
    }

}
declare global {
    type IBagComponent = BagComponent;
    var GBagComponent: typeof BagComponent;
}
if (_G.GBagComponent == null) {
    _G.GBagComponent = BagComponent;
}