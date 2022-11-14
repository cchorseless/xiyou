import { GameEnum } from "../../../GameEnum";
import { GameFunc } from "../../../GameFunc";
import { BattleHelper } from "../../../helper/BattleHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_property } from "../../propertystat/modifier_property";

/**嘲讽 */
@registerModifier()
export class modifier_taunt extends BaseModifier_Plus {
    GetTexture() {
        return "harpy_storm_chain_lightning";
    }
    IsHidden() {
        return false;
    }
    IsDebuff() {
        return true;
    }
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }
    IsStunDebuff() {
        return false;
    }
    AllowIllusionDuplicate() {
        return false;
    }

    StatusEffectPriority() {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    TauntUnit: BaseNpc_Plus;

    public Init(params?: object): void {
        if (IsServer()) {
            this.TauntUnit = this.GetCasterPlus();
        }
    }

    public OnDestroy(): void {
        super.OnDestroy();
        this.TauntUnit = null;
    }

    /**
     * 触电
     * @param hCaster
     * @param hAbility
     * @param iShockStack
     */
    static Taunt(target: BaseNpc_Plus, hCaster: BaseNpc_Plus, hAbility: BaseAbility_Plus, duration: number) {
        if (!IsServer()) {
            return;
        }
        modifier_taunt.apply(target, hCaster, hAbility, {
            duration: duration,
        });
    }
}
