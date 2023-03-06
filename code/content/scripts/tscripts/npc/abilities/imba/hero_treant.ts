
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_treant_natures_grasp extends BaseAbility_Plus {
    public thinker_tracker: { [key: string]: boolean };
    OnSpellStart(): void {
        let cast_position = this.GetCasterPlus().GetAbsOrigin();
        let cursor_position = this.GetCursorPosition();
        let unique_string = DoUniqueString(this.GetName());
        let thicket_thinker = undefined;
        if (cursor_position == cast_position) {
            cursor_position = cursor_position + this.GetCasterPlus().GetForwardVector() as Vector;
        }
        if (!this.thinker_tracker) {
            this.thinker_tracker = {}
        }
        this.GetCasterPlus().EmitSound("Hero_Treant.NaturesGrasp.Cast");
        for (let thicket = 1; thicket <= math.floor((this.GetCastRange(cursor_position, this.GetCasterPlus()) - 100) / this.GetSpecialValueFor("vine_spawn_interval")); thicket++) {
            this.GetCasterPlus().SetContextThink(DoUniqueString("grasp_thinker"),
                () => {
                    thicket_thinker = CreateModifierThinker(this.GetCasterPlus(), this, "modifier_imba_treant_natures_grasp_creation_thinker", {
                        duration: this.GetSpecialValueFor("vines_duration"),
                        unique_string: unique_string
                    }, GetGroundPosition(cast_position + (cursor_position - cast_position as Vector).Normalized() * (100 + (this.GetSpecialValueFor("vine_spawn_interval") * (thicket - 1))) as Vector, undefined), this.GetCasterPlus().GetTeamNumber(), false);
                    thicket_thinker.EmitSound("Hero_Treant.NaturesGrasp.Spawn");
                    if (thicket == math.floor((this.GetCastRange(cursor_position, this.GetCasterPlus()) - 100) / this.GetSpecialValueFor("vine_spawn_interval"))) {
                        this.thinker_tracker[unique_string] = undefined;
                    }
                    return undefined;
                }, this.GetSpecialValueFor("creation_interval") * (thicket - 1));
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_treant_natures_grasp_damage") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_treant_natures_grasp_damage")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_treant_natures_grasp_damage"), "modifier_special_bonus_imba_treant_natures_grasp_damage", {});
        }
    }
}
@registerModifier()
export class modifier_imba_treant_natures_grasp_creation_thinker extends BaseModifier_Plus {
    public latch_range: number;
    public latch_vision: any;
    public damage_per_second: number;
    public movement_slow: any;
    public damage_type: number;
    public unique_string: any;
    public bramble_particle: any;
    public bTouchingTree: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(keys: any): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        if (!IsServer()) {
            return;
        }
        this.latch_range = this.GetSpecialValueFor("latch_range");
        this.latch_vision = this.GetSpecialValueFor("latch_vision");
        this.damage_per_second = this.GetAbilityPlus().GetTalentSpecialValueFor("damage_per_second");
        this.movement_slow = this.GetSpecialValueFor("movement_slow");
        if (this.GetCasterPlus().GetLevel() >= 25) {
            this.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PURE;
        } else {
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        }
        this.unique_string = keys.unique_string;
        this.bramble_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_treant/treant_bramble_root.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.bramble_particle, 0, Vector(0, 0, 0));
        this.AddParticle(this.bramble_particle, false, false, -1, false, false);
        if (!this.GetAbilityPlus<imba_treant_natures_grasp>().thinker_tracker[this.unique_string] && GridNav.IsNearbyTree(this.GetParentPlus().GetAbsOrigin(), this.latch_range, false)) {
            this.GetAbilityPlus<imba_treant_natures_grasp>().thinker_tracker[this.unique_string] = true;
            this.bTouchingTree = true;
            for (const ent of (Entities.FindAllByName("npc_dota_thinker") as IBaseNpc_Plus[])) {
                let buff = ent.findBuff<modifier_imba_treant_natures_grasp_creation_thinker>(this.GetName());
                if (buff && buff.unique_string == this.unique_string && buff.bramble_particle) {
                    ParticleManager.SetParticleControl(buff.bramble_particle, 1, Vector(1, 0, 0));
                    buff.bTouchingTree = true;
                }
            }
            ParticleManager.SetParticleControl(this.bramble_particle, 1, Vector(1, 0, 0));
        } else if (this.GetAbilityPlus<imba_treant_natures_grasp>().thinker_tracker[this.unique_string]) {
            ParticleManager.SetParticleControl(this.bramble_particle, 1, Vector(1, 0, 0));
            this.bTouchingTree = true;
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("Hero_Treant.NaturesGrasp.Destroy");
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.latch_range;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        if (this.GetCasterPlus().GetLevel() >= 25) {
            return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
        } else {
            return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
        }
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP;
    }
    GetModifierAura(): string {
        if (this.bTouchingTree) {
            return "modifier_imba_treant_natures_grasp_damage_bonus";
        } else {
            return "modifier_imba_treant_natures_grasp_damage";
        }
    }
}
@registerModifier()
export class modifier_imba_treant_natures_grasp_damage extends BaseModifier_Plus {
    public damage_per_second: number;
    public movement_slow: any;
    public damage_type: number;
    public interval: number;
    public damage_per_tick: number;
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus()) {
            this.damage_per_second = this.GetAbilityPlus().GetTalentSpecialValueFor("damage_per_second");
            this.movement_slow = this.GetSpecialValueFor("movement_slow");
            if (this.GetCasterPlus().GetLevel() >= 25) {
                this.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PURE;
            } else {
                this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
            }
        } else if (this.GetAuraOwner() && this.GetAuraOwner().HasModifier("modifier_imba_treant_natures_grasp_creation_thinker")) {
            this.damage_per_second = this.GetAuraOwner().findBuff<modifier_imba_treant_natures_grasp_creation_thinker>("modifier_imba_treant_natures_grasp_creation_thinker").damage_per_second;
            this.movement_slow = this.GetAuraOwner().findBuff<modifier_imba_treant_natures_grasp_creation_thinker>("modifier_imba_treant_natures_grasp_creation_thinker").movement_slow;
            this.damage_type = this.GetAuraOwner().findBuff<modifier_imba_treant_natures_grasp_creation_thinker>("modifier_imba_treant_natures_grasp_creation_thinker").damage_type;
        } else {
            this.Destroy();
        }
        this.interval = 0.25;
        this.damage_per_tick = this.damage_per_second * this.interval;
        if (!this.GetParentPlus().IsRealUnit()) {
            this.damage_per_tick = this.damage_per_tick * 0.5;
        }
        this.SetStackCount(this.movement_slow * (-1));
        this.GetParentPlus().EmitSound("Hero_Treant.NaturesGrasp.Damage");
        this.StartIntervalThink(this.interval);
    }
    OnIntervalThink(): void {
        ApplyDamage({
            victim: this.GetParentPlus(),
            damage: this.damage_per_tick,
            damage_type: this.damage_type,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        });
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (!this.GetParentPlus().IsMagicImmune()) {
            return this.GetStackCount();
        }
    }
}
@registerModifier()
export class modifier_imba_treant_natures_grasp_damage_bonus extends BaseModifier_Plus {
    public damage_per_second: number;
    public movement_slow: any;
    public damage_type: number;
    public interval: number;
    public damage_per_tick: number;
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus()) {
            this.damage_per_second = this.GetAbilityPlus().GetTalentSpecialValueFor("damage_per_second") * 1.5;
            this.movement_slow = this.GetSpecialValueFor("movement_slow");
            if (this.GetCasterPlus().GetLevel() >= 25) {
                this.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PURE;
            } else {
                this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
            }
        } else if (this.GetAuraOwner() && this.GetAuraOwner().HasModifier("modifier_imba_treant_natures_grasp_creation_thinker")) {
            this.damage_per_second = this.GetAuraOwner().findBuff<modifier_imba_treant_natures_grasp_creation_thinker>("modifier_imba_treant_natures_grasp_creation_thinker").damage_per_second * 1.5;
            this.movement_slow = this.GetAuraOwner().findBuff<modifier_imba_treant_natures_grasp_creation_thinker>("modifier_imba_treant_natures_grasp_creation_thinker").movement_slow;
            this.damage_type = this.GetAuraOwner().findBuff<modifier_imba_treant_natures_grasp_creation_thinker>("modifier_imba_treant_natures_grasp_creation_thinker").damage_type;
        } else {
            this.Destroy();
        }
        this.interval = 0.25;
        this.damage_per_tick = this.damage_per_second * this.interval;
        if (!this.GetParentPlus().IsRealUnit()) {
            this.damage_per_tick = this.damage_per_tick * 0.5;
        }
        this.SetStackCount(this.movement_slow * (-1));
        this.GetParentPlus().EmitSound("Hero_Treant.NaturesGrasp.Damage");
        this.StartIntervalThink(this.interval);
    }
    OnIntervalThink(): void {
        ApplyDamage({
            victim: this.GetParentPlus(),
            damage: this.damage_per_tick,
            damage_type: this.damage_type,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        });
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (!this.GetParentPlus().IsMagicImmune()) {
            return this.GetStackCount();
        }
    }
}
@registerModifier()
export class modifier_imba_treant_natures_grasp_latch_thinker extends BaseModifier_Plus {
}
@registerAbility()
export class imba_treant_leech_seed extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_treant_leech_seed_autocast_handler";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_treant_leech_seed_autocast_handler", this.GetCasterPlus()) == 0) {
            return tonumber(tostring(super.GetBehavior())) + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_treant_leech_seed_autocast_handler", this.GetCasterPlus()) == 1) {
            return this.GetSpecialValueFor("remnants_cast_range");
        } else {
            return this.GetSpecialValueFor("radius") - this.GetCasterPlus().GetCastRangeBonus();
        }
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_treant_leech_seed_autocast_handler", this.GetCasterPlus()) == 1) {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
        }
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Treant.LeechSeed.Cast");
        let seed_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_treant/treant_leech_seed.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControl(seed_particle, 1, this.GetCasterPlus().GetAttachmentOrigin(this.GetCasterPlus().ScriptLookupAttachment("attach_attack1")));
        if (this.GetAutoCastState()) {
            let target = this.GetCursorTarget();
            if (!target.TriggerSpellAbsorb(this)) {
                target.EmitSound("Hero_Treant.LeechSeed.Target");
                ParticleManager.SetParticleControlEnt(seed_particle, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                if (target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
                    target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_treant_leech_seed", {
                        duration: this.GetSpecialValueFor("duration") - FrameTime()
                    });
                } else {
                    target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_treant_leech_seed_enemy_target", {
                        duration: this.GetSpecialValueFor("duration") - FrameTime()
                    });
                }
            }
        } else {
            this.GetCasterPlus().EmitSound("Hero_Treant.LeechSeed.Target");
            ParticleManager.SetParticleControlEnt(seed_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_treant_leech_seed", {
                duration: this.GetSpecialValueFor("duration") - FrameTime()
            });
        }
        ParticleManager.ReleaseParticleIndex(seed_particle);
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        target.Heal(this.GetTalentSpecialValueFor("leech_damage") * this.GetSpecialValueFor("damage_interval"), this);
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, target, this.GetTalentSpecialValueFor("leech_damage") * this.GetSpecialValueFor("damage_interval"), undefined);
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_treant_leech_seed_heal") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_treant_leech_seed_heal")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_treant_leech_seed_heal"), "modifier_special_bonus_imba_treant_leech_seed_heal", {});
        }
    }
}
@registerModifier()
export class modifier_imba_treant_leech_seed_autocast_handler extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus()) {
            this.GetAbilityPlus().ToggleAutoCast();
            this.SetStackCount(1);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ORDER
        });
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
export class modifier_imba_treant_leech_seed extends BaseModifier_Plus {
    public damage_interval: number;
    public leech_damage: number;
    public movement_slow: any;
    public slow_duration: number;
    public radius: number;
    public projectile_speed: number;
    public damage_type: number;
    public enemy_heroes: any;
    public damage_particle: ParticleID;
    public enemy_creeps: any;
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.damage_interval = this.GetSpecialValueFor("damage_interval");
        this.leech_damage = this.GetAbilityPlus().GetTalentSpecialValueFor("leech_damage");
        this.movement_slow = this.GetSpecialValueFor("movement_slow");
        this.slow_duration = this.GetSpecialValueFor("slow_duration");
        this.radius = this.GetSpecialValueFor("radius");
        this.projectile_speed = this.GetSpecialValueFor("projectile_speed");
        if (!IsServer()) {
            return;
        }
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.OnIntervalThink();
        this.StartIntervalThink(this.damage_interval);
    }
    OnIntervalThink(): void {
        this.GetParentPlus().EmitSound("Hero_Treant.LeechSeed.Tick");
        this.enemy_heroes = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        if (GameFunc.GetCount(this.enemy_heroes) >= 1) {
            this.damage_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_treant/treant_leech_seed_damage_pulse.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.enemy_heroes[0]);
            ParticleManager.ReleaseParticleIndex(this.damage_particle);
            this.damage_particle = undefined;
            ApplyDamage({
                victim: this.enemy_heroes[0],
                damage: this.leech_damage * this.damage_interval,
                damage_type: this.damage_type,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus()
            });
            this.enemy_heroes[0].AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_treant_leech_seed_slow", {
                duration: this.slow_duration * (1 - this.enemy_heroes[0].GetStatusResistance()),
                movement_slow: this.movement_slow
            });
            ProjectileManager.CreateTrackingProjectile({
                EffectName: "particles/units/heroes/hero_treant/treant_leech_seed_projectile.vpcf",
                Ability: this.GetAbilityPlus(),
                Source: this.enemy_heroes[0],
                vSourceLoc: this.enemy_heroes[0].GetAbsOrigin(),
                Target: this.GetCasterPlus(),
                iMoveSpeed: this.projectile_speed,
                flExpireTime: undefined,
                bDodgeable: false,
                bIsAttack: false,
                bReplaceExisting: false,
                iSourceAttachment: undefined,
                bDrawsOnMinimap: undefined,
                bVisibleToEnemies: true,
                bProvidesVision: false,
                iVisionRadius: undefined,
                iVisionTeamNumber: undefined,
                ExtraData: {}
            });
            this.enemy_heroes = undefined;
            return undefined;
        } else {
            this.enemy_creeps = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            if (GameFunc.GetCount(this.enemy_creeps) >= 1) {
                this.damage_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_treant/treant_leech_seed_damage_pulse.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.enemy_creeps[0]);
                ParticleManager.ReleaseParticleIndex(this.damage_particle);
                this.damage_particle = undefined;
                ApplyDamage({
                    victim: this.enemy_creeps[0],
                    damage: this.leech_damage * this.damage_interval,
                    damage_type: this.damage_type,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this.GetAbilityPlus()
                });
                this.enemy_creeps[0].AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_treant_leech_seed_slow", {
                    duration: this.slow_duration * (1 - this.enemy_creeps[0].GetStatusResistance()),
                    movement_slow: this.movement_slow
                });
                ProjectileManager.CreateTrackingProjectile({
                    EffectName: "particles/units/heroes/hero_treant/treant_leech_seed_projectile.vpcf",
                    Ability: this.GetAbilityPlus(),
                    Source: this.enemy_heroes[0],
                    vSourceLoc: this.enemy_heroes[0].GetAbsOrigin(),
                    Target: this.GetCasterPlus(),
                    iMoveSpeed: this.projectile_speed,
                    flExpireTime: undefined,
                    bDodgeable: false,
                    bIsAttack: false,
                    bReplaceExisting: false,
                    iSourceAttachment: undefined,
                    bDrawsOnMinimap: undefined,
                    bVisibleToEnemies: true,
                    bProvidesVision: false,
                    iVisionRadius: undefined,
                    iVisionTeamNumber: undefined,
                    ExtraData: {}
                });
            }
            this.enemy_creeps = undefined;
        }
    }
}
@registerModifier()
export class modifier_imba_treant_leech_seed_slow extends BaseModifier_Plus {
    public movement_slow: any;
    BeCreated(keys: any): void {
        if (!IsServer()) {
            return;
        }
        this.movement_slow = keys.movement_slow;
        this.SetStackCount(this.movement_slow);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_treant_leech_seed_enemy_target extends BaseModifier_Plus {
    public damage_interval: number;
    public leech_damage: number;
    public movement_slow: any;
    public remnants_radius: number;
    public projectile_speed: number;
    public damage_type: number;
    public damage_particle: ParticleID;
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.damage_interval = this.GetSpecialValueFor("damage_interval");
        this.leech_damage = this.GetAbilityPlus().GetTalentSpecialValueFor("leech_damage");
        this.movement_slow = this.GetSpecialValueFor("movement_slow") * 0.5;
        this.remnants_radius = this.GetSpecialValueFor("remnants_radius");
        this.projectile_speed = this.GetSpecialValueFor("projectile_speed");
        if (!IsServer()) {
            return;
        }
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.OnIntervalThink();
        this.StartIntervalThink(this.damage_interval);
    }
    OnIntervalThink(): void {
        this.GetParentPlus().EmitSound("Hero_Treant.LeechSeed.Tick");
        this.damage_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_treant/treant_leech_seed_damage_pulse.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.ReleaseParticleIndex(this.damage_particle);
        this.damage_particle = undefined;
        ApplyDamage({
            victim: this.GetParentPlus(),
            damage: this.leech_damage * this.damage_interval,
            damage_type: this.damage_type,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        });
        for (const [_, unit] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.remnants_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
            ProjectileManager.CreateTrackingProjectile({
                EffectName: "particles/units/heroes/hero_treant/treant_leech_seed_projectile.vpcf",
                Ability: this.GetAbilityPlus(),
                Source: unit,
                vSourceLoc: unit.GetAbsOrigin(),
                Target: this.GetCasterPlus(),
                iMoveSpeed: this.projectile_speed,
                flExpireTime: undefined,
                bDodgeable: false,
                bIsAttack: false,
                bReplaceExisting: false,
                iSourceAttachment: undefined,
                bDrawsOnMinimap: undefined,
                bVisibleToEnemies: true,
                bProvidesVision: false,
                iVisionRadius: undefined,
                iVisionTeamNumber: undefined,
                ExtraData: {}
            });
        }
    }
}
@registerAbility()
export class imba_treant_living_armor extends BaseAbility_Plus {
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Treant.LivingArmor.Cast");
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_treant_living_armor_aoe")) {
            for (const [_, ally] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, this.GetCasterPlus().GetTalentValue("special_bonus_imba_treant_living_armor_aoe"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO, FindOrder.FIND_ANY_ORDER, false))) {
                ally.EmitSound("Hero_Treant.LivingArmor.Target");
                ally.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_treant_living_armor", {
                    duration: this.GetSpecialValueFor("duration")
                });
            }
        } else {
            if (this.GetCursorTarget()) {
                this.GetCursorTarget().EmitSound("Hero_Treant.LivingArmor.Target");
                this.GetCursorTarget().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_treant_living_armor", {
                    duration: this.GetSpecialValueFor("duration")
                });
            } else {
                let allies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
                if (GameFunc.GetCount(allies) >= 1) {
                    allies[0].EmitSound("Hero_Treant.LivingArmor.Target");
                    allies[0].AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_treant_living_armor", {
                        duration: this.GetSpecialValueFor("duration")
                    });
                }
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_treant_living_armor_heal") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_treant_living_armor_heal")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_treant_living_armor_heal"), "modifier_special_bonus_imba_treant_living_armor_heal", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_treant_living_armor_aoe") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_treant_living_armor_aoe")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_treant_living_armor_aoe"), "modifier_special_bonus_imba_treant_living_armor_aoe", {});
        }
    }
}
@registerModifier()
export class modifier_imba_treant_living_armor extends BaseModifier_Plus {
    public total_heal: any;
    public bonus_armor: number;
    public duration: number;
    public remnants_damage_block_instances: number;
    public remnants_damage_block: number;
    public heal_per_tick: any;
    public armor_particle: any;
    Init(p_0: any,): void {

        this.total_heal = this.GetAbilityPlus().GetTalentSpecialValueFor("total_heal");
        this.bonus_armor = this.GetSpecialValueFor("bonus_armor");
        this.duration = this.GetSpecialValueFor("duration");
        this.remnants_damage_block_instances = this.GetSpecialValueFor("remnants_damage_block_instances");
        this.remnants_damage_block = this.GetSpecialValueFor("remnants_damage_block");
        this.heal_per_tick = this.total_heal / this.duration;
        if (!IsServer()) {
            return;
        }
        this.armor_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_treant/treant_livingarmor.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(this.armor_particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_origin", this.GetParentPlus().GetAbsOrigin(), true);
        this.AddParticle(this.armor_particle, false, false, -1, false, false);
        this.SetStackCount(this.remnants_damage_block_instances);
        this.StartIntervalThink(1);
    }

    OnIntervalThink(): void {
        this.GetParentPlus().Heal(this.heal_per_tick, this.GetAbilityPlus());
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, this.GetParentPlus(), this.heal_per_tick, undefined);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOTAL_CONSTANT_BLOCK
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.bonus_armor;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTAL_CONSTANT_BLOCK)
    CC_GetModifierTotal_ConstantBlock(keys: ModifierAttackEvent): number {
        if (this.GetStackCount() >= 1 && keys.damage >= 5 && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) {
            this.DecrementStackCount();
            return this.remnants_damage_block;
        }
    }
}
@registerAbility()
export class imba_treant_natures_guise extends BaseAbility_Plus {
    IsInnateAbility() {
        return true;
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES;
    }
    GetCastPoint(): number {
        return this.GetSpecialValueFor("cast_cast_point");
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("cast_cast_range");
    }
    GetCooldown(level: number): number {
        return this.GetSpecialValueFor("cooldown_time");
    }
    GetManaCost(level: number): number {
        return this.GetSpecialValueFor("cast_mana_cost");
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (this.GetCasterPlus().HasModifier("modifier_imba_treant_natures_guise_active_cooldown")) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        } else if (target == this.GetCasterPlus()) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        } else if (GridNav && GridNav.IsNearbyTree && !GridNav.IsNearbyTree(target.GetAbsOrigin(), this.GetSpecialValueFor("radius"), false)) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        } else {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
        }
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        if (this.GetCasterPlus().HasModifier("modifier_imba_treant_natures_guise_active_cooldown")) {
            return "#dota_cursor_cooldown_no_time";
        } else if (target == this.GetCasterPlus()) {
            return "#dota_hud_error_cant_cast_on_self";
        } else if (GridNav && GridNav.IsNearbyTree && !GridNav.IsNearbyTree(target.GetAbsOrigin(), this.GetSpecialValueFor("radius"), false)) {
            return "#dota_hud_error_cant_cast_on_units_not_near_trees";
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_treant_natures_guise";
    }
    OnSpellStart(): void {
        this.EndCooldown();
        this.GetCursorTarget().EmitSound("Hero_Treant.NaturesGuise.On");
        let cast_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_treant/treant_naturesguise_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCursorTarget());
        ParticleManager.SetParticleControlEnt(cast_particle, 1, this.GetCursorTarget(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCursorTarget().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(cast_particle, 2, this.GetCursorTarget(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCursorTarget().GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(cast_particle);
        this.GetCursorTarget().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_treant_natures_guise_tree_walking", {});
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_treant_natures_guise_active_cooldown", {
            duration: this.GetSpecialValueFor("cast_cooldown") * this.GetCasterPlus().GetCooldownReduction()
        });
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_treant_natures_guise_invisibility") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_treant_natures_guise_invisibility")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_treant_natures_guise_invisibility"), "modifier_special_bonus_imba_treant_natures_guise_invisibility", {});
        }
    }
}
@registerModifier()
export class modifier_imba_treant_natures_guise extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (!IsServer()) {
            return undefined;
        }
        if (this.GetAbilityPlus()) {
            if (this.GetAbilityPlus().IsCooldownReady() && !this.GetParentPlus().HasModifier("modifier_imba_treant_natures_guise_tree_walking")) {
                this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_treant_natures_guise_tree_walking", {});
            } else if (!this.GetAbilityPlus().IsCooldownReady() && this.GetParentPlus().HasModifier("modifier_imba_treant_natures_guise_tree_walking")) {
                this.GetParentPlus().RemoveModifierByName("modifier_imba_treant_natures_guise_tree_walking");
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (this.GetAbilityPlus() && keys.target == this.GetParentPlus() && keys.damage > 0 && (keys.attacker.GetPlayerOwnerID() || (keys.attacker as IBaseNpc_Plus).IsRoshan())) {
            if (this.GetParentPlus().HasModifier("modifier_imba_treant_natures_guise_tree_walking") && !GridNav.IsNearbyTree(this.GetParentPlus().GetAbsOrigin(), this.GetSpecialValueFor("radius"), false)) {
                if (this.GetAbilityPlus().IsCooldownReady()) {
                    this.GetParentPlus().EmitSound("Hero_Treant.NaturesGuise.Off");
                }
                this.GetParentPlus().RemoveModifierByName("modifier_imba_treant_natures_guise_tree_walking");
            }
            if (!this.GetParentPlus().HasModifier("modifier_imba_treant_natures_guise_tree_walking") || !GridNav.IsNearbyTree(this.GetParentPlus().GetAbsOrigin(), this.GetSpecialValueFor("radius"), false)) {
                this.GetAbilityPlus().StartCooldown(this.GetAbilityPlus().GetEffectiveCooldown(this.GetAbilityPlus().GetLevel()));
            }
        }
    }
}
@registerModifier()
export class modifier_imba_treant_natures_guise_tree_walking extends BaseModifier_Plus {
    public radius: number;
    public grace_time: number;
    public regen_amp: any;
    public movement_bonus: number;
    public invis_counter: number;
    public uninvis_counter: number;
    public interval: number;
    IsHidden(): boolean {
        return this.GetStackCount() != 0;
    }
    IsPurgable(): boolean {
        return this.GetParentPlus() != this.GetCasterPlus();
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.radius = this.GetSpecialValueFor("radius");
        this.grace_time = this.GetSpecialValueFor("grace_time");
        this.regen_amp = this.GetSpecialValueFor("regen_amp");
        this.movement_bonus = this.GetSpecialValueFor("movement_bonus");
        if (!IsServer()) {
            return;
        }
        this.invis_counter = 0;
        this.uninvis_counter = 0;
        this.interval = FrameTime();
        this.SetStackCount(-1);
        this.OnIntervalThink();
        this.StartIntervalThink(this.interval);
    }
    OnIntervalThink(): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        if (GridNav.IsNearbyTree(this.GetParentPlus().GetAbsOrigin(), this.radius, false)) {
            this.SetStackCount(0);
            this.uninvis_counter = 0;
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_treant_natures_guise_invisibility") && !this.GetParentPlus().HasModifier("modifier_imba_treant_natures_guise_invis")) {
                this.invis_counter = this.invis_counter + this.interval;
                if (this.invis_counter >= this.grace_time) {
                    this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_treant_natures_guise_invis", {});
                    this.invis_counter = 0;
                }
            }
        } else {
            if (this.GetParentPlus() != this.GetCasterPlus()) {
                this.StartIntervalThink(-1);
                this.Destroy();
                return undefined;
            }
            this.SetStackCount(-1);
            this.invis_counter = 0;
            if (this.GetParentPlus().HasModifier("modifier_imba_treant_natures_guise_invis")) {
                this.uninvis_counter = this.uninvis_counter + this.interval;
                if (this.uninvis_counter >= this.grace_time) {
                    this.GetParentPlus().RemoveModifierByName("modifier_imba_treant_natures_guise_invis");
                    this.uninvis_counter = 0;
                }
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_imba_treant_natures_guise_invis")) {
            this.GetParentPlus().RemoveModifierByName("modifier_imba_treant_natures_guise_invis");
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ALLOW_PATHING_THROUGH_TREES]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEAL_AMPLIFY_PERCENTAGE_TARGET,
            3: GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE,
            4: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.GetStackCount() == 0) {
            return this.movement_bonus;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEAL_AMPLIFY_PERCENTAGE_TARGET)
    CC_GetModifierHealAmplify_PercentageTarget(): void {
        if (this.GetStackCount() == 0) {
            return this.regen_amp;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE)
    CC_GetModifierHPRegenAmplify_Percentage(): number {
        if (this.GetStackCount() == 0) {
            return this.regen_amp;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus()) {
            this.invis_counter = 0;
        }
    }
}
@registerModifier()
export class modifier_imba_treant_natures_guise_invis extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus()) {
            this.Destroy();
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        return 1;
    }
}
@registerModifier()
export class modifier_imba_treant_natures_guise_active_cooldown extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerAbility()
export class imba_treant_overgrowth extends BaseAbility_Plus {
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("radius") - this.GetCasterPlus().GetCastRangeBonus();
    }
    OnAbilityPhaseStart(): boolean {
        this.GetCasterPlus().EmitSound("Hero_Treant.Overgrowth.CastAnim");
        return true;
    }
    OnSpellStart(): void {
        let enemies_hit = 0;
        let enemies_hit_table: EntityIndex[] = []
        this.GetCasterPlus().EmitSound("Hero_Treant.Overgrowth.Cast");
        let cast_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_treant/treant_overgrowth_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.ReleaseParticleIndex(cast_particle);
        let overgrowth_primary_enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetTalentSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
        enemies_hit = enemies_hit + GameFunc.GetCount(overgrowth_primary_enemies);
        for (const [_, enemy] of GameFunc.iPair(overgrowth_primary_enemies)) {
            enemy.Stop();
            enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_treant_overgrowth", {
                duration: this.GetSpecialValueFor("duration") * (1 - enemy.GetStatusResistance())
            });
            enemies_hit_table.push(enemy.entindex());
        }
        if (this.GetCasterPlus().HasScepter()) {
            let overgrowth_eyes_enemies = undefined;
            for (const ent of (Entities.FindAllByName("npc_dota_treant_eyes") as IBaseNpc_Plus[])) {
                if (ent.IsAlive() && ent.GetOwnerPlus() == this.GetCasterPlus()) {
                    overgrowth_eyes_enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), ent.GetAbsOrigin(), undefined, this.GetTalentSpecialValueFor("eyes_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
                    enemies_hit = enemies_hit + GameFunc.GetCount(overgrowth_eyes_enemies);
                    for (const [_, enemy] of GameFunc.iPair(overgrowth_eyes_enemies)) {
                        if (!enemies_hit_table[enemy.entindex()]) {
                            enemy.Stop();
                            enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_treant_overgrowth", {
                                duration: this.GetSpecialValueFor("duration") * (1 - enemy.GetStatusResistance())
                            });
                            enemies_hit_table.push(enemy.entindex());
                        }
                    }
                }
            }
        }
        if (enemies_hit >= 1) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_treant_overgrowth_giant_ent", {
                duration: this.GetSpecialValueFor("ent_size_duration"),
                enemies_hit: enemies_hit
            });
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_treant_overgrowth_damage") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_treant_overgrowth_damage")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_treant_overgrowth_damage"), "modifier_special_bonus_imba_treant_overgrowth_damage", {});
        }
    }
}
@registerModifier()
export class modifier_imba_treant_overgrowth extends BaseModifier_Plus {
    public damage: number;
    public damage_type: number;
    GetEffectName(): string {
        return "particles/units/heroes/hero_treant/treant_overgrowth_vines.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.damage = this.GetAbilityPlus().GetTalentSpecialValueFor("damage");
        if (!IsServer()) {
            return;
        }
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.StartIntervalThink(1 - this.GetParentPlus().GetStatusResistance());
    }
    OnIntervalThink(): void {
        ApplyDamage({
            victim: this.GetParentPlus(),
            damage: this.damage,
            damage_type: this.damage_type,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        });
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_INVISIBLE]: false
        };
    }
}
@registerModifier()
export class modifier_imba_treant_overgrowth_giant_ent extends BaseModifier_Plus {
    public ent_strength_per_unit: any;
    public ent_model_size_per_unit: any;
    BeCreated(keys: any): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.ent_strength_per_unit = this.GetSpecialValueFor("ent_strength_per_unit");
        this.ent_model_size_per_unit = this.GetSpecialValueFor("ent_model_size_per_unit");
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(keys.enemies_hit);
        // if (this.GetParentPlus().CalculateStatBonus) {
        //     this.GetParentPlus().CalculateStatBonus(true);
        // }
    }
    BeRefresh(keys: any): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.ent_strength_per_unit = this.GetSpecialValueFor("ent_strength_per_unit");
        this.ent_model_size_per_unit = this.GetSpecialValueFor("ent_model_size_per_unit");
        if (!IsServer()) {
            return;
        }
        if (this.GetStackCount() < keys.enemies_hit) {
            this.SetStackCount(keys.enemies_hit);
            // if (this.GetParentPlus().CalculateStatBonus) {
            //     this.GetParentPlus().CalculateStatBonus(true);
            // }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        // if (this.GetParentPlus().CalculateStatBonus) {
        //     this.GetParentPlus().CalculateStatBonus(true);
        // }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.GetStackCount() * this.ent_strength_per_unit;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE)
    CC_GetModifierModelScale(): number {
        return this.GetStackCount() * this.ent_model_size_per_unit;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_treant_natures_guise_invisibility extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasAbility("imba_treant_natures_guise") && this.GetParentPlus().HasModifier("modifier_imba_treant_natures_guise_tree_walking") && GridNav.IsNearbyTree(this.GetParentPlus().GetAbsOrigin(), this.GetParentPlus().findAbliityPlus<imba_treant_natures_guise>("imba_treant_natures_guise").GetSpecialValueFor("radius"), false)) {
            this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetParentPlus().findAbliityPlus<imba_treant_natures_guise>("imba_treant_natures_guise"), "modifier_imba_treant_natures_guise_invis", {});
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_treant_natures_grasp_damage extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_treant_living_armor_heal extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_treant_leech_seed_heal extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_treant_living_armor_aoe extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_treant_overgrowth_damage extends BaseModifier_Plus {
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
