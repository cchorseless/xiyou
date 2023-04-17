
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// 自定义
@registerAbility()
export class item_imba_angelic_alliance extends BaseItem_Plus {
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET;
    }
    IsRefreshable(): boolean {
        return true;
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_angelic_alliance_passive_effect";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        let duration = this.GetSpecialValueFor("duration");
        if (target == this.GetCasterPlus()) {
            duration = this.GetSpecialValueFor("duration_self");
        }
        if (target.GetTeam() != caster.GetTeam()) {
            if (target.TriggerSpellAbsorb(this)) {
                return;
            }
        }
        if (target.IsMagicImmune()) {
            return;
        }
        target.EmitSound("Imba.AngelicAllianceCast");
        if (target.GetTeamNumber() == caster.GetTeamNumber()) {
            if (target != caster) {
                target.AddNewModifier(caster, this, "modifier_imba_angelic_alliance_buff", {
                    duration: duration
                });
            } else {
                target.AddNewModifier(caster, this, "modifier_imba_angelic_alliance_buff_self", {
                    duration: duration
                });
            }
        } else {
            if (target.TriggerSpellAbsorb(this)) {
                return;
            }
            target.AddNewModifier(caster, this, "modifier_imba_angelic_alliance_debuff", {
                duration: duration * (1 - target.GetStatusResistance())
            });
        }
        if (target != this.GetCasterPlus()) {
            caster.AddNewModifier(caster, this, "modifier_imba_angelic_alliance_debuff_caster", {
                duration: duration
            });
        }
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (target.IsBuilding()) {
            return UnitFilterResult.UF_FAIL_BUILDING;
        }
        if (IsServer()) {
            return UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
        }
    }
}
@registerModifier()
export class modifier_imba_angelic_alliance_passive_effect extends BaseModifier_Plus {
    public bonus_strength: number;
    public bonus_agility: number;
    public bonus_intellect: number;
    public armor_change: any;
    public movement_speed: number;
    public bonus_evasion: number;
    public bonus_mana_regen: number;
    public bonus_damage: number;
    public status_resistance: any;
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
        this.bonus_strength = this.GetItemPlus().GetSpecialValueFor("bonus_strength");
        this.bonus_agility = this.GetItemPlus().GetSpecialValueFor("bonus_agility");
        this.bonus_intellect = this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
        this.armor_change = this.GetItemPlus().GetSpecialValueFor("armor_change");
        this.movement_speed = this.GetItemPlus().GetSpecialValueFor("movement_speed");
        this.bonus_evasion = this.GetItemPlus().GetSpecialValueFor("bonus_evasion");
        this.bonus_mana_regen = this.GetItemPlus().GetSpecialValueFor("bonus_mana_regen");
        this.bonus_damage = this.GetItemPlus().GetSpecialValueFor("bonus_damage");
        this.status_resistance = this.GetItemPlus().GetSpecialValueFor("status_resistance");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT,
            6: GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT,
            7: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            8: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            9: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING,
            10: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_strength");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_agility");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("armor_change");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("movement_speed");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
    CC_GetModifierEvasion_Constant(p_0: ModifierAttackEvent,): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_evasion");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_mana_regen");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_damage");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("status_resistance");
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (this.GetItemPlus()) {
            if (this.GetCasterPlus().HasModifier("modifier_imba_angelic_alliance_debuff_caster")) {
                return undefined;
            }
            if (this.GetCasterPlus().HasModifier("modifier_imba_angelic_alliance_passive_disarm_cooldown")) {
                return undefined;
            }
            if (keys.attacker.IsBuilding() || keys.target.IsBuilding() || keys.attacker.IsCreep()) {
                return undefined;
            }
            if (this.GetCasterPlus() == keys.target && !keys.target.IsIllusion() && GFuncRandom.PRD(this.GetItemPlus().GetSpecialValueFor("passive_disarm_chance"), this)) {
                if (keys.attacker.IsMagicImmune()) {
                    return;
                }
                if (keys.attacker.HasModifier("modifier_imba_angelic_alliance_passive_disarm")) {
                    return;
                }
                keys.attacker.AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_imba_angelic_alliance_passive_disarm", {
                    duration: this.GetItemPlus().GetSpecialValueFor("passive_disarm_duration") * (1 - keys.attacker.GetStatusResistance())
                });
                keys.attacker.EmitSound("DOTA_Item.HeavensHalberd.Activate");
            }
        }
    }
}
@registerModifier()
export class modifier_imba_angelic_alliance_debuff extends BaseModifier_Plus {
    public armor_change: any;
    public target_movement_speed: number;
    public target_attack_speed: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetTexture(): string {
        return "imba/angelic_alliance";
    }
    GetEffectName(): string {
        return "particles/item/angelic_alliance/angelic_alliance_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.armor_change = this.GetItemPlus().GetSpecialValueFor("armor_change") * (-1);
        this.target_movement_speed = this.GetItemPlus().GetSpecialValueFor("target_movement_speed") * (-1);
        this.target_attack_speed = this.GetItemPlus().GetSpecialValueFor("target_attack_speed") * (-1);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_INVISIBLE]: false
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.armor_change;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.target_movement_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.target_attack_speed;
    }
}
@registerModifier()
export class modifier_imba_angelic_alliance_buff extends BaseModifier_Plus {
    public armor_change: any;
    public target_movement_speed: number;
    public target_attack_speed: number;
    public target_status_resistance: any;
    public target_evasion: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetTexture(): string {
        return "imba/angelic_alliance";
    }
    GetEffectName(): string {
        return "particles/item/angelic_alliance/angelic_alliance_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.armor_change = this.GetItemPlus().GetSpecialValueFor("armor_change");
        this.target_movement_speed = this.GetItemPlus().GetSpecialValueFor("target_movement_speed");
        this.target_attack_speed = this.GetItemPlus().GetSpecialValueFor("target_attack_speed");
        this.target_status_resistance = this.GetItemPlus().GetSpecialValueFor("target_status_resistance");
        this.target_evasion = this.GetItemPlus().GetSpecialValueFor("target_evasion");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING,
            5: GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        if (this.GetParentPlus() != this.GetCasterPlus()) {
            return this.armor_change;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.GetParentPlus() != this.GetCasterPlus()) {
            return this.target_movement_speed;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (this.GetParentPlus() != this.GetCasterPlus()) {
            return this.target_attack_speed;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.target_status_resistance;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
    CC_GetModifierEvasion_Constant(p_0: ModifierAttackEvent,): number {
        if (this.GetParentPlus() != this.GetCasterPlus()) {
            return this.target_evasion;
        }
    }
}
@registerModifier()
export class modifier_imba_angelic_alliance_buff_self extends BaseModifier_Plus {
    public target_status_resistance: any;
    GetTexture(): string {
        return "imba/angelic_alliance";
    }
    GetEffectName(): string {
        return "particles/items2_fx/sange_active.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.target_status_resistance = this.GetItemPlus().GetSpecialValueFor("target_status_resistance");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.target_status_resistance;
    }
}
@registerModifier()
export class modifier_imba_angelic_alliance_debuff_caster extends BaseModifier_Plus {
    public armor_change: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/items2_fx/medallion_of_courage.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.armor_change = this.GetItemPlus().GetSpecialValueFor("armor_change") * (-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.armor_change;
    }
}
@registerModifier()
export class modifier_imba_angelic_alliance_passive_disarm extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_disarm.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        };
    }
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_imba_angelic_alliance_passive_disarm_cooldown", {
            duration: this.GetItemPlus().GetSpecialValueFor("passive_disarm_cooldown")
        });
    }
}
@registerModifier()
export class modifier_imba_angelic_alliance_passive_disarm_cooldown extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetTexture(): string {
        return "imba/angelic_alliance";
    }
}
