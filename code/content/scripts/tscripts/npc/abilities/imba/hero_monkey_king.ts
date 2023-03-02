
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class imba_monkey_king_true_strike extends BaseAbility_Plus {
    IsInnateAbility() {
        return true;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_monkey_king_true_strike";
    }
}
@registerModifier()
export class modifier_imba_monkey_king_true_strike extends BaseModifier_Plus {
    GetTexture(): string {
        return "item_monkey_king_bar";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_CANNOT_MISS]: true
        };
    }
}
