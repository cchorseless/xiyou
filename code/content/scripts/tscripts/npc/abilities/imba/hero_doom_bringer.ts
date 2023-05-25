
import { GameFunc } from "../../../GameFunc";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

@registerAbility()
export class imba_doom_bringer_devour extends BaseAbility_Plus { }
@registerAbility()
export class imba_doom_bringer_scorched_earth extends BaseAbility_Plus { }
@registerAbility()
export class imba_doom_bringer_infernal_blade extends BaseAbility_Plus { }
@registerAbility()
export class imba_doom_bringer_doom extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetAbilityTextureName(): string {
        return "doom_bringer_doom";
    }
    GetAOERadius(): number {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_doom_bringer_doom_handler", this.GetCasterPlus()) == 0) {
            return this.GetSpecialValueFor("aoe_radius");
        } else {
            return 0;
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_doom_bringer_doom_handler", this.GetCasterPlus()) == 0) {
            return super.GetCastRange(location, target);
        } else {
            return this.GetSpecialValueFor("aura_radius");
        }
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_doom_bringer_doom_handler", this.GetCasterPlus()) == 0) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AURA + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_doom_bringer_doom_handler";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        if (this.GetAutoCastState()) {
            caster.AddNewModifier(caster, this, "modifier_imba_doom_bringer_doom", {
                duration: this.GetSpecialValueFor("self_duration") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_unique_doom_7")
            });
        } else {
            if (!this.GetCursorTarget().TriggerSpellAbsorb(this)) {
                let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, this.GetSpecialValueFor("aoe_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_doom_bringer_doom_enemies", {
                        duration: (this.GetSpecialValueFor("duration") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_unique_doom_7")) * (1 - enemy.GetStatusResistance())
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_doom_bringer_doom extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return this.GetAbilityPlus().GetAbilityTargetTeam();
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return this.GetAbilityPlus().GetAbilityTargetType();
    }
    GetModifierAura(): string {
        return "modifier_imba_doom_bringer_doom_enemies";
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return this.GetAbilityPlus().GetAbilityTargetFlags();
    }
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("aura_radius");
    }
    GetAuraDuration(): number {
        return 0.25;
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (IsServer()) {
            if (this.GetParentPlus() == target) {
                return true;
            }
        }
        return false;
    }
    BeCreated(p_0: any,): void {
        EmitSoundOn("Hero_DoomBringer.Doom", this.GetParentPlus());
    }
    GetEffectName(): string {
        return "particles/units/hero/doom_bringer/doom/doom_bringer_doom_self.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_doom_self.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 4;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        }
        return Object.values(decFuns);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.GetSpecialValueFor("armor_bonus");
    }
    BeDestroy(): void {
        StopSoundOn("Hero_DoomBringer.Doom", this.GetParentPlus());
    }
}
@registerModifier()
export class modifier_imba_doom_bringer_doom_handler extends BaseModifier_Plus {

    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ORDER
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (!IsServer() || keys.unit != this.GetParentPlus() || keys.order_type != dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO || keys.ability != this.GetAbilityPlus()) {
            return;
        }
        if (this.GetAbilityPlus().GetAutoCastState()) {
            this.SetStackCount(0);
        } else {
            this.SetStackCount(1);
        }
    }
}
@registerModifier()
export class modifier_imba_doom_bringer_doom_enemies extends BaseModifier_Plus {
    public deniable_pct: number;
    public duration: number;
    public damage: number;
    public reentered: any;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    Init(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.deniable_pct = this.GetSpecialValueFor("deniable_pct");
            this.duration = this.GetSpecialValueFor("duration") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_unique_doom_7");
            this.damage = this.GetSpecialValueFor("damage") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_unique_doom_5");
        } else {
            this.deniable_pct = 25;
            this.duration = this.GetSpecialValueFor("duration");
            this.damage = 0;
        }
        if (!IsServer()) {
            return;
        }
        EmitSoundOn("Hero_DoomBringer.Doom", this.GetParentPlus());
        this.reentered = undefined;
        this.OnIntervalThink();
        this.StartIntervalThink(1.0 * (1 - this.GetParentPlus().GetStatusResistance()));
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_doom_bringer/doom_bringer_doom.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }

    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        StopSoundOn("Hero_DoomBringer.Doom", this.GetParentPlus());
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_doom.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 4;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state: Partial<Record<modifierstate, boolean>> = {
            [modifierstate.MODIFIER_STATE_MUTED]: true,
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        }
        if (this.GetParentPlus().GetHealthPercent() <= this.deniable_pct) {
            state[modifierstate.MODIFIER_STATE_SPECIALLY_DENIABLE] = true;
        }
        return state;
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            ApplyDamage({
                victim: this.GetParentPlus(),
                attacker: this.GetCasterPlus(),
                damage: this.damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                ability: this.GetAbilityPlus()
            });
            this.reentered = false;
            this.StartIntervalThink(1.0 * (1 - this.GetParentPlus().GetStatusResistance()));
        }
    }
}



