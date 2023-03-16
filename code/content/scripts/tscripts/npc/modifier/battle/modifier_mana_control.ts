import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

@registerModifier()
export class modifier_mana_control extends BaseModifier_Plus {
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }

    IsHidden(): boolean {
        return true;
    }
    caster: IBaseNpc_Plus;
    public BeCreated(params?: IModifierTable): void {
        if (IsServer()) {
            this.caster = this.GetParentPlus();
            this.caster.SetMana(0);
        }
    }
    baseMana = 3;
    takedamageCount = 0;
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    public CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        this.takedamageCount += params.damage;
        let regenmana = math.floor(this.takedamageCount / this.baseMana);
        if (regenmana > 0) {
            this.caster.SetMana(this.caster.GetMana() + regenmana);
            this.takedamageCount = this.takedamageCount % this.baseMana;
        }
    }
}
