
import { AI_ability } from "../../../ai/AI_ability";
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_keeper_of_the_light_illuminate extends BaseAbility_Plus {
    public caster: IBaseNpc_Plus;
    public position: Vector;
    GetAssociatedSecondaryAbilities(): string {
        return "imba_keeper_of_the_light_illuminate_end";
    }
    OnUpgrade(): void {
        if (!IsServer()) {
            return;
        }
        let illuminate_end = this.GetCasterPlus().findAbliityPlus<imba_keeper_of_the_light_illuminate_end>("imba_keeper_of_the_light_illuminate_end");
        if (illuminate_end) {
            illuminate_end.SetLevel(this.GetLevel());
        }
    }
    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        this.caster = this.GetCasterPlus();
        this.position = this.GetCursorPosition();
        this.caster.EmitSound("Hero_KeeperOfTheLight.Illuminate.Charge");
        this.caster.AddNewModifier(this.caster, this, "modifier_imba_keeper_of_the_light_illuminate_self_thinker", {
            duration: this.GetSpecialValueFor("max_channel_time")
        });
    }
    OnChannelThink(p_0: number,): void {

    }
    OnChannelFinish(bInterrupted: boolean): void {

    }

    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_keeper_of_the_light_illuminate_self_thinker extends BaseModifier_Plus {
    public ability: imba_keeper_of_the_light_illuminate;
    public caster: IBaseNpc_Plus;
    public damage_per_second: number;
    public max_channel_time: number;
    public range: number;
    public speed: number;
    public vision_radius: number;
    public vision_duration: number;
    public channel_vision_radius: number;
    public channel_vision_interval: number;
    public channel_vision_duration: number;
    public channel_vision_step: any;
    public total_damage: number;
    public transient_form_ms_reduction: any;
    public caster_location: any;
    public position: any;
    public vision_node_distance: number;
    public direction: any;
    public game_time_start: number;
    public vision_counter: number;
    public vision_time_count: number;
    public weapon_particle: any;
    public spirit: any;
    public duration: number;
    public game_time_end: number;
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_spirit_form_ambient.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_keeper_spirit_form.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.damage_per_second = this.ability.GetSpecialValueFor("damage_per_second");
        this.max_channel_time = this.ability.GetSpecialValueFor("max_channel_time");
        this.range = this.ability.GetSpecialValueFor("range");
        this.speed = this.ability.GetSpecialValueFor("speed");
        this.vision_radius = this.ability.GetSpecialValueFor("vision_radius");
        this.vision_duration = this.ability.GetSpecialValueFor("vision_duration");
        this.channel_vision_radius = this.ability.GetSpecialValueFor("channel_vision_radius");
        this.channel_vision_interval = this.ability.GetSpecialValueFor("channel_vision_interval");
        this.channel_vision_duration = this.ability.GetSpecialValueFor("channel_vision_duration");
        this.channel_vision_step = this.ability.GetSpecialValueFor("channel_vision_step");
        this.total_damage = this.ability.GetSpecialValueFor("total_damage");
        this.transient_form_ms_reduction = this.ability.GetSpecialValueFor("transient_form_ms_reduction");
        this.caster_location = this.caster.GetAbsOrigin();
        this.position = this.ability.position;
        this.vision_node_distance = this.channel_vision_radius * 0.5;
        if (!IsServer()) {
            return;
        }
        this.direction = (this.position - this.caster_location as Vector).Normalized();
        this.game_time_start = GameRules.GetGameTime();
        this.vision_counter = 1;
        this.vision_time_count = GameRules.GetGameTime();
        this.weapon_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_keeper_of_the_light/kotl_illuminate_cast.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.caster);
        ParticleManager.SetParticleControlEnt(this.weapon_particle, 0, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.caster.GetAbsOrigin(), true);
        this.AddParticle(this.weapon_particle, false, false, -1, false, false);
        this.caster.SwapAbilities("imba_keeper_of_the_light_illuminate", "imba_keeper_of_the_light_illuminate_end", false, true);
        let horse_thinker = BaseModifier_Plus.CreateBuffThinker(this.caster, this.ability, undefined, {
            duration: this.max_channel_time
        }, this.caster_location, this.caster.GetTeamNumber(), false);
        this.spirit = horse_thinker;
        horse_thinker.SetForwardVector(this.direction);
        horse_thinker.AddNewModifier(this.caster, this.ability, "modifier_imba_keeper_of_the_light_spirit_form_illuminate", {
            duration: this.duration
        });
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (GameRules.GetGameTime() - this.vision_time_count >= this.channel_vision_interval) {
            this.vision_time_count = GameRules.GetGameTime();
            this.ability.CreateVisibilityNode(this.caster_location + (this.direction * this.channel_vision_step * this.vision_counter), this.channel_vision_radius, this.channel_vision_duration);
            this.vision_counter = this.vision_counter + 1;
        }
        this.SetStackCount(math.min((GameRules.GetGameTime() - this.game_time_start + this.ability.GetCastPoint()) * this.damage_per_second, this.total_damage));
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.direction = (this.position - this.caster_location as Vector).Normalized();
        this.duration = this.range / this.speed;
        this.game_time_end = GameRules.GetGameTime();
        this.caster.EmitSound("Hero_KeeperOfTheLight.Illuminate.Discharge");
        this.caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1_END);
        BaseModifier_Plus.CreateBuffThinker(this.caster, this.ability, "modifier_imba_keeper_of_the_light_illuminate", {
            duration: this.range / this.speed,
            direction_x: this.direction.x,
            direction_y: this.direction.y,
            channel_time: this.game_time_end - this.game_time_start
        }, this.caster_location, this.caster.GetTeamNumber(), false);
        this.caster.SwapAbilities("imba_keeper_of_the_light_illuminate_end", "imba_keeper_of_the_light_illuminate", false, true);
        if (this.spirit) {
            this.spirit.RemoveSelf();
        }
        if (this.caster.GetUnitName().includes("keeper_of_the_light")) {
            if (RollPercentage(5)) {
                this.caster.EmitSound("keeper_of_the_light_keep_illuminate_06");
            } else if (RollPercentage(50)) {
                if (RollPercentage(50)) {
                    this.caster.EmitSound("keeper_of_the_light_keep_illuminate_05");
                } else {
                    this.caster.EmitSound("keeper_of_the_light_keep_illuminate_07");
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
        if (!this.caster.HasScepter()) {
            return this.transient_form_ms_reduction * (-1);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (IsServer() && !this.ability.IsChanneling() && this.caster.HasTalent("special_bonus_imba_keeper_of_the_light_travelling_light")) {
            return {
                [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true
            };
        }
    }
}
@registerModifier()
export class modifier_imba_keeper_of_the_light_illuminate extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public caster: IBaseNpc_Plus;
    public damage_per_second: number;
    public radius: number;
    public speed: number;
    public total_damage: number;
    public duration: number;
    public direction: any;
    public direction_angle: any;
    public channel_time: number;
    public particle: any;
    public hit_targets: IBaseNpc_Plus[];
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.caster = this.GetCasterPlus();
        this.damage_per_second = this.ability.GetSpecialValueFor("damage_per_second");
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.speed = this.ability.GetSpecialValueFor("speed");
        this.total_damage = this.ability.GetSpecialValueFor("total_damage");
        this.duration = params.duration;
        this.direction = Vector(params.direction_x, params.direction_y, 0);
        this.direction_angle = math.deg(math.atan2(this.direction.x, this.direction.y));
        this.channel_time = params.channel_time;
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_keeper_of_the_light/kotl_illuminate.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
        ParticleManager.SetParticleControl(this.particle, 1, this.direction * this.speed as Vector);
        ParticleManager.SetParticleControl(this.particle, 3, this.parent.GetAbsOrigin());
        this.AddParticle(this.particle, false, false, -1, false, false);
        this.hit_targets = []
        this.OnIntervalThink();
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let targets = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        let damage = math.min((this.channel_time + this.ability.GetCastPoint()) * this.damage_per_second, this.total_damage);
        let valid_targets: IBaseNpc_Plus[] = []
        for (const [_, target] of GameFunc.iPair(targets)) {
            let target_pos = target.GetAbsOrigin();
            let target_angle = math.deg(math.atan2((target_pos.x - this.parent.GetAbsOrigin().x), target_pos.y - this.parent.GetAbsOrigin().y));
            let difference = math.abs(this.direction_angle - target_angle);
            if (difference <= 90 || difference >= 270) {
                valid_targets.push(target);
            }
        }
        for (const [_, target] of GameFunc.iPair(valid_targets)) {
            let hit_already = false;
            for (const [_, hit_target] of GameFunc.iPair(this.hit_targets)) {
                if (hit_target == target) {
                    hit_already = true;
                    return;
                }
            }
            if (!hit_already) {
                if (target.GetTeam() != this.caster.GetTeam()) {
                    let damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
                    if (this.caster.HasTalent("special_bonus_imba_keeper_of_the_light_pure_illuminate")) {
                        damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PURE;
                    }
                    let damageTable = {
                        victim: target,
                        damage: damage,
                        damage_type: damage_type,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.caster,
                        ability: this.ability
                    }
                    ApplyDamage(damageTable);
                    let spotlight_modifier = this.caster.findBuff<modifier_imba_keeper_of_the_light_spotlights>("modifier_imba_keeper_of_the_light_spotlights");
                    if (spotlight_modifier) {
                        spotlight_modifier.Spotlight(target.GetAbsOrigin(), this.radius, spotlight_modifier.GetSpecialValueFor("attack_duration"));
                    }
                } else if (GameRules.IsDaytime() && this.caster.HasScepter()) {
                    target.ApplyHeal(damage, this.ability);
                    if (target.IsRealUnit()) {
                    }
                }
                target.EmitSound("Hero_KeeperOfTheLight.Illuminate.Target");
                target.EmitSound("Hero_KeeperOfTheLight.Illuminate.Target.Secondary");
                let particle_name = "particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_illuminate_impact_small.vpcf";
                if (target.IsRealUnit()) {
                    particle_name = "particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_illuminate_impact.vpcf";
                }
                let particle = ResHelper.CreateParticleEx(particle_name, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                ParticleManager.SetParticleControl(particle, 1, target.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(particle);
                this.hit_targets.push(target);
            }
        }
        this.parent.SetAbsOrigin(this.parent.GetAbsOrigin() + (this.direction * this.speed * FrameTime()) as Vector);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.parent.RemoveSelf();
    }
}
@registerModifier()
export class modifier_imba_keeper_of_the_light_spirit_form_illuminate extends BaseModifier_Plus {
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_keeper_spirit_form.vpcf";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    CC_GetModifierModelChange(): string {
        return "models/items/keeper_of_the_light/ti7_immortal_mount/kotl_ti7_immortal_horsefx_proxy.vmdl";
    }
}
@registerAbility()
export class imba_keeper_of_the_light_illuminate_end extends BaseAbility_Plus {
    public caster: IBaseNpc_Plus;
    GetAssociatedPrimaryAbilities(): string {
        return "imba_keeper_of_the_light_illuminate";
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        this.caster = this.GetCasterPlus();
        let illuminate = this.caster.findAbliityPlus<imba_keeper_of_the_light_illuminate>("imba_keeper_of_the_light_illuminate");
        if (illuminate) {
            let illuminate_self_thinker = this.caster.findBuff<modifier_imba_keeper_of_the_light_illuminate_self_thinker>("modifier_imba_keeper_of_the_light_illuminate_self_thinker");
            if (illuminate_self_thinker) {
                illuminate_self_thinker.Destroy();
            }
        }
    }
}
@registerAbility()
export class imba_keeper_of_the_light_blinding_light extends BaseAbility_Plus {
    public caster: IBaseNpc_Plus;
    public miss_rate: any;
    public duration: number;
    public radius: number;
    public knockback_duration: number;
    public knockback_distance: number;
    public damage: number;
    public cast_range_tooltip: number;
    public strobe_count: number;
    public strobe_delay: number;
    GetCooldown(level: number): number {
        return super.GetCooldown(level) * (math.max(this.GetCasterPlus().GetTalentValue("special_bonus_imba_keeper_of_the_light_luminous_burster", "cooldown_mult"), 1));
    }
    OnUpgrade(): void {
        if (this.GetLevel() == 1) {
            this.ToggleAutoCast();
        }
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.miss_rate = this.GetSpecialValueFor("miss_rate");
        this.duration = this.GetSpecialValueFor("duration");
        this.radius = this.GetSpecialValueFor("radius");
        this.knockback_duration = this.GetSpecialValueFor("knockback_duration");
        this.knockback_distance = this.GetSpecialValueFor("knockback_distance");
        this.damage = this.GetSpecialValueFor("damage");
        this.cast_range_tooltip = this.GetSpecialValueFor("cast_range_tooltip");
        this.strobe_count = this.GetSpecialValueFor("strobe_count");
        this.strobe_delay = this.GetSpecialValueFor("strobe_delay");
        if (!IsServer()) {
            return;
        }
        if (this.caster.GetUnitName().includes("keeper_of_the_light") && RollPercentage(15)) {
            this.caster.EmitSound("keeper_of_the_light_keep_illuminate_02");
        }
        let counter = 1;
        let position = this.GetCursorPosition();
        this.AddTimer(0, () => {
            this.Pulse(position);
            if (this.GetAutoCastState() && counter <= this.strobe_count) {
                counter = counter + 1;
                return this.strobe_delay;
            }
        });
        if (this.caster.HasTalent("special_bonus_imba_keeper_of_the_light_luminous_burster")) {
            let bursts = 0;
            let max_bursts = this.caster.GetTalentValue("special_bonus_imba_keeper_of_the_light_luminous_burster");
            let burst_delay = this.caster.GetTalentValue("special_bonus_imba_keeper_of_the_light_luminous_burster", "delay");
            let burst_direction = (position - this.caster.GetAbsOrigin() as Vector).Normalized();
            this.AddTimer(burst_delay, () => {
                let burst_position = position + (burst_direction * this.radius * (bursts + 1)) as Vector;
                this.Pulse(burst_position);
                bursts = bursts + 1;
                if (bursts < max_bursts) {
                    return burst_delay;
                }
            });
        }
    }
    Pulse(position: Vector) {
        if (!IsServer()) {
            return;
        }
        this.caster.EmitSound("Hero_KeeperOfTheLight.BlindingLight");
        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_blinding_light_aoe.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.caster, this.caster);
        ParticleManager.SetParticleControl(particle, 0, position);
        ParticleManager.SetParticleControl(particle, 1, position);
        ParticleManager.SetParticleControl(particle, 2, Vector(this.radius, 0, 0));
        ParticleManager.ReleaseParticleIndex(particle);
        let spotlight_modifier = this.caster.findBuff<modifier_imba_keeper_of_the_light_spotlights>("modifier_imba_keeper_of_the_light_spotlights");
        if (spotlight_modifier) {
            spotlight_modifier.Spotlight(position, this.radius, spotlight_modifier.GetSpecialValueFor("attack_duration"));
        }
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), position, undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            let damageTable = {
                victim: enemy,
                damage: this.damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.caster,
                ability: this
            }
            ApplyDamage(damageTable);
            enemy.FaceTowards(position * (-1) as Vector);
            enemy.SetForwardVector((enemy.GetAbsOrigin() - position as Vector).Normalized());
            enemy.AddNewModifier(this.caster, this, "modifier_imba_keeper_of_the_light_blinding_light", {
                duration: this.duration * (1 - enemy.GetStatusResistance())
            });
            if (enemy.HasModifier("modifier_imba_blinding_light_knockback")) {
                enemy.findBuff<modifier_imba_blinding_light_knockback>("modifier_imba_blinding_light_knockback").Destroy();
            }
            enemy.AddNewModifier(this.caster, this, "modifier_imba_blinding_light_knockback", {
                x: position.x,
                y: position.y,
                z: position.z,
                duration: this.knockback_duration * (1 - enemy.GetStatusResistance())
            });
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_keeper_of_the_light_luminous_burster") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_keeper_of_the_light_luminous_burster")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_keeper_of_the_light_luminous_burster"), "modifier_special_bonus_imba_keeper_of_the_light_luminous_burster", {});
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_keeper_of_the_light_blinding_light extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public miss_rate: any;
    GetEffectName(): string {
        return "particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_blinding_light_debuff.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.miss_rate = this.ability.GetSpecialValueFor("miss_rate");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE)
    CC_GetModifierMiss_Percentage(): number {
        return this.miss_rate;
    }
}
@registerModifier()
export class modifier_imba_blinding_light_knockback extends BaseModifierMotionHorizontal_Plus {
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public knockback_duration: number;
    public knockback_distance: number;
    public knockback_speed: number;
    public position: any;
    IsHidden(): boolean {
        return true;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.knockback_duration = this.ability.GetSpecialValueFor("knockback_duration");
        this.knockback_distance = this.ability.GetSpecialValueFor("knockback_distance");
        this.knockback_speed = this.knockback_distance / this.knockback_duration;
        this.position = Vector(params.x, params.y, params.z);
        this.parent.StartGesture(GameActivity_t.ACT_DOTA_FLAIL);
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
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        GridNav.DestroyTreesAroundPoint(this.parent.GetOrigin(), 150, true);
        this.parent.FadeGesture(GameActivity_t.ACT_DOTA_FLAIL);
        // this.parent.RemoveHorizontalMotionController();
        FindClearSpaceForUnit(this.GetParentPlus(), this.GetParentPlus().GetAbsOrigin(), false);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING)
    CC_GetModifierDisableTurning(): 0 | 1 {
        return 1;
    }
}
@registerAbility()
export class imba_keeper_of_the_light_chakra_magic extends BaseAbility_Plus {
    public caster: IBaseNpc_Plus;
    public target: IBaseNpc_Plus;
    public mana_restore: any;
    public cooldown_reduction: number;
    public duration: number;
    public particle: any;
    OnAbilityPhaseStart(): boolean {
        if (this.GetCursorTarget().GetTeam() != this.GetCasterPlus().GetTeam()) {
            this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2);
        }
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        if (this.GetCursorTarget().GetTeam() != this.GetCasterPlus().GetTeam()) {
            this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2);
        }
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.target = this.GetCursorTarget();
        this.mana_restore = this.GetSpecialValueFor("mana_restore");
        this.cooldown_reduction = this.GetSpecialValueFor("cooldown_reduction");
        this.duration = this.GetSpecialValueFor("duration");
        if (!IsServer()) {
            return;
        }
        if (this.target.GetTeam() == this.caster.GetTeam()) {
            this.caster.EmitSound("Hero_KeeperOfTheLight.ChakraMagic.Target");
            this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_chakra_magic.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.caster);
            ParticleManager.SetParticleControlEnt(this.particle, 0, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(this.particle, 1, this.target.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(this.particle);
            if (this.caster.GetUnitName().includes("keeper_of_the_light")) {
                if (RollPercentage(15)) {
                    this.caster.EmitSound("keeper_of_the_light_keep_chakramagic_02");
                } else if (RollPercentage(25)) {
                    if (this.caster == this.target) {
                        this.caster.EmitSound("keeper_of_the_light_keep_chakramagic_06");
                    } else {
                        if (RollPercentage(50)) {
                            this.caster.EmitSound("keeper_of_the_light_keep_chakramagic_03");
                        } else {
                            this.caster.EmitSound("keeper_of_the_light_keep_chakramagic_06");
                        }
                    }
                }
            }
            this.target.GiveMana(this.mana_restore);
            if (this.target.IsRealUnit()) {
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_MANA_ADD, this.target, this.mana_restore, undefined);
            }
            for (let abilities = 0; abilities <= 23; abilities++) {
                let ability = this.target.GetAbilityByIndex(abilities);
                if (ability && ability.GetAbilityType() != ABILITY_TYPES.ABILITY_TYPE_ULTIMATE && ability != this) {
                    let remaining_cooldown = ability.GetCooldownTimeRemaining();
                    if (remaining_cooldown > 0) {
                        ability.EndCooldown();
                        ability.StartCooldown(math.max(remaining_cooldown - this.cooldown_reduction, 0));
                    }
                }
            }
        } else {
            if (this.target.TriggerSpellAbsorb(this)) {
                return;
            }
            this.caster.EmitSound("Imba.Hero_KeeperOfTheLight.ManaLeak.Cast");
            this.target.EmitSound("Imba.Hero_KeeperOfTheLight.ManaLeak.Target");
            this.target.EmitSound("Imba.Hero_KeeperOfTheLight.ManaLeak.Target.FP");
            this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_keeper_of_the_light/keeper_mana_leak_cast.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.caster);
            ParticleManager.SetParticleControlEnt(this.particle, 0, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(this.particle, 1, this.target.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(this.particle);
            if (this.caster.GetUnitName().includes("keeper_of_the_light")) {
                if (RollPercentage(50)) {
                    this.caster.EmitSound("keeper_of_the_light_keep_manaleak_0" + math.random(1, 5));
                }
            }
            this.target.AddNewModifier(this.caster, this, "modifier_imba_keeper_of_the_light_mana_leak", {
                duration: this.duration * (1 - this.target.GetStatusResistance())
            });
            if (this.caster.HasTalent("special_bonus_imba_keeper_of_the_light_flow_inhibition")) {
                let inhibition_multiplier = this.caster.GetTalentValue("special_bonus_imba_keeper_of_the_light_flow_inhibition");
                this.target.ReduceMana(this.mana_restore * inhibition_multiplier);
                if (this.target.IsRealUnit()) {
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_MANA_LOSS, this.target, this.mana_restore * inhibition_multiplier, undefined);
                }
                for (let abilities = 0; abilities <= 23; abilities++) {
                    let ability = this.target.GetAbilityByIndex(abilities);
                    if (ability && ability.GetAbilityType() != ABILITY_TYPES.ABILITY_TYPE_ULTIMATE) {
                        let remaining_cooldown = ability.GetCooldownTimeRemaining();
                        ability.EndCooldown();
                        ability.StartCooldown(remaining_cooldown + (this.cooldown_reduction * inhibition_multiplier));
                    }
                }
            }
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_friend(this, null, (unit) => {
            if (unit.GetMana() < 80) {
                return true;
            }
        })
    }
}
@registerModifier()
export class modifier_imba_keeper_of_the_light_chakra_magic extends BaseModifier_Plus {
}
@registerModifier()
export class modifier_imba_keeper_of_the_light_mana_leak extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public mana_leak_pct: number;
    public stun_duration: number;
    public starting_position: any;
    GetTexture(): string {
        return "keeper_of_the_light_mana_leak";
    }
    Init(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.mana_leak_pct = this.ability.GetSpecialValueFor("mana_leak_pct");
        this.stun_duration = this.ability.GetSpecialValueFor("stun_duration");
        if (!IsServer()) {
            return;
        }
        this.starting_position = this.parent.GetAbsOrigin();
        if (this.parent.GetMaxMana() <= 0) {
            this.parent.AddNewModifier(this.caster, this.ability, "modifier_generic_stunned", {
                duration: this.stun_duration * (1 - this.parent.GetStatusResistance())
            });
            this.Destroy();
        } else {
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_keeper_of_the_light/keeper_mana_leak.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
            ParticleManager.ReleaseParticleIndex(particle);
            this.StartIntervalThink(0.1);
        }
    }

    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let new_position = this.parent.GetAbsOrigin();
        let distance = (this.starting_position - new_position as Vector).Length2D();
        let max_mana = this.parent.GetMaxMana();
        if (distance > 0 && distance <= 300) {
            this.parent.ReduceMana((distance * 0.01) * (max_mana * this.mana_leak_pct * 0.01));
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_keeper_of_the_light/keeper_mana_leak.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
            ParticleManager.ReleaseParticleIndex(particle);
        }
        if (this.parent.GetMana() <= 0) {
            this.parent.AddNewModifier(this.caster, this.ability, "modifier_generic_stunned", {
                duration: this.stun_duration * (1 - this.parent.GetStatusResistance())
            });
            this.Destroy();
        }
        this.starting_position = new_position;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.parent.StopSound("Imba.Hero_KeeperOfTheLight.ManaLeak.Target.FP");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ORDER
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierUnitEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.parent && (keys.order_type == 1 || keys.order_type == 2 || keys.order_type == 3)) {
            let spotlight_modifier = this.caster.findBuff<modifier_imba_keeper_of_the_light_spotlights>("modifier_imba_keeper_of_the_light_spotlights");
            if (spotlight_modifier) {
                spotlight_modifier.Spotlight(this.parent.GetAbsOrigin(), spotlight_modifier.GetSpecialValueFor("passive_radius"), spotlight_modifier.GetSpecialValueFor("damaged_duration"));
            }
        }
    }
}
@registerAbility()
export class imba_keeper_of_the_light_recall extends BaseAbility_Plus {
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
        this.GetCasterPlus().EmitSound("Hero_KeeperOfTheLight.Recall.Cast");
        if (!this.GetCursorTarget() || this.GetCursorTarget() == this.GetCasterPlus()) {
            let allies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
            for (const [_, ally] of GameFunc.iPair(allies)) {
                if (ally != this.GetCasterPlus()) {
                    this.GetCasterPlus().SetCursorCastTarget(ally);
                    return;
                }
            }
        }
        if (this.GetCursorTarget() && this.GetCursorTarget() != this.GetCasterPlus()) {
            this.GetCursorTarget().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_keeper_of_the_light_recall", {
                duration: this.GetSpecialValueFor("teleport_delay")
            });
        }
    }
}
@registerModifier()
export class modifier_imba_keeper_of_the_light_recall extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_recall.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("Hero_KeeperOfTheLight.Recall.Target");
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_KeeperOfTheLight.Recall.Target");
        if (this.GetRemainingTime() <= 0) {
            let caster_position = this.GetCasterPlus().GetAbsOrigin();
            if (this.GetAbilityPlus() && this.GetCasterPlus() && this.GetCasterPlus().IsAlive()) {
                let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_recall_poof.vpcf", ParticleAttachment_t.PATTACH_POINT, this.GetParentPlus());
                ParticleManager.ReleaseParticleIndex(particle);
                FindClearSpaceForUnit(this.GetParentPlus(), this.GetCasterPlus().GetAbsOrigin(), false);
                EmitSoundOnLocationWithCaster(this.GetParentPlus().GetAbsOrigin(), "Hero_KeeperOfTheLight.Recall.End", this.GetCasterPlus());
                let parent = this.GetParentPlus();
                this.AddTimer(FrameTime(), () => {
                    if (parent) {
                        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_recall_poof.vpcf", ParticleAttachment_t.PATTACH_POINT, parent);
                        ParticleManager.ReleaseParticleIndex(particle);
                    }
                });
                this.GetParentPlus().Stop();
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.GetParentPlus() && keys.attacker != this.GetParentPlus() && (keys.attacker.IsRealUnit() || (keys.attacker as IBaseNpc_Plus).IsRoshan()) && keys.original_damage > 0) {
            this.GetParentPlus().EmitSound("Hero_KeeperOfTheLight.Recall.Fail");
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_recall_failure.vpcf", ParticleAttachment_t.PATTACH_POINT, this.GetParentPlus());
            ParticleManager.ReleaseParticleIndex(particle);
            this.Destroy();
        }
    }
}
@registerAbility()
export class imba_keeper_of_the_light_spotlights extends BaseAbility_Plus {
    public spotlights_modifier: any;
    IsInnateAbility() {
        return true;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_keeper_of_the_light_spotlights";
    }
    OnInventoryContentsChanged(): void {
        if (!this.spotlights_modifier) {
            this.spotlights_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_keeper_of_the_light_spotlights", this.GetCasterPlus());
        }
        if (this.spotlights_modifier) {
            if (this.GetCasterPlus().HasScepter()) {
                this.spotlights_modifier.StartIntervalThink(0.1);
            } else {
                this.spotlights_modifier.StartIntervalThink(-1);
            }
        }
    }
    OnHeroCalculateStatBonus(): void {
        this.OnInventoryContentsChanged();
    }
}
@registerModifier()
export class modifier_imba_keeper_of_the_light_spotlights extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public passive_radius: number;
    public attack_duration: number;
    public damaged_duration: number;
    IsHidden(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.passive_radius = this.ability.GetSpecialValueFor("passive_radius");
        this.attack_duration = this.ability.GetSpecialValueFor("attack_duration");
        this.damaged_duration = this.ability.GetSpecialValueFor("damaged_duration");
    }
    OnIntervalThink(): void {
        if (GameRules.IsDaytime()) {
            AddFOWViewer(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), this.GetParentPlus().GetCurrentVisionRange(), 0.1, false);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.parent && !this.parent.PassivesDisabled() && this.ability.IsCooldownReady()) {
            this.Spotlight(keys.target.GetAbsOrigin(), this.passive_radius, this.attack_duration);
            this.ability.UseResources(false, false, true);
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.parent && !this.parent.PassivesDisabled() && this.ability.IsCooldownReady()) {
            this.Spotlight(keys.attacker.GetAbsOrigin(), this.passive_radius, this.damaged_duration);
            this.ability.UseResources(false, false, true);
        }
    }
    Spotlight(position: Vector, radius: number, duration: number) {
        if (!IsServer() || this.parent.PassivesDisabled()) {
            return;
        }
        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_keeper_of_the_light/keeper_dazzling.vpcf", ParticleAttachment_t.PATTACH_POINT, this.parent);
        ParticleManager.SetParticleControl(particle, 0, position);
        ParticleManager.SetParticleControl(particle, 1, Vector(radius, 1, 1));
        AddFOWViewer(this.parent.GetTeam(), position, radius, duration, false);
        this.AddTimer(duration, () => {
            if (this && particle) {
                ParticleManager.DestroyParticle(particle, false);
                ParticleManager.ReleaseParticleIndex(particle);
            }
        });
    }
}
@registerAbility()
export class imba_keeper_of_the_light_will_o_wisp extends BaseAbility_Plus {
    public caster: IBaseNpc_Plus;
    public position: any;
    public on_count: number;
    public radius: number;
    public hit_count: number;
    public off_duration: number;
    public on_duration: number;
    public off_duration_initial: number;
    public fixed_movement_speed: number;
    public bounty: any;
    public duration: number;
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnUpgrade(): void {
        let recall_ability = this.GetCasterPlus().findAbliityPlus<imba_keeper_of_the_light_recall>("imba_keeper_of_the_light_recall");
        if (recall_ability) {
            recall_ability.SetLevel(this.GetLevel());
        }
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.position = this.GetCursorPosition();
        this.on_count = this.GetSpecialValueFor("on_count");
        this.radius = this.GetSpecialValueFor("radius");
        this.hit_count = this.GetSpecialValueFor("hit_count");
        this.off_duration = this.GetSpecialValueFor("off_duration");
        this.on_duration = this.GetSpecialValueFor("on_duration");
        this.off_duration_initial = this.GetSpecialValueFor("off_duration_initial");
        this.fixed_movement_speed = this.GetSpecialValueFor("fixed_movement_speed");
        this.bounty = this.GetSpecialValueFor("bounty");
        this.duration = this.off_duration_initial + (this.on_duration * this.on_count) + (this.off_duration * (this.on_count - 1));
        if (!IsServer()) {
            return;
        }
        let ignis_fatuus = BaseNpc_Plus.CreateUnitByName("npc_imba_ignis_fatuus", this.position, this.caster, true);
        ignis_fatuus.AddNewModifier(this.caster, this, "modifier_imba_keeper_of_the_light_will_o_wisp", {
            duration: this.duration
        });
        ignis_fatuus.SetMaximumGoldBounty(this.bounty);
        ignis_fatuus.SetMinimumGoldBounty(this.bounty);
        if (this.caster.GetUnitName().includes("keeper_of_the_light")) {
            let response = math.random(1, 5);
            if (response >= 4) {
                response = (response + 1);
            }
            this.caster.EmitSound("keeper_of_the_light_keep_spiritform_0" + response);
        }
    }

