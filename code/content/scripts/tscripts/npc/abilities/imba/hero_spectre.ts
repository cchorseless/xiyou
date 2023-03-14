
import { GameFunc } from "../../../GameFunc";
import { AoiHelper } from "../../../helper/AoiHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class imba_spectre_reality extends BaseAbility_Plus {
    GetAssociatedSecondaryAbilities(): string {
        return "imba_spectre_haunt";
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    OnSpellStart(): void {
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_CLOSEST, false);
        let self_haunt_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_spectre_haunt_self", this.GetCasterPlus()) as modifier_imba_spectre_haunt_self;
        if (self_haunt_modifier) {
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy.FindModifierByNameAndCaster("modifier_imba_spectre_haunt", this.GetCasterPlus()) && enemy != self_haunt_modifier.current_target) {
                    FindClearSpaceForUnit(this.GetCasterPlus(), enemy.GetAbsOrigin() + RandomVector(256) as Vector, false);
                    this.GetCasterPlus().FaceTowards(enemy.GetAbsOrigin());
                    this.GetCasterPlus().EmitSound("Hero_Spectre.Reality");
                    self_haunt_modifier.current_target = enemy;
                    return;
                }
            }
        }
    }
}
@registerAbility()
export class imba_spectre_haunt_single extends BaseAbility_Plus {
    OnInventoryContentsChanged(): void {
        if (this.GetCasterPlus().HasScepter()) {
            this.SetHidden(false);
        } else {
            this.SetHidden(true);
        }
    }
    OnHeroCalculateStatBonus(): void {
        this.OnInventoryContentsChanged();
    }
    OnSpellStart(): void {
        if (!this.GetCursorTarget().TriggerSpellAbsorb(this)) {
            this.GetCasterPlus().EmitSound("Hero_Spectre.HauntCast");
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_spectre_haunt_self", {
                duration: this.GetSpecialValueFor("duration")
            });
            this.GetCursorTarget().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_spectre_haunt", {
                duration: this.GetSpecialValueFor("duration")
            });
        }
    }
}
@registerAbility()
export class imba_spectre_haunt extends BaseAbility_Plus {
    GetAssociatedPrimaryAbilities(): string {
        return "imba_spectre_reality";
    }
    OnUpgrade(): void {
        let reality_ablity = this.GetCasterPlus().findAbliityPlus<imba_spectre_reality>("imba_spectre_reality");
        if (reality_ablity && !reality_ablity.IsTrained() && this.GetLevel() >= 1) {
            reality_ablity.SetLevel(1);
            reality_ablity.SetActivated(true);
        }
        let shadow_step_ability = this.GetCasterPlus().findAbliityPlus<imba_spectre_haunt_single>("imba_spectre_haunt_single");
        if (shadow_step_ability) {
            shadow_step_ability.SetLevel(this.GetLevel());
        }
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Spectre.HauntCast");
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_spectre_haunt_self", {
            duration: this.GetSpecialValueFor("duration")
        });
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_spectre_haunt", {
                duration: this.GetSpecialValueFor("duration")
            });
        }
    }
}
@registerModifier()
export class modifier_imba_spectre_haunt extends BaseModifier_Plus {
    public illusion_damage_outgoing: number;
    public attack_delay: number;
    public spawn_distance: number;
    public travel_speed: number;
    public self_haunt_modifier: any;
    public location: any;
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    IgnoreTenacity() {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_spectre/spectre_ambient.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.illusion_damage_outgoing = this.GetSpecialValueFor("illusion_damage_outgoing");
        this.attack_delay = this.GetSpecialValueFor("attack_delay");
        this.spawn_distance = this.GetSpecialValueFor("spawn_distance");
        this.travel_speed = this.GetSpecialValueFor("travel_speed");
        if (!IsServer()) {
            return;
        }
        this.self_haunt_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_spectre_haunt_self", this.GetCasterPlus());
        this.location = this.GetParentPlus().GetAbsOrigin() + RandomVector(this.spawn_distance);
        this.GetParentPlus().EmitSound("Hero_Spectre.Haunt");
        let death_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_spectre/spectre_death.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
        ParticleManager.SetParticleControl(death_particle, 0, this.location);
        ParticleManager.ReleaseParticleIndex(death_particle);
        this.StartIntervalThink(this.attack_delay);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if ((this.GetParentPlus().GetAbsOrigin() - this.location as Vector).Length2D() <= this.travel_speed) {
            this.location = this.GetParentPlus().GetAbsOrigin();
            if (!this.GetParentPlus().IsInvisible() && !this.GetParentPlus().IsInvulnerable() && !this.GetParentPlus().IsOutOfGame() && !this.GetParentPlus().IsAttackImmune() && this.GetCasterPlus().IsAlive() && (this.self_haunt_modifier && this.self_haunt_modifier.current_target != this.GetParentPlus()) && !AoiHelper.IsNearFountain(this.GetParentPlus().GetAbsOrigin(), 1200)) {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_spectre_haunt_reduce", {
                    illusion_damage_outgoing: this.illusion_damage_outgoing
                });
                this.GetCasterPlus().PerformAttack(this.GetParentPlus(), true, true, true, true, false, false, true);
                this.GetCasterPlus().RemoveModifierByNameAndCaster("modifier_imba_spectre_haunt_reduce", this.GetCasterPlus());
            }
        } else {
            this.location = this.location + (this.GetParentPlus().GetAbsOrigin() - this.location as Vector).Normalized() * this.travel_speed;
        }
        if ((this.self_haunt_modifier && this.self_haunt_modifier.current_target != this.GetParentPlus())) {
            let death_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_spectre/spectre_death.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
            ParticleManager.SetParticleControl(death_particle, 0, this.location);
            ParticleManager.ReleaseParticleIndex(death_particle);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_PROVIDES_VISION]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE)
    CC_GetBonusVisionPercentage(): number {
        if (this.GetElapsedTime() <= (this.GetSpecialValueFor("attack_delay") || this.attack_delay)) {
            return -100;
        }
    }
}
@registerModifier()
export class modifier_imba_spectre_haunt_self extends BaseModifier_Plus {
    public current_target: any;
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    Init(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.current_target = undefined;
        let death_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_spectre/spectre_death_orb.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.ReleaseParticleIndex(death_particle);
    }

}
@registerModifier()
export class modifier_imba_spectre_haunt_reduce extends BaseModifier_Plus {
    public illusion_damage_outgoing: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.illusion_damage_outgoing = params.illusion_damage_outgoing;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierTotalDamageOutgoing_Percentage(keys: ModifierAttackEvent): number {
        if (!IsServer()) {
            return;
        }
        if (!keys.no_attack_cooldown && keys.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_SPELL && keys.damage_flags == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION) {
            return -100;
        } else {
            return this.illusion_damage_outgoing + this.GetCasterPlus().GetTalentValue("special_bonus_imba_unique_spectre_4");
        }
    }
}
