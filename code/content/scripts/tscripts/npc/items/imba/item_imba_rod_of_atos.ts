
import { GameFunc } from "../../../GameFunc";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 阿托斯之棍
@registerAbility()
export class item_imba_rod_of_atos extends BaseItem_Plus {
    public caster: IBaseNpc_Plus;
    public duration: number;
    public tooltip_range: number;
    public projectile_speed: number;
    public curtain_fire_radius: number;
    public curtain_fire_length: any;
    public curtain_fire_shot_count: number;
    public curtain_fire_shot_per_hero_count: number;
    public curtain_fire_delay: number;
    public curtain_fire_speed: number;
    public curtain_fire_activation_charge: any;
    public curtain_fire_radius_second: number;
    public curtain_fire_projectile_radius: number;
    initialized: Boolean;
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_rod_of_atos";
    }
    GetAbilityTextureName(): string {
        if (this.GetLevel() == 2) {
            if (this.GetCasterPlus() && this.GetCasterPlus().findBuffStack("modifier_item_imba_rod_of_atos", this.GetCasterPlus()) == this.GetSpecialValueFor("curtain_fire_activation_charge")) {
                return "imba/rod_of_atos_2_cfs";
            } else {
                return "imba/rod_of_atos_2";
            }
        } else {
            return "imba/rod_of_atos";
        }
    }
    GetAOERadius(): number {
        if (this.GetLevel() >= 2 && this.GetCasterPlus().findBuffStack("modifier_item_imba_rod_of_atos", this.GetCasterPlus()) == this.GetSpecialValueFor("curtain_fire_activation_charge")) {
            return this.GetSpecialValueFor("curtain_fire_radius");
        } else {
            return 0;
        }
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.duration = this.GetSpecialValueFor("duration");
        this.tooltip_range = this.GetSpecialValueFor("tooltip_range");
        this.projectile_speed = this.GetSpecialValueFor("projectile_speed");
        this.curtain_fire_radius = this.GetSpecialValueFor("curtain_fire_radius");
        this.curtain_fire_length = this.GetSpecialValueFor("curtain_fire_length");
        this.curtain_fire_shot_count = this.GetSpecialValueFor("curtain_fire_shot_count");
        this.curtain_fire_shot_per_hero_count = this.GetSpecialValueFor("curtain_fire_shot_per_hero_count");
        this.curtain_fire_delay = this.GetSpecialValueFor("curtain_fire_delay");
        this.curtain_fire_speed = this.GetSpecialValueFor("curtain_fire_speed");
        this.curtain_fire_activation_charge = this.GetSpecialValueFor("curtain_fire_activation_charge");
        this.curtain_fire_radius_second = this.GetSpecialValueFor("curtain_fire_radius_second");
        this.curtain_fire_projectile_radius = this.GetSpecialValueFor("curtain_fire_projectile_radius");
        if (!IsServer()) {
            return;
        }
        let caster_location = this.caster.GetAbsOrigin();
        let target = this.GetCursorTarget();
        let target_location: Vector;
        let direction: Vector;
        this.caster.EmitSound("DOTA_Item.RodOfAtos.Cast");
        if (this.GetLevel() < 2 || this.GetCurrentCharges() < this.curtain_fire_activation_charge || this.caster.IsTempestDouble()) {
            let projectile = {
                Target: target,
                Source: this.caster,
                Ability: this,
                EffectName: "particles/items2_fx/rod_of_atos_attack.vpcf",
                iMoveSpeed: this.projectile_speed,
                vSourceLoc: caster_location,
                bDrawsOnMinimap: false,
                bDodgeable: true,
                bIsAttack: false,
                bVisibleToEnemies: true,
                bReplaceExisting: false,
                flExpireTime: GameRules.GetGameTime() + 20,
                bProvidesVision: false
            }
            ProjectileManager.CreateTrackingProjectile(projectile);
            if (this.GetLevel() >= 2) {
                this.SetCurrentCharges(math.min(this.GetCurrentCharges() + 1, this.curtain_fire_activation_charge));
                let modifier = this.caster.findBuff<modifier_item_imba_rod_of_atos>("modifier_item_imba_rod_of_atos");
                if (modifier) {
                    modifier.SetStackCount(this.GetCurrentCharges());
                }
            }
            return;
        }
        if (target) {
            target_location = target.GetAbsOrigin();
        } else {
            target_location = this.GetCursorPosition();
        }
        direction = (target_location - caster_location as Vector).Normalized();
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), target_location, undefined, this.curtain_fire_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false);
        let counter = 0;
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            this.AddTimer(counter * this.curtain_fire_delay, () => {
                let projectile = {
                    Target: enemy,
                    Source: this.caster,
                    Ability: this,
                    EffectName: "particles/items2_fx/rod_of_atos_attack.vpcf",
                    iMoveSpeed: this.projectile_speed,
                    vSourceLoc: caster_location,
                    bDrawsOnMinimap: false,
                    bDodgeable: true,
                    bIsAttack: false,
                    bVisibleToEnemies: true,
                    bReplaceExisting: false,
                    flExpireTime: GameRules.GetGameTime() + 20,
                    bProvidesVision: false
                }
                ProjectileManager.CreateTrackingProjectile(projectile);
            });
            counter = counter + 1;
        }
        let curtain_fire_starting_point = target_location - (direction * 1400);
        for (let shot = 0; shot <= this.curtain_fire_shot_count + (GameFunc.GetCount(enemies) * this.curtain_fire_shot_per_hero_count); shot++) {
            this.AddTimer(shot * this.curtain_fire_delay, () => {
                let random_spawn_distance = RandomInt(-this.curtain_fire_length, this.curtain_fire_length);
                let random_spawn_location = curtain_fire_starting_point + Vector(direction.y * random_spawn_distance, -direction.x * random_spawn_distance, 100);
                let random_target_location = GetGroundPosition(target_location + RandomVector(this.curtain_fire_radius_second * 0.5) as Vector, undefined);
                let random_fire_direction = random_target_location - random_spawn_location as Vector;
                random_fire_direction.z = 0;
                let linear_projectile: CreateLinearProjectileOptions = {
                    Ability: this,
                    EffectName: "particles/items2_fx/rod_of_atos_attack_" + string.lower(this.caster.GetTeamNumber() + "") + ".vpcf",
                    vSpawnOrigin: random_spawn_location as Vector,
                    fDistance: random_fire_direction.Length2D() + this.curtain_fire_radius_second,
                    fStartRadius: this.curtain_fire_projectile_radius,
                    fEndRadius: this.curtain_fire_projectile_radius,
                    Source: this.caster,
                    bHasFrontalCone: true,
                    // bReplaceExisting: false,
                    iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                    iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                    iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                    fExpireTime: GameRules.GetGameTime() + 10.0,
                    // bDeleteOnHit: true,
                    vVelocity: random_fire_direction.Normalized() * this.curtain_fire_speed as Vector,
                    bProvidesVision: false
                }
                ProjectileManager.CreateLinearProjectile(linear_projectile);
            });
        }
        this.SetCurrentCharges(0);
        this.caster.findBuff<modifier_item_imba_rod_of_atos>("modifier_item_imba_rod_of_atos").SetStackCount(0);
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (!IsServer()) {
            return;
        }
        if (target && !target.IsMagicImmune()) {
            let contactDistance = (target.GetAbsOrigin() - location as Vector).Length2D();
            let targetted_projectile = (this.GetLevel() == 1 || contactDistance <= 65);
            if (targetted_projectile) {
                if (target.TriggerSpellAbsorb(this)) {
                    return undefined;
                }
            }
            target.EmitSound("DOTA_Item.RodOfAtos.Target");
            ApplyDamage({
                victim: target,
                damage: target.GetIdealSpeed() * this.GetSpecialValueFor("ankle_breaker_damage_pct") * 0.01,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.caster,
                ability: this
            });
            if (targetted_projectile) {
                target.AddNewModifier(this.caster, this, "modifier_item_imba_rod_of_atos_debuff", {
                    duration: this.duration * (1 - target.GetStatusResistance())
                });
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_rod_of_atos_debuff extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/items2_fx/rod_of_atos.vpcf";
    }
    CheckState( /** keys */): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        };
    }
}
@registerModifier()
export class modifier_item_imba_rod_of_atos extends BaseModifier_Plus {
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
        if (!IsServer()) {
            return;
        }
        if (this.GetItemPlus() && this.GetItemPlus().GetLevel() >= 2 && !this.GetItemPlus<item_imba_rod_of_atos>().initialized) {
            this.GetItemPlus().SetCurrentCharges(this.GetItemPlus().GetSpecialValueFor("initial_charges"));
            this.GetItemPlus<item_imba_rod_of_atos>().initialized = true;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
        }
    }
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
}
// 阿托斯之棍2级
@registerAbility()
export class item_imba_rod_of_atos_2 extends item_imba_rod_of_atos { }
