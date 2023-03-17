
import { GameFunc } from "../../../GameFunc";
import { EventHelper } from "../../../helper/EventHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_void_spirit_aether_remnant extends BaseAbility_Plus {
    OnSpellStart(): void {
    }
}
@registerModifier()
export class modifier_imba_void_spirit_aether_remnant_pull extends BaseModifier_Plus {
    BeCreated(p_0: any,): void {
    }
}
@registerModifier()
export class modifier_imba_void_spirit_aether_remnant_target_vision extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: false
        };
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
}
@registerAbility()
export class imba_void_spirit_dissimilate extends BaseAbility_Plus {
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return (this.GetSpecialValueFor("damage_radius") * (100 + this.GetSpecialValueFor("scepter_size_increase_pct")) * 0.01) - this.GetCasterPlus().GetCastRangeBonus();
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().EmitSound("Hero_VoidSpirit.Dissimilate.Cast");
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_void_spirit_dissimilate", {
            duration: this.GetSpecialValueFor("phase_duration")
        });
        if (this.GetAutoCastState()) {
            let cosmic_particle = undefined;
            let damage_radius = this.GetSpecialValueFor("damage_radius");
            for (const [_, ally] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("damage_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_CHECK_DISABLE_HELP, FindOrder.FIND_ANY_ORDER, false))) {
                if (ally != this.GetCasterPlus()) {
                    cosmic_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_void_spirit/void_spirit_cosmic_assault.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, ally);
                    ParticleManager.SetParticleControl(cosmic_particle, 0, ally.GetAbsOrigin());
                    ParticleManager.SetParticleControl(cosmic_particle, 1, Vector(100, 0, 0));
                    ParticleManager.ReleaseParticleIndex(cosmic_particle);
                    ally.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_void_spirit_dissimilate_ally", {
                        duration: this.GetSpecialValueFor("phase_duration")
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_void_spirit_dissimilate extends BaseModifier_Plus {
    public destination_fx_radius: number;
    public portals_per_ring: any;
    public angle_per_ring_portal: any;
    public first_ring_distance_offset: number;
    public damage_radius: number;
    public scepter_size_increase_pct: number;
    public particle_offset: any;
    public damage: number;
    public damage_type: number;
    public portal_selection_orders: any;
    public portals: { [k: string]: Vector };
    public closest_particle: any;
    public closest_position: any;
    public shortest_distance: number;
    public selected_pos: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.destination_fx_radius = this.GetSpecialValueFor("destination_fx_radius");
        this.portals_per_ring = this.GetSpecialValueFor("portals_per_ring");
        this.angle_per_ring_portal = this.GetSpecialValueFor("angle_per_ring_portal");
        this.first_ring_distance_offset = this.GetSpecialValueFor("first_ring_distance_offset");
        this.damage_radius = this.GetSpecialValueFor("damage_radius");
        this.scepter_size_increase_pct = this.GetSpecialValueFor("scepter_size_increase_pct");
        this.particle_offset = 25;
        if (!IsServer()) {
            return;
        }
        this.damage = this.GetAbilityPlus().GetAbilityDamage();
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.portal_selection_orders = {
            [dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET]: true
        }
        this.portals = {}
        EmitSoundOnLocationWithCaster(this.GetParentPlus().GetAbsOrigin(), "Hero_VoidSpirit.Dissimilate.Portals", this.GetCasterPlus());
        let portal = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_void_spirit/dissimilate/void_spirit_dissimilate.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus(), this.GetCasterPlus().GetOpposingTeamNumber());
        ParticleManager.SetParticleControl(portal, 0, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(portal, 1, Vector(this.damage_radius + this.particle_offset, 1, 1));
        this.AddParticle(portal, false, false, -1, false, false);
        portal = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_void_spirit/dissimilate/void_spirit_dissimilate.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus(), this.GetCasterPlus().GetTeamNumber());
        ParticleManager.SetParticleControl(portal, 0, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(portal, 1, Vector(this.damage_radius + this.particle_offset, 1, 1));
        ParticleManager.SetParticleControl(portal, 2, Vector(1, 0, 0));
        this.AddParticle(portal, false, false, -1, false, false);
        let portal_position = undefined;
        this.portals[portal] = this.GetCasterPlus().GetAbsOrigin();
        this.closest_particle = portal;
        this.closest_position = this.GetCasterPlus().GetAbsOrigin();
        for (let outer_portals = 1; outer_portals <= this.portals_per_ring; outer_portals++) {
            portal_position = GetGroundPosition(RotatePosition(this.GetCasterPlus().GetAbsOrigin(), QAngle(0, this.angle_per_ring_portal * (outer_portals - 1), 0), this.GetCasterPlus().GetAbsOrigin() + (this.GetCasterPlus().GetForwardVector() * (this.first_ring_distance_offset)) as Vector), undefined);
            EmitSoundOnLocationWithCaster(portal_position, "Hero_VoidSpirit.Dissimilate.Portals", this.GetCasterPlus());
            portal = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_void_spirit/dissimilate/void_spirit_dissimilate.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus(), this.GetCasterPlus().GetOpposingTeamNumber());
            ParticleManager.SetParticleControl(portal, 0, portal_position);
            ParticleManager.SetParticleControl(portal, 1, Vector(this.damage_radius + this.particle_offset, 1, 1));
            this.AddParticle(portal, false, false, -1, false, false);
            portal = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_void_spirit/dissimilate/void_spirit_dissimilate.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus(), this.GetCasterPlus().GetTeamNumber());
            ParticleManager.SetParticleControl(portal, 0, portal_position);
            ParticleManager.SetParticleControl(portal, 1, Vector(this.damage_radius + this.particle_offset, 1, 1));
            this.AddParticle(portal, false, false, -1, false, false);
            this.portals[portal] = portal_position;
        }
        this.GetParentPlus().AddNoDraw();
    }
    BeDestroy(): void {
        if (!IsServer() || !this.GetParentPlus().IsAlive()) {
            return;
        }
        this.GetCasterPlus().StopSound("Hero_VoidSpirit.Dissimilate.Portals");
        this.GetParentPlus().EmitSound("Hero_VoidSpirit.Dissimilate.TeleportIn");
        let damage_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_void_spirit/dissimilate/void_spirit_dissimilate_dmg.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
        ParticleManager.SetParticleControl(damage_particle, 0, this.closest_position);
        ParticleManager.SetParticleControl(damage_particle, 1, Vector((this.damage_radius + this.particle_offset) / 2, 0, 1));
        ParticleManager.ReleaseParticleIndex(damage_particle);
        this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_3_END);
        FindClearSpaceForUnit(this.GetParentPlus(), this.closest_position, false);
        this.GetParentPlus().Interrupt();
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.closest_position, undefined, this.damage_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
            enemy.EmitSound("Hero_VoidSpirit.Dissimilate.Stun");
            ApplyDamage({
                victim: enemy,
                damage: this.damage,
                damage_type: this.damage_type,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus()
            });
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_void_spirit_dissimilate_stun")) {
                enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_generic_stunned", {
                    duration: this.GetCasterPlus().GetTalentValue("special_bonus_imba_void_spirit_dissimilate_stun") * (1 - enemy.GetStatusResistance())
                });
            }
        }
        this.GetParentPlus().RemoveNoDraw();
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
            [modifierstate.MODIFIER_STATE_MUTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (keys.unit == this.GetParentPlus() && this.portal_selection_orders[keys.order_type] && this.portals && GameRules.GetGameTime() >= this.GetCreationTime() + 0.11) {
            this.shortest_distance = undefined;
            this.closest_particle = undefined;
            this.closest_position = undefined;
            this.selected_pos = keys.new_pos;
            if (keys.target) {
                this.selected_pos = keys.target.GetAbsOrigin();
            }
            for (const [_particle, position] of GameFunc.Pair(this.portals)) {
                const particle = GToNumber(_particle) as ParticleID
                ParticleManager.SetParticleControl(particle, 2, Vector(0, 0, 0));
                if (!this.shortest_distance || (this.selected_pos - position as Vector).Length2D() < this.shortest_distance) {
                    this.shortest_distance = (this.selected_pos - position as Vector).Length2D();
                    this.closest_particle = particle;
                    this.closest_position = position;
                }
            }
            if (this.closest_particle) {
                ParticleManager.SetParticleControl(this.closest_particle, 2, Vector(1, 0, 0));
            }
        }
    }
}
@registerModifier()
export class modifier_imba_void_spirit_dissimilate_ally extends BaseModifier_Plus {
    public closest_position: any;
    public offset: any;
    public main_dissimilate_modifier: any;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.closest_position = this.GetParentPlus().GetAbsOrigin();
        this.offset = this.GetParentPlus().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin();
        this.main_dissimilate_modifier = this.GetCasterPlus().findBuff<modifier_imba_void_spirit_dissimilate>("modifier_imba_void_spirit_dissimilate");
        this.GetParentPlus().AddNoDraw();
        if (!this.main_dissimilate_modifier) {
            this.Destroy();
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        FindClearSpaceForUnit(this.GetParentPlus(), this.main_dissimilate_modifier.closest_position + this.offset, false);
        this.GetParentPlus().RemoveNoDraw();
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
            [modifierstate.MODIFIER_STATE_MUTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true
        };
    }
}
@registerAbility()
export class imba_void_spirit_resonant_pulse extends BaseAbility_Plus {
    public pulse_thinker: any;
    RequiresScepterForCharges() {
        return true;
    }
    GetCooldown(level: number): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetCooldown(level);
        } else {
            return 0;
        }
    }
    OnInventoryContentsChanged(): void {
        if (this.GetCasterPlus().HasScepter()) {
            if (this.GetCasterPlus().HasModifier("modifier_generic_charges")) {
                let has_rightful_modifier = false;
                for (const [_, mod] of GameFunc.iPair(this.GetCasterPlus().FindAllModifiersByName("modifier_generic_charges"))) {
                    if (mod.GetAbilityPlus().GetAbilityName() == this.GetAbilityName()) {
                        has_rightful_modifier = true;
                        return;
                    }
                }
                if (has_rightful_modifier == false) {
                    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_charges", {});
                }
            } else {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_charges", {});
            }
        }
    }
    OnHeroCalculateStatBonus(): void {
        this.OnInventoryContentsChanged();
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().EmitSound("Hero_VoidSpirit.Pulse.Cast");
        this.GetCasterPlus().EmitSound("Hero_VoidSpirit.Pulse");
        let pulse_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_void_spirit/pulse/void_spirit_pulse.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControl(pulse_particle, 1, Vector(this.GetSpecialValueFor("speed"), 1, 0));
        ParticleManager.ReleaseParticleIndex(pulse_particle);
        this.GetCasterPlus().RemoveModifierByName("modifier_imba_void_spirit_resonant_pulse_physical_buff");
        this.pulse_thinker = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_void_spirit_resonant_pulse_thinker_aura", {
            duration: this.GetSpecialValueFor("buff_duration")
        }, this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_void_spirit_resonant_pulse_ring", {
            duration: this.GetSpecialValueFor("radius") / this.GetSpecialValueFor("speed"),
            thinker_entindex: this.pulse_thinker.entindex()
        });
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_void_spirit_resonant_pulse_physical_buff", {
            duration: this.GetSpecialValueFor("buff_duration")
        });
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (target) {
            if (target == this.GetCasterPlus()) {
                if (target.HasModifier("modifier_imba_void_spirit_resonant_pulse_physical_buff")) {
                    target.findBuff<modifier_imba_void_spirit_resonant_pulse_physical_buff>("modifier_imba_void_spirit_resonant_pulse_physical_buff").SetStackCount(target.FindModifierByName("modifier_imba_void_spirit_resonant_pulse_physical_buff").GetStackCount() + this.GetSpecialValueFor("absorb_per_hero_hit"));
                } else {
                    target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_void_spirit_resonant_pulse_physical_buff", {
                        duration: this.GetSpecialValueFor("buff_duration")
                    });
                }
            } else {
                if (target.HasModifier("modifier_imba_void_spirit_resonant_pulse_thinker_aura")) {
                    target.findBuff<modifier_imba_void_spirit_resonant_pulse_thinker_aura>("modifier_imba_void_spirit_resonant_pulse_thinker_aura").SetStackCount(target.FindModifierByName("modifier_imba_void_spirit_resonant_pulse_thinker_aura").GetStackCount() + this.GetSpecialValueFor("absorb_per_hero_hit"));
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_void_spirit_resonant_pulse_ring extends BaseModifier_Plus {
    public speed: number;
    public silence_duration_scepter: number;
    public return_projectile_speed: number;
    public equal_exchange_duration: number;
    public damage: number;
    public radius: number;
    public thickness: any;
    public damage_type: number;
    public hit_enemies: { [k: string]: boolean };
    public ring_size: any;
    public center: any;
    public thinker_entindex: any;
    public impact_particle: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_void_spirit/pulse/void_spirit_pulse_buff.vpcf";
    }
    BeCreated(keys: any): void {
        this.speed = this.GetSpecialValueFor("speed");
        this.silence_duration_scepter = this.GetSpecialValueFor("silence_duration_scepter");
        this.return_projectile_speed = this.GetSpecialValueFor("return_projectile_speed");
        this.equal_exchange_duration = this.GetSpecialValueFor("equal_exchange_duration");
        if (!IsServer()) {
            return;
        }
        this.damage = this.GetAbilityPlus().GetTalentSpecialValueFor("damage");
        this.radius = this.GetSpecialValueFor("radius");
        this.thickness = 120;
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.hit_enemies = {}
        this.ring_size = 0;
        this.center = this.GetParentPlus().GetAbsOrigin();
        this.thinker_entindex = keys.thinker_entindex;
        this.OnIntervalThink();
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        this.ring_size = this.GetElapsedTime() * this.speed;
        if (this.ring_size > this.radius) {
            this.ring_size = this.radius;
        }
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.center, undefined, this.ring_size, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
            let distance = GFuncVector.CalculateDistance(enemy, this.center);
            if (!this.hit_enemies[enemy.entindex() + ""] && distance < this.ring_size + this.thickness && distance > this.ring_size - this.thickness) {
                enemy.EmitSound("Hero_VoidSpirit.Pulse.Target");
                this.impact_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_void_spirit/pulse/void_spirit_pulse_impact.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy);
                ParticleManager.SetParticleControlEnt(this.impact_particle, 1, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(this.impact_particle);
                if (this.GetCasterPlus().HasScepter()) {
                    enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_silence", {
                        duration: this.silence_duration_scepter * (1 - enemy.GetStatusResistance())
                    });
                }
                ApplyDamage({
                    victim: enemy,
                    damage: this.damage,
                    damage_type: this.damage_type,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this.GetAbilityPlus()
                });
                if (enemy.IsRealUnit() || enemy.IsClone() || enemy.IsTempestDouble()) {
                    ProjectileManager.CreateTrackingProjectile({
                        EffectName: "particles/units/heroes/hero_void_spirit/pulse/void_spirit_pulse_absorb.vpcf",
                        Ability: this.GetAbilityPlus(),
                        Source: enemy,
                        vSourceLoc: enemy.GetAbsOrigin(),
                        Target: this.GetParentPlus(),
                        iMoveSpeed: this.return_projectile_speed,
                        bDodgeable: false,
                        bIsAttack: false,
                        bReplaceExisting: false,
                        iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION,
                        bDrawsOnMinimap: undefined,
                        bVisibleToEnemies: true,
                        bProvidesVision: false,
                        iVisionRadius: undefined,
                        iVisionTeamNumber: undefined,
                        ExtraData: {}
                    });
                    ProjectileManager.CreateTrackingProjectile({
                        EffectName: "particles/units/heroes/hero_void_spirit/pulse/void_spirit_pulse_absorb.vpcf",
                        Ability: this.GetAbilityPlus(),
                        Source: enemy,
                        vSourceLoc: enemy.GetAbsOrigin(),
                        Target: EntIndexToHScript(this.thinker_entindex) as CDOTA_BaseNPC,
                        iMoveSpeed: this.return_projectile_speed,
                        bDodgeable: false,
                        bIsAttack: false,
                        bReplaceExisting: false,
                        iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION,
                        bDrawsOnMinimap: undefined,
                        bVisibleToEnemies: true,
                        bProvidesVision: false,
                        iVisionRadius: undefined,
                        iVisionTeamNumber: undefined,
                        ExtraData: {}
                    });
                }
                this.hit_enemies[enemy.entindex() + ""] = true;
                enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_void_spirit_resonant_pulse_equal_exchange", {
                    duration: this.equal_exchange_duration * (1 - enemy.GetStatusResistance())
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_void_spirit_resonant_pulse_physical_buff extends BaseModifier_Plus {
    public base_absorb_amount: number;
    public radius: number;
    public shield_particle: any;
    public deflect_particle: any;
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_void_spirit_pulse_buff.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.base_absorb_amount = this.GetSpecialValueFor("base_absorb_amount");
        if (!IsServer()) {
            return;
        }
        this.radius = 130;
        this.shield_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_void_spirit/pulse/void_spirit_pulse_shield.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(this.shield_particle, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(this.shield_particle, 1, Vector(this.radius, 1, 1));
        this.AddParticle(this.shield_particle, false, false, -1, false, false);
        this.SetStackCount(this.base_absorb_amount);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("Hero_VoidSpirit.Pulse.Destroy");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_CONSTANT)
    CC_GetModifierIncomingPhysicalDamageConstant(keys: ModifierAttackEvent): number {
        this.deflect_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_void_spirit/pulse/void_spirit_pulse_shield_deflect.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(this.deflect_particle, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(this.deflect_particle, 1, Vector(this.radius, 1, 1));
        ParticleManager.ReleaseParticleIndex(this.deflect_particle);
        if (keys.damage >= this.GetStackCount()) {
            this.Destroy();
            return this.GetStackCount() * (-1);
        } else {
            this.SetStackCount(this.GetStackCount() - keys.damage);
            return keys.damage * (-1);
        }
    }
}
@registerModifier()
export class modifier_imba_void_spirit_resonant_pulse_thinker_aura extends BaseModifier_Plus {
    public radius: number;
    public base_absorb_amount: number;
    public shield_particle: any;
    BeCreated(p_0: any,): void {
        this.radius = this.GetSpecialValueFor("radius");
        this.base_absorb_amount = this.GetSpecialValueFor("base_absorb_amount");
        this.shield_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_void_spirit/pulse/void_spirit_pulse_shield.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.shield_particle, 1, Vector(this.radius, 1, 1));
        this.AddParticle(this.shield_particle, false, false, -1, false, false);
        this.SetStackCount(this.base_absorb_amount);
    }
    IsHidden(): boolean {
        return true;
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP;
    }
    GetModifierAura(): string {
        return "modifier_imba_void_spirit_resonant_pulse_thinker_buff";
    }
    GetAuraDuration(): number {
        return 0.1;
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        return target == this.GetCasterPlus();
    }
}
@registerModifier()
export class modifier_imba_void_spirit_resonant_pulse_thinker_buff extends BaseModifier_Plus {
    public radius: number;
    public deflect_particle: any;
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_void_spirit_pulse_buff.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.radius = this.GetSpecialValueFor("radius");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_CONSTANT)
    CC_GetModifierIncomingPhysicalDamageConstant(keys: ModifierAttackEvent): number {
        if (!this.GetAuraOwner()) {
            return;
        }
        this.deflect_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_void_spirit/pulse/void_spirit_pulse_shield_deflect.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetAuraOwner());
        ParticleManager.SetParticleControl(this.deflect_particle, 1, Vector(this.radius, 1, 1));
        ParticleManager.ReleaseParticleIndex(this.deflect_particle);
        if (keys.damage >= this.GetAuraOwner().findBuff<modifier_imba_void_spirit_resonant_pulse_thinker_aura>("modifier_imba_void_spirit_resonant_pulse_thinker_aura").GetStackCount()) {
            this.GetAuraOwner().Destroy();
            this.Destroy();
            return this.GetAuraOwner().findBuff<modifier_imba_void_spirit_resonant_pulse_thinker_aura>("modifier_imba_void_spirit_resonant_pulse_thinker_aura").GetStackCount() * (-1);
        } else {
            this.GetAuraOwner().findBuff<modifier_imba_void_spirit_resonant_pulse_thinker_aura>("modifier_imba_void_spirit_resonant_pulse_thinker_aura").SetStackCount(this.GetAuraOwner().FindModifierByName("modifier_imba_void_spirit_resonant_pulse_thinker_aura").GetStackCount() - keys.damage);
            return keys.damage * (-1);
        }
    }
}
@registerModifier()
export class modifier_imba_void_spirit_resonant_pulse_equal_exchange extends BaseModifier_Plus {
    public equal_exchange_attacks: any;
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.equal_exchange_attacks = this.GetSpecialValueFor("equal_exchange_attacks");
        this.SetStackCount(this.equal_exchange_attacks);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_BLOCK_DISABLED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.target == this.GetParentPlus()) {
            this.DecrementStackCount();
            if (this.GetStackCount() <= 0) {
                this.Destroy();
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetStackCount();
    }
}
@registerAbility()
export class imba_void_spirit_astral_step_helper extends BaseAbility_Plus {
    IsStealable(): boolean {
        return false;
    }
    GetManaCost(level: number): number {
        return super.GetManaCost(level) + (this.GetCasterPlus().GetMaxMana() * this.GetSpecialValueFor("max_mana_pct") * 0.01);
    }
    OnAbilityPhaseStart(): boolean {
        if (this.GetCasterPlus().HasModifier("modifier_imba_void_spirit_astral_step_grace_time") && this.GetCasterPlus().findBuff<modifier_imba_void_spirit_astral_step_grace_time>("modifier_imba_void_spirit_astral_step_grace_time").GetElapsedTime() >= this.GetSpecialValueFor("grace_time_start")) {
            return true;
        }
    }
    OnSpellStart(): void {
        if (this.GetCasterPlus().HasAbility("imba_void_spirit_astral_step") && this.GetCasterPlus().findAbliityPlus<imba_void_spirit_astral_step>("imba_void_spirit_astral_step").original_vector) {
            this.GetCasterPlus().findAbliityPlus<imba_void_spirit_astral_step>("imba_void_spirit_astral_step").OnSpellStart(this.GetCasterPlus().findAbliityPlus<imba_void_spirit_astral_step>("imba_void_spirit_astral_step").original_vector * (-1) as Vector);
        }
    }
}
@registerModifier()
export class modifier_imba_void_spirit_astral_step_grace_time extends BaseModifier_Plus {
    public grace_time_start: number;
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
        this.grace_time_start = this.GetSpecialValueFor("grace_time_start");
        this.GetAbilityPlus().SetActivated(true);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetAbilityPlus().SetActivated(false);
    }
}
@registerAbility()
export class imba_void_spirit_astral_step_helper_2 extends BaseAbility_Plus {
    // todo modifier_generic_charges
    charge_modifier: IBaseModifier_Plus;
    GetAssociatedSecondaryAbilities(): string {
        return "imba_void_spirit_astral_step";
    }
    OnAbilityPhaseStart(): boolean {
        if (this.charge_modifier && this.charge_modifier.GetStackCount() > 0) {
            this.GetCasterPlus().StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_CAST_ABILITY_2_END, 0.2);
            return true;
        } else {
            EventHelper.ErrorMessage("#dota_hud_error_astral_step_no_charges", this.GetCasterPlus().GetPlayerID());
            return false;
        }
    }
    OnAbilityPhaseInterrupted(): void {
        this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2_END);
    }
    OnChannelFinish(bInterrupted: boolean): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2_END);
        if (this.charge_modifier && this.GetCasterPlus().findAbliityPlus<imba_void_spirit_astral_step_helper_2>("imba_void_spirit_astral_step_helper_2").charge_modifier.GetStackCount() >= 1) {
            let wtf_mode = true;
            if (!GameRules.IsCheatMode()) {
                wtf_mode = false;
            }
            else {
                for (let ability = 0; ability <= 24 - 1; ability++) {
                    if (this.GetCasterPlus().GetAbilityByIndex(ability) && this.GetCasterPlus().GetAbilityByIndex(ability).GetCooldownTimeRemaining() > 0) {
                        wtf_mode = false;
                        return;
                    }
                }
                if (!wtf_mode) {
                    for (let item = 0; item <= 15; item++) {
                        if (this.GetCasterPlus().GetItemInSlot(item) && this.GetCasterPlus().GetItemInSlot(item).GetCooldownTimeRemaining() > 0) {
                            wtf_mode = false;
                            return;
                        }
                    }
                }
            }
            if (wtf_mode == false) {
                this.charge_modifier.DecrementStackCount();
                // this.charge_modifier.CalculateCharge();
            }
        }
        if (this.GetCasterPlus().HasAbility("imba_void_spirit_astral_step")) {
            this.GetCasterPlus().findAbliityPlus<imba_void_spirit_astral_step>("imba_void_spirit_astral_step").OnSpellStart(undefined, (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized() * (this.GetCasterPlus().FindAbilityByName("imba_void_spirit_astral_step").GetSpecialValueFor("max_travel_distance") * (1 + (this.GetSpecialValueFor("bonus_range_pct") * 0.01)) + this.GetCasterPlus().GetCastRangeBonus()) * Vector(1, 1, 0) as Vector, bInterrupted);
        }
    }
}
@registerModifier()
export class modifier_imba_void_spirit_astral_step_armor_pierce extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR)
    CC_GetModifierIgnorePhysicalArmor(p_0: ModifierAttackEvent,): number {
        return 1;
    }
}
@registerAbility()
export class imba_void_spirit_aether_remnant_helper extends BaseAbility_Plus {
    IsInnateAbility() {
        return true;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_void_spirit_aether_remnant_helper";
    }
}
@registerModifier()
export class modifier_imba_void_spirit_aether_remnant_helper extends BaseModifier_Plus {
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
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.inflictor && keys.inflictor.GetAbilityName() == "void_spirit_aether_remnant" && keys.attacker == this.GetParentPlus() && keys.unit.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && keys.unit.IsRealUnit()) {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), keys.inflictor, "modifier_imba_void_spirit_aether_remnant_helper_buff", {
                duration: this.GetSpecialValueFor("swiftness_duration")
            });
            keys.unit.AddNewModifier(this.GetCasterPlus(), keys.inflictor, "modifier_imba_void_spirit_aether_remnant_target_vision", {
                duration: this.GetSpecialValueFor("vision_duration") * (1 - keys.unit.GetStatusResistance())
            });
        }
    }
}
@registerModifier()
export class modifier_imba_void_spirit_aether_remnant_helper_buff extends BaseModifier_Plus {
    public damage_bonus: number;
    public move_speed_bonus: number;
    public evasion_bonus: number;
    public swiftness_duration: number;
    public stack_table: number[];
    GetEffectName(): string {
        return "particles/status_fx/status_effect_void_spirit_aether_remnant.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.damage_bonus = this.GetSpecialValueFor("damage_bonus");
        this.move_speed_bonus = this.GetSpecialValueFor("move_speed_bonus");
        this.evasion_bonus = this.GetSpecialValueFor("evasion_bonus");
        this.swiftness_duration = this.GetSpecialValueFor("swiftness_duration");
        if (!IsServer()) {
            return;
        }
        this.stack_table = []
        this.stack_table.push(GameRules.GetDOTATime(true, true));
        this.IncrementStackCount();
        this.StartIntervalThink(FrameTime());
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.stack_table.push(GameRules.GetDOTATime(true, true));
        this.IncrementStackCount();
    }
    OnIntervalThink(): void {
        GFuncArray.FitterRemove(this.stack_table, (i, j) => {
            return GameRules.GetDOTATime(true, true) - i <= this.swiftness_duration;
        });
        if (GameFunc.GetCount(this.stack_table) != this.GetStackCount()) {
            this.SetStackCount(GameFunc.GetCount(this.stack_table));
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.damage_bonus * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.move_speed_bonus * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
    CC_GetModifierEvasion_Constant(p_0: ModifierAttackEvent,): number {
        return this.evasion_bonus * this.GetStackCount();
    }
}
@registerAbility()
export class imba_void_spirit_void_stasis extends BaseAbility_Plus {
    public aoe_particle_1: any;
    public aoe_particle_impact: any;
    IsInnateAbility() {
        return true;
    }
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
    GetChannelAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_GENERIC_CHANNEL_1;
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnSpellStart(): void {
        this.aoe_particle_1 = ResHelper.CreateParticleEx("particles/units/heroes/hero_void_spirit/planeshift_outer_ring.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(this.aoe_particle_1, 0, this.GetCursorPosition());
        ParticleManager.SetParticleControl(this.aoe_particle_1, 1, Vector(this.GetSpecialValueFor("radius"), 0, 0));
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_GENERIC_CHANNEL_1);
    }
    OnChannelFinish(bInterrupted: boolean): void {
        ParticleManager.DestroyParticle(this.aoe_particle_1, true);
        ParticleManager.ReleaseParticleIndex(this.aoe_particle_1);
        this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_GENERIC_CHANNEL_1);
        if (!bInterrupted) {
            EmitSoundOnLocationWithCaster(this.GetCursorPosition(), "Hero_VoidSpirit.AstralStep.Target", this.GetCasterPlus());
            this.aoe_particle_impact = ResHelper.CreateParticleEx("particles/units/heroes/hero_void_spirit/planeshift/planeshift_aether_start.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
            ParticleManager.SetParticleControl(this.aoe_particle_impact, 0, this.GetCursorPosition());
            ParticleManager.ReleaseParticleIndex(this.aoe_particle_impact);
            for (const [_, unit] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_CHECK_DISABLE_HELP, FindOrder.FIND_ANY_ORDER, false))) {
                unit.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_void_spirit_void_stasis", {
                    duration: this.GetSpecialValueFor("duration")
                });
                unit.Interrupt();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_void_spirit_void_stasis extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_faceless_chronosphere.vpcf";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            return {
                [modifierstate.MODIFIER_STATE_STUNNED]: true,
                [modifierstate.MODIFIER_STATE_FROZEN]: true,
                [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
                [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
                [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
                [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true
            };
        } else {
            return {
                [modifierstate.MODIFIER_STATE_DISARMED]: true,
                [modifierstate.MODIFIER_STATE_MUTED]: true,
                [modifierstate.MODIFIER_STATE_SILENCED]: true,
                [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
                [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
                [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
                [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true
            };
        }
    }
}
@registerAbility()
export class imba_void_spirit_astral_step extends BaseAbility_Plus {
    public original_vector: any;
    public impact_particle: any;
    GetAssociatedPrimaryAbilities(): string {
        return "imba_void_spirit_astral_step_helper_2";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_generic_charges";
    }
    OnUpgrade(): void {
        if (this.IsTrained() && this.GetCasterPlus().HasAbility("imba_void_spirit_astral_step_helper") && !this.GetCasterPlus().findAbliityPlus<imba_void_spirit_astral_step_helper>("imba_void_spirit_astral_step_helper").IsTrained()) {
            this.GetCasterPlus().findAbliityPlus<imba_void_spirit_astral_step_helper>("imba_void_spirit_astral_step_helper").SetLevel(1);
            this.GetCasterPlus().findAbliityPlus<imba_void_spirit_astral_step_helper>("imba_void_spirit_astral_step_helper").SetActivated(false);
        }
        if (this.IsTrained() && this.GetCasterPlus().HasAbility("imba_void_spirit_astral_step_helper_2")) {
            this.GetCasterPlus().findAbliityPlus<imba_void_spirit_astral_step_helper_2>("imba_void_spirit_astral_step_helper_2").SetLevel(this.GetLevel());
        }
        if (this.GetLevel() == 1) {
            for (const [_, mod] of GameFunc.iPair(this.GetCasterPlus().FindAllModifiersByName("modifier_generic_charges") as IBaseModifier_Plus[])) {
                if (mod.GetAbilityPlus() == this) {
                    mod.BeCreated();
                    if (this.GetCasterPlus().HasAbility("imba_void_spirit_astral_step_helper_2")) {
                        this.GetCasterPlus().findAbliityPlus<imba_void_spirit_astral_step_helper_2>("imba_void_spirit_astral_step_helper_2").charge_modifier = mod;
                    }
                    return;
                }
            }
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (IsClient()) {
            return this.GetSpecialValueFor("max_travel_distance");
        }
    }
    OnSpellStart(recastVector?: Vector, warpVector?: Vector, bInterrupted?: boolean/** recastVector */  /** , warpVector */  /** , bInterrupted */): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        if (this.GetCasterPlus().HasAbility("imba_void_spirit_astral_step_helper") && !this.GetCasterPlus().findAbliityPlus<imba_void_spirit_astral_step_helper>("imba_void_spirit_astral_step_helper").IsTrained()) {
            this.GetCasterPlus().findAbliityPlus<imba_void_spirit_astral_step_helper>("imba_void_spirit_astral_step_helper").SetLevel(1);
        }
        let original_position = this.GetCasterPlus().GetAbsOrigin();
        let final_position = this.GetCasterPlus().GetAbsOrigin() + ((this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized() * math.max(math.min(((this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin()) * Vector(1, 1, 0) as Vector).Length2D(), this.GetSpecialValueFor("max_travel_distance") + this.GetCasterPlus().GetCastRangeBonus()), this.GetSpecialValueFor("min_travel_distance"))) as Vector;
        if (recastVector) {
            final_position = this.GetCasterPlus().GetAbsOrigin() + recastVector as Vector;
        }
        if (warpVector) {
            final_position = GetGroundPosition(this.GetCasterPlus().GetAbsOrigin() + warpVector as Vector, undefined);
        }
        this.original_vector = (final_position - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized() * (this.GetSpecialValueFor("max_travel_distance") + this.GetCasterPlus().GetCastRangeBonus());
        this.GetCasterPlus().SetForwardVector(this.original_vector.Normalized());
        this.GetCasterPlus().EmitSound("Hero_VoidSpirit.AstralStep.Start");
        let step_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_void_spirit/astral_step/void_spirit_astral_step.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(step_particle, 0, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(step_particle, 1, final_position);
        ParticleManager.ReleaseParticleIndex(step_particle);
        let bHeroHit = false;
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInLine(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), final_position, undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES))) {
            this.impact_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_void_spirit/astral_step/void_spirit_astral_step_impact.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy);
            ParticleManager.SetParticleControlEnt(this.impact_particle, 0, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(this.impact_particle);
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_void_spirit_astral_step_crit", {});
            this.GetCasterPlus().SetAbsOrigin(enemy.GetAbsOrigin() - this.GetCasterPlus().GetForwardVector() as Vector);
            if (warpVector && !bInterrupted) {
                enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_void_spirit_astral_step_armor_pierce", {});
            }
            this.GetCasterPlus().PerformAttack(enemy, false, true, true, false, false, false, true);
            this.GetCasterPlus().RemoveModifierByName("modifier_imba_void_spirit_astral_step_crit");
            enemy.RemoveModifierByName("modifier_imba_void_spirit_astral_step_armor_pierce");
            enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_void_spirit_astral_step_debuff", {
                duration: this.GetSpecialValueFor("pop_damage_delay") * (1 - enemy.GetStatusResistance())
            });
            if (enemy.IsRealUnit() && !bHeroHit) {
                bHeroHit = true;
            }
        }
        this.impact_particle = undefined;
        if (!warpVector) {
            FindClearSpaceForUnit(this.GetCasterPlus(), final_position, false);
        } else {
            FindClearSpaceForUnit(this.GetCasterPlus(), original_position, false);
        }
        this.GetCasterPlus().EmitSound("Hero_VoidSpirit.AstralStep.End");
        if (this.GetCasterPlus().HasAbility("imba_void_spirit_astral_step_helper") && this.GetCasterPlus().findAbliityPlus<imba_void_spirit_astral_step_helper>("imba_void_spirit_astral_step_helper").IsTrained()) {
            this.GetCasterPlus().RemoveModifierByName("modifier_imba_void_spirit_astral_step_grace_time");
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus<imba_void_spirit_astral_step_helper>("imba_void_spirit_astral_step_helper"), "modifier_imba_void_spirit_astral_step_grace_time", {
                duration: this.GetCasterPlus().findAbliityPlus<imba_void_spirit_astral_step_helper>("imba_void_spirit_astral_step_helper").GetSpecialValueFor("grace_time_end")
            });
        }
        if (this.GetCasterPlus().HasAbility("imba_void_spirit_astral_step_helper_2")) {
            if (this.GetCasterPlus().findAbliityPlus<imba_void_spirit_astral_step_helper_2>("imba_void_spirit_astral_step_helper_2").charge_modifier && ((!warpVector && this.GetCasterPlus().findAbliityPlus<imba_void_spirit_astral_step_helper_2>("imba_void_spirit_astral_step_helper_2").charge_modifier.GetStackCount() <= 1) || (warpVector && this.GetCasterPlus().findAbliityPlus<imba_void_spirit_astral_step_helper_2>("imba_void_spirit_astral_step_helper_2").charge_modifier.GetStackCount() <= 0))) {
                this.GetCasterPlus().findAbliityPlus<imba_void_spirit_astral_step_helper_2>("imba_void_spirit_astral_step_helper_2").StartCooldown(this.GetCasterPlus().findAbliityPlus<imba_void_spirit_astral_step_helper_2>("imba_void_spirit_astral_step_helper_2").charge_modifier.GetRemainingTime());
            }
        }
        if (bHeroHit && !recastVector) {
            if (!this.GetCasterPlus().HasModifier("modifier_imba_void_spirit_astral_step_invis")) {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_void_spirit_astral_step_invis", {
                    duration: this.GetSpecialValueFor("hidden_ones_duration")
                });
            } else {
                this.GetCasterPlus().findBuff<modifier_imba_void_spirit_astral_step_invis>("modifier_imba_void_spirit_astral_step_invis").SetDuration(this.GetCasterPlus().FindModifierByName("modifier_imba_void_spirit_astral_step_invis").GetRemainingTime() + this.GetSpecialValueFor("hidden_ones_duration"), true);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_void_spirit_astral_step_debuff extends BaseModifier_Plus {
    public pop_damage: number;
    public movement_slow_pct: number;
    public damage_particle: ParticleID;
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_void_spirit/astral_step/void_spirit_astral_step_debuff.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_void_spirit_astral_step_debuff.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.pop_damage = this.GetSpecialValueFor("pop_damage");
        this.movement_slow_pct = this.GetSpecialValueFor("movement_slow_pct") * (-1);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.damage_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_void_spirit/astral_step/void_spirit_astral_step_dmg.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.ReleaseParticleIndex(this.damage_particle);
        ApplyDamage({
            victim: this.GetParentPlus(),
            damage: this.pop_damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        });
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), this.pop_damage, undefined);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movement_slow_pct;
    }
}
@registerModifier()
export class modifier_imba_void_spirit_astral_step_crit extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE)
    CC_GetModifierPreAttack_CriticalStrike(p_0: ModifierAttackEvent,): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_void_spirit_astral_step_crit")) {
            return this.GetCasterPlus().GetTalentValue("special_bonus_imba_void_spirit_astral_step_crit");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierTotalDamageOutgoing_Percentage(keys: ModifierAttackEvent): number {
        if (!keys.no_attack_cooldown && keys.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_SPELL && keys.damage_flags == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION) {
            return -100;
        }
    }
}
@registerModifier()
export class modifier_imba_void_spirit_astral_step_invis extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        return 1;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_void_spirit_resonant_pulse_damage extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_void_spirit_astral_step_charge_cooldown extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_void_spirit_astral_step_crit extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_void_spirit_dissimilate_stun extends BaseModifier_Plus {
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
