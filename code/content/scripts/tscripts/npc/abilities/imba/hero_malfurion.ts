
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_malfurion_entrangling_roots extends BaseAbility_Plus {
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        if (!target.TriggerSpellAbsorb(this)) {
            target.EmitSound("Hero_Treant.LeechSeed.Target");
            target.AddNewModifier(this.GetCursorTarget(), this, "modifier_imba_entrangling_roots", {
                duration: this.GetSpecialValueFor("duration") - 0.01
            });
        }
    }
}
@registerModifier()
export class modifier_imba_entrangling_roots extends BaseModifier_Plus {
    IgnoreTenacity() {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_treant/treant_overgrowth_vines.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        };
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.OnIntervalThink();
            this.StartIntervalThink(1.0);
        }
    }
    OnIntervalThink(): void {
        ApplyDamage({
            victim: this.GetParentPlus(),
            attacker: this.GetAbilityPlus().GetCasterPlus(),
            damage: this.GetSpecialValueFor("dmg_per_sec"),
            damage_type: this.GetAbilityPlus().GetAbilityDamageType()
        });
    }
}
@registerAbility()
export class imba_malfurion_rejuvenation extends BaseAbility_Plus {
    OnAbilityPhaseStart(): boolean {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2);
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2);
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Warlock.ShadowWordCastGood");
        let particle = undefined;
        for (const [_, ally] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, this.GetSpecialValueFor("radius"), this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false))) {
            particle = ResHelper.CreateParticleEx("particles/econ/items/leshrac/leshrac_tormented_staff_retro/leshrac_split_retro_sparks_tormented.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ally);
            ParticleManager.ReleaseParticleIndex(particle);
            ally.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_rejuvenation", {
                duration: this.GetSpecialValueFor("duration")
            });
        }
    }
}
@registerModifier()
export class modifier_imba_rejuvenation extends BaseModifier_Plus {
    public heal_per_sec: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.heal_per_sec = this.GetSpecialValueFor("heal_per_sec") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_malfurion_5");
            if (this.GetParentPlus().IsBuilding() || this.GetParentPlus().GetUnitName().includes("living_tower")) {
                this.heal_per_sec = this.heal_per_sec / 100 * this.GetSpecialValueFor("heal_per_sec_building_pct");
            } else if (!this.GetParentPlus().IsRealUnit()) {
                this.heal_per_sec = this.heal_per_sec / 100 * this.GetSpecialValueFor("heal_per_sec_creep_pct");
            }
            this.StartIntervalThink(1.0);
        }
    }
    OnIntervalThink(): void {
        this.GetParentPlus().ApplyHeal(this.heal_per_sec, this.GetAbilityPlus());
    }
    GetEffectName(): string {
        return "particles/econ/events/ti6/bottle_ti6.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerAbility()
export class imba_malfurion_mark_of_the_claw extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_mark_of_the_claw";
    }
}
@registerModifier()
export class modifier_imba_mark_of_the_claw extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(kv: ModifierAttackEvent): void {
        if (IsServer()) {
            if (this.GetParentPlus() == kv.attacker && kv.attacker.GetTeamNumber() != kv.target.GetTeamNumber()) {
                if (kv.target.IsBuilding()) {
                    return;
                }
                if (GFuncRandom.PRD(this.GetSpecialValueFor("chance"), this)) {
                    let base_damage = kv.damage * (this.GetSpecialValueFor("bonus_damage_pct") / 100);
                    let splash_damage = base_damage * (this.GetSpecialValueFor("splash_damage_pct") / 100);
                    ApplyDamage({
                        victim: kv.target,
                        attacker: kv.attacker,
                        damage: base_damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
                    });
                    kv.attacker.EmitSound("Imba.UrsaDeepStrike");
                    let coup_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_assassin/phantom_assassin_crit_impact.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, kv.attacker);
                    ParticleManager.SetParticleControlEnt(coup_pfx, 0, kv.target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", kv.target.GetAbsOrigin(), true);
                    ParticleManager.SetParticleControlEnt(coup_pfx, 1, kv.target, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_origin", kv.target.GetAbsOrigin(), true);
                    ParticleManager.ReleaseParticleIndex(coup_pfx);
                    DoCleaveAttack(kv.attacker, kv.target, this.GetAbilityPlus(), splash_damage, this.GetSpecialValueFor("cleave_start"), this.GetSpecialValueFor("cleave_end"), this.GetSpecialValueFor("radius"), "particles/econ/items/sven/sven_ti7_sword/sven_ti7_sword_spell_great_cleave_gods_strength.vpcf");
                }
            }
        }
    }
}
@registerAbility()
export class imba_malfurion_strength_of_the_wild extends BaseAbility_Plus {
    IsInnateAbility() {
        return true;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_malfurion_strength_of_the_wild";
    }
}
@registerModifier()
export class modifier_imba_malfurion_strength_of_the_wild extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierDamageOutgoing_Percentage(keys: ModifierAttackEvent): number {
        if (keys.target && keys.target.IsRealHero && !keys.target.IsRealUnit() && !this.GetParentPlus().PassivesDisabled()) {
            return this.GetSpecialValueFor("bonus_damage_percentage");
        }
    }
}
@registerAbility()
export class imba_malfurion_living_tower extends BaseAbility_Plus {
    public living_tower: any;
    OnAbilityPhaseStart(): boolean {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_4);
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_4);
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let tower_name = ["", "radiant", "dire"]
            let duration = this.GetSpecialValueFor("duration");
            if (!this.GetCasterPlus().HasScepter()) {
                duration = this.GetSpecialValueFor("scepter_duration")
            }
            this.living_tower = this.GetCasterPlus().CreateSummon("npc_imba_malfurion_living_tower_" + tower_name[this.GetCasterPlus().GetTeamNumber() - 1], this.GetCursorPosition(), duration, true);
            this.living_tower.AddNewModifier(this.living_tower, this, "modifier_imba_malfurion_living_tower", {});
            this.living_tower.SetControllableByPlayer(this.GetCasterPlus().GetPlayerID(), false);

            if (!this.GetCasterPlus().HasScepter()) {
                this.living_tower.SetMaxHealth(this.GetSpecialValueFor("health"));
                this.living_tower.SetHealth(this.GetSpecialValueFor("health"));
                this.living_tower.SetBaseMaxHealth(this.GetSpecialValueFor("health"));
            } else {
                this.living_tower.SetMaxHealth(this.GetSpecialValueFor("scepter_health"));
                this.living_tower.SetHealth(this.GetSpecialValueFor("scepter_health"));
                this.living_tower.SetBaseMaxHealth(this.GetSpecialValueFor("scepter_health"));
            }
            this.living_tower.SetBaseDamageMin(this.GetSpecialValueFor("damage") * 0.9);
            this.living_tower.SetBaseDamageMax(this.GetSpecialValueFor("damage") * 1.1);
            this.living_tower.SetAcquisitionRange(this.GetSpecialValueFor("attack_range"));
            this.living_tower.SetDeathXP(this.GetSpecialValueFor("xp_bounty"));
            this.living_tower.SetMinimumGoldBounty(this.GetSpecialValueFor("gold_bounty"));
            this.living_tower.SetMaximumGoldBounty(this.GetSpecialValueFor("gold_bounty"));
            this.living_tower.EmitSound("Hero_Treant.Overgrowth.Cast");
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_malfurion_1")) {
                this.living_tower.AddAbility("imba_tower_aegis").SetLevel(this.GetLevel());
            }
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_malfurion_2")) {
                this.living_tower.AddAbility("imba_tower_atrophy").SetLevel(this.GetLevel());
            }
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_malfurion_3")) {
                this.living_tower.AddAbility("imba_tower_soul_leech").SetLevel(this.GetLevel());
            }
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_malfurion_4")) {
                this.living_tower.AddAbility("imba_tower_barrier").SetLevel(this.GetLevel());
            }
        }
    }
}
@registerModifier()
export class modifier_imba_malfurion_living_tower extends BaseModifier_Plus {
    public attack_speed: number;
    public attack_range: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_START,
            4: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
            5: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    GetEffectName(): string {
        if (this.GetStackCount() == 2) {
            return "particles/econ/world/towers/rock_golem/radiant_rock_golem_ambient.vpcf";
        } else if (this.GetStackCount() == 3) {
            return "particles/econ/world/towers/rock_golem/dire_rock_golem_ambient.vpcf";
        }
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CUSTOM_TOWER_IDLE;
    }
    BeCreated(p_0: any,): void {
        this.attack_speed = this.GetSpecialValueFor("attack_speed");
        this.attack_range = this.GetSpecialValueFor("attack_range");
        if (!IsServer()) {
            return;
        }
        let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_treant/treant_overgrowth_vines.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
        ParticleManager.ReleaseParticleIndex(pfx);
        this.SetStackCount(this.GetCasterPlus().GetTeamNumber());
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.GetParentPlus()) {
            this.GetParentPlus().EmitSound("Tree.GrowBack");
            this.GetParentPlus().StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_CUSTOM_TOWER_ATTACK, this.GetParentPlus().GetAttacksPerSecond());
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.GetParentPlus()) {
            this.GetParentPlus().StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_CUSTOM_TOWER_DIE, 0.75);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        return this.attack_range;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_malfurion_1 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_malfurion_2 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_malfurion_5 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_malfurion_4 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_malfurion_3 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
