
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

function SetArrowAttackProjectile(caster: IBaseNpc_Plus, searing_arrows: boolean) {
    let skadi_modifier = "modifier_item_imba_skadi";
    let deso_modifier = "modifier_item_imba_desolator";
    let morbid_modifier = "modifier_imba_morbid_mask";
    let mom_modifier = "modifier_imba_mask_of_madness";
    let satanic_modifier = "modifier_imba_satanic";
    let vladimir_modifier = "modifier_item_imba_vladmir";
    let vladimir_2_modifier = "modifier_item_imba_vladmir_blood";
    let skadi_projectile = "particles/items2_fx/skadi_projectile.vpcf";
    let deso_projectile = "particles/items_fx/desolator_projectile.vpcf";
    let deso_skadi_projectile = "particles/item/desolator/desolator_skadi_projectile_2.vpcf";
    let lifesteal_projectile = "particles/item/lifesteal_mask/lifesteal_particle.vpcf";
    let basic_arrow = "particles/units/heroes/hero_clinkz/clinkz_base_attack.vpcf";
    let searing_arrow = "particles/units/heroes/hero_clinkz/clinkz_searing_arrow.vpcf";
    let searing_lifesteal_projectile = "particles/hero/clinkz/searing_lifesteal/searing_lifesteal_arrow.vpcf";
    let searing_skadi_projectile = "particles/hero/clinkz/searing_skadi/searing_skadi_arrow.vpcf";
    let searing_deso_projectile = "particles/hero/clinkz/searing_desolator/searing_desolator_arrow.vpcf";
    let searing_deso_skadi_projectile = "particles/hero/clinkz/searing_skadi_desolator/searing_skadi_desolator_arrow.vpcf";
    let searing_lifesteal_skadi_projectile = "particles/hero/clinkz/searing_skadi_lifesteal/searing_skadi_steal_arrow.vpcf";
    let searing_lifesteal_deso_projectile = "particles/hero/clinkz/searing_deso_lifesteal/searing_deso_lifesteal.vpcf";
    let searing_lifesteal_deso_skadi_projectile = "particles/hero/clinkz/searing_skadi_deso_steal/searing_skadi_deso_steal_arrow.vpcf";
    let has_lifesteal;
    let has_skadi;
    let has_desolator;
    if (caster.HasModifier(morbid_modifier) || caster.HasModifier(mom_modifier) || caster.HasModifier(satanic_modifier) || caster.HasModifier(vladimir_modifier) || caster.HasModifier(vladimir_2_modifier)) {
        has_lifesteal = true;
    }
    if (caster.HasModifier(skadi_modifier)) {
        has_skadi = true;
    }
    if (caster.HasModifier(deso_modifier)) {
        has_desolator = true;
    }
    if (searing_arrows) {
        if (has_desolator && has_skadi && has_lifesteal) {
            caster.SetRangedProjectileName(searing_lifesteal_deso_skadi_projectile);
            return;
        } else if (has_desolator && has_lifesteal) {
            caster.SetRangedProjectileName(searing_lifesteal_deso_projectile);
            return;
        } else if (has_skadi && has_desolator) {
            caster.SetRangedProjectileName(searing_deso_skadi_projectile);
            return;
        } else if (has_lifesteal && has_skadi) {
            caster.SetRangedProjectileName(searing_lifesteal_skadi_projectile);
            return;
        } else if (has_skadi) {
            caster.SetRangedProjectileName(searing_skadi_projectile);
            return;
        } else if (has_lifesteal) {
            caster.SetRangedProjectileName(searing_lifesteal_projectile);
            return;
        } else if (has_desolator) {
            caster.SetRangedProjectileName(searing_deso_projectile);
            return;
        } else {
            caster.SetRangedProjectileName(searing_arrow);
            return;
        }
    } else {
        if (has_skadi && has_desolator) {
            caster.SetRangedProjectileName(deso_skadi_projectile);
            return;
        } else if (has_skadi) {
            caster.SetRangedProjectileName(skadi_projectile);
            return;
        } else if (has_desolator) {
            caster.SetRangedProjectileName(deso_projectile);
            return;
        } else if (has_lifesteal) {
            caster.SetRangedProjectileName(lifesteal_projectile);
            return;
        } else {
            caster.SetRangedProjectileName(basic_arrow);
            return;
        }
    }
}