    GetManaCost(level: number): number {
        return 100;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_most_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_keeper_of_the_light_will_o_wisp extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public on_count: number;
    public radius: number;
    public hit_count: number;
    public off_duration: number;
    public on_duration: number;
    public off_duration_initial: number;
    public fixed_movement_speed: number;
    public bounty: any;
    public ignis_blessing_duration: number;
    public health_increments: any;
    public particle: any;
    public particle2: any;
    public timer: number;
    public pulses: any;
    public is_on: any;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.on_count = this.ability.GetSpecialValueFor("on_count");
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.hit_count = this.ability.GetSpecialValueFor("hit_count");
        this.off_duration = this.ability.GetSpecialValueFor("off_duration");
        this.on_duration = this.ability.GetSpecialValueFor("on_duration");
        this.off_duration_initial = this.ability.GetSpecialValueFor("off_duration_initial");
        this.fixed_movement_speed = this.ability.GetSpecialValueFor("fixed_movement_speed");
        this.bounty = this.ability.GetSpecialValueFor("bounty");
        this.ignis_blessing_duration = this.ability.GetSpecialValueFor("ignis_blessing_duration");
        if (!IsServer()) {
            return;
        }
        this.health_increments = this.parent.GetMaxHealth() / this.hit_count;
        this.parent.EmitSound("Hero_KeeperOfTheLight.Wisp.Cast");
        this.parent.EmitSound("Hero_KeeperOfTheLight.Wisp.Spawn");
        this.parent.EmitSound("Hero_KeeperOfTheLight.Wisp.Aura");
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_keeper_of_the_light/keeper_dazzling.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
        ParticleManager.SetParticleControl(this.particle, 1, Vector(this.radius, 1, 1));
        ParticleManager.SetParticleControl(this.particle, 2, Vector(0, 0, 0));
        this.AddParticle(this.particle, false, false, -1, false, false);
        this.particle2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_keeper_of_the_light/keeper_dazzling_on.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
        ParticleManager.SetParticleControl(this.particle2, 2, Vector(0, 0, 0));
        this.AddParticle(this.particle2, false, false, -1, false, false);
        GridNav.DestroyTreesAroundPoint(this.parent.GetOrigin(), this.radius, true);
        this.timer = 0;
        this.pulses = 0;
        this.is_on = false;
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        this.timer = this.timer + FrameTime();
        if (!this.is_on && (this.pulses == 0 && this.timer >= this.off_duration_initial) || (this.pulses > 0 && this.timer >= this.off_duration)) {
            this.is_on = true;
            this.pulses = this.pulses + 1;
            this.parent.EmitSound("Hero_KeeperOfTheLight.Wisp.Active");
            ParticleManager.SetParticleControl(this.particle, 2, Vector(1, 0, 0));
            ParticleManager.SetParticleControl(this.particle2, 2, Vector(1, 0, 0));
            this.timer = 0;
        } else if (this.is_on) {
            if (this.timer >= this.on_duration) {
                this.is_on = false;
                ParticleManager.SetParticleControl(this.particle, 2, Vector(0, 0, 0));
                ParticleManager.SetParticleControl(this.particle2, 2, Vector(0, 0, 0));
                this.timer = 0;
            } else {
                let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    if (!enemy.HasModifier("modifier_imba_keeper_of_the_light_will_o_wisp_aura")) {
                        enemy.AddNewModifier(this.parent, this.ability, "modifier_imba_keeper_of_the_light_will_o_wisp_aura", {
                            duration: this.on_duration - this.timer
                        });
                    }
                    enemy.FaceTowards(this.parent.GetAbsOrigin());
                }
                // todo <modifier_item_imba_gem_of_true_sight>
                let truesight_modifier = this.parent.findBuff("modifier_item_imba_gem_of_true_sight");
                if (!truesight_modifier) {
                    this.parent.AddNewModifier(this.caster, this.caster.findAbliityPlus("special_bonus_imba_keeper_of_the_light_ignis_truesight"), "modifier_item_imba_gem_of_true_sight", {
                        duration: this.on_duration
                    });
                }
            }
        }
    }
    BeRemoved(): void {
        if (!IsServer()) {
            return;
        }
        this.parent.EmitSound("Hero_KeeperOfTheLight.Wisp.Destroy");
        this.parent.StopSound("Hero_KeeperOfTheLight.Wisp.Aura");
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            let hypnotize_modifier = enemy.FindModifierByNameAndCaster("modifier_imba_keeper_of_the_light_will_o_wisp_aura", this.parent);
            if (hypnotize_modifier) {
                hypnotize_modifier.Destroy();
            }
        }
        this.parent.ForceKill(false);
    }
    CheckState( /** keys */): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_SPECIALLY_DENIABLE]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE,
            5: Enum_MODIFIER_EVENT.ON_ATTACKED
        });
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
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE)
    CC_GetModifierModelScale(): number {
        return -40;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACKED)
    CC_OnAttacked(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.target == this.parent && (keys.attacker.IsRealUnit() || keys.attacker.IsClone() || keys.attacker.IsTempestDouble())) {
            if (this.parent.GetTeam() != keys.attacker.GetTeam()) {
                this.parent.SetHealth(this.parent.GetHealth() - this.health_increments);
                if (this.parent.GetHealth() <= 0) {
                    this.parent.Kill(undefined, keys.attacker);
                    this.Destroy();
                }
            } else {
                keys.attacker.AddNewModifier(this.caster, this.ability, "modifier_imba_keeper_of_the_light_will_o_wisp_blessing", {
                    duration: this.ignis_blessing_duration
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_keeper_of_the_light_will_o_wisp_aura extends BaseModifierMotionHorizontal_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public fixed_movement_speed: number;
    public tunnel_vision_reduction: any;
    IgnoreTenacity() {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_keeper_of_the_light/keeper_dazzling_debuff.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_keeper_dazzle.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.fixed_movement_speed = this.ability.GetSpecialValueFor("fixed_movement_speed");
        this.tunnel_vision_reduction = this.ability.GetSpecialValueFor("tunnel_vision_reduction");
        if (!IsServer()) {
            return;
        }
        if (!this.BeginMotionOrDestroy()) {
            return;
        }
        this.parent.FaceTowards(this.caster.GetAbsOrigin());
        this.parent.Stop();
        this.parent.StartGesture(GameActivity_t.ACT_DOTA_DISABLED);
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) {
            return;
        }
        let distance = (this.caster.GetOrigin() - me.GetOrigin() as Vector).Normalized();
        me.SetOrigin(me.GetOrigin() + distance * this.fixed_movement_speed * dt as Vector);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        // this.parent.RemoveHorizontalMotionController();
        this.parent.FadeGesture(GameActivity_t.ACT_DOTA_DISABLED);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_HEXED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
            [modifierstate.MODIFIER_STATE_MUTED]: true,
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE)
    CC_GetModifierMoveSpeed_Absolute(): number {
        return this.fixed_movement_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE)
    CC_GetBonusVisionPercentage(): number {
        return this.tunnel_vision_reduction * (-1);
    }
}
@registerModifier()
export class modifier_imba_keeper_of_the_light_will_o_wisp_blessing extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public ignis_blessing_int_to_damage: number;
    GetEffectName(): string {
        return "particles/hero/keeper_of_the_light/ignis_blessing.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_keeper_spirit_form.vpcf";
    }
    Init(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.ignis_blessing_int_to_damage = this.ability.GetSpecialValueFor("ignis_blessing_int_to_damage");
        if (!IsServer()) {
            return;
        }
        if (this.caster.GetIntellect) {
            this.SetStackCount(this.caster.GetIntellect() * this.ignis_blessing_int_to_damage * 0.01);
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PURE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PURE)
    CC_GetModifierProcAttack_BonusDamage_Pure(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_special_bonus_imba_keeper_of_the_light_ignis_truesight extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_keeper_of_the_light_travelling_light extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_keeper_of_the_light_flow_inhibition extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_keeper_of_the_light_pure_illuminate extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_keeper_of_the_light_luminous_burster extends BaseModifier_Plus {
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
