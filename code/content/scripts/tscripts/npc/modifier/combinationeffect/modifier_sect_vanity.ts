import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";


@registerModifier()
export class modifier_sect_vanity_base_a extends modifier_combination_effect {

    GetStatusEffectName(): string {
        return "particles/sect/sect_vanity/sect_vanity1.vpcf";
    }
    Init() {
        let parent = this.GetParentPlus();
    }
}
@registerModifier()
export class modifier_sect_vanity_base_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_vanity_base_c extends modifier_combination_effect {
}