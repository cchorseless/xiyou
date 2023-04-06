import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";

@registerModifier()
export class modifier_sect_invent_base_a extends modifier_combination_effect {
    prize_pool: number;
    Init() {
        let parent = this.GetParentPlus();
        this.prize_pool = this.getSpecialData("prize_pool");
    }


}
@registerModifier()
export class modifier_sect_invent_base_b extends modifier_combination_effect {
    prize_pool: number;
    Init() {
        let parent = this.GetParentPlus();
        this.prize_pool = this.getSpecialData("prize_pool");
    }
}
@registerModifier()
export class modifier_sect_invent_base_c extends modifier_combination_effect {
    prize_pool: number;
    Init() {
        let parent = this.GetParentPlus();
        this.prize_pool = this.getSpecialData("prize_pool");
    }
}