import { registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";

@registerModifier()
export class modifier_sect_flame_base_a extends modifier_combination_effect {

    Init() {
        let parent = this.GetParentPlus();
        this.spell_crit_pect = this.getSpecialData("spell_crit_pect");
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_CHANCE)
    spell_crit_pect: number;
}
@registerModifier()
export class modifier_sect_flame_base_b extends modifier_sect_flame_base_a {
}
@registerModifier()
export class modifier_sect_flame_base_c extends modifier_sect_flame_base_a {
}
