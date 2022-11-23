import { reloadable } from "../../GameCache";
import { GameEnum } from "../../shared/GameEnum";
import { LogHelper } from "../../helper/LogHelper";
import { BaseModifier_Plus, registerProp } from "../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../entityPlus/Base_Plus";

@registerModifier()
export class modifier_test extends BaseModifier_Plus {


    Init(params: ModifierTable) {
        LogHelper.print(11111)
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.HP_BONUS)
    bbb() {
        return 5000
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    ccc() {
        return 20
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MANA_BONUS)
    aaa() {
        return 5000
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    ddd() {
        return 500
    }
}

