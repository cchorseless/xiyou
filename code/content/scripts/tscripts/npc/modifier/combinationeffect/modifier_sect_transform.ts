import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";


@registerModifier()
export class modifier_sect_transform_base_a extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        let mana = this.getSpecialData("mana");
        parent.SetMana(mana);
    }
}
@registerModifier()
export class modifier_sect_transform_base_b extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        let illusion_count = this.getSpecialData("illusion_count");
        parent.CreateIllusion(parent, {
            outgoing_damage: 100,
            incoming_damage: 100,
            outgoing_damage_structure: 100,
            duration: 60
        }, illusion_count)
    }

}
@registerModifier()
export class modifier_sect_transform_base_c extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        let mana = this.getSpecialData("mana");
        parent.SetMana(mana);
    }

}