@registerAbility()
export class imba_clinkz_strafe extends BaseAbility_Plus {
    public time_remaining: number;
    GetAbilityTextureName(): string {
        return "clinkz_strafe";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetCooldown(level: number): number {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let duration = this.GetSpecialValueFor("duration") + caster.GetTalentValue("special_bonus_imba_clinkz_9");
            let modifier_mount = "modifier_imba_strafe_mount";
            if (this.time_remaining != undefined) {
                let time_remaining = this.time_remaining;
                this.time_remaining = undefined;
                return super.GetCooldown(level) - (duration - math.max(time_remaining, 0));
            }
        }
        return super.GetCooldown(level);
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        let caster = this.GetCasterPlus();
        let modifier_mount = "modifier_imba_strafe_mount";
        let modifier_self_root = "modifier_imba_strafe_self_root";
        if (caster.HasModifier(modifier_mount) || caster.HasModifier(modifier_self_root)) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET;
        }
    }
    GetManaCost(level: number): number {
        let caster = this.GetCasterPlus();
        if (caster.HasModifier("modifier_imba_strafe_mount") || caster.HasModifier("modifier_imba_strafe_self_root")) {
            return 0;
        }
        return super.GetManaCost(level);
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this;
            let target = this.GetCursorTarget();
            let sound_cast = "Hero_Clinkz.Strafe";
            let modifier_aspd = "modifier_imba_strafe_aspd";
            let modifier_mount = "modifier_imba_strafe_mount";
            let duration = ability.GetSpecialValueFor("duration") + caster.GetTalentValue("special_bonus_imba_clinkz_9");
            if (caster.HasModifier("modifier_imba_strafe_self_root")) {
                ability.time_remaining = caster.findBuff<modifier_imba_strafe_self_root>("modifier_imba_strafe_self_root").GetRemainingTime();
                caster.RemoveModifierByName("modifier_imba_strafe_self_root");
                ability.EndCooldown();
                ability.UseResources(false, false, true);
            }
            if (!caster.HasModifier(modifier_mount)) {
                EmitSoundOn(sound_cast, caster);
                caster.AddNewModifier(caster, ability, modifier_aspd, {
                    duration: duration
                });
                if (caster != target) {
                    ability.EndCooldown();
                    let modifier = caster.AddNewModifier(caster, ability, modifier_mount, {
                        duration: duration
                    }) as modifier_imba_strafe_mount;
                    if (modifier) {
                        modifier.target = target;
                    }
                }
                if (caster.HasTalent("special_bonus_imba_clinkz_5")) {
                    if (target == caster) {
                        ability.EndCooldown();
                        let modifier_self_root = "modifier_imba_strafe_self_root";
                        caster.AddNewModifier(caster, ability, modifier_self_root, {
                            duration: duration
                        });
                    }
                }
            } else {
                let modifier_mount_handler = caster.FindModifierByName(modifier_mount);
                ability.time_remaining = modifier_mount_handler.GetRemainingTime();
                caster.RemoveModifierByName(modifier_mount);
                ability.EndCooldown();
                ability.UseResources(false, false, true);
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_clinkz_5") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_clinkz_5")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_clinkz_5", {});
        }
    }
}
@registerModifier()
export class modifier_imba_strafe_aspd extends BaseModifier_Plus {
    public modifier_mount: any;
    public as_bonus: number;
    public bonus_attack_range: number;
    BeCreated(p_0: any,): void {
        this.modifier_mount = "modifier_imba_strafe_mount";
        this.as_bonus = this.GetSpecialValueFor("as_bonus");
        this.bonus_attack_range = this.GetSpecialValueFor("bonus_attack_range");
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        ProjectileManager.ProjectileDodge(this.GetParentPlus());
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_clinkz/clinkz_strafe_fire.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
        2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS
    }
    return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (this.GetCasterPlus().HasModifier(this.modifier_mount)) {
            return this.as_bonus + this.as_bonus;
        } else {
            return this.as_bonus;
        }
        return undefined;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        if (this.GetCasterPlus().HasModifier("modifier_imba_strafe_self_root")) {
            return this.bonus_attack_range * this.GetCasterPlus().GetTalentValue("special_bonus_imba_clinkz_5");
        } else {
            return this.bonus_attack_range;
        }
        return undefined;
    }
}
@registerModifier()
export class modifier_imba_strafe_mount extends BaseModifier_Plus {
    public duration: number;
    public target: IBaseNpc_Plus;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.duration = this.GetSpecialValueFor("duration");
            this.AddTimer(FrameTime(), () => {
                let direction = this.target.GetForwardVector();
                let collision_radius = this.GetCasterPlus().GetPaddedCollisionRadius() + this.target.GetPaddedCollisionRadius() + 80;
                let mount_point = this.target.GetAbsOrigin() + direction * (-1) * collision_radius;
                this.GetCasterPlus().SetAbsOrigin(mount_point as Vector);
                this.StartIntervalThink(FrameTime());
            });
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        }
        return state;
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let current_loc = this.GetCasterPlus().GetAbsOrigin();
            let direction = this.target.GetForwardVector();
            let collision_radius = this.GetCasterPlus().GetPaddedCollisionRadius() + this.target.GetPaddedCollisionRadius() + 80;
            let mount_point = this.target.GetAbsOrigin() + direction * (-1) * collision_radius;
            let distance = (mount_point - current_loc as Vector).Length2D();
            if (!this.target.IsAlive()) {
                this.Destroy();
            }
            if (this.target.IsInvulnerable()) {
                this.Destroy();
            }
            if (distance > 300) {
                this.GetCasterPlus().SetAbsOrigin(mount_point as Vector);
            } else {
                direction = (mount_point - current_loc as Vector).Normalized();
                let target_movespeed = this.target.GetMoveSpeedModifier(this.target.GetBaseMoveSpeed(), false);
                let new_point = current_loc + direction * ((target_movespeed * 1.25) * FrameTime()) as Vector;
                let ground_point = GetGroundPosition(new_point, this.GetCasterPlus());
                new_point.z = ground_point.z;
                if (distance > 25) {
                    this.GetCasterPlus().SetAbsOrigin(new_point as Vector);
                }
            }
        }
    }
    OnRemoved(): void {
        if (IsServer()) {
            if (this.GetAbilityPlus().IsCooldownReady()) {
                this.GetAbilityPlus<imba_clinkz_strafe>().time_remaining = this.GetRemainingTime();
                this.GetAbilityPlus().UseResources(false, false, true);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_strafe_self_root extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
        return state;
    }
    OnRemoved(): void {
        if (IsServer()) {
            if (this.GetAbilityPlus().IsCooldownReady()) {
                this.GetAbilityPlus<imba_clinkz_strafe>().time_remaining = this.GetRemainingTime();
                this.GetAbilityPlus().UseResources(false, false, true);
            }
        }
    }
}
@registerAbility()
export class imba_clinkz_death_pact_723 extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_clinkz_death_pact_723_permanent_buff";
    }
    CastFilterResultTarget(hTarget: CDOTA_BaseNPC): UnitFilterResult {
        if (hTarget.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() && hTarget.IsCreep() && !hTarget.IsAncient() || hTarget.GetClassname() == "npc_dota_clinkz_skeleton_archer" && hTarget.findBuffStack("modifier_imba_burning_army", this.GetCasterPlus()) == 0) {
            return UnitFilterResult.UF_SUCCESS;
        } else if (hTarget.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() && hTarget.IsConsideredHero()) {
            return UnitFilterResult.UF_SUCCESS;
        } else if (hTarget.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() && hTarget.IsCreep() && !hTarget.IsAncient() && hTarget.GetLevel() > this.GetSpecialValueFor("neutral_level")) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        } else {
            return UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS, this.GetCasterPlus().GetTeamNumber());
        }
    }
    GetCustomCastErrorTarget(hTarget: CDOTA_BaseNPC): string {
        if (hTarget.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            if (hTarget.IsCreep() && !hTarget.IsAncient() && hTarget.GetLevel() > this.GetSpecialValueFor("neutral_level")) {
                return "#dota_hud_error_cant_cast_creep_level";
            } else if (hTarget.IsConsideredHero() && hTarget.GetLevel() > this.GetCasterPlus().GetLevel()) {
                return "#dota_hud_error_cant_cast_hero_level";
            }
        }
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        this.GetCasterPlus().EmitSound("Hero_Clinkz.DeathPact.Cast");
        target.EmitSound("Hero_Clinkz.DeathPact");
        let pact_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_clinkz/clinkz_death_pact.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        ParticleManager.SetParticleControl(pact_particle, 1, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(pact_particle);
        if (!target.IsConsideredHero()) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_clinkz_death_pact_723", {
                duration: this.GetSpecialValueFor("duration")
            });
            target.Kill(this, this.GetCasterPlus());
        } else {
            let health_to_convert = target.GetMaxHealth() * this.GetSpecialValueFor("soul_high_hp_damage") * 0.01;
            if (this.GetCasterPlus().HasModifier("modifier_imba_clinkz_death_pact_723")) {
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_clinkz_death_pact_723");
            }
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_clinkz_death_pact_723", {
                duration: this.GetSpecialValueFor("soul_high_duration"),
                bonus_attack: health_to_convert * this.GetSpecialValueFor("soul_high_hp_to_attack") * 0.01
            });
            ApplyDamage({
                victim: target,
                damage: health_to_convert,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL,
                attacker: this.GetCasterPlus(),
                ability: this
            });
        }
    }
}
@registerModifier()
export class modifier_imba_clinkz_death_pact_723 extends BaseModifier_Plus {
    public health_gain: any;
    public permanent_bonus: number;
    public debuff_duration: number;
    public armor_reduction: any;
    GetEffectName(): string {
        return "particles/units/heroes/hero_clinkz/clinkz_death_pact_buff.vpcf";
    }
    BeCreated(params: any): void {
        this.health_gain = this.GetAbilityPlus().GetTalentSpecialValueFor("health_gain");
        this.permanent_bonus = this.GetSpecialValueFor("permanent_bonus");
        this.debuff_duration = this.GetSpecialValueFor("debuff_duration");
        this.armor_reduction = this.GetSpecialValueFor("armor_reduction");
        if (!IsServer() || !params.bonus_attack) {
            return;
        }
        this.SetStackCount(params.bonus_attack);
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS,
        2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
        3: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS)
    CC_GetModifierExtraHealthBonus(): number {
        return this.health_gain;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && keys.target.IsRealHero()) {
            keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_clinkz_death_pact_723_enemy", {
                duration: this.debuff_duration * (1 - keys.target.GetStatusResistance()),
                armor_reduction: this.armor_reduction,
                permanent_bonus: this.permanent_bonus
            });
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_clinkz_death_pact_723_enemy extends BaseModifier_Plus {
    public armor_reduction: any;
    public permanent_bonus: number;
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (this.GetAbilityPlus()) {
            this.armor_reduction = this.GetSpecialValueFor("armor_reduction") * (-1);
            this.permanent_bonus = this.GetSpecialValueFor("permanent_bonus");
        } else if (params) {
            this.armor_reduction = params.armor_reduction * (-1);
            this.permanent_bonus = params.permanent_bonus;
        } else {
            this.armor_reduction = -2;
            this.permanent_bonus = 5;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
        2: Enum_MODIFIER_EVENT.ON_DEATH
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.armor_reduction;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus() && keys.unit.IsRealHero() && (!keys.unit.IsReincarnating || (keys.unit.IsReincarnating && !keys.unit.IsReincarnating()))) {
            let pact_modifier = this.GetCasterPlus().findBuff<modifier_imba_clinkz_death_pact_723_permanent_buff>("modifier_imba_clinkz_death_pact_723_permanent_buff");
            if (pact_modifier) {
                pact_modifier.SetStackCount(pact_modifier.GetStackCount() + this.permanent_bonus);
                if (pact_modifier.GetAbility()) {
                    pact_modifier.GetAbility().EndCooldown();
                }
            }
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_clinkz_death_pact_723_permanent_buff extends BaseModifier_Plus {
    IsHidden(): boolean {
        return this.GetStackCount() <= 0;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.GetStackCount();
    }
}
@registerAbility()
export class imba_clinkz_searing_arrows extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "clinkz_searing_arrows";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_searing_arrows_passive";
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        let caster = this.GetCasterPlus();
        return caster.Script_GetAttackRange();
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnUnStolen(): void {
        let caster = this.GetCasterPlus();
        if (caster.HasModifier("modifier_imba_searing_arrows_passive")) {
            caster.RemoveModifierByName("modifier_imba_searing_arrows_passive");
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        let particle_projectile = "particles/hero/clinkz/searing_flames_active/clinkz_searing_arrow.vpcf";
        let sound_cast = "Hero_Clinkz.SearingArrows";
        let projectile_speed = ability.GetSpecialValueFor("projectile_speed");
        let vision_radius = ability.GetSpecialValueFor("vision_radius");
        EmitSoundOn(sound_cast, caster);
        let searing_arrow_active;
        searing_arrow_active = {
            Target: target,
            Source: caster,
            Ability: ability,
            EffectName: particle_projectile,
            iMoveSpeed: projectile_speed,
            bDodgeable: true,
            bVisibleToEnemies: true,
            bReplaceExisting: false,
            bProvidesVision: true,
            iVisionRadius: vision_radius,
            iVisionTeamNumber: caster.GetTeamNumber()
        }
        ProjectileManager.CreateTrackingProjectile(searing_arrow_active);
        if (caster.HasTalent("special_bonus_imba_clinkz_4")) {
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, caster.GetTalentValue("special_bonus_imba_clinkz_4"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy != target) {
                    let searing_arrow_active_seconday;
                    searing_arrow_active_seconday = {
                        Target: enemy,
                        Source: caster,
                        Ability: ability,
                        EffectName: particle_projectile,
                        iMoveSpeed: projectile_speed,
                        bDodgeable: true,
                        bVisibleToEnemies: true,
                        bReplaceExisting: false,
                        bProvidesVision: true,
                        iVisionRadius: vision_radius,
                        iVisionTeamNumber: caster.GetTeamNumber()
                    }
                    ProjectileManager.CreateTrackingProjectile(searing_arrow_active_seconday);
                }
            }
        }
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this;
            let sound_hit = "Hero_Clinkz.SearingArrows.Impact";
            let modifier_active = "modifier_imba_searing_arrows_active";
            let active_duration = ability.GetSpecialValueFor("active_duration");
            if (target.GetTeam() != caster.GetTeam()) {
                if (target.TriggerSpellAbsorb(ability)) {
                    return undefined;
                }
            }
            EmitSoundOn(sound_hit, target);
            caster.PerformAttack(target, false, true, true, false, false, false, true);
            target.AddNewModifier(caster, ability, modifier_active, {
                duration: active_duration * (1 - target.GetStatusResistance())
            });
        }
    }
    OnUpgrade(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            caster.RemoveModifierByName("modifier_imba_searing_arrows_passive");
            caster.AddNewModifier(caster, this, "modifier_imba_searing_arrows_passive", {});
        }
    }
}
@registerModifier()
export class modifier_imba_searing_arrows_passive extends BaseModifier_Plus {
    public bonus_damage: number;
    BeCreated(p_0: any,): void {
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage");
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: Enum_MODIFIER_EVENT.ON_ATTACK_START,
        2: Enum_MODIFIER_EVENT.ON_ATTACK,
        3: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
        4: GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE
    });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (this.GetAbilityPlus().IsNull()) {
                return undefined;
            }
            if (this.GetAbilityPlus().IsStolen()) {
                return undefined;
            }
            if (!target.IsRealUnit() && !target.IsBuilding() && !target.IsCreep()) {
                SetArrowAttackProjectile(this.GetCasterPlus(), false);
                return undefined;
            }
            if (this.GetCasterPlus() == attacker && this.GetCasterPlus().GetTeamNumber() != target.GetTeamNumber()) {
                if (this.GetCasterPlus().PassivesDisabled()) {
                    SetArrowAttackProjectile(this.GetCasterPlus(), false);
                } else {
                    SetArrowAttackProjectile(this.GetCasterPlus(), true);
                    if (this.GetCasterPlus().HasTalent("special_bonus_imba_clinkz_7")) {
                        if (RollPercentage(this.GetCasterPlus().GetTalentValue("special_bonus_imba_clinkz_7"))) {
                            this.GetCasterPlus().PerformAttack(target, false, true, true, false, true, false, false);
                        }
                    }
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        let owner = this.GetParentPlus().GetOwner() as IBaseNpc_Plus;
        if (keys.attacker == this.GetParentPlus() && !keys.no_attack_cooldown && ((this.GetParentPlus().HasTalent && this.GetParentPlus().HasTalent("special_bonus_imba_clinkz_10")) || (this.GetParentPlus().GetOwner && owner && owner.HasTalent("special_bonus_imba_clinkz_10")))) {
            for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.GetParentPlus().Script_GetAttackRange(), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false))) {
                if (enemy != keys.target) {
                    this.GetParentPlus().PerformAttack(enemy, false, true, true, false, true, false, false);
                    return;
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus()) {
            ApplyDamage({
                victim: keys.target,
                damage: this.GetSpecialValueFor("bonus_damage"),
                damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetParentPlus(),
                ability: this.GetAbilityPlus()
            });
        }
    }
}
@registerModifier()
export class modifier_imba_searing_arrows_active extends BaseModifier_Plus {
    public particle_flame: any;
    public vision_radius: number;
    public active_tick_interval: number;
    public armor_burn_per_stack: number;
    public particle_flame_fx: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        this.particle_flame = "particles/hero/clinkz/searing_flames_active/burn_effect.vpcf";
        this.vision_radius = this.GetSpecialValueFor("vision_radius");
        this.active_tick_interval = this.GetSpecialValueFor("active_tick_interval");
        this.armor_burn_per_stack = this.GetSpecialValueFor("armor_burn_per_stack");
        if (IsServer()) {
            this.particle_flame_fx = ResHelper.CreateParticleEx(this.particle_flame, ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControlEnt(this.particle_flame_fx, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
            this.AddParticle(this.particle_flame_fx, false, false, -1, false, false);
            this.StartIntervalThink(FrameTime());
            this.AddTimer(this.active_tick_interval, () => {
                if (!this.IsNull()) {
                    this.IncrementStackCount();
                    return this.active_tick_interval;
                }
                return undefined;
            });
        }
    }
    OnIntervalThink(): void {
        AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), this.vision_radius, FrameTime(), false);
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount() * this.armor_burn_per_stack * (-1);
    }
}
@registerAbility()
export class imba_clinkz_skeleton_walk extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "clinkz_wind_walk";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let particle_invis = "particles/units/heroes/hero_clinkz/clinkz_windwalk.vpcf";
        let sound_cast = "Hero_Clinkz.WindWalk";
        let modifier_invis = "modifier_imba_skeleton_walk_invis";
        let scepter = caster.HasScepter();
        let modifier_mount = "modifier_imba_strafe_mount";
        let duration = this.GetSpecialValueFor("duration");
        EmitSoundOn(sound_cast, caster);
        let particle_invis_fx = ResHelper.CreateParticleEx(particle_invis, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
        ParticleManager.SetParticleControl(particle_invis_fx, 0, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_invis_fx, 1, caster.GetAbsOrigin());
        caster.AddNewModifier(caster, this, modifier_invis, {
            duration: duration
        });
        if (scepter) {
            if (caster.HasModifier(modifier_mount)) {
                let modifier_mount_handler = caster.findBuff<modifier_imba_strafe_mount>(modifier_mount);
                if (modifier_mount_handler) {
                    let mounted_ally = modifier_mount_handler.target;
                    mounted_ally.AddNewModifier(caster, this, modifier_invis, {
                        duration: modifier_mount_handler.GetRemainingTime()
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_skeleton_walk_invis extends BaseModifier_Plus {
    public sound_cast: any;
    public modifier_spook: any;
    public modifier_talent_ms: any;
    public modifier_mount: any;
    public spook_radius: number;
    public base_spook_duration: number;
    public spook_distance_inc: number;
    public spook_added_duration: number;
    public ms_bonus_pct: number;
    public scepter_bonus: number;
    public detected: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.sound_cast = "Hero_Clinkz.WindWalk";
        this.modifier_spook = "modifier_imba_skeleton_walk_spook";
        this.modifier_talent_ms = "modifier_imba_skeleton_walk_talent_ms";
        this.modifier_mount = "modifier_imba_strafe_mount";
        this.spook_radius = this.GetSpecialValueFor("spook_radius");
        this.base_spook_duration = this.GetSpecialValueFor("base_spook_duration");
        this.spook_distance_inc = this.GetSpecialValueFor("spook_distance_inc");
        this.spook_added_duration = this.GetSpecialValueFor("spook_added_duration");
        this.ms_bonus_pct = this.GetSpecialValueFor("ms_bonus_pct");
        this.scepter_bonus = 0;
        if (this.GetCasterPlus().HasScepter()) {
            this.scepter_bonus = this.GetSpecialValueFor("scepter_bonus");
            if (IsServer() && !this.GetParentPlus().HasModifier("modifier_bloodseeker_thirst")) {
                this.GetParentPlus().AddNewModifier(this.GetParentPlus(), undefined, "modifier_bloodseeker_thirst", {});
            }
        }
        if (IsServer()) {
            this.StartIntervalThink(0.2);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.GetParentPlus() != this.GetCasterPlus()) {
                if (!this.GetCasterPlus().HasModifier(this.modifier_mount)) {
                    this.Destroy();
                }
            }
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.spook_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_clinkz_2")) {
                if (GameFunc.GetCount(enemies) > 0) {
                    this.SetStackCount(this.GetCasterPlus().GetTalentValue("special_bonus_imba_clinkz_2"));
                } else {
                    this.SetStackCount(0);
                }
            }
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_clinkz_3")) {
                let enemy_heroes = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, 128, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
                for (const [_, enemy] of GameFunc.iPair(enemy_heroes)) {
                    if (!enemy.IsMagicImmune()) {
                        enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_skeleton_walk_talent_root", {
                            duration: this.GetCasterPlus().GetTalentValue("special_bonus_imba_clinkz_3") * (1 - enemy.GetStatusResistance())
                        });
                        if (enemy.HasModifier("modifier_imba_skeleton_walk_talent_root")) {
                            this.Destroy();
                        }
                        return;
                    }
                }
            }
            if (this.GetCasterPlus().HasScepter() && !this.GetParentPlus().HasModifier("modifier_bloodseeker_thirst")) {
                this.GetParentPlus().AddNewModifier(this.GetParentPlus(), undefined, "modifier_bloodseeker_thirst", {});
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true
        };
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_NORMAL;
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
        2: MODIFIER_PROPERTY_MOVESPEED_MAX,
        3: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL,
        4: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED,
        5: Enum_MODIFIER_EVENT.ON_ATTACK
    });
    } */
    GetModifierMoveSpeed_Max() {
        if (this.GetParentPlus().HasScepter()) {
            return 5000;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms_bonus_pct + this.GetStackCount() + this.scepter_bonus;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_OnAbilityExecuted(keys: ModifierAbilityEvent): void {
        if (IsServer()) {
            let caster = keys.unit;
            if (this.GetParentPlus() == caster) {
                let enemy = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, 1000, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS, FindOrder.FIND_CLOSEST, false);
                if (enemy[0] && enemy[0].CanEntityBeSeenByMyTeam(this.GetParentPlus())) {
                    this.detected = true;
                }
                this.Destroy();
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            if (this.GetParentPlus() == attacker) {
                let enemy = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, 1000, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS, FindOrder.FIND_CLOSEST, false);
                if (enemy[0] && enemy[0].CanEntityBeSeenByMyTeam(this.GetParentPlus())) {
                    this.detected = true;
                }
                this.Destroy();
            }
        }
    }
    OnRemoved(): void {
        if (IsServer()) {
            // todo 需要重写 clinkz_burning_army
            if (this.GetCasterPlus().HasScepter() && this.GetCasterPlus().findAbliityPlus("clinkz_burning_army") && this.GetCasterPlus().FindAbilityByName("clinkz_burning_army").IsTrained()) {
                for (let i = 0; i < this.GetSpecialValueFor("scepter_skeleton_count"); i++) {
                    let pos = this.GetCasterPlus().GetAbsOrigin() + RandomVector(250) as Vector;
                    if (i == 1) {
                        pos = this.GetCasterPlus().GetAbsOrigin() + (this.GetCasterPlus().GetRightVector() * 250 * (-1)) as Vector;
                    } else if (i == 2) {
                        pos = this.GetCasterPlus().GetAbsOrigin() + (this.GetCasterPlus().GetRightVector() * 250) as Vector;
                    }
                    let archer = BaseNpc_Plus.CreateUnitByName("npc_dota_clinkz_skeleton_archer", pos, this.GetCasterPlus().GetTeamNumber(), true, this.GetCasterPlus(), this.GetCasterPlus());
                    archer.AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("clinkz_burning_army"), "modifier_imba_clinkz_burning_army_skeleton_custom", {});
                    archer.AddNewModifier(this.GetCasterPlus(), undefined, "modifier_kill", {
                        duration: this.GetCasterPlus().findAbliityPlus("clinkz_burning_army").GetSpecialValueFor("duration")
                    });
                    archer.SetForwardVector(this.GetCasterPlus().GetForwardVector());
                }
                if (this.GetParentPlus().HasModifier("modifier_bloodseeker_thirst")) {
                    this.GetParentPlus().RemoveModifierByName("modifier_bloodseeker_thirst");
                }
            }
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_clinkz_6")) {
                this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), this.modifier_talent_ms, {
                    duration: this.GetCasterPlus().GetTalentValue("special_bonus_imba_clinkz_6")
                });
            }
            if (this.detected) {
                return undefined;
            }
            if (!this.GetCasterPlus().IsAlive()) {
                return undefined;
            }
            EmitSoundOn(this.sound_cast, this.GetParentPlus());
            let enemies = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.spook_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!enemy.IsMagicImmune()) {
                    let distance = (enemy.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D();
                    let spook_duration = this.base_spook_duration + (((this.spook_radius - distance) / this.spook_distance_inc) * this.spook_added_duration);
                    enemy.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), this.modifier_spook, {
                        duration: spook_duration * (1 - enemy.GetStatusResistance())
                    });
                }
            }
            let spook_likelihood = 10;
            if (GameFunc.GetCount(enemies) > 0 && RollPercentage(spook_likelihood)) {
                EmitSoundOn("Imba.ClinkzSpooky", this.GetParentPlus());
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer() || !this.GetParentPlus().IsAlive()) {
            return;
        }
        if (this.GetAbilityPlus() && this.GetAbilityPlus().GetName() == "imba_clinkz_skeleton_walk_723") {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_clinkz_skeleton_walk_723_strafe", {
                duration: this.GetAbilityPlus().GetTalentSpecialValueFor("attack_speed_duration")
            });
        }
    }
}
@registerModifier()
export class modifier_imba_clinkz_burning_army_skeleton_custom extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount((this.GetCasterPlus().GetAverageTrueAttackDamage(this.GetCasterPlus()) - (this.GetCasterPlus().GetBaseDamageMax() + this.GetCasterPlus().GetBaseDamageMin()) / 2) * this.GetSpecialValueFor("damage_percent") * 0.01);
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        if (this.GetAbilityPlus()) {
            this.SetStackCount((this.GetCasterPlus().GetAverageTrueAttackDamage(this.GetCasterPlus()) - (this.GetCasterPlus().GetBaseDamageMax() + this.GetCasterPlus().GetBaseDamageMin()) / 2) * this.GetSpecialValueFor("damage_percent") * 0.01);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_skeleton_walk_spook extends BaseModifier_Plus {
    public particle_spook: any;
    public particle_spook_fx: any;
    public reacting: any;
    public qangle_angle: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.particle_spook = "particles/hero/clinkz/spooked/spooky_skull.vpcf";
            this.particle_spook_fx = ResHelper.CreateParticleEx(this.particle_spook, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControl(this.particle_spook_fx, 0, this.GetParentPlus().GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle_spook_fx, 3, this.GetParentPlus().GetAbsOrigin());
            this.AddParticle(this.particle_spook_fx, false, false, -1, false, true);
            this.reacting = true;
            let direction = (this.GetParentPlus().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized();
            let location = this.GetParentPlus().GetAbsOrigin() + direction * 500 as Vector;
            let newOrder: ExecuteOrderOptions = {
                UnitIndex: this.GetParentPlus().entindex(),
                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION,
                Position: location
            }
            ExecuteOrderFromTable(newOrder);
            this.reacting = false;
            this.qangle_angle = 0;
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        let qangle = QAngle(0, this.qangle_angle, 0);
        this.qangle_angle = this.qangle_angle + 30;
        if (this.qangle_angle >= 360) {
            this.qangle_angle = 0;
        }
        let direction = (this.GetParentPlus().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized();
        let location = this.GetParentPlus().GetAbsOrigin() + direction * 500;
        let final_location = RotatePosition(this.GetParentPlus().GetAbsOrigin(), qangle, location as Vector);
        this.GetParentPlus().MoveToPosition(final_location);
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.GetParentPlus().Stop();
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (!this.reacting) {
            let state = {
                [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true
            }
            return state;
        }
        return undefined;
    }
}
@registerModifier()
export class modifier_imba_skeleton_walk_talent_root extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_skeleton_walk_talent_ms extends BaseModifier_Plus {
    public ms_bonus_pct: number;
    public spook_radius: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.ms_bonus_pct = this.GetSpecialValueFor("ms_bonus_pct");
        if (IsServer()) {
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_clinkz_2")) {
                this.spook_radius = this.GetSpecialValueFor("spook_radius");
                let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.spook_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                if (GameFunc.GetCount(enemies) > 0) {
                    this.ms_bonus_pct = this.GetSpecialValueFor("ms_bonus_pct") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_clinkz_2");
                } else {
                    this.ms_bonus_pct = this.GetSpecialValueFor("ms_bonus_pct");
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
    }
    return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms_bonus_pct;
    }
}
@registerModifier()
export class modifier_imba_clinkz_skeleton_walk_723_strafe extends BaseModifier_Plus {
    public attack_speed_bonus_pct: number;
    BeCreated(p_0: any,): void {
        this.attack_speed_bonus_pct = this.GetSpecialValueFor("attack_speed_bonus_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_speed_bonus_pct;
    }
}
@registerAbility()
export class imba_clinkz_death_pact extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "clinkz_death_pact";
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (caster == target) {
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
            if (target.GetUnitName() == "npc_imba_clinkz_spirits") {
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
            if (target.IsConsideredHero() && !target.IsRealUnit()) {
                return UnitFilterResult.UF_FAIL_CONSIDERED_HERO;
            }
            let nResult = UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
            return nResult;
        }
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (caster == target) {
                return "dota_hud_error_cant_cast_on_self";
            }
            if (target.GetUnitName() == "npc_imba_clinkz_spirits") {
                return "#dota_hud_error_cant_cast_on_spirits";
            }
        }
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        let cast_response = "clinkz_clinkz_ability_pact_0" + math.random(1, 6);
        let sound_cast = "Hero_Clinkz.DeathPact.Cast";
        let particle_pact = "particles/units/heroes/hero_clinkz/clinkz_death_pact.vpcf";
        let modifier_pact = "modifier_imba_death_pact_buff";
        let modifier_stack_creep = "modifier_imba_death_pact_stack_creep";
        let modifier_bonus_spirited = "modifier_imba_death_pact_bonus_spirited";
        let modifier_stack_hero = "modifier_imba_death_pact_stack_hero";
        let modifier_stack_hero_spirited = "modifier_imba_death_pact_stack_hero_spirited";
        let modifier_spirited_aura = "modifier_imba_death_pact_spirit_aura";
        let modifier_debuff_mark = "modifier_imba_death_pact_hero_debuff";
        let modifier_talent_debuff_mark = "modifier_imba_death_pact_talent_debuff";
        let duration = ability.GetSpecialValueFor("duration");
        let hero_current_hp_damage_pct = ability.GetSpecialValueFor("hero_current_hp_damage_pct");
        if (target.GetTeam() != caster.GetTeam()) {
            if (target.TriggerSpellAbsorb(ability)) {
                return undefined;
            }
        }
        if (RollPercentage(50) && caster.IsRealUnit()) {
            EmitSoundOn(cast_response, caster);
        }
        EmitSoundOn(sound_cast, caster);
        let particle_pact_fx = ResHelper.CreateParticleEx(particle_pact, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
        ParticleManager.SetParticleControl(particle_pact_fx, 0, target.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_pact_fx, 1, target.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_pact_fx, 5, target.GetAbsOrigin());
        if (caster.HasModifier(modifier_pact)) {
            caster.RemoveModifierByName(modifier_pact);
            caster.RemoveModifierByName(modifier_stack_creep);
            caster.RemoveModifierByName(modifier_stack_hero);
        }
        let pact_stacks;
        let modifier_stacks;
        let Clinkz_team = caster.GetTeamNumber();
        let target_team = target.GetTeamNumber();
        if (target.IsRealUnit()) {
            let current_hp = target.GetHealth();
            let damage = current_hp * (hero_current_hp_damage_pct * 0.01);
            let damageTable: ApplyDamageOptions = {
                victim: target,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                attacker: caster,
                ability: ability
            }
            ApplyDamage(damageTable);
            pact_stacks = damage;
            modifier_stacks = caster.AddNewModifier(caster, ability, modifier_stack_hero, {
                duration: duration
            });
            if (target_team == Clinkz_team || target.HasModifier("modifier_imba_reincarnation_wraith_form")) {
            } else {
                target.AddNewModifier(caster, ability, modifier_debuff_mark, {
                    duration: duration * (1 - target.GetStatusResistance())
                });
            }
        } else {
            let current_hp = target.GetHealth();
            caster.RemoveModifierByName(modifier_bonus_spirited);
            let spirits_to_kill = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, 500, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, unit] of GameFunc.iPair(spirits_to_kill)) {
                if (unit.FindModifierByNameAndCaster(modifier_spirited_aura, caster)) {
                    unit.Kill(ability, caster);
                }
            }
            let spirit_model = target.GetModelName();
            let spirit_scale = target.GetModelScale();
            let direction = (target.GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Normalized();
            let distance = (target.GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Length2D();
            let summon_point = caster.GetAbsOrigin() + direction * distance - 100 as Vector;
            let spirit = BaseNpc_Plus.CreateUnitByName("npc_imba_clinkz_spirits", summon_point, caster.GetTeamNumber(), true, caster, caster);
            spirit.SetOwner(caster);
            spirit.SetOriginalModel(spirit_model);
            spirit.SetModelScale(spirit_scale);
            spirit.SetRenderColor(12, 55, 74);
            spirit.AddNewModifier(caster, ability, "modifier_kill", {
                duration: duration
            });
            spirit.AddNewModifier(caster, ability, modifier_spirited_aura, {
                duration: duration
            });
            let modifier_spirit_attack_range_bonus = "modifier_imba_death_pact_spirit_attack_range";
            spirit.AddNewModifier(caster, ability, modifier_spirit_attack_range_bonus, {
                duration: duration
            });
            caster.AddNewModifier(target, ability, modifier_bonus_spirited, {
                duration: duration
            });
            ResolveNPCPositions(target.GetAbsOrigin(), 164);
            target.Kill(ability, caster);
            pact_stacks = current_hp;
            modifier_stacks = caster.AddNewModifier(caster, ability, modifier_stack_creep, {
                duration: duration
            });
        }
        if (!caster.IsRealUnit()) {
            return undefined;
        }
        caster.AddNewModifier(caster, ability, modifier_pact, {
            duration: duration
        });
        if (modifier_stacks) {
            modifier_stacks.SetStackCount(pact_stacks);
        }
        caster.CalculateStatBonus(true);
        if (caster.HasTalent("special_bonus_imba_clinkz_8") && caster.GetTeamNumber() != target.GetTeamNumber()) {
            let mark_duration = caster.GetTalentValue("special_bonus_imba_clinkz_8", "mark_duration");
            target.AddNewModifier(caster, ability, modifier_talent_debuff_mark, {
                duration: mark_duration * (1 - target.GetStatusResistance())
            });
        }
    }
}
@registerModifier()
export class modifier_imba_death_pact_buff extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_death_pact_stack_creep extends BaseModifier_Plus {
    public particle_pact_buff: any;
    public creep_bonus_hp_pct: number;
    public creep_bonus_dmg_pct: number;
    public particle_pact_buff_fx: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.particle_pact_buff = "particles/units/heroes/hero_clinkz/clinkz_death_pact_buff.vpcf";
        this.creep_bonus_hp_pct = this.GetSpecialValueFor("creep_bonus_hp_pct");
        this.creep_bonus_dmg_pct = this.GetSpecialValueFor("creep_bonus_dmg_pct");
        this.particle_pact_buff_fx = ResHelper.CreateParticleEx(this.particle_pact_buff, ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(this.particle_pact_buff_fx, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(this.particle_pact_buff_fx, 2, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle_pact_buff_fx, 8, Vector(1, 0, 0));
        this.AddParticle(this.particle_pact_buff_fx, false, false, -1, false, false);
        if (IsServer()) {
            this.AddTimer(FrameTime(), () => {
                let stacks = this.GetStackCount();
                this.GetCasterPlus().Heal(this.creep_bonus_hp_pct * 0.01 * stacks, this.GetAbilityPlus());
            });
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS
    }
    return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage(): number {
        let stacks = this.GetStackCount();
        let bonus_damage = this.creep_bonus_dmg_pct * 0.01 * stacks;
        return bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS)
    CC_GetModifierExtraHealthBonus(): number {
        let stacks = this.GetStackCount();
        let bonus_hp = this.creep_bonus_hp_pct * 0.01 * stacks;
        return bonus_hp;
    }
}
@registerModifier()
export class modifier_imba_death_pact_spirit_aura extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let modifier_bonus_spirited = "modifier_imba_death_pact_bonus_spirited";
            let duration = this.GetSpecialValueFor("duration");
            this.GetParentPlus().SetAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_NO_ATTACK);
            this.AddTimer(FrameTime(), () => {
                let direction = this.GetCasterPlus().GetForwardVector();
                let collision_radius = this.GetCasterPlus().GetPaddedCollisionRadius() + this.GetParentPlus().GetPaddedCollisionRadius() + 80;
                let mount_point = this.GetCasterPlus().GetAbsOrigin() + direction * (-1) * collision_radius as Vector;
                this.GetParentPlus().SetAbsOrigin(mount_point);
                let particle_pact = "particles/units/heroes/hero_clinkz/clinkz_death_pact.vpcf";
                let particle_pact_fx = ResHelper.CreateParticleEx(particle_pact, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
                ParticleManager.SetParticleControl(particle_pact_fx, 0, this.GetParentPlus().GetAbsOrigin());
                ParticleManager.SetParticleControl(particle_pact_fx, 1, this.GetParentPlus().GetAbsOrigin());
                ParticleManager.SetParticleControl(particle_pact_fx, 5, this.GetParentPlus().GetAbsOrigin());
                this.StartIntervalThink(FrameTime());
            });
        }
    }
    OnIntervalThink( /** keys */): void {
        if (IsServer()) {
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_clinkz_1")) {
                this.GetParentPlus().SetAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK);
            }
            let modifier_spirit_invis = "modifier_imba_death_pact_spirit_aura_invis";
            if (this.GetCasterPlus().IsInvisiblePlus()) {
                this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), modifier_spirit_invis, {});
            } else {
                this.GetParentPlus().RemoveModifierByName(modifier_spirit_invis);
            }
            let current_loc = this.GetParentPlus().GetAbsOrigin();
            let direction = this.GetCasterPlus().GetForwardVector();
            let collision_radius = this.GetCasterPlus().GetPaddedCollisionRadius() + this.GetParentPlus().GetPaddedCollisionRadius() + 80;
            let mount_point = this.GetCasterPlus().GetAbsOrigin() + direction * (-1) * collision_radius as Vector;
            let distance = (mount_point - current_loc as Vector).Length2D();
            if (!this.GetCasterPlus().IsAlive()) {
                this.GetParentPlus().Kill(this.GetAbilityPlus(), this.GetCasterPlus());
            }
            this.GetParentPlus().SetForwardVector(direction);
            if (distance > 300) {
                this.GetParentPlus().SetAbsOrigin(mount_point);
            } else {
                direction = (mount_point - current_loc as Vector).Normalized();
                let Clinkz_move_speed = this.GetCasterPlus().GetMoveSpeedModifier(this.GetCasterPlus().GetBaseMoveSpeed(), false);
                let new_point = current_loc + direction * ((Clinkz_move_speed * 1.25) * FrameTime()) as Vector;
                let ground_point = GetGroundPosition(new_point, this.GetParentPlus());
                new_point.z = ground_point.z;
                if (distance > 25) {
                    this.GetParentPlus().SetAbsOrigin(new_point);
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_HEALING,
        3: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
    }
    return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return -100;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_HEALING)
    CC_GetDisableHealing(): 0 | 1 {
        return 1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        let target = keys.target;
        let attacker = keys.attacker as IBaseNpc_Plus;
        let modifier_spirited_aura = "modifier_imba_death_pact_spirit_aura";
        if (target == this.GetParentPlus()) {
            if (attacker.IsRealUnit() || attacker.IsTower() || attacker.IsRoshan()) {
                if (this.GetParentPlus().GetHealth() <= 1) {
                    this.GetParentPlus().Kill(this.GetAbilityPlus(), attacker);
                } else {
                    this.GetParentPlus().SetHealth(this.GetParentPlus().GetHealth() - 1);
                }
            } else {
                return undefined;
            }
        }
    }
    OnRemoved(): void {
        if (IsServer()) {
            this.GetParentPlus().SetOriginalModel("models/creeps/neutral_creeps/n_creep_ghost_b/n_creep_ghost_frost.vmdl");
            this.GetCasterPlus().RemoveModifierByName("modifier_imba_death_pact_bonus_spirited");
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_EVADE_DISABLED]: true,
            [modifierstate.MODIFIER_STATE_PASSIVES_DISABLED]: true,
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true
        }
        return state;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_wraithking_ghosts.vpcf";
    }
}
@registerModifier()
export class modifier_imba_death_pact_spirit_aura_invis extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL
    }
    return Object.values(decFuncs);
    } */
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true
        }
        return state;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        return 1;
    }
}
@registerModifier()
export class modifier_imba_death_pact_spirit_attack_range extends BaseModifier_Plus {
    public spirit_attack_range: number;
    public spirit_damage: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.spirit_attack_range = this.GetCasterPlus().Script_GetAttackRange();
            this.spirit_damage = this.GetCasterPlus().GetAttackDamage();
            this.StartIntervalThink(1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            this.spirit_attack_range = this.GetCasterPlus().Script_GetAttackRange();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
        2: GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE
    }
    return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        return this.spirit_attack_range;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage(): number {
        return this.spirit_damage;
    }
}
@registerModifier()
export class modifier_imba_death_pact_bonus_spirited extends BaseModifier_Plus {
    public spirit_damage: number;
    public spirit_armor: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.spirit_damage = this.GetCasterPlus().GetAttackDamage();
            this.SetStackCount(this.spirit_damage);
        }
        this.spirit_armor = this.GetCasterPlus().GetPhysicalArmorValue(false);
    }
    /** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: Enum_MODIFIER_EVENT.ON_ATTACK_START,
        2: GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE,
        3: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
    }
    return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage(): number {
        return this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.spirit_armor;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            if (this.GetParentPlus() == attacker) {
                let target = this.GetParentPlus().GetAttackTarget();
                let modifier_spirited_aura = "modifier_imba_death_pact_spirit_aura";
                let nearby_allies = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, 500, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, spirits] of GameFunc.iPair(nearby_allies)) {
                    if (spirits.FindModifierByNameAndCaster(modifier_spirited_aura, this.GetParentPlus())) {
                        spirits.SetForceAttackTarget(target);
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_death_pact_stack_hero extends BaseModifier_Plus {
    public particle_pact_buff: any;
    public hero_bonus_hp_dmg_mult: number;
    public hero_bonus_dmg_pct: number;
    public particle_pact_buff_fx: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.particle_pact_buff = "particles/units/heroes/hero_clinkz/clinkz_death_pact_buff.vpcf";
        this.hero_bonus_hp_dmg_mult = this.GetSpecialValueFor("hero_bonus_hp_dmg_mult");
        this.hero_bonus_dmg_pct = this.GetSpecialValueFor("hero_bonus_dmg_pct");
        this.particle_pact_buff_fx = ResHelper.CreateParticleEx(this.particle_pact_buff, ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(this.particle_pact_buff_fx, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(this.particle_pact_buff_fx, 2, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle_pact_buff_fx, 8, Vector(1, 0, 0));
        this.AddParticle(this.particle_pact_buff_fx, false, false, -1, false, false);
        if (IsServer()) {
            this.AddTimer(FrameTime(), () => {
                let stacks = this.GetStackCount();
                this.GetCasterPlus().Heal(this.hero_bonus_hp_dmg_mult * stacks, this.GetAbilityPlus());
            });
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS
    }
    return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage(): number {
        let stacks = this.GetStackCount();
        let bonus_damage = this.hero_bonus_dmg_pct * 0.01 * stacks;
        return bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS)
    CC_GetModifierExtraHealthBonus(): number {
        if (IsServer()) {
            let stacks = this.GetStackCount();
            let bonus_hp = this.hero_bonus_hp_dmg_mult * stacks;
            return bonus_hp;
        }
    }
}
@registerModifier()
export class modifier_imba_death_pact_talent_debuff extends BaseModifier_Plus {
    public modifier_hero_pact: any;
    public modifier_perma_buff: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.modifier_hero_pact = "modifier_imba_death_pact_stack_hero";
            this.modifier_perma_buff = "modifier_imba_death_pact_talent_buff";
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: Enum_MODIFIER_EVENT.ON_HERO_KILLED
    }
    return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_HERO_KILLED)
    CC_OnHeroKilled(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let killed_hero = keys.target;
            if (killed_hero == this.GetParentPlus() && this.GetCasterPlus().HasModifier(this.modifier_hero_pact)) {
                let buff_stacks = this.GetCasterPlus().FindModifierByName(this.modifier_hero_pact).GetStackCount();
                let stacks = buff_stacks * (this.GetCasterPlus().GetTalentValue("special_bonus_imba_clinkz_8", "stacks_pct") * 0.01);
                if (!this.GetCasterPlus().HasModifier(this.modifier_perma_buff)) {
                    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), this.modifier_perma_buff, {});
                }
                let modifier_buff_handler = this.GetCasterPlus().FindModifierByName(this.modifier_perma_buff);
                modifier_buff_handler.SetStackCount(modifier_buff_handler.GetStackCount() + stacks);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_death_pact_hero_debuff extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: Enum_MODIFIER_EVENT.ON_HERO_KILLED
    }
    return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_HERO_KILLED)
    CC_OnHeroKilled(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let killed_hero = keys.target;
            let modifier_stack_hero = "modifier_imba_death_pact_stack_hero";
            if (killed_hero == this.GetParentPlus() && this.GetCasterPlus().HasModifier(modifier_stack_hero)) {
                let duration = this.GetSpecialValueFor("duration");
                let modifier_bonus_spirited = "modifier_imba_death_pact_bonus_spirited";
                let modifier_spirited_aura = "modifier_imba_death_pact_spirit_aura";
                let spirits_to_kill = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, 500, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, unit] of GameFunc.iPair(spirits_to_kill)) {
                    if (unit.FindModifierByNameAndCaster(modifier_spirited_aura, this.GetCasterPlus())) {
                        unit.Kill(this.GetAbilityPlus(), this.GetCasterPlus());
                    }
                }
                this.GetCasterPlus().RemoveModifierByName(modifier_bonus_spirited);
                let spirit_model = this.GetParentPlus().GetModelName();
                let spirit_scale = this.GetParentPlus().GetModelScale();
                let direction = (this.GetParentPlus().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized();
                let distance = (this.GetParentPlus().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D();
                let summon_point = this.GetCasterPlus().GetAbsOrigin() + direction * distance - 100 as Vector;
                let spirit = BaseNpc_Plus.CreateUnitByName("npc_imba_clinkz_spirits", summon_point, this.GetCasterPlus().GetTeamNumber(), true, this.GetCasterPlus(), this.GetCasterPlus());
                spirit.SetOwner(this.GetCasterPlus());
                spirit.SetOriginalModel(spirit_model);
                spirit.SetModelScale(spirit_scale);
                spirit.NotifyWearablesOfModelChange(true);
                spirit.ManageModelChanges();
                spirit.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_kill", {
                    duration: duration
                });
                spirit.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), modifier_spirited_aura, {
                    duration: duration
                });
                let modifier_spirit_attack_range_bonus = "modifier_imba_death_pact_spirit_attack_range";
                spirit.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), modifier_spirit_attack_range_bonus, {
                    duration: duration
                });
                this.GetCasterPlus().AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), modifier_bonus_spirited, {
                    duration: duration
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_death_pact_talent_buff extends BaseModifier_Plus {
    public hero_bonus_hp_dmg_mult: number;
    public hero_bonus_dmg_pct: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.hero_bonus_hp_dmg_mult = this.GetSpecialValueFor("hero_bonus_hp_dmg_mult");
        this.hero_bonus_dmg_pct = this.GetSpecialValueFor("hero_bonus_dmg_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS
    }
    return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage(): number {
        let stacks = this.GetStackCount();
        let bonus_damage = this.hero_bonus_dmg_pct * 0.01 * stacks;
        return bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS)
    CC_GetModifierExtraHealthBonus(): number {
        let stacks = this.GetStackCount();
        let bonus_hp = this.hero_bonus_hp_dmg_mult * stacks;
        return bonus_hp;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_clinkz_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_clinkz_death_pact_723_health extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_clinkz_skeleton_walk_723_strafe_duration extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_clinkz_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_clinkz_10 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_clinkz_5 extends BaseModifier_Plus {
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
export class modifier_imba_burning_army extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
    });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (IsServer() && params.attacker == this.GetParentPlus() && this.GetCasterPlus().HasTalent("special_bonus_imba_clinkz_8")) {
            let particle_manaburn_fx = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_manaburn.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, params.target);
            ParticleManager.SetParticleControl(particle_manaburn_fx, 0, params.target.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(particle_manaburn_fx);
            params.target.ReduceMana(this.GetCasterPlus().GetTalentValue("special_bonus_imba_clinkz_8"));
        }
    }
}
