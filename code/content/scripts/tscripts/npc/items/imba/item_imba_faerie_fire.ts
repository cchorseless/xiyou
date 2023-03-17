
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_faerie_fire extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_faerie_fire";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let cast_sound = "DOTA_Item.FaerieSpark.Activate";
        let particle_faerie = "";
        let modifier_fire_within = "modifier_imba_faerie_fire_fire_within";
        let hp_restore = ability.GetSpecialValueFor("hp_restore");
        let fire_within_duration = ability.GetSpecialValueFor("fire_within_duration");
        EmitSoundOn(cast_sound, caster);
        caster.ApplyHeal(hp_restore, this);
        caster.AddNewModifier(caster, ability, modifier_fire_within, {
            duration: fire_within_duration
        });
        ability.SpendCharge();
    }
}
@registerModifier()
export class modifier_imba_faerie_fire extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public bonus_damage: number;
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
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
        this.bonus_damage = this.ability.GetSpecialValueFor("bonus_damage");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage * this.ability.GetCurrentCharges();
    }
}
@registerModifier()
export class modifier_imba_faerie_fire_fire_within extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public fire_within_dmg: any;
    public fire_within_dmg_rdctn_pct: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.fire_within_dmg = this.ability.GetSpecialValueFor("fire_within_dmg");
        this.fire_within_dmg_rdctn_pct = this.ability.GetSpecialValueFor("fire_within_dmg_rdctn_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.fire_within_dmg;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return this.fire_within_dmg_rdctn_pct * (-1);
    }
    GetTexture(): string {
        return "item_faerie_fire";
    }
}
