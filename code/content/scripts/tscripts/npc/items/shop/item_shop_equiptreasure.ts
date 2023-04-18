import { KVHelper } from "../../../helper/KVHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { ActiveRootItem } from "../ActiveRootItem";

// 初级装备宝箱
@registerAbility()
export class item_shop_equiptreasure_c extends ActiveRootItem {
    CanBeUsedOutOfInventory(): boolean {
        return true
    }
    onSpellStart() {
        this.UseOutOfInventory(true);
    }
    UseOutOfInventory(isuseinventory: boolean) {
        let poolgroupconfig = this.GetSpecialValueFor("poolgroupconfig");
        let itemname = KVHelper.RandomPoolGroupConfig(poolgroupconfig + "");
        if (itemname) {
            let item = this.GetParentPlus().CreateOneItem(itemname);
            if (item) {
                let hParent = this.GetParentPlus();
                GLogHelper.print(isuseinventory, 1111)
                if (isuseinventory) {
                    GTimerHelper.AddFrameTimer(1, GHandler.create(item, () => {
                        hParent.AddItemOrInGround(item);
                    }));
                }
            }
            if (this.IsInInventory()) {
                this.GetParentPlus().TakeItem(this);
            }
            SafeDestroyItem(this);
            return item;
        }
    }

}

// 中级装备宝箱
@registerAbility()
export class item_shop_equiptreasure_b extends item_shop_equiptreasure_c {
    CanBeUsedOutOfInventory(): boolean {
        return true
    }

}

// 高级装备宝箱
@registerAbility()
export class item_shop_equiptreasure_a extends item_shop_equiptreasure_c {
    CanBeUsedOutOfInventory(): boolean {
        return true
    }

}

// 传奇装备宝箱
@registerAbility()
export class item_shop_equiptreasure_s extends item_shop_equiptreasure_c {
    CanBeUsedOutOfInventory(): boolean {
        return true
    }

}