
    import { AI_ability } from "../../../ai/AI_ability";
    import { GameFunc } from "../../../GameFunc";
    import { ResHelper } from "../../../helper/ResHelper";
    import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
    import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
    import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
    import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
    import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
    @registerAbility()
export class rapier_base_class extends BaseAbility_Plus {
OnOwnerDied( /** params */ ):void {
    let hOwner = this.GetOwnerPlus();
    if (!hOwner.IsRealHero()) {
        hOwner.DropItem(true, true);
        return;
    }
    if (!hOwner.IsReincarnating()) {
        hOwner.DropItem(true, true);
    }
}
IsRapier() {
    return true;
}
}
@registerModifier()
export class modifier_rapier_base_class extends BaseModifier_Plus {
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
RemoveOnDeath():boolean {
    return false;
}
GetAttributes():DOTAModifierAttribute_t {
    return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
}
BeDestroy():void {
    if (IsServer()) {
        this.StartIntervalThink(-1);
    }
}
}
@registerModifier()
export class modifier_imba_rapier_cursed_damage_reduction extends BaseModifier_Plus {
public damage_reduction : number; 
IsDebuff():boolean {
    return false;
}
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
IsPurgeException():boolean {
    return false;
}
IsStunDebuff():boolean {
    return false;
}
RemoveOnDeath():boolean {
    return false;
}
BeCreated(p_0:any,):void {
    if (IsServer()) {
        if (!this.GetItemPlus()) {
            this.Destroy();
        }
    }
    this.damage_reduction = this.GetItemPlus().GetSpecialValueFor("damage_reduction");
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
    });
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
CC_GetModifierIncomingDamage_Percentage(p_0:ModifierAttackEvent,):number {
    return this.damage_reduction * (-1);
}
}
@registerModifier()
export class modifier_imba_rapier_cursed_curse extends BaseModifier_Plus {
public parent : IBaseNpc_Plus; 
public interval : number; 
IsDebuff():boolean {
    return false;
}
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
IsPurgeException():boolean {
    return false;
}
IsStunDebuff():boolean {
    return false;
}
RemoveOnDeath():boolean {
    return false;
}
BeCreated(p_0:any,):void {
    if (IsServer()) {
        if (!this.GetItemPlus()) {
            this.Destroy();
        }
    }
    this.parent = this.GetParentPlus();
    if (IsServer()) {
        this.interval = 0.1;
        if (this.GetItemPlus().owner_entindex != this.GetParentPlus().entindex()) {
            this.GetItemPlus().corruption_total_time = 0;
        }
        this.GetItemPlus().owner_entindex = this.GetParentPlus().entindex();
        this.StartIntervalThink(this.interval);
    }
}
BeDestroy():void {
    if (IsServer()) {
        this.StartIntervalThink(-1);
    }
}
OnIntervalThink():void {
    if (this.GetItemPlus()) {
        this.GetItemPlus().corruption_total_time = this.GetItemPlus().corruption_total_time + this.interval;
        ApplyDamage({
            attacker: this.parent,
            victim: this.parent,
            ability: this.GetItemPlus(),
            damage: this.GetItemPlus().GetSpecialValueFor("base_corruption") * this.parent.GetMaxHealth() * (this.GetItemPlus().corruption_total_time / this.GetItemPlus().GetSpecialValueFor("time_to_double")) * 0.01 * this.interval,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_DAMAGE_MULTIPLIERS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL
        });
    }
}
}
