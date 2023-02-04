import { registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";

@registerModifier()
export class modifier_phy_arm_base_3 extends modifier_combination_effect {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    phy_arm_base: number;
    Init(params?: object) {
        this.phy_arm_base = this.getData("PHYSICAL_ARMOR_BASE");
        GLogHelper.print(this.phy_arm_base, 111111111)
    }
}
@registerModifier()
export class modifier_phy_arm_base_6 extends modifier_combination_effect {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    phy_arm_base = this.getData("PHYSICAL_ARMOR_BASE");
}
@registerModifier()
export class modifier_phy_arm_base_9 extends modifier_combination_effect {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    phy_arm_base = this.getData("PHYSICAL_ARMOR_BASE");
}