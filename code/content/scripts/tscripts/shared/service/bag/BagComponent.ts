import { GameServiceConfig } from "../../GameServiceConfig";
import { EEnum } from "../../Gen/Types";
import { ET, serializeETProps } from "../../lib/Entity";
import { TEquipItem, TItem } from "./TItem";


@GReloadable
export class BagComponent extends ET.Component {
    onGetBelongPlayerid() {
        let character = GTCharacter.GetOneInstanceById(this.Id);
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
        this.SyncClient(true);
    }

    @serializeETProps()
    public Items: string[];
    @serializeETProps()
    public MaxSize: number;


    addItem(item: TItem) {
        if (this.GetChild(item.Id) == null) {
            this.AddOneChild(item);
            if (!this.Items.includes(item.Id)) {
                this.Items.push(item.Id);
                this.onReload();
            }
        }
    }

    getAllItem() {
        let items: TItem[] = [];
        const allitems = TItem.GetGroupInstance(this.BelongPlayerid);
        const allTEquipItems = TEquipItem.GetGroupInstance(this.BelongPlayerid);
        allitems.concat(allTEquipItems).forEach(entity => {
            if (entity && entity.IsValidItem() && this.Items.includes(entity.Id) && entity.Config) {
                items.push(entity)
            }
        })
        return items;
    }


    getItemCount(itemid: string, includesEquip: boolean = false) {
        let r = 0;
        let allitems = TItem.GetGroupInstance(this.BelongPlayerid);
        if (includesEquip) {
            const allTEquipItems = TEquipItem.GetGroupInstance(this.BelongPlayerid);
            allitems = allitems.concat(allTEquipItems)
        }
        allitems.forEach(entity => {
            if (entity && entity.IsValidItem() && this.Items.includes(entity.Id) && entity.Config && entity.ConfigId + "" == itemid) {
                r += entity.ItemCount;
            }
        })
        return r;
    }

    GetOneItem(itemid: string) {
        const allitems = TItem.GetGroupInstance(this.BelongPlayerid);
        const allTEquipItems = TEquipItem.GetGroupInstance(this.BelongPlayerid);
        let allitem = allitems.concat(allTEquipItems)
        for (let entity of allitem) {
            if (entity && entity.IsValidItem() && this.Items.includes(entity.Id) && entity.Config && entity.ConfigId + "" == itemid) {
                return entity;
            }
        }
    }




    getItemByType(itemtype: EEnum.EItemType) {
        let items: TItem[] = [];
        const allitems = this.getAllItem();
        allitems.forEach(entity => {
            if (entity.Config.ItemType == itemtype) {
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