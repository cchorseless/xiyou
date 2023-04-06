import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_combination_effect } from "./modifier_combination_effect";


@registerModifier()
export class modifier_sect_steal_base_a extends modifier_combination_effect {
    gold_min: number;
    gold_max: number;
    prop_pect: number = 0;

    Init() {
        let parent = this.GetParentPlus();
        this.gold_min = this.getSpecialData("gold_min")
        this.gold_max = this.getSpecialData("gold_max")
        this.prop_pect = this.getSpecialData("prop_pect")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH, false, true)
    CC_ON_DEATH(e: ModifierInstanceEvent) {
        if (!IsServer()) { return }
        let parent = this.GetParentPlus();
        let target = e.unit;
        if (RollPercentage(this.prop_pect)) {
            let gold = RandomInt(this.gold_min, this.gold_max)
            parent.GetPlayerRoot().PlayerDataComp().ModifyGold(gold)
        }
    }


}
@registerModifier()
export class modifier_sect_steal_base_b extends modifier_combination_effect {
    wood_min: number;
    wood_max: number;
    prop_pect: number = 0;

    Init() {
        let parent = this.GetParentPlus();
        this.wood_min = this.getSpecialData("wood_min")
        this.wood_max = this.getSpecialData("wood_max")
        this.prop_pect = this.getSpecialData("prop_pect")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH, false, true)
    CC_ON_DEATH(e: ModifierInstanceEvent) {
        if (!IsServer()) { return }
        let parent = this.GetParentPlus();
        let target = e.unit;
        if (RollPercentage(this.prop_pect)) {
            let wood = RandomInt(this.wood_min, this.wood_max)
            parent.GetPlayerRoot().PlayerDataComp().ModifyGold(wood)
        }
    }
}
@registerModifier()
export class modifier_sect_steal_base_c extends modifier_combination_effect {
    gold_min: number;
    gold_max: number;
    wood_min: number;
    wood_max: number;
    prop_pect: number = 0;

    Init() {
        let parent = this.GetParentPlus();
        this.gold_min = this.getSpecialData("gold_min")
        this.gold_max = this.getSpecialData("gold_max")
        this.wood_min = this.getSpecialData("wood_min")
        this.wood_max = this.getSpecialData("wood_max")
        this.prop_pect = this.getSpecialData("prop_pect")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH, false, true)
    CC_ON_DEATH(e: ModifierInstanceEvent) {
        if (!IsServer()) { return }
        let parent = this.GetParentPlus();
        let target = e.unit;
        if (RollPercentage(this.prop_pect)) {
            let gold = RandomInt(this.gold_min, this.gold_max)
            parent.GetPlayerRoot().PlayerDataComp().ModifyGold(gold)
            let wood = RandomInt(this.wood_min, this.wood_max)
            parent.GetPlayerRoot().PlayerDataComp().ModifyWood(wood)
        }
    }
}