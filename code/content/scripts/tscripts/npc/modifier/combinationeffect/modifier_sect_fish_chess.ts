import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";

@registerModifier()
export class modifier_sect_fish_chess_base_a extends modifier_combination_effect {
    Init() {
        // let parent = this.GetParentPlus();
        // this.chance_pect = this.getSpecialData("chance_pect");
        // this.extra_time = this.getSpecialData("extra_time");
        // // 全队需要额外加上这个buff
        // modifier_sect_double_head_particle.applyOnly(parent, parent)
    }
}
@registerModifier()
export class modifier_sect_fish_chess_base_b extends modifier_combination_effect {

}
@registerModifier()
export class modifier_sect_fish_chess_base_c extends modifier_combination_effect {

}