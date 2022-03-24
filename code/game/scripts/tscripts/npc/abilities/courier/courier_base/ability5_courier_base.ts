
import { GameEnum } from "../../../../GameEnum";
import { LogHelper } from "../../../../helper/LogHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_test } from "../../../modifier/modifier_test";
import { modifier_tp } from "../../../modifier/modifier_tp";

@registerAbility()
export class ability5_courier_base extends BaseAbility_Plus {
    GetBehavior() {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET
    }
    GetCooldown() {
        return 10
    }

    GetManaCost() {
        return 0
    }

    OnSpellStart() {
        let cur_v = this.GetCasterPlus().GetAbsOrigin();
        let cur_a = this.GetCasterPlus().GetForwardVector()
        let _v = cur_a.Normalized() * 400 + cur_v;
        FindClearSpaceForUnit(this.GetCasterPlus(), GetGroundPosition(_v as Vector, this.GetCasterPlus()), false)
    }


}



