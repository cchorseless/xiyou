
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class ghost_revenant_wraith extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "ghost_revenant_wraith";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_cast = "DOTA_Item.GhostScepter.Activate";
        let modifier_decrep = "modifier_ghost_revenant_wraith";
        let duration = ability.GetSpecialValueFor("duration");
        EmitSoundOn(sound_cast, caster);
        caster.AddNewModifier(caster, ability, modifier_decrep, {
            duration: duration
        });
    }
}
@registerModifier()
export class modifier_ghost_revenant_wraith extends BaseModifier_Plus {
    // BeRefresh(p_0: any,): void {
    //     if (IsServer()) {
    //         this.BeDestroy();
    //     }
    // }
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
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.GetSpecialValueFor("res_reduction_pct") * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetSpecialValueFor("bonus_ms_pct");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL)
    CC_GetAbsoluteNoDamagePhysical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_pugna/pugna_decrepify.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerAbility()
export class ghost_revenant_blackjack extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "ghost_revenant_blackjack";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let caster_loc = caster.GetAbsOrigin();
        let target_loc = this.GetCursorPosition();
        let projectile_radius = this.GetSpecialValueFor("projectile_radius");
        let projectile_length = this.GetSpecialValueFor("projectile_length");
        let projectile_speed = this.GetSpecialValueFor("projectile_speed");
        let projectile_cone = this.GetSpecialValueFor("projectile_cone");
        let projectile_amount = this.GetSpecialValueFor("projectile_amount");
        let projectile_vision = this.GetSpecialValueFor("projectile_vision");
        if (caster.HasTalent("special_bonus_imba_ghost_revenant_1")) {
            projectile_amount = projectile_amount + caster.GetTalentValue("special_bonus_imba_ghost_revenant_1");
        }
        let projectile_directions: Vector[] = []
        let main_direction = (target_loc - caster_loc as Vector).Normalized();
        if (target_loc == caster_loc) {
            main_direction = caster.GetForwardVector();
        }
        let angle_step = projectile_cone / (projectile_amount - 1);
        for (let i = 0; i < projectile_amount; i++) {
            projectile_directions.push(RotatePosition(caster_loc, QAngle(0, (i - 1) * angle_step - projectile_cone * 0.5, 0), caster_loc + main_direction * 50 as Vector));
        }
        let blackjack_projectile: CreateLinearProjectileOptions = {
            Ability: this,
            EffectName: "particles/hero/ghost_revenant/blackjack_projectile.vpcf",
            vSpawnOrigin: caster_loc + main_direction * 50 + Vector(0, 0, 100) as Vector,
            fDistance: projectile_length,
            fStartRadius: projectile_radius,
            fEndRadius: projectile_radius,
            Source: caster,
            bHasFrontalCone: false,
            // bReplaceExisting: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            // bDeleteOnHit: true,
            vVelocity: main_direction * projectile_speed as Vector,
            bProvidesVision: true,
            iVisionRadius: projectile_vision,
            iVisionTeamNumber: caster.GetTeamNumber()
        }
        caster.EmitSound("Imba.DesolatorCast");
        let projectiles_launched = 0;
        this.AddTimer(0.1, () => {
            blackjack_projectile.vSpawnOrigin = projectile_directions[projectiles_launched + 1] + Vector(0, 0, 100) as Vector;
            blackjack_projectile.vVelocity = (projectile_directions[projectiles_launched + 1] - caster_loc as Vector).Normalized() * projectile_speed as Vector;
            blackjack_projectile.vVelocity.z = 0;
            ProjectileManager.CreateLinearProjectile(blackjack_projectile);
            projectiles_launched = projectiles_launched + 1;
            if (projectiles_launched < projectile_amount) {
                // return 0.0;
            }
        });
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, target_loc: Vector): boolean | void {
        if (IsServer() && target) {
            let caster = this.GetCasterPlus();
            let damage_type = this.GetAbilityDamageType();
            let stun_duration = this.GetSpecialValueFor("stun_duration");
            let damage = this.GetSpecialValueFor("damage");
            if (target) {
                // location = target.GetAbsOrigin();
            }
            target.EmitSound("Item_Desolator.Target");
            target.AddNewModifier(caster, this, "modifier_ghost_revenant_blackjack_debuff", {
                duration: stun_duration * (1 - target.GetStatusResistance())
            });
            if (!target.TempData().blackjack_hit || target.TempData().blackjack_hit == false) {
                ApplyDamage({
                    victim: target,
                    attacker: caster,
                    damage: damage,
                    damage_type: damage_type
                });
            }
            target.TempData().blackjack_hit = true;
            this.AddTimer(1.0, () => {
                target.TempData().blackjack_hit = false;
            });
            return true;
        }
    }
}
@registerModifier()
export class modifier_ghost_revenant_blackjack_debuff extends BaseModifier_Plus {
    public armor_reduction: any;
    BeCreated(p_0: any,): void {
        let ability = this.GetAbilityPlus();
        if (ability) {
            this.armor_reduction = (-1) * ability.GetSpecialValueFor("armor_reduction");
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }

    IsPurgable(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_stunned.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerAbility()
export class ghost_revenant_miasma extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "ghost_revenant_miasma";
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("area_of_effect");
    }
    OnAbilityPhaseStart(): boolean {
        EmitSoundOn("Hero_Warlock.RainOfChaos_buildup", this.GetCasterPlus());
        return true;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorPosition();
        let aoe = this.GetSpecialValueFor("area_of_effect");
        let duration = this.GetSpecialValueFor("duration");
        caster.EmitSound("DOTA_Item.DustOfAppearance.Activate");
        this.CreateVisibilityNode(target, aoe, duration);
        let miasma_pfx = ResHelper.CreateParticleEx("particles/hero/ghost_revenant/miasma.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
        ParticleManager.SetParticleControl(miasma_pfx, 0, target);
        ParticleManager.SetParticleControl(miasma_pfx, 2, Vector(aoe, aoe, aoe));
        this.AddTimer(duration, () => {
            ParticleManager.ReleaseParticleIndex(miasma_pfx);
        });
        let targets = FindUnitsInRadius(caster.GetTeamNumber(), target, undefined, aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, unit] of GameFunc.iPair(targets)) {
            unit.AddNewModifier(caster, this, "modifier_ghost_revenant_miasma", {
                duration: duration * (1 - unit.GetStatusResistance())
            });
        }
    }
}
@registerModifier()
export class modifier_ghost_revenant_miasma extends BaseModifier_Plus {
    public damage: number;
    public tick: any;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/items2_fx/true_sight_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_SUPER_ULTRA;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.damage = this.GetSpecialValueFor("dmg_pct_per_sec") * 0.01;
            this.tick = this.GetSpecialValueFor("tick");
            this.StartIntervalThink(this.tick);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetParentPlus().HasModifier("modifier_slark_shadow_dance")) {
            return undefined;
        }
        return {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: false
        };
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        let parent = this.GetParentPlus();
        if (!parent.IsRealUnit()) {
            return 0;
        }
        let invisModifiers = {
            "1": "modifier_generic_invisible",
            "2": "modifier_mirana_moonlight_shadow",
            "3": "modifier_item_imba_shadow_blade_invis",
            "4": "modifier_item_shadow_amulet_fade",
            "5": "modifier_imba_vendetta",
            "6": "modifier_nyx_assassin_burrow",
            "7": "modifier_item_imba_silver_edge_invis",
            "8": "modifier_item_glimmer_cape_fade",
            "9": "modifier_weaver_shukuchi",
            "10": "modifier_treant_natures_guise_invis",
            "11": "modifier_templar_assassin_meld",
            "12": "modifier_imba_skeleton_walk_dummy",
            "13": "modifier_invoker_ghost_walk_self",
            "14": "modifier_chess_rune_invis",
            "15": "modifier_item_imba_silver_edge_invis"
        }
        for (const [_, v] of GameFunc.Pair(invisModifiers)) {
            if (parent.HasModifier(v)) {
                return 1;
            }
        }
        return 0;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        let parent = this.GetParentPlus();
        let ability = this.GetAbilityPlus();
        let slow = 0;
        let invisModifiers = {
            "1": "modifier_generic_invisible",
            "2": "modifier_mirana_moonlight_shadow",
            "3": "modifier_item_imba_shadow_blade_invis",
            "4": "modifier_item_shadow_amulet_fade",
            "5": "modifier_imba_vendetta",
            "6": "modifier_nyx_assassin_burrow",
            "7": "modifier_item_imba_silver_edge_invis",
            "8": "modifier_item_glimmer_cape_fade",
            "9": "modifier_weaver_shukuchi",
            "10": "modifier_treant_natures_guise_invis",
            "11": "modifier_templar_assassin_meld",
            "12": "modifier_imba_skeleton_walk_dummy",
            "13": "modifier_invoker_ghost_walk_self",
            "14": "modifier_chess_rune_invis",
            "15": "modifier_item_imba_silver_edge_invis"
        }
        for (const [_, v] of GameFunc.Pair(invisModifiers)) {
            if (parent.HasModifier(v)) {
                slow = ability.GetSpecialValueFor("invisible_slow");
            }
        }
        return slow;
    }
    OnIntervalThink(): void {
        ApplyDamage({
            victim: this.GetParentPlus(),
            attacker: this.GetCasterPlus(),
            damage: this.GetParentPlus().GetMaxHealth() * this.damage + this.GetSpecialValueFor("dmg_per_sec"),
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
        });
    }
}
@registerAbility()
export class ghost_revenant_ghost_immolation extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "ghost_revenant_ghost_immolation";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_ghost_revenant_ghost_immolation";
    }
    IsInnateAbility() {
        return true;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("radius");
    }
}
@registerModifier()
export class modifier_ghost_revenant_ghost_immolation extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/hero/ghost_revenant/ambient_effects.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_ghost_revenant.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 15;
    }
    Init(p_0: any,): void {
        if (IsServer()) {
            this.GetParentPlus().SetRenderColor(128, 255, 0);
        }
    }

    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetAuraDuration(): number {
        return -1;
    }
    IsAura(): boolean {
        if (this.GetCasterPlus().PassivesDisabled()) {
            return false;
        }
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
    IsHidden(): boolean {
        return true;
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_POINT_FOLLOW;
    }
    GetModifierAura(): string {
        return "modifier_ghost_revenant_ghost_immolation_debuff";
    }
}
@registerModifier()
export class modifier_ghost_revenant_ghost_immolation_debuff extends BaseModifier_Plus {
    public interval_time: number;
    public hp_loss_pct: number;
    public lose_hp: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.interval_time = this.GetAbilityPlus().GetTalentSpecialValueFor("tick_time");
            this.hp_loss_pct = this.GetAbilityPlus().GetTalentSpecialValueFor("hp_loss_pct");
            this.StartIntervalThink(this.interval_time);
            this.lose_hp = false;
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let ghost_revenant = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
            this.lose_hp = false;
            for (const [_, ghost] of GameFunc.iPair(ghost_revenant)) {
                if (ghost.GetUnitName() == this.GetCasterPlus().GetUnitName()) {
                    this.lose_hp = true;
                }
            }
            if (this.lose_hp == true) {
                if (this.GetStackCount() < 99) {
                    this.SetStackCount(this.GetStackCount() + this.hp_loss_pct);
                }
            } else {
                this.SetStackCount(this.GetStackCount() - this.hp_loss_pct);
            }
            // this.GetParentPlus().CalculateStatBonus(true);
            if (this.GetStackCount() <= 0) {
                this.GetParentPlus().RemoveModifierByName("modifier_ghost_revenant_ghost_immolation_debuff");
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_PERCENTAGE)
    CC_GetModifierExtraHealthPercentage(): number {
        if (IsServer()) {
            let hp_to_reduce = 0.01 * this.GetStackCount() * (-1);
            if (hp_to_reduce < -0.99) {
                return -0.99;
            }
            return hp_to_reduce;
        }
    }
}
@registerAbility()
export class ghost_revenant_exhaustion extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "ghost_revenant_exhaustion";
    }
    OnAbilityPhaseStart(): boolean {
        EmitSoundOn("Hero_Warlock.RainOfChaos_buildup", this.GetCasterPlus());
        return true;
    }
    OnSpellStart(): void {
        let duration = this.GetSpecialValueFor("duration");
        this.GetCasterPlus().EmitSound("DOTA_Item.DustOfAppearance.Activate");
        let targets = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), Vector(0, 0, 0), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, unit] of GameFunc.iPair(targets)) {
            unit.AddNewModifier(this.GetCasterPlus(), this, "modifier_ghost_revenant_exhaustion", {
                duration: duration * (1 - unit.GetStatusResistance())
            });
        }
    }
}
@registerModifier()
export class modifier_ghost_revenant_exhaustion extends BaseModifier_Plus {
    public ms_reduction_pct: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.ms_reduction_pct = this.GetSpecialValueFor("ms_reduction_pct");
            EmitSoundOn("Hero_Visage.GraveChill.Target", this.GetCasterPlus());
        }
    }
    GetEffectName(): string {
        return "particles/econ/items/windrunner/windrunner_cape_cascade/windrunner_windrun_slow_cascade.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_SUPER_ULTRA;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms_reduction_pct;
    }
}
