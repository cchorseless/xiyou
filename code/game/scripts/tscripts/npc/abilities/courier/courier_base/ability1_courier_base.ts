
import { GameEnum } from "../../../../GameEnum";
import { EntityHelper } from "../../../../helper/EntityHelper";
import { LogHelper } from "../../../../helper/LogHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_test } from "../../../modifier/modifier_test";

@registerAbility()
export class ability1_courier_base extends BaseAbility_Plus {
    GetBehavior() {
        // let hCaster = this.GetOwnerPlus();
        // let iCount = modifier_builder_gold.GetStackIn(hCaster);
        // if (iCount == 1) {
        //     return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE;
        // } else {
        //     return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE;
        // }
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_HIDDEN;
    }
    IsHidden(): boolean {
        return true;
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



