import { registerAbility } from "../../entityPlus/Base_Plus";
import { ActiveRootItem } from "../ActiveRootItem";

// 彩票
@registerAbility()
export class item_shop_lottery_ticket extends ActiveRootItem {
    CanBeUsedOutOfInventory(): boolean {
        return true
    }
    onSpellStart() {
        this.UseOutOfInventory();
    }
    UseOutOfInventory(): any {
        let sound_cast = "DOTA_Item.Hand_Of_Midas";

        let hParent = this.GetParentPlus();
        let hPlayerid = hParent.GetPlayerID();
        let hPlayer = GGameScene.GetPlayer(hPlayerid);
        let getgold = -1;
        let gold_cost_pect = this.GetSpecialValueFor("gold_cost_pect");
        let gold_get2 = this.GetSpecialValueFor("gold_get_2");
        let gold_get5 = this.GetSpecialValueFor("gold_get_5");
        let gold_get100 = this.GetSpecialValueFor("gold_get_100");
        if (RollPercentage(gold_get2)) {
            getgold = 2;
        }
        else if (RollPercentage(gold_get5)) {
            getgold = 5;
        }
        else if (RollPercentage(gold_get100)) {
            getgold = 100;
        }
        if (getgold > 0) {
            EmitSoundOn(sound_cast, this.GetParentPlus());
        }
        let gold_get = math.floor(getgold * hPlayer.PlayerDataComp().GetGold() * gold_cost_pect * 0.01);
        hPlayer.PlayerDataComp().ModifyGold(gold_get);
        // this.SetCurrentCharges(math.max(this.GetCurrentCharges() - 1, 0));
        // if (this.GetCurrentCharges() <= 0) {
        //     SafeDestroyItem(this);
        // }
        if (this.IsInInventory()) {
            this.GetParentPlus().TakeItem(this);
        }
        SafeDestroyItem(this);
        return null;
    }

    GetCooldown(level: number): number {
        return 0.3;
    }
}