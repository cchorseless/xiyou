import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { ERoundBoard } from "../../../rules/Components/Round/ERoundBoard";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { ActiveRootItem } from "../ActiveRootItem";

// 金币福袋
@registerAbility()
export class item_shop_gold_bag extends ActiveRootItem {

    Init(): void {
        let Ihander = GHandler.create(this, (keys: ModifierOverrideAbilitySpecialEvent) => {
            let hParent = this.GetCasterPlus();
            let data = NetTablesHelper.GetDotaEntityData(hParent.GetEntityIndex(), "item_shop_gold_bag") || {};
            if (keys.ability_special_value == "cur_get") {
                return data.curGetCoin;
            }
        })
        this.RegAbilitySpecialValueOverride("cur_get", Ihander);
    }
    curGetCoin: number = 0;
    addCurGet() {
        let hParent = this.GetCasterPlus();
        this.curGetCoin += this.GetSpecialValueFor("gold_get");
        NetTablesHelper.SetDotaEntityData(hParent.GetEntityIndex(), {
            curGetCoin: this.curGetCoin,
        }, "item_shop_gold_bag")
    }
    OnRoundStartPrize(round: ERoundBoard): void {
        if (round.isWin && IsValid(this)) {
            let hParent = this.GetCasterPlus();
            if (IsValid(hParent) && hParent.IsAlive()) {
                this.addCurGet();
            }
        }
    }
}
// 木材福袋
@registerAbility()
export class item_shop_wood_bag extends ActiveRootItem {
    Init(): void {
        let Ihander = GHandler.create(this, (keys: ModifierOverrideAbilitySpecialEvent) => {
            let hParent = this.GetCasterPlus();
            let data = NetTablesHelper.GetDotaEntityData(hParent.GetEntityIndex(), "item_shop_wood_bag") || {};
            if (keys.ability_special_value == "cur_get") {
                return data.curGetCoin;
            }
        })
        this.RegAbilitySpecialValueOverride("cur_get", Ihander);
    }
    curGetCoin: number = 0;
    addCurGet() {
        let hParent = this.GetCasterPlus();
        this.curGetCoin += this.GetSpecialValueFor("wood_get");
        NetTablesHelper.SetDotaEntityData(hParent.GetEntityIndex(), {
            curGetCoin: this.curGetCoin,
        }, "item_shop_wood_bag")
    }

    OnRoundStartPrize(round: ERoundBoard): void {
        if (round.isWin && IsValid(this)) {
            let hParent = this.GetCasterPlus();
            if (IsValid(hParent) && hParent.IsAlive()) {
                this.addCurGet();
            }
        }
    }

}
// 魂晶福袋
@registerAbility()
export class item_shop_soulcrystal_bag extends ActiveRootItem {

    Init(): void {
        let Ihander = GHandler.create(this, (keys: ModifierOverrideAbilitySpecialEvent) => {
            let hParent = this.GetCasterPlus();
            let data = NetTablesHelper.GetDotaEntityData(hParent.GetEntityIndex(), "item_shop_soulcrystal_bag") || {};
            if (keys.ability_special_value == "cur_get") {
                return data.curGetCoin;
            }
        })
        this.RegAbilitySpecialValueOverride("cur_get", Ihander);
    }
    curGetCoin: number = 0;
    addCurGet() {
        let hParent = this.GetCasterPlus();
        this.curGetCoin += this.GetSpecialValueFor("soulcrystal_get");
        NetTablesHelper.SetDotaEntityData(hParent.GetEntityIndex(), {
            curGetCoin: this.curGetCoin,
        }, "item_shop_soulcrystal_bag")
    }
    OnRoundStartPrize(round: ERoundBoard): void {
        if (round.isWin && IsValid(this)) {
            let hParent = this.GetCasterPlus();
            if (IsValid(hParent) && hParent.IsAlive()) {
                this.addCurGet();
            }
        }
    }
}


