
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_blade_mail extends BaseItem_Plus {
    GetAbilityTextureName(): string {
        let uniqueBM: { [k: string]: string } = {
            npc_dota_hero_axe: "axe"
        }
        if (this.GetLevel() == 2) {
            return "item_bladestorm_mail";
        } else if (uniqueBM[this.GetCasterPlus().GetName()]) {
            return "imba_blade_mail_" + uniqueBM[this.GetCasterPlus().GetName()];
        } else {
            return "item_blade_mail";
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_blade_mail";
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("DOTA_Item.BladeMail.Activate");
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_blade_mail_active", {
            duration: this.GetSpecialValueFor("duration")
        });
    }
}
@registerModifier()
export class modifier_item_imba_blade_mail extends BaseModifier_Plus {
    public bonus_damage: number;
    public bonus_armor: number;
    public bonus_intellect: number;
    public parent: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
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
        this.bonus_damage = this.GetItemPlus().GetSpecialValueFor("bonus_damage");
        this.bonus_armor = this.GetItemPlus().GetSpecialValueFor("bonus_armor");
        this.bonus_intellect = this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
        this.parent = this.GetParentPlus();
        this.ability = this.GetItemPlus();
        if (IsServer()) {
            if (!this.GetParentPlus().HasModifier("modifier_item_imba_blade_mail_passive")) {
                this.GetParentPlus().AddNewModifier(this.parent, this.ability, "modifier_item_imba_blade_mail_passive", {});
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.AddTimer(0.1, () => {
            if (!this.parent.HasModifier("modifier_item_imba_blade_mail")) {
                this.parent.RemoveModifierByName("modifier_item_imba_blade_mail_passive");
            }
        });
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.bonus_armor;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.bonus_intellect;
    }
}
@registerModifier()
export class modifier_item_imba_blade_mail_active extends BaseModifier_Plus {
    public level: any;
    public lacerate_pct: number;
    public lacerate_duration: number;
    public justice_pct: number;
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        if ((this.GetItemPlus() && this.GetItemPlus().GetLevel()) == 2 || this.level == 2) {
            return "particles/items_fx/bladestorm_mail.vpcf";
        } else {
            return "particles/items_fx/blademail.vpcf";
        }
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_blademail.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.level = this.GetItemPlus().GetLevel();
        this.lacerate_pct = this.GetItemPlus().GetSpecialValueFor("lacerate_pct");
        this.lacerate_duration = this.GetItemPlus().GetSpecialValueFor("lacerate_duration");
        this.justice_pct = this.GetItemPlus().GetSpecialValueFor("justice_pct");
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("DOTA_Item.BladeMail.Deactivate");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        let attacker = keys.attacker;
        let target = keys.unit;
        let original_damage = keys.original_damage;
        let damage_type = keys.damage_type;
        let damage_flags = keys.damage_flags;
        if (keys.unit == this.GetParentPlus() && !keys.attacker.IsBuilding() && keys.attacker.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) {
            if (!keys.unit.IsOther()) {
                EmitSoundOnClient("DOTA_Item.BladeMail.Damage", keys.attacker.GetPlayerOwner());
                let damageTable = {
                    victim: keys.attacker,
                    damage: keys.original_damage,
                    damage_type: keys.damage_type,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                    attacker: this.GetParentPlus(),
                    ability: this.GetItemPlus()
                }
                let reflectDamage = ApplyDamage(damageTable);
                if (reflectDamage * this.lacerate_pct * 0.01 >= 1) {
                    let lacerate_modifier = keys.attacker.AddNewModifier(this.GetParentPlus(), this.GetItemPlus(), "modifier_item_imba_blade_mail_lacerate", {
                        duration: this.lacerate_duration * (1 - keys.attacker.GetStatusResistance())
                    });
                    if (lacerate_modifier) {
                        lacerate_modifier.SetStackCount(math.min(lacerate_modifier.GetStackCount() + (reflectDamage * this.lacerate_pct * 0.01), lacerate_modifier.GetStackCount() + keys.attacker.GetMaxHealth() - 1));
                        // if (keys.attacker.CalculateStatBonus) {
                        //     keys.attacker.CalculateStatBonus(true);
                        // }
                        if (keys.attacker.GetMaxHealth() <= 0) {
                            lacerate_modifier.Destroy();
                        }
                    }
                }
            }
            if (((this.GetItemPlus() && this.GetItemPlus().GetLevel() >= 2) || this.level >= 2) && keys.attacker.GetPlayerOwner() && keys.attacker.GetPlayerOwner().GetAssignedHero() && keys.attacker != keys.attacker.GetPlayerOwner().GetAssignedHero()) {
                EmitSoundOnClient("DOTA_Item.BladeMail.Damage", keys.attacker.GetPlayerOwner());
                let damageTable = {
                    victim: keys.attacker.GetPlayerOwner().GetAssignedHero(),
                    damage: keys.original_damage * this.justice_pct * 0.01,
                    damage_type: keys.damage_type,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                    attacker: this.GetParentPlus(),
                    ability: this.GetItemPlus()
                }
                let reflectDamage = ApplyDamage(damageTable);
                if (reflectDamage * this.lacerate_pct * 0.01 >= 1) {
                    let lacerate_modifier = keys.attacker.GetPlayerOwner().GetAssignedHero().AddNewModifier(this.GetParentPlus(), this.GetItemPlus(), "modifier_item_imba_blade_mail_lacerate", {
                        duration: this.lacerate_duration * (1 - keys.attacker.GetStatusResistance())
                    });
                    if (lacerate_modifier) {
                        lacerate_modifier.SetStackCount(math.min(lacerate_modifier.GetStackCount() + (reflectDamage * this.lacerate_pct * 0.01), lacerate_modifier.GetStackCount() + keys.attacker.GetMaxHealth() - 1));
                        if (keys.attacker.GetPlayerOwner().GetAssignedHero().CalculateStatBonus) {
                            keys.attacker.GetPlayerOwner().GetAssignedHero().CalculateStatBonus(true);
                        }
                        if (keys.attacker.GetPlayerOwner().GetAssignedHero().GetMaxHealth() <= 0) {
                            lacerate_modifier.Destroy();
                        }
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_blade_mail_lacerate extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/econ/items/bloodseeker/bloodseeker_ti7/bloodseeker_ti7_thirst_owner_smoke_dark.vpcf";
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().GetMaxHealth() <= 0) {
            this.GetParentPlus().SetMaxHealth(this.GetParentPlus().GetBaseMaxHealth());
            this.GetParentPlus().SetHealth(1);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS)
    CC_GetModifierExtraHealthBonus(): number {
        return this.GetStackCount() * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_item_imba_blade_mail_passive extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public return_damage: number;
    public return_damage_pct: number;
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.parent = this.GetParentPlus();
        this.return_damage = this.GetItemPlus().GetSpecialValueFor("passive_return_damage");
        this.return_damage_pct = this.GetItemPlus().GetSpecialValueFor("passive_return_damage_pct");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (params.unit == this.GetParentPlus() && !params.attacker.IsBuilding() && params.attacker.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && bit.band(params.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS && bit.band(params.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION && params.damage_type == 1) {
            let damage = this.return_damage + (params.damage / 100 * this.return_damage_pct);
            ApplyDamage({
                victim: params.attacker,
                attacker: params.unit,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION
            });
        }
    }
}
