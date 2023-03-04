
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_enchanted_mango extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_mango";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = ability.GetCursorTarget() || caster;
        let cast_sound = "DOTA_Item.Mango.Activate";
        let mango_particle = "";
        let ripe_mango_particle = "";
        let modifier_ripe_mango = "modifier_imba_ripe_mango_timer";
        let mana_replenish = ability.GetSpecialValueFor("mana_replenish");
        let ripe_mango_mana = ability.GetSpecialValueFor("ripe_mango_mana");
        let ripe_mango_duration = ability.GetSpecialValueFor("ripe_mango_duration");
        EmitSoundOn(cast_sound, target);
        if (!target.HasModifier(modifier_ripe_mango)) {
            target.GiveMana(ripe_mango_mana);
            target.AddNewModifier(caster, ability, modifier_ripe_mango, {
                duration: ripe_mango_duration
            });
        } else {
            target.GiveMana(mana_replenish);
        }
        ability.SpendCharge();
    }
}
@registerModifier()
export class modifier_imba_mango extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public parent: IBaseNpc_Plus;
    public hp_regen: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        this.hp_regen = this.ability.GetSpecialValueFor("hp_regen");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.hp_regen * this.ability.GetCurrentCharges();
    }
}
@registerModifier()
export class modifier_imba_ripe_mango_timer extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetTexture(): string {
        return "item_enchanted_mango";
    }
}
