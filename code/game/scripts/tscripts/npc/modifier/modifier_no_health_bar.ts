import { reloadable } from "../../GameCache";
import { GameEnum } from "../../GameEnum";
import { LogHelper } from "../../helper/LogHelper";
import { BaseModifier_Plus, registerProp } from "../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../entityPlus/Base_Plus";

@registerModifier()
export class modifier_no_health_bar extends BaseModifier_Plus {
}

