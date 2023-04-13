
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 纷争面纱
@registerAbility()
export class item_imba_veil_of_discord extends BaseItem_Plus {
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target_loc = this.GetCursorPosition();
        let particle = "particles/items2_fx/veil_of_discord.vpcf";
        caster.EmitSound("DOTA_Item.VeilofDiscord.Activate");
        let particle_fx = ResHelper.CreateParticleEx(particle, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.SetParticleControl(particle_fx, 0, target_loc);
        ParticleManager.SetParticleControl(particle_fx, 1, Vector(this.GetSpecialValueFor("debuff_radius"), 1, 1));
        ParticleManager.ReleaseParticleIndex(particle_fx);
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target_loc, undefined, this.GetSpecialValueFor("debuff_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, 0, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            enemy.AddNewModifier(caster, this, "modifier_veil_active_debuff", {
                duration: this.GetSpecialValueFor("resist_debuff_duration") * (1 - enemy.GetStatusResistance())
            });
        }
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("debuff_radius");
    }
    GetIntrinsicModifierName(): string {
        return "modifier_veil_passive";
    }
}
@registerModifier()
export class modifier_veil_active_debuff extends BaseModifier_Plus {
    public spell_amp: any;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
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
        this.spell_amp = this.GetItemPlus().GetSpecialValueFor("spell_amp");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(keys: ModifierAttackEvent): number {
        if (keys.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_SPELL) {
            return this.spell_amp;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.spell_amp;
    }
    GetEffectName(): string {
        return "particles/items2_fx/veil_of_discord_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerModifier()
export class modifier_veil_passive extends BaseModifier_Plus {
    public bonus_all_stats: number;
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
    IsAura(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        let ability = this.GetItemPlus();
        if (IsServer()) {
            this.GetParentPlus().AddNewModifier(this.GetParentPlus(), ability, "modifier_veil_buff_aura", {});
        }
        if (this.GetParentPlus().IsRealUnit() && ability) {
            this.bonus_all_stats = ability.GetSpecialValueFor("bonus_all_stats");
            this.CheckUnique(true);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.bonus_all_stats;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.bonus_all_stats;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.bonus_all_stats;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_veil_debuff_aura_modifier";
    }
    GetAuraRadius(): number {
        return this.GetItemPlus().GetSpecialValueFor("aura_radius");
    }
    BeDestroy(): void {
        if (IsServer() && this && !this.IsNull() && this.GetParentPlus() && !this.GetParentPlus().IsNull()) {
            this.GetParentPlus().RemoveModifierByName("modifier_veil_buff_aura");
        }
    }
}
@registerModifier()
export class modifier_veil_debuff_aura_modifier extends BaseModifier_Plus {
    public aura_resist: any;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.aura_resist = this.GetItemPlus().GetSpecialValueFor("aura_resist");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.aura_resist;
    }
}
@registerModifier()
export class modifier_veil_buff_aura extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_veil_buff_aura_modifier";
    }
    GetAuraRadius(): number {
        return this.GetItemPlus().GetSpecialValueFor("aura_radius");
    }
}
@registerModifier()
export class modifier_veil_buff_aura_modifier extends BaseModifier_Plus {
    public aura_mana_regen: any;
    public aura_spell_power: any;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.aura_mana_regen = this.GetItemPlus().GetSpecialValueFor("aura_mana_regen");
        this.aura_spell_power = this.GetItemPlus().GetSpecialValueFor("aura_spell_power");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        return this.aura_mana_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return this.aura_spell_power;
    }
}
