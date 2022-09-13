import { GameEnum } from "../../../GameEnum";
import { registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_propertychange } from "./modifier_propertychange";

@registerModifier()
export class modifier_phy_arm_base_3 extends modifier_propertychange {
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE)
    phy_arm_base = this.getData("PHYSICAL_ARMOR_BASE");
}
@registerModifier()
export class modifier_phy_arm_base_6 extends modifier_propertychange {
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE)
    phy_arm_base = this.getData("PHYSICAL_ARMOR_BASE");
}
@registerModifier()
export class modifier_phy_arm_base_9 extends modifier_propertychange {
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE)
    phy_arm_base = this.getData("PHYSICAL_ARMOR_BASE");
}