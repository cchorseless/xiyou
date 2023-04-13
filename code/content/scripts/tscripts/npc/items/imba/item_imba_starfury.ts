
import { GameFunc } from "../../../GameFunc";
import { ProjectileHelper } from "../../../helper/ProjectileHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

function ProjectileHit(params: any) {
    ApplyDamage({
        attacker: params.hCaster,
        victim: params.hTarget,
        ability: null,
        damage: params.damage,
        damage_type: params.damage_type,
        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_USE_COMBAT_PROFICIENCY + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_DAMAGE_MULTIPLIERS
    })

}

// 自定义
@registerAbility()
export class item_imba_shotgun extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_shotgun_passive";
    }

}
@registerModifier()
export class modifier_imba_shotgun_passive extends BaseModifier_Plus {
    public item: any;
    public parent: IBaseNpc_Plus;
    public bonus_damage: number;
    public bonus_as: number;
    public bonus_agi: number;
    public projectile_speed: number;
    public agility_pct_ranged: number;
    public agility_pct_melee: number;
    public ranged_proj_range: number;
    public ranged_proj_radius: number;
    public ranged_proj_angle: number;
    public ranged_proj_stun: number;
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
    BeDestroy(): void {
        this.CheckUnique(false);
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.item = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        if (this.parent.IsRealUnit() && this.item) {
            this.bonus_damage = this.item.GetSpecialValueFor("bonus_damage");
            this.bonus_as = this.item.GetSpecialValueFor("bonus_as");
            this.bonus_agi = this.item.GetSpecialValueFor("bonus_agi");
            this.CheckUnique(true);
            if (!this.parent.IsIllusion()) {
                this.projectile_speed = this.item.GetSpecialValueFor("projectile_speed");
                this.agility_pct_ranged = this.item.GetSpecialValueFor("agility_pct_ranged") * 0.01;
                this.agility_pct_melee = this.item.GetSpecialValueFor("agility_pct_melee") * 0.01;
                this.ranged_proj_range = this.item.GetSpecialValueFor("ranged_proj_range");
                this.ranged_proj_radius = this.item.GetSpecialValueFor("ranged_proj_radius");
                this.ranged_proj_angle = this.item.GetSpecialValueFor("ranged_proj_angle");
                this.ranged_proj_stun = this.item.GetSpecialValueFor("ranged_proj_stun");
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            4: Enum_MODIFIER_EVENT.ON_ATTACK
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_as;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.bonus_agi;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(params: ModifierAttackEvent): void {
        if (params.attacker == this.parent  /**&& this.parent.IsRealUnit() */ && this.parent.GetAgility) {
            if (this.item.IsCooldownReady() && (this.CheckUniqueValue(1, ["modifier_imba_starfury_passive"]) == 1)) {
                let hero = this.parent;
                let damage: number;
                if (hero.IsRangedAttacker()) {
                    damage = hero.GetAgility() * this.agility_pct_ranged;
                } else {
                    damage = hero.GetAgility() * this.agility_pct_melee;
                }
                let damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL;
                let stun_duration = this.ranged_proj_stun;
                if (hero.HasItemInInventory("item_imba_spell_fencer")) {
                    damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
                }
                let vColor = hero.GetFittingColor();
                if (hero.IsRangedAttacker()) {
                    let hero_pos = hero.GetAbsOrigin();
                    let target_pos = params.target.GetAbsOrigin();
                    let main_direction;
                    if (target_pos == hero_pos) {
                        main_direction = hero.GetForwardVector();
                    } else {
                        main_direction = (target_pos - hero_pos as Vector).Normalized();
                    }
                    let hits = 0;
                    let last_target: IBaseNpc_Plus;
                    for (let i = 0; i < 3; i++) {
                        let direction = main_direction;
                        if (i == 1) {
                            direction = GFuncVector.RotateVector2D(direction, this.ranged_proj_angle, true);
                        } else if (i == 2) {
                            direction = GFuncVector.RotateVector2D(direction, -this.ranged_proj_angle, true);
                        }
                        let end_loc = hero_pos + (direction * this.ranged_proj_range) + Vector(0, 0, 90);
                        let projectile: ILineProjectile = {
                            EffectName: "particles/hero/phantom_lancer/sun_catcher_projectile.vpcf",
                            vSpawnOriginInfo: {
                                unit: hero,
                                attach: "attach_attack1",
                                offset: Vector(0, 0, 90)
                            },
                            fDistance: this.ranged_proj_range,
                            fStartRadius: this.ranged_proj_radius,
                            fEndRadius: this.ranged_proj_radius,
                            Source: hero,
                            fExpireTime: 8.0,
                            vVelocity: direction * this.projectile_speed as Vector,
                            UnitBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_DESTROY,
                            bMultipleHits: false,
                            bIgnoreSource: true,
                            TreeBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            bCutTrees: false,
                            bTreeFullCollision: false,
                            WallBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            GroundBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            fGroundOffset: 80,
                            nChangeMax: 1,
                            bRecreateOnChange: false,
                            bZCheck: false,
                            bGroundLock: true,
                            bProvidesVision: false,
                            bFlyingVision: false,
                            ControlPoints: [
                                [0, hero_pos + Vector(0, 0, 90) as Vector],
                                [1, end_loc as Vector],
                                [15, Vector(128, 24, 24)],
                                [16, Vector(255, 0, 0)],
                            ],
                            UnitTest: GHandler.create(this, (pj, unit) => {
                                return !unit.IsDummyUnit() && unit.GetTeamNumber() != hero.GetTeamNumber();
                            }),
                            OnUnitHit: GHandler.create(this, (pj, unit) => {
                                if (last_target == undefined) {
                                    last_target = unit;
                                } else if (last_target != unit) {
                                    hits = -1;
                                }
                                hits = hits + 1;
                                if (hits == 3) {
                                    unit.AddNewModifier(hero, this.item, "modifier_generic_stunned", {
                                        duration: stun_duration
                                    });
                                }
                                params.damage = damage;
                                params.damage_type = damage_type;
                                (params as any).hCaster = hero;
                                (params as any).hTarget = unit;
                                ProjectileHit(params);
                            })
                        }
                        ProjectileHelper.LineProjectiles.CreateProjectile(projectile);
                    }
                } else {
                    params.damage = damage;
                    params.damage_type = damage_type;
                    (params as any).hCaster = hero;
                    (params as any).hTarget = params.target;
                    ProjectileHit(params,);
                }
                let bullet_pfx = ResHelper.CreateParticleEx("particles/item/starfury/shotgun_bulletcase_charlie.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
                ParticleManager.SetParticleControl(bullet_pfx, 0, hero.GetAttachmentOrigin(DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_1));
                ParticleManager.SetParticleControl(bullet_pfx, 4, vColor);
                this.item.UseResources(false, false, true);
                StartSoundEventFromPosition("Imba.Shotgun", hero.GetAbsOrigin());
            }
        }
    }
}
@registerAbility()
export class item_imba_starfury extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_starfury_passive";
    }

}
@registerModifier()
export class modifier_imba_starfury_passive extends BaseModifier_Plus {
    public item: any;
    public parent: IBaseNpc_Plus;
    public bonus_damage: number;
    public bonus_as: number;
    public bonus_agi: number;
    public range: number;
    public proc_chance: number;
    public proc_duration: number;
    public projectile_speed: number;
    public agility_pct: number;
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
    BeDestroy(): void {
        this.CheckUnique(false);
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.item = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        if (this.parent.IsRealUnit() && this.item) {
            this.bonus_damage = this.item.GetSpecialValueFor("bonus_damage");
            this.bonus_as = this.item.GetSpecialValueFor("bonus_as");
            this.bonus_agi = this.item.GetSpecialValueFor("bonus_agi");
            this.range = this.item.GetSpecialValueFor("range");
            this.proc_chance = this.item.GetSpecialValueFor("proc_chance");
            this.proc_duration = this.item.GetSpecialValueFor("proc_duration");
            this.projectile_speed = this.item.GetSpecialValueFor("projectile_speed");
            this.agility_pct = this.item.GetSpecialValueFor("agility_pct") * 0.01;
            this.CheckUnique(true);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            4: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            5: Enum_MODIFIER_EVENT.ON_ATTACK_FAIL
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_as;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.bonus_agi;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (params.attacker == this.parent && !this.parent.IsIllusion() && this.parent.GetAgility) {
            if ((GFuncRandom.PRD(this.proc_chance, this.item) && (this.CheckUniqueValue(1, []) == 1) && (this.parent.IsClone() || this.parent.IsRealUnit()))) {
                this.parent.AddNewModifier(this.parent, this.item, "modifier_imba_starfury_buff_increase", {
                    duration: this.proc_duration
                });
            }
            if (this.item.IsCooldownReady() && (this.CheckUniqueValue(1, []) == 1)) {
                let target_loc = params.target.GetAbsOrigin();
                StartSoundEventFromPosition("Ability.StarfallImpact", target_loc);
                let damage = this.parent.GetAgility() * this.agility_pct;
                let damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL;
                if (this.parent.HasItemInInventory("item_imba_spell_fencer")) {
                    damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
                }
                let enemies = FindUnitsInRadius(this.parent.GetTeamNumber(), target_loc, undefined, this.range, this.item.GetAbilityTargetTeam(), this.item.GetAbilityTargetType(), this.item.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
                let bFound = false;
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    if (enemy != params.target) {
                        let damager = this.parent;
                        let projectile: ITrackingProjectile = {
                            hTarget: enemy,
                            hCaster: damager,
                            vColor: this.parent.GetFittingColor(),
                            vColor2: this.parent.GetHeroColorSecondary(),
                            hAbility: this.GetItemPlus(),
                            iMoveSpeed: this.projectile_speed,
                            EffectName: "particles/item/starfury/starfury_projectile.vpcf",
                            flRadius: 1,
                            bDodgeable: true,
                            bDestroyOnDodge: true,
                            vSpawnOrigin: target_loc,
                            OnProjectileHitUnit: GHandler.create(this, (params, projectileID) => {
                                params.damage = damage;
                                params.damage_type = damage_type;
                                ProjectileHit(params);
                            })
                        }
                        ProjectileHelper.TrackingProjectiles.Projectile(projectile);
                        if (!bFound) {
                            bFound = true;
                            this.item.UseResources(false, false, true);
                        }
                    }
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_FAIL)
    CC_OnAttackFail(params: ModifierAttackEvent): void {
        this.OnAttackLanded(params);
    }
}
@registerModifier()
export class modifier_imba_starfury_buff_increase extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        let hItem = this.GetItemPlus();
        let hParent = this.GetParentPlus();
        if (hItem && hParent && IsServer()) {
            let agility = hParent.GetAgility();
            this.SetStackCount(hItem.GetSpecialValueFor("proc_bonus") * 0.01 * agility);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.GetStackCount();
    }
}
