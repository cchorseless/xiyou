
import { GameEnum } from "../../../../GameEnum";
import { LogHelper } from "../../../../helper/LogHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_test } from "../../../modifier/modifier_test";
import { modifier_tp } from "../../../modifier/modifier_tp";

@registerAbility()
export class courier_challenge_equip extends BaseAbility_Plus {
  
    OnSpellStart() {
       
    }
    ProcsMagicStick() {
        return false;
    }

}



