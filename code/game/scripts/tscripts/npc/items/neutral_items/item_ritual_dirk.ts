import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

@registerAbility()
export class item_ritual_dirk extends BaseItem_Plus {
    public damage: any;
    public mana_gain_on_kill: any;


    public Spawn() {
        LogHelper.print("item_ritual_dirk")
        this.damage = RandomInt((this.GetSpecialValueFor("bonus_damage") / 2), this.GetSpecialValueFor("bonus_damage"));
        this.mana_gain_on_kill = this.damage;
        // let tableName = "custom_item_state" as never;
        // if (IsServer()) {
        //     this.bonus_damage
        //     CustomNetTables.SetTableValue(tableName, string.format("%d", this.GetEntityIndex()),
        //         { damage: this.damage } as never)
        // }
        // else {
        //     let netTable: { damage: number } = CustomNetTables.GetTableValue(tableName, string.format("%d", this.GetEntityIndex()))
        //     this.damage = netTable.damage
        // }
    }

    public GetIntrinsicModifierName(): string {
        return "item_ritual_dirk_modifier"
    }


}