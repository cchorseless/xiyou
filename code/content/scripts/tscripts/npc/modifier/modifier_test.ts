
import { LogHelper } from "../../helper/LogHelper";
import { BaseModifier_Plus, registerProp } from "../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../entityPlus/Base_Plus";

@registerModifier()
export class modifier_test extends BaseModifier_Plus {


    Init(params: IModifierTable) {
        LogHelper.print(11111)
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS)
    bbb() {
        return 5000
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    ccc() {
        return 20
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    aaa() {
        return 5000
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    ddd() {
        return 500
    }
}

