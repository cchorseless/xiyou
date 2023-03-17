
import { GameFunc } from "../../../GameFunc";
import { AnimationHelper } from "../../../helper/AnimationHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionBoth_Plus, BaseModifierMotionVertical_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerModifier()
export class modifier_imba_tiny_death_handler extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (params.unit != this.GetParentPlus()) {
            return;
        }
        let grow_ability = this.GetParentPlus().findAbliityPlus<imba_tiny_grow>("imba_tiny_grow");
        let grow_level = 1;
        if (grow_ability) {
            grow_level = grow_ability.GetLevel() + 1;
        }
        let pfx_name = "particles/units/heroes/hero_tiny/tiny01_death.vpcf";
        let death_pfx = ResHelper.CreateParticleEx(pfx_name, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
        ParticleManager.SetParticleControl(death_pfx, 0, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControlForward(death_pfx, 0, this.GetParentPlus().GetForwardVector());
    }
}

@registerAbility()
export class imba_tiny_tree_grab extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        if (!IsClient()) {
            return;
        }
        if (!this.GetCasterPlus().TempData().arcana_style) {
            return "tiny_craggy_exterior";
        }
        return "tiny/ti9_immortal/tiny_tree_grab_immortal";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target_point = this.GetCursorPosition();
            GridNav.DestroyTreesAroundPoint(target_point, 1, false);
            let damage_modifier = caster.AddNewModifier(caster, this, "modifier_imba_tiny_tree_damage", {});
            damage_modifier.SetStackCount(this.GetSpecialValueFor("bonus_damage"));
            let tree_modifier = caster.AddNewModifier(caster, this, "modifier_imba_tiny_tree", {});
            tree_modifier.SetStackCount(5);
            let ability_slot3 = this;
            let ability_slot4 = caster.findAbliityPlus<imba_tiny_tree_throw>("imba_tiny_tree_throw");
            ability_slot4.SetLevel(ability_slot3.GetLevel());
            caster.SwapAbilities(ability_slot3.GetAbilityName(), ability_slot4.GetAbilityName(), false, true);
            caster.AddNewModifier(caster, this, "modifier_imba_tiny_tree_animation", {});
            caster.EmitSound(caster.TempData().tree_grab_sound);
        }
    }
}
@registerModifier()
export class modifier_imba_tiny_tree_animation extends BaseModifier_Plus {
    public tree: any;

    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let grow = caster.findAbliityPlus<imba_tiny_grow>("imba_tiny_grow");
            let grow_lvl = grow.GetLevel();
            if (caster.TempData().tree != undefined) {
                caster.TempData().tree.AddEffects(EntityEffects.EF_NODRAW);
                UTIL_Remove(caster.TempData().tree);
                caster.TempData().tree = undefined;
            }
            this.tree = SpawnEntityFromTableSynchronous("prop_dynamic", {
                model: caster.TempData().tree_model
            });
            this.tree.FollowEntity(this.GetCasterPlus(), true);
            let origin = caster.GetAttachmentOrigin(caster.ScriptLookupAttachment("attach_attack2"));
            let fv = caster.GetForwardVector();
            if (grow_lvl == 3) {
                let pos = origin + (fv * 50) as Vector;
                this.tree.SetAbsOrigin(Vector(pos.x + 10, pos.y, (origin.z + 25)));
            } else if (grow_lvl == 2) {
                let pos = origin + (fv * 35) as Vector;;
                this.tree.SetAbsOrigin(Vector(pos.x, pos.y, (origin.z + 25)));
            } else if (grow_lvl == 1) {
                let pos = origin + (fv * 35) as Vector;;
                this.tree.SetAbsOrigin(Vector(pos.x, pos.y + 20, (origin.z + 25)));
            } else if (grow_lvl == 0) {
                let pos = origin - (fv * 25) as Vector;;
                this.tree.SetAbsOrigin(Vector(pos.x - 20, pos.y - 30, origin.z));
                this.tree.SetAngles(60, 60, -60);
            }
            caster.TempData().tree = this.tree;
            if (caster.TempData().tree_ambient_effect != "") {
                let tree_pfx = ResHelper.CreateParticleEx(caster.TempData().tree_ambient_effect, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.tree);
                ParticleManager.ReleaseParticleIndex(tree_pfx);
            }
            AnimationHelper.StartAnimation(caster, {
                duration: -1,
                activity: GameActivity_t.ACT_DOTA_ATTACK_EVENT,
                rate: 2,
                translate: "tree"
            });
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            AnimationHelper.EndAnimation(caster);
            caster.TempData().tree.AddEffects(EntityEffects.EF_NODRAW);
        }
    }
}
@registerModifier()
export class modifier_imba_tiny_tree extends BaseModifier_Plus {
    public attack_range: number;
    IsHidden(): boolean {
        return false;
    }
    IsBuff() {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS
        }
        return Object.values(funcs);
    } */
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_START,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND)
    CC_GetAttackSound(): string {
        if (this.GetCasterPlus().TempData().arcana_style) {
            return "Hero_Tiny_Prestige.Attack";
        } else {
            return "Hero_Tiny_Tree.Attack";
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        return this.attack_range;
    }
    BeCreated(p_0: any,): void {
        let caster = this.GetCasterPlus();
        if (caster != undefined) {
            let attack_range = this.GetSpecialValueFor("attack_range");
            let caster_range = caster.Script_GetAttackRange();
            if (caster_range > attack_range) {
                this.attack_range = (caster_range - attack_range);
            } else {
                this.attack_range = (attack_range - caster_range);
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetCasterPlus()) {
            if (keys.target != undefined && keys.target.IsBuilding()) {
                let caster = this.GetCasterPlus();
                let building_damage_modifier = caster.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_imba_tiny_tree_building", {});
                building_damage_modifier.SetStackCount(this.GetSpecialValueFor("bonus_damage_buildings"));
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        let caster = this.GetCasterPlus();
        if (IsServer()) {
            if (caster == keys.attacker && !keys.no_attack_cooldown) {
                if (caster.HasModifier("modifier_imba_tiny_tree_building")) {
                    caster.RemoveModifierByName("modifier_imba_tiny_tree_building");
                }
                if (keys.target != undefined) {
                    let splash_distance = caster.GetForwardVector() * this.GetSpecialValueFor("splash_distance") as Vector;
                    let splash_radius = this.GetSpecialValueFor("splash_radius");
                    let splash_damage = this.GetSpecialValueFor("splash_damage");
                    splash_distance.z = 0;
                    let damage_table: ApplyDamageOptions = {} as ApplyDamageOptions;
                    damage_table.attacker = caster;
                    damage_table.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL;
                    damage_table.damage = caster.GetAttackDamage() * (splash_damage / 100);
                    let enemies = FindUnitsInRadius(caster.GetTeam(), caster.GetAbsOrigin() + splash_distance as Vector, undefined, splash_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0, false);
                    for (const [_, enemy] of GameFunc.iPair(enemies)) {
                        if (enemy != keys.target) {
                            damage_table.victim = enemy;
                            ApplyDamage(damage_table);
                            EmitSoundOn("Hero_Tiny.Tree.Target", caster);
                            let nfx = ResHelper.CreateParticleEx(caster.TempData().tree_cleave_effect, ParticleAttachment_t.PATTACH_POINT, caster);
                            ParticleManager.SetParticleControl(nfx, 0, enemy.GetAbsOrigin());
                            ParticleManager.SetParticleControl(nfx, 1, enemy.GetAbsOrigin());
                            ParticleManager.SetParticleControlForward(nfx, 2, caster.GetForwardVector());
                            ParticleManager.ReleaseParticleIndex(nfx);
                        }
                    }
                }
                if (caster.HasModifier("modifier_imba_tiny_tree")) {
                    let modifier = caster.findBuff<modifier_imba_tiny_tree>("modifier_imba_tiny_tree");
                    let stacks = modifier.GetStackCount() - 1;
                    if (stacks > 0) {
                        modifier.SetStackCount(stacks);
                    } else {
                        caster.RemoveModifierByName("modifier_imba_tiny_tree");
                    }
                }
            }
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability_slot3 = caster.findAbliityPlus<imba_tiny_tree_throw>("imba_tiny_tree_throw");
            let ability_slot4 = caster.findAbliityPlus<imba_tiny_tree_grab>("imba_tiny_tree_grab");
            caster.SwapAbilities(ability_slot3.GetAbilityName(), ability_slot4.GetAbilityName(), false, true);
            this.GetAbilityPlus().UseResources(false, false, true);
            if (caster.HasTalent("special_bonus_imba_tiny_4")) {
                let ability = this.GetAbilityPlus();
                let cooldown_reduction = this.GetParentPlus().GetTalentValue("special_bonus_imba_tiny_4");
                let current_cooldown = ability.GetCooldownTime();
                let new_cooldown = current_cooldown - this.GetParentPlus().GetTalentValue("special_bonus_imba_tiny_4");
                ability.EndCooldown();
                this.GetAbilityPlus().StartCooldown(new_cooldown);
            }
            if (caster.TempData().tree != undefined) {
                caster.TempData().tree.Destroy();
            }
            if (caster.HasModifier("modifier_imba_tiny_tree_damage")) {
                caster.RemoveModifierByName("modifier_imba_tiny_tree_damage");
            }
            caster.RemoveModifierByName("modifier_imba_tiny_tree_animation");
        }
    }
}
@registerModifier()
export class modifier_imba_tiny_tree_damage extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsBuff() {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_tiny_tree_building extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsBuff() {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.GetStackCount();
    }
}
@registerAbility()
export class imba_tiny_tree_throw extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        if (!IsClient()) {
            return;
        }
        if (!this.GetCasterPlus().TempData().arcana_style) {
            return "tiny_toss_tree";
        }
        return "tiny/ti9_immortal/tiny_toss_tree_immortal";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let target_point = this.GetCursorPosition();
            let target = this.GetCursorTarget();
            let caster = this.GetCasterPlus();
            let caster_position = caster.GetAbsOrigin();
            let ability = caster.findAbliityPlus<imba_tiny_tree_throw>("imba_tiny_tree_throw");
            let travel_speed = ability.GetSpecialValueFor("travel_speed");
            let travel_distance = ability.GetSpecialValueFor("travel_distance");
            let collision_radius = ability.GetSpecialValueFor("collision_radius");
            let vision_distance = ability.GetSpecialValueFor("vision_distance");
            let bonus_damage = ability.GetSpecialValueFor("bonus_damage");
            let splash_radius = ability.GetSpecialValueFor("splash_radius");
            let splash_damage = ability.GetSpecialValueFor("splash_damage");
            let distance = (target_point - caster_position as Vector).Length2D();
            let direction = (target_point - caster_position as Vector).Normalized();
            let velocity = direction * travel_speed as Vector;
            if (target == undefined) {
                let projectile = {
                    EffectName: caster.TempData().tree_linear_effect,
                    Ability: this,
                    vSpawnOrigin: caster_position,
                    fDistance: distance,
                    fStartRadius: collision_radius,
                    fEndRadius: collision_radius,
                    Source: caster,
                    bHasFrontalCone: true,
                    bReplaceExisting: false,
                    bProvidesVision: true,
                    iVisionTeamNumber: caster.GetTeam(),
                    iVisionRadius: vision_distance,
                    bDrawsOnMinimap: false,
                    bVisibleToEnemies: true,
                    bDeleteOnHit: true,
                    iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                    iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                    iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                    vVelocity: Vector(velocity.x, velocity.y, 0),
                    fExpireTime: GameRules.GetGameTime() + 10,
                    ExtraData: {
                        splash_radius: splash_radius,
                        splash_damage: splash_damage
                    }
                }
                ProjectileManager.CreateLinearProjectile(projectile);
            } else {
                let projectile = {
                    EffectName: caster.TempData().tree_tracking_effect,
                    Ability: this,
                    fDistance: distance,
                    fStartRadius: collision_radius,
                    fEndRadius: collision_radius,
                    Source: caster,
                    Target: target,
                    iMoveSpeed: travel_speed,
                    bHasFrontalCone: true,
                    bReplaceExisting: false,
                    bProvidesVision: true,
                    iVisionTeamNumber: caster.GetTeam(),
                    iVisionRadius: vision_distance,
                    bDrawsOnMinimap: false,
                    bVisibleToEnemies: true,
                    bDeleteOnHit: true,
                    bDodgeable: true,
                    fExpireTime: GameRules.GetGameTime() + 10,
                    ExtraData: {
                        splash_radius: splash_radius,
                        splash_damage: splash_damage
                    }
                }
                ProjectileManager.CreateTrackingProjectile(projectile);
            }
            caster.RemoveModifierByName("modifier_imba_tiny_tree");
            caster.RemoveModifierByName("modifier_imba_tiny_tree_animation");
            caster.EmitSound(caster.TempData().tree_throw_sound);
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (IsServer()) {
            if (!target) {
                EmitSoundOnLocationWithCaster(location, this.GetCasterPlus().TempData().tree_throw_target_sound, this.GetCasterPlus());
                return undefined;
            }
            let hit_location = target.GetAbsOrigin();
            let caster = this.GetCasterPlus();
            target.EmitSound(caster.TempData().tree_throw_target_sound);
            caster.AddNewModifier(caster, this, "modifier_imba_tree_throw", {});
            let damage_table = {} as ApplyDamageOptions;
            damage_table.attacker = caster;
            damage_table.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL;
            damage_table.damage = caster.GetAttackDamage() * (ExtraData.splash_damage / 100);
            let enemies = FindUnitsInRadius(caster.GetTeam(), hit_location, undefined, ExtraData.splash_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy != target) {
                    damage_table.victim = enemy;
                    ApplyDamage(damage_table);
                    this.KnockBack(caster, enemy, location);
                } else {
                    this.KnockBack(caster, enemy, caster.GetAbsOrigin());
                }
            }
            caster.PerformAttack(target, true, true, true, true, true, false, true);
            caster.RemoveModifierByName("modifier_imba_tree_throw");
            return true;
        }
    }
    KnockBack(caster: IBaseNpc_Plus, target: IBaseNpc_Plus, knockback_center: Vector) {
        if (caster.HasTalent("special_bonus_imba_tiny_5")) {
            let knockback_direction = (target.GetAbsOrigin() - knockback_center as Vector).Normalized();
            let knockback_talent = caster.findAbliityPlus("special_bonus_imba_tiny_5");
            let knockback_duration = knockback_talent.GetSpecialValueFor("knockback_duration");
            let knockback_distance = knockback_talent.GetSpecialValueFor("knockback_distance");
            target.AddNewModifier(caster, this, "modifier_knockback", {
                center_x: knockback_center.x,
                center_y: knockback_center.y,
                center_z: knockback_center.z,
                duration: knockback_duration * (1 - target.GetStatusResistance()),
                knockback_duration: knockback_duration * (1 - target.GetStatusResistance()),
                knockback_distance: knockback_distance,
                knockback_height: 0
            });
        }
    }
}
@registerModifier()
export class modifier_imba_tiny_tree_throw_knockback extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true
        }
        return state;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_DISABLED;
    }
}
@registerModifier()
export class modifier_imba_tree_throw extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsBuff() {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        let ability = this.GetAbilityPlus();
        return ability.GetSpecialValueFor("bonus_damage");
    }
}
@registerAbility()
export class imba_tiny_rolling_stone extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        if (!IsClient()) {
            return;
        }
        if (!this.GetCasterPlus().TempData().arcana_style) {
            return "imba_tiny_rolling_stone";
        }
        return "imba_tiny_rolling_stone_immortal";
    }
    IsInnateAbility() {
        return true;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_tiny_rolling_stone";
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_tiny_8") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_tiny_8")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_tiny_8"), "modifier_special_bonus_imba_tiny_8", {});
        }
    }
}
@registerModifier()
export class modifier_imba_tiny_rolling_stone extends BaseModifier_Plus {
    public bonus_damage: number;
    public attackspeed: number;
    public movespeed: number;
    public modelscale: number;
    public gain: number;
    public talent8: boolean;
    public talent2: boolean;
    public internalTimer: number;
    public modelcap: number;
    public growscale: number;
    BeCreated(p_0: any,): void {
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage");
        this.attackspeed = this.GetSpecialValueFor("attackspeed_reduction");
        this.movespeed = this.GetSpecialValueFor("bonus_movespeed");
        this.modelscale = this.GetSpecialValueFor("bonus_model_scale");
        this.modelcap = this.GetSpecialValueFor("max_model_scale");
        this.gain = this.GetSpecialValueFor("stack_per_min");
        this.growscale = 0;
        this.talent8 = false;
        this.talent2 = false;
        this.internalTimer = 0;
        if (IsServer()) {
            this.StartIntervalThink(0.03);
        }
    }
    BeRefresh(p_0: any,): void {
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage");
        this.attackspeed = this.GetSpecialValueFor("attackspeed_reduction");
        this.movespeed = this.GetSpecialValueFor("bonus_movespeed");
        this.modelscale = this.GetSpecialValueFor("bonus_model_scale");
        this.modelcap = this.GetSpecialValueFor("max_model_scale");
        this.gain = this.GetSpecialValueFor("stack_per_min");
        this.growscale = 0;
    }
    OnIntervalThink(): void {
        if (this.GetParentPlus().IsIllusion()) {
            this.SetStackCount(0);
            return undefined;
        }
        if (this.GetParentPlus().IsMoving()) {
            this.internalTimer = this.internalTimer + 0.03 * this.gain;
        }
        if (this.internalTimer >= 60) {
            this.internalTimer = 0;
            this.IncrementStackCount();
        }
        if (!this.talent8) {
            if (this.GetParentPlus().HasTalent("special_bonus_imba_tiny_8")) {
                this.talent8 = true;
                this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetParentPlus().findAbliityPlus("special_bonus_imba_tiny_8"), "modifier_special_bonus_imba_tiny_8", {});
            }
        }
        if (!this.talent2) {
            if (this.GetParentPlus().HasTalent("special_bonus_imba_tiny_2")) {
                this.talent2 = true;
                this.SetStackCount(this.GetStackCount() + this.GetParentPlus().GetTalentValue("special_bonus_imba_tiny_2"));
            }
        }
    }
    IsHidden(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage(): number {
        return this.bonus_damage * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        if (!this.GetParentPlus().HasModifier("modifier_tiny_tree_grab") && !this.GetParentPlus().HasModifier("modifier_imba_tiny_tree") && !this.GetParentPlus().HasModifier("modifier_imba_tiny_tree_grab")) {
            return this.movespeed * this.GetStackCount();
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (!this.GetParentPlus().HasModifier("modifier_special_bonus_imba_tiny_8")) {
            return this.attackspeed * this.GetStackCount();
        } else {
            return 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE)
    CC_GetModifierModelScale(): number {
        if (IsServer()) {
            let scale = this.modelscale * this.GetStackCount() - this.growscale;
            if (scale > this.modelcap) {
                scale = this.modelcap;
            }
            return scale;
        }
    }
}
@registerAbility()
export class imba_tiny_avalanche extends BaseAbility_Plus {
    public direction: any;
    GetAbilityTextureName(): string {
        if (!IsClient()) {
            return;
        }
        if (!this.GetCasterPlus().TempData().arcana_style) {
            return "tiny_avalanche";
        }
        return "tiny/ti9_immortal/tiny_avalanche_immortal";
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    GetCooldown(nLevel: number): number {
        return super.GetCooldown(nLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_tiny_avalanche_cooldown");
    }
    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        let vPos = this.GetCursorPosition();
        let caster = this.GetCasterPlus();
        let delay = this.GetSpecialValueFor("projectile_duration");
        let casterPos = caster.GetAbsOrigin();
        let distance = (vPos - casterPos as Vector).Length2D();
        this.direction = (vPos - casterPos as Vector).Normalized();
        let velocity = distance / delay * this.direction as Vector;
        let ticks = 1 / this.GetSpecialValueFor("tick_interval");
        velocity.z = 0;
        let wearables = caster.GetChildren();
        for (const [_, wearable] of GameFunc.iPair(wearables)) {
            if (wearable.GetClassname() == "dota_item_wearable") {
                if (wearable.GetModelName().includes("tree")) {
                }
            }
        }
        caster.StartGesture(GameActivity_t.ACT_TINY_AVALANCHE);
        let info = {
            EffectName: this.GetCasterPlus().TempData().avalance_projectile_effect,
            Ability: this,
            vSpawnOrigin: this.GetCasterPlus().GetOrigin(),
            fStartRadius: 0,
            fEndRadius: 0,
            vVelocity: velocity,
            fDistance: distance,
            Source: this.GetCasterPlus(),
            iUnitTargetTeam: 0,
            iUnitTargetType: 0,
            ExtraData: {
                ticks: ticks,
                tick_count: this.GetSpecialValueFor("tick_count")
            }
        }
        ProjectileManager.CreateLinearProjectile(info);
        EmitSoundOnLocationWithCaster(vPos, "Ability.Avalanche", caster);
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, extradata: any) {
        let caster = this.GetCasterPlus();
        let grow_ability = caster.findAbliityPlus<imba_tiny_grow>("imba_tiny_grow");
        let duration = this.GetSpecialValueFor("stun_duration");
        let toss_mult = this.GetSpecialValueFor("toss_damage_multiplier");
        let radius = this.GetSpecialValueFor("radius");
        let interval = this.GetSpecialValueFor("tick_interval");
        let avalanche = ResHelper.CreateParticleEx(this.GetCasterPlus().TempData().avalanche_effect || "particles/units/heroes/hero_tiny/tiny_avalanche.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
        ParticleManager.SetParticleControl(avalanche, 0, vLocation);
        ParticleManager.SetParticleControl(avalanche, 1, Vector(radius, 1, radius));
        ParticleManager.SetParticleControlForward(avalanche, 0, this.direction || this.GetCasterPlus().GetForwardVector());
        let offset = 0;
        let ticks = extradata.ticks;
        if (this.GetCasterPlus().HasAbility("special_bonus_imba_tiny_3")) {
            offset = this.GetCasterPlus().GetTalentValue("special_bonus_imba_tiny_3");
            let projDuration = offset * 0.03 / (ticks * interval);
            let newLoc = vLocation;
            let distanceTravelled = 0;
            this.AddTimer(0, () => {
                ParticleManager.SetParticleControl(avalanche, 0, newLoc + projDuration as Vector);
                newLoc = newLoc + projDuration as Vector;
                distanceTravelled = distanceTravelled + projDuration;
                if (distanceTravelled < offset) {
                    return 0.03;
                }
            });
        }
        let hitLoc = vLocation;
        this.AddTimer(0, () => {
            let damage = this.GetTalentSpecialValueFor("avalanche_damage") / this.GetSpecialValueFor("tick_count");
            let enemies_tick = FindUnitsInRadius(caster.GetTeamNumber(), hitLoc, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0, false);
            for (const [_, enemy] of GameFunc.iPair(enemies_tick)) {
                if (enemy.HasModifier("modifier_tiny_toss_movement")) {
                    damage = damage * toss_mult;
                }
                ApplyDamage({
                    victim: enemy,
                    attacker: caster,
                    damage: damage,
                    damage_type: this.GetAbilityDamageType(),
                    ability: this
                });
                if (enemy.IsAlive()) {
                    enemy.AddNewModifier(caster, this, "modifier_generic_stunned", {
                        duration: duration
                    });
                }
            }
            hitLoc = hitLoc + offset / ticks as Vector;
            extradata.tick_count = extradata.tick_count - 1;
            if (extradata.tick_count > 0) {
                return interval;
            } else {
                ParticleManager.DestroyParticle(avalanche, false);
                ParticleManager.ReleaseParticleIndex(avalanche);
            }
        });
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_tiny_avalanche_passive";
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_tiny_avalanche_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_tiny_avalanche_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_tiny_avalanche_cooldown"), "modifier_special_bonus_imba_tiny_avalanche_cooldown", {});
        }
    }
}
@registerModifier()
export class modifier_imba_tiny_avalanche_passive extends BaseModifier_Plus {
    public chance: number;
    public prng: any;
    BeCreated(p_0: any,): void {
        this.chance = this.GetSpecialValueFor("passive_chance");
        this.prng = -10;
    }
    BeRefresh(p_0: any,): void {
        this.chance = this.GetSpecialValueFor("passive_chance");
    }
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (IsServer()) {
            if (params.attacker.PassivesDisabled()) {
                return undefined;
            }
            if (params.attacker == this.GetParentPlus() && !this.GetParentPlus().IsIllusion()) {
                if (GFuncRandom.PRD(this.chance, this)) {
                    let vPos = params.target.GetAbsOrigin();
                    let caster = this.GetCasterPlus();
                    let delay = this.GetSpecialValueFor("projectile_duration");
                    let casterPos = caster.GetAbsOrigin();
                    let distance = (vPos - casterPos as Vector).Length2D();
                    let direction = (vPos - casterPos as Vector).Normalized();
                    let velocity = distance / delay * direction as Vector;
                    velocity.z = 0;
                    let ticks = this.GetAbilityPlus().GetTalentSpecialValueFor("passive_ticks");
                    let info = {
                        EffectName: this.GetCasterPlus().TempData().avalance_projectile_effect,
                        Ability: this.GetAbilityPlus(),
                        vSpawnOrigin: this.GetCasterPlus().GetOrigin(),
                        fStartRadius: 0,
                        fEndRadius: 0,
                        vVelocity: velocity,
                        fDistance: distance,
                        Source: this.GetCasterPlus(),
                        iUnitTargetTeam: 0,
                        iUnitTargetType: 0,
                        ExtraData: {
                            ticks: ticks,
                            tick_count: ticks
                        }
                    }
                    ProjectileManager.CreateLinearProjectile(info);
                    EmitSoundOnLocationWithCaster(vPos, "Ability.Avalanche", caster);
                }
            }
        }
    }
}
@registerAbility()
export class imba_tiny_toss extends BaseAbility_Plus {
    public tossPosition: any;
    public tossTarget: any;
    GetAbilityTextureName(): string {
        if (!IsClient()) {
            return;
        }
        if (!this.GetCasterPlus().TempData().arcana_style) {
            return "tiny_toss";
        }
        return "tiny/ti9_immortal/tiny_toss_immortal";
    }
    IsNetherWardStealable() {
        return false;
    }
    CastFilterResultLocation(location: Vector): UnitFilterResult {
        if (!IsServer()) {
            return;
        }
        if (!this.GetAutoCastState() && GameFunc.GetCount(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("grab_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_CHECK_DISABLE_HELP, FindOrder.FIND_ANY_ORDER, false)) <= 1) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        } else {
            return UnitFilterResult.UF_SUCCESS;
        }
    }
    GetCustomCastErrorLocation(location: Vector): string {
        return "#dota_hud_error_cant_toss";
    }
    OnAbilityPhaseStart(): boolean {
        if (!this.GetAutoCastState() && GameFunc.GetCount(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("grab_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_CHECK_DISABLE_HELP, FindOrder.FIND_ANY_ORDER, false)) <= 1) {
            return false;
        } else {
            return true;
        }
    }
    OnUpgrade(): void {
        if (this.GetLevel() == 1) {
            this.ToggleAutoCast();
        }
    }
    OnSpellStart(): void {
        this.tossPosition = this.GetCursorPosition();
        let hTarget = this.GetCursorTarget();
        let caster = this.GetCasterPlus();
        let tossVictim = caster;
        let duration = this.GetSpecialValueFor("duration");
        if (!hTarget) {
            let targets = FindUnitsInRadius(caster.GetTeamNumber(), this.tossPosition, undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 1, false);
            for (const [_, target] of GameFunc.iPair(targets)) {
                hTarget = target;
                return;
            }
        }
        if (hTarget) {
            this.tossPosition = hTarget.GetAbsOrigin();
            this.tossTarget = hTarget;
        } else {
            this.tossTarget = undefined;
        }
        let vLocation = this.tossPosition;
        let kv = {
            vLocX: vLocation.x,
            vLocY: vLocation.y,
            vLocZ: vLocation.z,
            duration: duration,
            damage: this.GetSpecialValueFor("toss_damage")
        }
        let tossVictims = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, this.GetSpecialValueFor("grab_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_CHECK_DISABLE_HELP, 1, false);
        for (const [_, victim] of GameFunc.iPair(tossVictims)) {
            if ((PlayerResource.IsDisableHelpSetForPlayerID(victim.GetPlayerID(), this.GetCasterPlus().GetPlayerID()))) {
                tossVictims.splice(_, 1);
            }
        }
        for (const [_, victim] of GameFunc.iPair(tossVictims)) {
            if (victim != caster) {
                victim.AddNewModifier(caster, this, "modifier_tiny_toss_movement", kv);
                if (!this.GetCasterPlus().HasTalent("special_bonus_imba_tiny_7")) {
                    return;
                } else {
                    kv.damage = this.GetSpecialValueFor("multitoss_damage");
                }
            }
        }
        if (GameFunc.GetCount(tossVictims) <= 1) {
            caster.AddNewModifier(caster, this, "modifier_tiny_toss_movement", kv);
        }
        caster.StartGesture(GameActivity_t.ACT_TINY_TOSS);
        EmitSoundOn("Ability.TossThrow", this.GetCasterPlus());
    }
    GetCastRange(vLocation: Vector, hTarget: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("cast_range");
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
}
@registerModifier()
export class modifier_tiny_toss_movement extends BaseModifierMotionBoth_Plus {
    public toss_minimum_height_above_lowest: any;
    public toss_minimum_height_above_highest: any;
    public toss_acceleration_z: any;
    public toss_max_horizontal_acceleration: any;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public vStartPosition: any;
    public flCurrentTimeHoriz: any;
    public flCurrentTimeVert: any;
    public vLoc: any;
    public damage: number;
    public vLastKnownTargetPos: any;
    public flInitialVelocityZ: any;
    public flPredictedTotalTime: any;
    public vHorizontalVelocity: any;
    public toss_land_commenced: any;
    IsDebuff(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }

    GetPriority() {
        return 2;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        this.toss_minimum_height_above_lowest = 500;
        this.toss_minimum_height_above_highest = 100;
        this.toss_acceleration_z = 4000;
        this.toss_max_horizontal_acceleration = 3000;
        if (IsServer()) {
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            EmitSoundOn("Hero_Tiny.Toss.Target", this.GetParentPlus());
            this.vStartPosition = GetGroundPosition(this.GetParentPlus().GetOrigin(), this.GetParentPlus());
            this.flCurrentTimeHoriz = 0.0;
            this.flCurrentTimeVert = 0.0;
            this.vLoc = Vector(kv.vLocX, kv.vLocY, kv.vLocZ);
            this.damage = kv.damage;
            this.vLastKnownTargetPos = this.vLoc;
            let duration = this.GetSpecialValueFor("duration");
            let flDesiredHeight = this.toss_minimum_height_above_lowest * duration * duration;
            let flLowZ = math.min(this.vLastKnownTargetPos.z, this.vStartPosition.z);
            let flHighZ = math.max(this.vLastKnownTargetPos.z, this.vStartPosition.z);
            let flArcTopZ = math.max(flLowZ + flDesiredHeight, flHighZ + this.toss_minimum_height_above_highest);
            let flArcDeltaZ = flArcTopZ - this.vStartPosition.z;
            this.flInitialVelocityZ = math.sqrt(2.0 * flArcDeltaZ * this.toss_acceleration_z);
            let flDeltaZ = this.vLastKnownTargetPos.z - this.vStartPosition.z;
            let flSqrtDet = math.sqrt(math.max(0, (this.flInitialVelocityZ * this.flInitialVelocityZ) - 2.0 * this.toss_acceleration_z * flDeltaZ));
            this.flPredictedTotalTime = math.max((this.flInitialVelocityZ + flSqrtDet) / this.toss_acceleration_z, (this.flInitialVelocityZ - flSqrtDet) / this.toss_acceleration_z);
            this.vHorizontalVelocity = (this.vLastKnownTargetPos - this.vStartPosition) / this.flPredictedTotalTime;
            this.vHorizontalVelocity.z = 0.0;
            if (!this.BeginMotionOrDestroy()) { return; }


        }
    }

    TossLand() {
        if (IsServer()) {
            if (this.toss_land_commenced) {
                return;
            }
            this.toss_land_commenced = true;
            let caster = this.GetCasterPlus();
            let rolling_stone_modifier = caster.findBuff<modifier_imba_tiny_rolling_stone>("modifier_imba_tiny_rolling_stone");
            let radius = this.GetSpecialValueFor("radius");
            if (rolling_stone_modifier && caster.HasAbility("imba_tiny_grow")) {
                radius = radius + rolling_stone_modifier.GetStackCount() * caster.findAbliityPlus<imba_tiny_grow>("imba_tiny_grow").GetSpecialValueFor("rolling_stones_aoe");
            }
            GridNav.DestroyTreesAroundPoint(this.vLastKnownTargetPos, radius, true);
            let victims = FindUnitsInRadius(caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, 0, 1, false);
            for (const [_, victim] of GameFunc.iPair(victims)) {
                let damage = this.damage;
                if (victim == this.parent) {
                    let damage_multiplier = 1 + this.ability.GetSpecialValueFor("bonus_damage_pct") / 100;
                    if (rolling_stone_modifier) {
                        damage_multiplier = damage_multiplier + rolling_stone_modifier.GetStackCount() / 100;
                    }
                    damage = damage * damage_multiplier;
                }
                if (victim.IsBuilding()) {
                    damage = damage * this.ability.GetSpecialValueFor("building_dmg") * 0.01;
                    ApplyDamage({
                        victim: victim,
                        attacker: caster,
                        damage: damage,
                        damage_type: this.ability.GetAbilityDamageType(),
                        ability: this.ability
                    });
                } else {
                    ApplyDamage({
                        victim: victim,
                        attacker: caster,
                        damage: damage,
                        damage_type: this.ability.GetAbilityDamageType(),
                        ability: this.ability
                    });
                }
            }
            if (this.parent == caster) {
                ApplyDamage({
                    victim: caster,
                    attacker: caster,
                    damage: caster.GetMaxHealth() * this.ability.GetSpecialValueFor("self_dmg_pct") * 0.01,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS,
                    ability: this.ability
                });
            }
            EmitSoundOn("Ability.TossImpact", this.parent);
            this.parent.SetUnitOnClearGround();
            this.AddTimer(FrameTime(), () => {
                ResolveNPCPositions(this.parent.GetAbsOrigin(), 150);
            });
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.parent.SetUnitOnClearGround();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation( /** params */): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_tiny/tiny_toss_blur.vpcf";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (IsServer()) {
            if (this.GetCasterPlus() != undefined && this.GetParentPlus() != undefined) {
                if (this.GetCasterPlus().GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && (!this.GetParentPlus().IsMagicImmune())) {
                    return {
                        [modifierstate.MODIFIER_STATE_STUNNED]: true
                    };
                } else {
                    return {
                        [modifierstate.MODIFIER_STATE_ROOTED]: true
                    };
                }
            }
        }
        return {};
    }
    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            this.flCurrentTimeHoriz = math.min(this.flCurrentTimeHoriz + dt, this.flPredictedTotalTime);
            let t = this.flCurrentTimeHoriz / this.flPredictedTotalTime;
            let vStartToTarget = this.vLastKnownTargetPos - this.vStartPosition;
            let vDesiredPos = this.vStartPosition + t * vStartToTarget;
            let vOldPos = me.GetOrigin();
            let vToDesired = vDesiredPos - vOldPos as Vector;
            vToDesired.z = 0.0;
            let vDesiredVel = vToDesired / dt;
            let vVelDif = vDesiredVel - this.vHorizontalVelocity as Vector;
            let flVelDif = vVelDif.Length2D();
            vVelDif = vVelDif.Normalized();
            let flVelDelta = math.min(flVelDif, this.toss_max_horizontal_acceleration);
            this.vHorizontalVelocity = this.vHorizontalVelocity + vVelDif * flVelDelta * dt;
            let vNewPos = vOldPos + this.vHorizontalVelocity * dt as Vector;
            me.SetOrigin(vNewPos);
        }
    }
    UpdateVerticalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            this.flCurrentTimeVert = this.flCurrentTimeVert + dt;
            let bGoingDown = (-this.toss_acceleration_z * this.flCurrentTimeVert + this.flInitialVelocityZ) < 0;
            let vNewPos = me.GetOrigin();
            vNewPos.z = this.vStartPosition.z + (-0.5 * this.toss_acceleration_z * (this.flCurrentTimeVert * this.flCurrentTimeVert) + this.flInitialVelocityZ * this.flCurrentTimeVert);
            let flGroundHeight = GetGroundHeight(vNewPos, this.GetParentPlus());
            let bLanded = false;
            if ((vNewPos.z < flGroundHeight && bGoingDown == true)) {
                vNewPos.z = flGroundHeight;
                bLanded = true;
            }
            me.SetOrigin(vNewPos);
            if (bLanded == true) {
                this.TossLand();
            }
        }
    }
}
@registerModifier()
export class modifier_tiny_toss_scepter_bounce extends BaseModifierMotionVertical_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public scepter_bounce_damage_pct: number;
    public toss_damage: number;
    public bounce_duration: number;
    public time: number;
    public toss_z: any;
    IsDebuff(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }

    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            if (!this.BeginMotionOrDestroy()) {
                return;
            }
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.scepter_bounce_damage_pct = this.ability.GetSpecialValueFor("scepter_bounce_damage_pct");
            this.toss_damage = this.ability.GetSpecialValueFor("toss_damage");
            EmitSoundOn("Hero_Tiny.Toss.Target", this.GetParentPlus());
            this.bounce_duration = this.GetSpecialValueFor("scepter_bounce_duration");
            this.time = 0;
            this.toss_z = 0;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation( /** params */): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_tiny/tiny_toss_blur.vpcf";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (IsServer()) {
            if (this.GetCasterPlus() != undefined && this.GetParentPlus() != undefined) {
                if (this.GetCasterPlus().GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && (!this.GetParentPlus().IsMagicImmune())) {
                    let state = {
                        [modifierstate.MODIFIER_STATE_STUNNED]: true
                    }
                    return state;
                } else {
                    let state = {
                        [modifierstate.MODIFIER_STATE_ROOTED]: true
                    }
                    return state;
                }
            }
        }
        let state = {}
        return state;
    }

    UpdateVerticalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            if (this.time < this.bounce_duration) {
                this.time = this.time + dt;
                if (this.bounce_duration / 2 > this.time) {
                    this.toss_z = this.toss_z + 25;
                    this.parent.SetAbsOrigin(GetGroundPosition(this.parent.GetAbsOrigin(), this.parent) + Vector(0, 0, this.toss_z) as Vector);
                } else if (this.parent.GetAbsOrigin().z > 0) {
                    this.toss_z = this.toss_z - 25;
                    this.parent.SetAbsOrigin(GetGroundPosition(this.parent.GetAbsOrigin(), this.parent) + Vector(0, 0, this.toss_z) as Vector);
                }
            } else {
                this.parent.InterruptMotionControllers(true);
                this.Destroy();
            }
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            let damage = this.toss_damage * this.scepter_bounce_damage_pct * 0.01;
            let radius = this.GetSpecialValueFor("radius") + this.caster.findBuff<modifier_imba_tiny_rolling_stone>("modifier_imba_tiny_rolling_stone").GetStackCount() * this.caster.findAbliityPlus<imba_tiny_grow>("imba_tiny_grow").GetSpecialValueFor("rolling_stones_aoe");
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                ApplyDamage({
                    victim: enemy,
                    attacker: this.caster,
                    damage: damage,
                    damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
                    ability: this.GetAbilityPlus()
                });
            }
            this.GetParentPlus().SetUnitOnClearGround();
        }
    }
}
@registerAbility()
export class imba_tiny_craggy_exterior extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_tiny_craggy_exterior_passive";
    }
}
@registerModifier()
export class modifier_imba_tiny_craggy_exterior_passive extends BaseModifier_Plus {
    public chance: number;
    public damage: number;
    public duration: number;
    public armor: any;
    public prng: any;
    public reduction_duration: number;
    BeCreated(p_0: any,): void {
        this.chance = this.GetSpecialValueFor("stun_chance");
        this.damage = this.GetSpecialValueFor("damage");
        this.duration = this.GetSpecialValueFor("stun_duration");
        this.armor = this.GetSpecialValueFor("bonus_armor");
        this.prng = -10;
    }
    BeRefresh(p_0: any,): void {
        this.chance = this.GetSpecialValueFor("stun_chance");
        this.damage = this.GetSpecialValueFor("damage");
        this.duration = this.GetSpecialValueFor("stun_duration");
        this.armor = this.GetSpecialValueFor("bonus_armor");
        this.reduction_duration = this.GetSpecialValueFor("reduction_duration");
    }
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.armor;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (IsServer()) {
            if (params.target == this.GetParentPlus()) {
                let caster = this.GetCasterPlus();
                if (caster.PassivesDisabled() || params.attacker.IsBuilding() || params.attacker.IsMagicImmune()) {
                    return undefined;
                }
                if (GFuncRandom.PRD(this.chance, this)) {
                    if (this.GetParentPlus().HasTalent("special_bonus_imba_tiny_4")) {
                        EmitSoundOn("Hero_Tiny.CraggyExterior", this.GetCasterPlus());
                        let radius = this.GetParentPlus().GetTalentValue("special_bonus_imba_tiny_4");
                        let avalanche = ResHelper.CreateParticleEx(caster.TempData().avalanche_effect || "particles/units/heroes/hero_tiny/tiny_avalanche.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, params.attacker);
                        ParticleManager.SetParticleControl(avalanche, 0, params.attacker.GetAbsOrigin());
                        ParticleManager.SetParticleControl(avalanche, 1, Vector(radius, 1, radius));
                        this.AddTimer(0.2, () => {
                            ParticleManager.DestroyParticle(avalanche, false);
                            ParticleManager.ReleaseParticleIndex(avalanche);
                        });
                        let craggy_targets = FindUnitsInRadius(caster.GetTeamNumber(), params.attacker.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0, false);
                        for (const [_, target] of GameFunc.iPair(craggy_targets)) {
                            ApplyDamage({
                                victim: target,
                                attacker: caster,
                                damage: this.damage,
                                damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
                                ability: this.GetAbilityPlus()
                            });
                            target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_generic_stunned", {
                                duration: this.duration * (1 - target.GetStatusResistance())
                            });
                            EmitSoundOn("Hero_Tiny.CraggyExterior.Stun", params.attacker);
                        }
                    } else {
                        ApplyDamage({
                            victim: params.attacker,
                            attacker: caster,
                            damage: this.damage,
                            damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
                            ability: this.GetAbilityPlus()
                        });
                        params.attacker.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_generic_stunned", {
                            duration: this.duration * (1 - params.attacker.GetStatusResistance())
                        });
                        let craggy = ResHelper.CreateParticleEx("particles/units/heroes/hero_tiny/tiny_craggy_hit.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetCasterPlus());
                        ParticleManager.SetParticleControl(craggy, 0, this.GetCasterPlus().GetAbsOrigin());
                        ParticleManager.SetParticleControl(craggy, 1, params.attacker.GetAbsOrigin());
                        ParticleManager.ReleaseParticleIndex(craggy);
                        EmitSoundOn("Hero_Tiny.CraggyExterior", this.GetCasterPlus());
                        EmitSoundOn("Hero_Tiny.CraggyExterior.Stun", params.attacker);
                    }
                }
                if (!params.attacker.HasModifier("modifier_craggy_exterior_blunt")) {
                    params.attacker.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_craggy_exterior_blunt", {
                        duration: this.reduction_duration * (1 - params.attacker.GetStatusResistance())
                    });
                }
                let modifier_blunt_handler = params.attacker.findBuff<modifier_craggy_exterior_blunt>("modifier_craggy_exterior_blunt");
                if (modifier_blunt_handler) {
                    modifier_blunt_handler.IncrementStackCount();
                    modifier_blunt_handler.ForceRefresh();
                }
            }
        }
    }
}
@registerModifier()
export class modifier_craggy_exterior_blunt extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public reduction: any;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.reduction = this.GetSpecialValueFor("damage_reduction");
    }

    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        let reduction = this.reduction + this.caster.GetTalentValue("special_bonus_imba_tiny_5");
        return reduction * this.GetStackCount();
    }
}
@registerAbility()
export class imba_tiny_grow extends BaseAbility_Plus {
    public head: any;
    public rarm: any;
    public larm: any;
    public body: any;
    GetAbilityTextureName(): string {
        if (!this.GetCasterPlus().TempData().arcana_style) {
            return "tiny_grow";
        }
        return "tiny/ti9_immortal/tiny_grow_prestige";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_tiny_grow_passive";
    }
    OnOwnerSpawned(): void {
        this.SetupModel(this.GetLevel() + 1);
    }
    OnUpgrade(): void {
        if (!IsServer()) {
            return;
        }
        ResHelper.LoadUnitRes(this.GetCasterPlus());
        let reapply_craggy = false;
        let rolling_stone = this.GetCasterPlus().findBuff<modifier_imba_tiny_rolling_stone>("modifier_imba_tiny_rolling_stone");
        rolling_stone.growscale = this.GetSpecialValueFor("rolling_stone_scale_reduction");
        let old_stacks = this.GetLevelSpecialValueFor("rolling_stones_stacks", this.GetLevel() - 2);
        let new_stacks = this.GetLevelSpecialValueFor("rolling_stones_stacks", this.GetLevel() - 1);
        if (old_stacks == new_stacks) {
            old_stacks = 0;
        }
        rolling_stone.SetStackCount(rolling_stone.GetStackCount() - old_stacks + new_stacks);
        let level = this.GetLevel() + 1;
        this.SetupModel(level);
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_TINY_GROWL);
        EmitSoundOn("Tiny.Grow", this.GetCasterPlus());
        // let grow_pfx_name = this.GetCasterPlus().TempData<string>().grow_effect.replace("lvl1", "lvl" + level);
        let grow = ResHelper.CreateParticleEx(this.GetCasterPlus().TempData().grow_effect, ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControl(grow, 0, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(grow);
        if (this.GetCasterPlus().TempData().ambient_pfx) {
            ParticleManager.DestroyParticle(this.GetCasterPlus().TempData().ambient_pfx, true);
            ParticleManager.ReleaseParticleIndex(this.GetCasterPlus().TempData().ambient_pfx);
        }
        let pfx_name = this.GetCasterPlus().TempData<string>().ambient_pfx_effect.replace("lvl1", "lvl" + level);
        this.GetCasterPlus().TempData().ambient_pfx = ResHelper.CreateParticleEx(pfx_name, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
    }
    SetupModel(level: number) {
        let model_path = "models/heroes/tiny_0" + level + "/tiny_0" + level;
        if (level < 5) {
            if (string.find(this.GetCasterPlus().GetModelName(), "tiny_prestige")) {
                this.GetCasterPlus().SetOriginalModel("models/items/tiny/tiny_prestige/tiny_prestige_lvl_0" + level + ".vmdl");
                this.GetCasterPlus().SetModel("models/items/tiny/tiny_prestige/tiny_prestige_lvl_0" + level + ".vmdl");
            } else {
                this.GetCasterPlus().SetOriginalModel(model_path + ".vmdl");
                this.GetCasterPlus().SetModel(model_path + ".vmdl");
                UTIL_Remove(this.head);
                UTIL_Remove(this.rarm);
                UTIL_Remove(this.larm);
                UTIL_Remove(this.body);
                this.head = SpawnEntityFromTableSynchronous("prop_dynamic", {
                    model: model_path + "_head.vmdl"
                });
                this.rarm = SpawnEntityFromTableSynchronous("prop_dynamic", {
                    model: model_path + "_right_arm.vmdl"
                });
                this.larm = SpawnEntityFromTableSynchronous("prop_dynamic", {
                    model: model_path + "_left_arm.vmdl"
                });
                this.body = SpawnEntityFromTableSynchronous("prop_dynamic", {
                    model: model_path + "_body.vmdl"
                });
                this.head.FollowEntity(this.GetCasterPlus(), true);
                this.rarm.FollowEntity(this.GetCasterPlus(), true);
                this.larm.FollowEntity(this.GetCasterPlus(), true);
                this.body.FollowEntity(this.GetCasterPlus(), true);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_tiny_grow_passive extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING,
            5: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.GetSpecialValueFor("status_resistance");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.GetSpecialValueFor("bonus_armor");
    }
}
@registerModifier()
export class modifier_special_bonus_imba_tiny_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_tiny_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_tiny_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_tiny_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_tiny_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_tiny_avalanche_cooldown extends BaseModifier_Plus {
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
