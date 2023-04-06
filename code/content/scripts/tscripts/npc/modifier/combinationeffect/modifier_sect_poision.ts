import { registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";

@registerModifier()
export class modifier_sect_poision_base_a extends modifier_combination_effect {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_POISON_COUNT_PERCENTAGE)
    poision_pect: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.POISON_ACTIVE_TIME_PERCENTAGE)
    poision_interval_pect: number;
    Init() {
        let parent = this.GetParentPlus();
        this.poision_pect = this.getSpecialData("poision_pect")
        this.poision_interval_pect = this.getSpecialData("poision_interval_pect")
    }
}
@registerModifier()
export class modifier_sect_poision_base_b extends modifier_sect_poision_base_a {

}
@registerModifier()
export class modifier_sect_poision_base_c extends modifier_sect_poision_base_a {

}