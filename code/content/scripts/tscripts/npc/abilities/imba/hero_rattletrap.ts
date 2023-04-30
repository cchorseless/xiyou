
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_rattletrap_battery_assault extends BaseAbility_Plus {
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_rattletrap_battery_assault_percussive_maint_aura";
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_RATTLETRAP_BATTERYASSAULT);
        if (this.GetCasterPlus().GetUnitName().includes("rattletrap")) {
            let random_response = RandomInt(3, 18);
            if (random_response <= 9) {
                this.GetCasterPlus().EmitSound("rattletrap_ratt_ability_batt_0" + random_response);
            } else {
                this.GetCasterPlus().EmitSound("rattletrap_ratt_ability_batt_" + random_response);
            }
        }
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_rattletrap_battery_assault", {
            duration: this.GetSpecialValueFor("duration")
        });
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_rattletrap_battery_assault extends BaseModifier_Plus {
    public radius: number;
    public interval: number;
    public fragmentation_mult: any;
    public fragmentation_damage: number;
    public fragmentation_duration: number;
    public damage: number;
    public damage_type: number;
    BeCreated(p_0: any,): void {
        this.radius = this.GetSpecialValueFor("radius");
        this.interval = this.GetAbilityPlus().GetSpecialValueFor("interval");
        this.fragmentation_mult = this.GetSpecialValueFor("fragmentation_mult");
        this.fragmentation_damage = this.GetSpecialValueFor("fragmentation_damage");
        this.fragmentation_duration = this.GetSpecialValueFor("fragmentation_duration");
        if (!IsServer()) {
            return;
        }
        this.damage = this.GetAbilityPlus().GetAbilityDamage();
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.GetParentPlus().EmitSound("Hero_Rattletrap.Battery_Assault");
        this.OnIntervalThink();
        if (this.GetAbilityPlus() && this.GetAbilityPlus().GetAutoCastState()) {
            this.StartIntervalThink(this.interval / this.fragmentation_mult);
        } else {
            this.StartIntervalThink(this.interval);
        }
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("Hero_Rattletrap.Battery_Assault_Launch");
        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_rattletrap/rattletrap_battery_assault.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.ReleaseParticleIndex(particle);
        let particle2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_rattletrap/rattletrap_battery_shrapnel.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
        if (GameFunc.GetCount(enemies) >= 1) {
            enemies[0].EmitSound("Hero_Rattletrap.Battery_Assault_Impact");
            ParticleManager.SetParticleControl(particle2, 1, enemies[0].GetAbsOrigin());
            if (!this.GetAbilityPlus() || (this.GetAbilityPlus() && !this.GetAbilityPlus().GetAutoCastState())) {
                let damageTable = {
                    victim: enemies[0],
                    damage: this.damage,
                    damage_type: this.damage_type,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this.GetAbilityPlus()
                }
                ApplyDamage(damageTable);
                enemies[0].AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_generic_stunned", {
                    duration: 0.1 * (1 - enemies[0].GetStatusResistance())
                });
            } else {
                let damageTable = {
                    victim: enemies[0],
                    damage: this.damage * this.fragmentation_damage * 0.01,
                    damage_type: this.damage_type,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this.GetAbilityPlus()
                }
                ApplyDamage(damageTable);
                enemies[0].AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_rattletrap_battery_assault_fragmentation_rend", {
                    duration: this.fragmentation_duration * (1 - enemies[0].GetStatusResistance())
                });
            }
        } else {
            ParticleManager.SetParticleControl(particle2, 1, this.GetParentPlus().GetAbsOrigin() + RandomVector(RandomInt(0, 128)) as Vector);
        }
        ParticleManager.ReleaseParticleIndex(particle);
        if (this.GetAbilityPlus() && this.GetAbilityPlus().GetAutoCastState()) {
            this.StartIntervalThink(this.interval / this.fragmentation_mult);
        } else {
            this.StartIntervalThink(this.interval);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_Rattletrap.Battery_Assault");
    }
}
@registerModifier()
export class modifier_imba_rattletrap_battery_assault_fragmentation_rend extends BaseModifier_Plus {
    public fragmentation_vuln: any;
    public fragmentation_vision: any;
    public fragmentation_resist: any;
    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.fragmentation_vuln = this.GetSpecialValueFor("fragmentation_vuln");
            this.fragmentation_vision = this.GetSpecialValueFor("fragmentation_vision");
            this.fragmentation_resist = this.GetSpecialValueFor("fragmentation_resist");
        } else {
            this.Destroy();
            return;
        }
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING,
            3: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount() * this.fragmentation_vuln;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.GetStackCount() * this.fragmentation_resist;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE)
    CC_GetBonusVisionPercentage(): number {
        return this.GetStackCount() * this.fragmentation_vision;
    }
}
@registerModifier()
export class modifier_imba_rattletrap_battery_assault_percussive_maint_aura extends BaseModifier_Plus {
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
        return this.GetAbilityPlus().GetSpecialValueFor("percussive_maint_radius");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER;
    }
    GetModifierAura(): string {
        return "modifier_imba_rattletrap_battery_assault_percussive_maint";
    }
    GetAuraEntityReject(hEntity: CDOTA_BaseNPC): boolean {
        return this.GetCasterPlus().PassivesDisabled();
    }
}
@registerModifier()
export class modifier_imba_rattletrap_battery_assault_percussive_maint extends BaseModifier_Plus {
    public percussive_maint_base_chance: number;
    public percussive_maint_frag_chance: number;
    BeCreated(p_0: any,): void {
        this.percussive_maint_base_chance = this.GetSpecialValueFor("percussive_maint_base_chance");
        this.percussive_maint_frag_chance = this.GetSpecialValueFor("percussive_maint_frag_chance");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.target == this.GetParentPlus()) {
            if ((!this.GetAbilityPlus() || !this.GetAbilityPlus().GetAutoCastState())) {
                if (GFuncRandom.PRD(this.percussive_maint_base_chance, this)) {
                    this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_rattletrap_battery_assault", {
                        duration: FrameTime()
                    });
                }
            } else if (GFuncRandom.PRD(this.percussive_maint_frag_chance, this)) {
                this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_rattletrap_battery_assault", {
                    duration: FrameTime()
                });
            }
        }
    }
}
@registerAbility()
export class imba_rattletrap_power_cogs extends BaseAbility_Plus {
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let caster_pos = this.GetCasterPlus().GetAbsOrigin();
        let num_of_cogs = 8;
        let cogs_radius = this.GetSpecialValueFor("cogs_radius");
        let square_dist = 160;
        let cog_vector = GetGroundPosition(caster_pos + Vector(0, cogs_radius, 0) as Vector, undefined);
        let second_cog_vector = GetGroundPosition(caster_pos + Vector(0, cogs_radius * 2, 0) as Vector, undefined);
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_RATTLETRAP_POWERCOGS);
        for (let i = 0; i < num_of_cogs; i++) {
            let cog = this.GetCasterPlus().CreateSummon("npc_imba_rattletrap_cog", cog_vector, this.GetSpecialValueFor("duration"), false);
            cog.EmitSound("Hero_Rattletrap.Power_Cogs");
            cog.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_rattletrap_power_cogs", {
                duration: this.GetSpecialValueFor("duration"),
                x: (cog_vector - caster_pos as Vector).x,
                y: (cog_vector - caster_pos as Vector).y,
                center_x: caster_pos.x,
                center_y: caster_pos.y,
                center_z: caster_pos.z
            });
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_rattletrap_second_gear")) {
                let second_cog = this.GetCasterPlus().CreateSummon("npc_imba_rattletrap_cog", second_cog_vector, this.GetSpecialValueFor("duration"), false);
                second_cog.EmitSound("Hero_Rattletrap.Power_Cogs");
                second_cog.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_rattletrap_power_cogs", {
                    duration: this.GetSpecialValueFor("duration"),
                    x: (second_cog_vector - caster_pos as Vector).x,
                    y: (second_cog_vector - caster_pos as Vector).y,
                    center_x: caster_pos.x,
                    center_y: caster_pos.y,
                    center_z: caster_pos.z,
                    second_gear: true
                });
                second_cog_vector = RotatePosition(caster_pos, QAngle(0, 360 / num_of_cogs, 0), second_cog_vector);
            }
            cog_vector = RotatePosition(caster_pos, QAngle(0, 360 / num_of_cogs, 0), cog_vector);
        }
        let deploy_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_rattletrap/rattletrap_cog_deploy.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        ParticleManager.ReleaseParticleIndex(deploy_particle);
        if (this.GetCasterPlus().GetUnitName().includes("rattletrap") && RollPercentage(50)) {
            let responses = {
                "1": "rattletrap_ratt_ability_cogs_01",
                "2": "rattletrap_ratt_ability_cogs_02",
                "3": "rattletrap_ratt_ability_cogs_07"
            }
            this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(responses));
        }
        let units = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("cogs_radius") + 80, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, unit] of GameFunc.iPair(units)) {
            if ((unit.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D() <= this.GetSpecialValueFor("cogs_radius")) {
                if (unit.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
                    FindClearSpaceForUnit(unit, unit.GetAbsOrigin(), false);
                } else {
                    FindClearSpaceForUnit(unit, this.GetCasterPlus().GetAbsOrigin() + RandomVector(this.GetSpecialValueFor("extra_pull_buffer")) as Vector, false);
                }
            } else {
                FindClearSpaceForUnit(unit, unit.GetAbsOrigin(), false);
            }
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_rattletrap_power_cogs extends BaseModifier_Plus {
    public damage: number;
    public mana_burn: any;
    public attacks_to_destroy: any;
    public push_length: any;
    public push_duration: number;
    public trigger_distance: number;
    public rotational_speed: number;
    public charge_coil_duration: number;
    public powered: any;
    public health: any;
    public center_loc: any;
    public second_gear: any;
    public particle: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_rattletrap/rattletrap_cog_ambient_blur.vpcf";
    }
    BeCreated(params: any): void {
        if (this.GetAbilityPlus()) {
            this.damage = this.GetSpecialValueFor("damage");
            this.mana_burn = this.GetSpecialValueFor("mana_burn");
            this.attacks_to_destroy = this.GetSpecialValueFor("attacks_to_destroy");
            this.push_length = this.GetAbilityPlus().GetSpecialValueFor("push_length");
            this.push_duration = this.GetSpecialValueFor("push_duration");
            this.trigger_distance = this.GetSpecialValueFor("trigger_distance");
            this.rotational_speed = this.GetSpecialValueFor("rotational_speed");
            this.charge_coil_duration = this.GetSpecialValueFor("charge_coil_duration");
            this.powered = true;
            this.health = this.GetSpecialValueFor("attacks_to_destroy");
        } else {
            this.Destroy();
            return;
        }
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().SetForwardVector(Vector(params.x, params.y, 0));
        this.center_loc = Vector(params.center_x, params.center_y, params.center_z);
        this.second_gear = params.second_gear;
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_rattletrap/rattletrap_cog_ambient.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.particle, 62, Vector(0, 0, 0));
        this.AddParticle(this.particle, false, false, -1, false, false);
        this.OnIntervalThink();
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus()) {
            if (this.GetAbilityPlus().GetAutoCastState() && !this.GetParentPlus().HasModifier("modifier_imba_rattletrap_power_cogs_rotational")) {
                this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_rattletrap_power_cogs_rotational", {
                    center_loc_x: this.center_loc.x,
                    center_loc_y: this.center_loc.y,
                    center_loc_z: this.center_loc.z,
                    rotational_speed: this.rotational_speed
                });
            } else if (!this.GetAbilityPlus().GetAutoCastState() && this.GetParentPlus().HasModifier("modifier_imba_rattletrap_power_cogs_rotational")) {
                this.GetParentPlus().RemoveModifierByName("modifier_imba_rattletrap_power_cogs_rotational");
            }
        }
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.trigger_distance, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MANA_ONLY, FindOrder.FIND_CLOSEST, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (this.powered && !enemy.HasModifier("modifier_imba_rattletrap_cog_push") && math.abs(AngleDiff(VectorToAngles(this.GetParentPlus().GetForwardVector()).y, VectorToAngles(enemy.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).y)) <= 90) {
                enemy.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_rattletrap_cog_push", {
                    duration: this.push_duration * (1 - enemy.GetStatusResistance()),
                    damage: this.damage,
                    mana_burn: this.mana_burn,
                    push_length: this.push_length
                });
                this.powered = false;
                ParticleManager.DestroyParticle(this.particle, false);
                ParticleManager.ReleaseParticleIndex(this.particle);
                return;
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_Rattletrap.Power_Cogs");
        this.GetParentPlus().EmitSound("Hero_Rattletrap.Power_Cog.Destroy");
        if (this.GetRemainingTime() <= 0) {
            this.GetParentPlus().RemoveSelf();
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_SPECIALLY_DENIABLE]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE,
            4: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL)
    CC_GetAbsoluteNoDamageMagical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL)
    CC_GetAbsoluteNoDamagePhysical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE)
    CC_GetAbsoluteNoDamagePure(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.target == this.GetParentPlus()) {
            if (keys.attacker == this.GetCasterPlus()) {
                this.GetParentPlus().Kill(undefined, this.GetCasterPlus());
                for (let count = 1; count <= this.attacks_to_destroy; count++) {
                    keys.attacker.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_rattletrap_power_cogs_charge_coil_counter", {
                        duration: this.charge_coil_duration,
                        push_duration: this.push_duration,
                        damage: this.damage,
                        mana_burn: this.mana_burn,
                        push_length: this.push_length
                    });
                    keys.attacker.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_rattletrap_power_cogs_charge_coil_instance", {
                        duration: this.charge_coil_duration
                    });
                }
            } else {
                this.health = this.health - 1;
                if (this.health <= 0) {
                    this.GetParentPlus().Kill(undefined, keys.attacker);
                    if (keys.attacker.GetTeamNumber() == this.GetParentPlus().GetTeamNumber()) {
                        for (let count = 1; count <= this.attacks_to_destroy; count++) {
                            keys.attacker.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_rattletrap_power_cogs_charge_coil_counter", {
                                duration: this.charge_coil_duration,
                                push_duration: this.push_duration,
                                damage: this.damage,
                                mana_burn: this.mana_burn,
                                push_length: this.push_length
                            });
                            keys.attacker.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_rattletrap_power_cogs_charge_coil_instance", {
                                duration: this.charge_coil_duration
                            });
                        }
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_rattletrap_cog_push extends BaseModifierMotionHorizontal_Plus {
    public duration: number;
    public damage: number;
    public mana_burn: any;
    public push_length: any;
    public owner: any;
    public knockback_speed: number;
    public position: any;
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.duration = params.duration;
        this.damage = params.damage;
        this.mana_burn = params.mana_burn;
        this.push_length = params.push_length;
        this.owner = this.GetCasterPlus().GetOwnerPlus() || this.GetCasterPlus();
        this.GetCasterPlus().EmitSound("Hero_Rattletrap.Power_Cogs_Impact");
        let attack_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_rattletrap/rattletrap_cog_attack.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        if (this.GetCasterPlus().GetUnitName() == "npc_imba_rattletrap_cog") {
            ParticleManager.SetParticleControlEnt(attack_particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        } else {
            ParticleManager.SetParticleControlEnt(attack_particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetParentPlus().GetAbsOrigin(), true);
        }
        this.knockback_speed = this.push_length / this.duration;
        this.position = this.GetCasterPlus().GetAbsOrigin();
        if (!this.BeginMotionOrDestroy()) {
            return;
        }
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) {
            return;
        }
        let distance = (me.GetOrigin() - this.position as Vector).Normalized();
        me.SetOrigin(me.GetOrigin() + distance * this.knockback_speed * dt as Vector);
    }
    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().RemoveHorizontalMotionController(this);
        let damageTable = {
            victim: this.GetParentPlus(),
            damage: this.damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        }
        if (!damageTable.attacker) {
            damageTable.attacker = this.owner;
        }
        ApplyDamage(damageTable);
        this.GetParentPlus().ReduceMana(this.mana_burn);
        GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetAbsOrigin(), 100, true);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
}
@registerModifier()
export class modifier_imba_rattletrap_power_cogs_charge_coil_counter extends BaseModifier_Plus {
    public push_duration: number;
    public damage: number;
    public mana_burn: any;
    public push_length: any;
    OnStackCountChanged(p_0: number,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetStackCount() <= 0) {
            let charge_coil_instances = this.GetParentPlus().FindAllModifiersByName("modifier_imba_rattletrap_power_cogs_charge_coil_instance");
            if (GameFunc.GetCount(charge_coil_instances) >= 1) {
                for (const [_, modifier] of GameFunc.iPair(charge_coil_instances)) {
                    modifier.Destroy();
                }
            }
            this.Destroy();
        }
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.push_duration = params.push_duration;
        this.damage = params.damage;
        this.mana_burn = params.mana_burn;
        this.push_length = params.push_length;
        this.IncrementStackCount();
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_FAIL
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.GetParentPlus() && !keys.target.IsBuilding() && !keys.target.IsMagicImmune() && !keys.target.IsOther() && !keys.target.GetUnitName().includes("rattletrap_cog") && !keys.target.HasModifier("modifier_imba_rattletrap_cog_push")) {
            let charge_coil_instances = this.GetParentPlus().FindAllModifiersByName("modifier_imba_rattletrap_power_cogs_charge_coil_instance");
            if (GameFunc.GetCount(charge_coil_instances) >= 1) {
                keys.target.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_rattletrap_cog_push", {
                    duration: this.push_duration * (1 - keys.target.GetStatusResistance()),
                    damage: this.damage,
                    mana_burn: this.mana_burn,
                    push_length: 0
                });
                charge_coil_instances[0].Destroy();
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_FAIL)
    CC_OnAttackFail(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker.IsRangedAttacker() && keys.attacker == this.GetParentPlus() && !keys.target.IsBuilding() && !keys.target.IsMagicImmune() && !keys.target.IsOther() && keys.target.GetUnitName() != "npc_imba_rattletrap_cog" && !keys.target.HasModifier("modifier_imba_rattletrap_cog_push")) {
            let charge_coil_instances = this.GetParentPlus().FindAllModifiersByName("modifier_imba_rattletrap_power_cogs_charge_coil_instance");
            if (GameFunc.GetCount(charge_coil_instances) >= 1) {
                charge_coil_instances[0].Destroy();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_rattletrap_power_cogs_charge_coil_instance extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        let charge_coil_modifier = this.GetParentPlus().FindModifierByNameAndCaster("modifier_imba_rattletrap_power_cogs_charge_coil_counter", this.GetCasterPlus());
        if (charge_coil_modifier) {
            charge_coil_modifier.DecrementStackCount();
        }
    }
}
@registerModifier()
export class modifier_imba_rattletrap_power_cogs_rotational extends BaseModifierMotionHorizontal_Plus {
    public center_loc: any;
    public rotational_speed: number;
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.center_loc = Vector(params.center_loc_x, params.center_loc_y, params.center_loc_z);
        this.rotational_speed = params.rotational_speed;
        if (!this.BeginMotionOrDestroy()) {
            return;
        }
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        me.SetOrigin(GetGroundPosition(RotatePosition(this.center_loc, QAngle(0, this.rotational_speed * dt, 0), me.GetAbsOrigin()), undefined));
        me.SetForwardVector(me.GetAbsOrigin() - this.center_loc as Vector);
    }
    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().RemoveHorizontalMotionController(this);
    }
}
@registerAbility()
export class imba_rattletrap_rocket_flare extends BaseAbility_Plus {
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        if (this.GetCasterPlus().GetUnitName().includes("rattletrap")) {
            this.GetCasterPlus().EmitSound("rattletrap_ratt_ability_flare_0" + RandomInt(1, 7));
            let caster = this.GetCasterPlus();
            if (caster.GetTogglableWearablePlus(DOTASlotType_t.DOTA_LOADOUT_TYPE_MISC)) {
                caster.GetTogglableWearablePlus(DOTASlotType_t.DOTA_LOADOUT_TYPE_MISC).AddEffects(EntityEffects.EF_NODRAW);
            }
        }
        if (!this.GetAutoCastState()) {
            let rocket_target = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, undefined, {
                duration: FrameTime()
            }, this.GetCursorPosition(), this.GetCasterPlus().GetTeamNumber(), false);
            let rocket_dummy = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, undefined, {}, this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_rattletrap_rocket_flare_truesight")) {
                rocket_dummy.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_gem_of_true_sight", {});
            }
            let rocket_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_rattletrap/rattletrap_rocket_flare.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
            ParticleManager.SetParticleControl(rocket_particle, 0, this.GetCasterPlus().GetAttachmentOrigin(this.GetCasterPlus().ScriptLookupAttachment("attach_rocket")));
            ParticleManager.SetParticleControl(rocket_particle, 1, this.GetCursorPosition());
            ParticleManager.SetParticleControl(rocket_particle, 2, Vector(this.GetSpecialValueFor("speed"), 0, 0));
            let rocket = {
                Target: rocket_target,
                Source: this.GetCasterPlus(),
                Ability: this,
                iMoveSpeed: this.GetSpecialValueFor("speed"),
                vSourceLoc: this.GetCasterPlus().GetAttachmentOrigin(this.GetCasterPlus().ScriptLookupAttachment("attach_rocket")),
                bDrawsOnMinimap: true,
                bDodgeable: true,
                bIsAttack: false,
                bVisibleToEnemies: true,
                bReplaceExisting: false,
                flExpireTime: GameRules.GetGameTime() + 20,
                bProvidesVision: true,
                iVisionRadius: this.GetSpecialValueFor("vision_radius"),
                iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
                ExtraData: {
                    rocket_dummy: rocket_dummy.entindex(),
                    rocket_particle: rocket_particle,
                    x: this.GetCasterPlus().GetAbsOrigin().x,
                    y: this.GetCasterPlus().GetAbsOrigin().y,
                    z: this.GetCasterPlus().GetAbsOrigin().z
                }
            }
            this.GetCasterPlus().EmitSound("Hero_Rattletrap.Rocket_Flare.Fire");
            if ((this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D() > 200) {
                rocket_dummy.EmitSound("Hero_Rattletrap.Rocket_Flare.Travel");
            }
            ProjectileManager.CreateTrackingProjectile(rocket);
            rocket_target.RemoveSelf();
        } else {
            for (let instance = 0; instance <= this.GetSpecialValueFor("carpet_fire_rockets") - 1; instance++) {
                let cursor_position = this.GetCursorPosition();
                this.AddTimer(this.GetSpecialValueFor("carpet_fire_delay") * instance, () => {
                    if (this) {
                        let random_position = cursor_position + RandomVector(RandomInt(0, this.GetSpecialValueFor("radius") * this.GetSpecialValueFor("carpet_fire_spread"))) as Vector;
                        let rocket_target = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, undefined, {
                            duration: FrameTime()
                        }, random_position, this.GetCasterPlus().GetTeamNumber(), false);
                        let rocket_dummy = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, undefined, {}, this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
                        let rocket_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_rattletrap/rattletrap_rocket_flare.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
                        ParticleManager.SetParticleControl(rocket_particle, 0, this.GetCasterPlus().GetAttachmentOrigin(this.GetCasterPlus().ScriptLookupAttachment("attach_rocket")));
                        ParticleManager.SetParticleControl(rocket_particle, 1, random_position);
                        ParticleManager.SetParticleControl(rocket_particle, 2, Vector(this.GetSpecialValueFor("speed"), 0, 0));
                        let rocket = {
                            Target: rocket_target,
                            Source: this.GetCasterPlus(),
                            Ability: this,
                            iMoveSpeed: this.GetSpecialValueFor("speed"),
                            vSourceLoc: this.GetCasterPlus().GetAttachmentOrigin(this.GetCasterPlus().ScriptLookupAttachment("attach_rocket")),
                            bDrawsOnMinimap: true,
                            bDodgeable: true,
                            bIsAttack: false,
                            bVisibleToEnemies: true,
                            bReplaceExisting: false,
                            flExpireTime: GameRules.GetGameTime() + 20,
                            bProvidesVision: true,
                            iVisionRadius: this.GetSpecialValueFor("vision_radius"),
                            iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
                            ExtraData: {
                                rocket_dummy: rocket_dummy.entindex(),
                                rocket_particle: rocket_particle,
                                x: this.GetCasterPlus().GetAbsOrigin().x,
                                y: this.GetCasterPlus().GetAbsOrigin().y,
                                z: this.GetCasterPlus().GetAbsOrigin().z,
                                carpet_fire: true
                            }
                        }
                        this.GetCasterPlus().EmitSound("Hero_Rattletrap.Rocket_Flare.Fire");
                        rocket_dummy.EmitSound("Hero_Rattletrap.Rocket_Flare.Travel");
                        ProjectileManager.CreateTrackingProjectile(rocket);
                        rocket_target.RemoveSelf();
                    }
                });
            }
        }
    }
    OnProjectileThink_ExtraData(vLocation: Vector, ExtraData: any): void {
        EntIndexToHScript(ExtraData.rocket_dummy).SetAbsOrigin(vLocation);
    }
    OnProjectileHit_ExtraData(hTarget: CDOTA_BaseNPC | undefined, vLocation: Vector, ExtraData: any): boolean | void {
        ParticleManager.DestroyParticle(ExtraData.rocket_particle, false);
        ParticleManager.ReleaseParticleIndex(ExtraData.rocket_particle);
        let caster = this.GetCasterPlus();
        if (caster.GetTogglableWearablePlus(DOTASlotType_t.DOTA_LOADOUT_TYPE_MISC)) {
            caster.GetTogglableWearablePlus(DOTASlotType_t.DOTA_LOADOUT_TYPE_MISC).RemoveEffects(EntityEffects.EF_NODRAW);
        }
        EntIndexToHScript(ExtraData.rocket_dummy).StopSound("Hero_Rattletrap.Rocket_Flare.Travel");
        EntIndexToHScript(ExtraData.rocket_dummy).RemoveSelf();
        EmitSoundOnLocationWithCaster(vLocation, "Hero_Rattletrap.Rocket_Flare.Explode", this.GetCasterPlus());
        let illumination_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_rattletrap/rattletrap_rocket_flare_illumination.vpcf", ParticleAttachment_t.PATTACH_POINT, hTarget);
        ParticleManager.SetParticleControl(illumination_particle, 1, Vector(this.GetSpecialValueFor("duration"), 0, 0));
        ParticleManager.ReleaseParticleIndex(illumination_particle);
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), vLocation, undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        let damage = this.GetAbilityDamage();
        if (ExtraData.carpet_fire) {
            damage = damage * this.GetSpecialValueFor("carpet_fire_damage") * 0.01;
        }
        let cast_position = Vector(ExtraData.x, ExtraData.y, ExtraData.z);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            let flare_damage = damage;
            let travel_distance = (enemy.GetAbsOrigin() - cast_position as Vector).Length2D();
            let target_distance = (enemy.GetAbsOrigin() - vLocation as Vector).Length2D();
            if (!ExtraData.carpet_fire && travel_distance >= this.GetSpecialValueFor("system_min_distance") && (target_distance <= this.GetSpecialValueFor("system_radius"))) {
                flare_damage = damage * this.GetSpecialValueFor("system_crit") * 0.01;
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_CRITICAL, enemy, flare_damage, undefined);
                enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_rattletrap_rocket_flare_critical", {
                    duration: this.GetSpecialValueFor("system_duration") * (1 - enemy.GetStatusResistance())
                });
            }
            let damageTable = {
                victim: enemy,
                damage: flare_damage,
                damage_type: this.GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            }
            ApplyDamage(damageTable);
            if (!enemy.IsAlive() && this.GetCasterPlus().GetUnitName().includes("rattletrap") && travel_distance >= 6000) {
                let random_response = RandomInt(8, 12);
                if (random_response <= 9) {
                    this.GetCasterPlus().EmitSound("rattletrap_ratt_ability_flare_0" + random_response);
                } else {
                    this.GetCasterPlus().EmitSound("rattletrap_ratt_ability_flare_" + random_response);
                }
            }
        }
        AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), vLocation, this.GetSpecialValueFor("radius"), this.GetSpecialValueFor("duration"), false);
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_rattletrap_rocket_flare_truesight") && !ExtraData.carpet_fire) {
            let sight_area = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_item_imba_gem_of_true_sight", {
                duration: this.GetSpecialValueFor("duration")
            }, vLocation, this.GetCasterPlus().GetTeamNumber(), false);
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.POSITION_most_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_rattletrap_rocket_flare_critical extends BaseModifier_Plus {
    public system_mana_loss_pct: number;
    IsPurgable(): boolean {
        return false;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_techies_stasis.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.system_mana_loss_pct = this.GetSpecialValueFor("system_mana_loss_pct");
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_FROZEN]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_PASSIVES_DISABLED]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_TOTAL_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_TOTAL_PERCENTAGE)
    CC_GetModifierTotalPercentageManaRegen(): number {
        return (this.system_mana_loss_pct - 100) / 100;
    }
}
@registerAbility()
export class imba_rattletrap_hookshot extends BaseAbility_Plus {
    public direction: any;
    public shish_kabob: EntityIndex[];
    public razor_wind: any;
    public projectile: any;
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
    }
    GetCooldown(iLevel: number): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("cooldown_scepter");
        } else {
            return super.GetCooldown(iLevel);
        }
    }
    OnAbilityPhaseStart(): boolean {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_RATTLETRAP_HOOKSHOT_START);
        return true;
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        this.GetCasterPlus().EmitSound("Hero_Rattletrap.Hookshot.Fire");
        this.direction = (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized();
        this.direction.z = 0;
        let hookshot_duration = ((this.GetSpecialValueFor("tooltip_range") + GPropertyCalculate.GetCastRangeBonus(this.GetCasterPlus())) / this.GetSpecialValueFor("speed")) * 2;
        let hookshot_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_rattletrap/rattletrap_hookshot.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
        ParticleManager.SetParticleControlEnt(hookshot_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(hookshot_particle, 1, this.GetCasterPlus().GetAbsOrigin() + this.direction * (this.GetSpecialValueFor("tooltip_range") + GPropertyCalculate.GetCastRangeBonus(this.GetCasterPlus())) as Vector);
        ParticleManager.SetParticleControl(hookshot_particle, 2, Vector(this.GetSpecialValueFor("speed"), 0, 0));
        ParticleManager.SetParticleControl(hookshot_particle, 3, Vector(hookshot_duration, 0, 0));
        let linear_projectile = {
            Ability: this,
            vSpawnOrigin: this.GetCasterPlus().GetAbsOrigin(),
            fDistance: this.GetSpecialValueFor("tooltip_range") + GPropertyCalculate.GetCastRangeBonus(this.GetCasterPlus()),
            fStartRadius: this.GetSpecialValueFor("latch_radius"),
            fEndRadius: this.GetSpecialValueFor("latch_radius"),
            Source: this.GetCasterPlus(),
            bHasFrontalCone: false,
            bReplaceExisting: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP,
            fExpireTime: GameRules.GetGameTime() + 10.0,
            bDeleteOnHit: true,
            vVelocity: (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized() * this.GetSpecialValueFor("speed") * Vector(1, 1, 0) as Vector,
            bProvidesVision: false,
            ExtraData: {
                hookshot_particle: hookshot_particle,
                autocast: false,
            }
        }
        linear_projectile.ExtraData.autocast = true;
        this.shish_kabob = []
        this.razor_wind = {}
        this.projectile = ProjectileManager.CreateLinearProjectile(linear_projectile);
        let caster = this.GetCasterPlus();
        if (caster.GetTogglableWearablePlus(DOTASlotType_t.DOTA_LOADOUT_TYPE_WEAPON)) {
            caster.GetTogglableWearablePlus(DOTASlotType_t.DOTA_LOADOUT_TYPE_WEAPON).AddEffects(EntityEffects.EF_NODRAW);
        }
        this.AddTimer(hookshot_duration, () => {
            if (caster.GetTogglableWearablePlus(DOTASlotType_t.DOTA_LOADOUT_TYPE_WEAPON)) {
                caster.GetTogglableWearablePlus(DOTASlotType_t.DOTA_LOADOUT_TYPE_WEAPON).RemoveEffects(EntityEffects.EF_NODRAW);
            }
        });
    }
    OnProjectileThink_ExtraData(vLocation: Vector, ExtraData: any): void {
        if (!IsServer()) {
            return;
        }
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), vLocation, undefined, this.GetSpecialValueFor("razor_wind_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            let distance_vector = enemy.GetAbsOrigin() - vLocation as Vector;
            if (distance_vector.Length2D() > this.GetSpecialValueFor("latch_radius") && math.abs(math.abs(AngleDiff(VectorToAngles(distance_vector).y, VectorToAngles(this.direction).y)) - 90) <= 30 && !this.razor_wind[enemy.GetEntityIndex()]) {
                enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_stunned", {
                    duration: 0.1 * (1 - enemy.GetStatusResistance())
                });
                let damageTable = {
                    victim: enemy,
                    damage: this.GetSpecialValueFor("damage") * this.GetSpecialValueFor("razor_wind_damage") * 0.01,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this
                }
                ApplyDamage(damageTable);
                this.razor_wind[enemy.GetEntityIndex()] = true;
            }
        }
    }
    OnProjectileHit_ExtraData(hTarget: CDOTA_BaseNPC | undefined, vLocation: Vector, ExtraData: any): boolean | void {
        if (!IsServer()) {
            return;
        }
        if (hTarget) {
            if (hTarget != this.GetCasterPlus()) {
                if (!ExtraData.autocast) {
                    this.GetCasterPlus().StopSound("Hero_Rattletrap.Hookshot.Fire");
                    hTarget.EmitSound("Hero_Rattletrap.Hookshot.Impact");
                    if ((this.GetCasterPlus().GetAbsOrigin() - hTarget.GetAbsOrigin() as Vector).Length2D() > this.GetSpecialValueFor("latch_radius")) {
                        this.GetCasterPlus().EmitSound("Hero_Rattletrap.Hookshot.Retract");
                    }
                    ParticleManager.SetParticleControlEnt(ExtraData.hookshot_particle, 1, hTarget, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true);
                    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_rattletrap_hookshot", {
                        duration: (this.GetSpecialValueFor("tooltip_range") + this.GetCasterPlus().GetCastRangeBonus()) / this.GetSpecialValueFor("speed"),
                        latch_radius: this.GetSpecialValueFor("latch_radius"),
                        stun_radius: this.GetSpecialValueFor("stun_radius"),
                        stun_duration: this.GetSpecialValueFor("duration"),
                        speed: this.GetSpecialValueFor("speed"),
                        damage: this.GetSpecialValueFor("damage"),
                        ent_index: hTarget.GetEntityIndex(),
                        particle: ExtraData.hookshot_particle
                    });
                    ProjectileManager.DestroyLinearProjectile(this.projectile);
                    return true;
                } else {
                    hTarget.EmitSound("Hero_Rattletrap.Hookshot.Impact");
                    this.shish_kabob.push(hTarget.GetEntityIndex());
                    ParticleManager.SetParticleControlEnt(ExtraData.hookshot_particle, 1, hTarget, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true);
                }
                if (hTarget.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
                    hTarget.AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_stunned", {
                        duration: this.GetSpecialValueFor("duration") * (1 - hTarget.GetStatusResistance())
                    });
                }
            }
        } else {
            if (ExtraData.autocast && this.shish_kabob.length > 0) {
                if ((this.GetCasterPlus().GetAbsOrigin() - EntIndexToHScript(this.shish_kabob[this.shish_kabob.length - 1]).GetAbsOrigin() as Vector).Length2D() > this.GetSpecialValueFor("latch_radius")) {
                    this.GetCasterPlus().EmitSound("Hero_Rattletrap.Hookshot.Retract");
                }
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_rattletrap_hookshot", {
                    duration: (this.GetSpecialValueFor("tooltip_range") + this.GetCasterPlus().GetCastRangeBonus()) / this.GetSpecialValueFor("speed"),
                    latch_radius: this.GetSpecialValueFor("latch_radius"),
                    stun_radius: this.GetSpecialValueFor("stun_radius"),
                    stun_duration: this.GetSpecialValueFor("duration"),
                    speed: this.GetSpecialValueFor("speed"),
                    damage: this.GetSpecialValueFor("damage"),
                    ent_index: this.shish_kabob[this.shish_kabob.length - 1],
                    particle: ExtraData.hookshot_particle,
                    shish_kabob: true
                });
            }
            ParticleManager.SetParticleControl(ExtraData.hookshot_particle, 1, this.GetCasterPlus().GetAbsOrigin());
        }
    }
    GetManaCost(level: number): number {
        return 800;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_rattletrap_hookshot extends BaseModifierMotionHorizontal_Plus {
    public duration: number;
    public latch_radius: number;
    public stun_radius: number;
    public stun_duration: number;
    public speed: number;
    public damage: number;
    public particle: any;
    public shish_kabob: boolean;
    public target: IBaseNpc_Plus;
    public distance: number;
    public enemies_hit: any;
    IgnoreTenacity() {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.duration = params.duration;
        this.latch_radius = params.latch_radius;
        this.stun_radius = params.stun_radius;
        this.stun_duration = params.stun_duration;
        this.speed = params.speed;
        this.damage = params.damage;
        this.particle = params.particle;
        this.shish_kabob = GToBoolean(params.shish_kabob);
        this.target = EntIndexToHScript(params.ent_index) as IBaseNpc_Plus;
        this.distance = (this.target.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized();
        this.enemies_hit = {}
        if (!this.BeginMotionOrDestroy()) {
            return;

        } else if (this.GetCasterPlus().GetUnitName().includes("rattletrap")) {
            let responses = {
                "1": "rattletrap_ratt_ability_batt_06",
                "2": "rattletrap_ratt_ability_batt_07",
                "3": "rattletrap_ratt_ability_batt_11",
                "4": "rattletrap_ratt_ability_hook_01",
                "5": "rattletrap_ratt_ability_hook_02",
                "6": "rattletrap_ratt_ability_hook_06"
            }
            this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(responses));
        }
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus() == this.GetParentPlus()) {
            for (const [_, unit] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.stun_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false))) {
                if (unit.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() && !this.enemies_hit[unit.GetEntityIndex()]) {
                    unit.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_generic_stunned", {
                        duration: this.stun_duration * (1 - unit.GetStatusResistance())
                    });
                    ApplyDamage({
                        victim: unit,
                        damage: this.damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.GetCasterPlus(),
                        ability: this.GetAbilityPlus()
                    });
                    this.enemies_hit[unit.GetEntityIndex()] = true;
                }
                if (this.shish_kabob && unit != this.target && !unit.IsMagicImmune()) {
                    unit.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_rattletrap_hookshot", {
                        duration: this.GetRemainingTime(),
                        latch_radius: this.latch_radius,
                        stun_radius: 0,
                        stun_duration: 0,
                        speed: this.speed,
                        damage: 0,
                        ent_index: this.target.GetEntityIndex()
                    });
                }
            }
        }
        this.distance = (this.target.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized();
        me.SetOrigin(me.GetOrigin() + this.distance * this.speed * dt as Vector);
        if ((this.GetCasterPlus().GetAbsOrigin() - this.target.GetAbsOrigin() as Vector).Length2D() <= this.latch_radius) {
            FindClearSpaceForUnit(this.GetParentPlus(), this.target.GetAbsOrigin() - this.distance * (this.GetParentPlus().GetHullRadius() + this.target.GetHullRadius()) as Vector, true);
            this.Destroy();
        }
    }
    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().RemoveHorizontalMotionController(this);
        this.GetCasterPlus().StopSound("Hero_Rattletrap.Hookshot.Retract");
        this.GetCasterPlus().EmitSound("Hero_Rattletrap.Hookshot.Damage");
        if (this.GetCasterPlus().GetUnitName().includes("rattletrap") && (this.GetCasterPlus().GetAbsOrigin() - this.target.GetAbsOrigin() as Vector).Length2D() <= this.latch_radius && RollPercentage(15)) {
            if (this.target.GetUnitName().includes("pudge")) {
                let responses = {
                    "1": "rattletrap_ratt_ability_hook_08",
                    "2": "rattletrap_ratt_ability_hook_11",
                    "3": "rattletrap_ratt_ability_hook_12"
                }
                this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(responses));
            } else if (this.target.GetUnitName().includes("tinker")) {
                this.GetCasterPlus().EmitSound("rattletrap_ratt_ability_hook_13");
            } else {
                this.GetCasterPlus().EmitSound("rattletrap_ratt_ability_hook_0" + RandomInt(4, 5));
            }
        }
        if (this.particle) {
            ParticleManager.DestroyParticle(this.particle, false);
            ParticleManager.ReleaseParticleIndex(this.particle);
        }
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_RATTLETRAP_HOOKSHOT_END);
        if (this.GetCasterPlus().GetTogglableWearablePlus(DOTASlotType_t.DOTA_LOADOUT_TYPE_WEAPON)) {
            this.GetCasterPlus().GetTogglableWearablePlus(DOTASlotType_t.DOTA_LOADOUT_TYPE_WEAPON).RemoveEffects(EntityEffects.EF_NODRAW);
        }
        if (this.GetCasterPlus() == this.GetParentPlus()) {
            for (const [_, unit] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.stun_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false))) {
                if (!this.enemies_hit[unit.GetEntityIndex()]) {
                    unit.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_generic_stunned", {
                        duration: this.stun_duration * (1 - unit.GetStatusResistance())
                    });
                    ApplyDamage({
                        victim: unit,
                        damage: this.damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.GetCasterPlus(),
                        ability: this.GetAbilityPlus()
                    });
                    this.enemies_hit[unit.GetEntityIndex()] = true;
                }
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() || this.GetParentPlus() == this.GetCasterPlus()) {
            return {
                [modifierstate.MODIFIER_STATE_SILENCED]: true,
                [modifierstate.MODIFIER_STATE_DISARMED]: true
            };
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_RATTLETRAP_HOOKSHOT_LOOP;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_rattletrap_battery_assault_aura extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_rattletrap_rocket_flare_truesight extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_rattletrap_rocket_flare_speed extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_rattletrap_battery_assault_interval extends BaseModifier_Plus {
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
