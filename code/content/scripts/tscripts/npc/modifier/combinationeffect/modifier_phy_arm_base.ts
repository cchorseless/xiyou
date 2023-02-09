import { registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";

@registerModifier()
export class modifier_phyarm_up_base_3 extends modifier_combination_effect {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    phy_arm_base: number = this.getData("phyarm");
}
@registerModifier()
export class modifier_phyarm_up_base_6 extends modifier_combination_effect {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    phy_arm_base = this.getData("phyarm");
}
@registerModifier()
export class modifier_phyarm_up_base_9 extends modifier_combination_effect {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    phy_arm_base = this.getData("phyarm");
}