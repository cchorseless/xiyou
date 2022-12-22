
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

// 高级抽卡
@registerAbility()
export class courier_fire_chess extends BaseAbility_Plus {
    GetBehavior() {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT
    }
    GetCooldown() {
        return 5
    }

    GetManaCost() {
        return 0
    }

    OnSpellStart() {
    }


}



