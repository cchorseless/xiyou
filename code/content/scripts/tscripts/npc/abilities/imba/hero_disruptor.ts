
import { AI_ability } from "../../../ai/AI_ability";
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseModifierMotionHorizontal, registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

function IncrementStormbearerStacks(caster: IBaseNpc_Plus, stacks: number = 1) {
    let modifier_stormbearer = "modifier_imba_disruptor_stormbearer";
    if (caster.HasModifier(modifier_stormbearer) && !caster.PassivesDisabled()) {
        let modifier_stormbearer_handler = caster.FindModifierByName(modifier_stormbearer);
        if (modifier_stormbearer_handler) {
            for (let i = 0; i < stacks; i++) {
                modifier_stormbearer_handler.IncrementStackCount();
            }
        }
    }
}
@registerAbility()
export class imba_disruptor_stormbearer extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_disruptor_stormbearer";
    }
    IsInnateAbility() {
        return true;
    }
    GetAbilityTextureName(): string {
        return "disruptor_stormbearer";
    }
}
@registerModifier()
export class modifier_imba_disruptor_stormbearer extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public ms_per_stack: number;
    public scepter: any;
    AllowIllusionDuplicate(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.ms_per_stack = this.ability.GetSpecialValueFor("ms_per_stack");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        this.scepter = this.caster.HasScepter();
        if (this.caster.PassivesDisabled()) {
            return undefined;
        }
        let stacks = this.GetStackCount();
        let move_speed_increase;
        move_speed_increase = (this.ms_per_stack) * stacks;
        return move_speed_increase;
    }
}
@registerAbility()
export class imba_disruptor_thunder_strike extends BaseAbility_Plus {
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING;
    }
    GetAbilityTargetType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetAbilityDamageType(): DAMAGE_TYPES {
        return DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
    }
    GetAbilityTargetTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAbilityTargetFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_DEAD;
    }
    GetAbilityTextureName(): string {
        return "disruptor_thunder_strike";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this;
            let target = this.GetCursorTarget();
            let cast_response = "disruptor_dis_thunderstrike_0" + RandomInt(1, 4);
            let sound_cast = "Hero_Disruptor.ThunderStrike.Cast";
            let debuff = "modifier_imba_thunder_strike_debuff";
            let duration = ability.GetSpecialValueFor("duration");
            if (target.GetTeam() != caster.GetTeam()) {
                if (target.TriggerSpellAbsorb(ability)) {
                    return undefined;
                }
            }
            if (RollPercentage(50)) {
                EmitSoundOn(cast_response, caster);
            }
            EmitSoundOn(sound_cast, target);
            duration = duration + caster.GetTalentValue("special_bonus_imba_disruptor_8", "value");
            target.AddNewModifier(caster, ability, debuff, {
                duration: duration
            });
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_thunder_strike_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public target: IBaseNpc_Plus;
    public modifier_slow: any;
    public radius: number;
    public damage: number;
    public fow_linger_duration: number;
    public fow_radius: number;
    public strike_interval: number;
    public add_strikes_interval: number;
    public talent_4_slow_duration: number;
    public slow_duration: number;
    public strikes_remaining: number;
    public strike_particle_fx: ParticleID;
    public aoe_particle_fx: ParticleID;
    DestroyOnExpire(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_disruptor/disruptor_thunder_strike_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.target = this.GetParentPlus();
            this.modifier_slow = "modifier_imba_thunder_strike_talent_slow";
            this.radius = this.ability.GetSpecialValueFor("radius");
            this.damage = this.ability.GetSpecialValueFor("damage");
            this.fow_linger_duration = this.ability.GetSpecialValueFor("fow_linger_duration");
            this.fow_radius = this.ability.GetSpecialValueFor("fow_radius");
            this.strike_interval = this.ability.GetSpecialValueFor("strike_interval");
            this.add_strikes_interval = this.ability.GetSpecialValueFor("add_strikes_interval");
            this.talent_4_slow_duration = this.ability.GetSpecialValueFor("talent_4_slow_duration");
            this.slow_duration = this.GetSpecialValueFor("slow_duration");
            this.strike_interval = this.strike_interval - this.caster.GetTalentValue("special_bonus_imba_disruptor_8", "value2");
            this.ThunderStrikeBoltStart();
            this.StartIntervalThink(this.strike_interval);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_PROVIDES_VISION]: true
        }
        return state;
    }

    ThunderStrikeBoltStart() {
        if (IsServer()) {
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.target.GetAbsOrigin(), undefined, this.radius,
                DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
                DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS,
                FindOrder.FIND_ANY_ORDER, false);
            this.strikes_remaining = (enemies).length;
            if (this.caster.HasTalent("special_bonus_imba_disruptor_7")) {
                let enemies_in_static_storm = 0;
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    if (enemy.HasModifier("modifier_imba_static_storm_debuff")) {
                        enemies_in_static_storm = enemies_in_static_storm + 1;
                    }
                }
                this.strikes_remaining = this.strikes_remaining + enemies_in_static_storm;
            }
            this.AddTimer(this.add_strikes_interval, () => {
                this.ThunderStrikeBoltStrike();
                this.strikes_remaining = this.strikes_remaining - 1;
                if (this.strikes_remaining <= 0) {
                } else {
                    return this.add_strikes_interval;
                }
            });
        }
    }
    LaunchLightning(caster: IBaseNpc_Plus, target: IBaseNpc_Plus, ability: IBaseAbility_Plus, damage: number, bounce_radius: number, max_targets: number) {
        let targets_hit = [target]
        let search_sources = [target]
        caster.EmitSound("Item.Maelstrom.Chain_Lightning");
        target.EmitSound("Item.Maelstrom.Chain_Lightning.Jump");
        this.ZapThem(caster, ability, target, target, damage);
        while (GameFunc.GetCount(search_sources) > 0) {
            for (const [potential_source_index, potential_source] of GameFunc.iPair(search_sources)) {
                let nearby_enemies = FindUnitsInRadius(caster.GetTeamNumber(), potential_source.GetAbsOrigin(), undefined, bounce_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
                let source_removed = false;
                for (const [_, potential_target] of GameFunc.iPair(nearby_enemies)) {
                    let already_hit = false;
                    for (const [_, hit_target] of GameFunc.iPair(targets_hit)) {
                        if (potential_target == hit_target) {
                            already_hit = true;
                            return;
                        }
                    }
                    if (!already_hit) {
                        this.ZapThem(caster, ability, potential_source, potential_target, damage);
                        targets_hit[GameFunc.GetCount(targets_hit) + 1] = potential_target;
                        search_sources[GameFunc.GetCount(search_sources) + 1] = potential_target;
                        if (GameFunc.GetCount(targets_hit) == max_targets) {
                            return;
                        }
                        search_sources.splice(potential_source_index, 1)
                        source_removed = true;
                        return;
                    }
                }
                if (!source_removed) {
                    search_sources.splice(potential_source_index, 1)
                }
            }
        }
    }
    ZapThem(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, source: IBaseNpc_Plus, target: IBaseNpc_Plus, damage: number) {
        let bounce_pfx = ResHelper.CreateParticleEx("particles/items_fx/chain_lightning.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, source);
        ParticleManager.SetParticleControlEnt(bounce_pfx, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(bounce_pfx, 1, source, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", source.GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(bounce_pfx, 2, Vector(1, 1, 1));
        ParticleManager.ReleaseParticleIndex(bounce_pfx);
        ApplyDamage({
            attacker: caster,
            victim: target,
            ability: ability,
            damage: damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
        });
    }
    ThunderStrikeBoltStrike() {
        let sound_impact = "Hero_Disruptor.ThunderStrike.Target";
        let strike_particle = "particles/units/heroes/hero_disruptor/disruptor_thunder_strike_bolt.vpcf";
        let aoe_particle = "particles/units/heroes/hero_disruptor/disruptor_thunder_strike_aoe.vpcf";
        let stormbearer_buff = "modifier_imba_disruptor_stormbearer";
        let scepter = this.caster.HasScepter();
        EmitSoundOn(sound_impact, this.target);
        if (this.caster.HasTalent("special_bonus_imba_disruptor_3")) {
            if (RollPercentage(this.caster.GetTalentValue("special_bonus_imba_disruptor_3"))) {
                this.LaunchLightning(this.caster, this.target, this.ability, this.damage, this.caster.GetTalentValue("special_bonus_imba_disruptor_3", "bounce_radius"), this.caster.GetTalentValue("special_bonus_imba_disruptor_3", "max_targets"));
            }
        }
        if (this.caster.HasTalent("special_bonus_imba_disruptor_4")) {
            this.target.AddNewModifier(this.caster, this.ability, this.modifier_slow, {
                duration: this.talent_4_slow_duration * (1 - this.target.GetStatusResistance())
            });
        }
        this.strike_particle_fx = ParticleManager.CreateParticle(strike_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, this.target);
        ParticleManager.SetParticleControl(this.strike_particle_fx, 0, this.target.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.strike_particle_fx, 1, this.target.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.strike_particle_fx, 2, this.target.GetAbsOrigin());
        this.aoe_particle_fx = ParticleManager.CreateParticle(aoe_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, this.target);
        ParticleManager.SetParticleControl(this.aoe_particle_fx, 0, this.target.GetAbsOrigin());
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.target.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!enemy.IsMagicImmune() && !enemy.IsInvulnerable()) {
                let damageTable: ApplyDamageOptions = {
                    victim: enemy,
                    attacker: this.caster,
                    damage: this.damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                }
                ApplyDamage(damageTable);
                enemy.AddNewModifier(this.GetCaster(), this.GetAbility(), "modifier_imba_thunder_strike_slow", {
                    duration: this.slow_duration * (1 - enemy.GetStatusResistance())
                });
                if (this.caster.HasModifier(stormbearer_buff) && enemy.IsRealUnit()) {
                    IncrementStormbearerStacks(this.caster);
                }
            }
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            this.ThunderStrikeBoltStart();
        }
    }
}
@registerModifier()
export class modifier_imba_thunder_strike_slow extends BaseModifier_Plus {
    public slow_amount: number;
    IsHidden(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.slow_amount = this.GetSpecialValueFor("slow_amount");
        } else {
            this.slow_amount = 100;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow_amount * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return -999999;
    }
}
@registerModifier()
export class modifier_imba_thunder_strike_talent_slow extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public talent_4_slow_pct: number;
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.talent_4_slow_pct = this.ability.GetSpecialValueFor("talent_4_slow_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.talent_4_slow_pct * (-1);
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
}
@registerAbility()
export class imba_disruptor_glimpse extends BaseAbility_Plus {
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("cast_range") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_disruptor_9");
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_glimpse_movement_check_aura";
    }
    GetAbilityTextureName(): string {
        return "disruptor_glimpse";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this;
            let target = this.GetCursorTarget();
            let cast_sound = "Hero_Disruptor.Glimpse.Target";
            let delay = ability.GetSpecialValueFor("move_delay");
            let cast_response = "disruptor_dis_glimpse_0" + math.random(1, 5);
            if (target.GetTeam() != caster.GetTeam()) {
                if (target.TriggerSpellAbsorb(ability)) {
                    return;
                }
            }
            if (target.IsIllusion() && !GFuncEntity.Custom_bIsStrongIllusion(target)) {
                target.Kill(this, this.GetCasterPlus());
                return;
            }
            if (RollPercentage(75)) {
                EmitSoundOn(cast_response, caster);
            }
            let thinker = BaseModifier_Plus.CreateBuffThinker(caster, ability, "modifier_imba_glimpse_thinker", {}, target.GetAbsOrigin(), caster.GetTeamNumber(), false);
            let thinkerBuff = thinker.findBuff<modifier_imba_glimpse_thinker>("modifier_imba_glimpse_thinker");
            let buff = target.findBuff<modifier_imba_glimpse>("modifier_imba_glimpse");
            if (buff) {
                EmitSoundOn(cast_sound, target);
                thinkerBuff.BeginGlimpse(target, buff.GetOldestPosition());
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_disruptor_9") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_disruptor_9")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_disruptor_9", {});
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_glimpse_thinker extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public modifier_storm: any;
    public move_delay: number;
    public projectile_speed: number;
    public vision_radius: number;
    public vision_duration: number;
    public storm_duration: number;
    public storm_radius: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.modifier_storm = "modifier_imba_glimpse_storm_aura";
            this.move_delay = this.ability.GetSpecialValueFor("move_delay");
            this.projectile_speed = this.ability.GetSpecialValueFor("projectile_speed");
            this.vision_radius = this.ability.GetSpecialValueFor("vision_radius");
            this.vision_duration = this.ability.GetSpecialValueFor("vision_duration");
            this.storm_duration = this.ability.GetSpecialValueFor("storm_duration");
        }
    }
    BeginGlimpse(target: IBaseNpc_Plus, old_position: Vector) {
        if (IsServer()) {
            let hUnit = target;
            let vOldLocation = old_position;
            if (hUnit && vOldLocation) {
                let vVelocity = (vOldLocation - hUnit.GetOrigin()) as Vector;
                vVelocity.z = 0.0;
                let flDist = vVelocity.Length2D();
                vVelocity = vVelocity.Normalized();
                let flDuration = math.max(0.05, math.min(this.move_delay, flDist / this.projectile_speed));
                let projectile: CreateLinearProjectileOptions = {
                    Ability: this.GetAbilityPlus(),
                    EffectName: "particles/units/heroes/hero_disruptor/disruptor_glimpse_travel.vpcf",
                    vSpawnOrigin: hUnit.GetOrigin(),
                    fDistance: flDist,
                    Source: this.GetCasterPlus(),
                    vVelocity: vVelocity * (flDist / flDuration) as Vector,
                    fStartRadius: 0,
                    fEndRadius: 0,
                    bProvidesVision: true,
                    iVisionRadius: this.vision_radius,
                    iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber()
                }
                ProjectileManager.CreateLinearProjectile(projectile);
                let nFXIndex = ResHelper.CreateParticleEx("particles/units/heroes/hero_disruptor/disruptor_glimpse_travel.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
                ParticleManager.SetParticleControlEnt(nFXIndex, 0, hUnit, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, hUnit.GetOrigin(), true);
                ParticleManager.SetParticleControl(nFXIndex, 1, vOldLocation);
                ParticleManager.SetParticleControl(nFXIndex, 2, Vector(flDuration, flDuration, flDuration));
                this.AddParticle(nFXIndex, false, false, -1, false, false);
                let nFXIndex2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_disruptor/disruptor_glimpse_targetend.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
                ParticleManager.SetParticleControlEnt(nFXIndex2, 0, hUnit, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, hUnit.GetOrigin(), true);
                ParticleManager.SetParticleControl(nFXIndex2, 1, vOldLocation);
                ParticleManager.SetParticleControl(nFXIndex2, 2, Vector(flDuration, flDuration, flDuration));
                this.AddParticle(nFXIndex2, false, false, -1, false, false);
                let nFXIndex3 = ResHelper.CreateParticleEx("particles/units/heroes/hero_disruptor/disruptor_glimpse_targetstart.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
                ParticleManager.SetParticleControlEnt(nFXIndex3, 0, hUnit, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, hUnit.GetOrigin(), true);
                ParticleManager.SetParticleControl(nFXIndex3, 2, Vector(flDuration, flDuration, flDuration));
                this.AddParticle(nFXIndex3, false, false, -1, false, false);
                EmitSoundOnLocationForAllies(vOldLocation, "Hero_Disruptor.GlimpseNB2017.Destination", this.GetCasterPlus());
                let buff = hUnit.findBuff<modifier_imba_glimpse>("modifier_imba_glimpse");
                if (buff) {
                    buff.hThinker = this;
                    buff.SetGlimpsePosition(old_position);
                    buff.SetExpireTime(GameRules.GetGameTime() + flDuration);
                }
            }
        }
    }
    EndGlimpse(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, hUnit: IBaseNpc_Plus, old_position: Vector) {
        if (hUnit && !hUnit.IsMagicImmune()) {
            AddFOWViewer(caster.GetTeamNumber(), old_position, this.vision_radius, this.vision_duration, false);
            FindClearSpaceForUnit(hUnit, old_position, true);
            hUnit.Interrupt();
            if (caster.HasTalent("special_bonus_imba_disruptor_5")) {
                hUnit.AddNewModifier(caster, ability, "modifier_glimpse_talent_indicator", {
                    duration: 0.1
                });
            }
            this.AddTimer(FrameTime(), () => {
                if (hUnit.HasModifier("modifier_imba_kinetic_field_check_inside_field")) {
                } else {
                    this.storm_radius = ability.GetSpecialValueFor("storm_radius");
                    BaseModifier_Plus.CreateBuffThinker(caster, ability, this.modifier_storm, {
                        duration: this.storm_duration,
                        storm_radius: this.storm_radius
                    }, old_position, caster.GetTeamNumber(), false);
                }
            });
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_glimpse_talent_indicator extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_glimpse_movement_check_aura extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPassive(): boolean {
        return true;
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return true;
    }
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("global_radius");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_imba_glimpse";
    }
}
@registerModifier()
export class modifier_imba_glimpse extends BaseModifier_Plus {
    public backtrack_time: number;
    public interval: number;
    public possible_positions: any;
    public vPositions: Vector[];
    public flExpireTime: any;
    public hThinker: any;
    public glimpse_position: Vector;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.backtrack_time = this.GetSpecialValueFor("backtrack_time");
            this.interval = 0.1;
            this.possible_positions = this.backtrack_time / 0.1;
            this.vPositions = [];
            for (let i = 0; i < this.possible_positions; i++) {
                this.vPositions.push(this.GetParentPlus().GetOrigin());
            }
            this.flExpireTime = -1;
            this.StartIntervalThink(this.interval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.flExpireTime != -1 && GameRules.GetGameTime() > this.flExpireTime) {
                if (this.hThinker) {
                    this.hThinker.EndGlimpse(this.GetCasterPlus(), this.GetAbilityPlus(), this.GetParentPlus(), this.glimpse_position);
                }
                this.flExpireTime = -1;
                this.hThinker = undefined;
            }
            for (let i = 0; i < GameFunc.GetCount(this.vPositions); i++) {
                this.vPositions[i] = this.vPositions[i + 1];
            }
            this.vPositions[GameFunc.GetCount(this.vPositions)] = this.GetParentPlus().GetOrigin();
        }
    }
    GetOldestPosition() {
        return this.vPositions[0];
    }
    SetExpireTime(flTime: number) {
        if (IsServer()) {
            this.flExpireTime = flTime;
        }
    }
    SetGlimpsePosition(old_position: Vector) {
        this.glimpse_position = old_position;
    }
}
@registerModifier()
export class modifier_imba_glimpse_storm_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public parent_pos: any;
    public storm_particle: any;
    public sound_storm: any;
    public sound_storm_end: any;
    public storm_linger: any;
    public storm_radius: number;
    public original_radius: number;
    public storm_duration: number;
    public scale_factor: any;
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.parent_pos = this.parent.GetAbsOrigin();
            this.storm_particle = "particles/hero/disruptor/disruptor_static_storm.vpcf";
            this.sound_storm = "Hero_Disruptor.StaticStorm";
            this.sound_storm_end = "Hero_Disruptor.StaticStorm.End";
            this.storm_linger = this.ability.GetSpecialValueFor("storm_linger");
            this.storm_radius = keys.storm_radius;
            this.original_radius = this.ability.GetSpecialValueFor("storm_radius");
            this.storm_duration = this.ability.GetSpecialValueFor("storm_duration");
            if (this.storm_radius > this.original_radius) {
                this.scale_factor = 1 + this.storm_radius / this.original_radius;
            }
            let storm_particle = ResHelper.CreateParticleEx(this.storm_particle, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
            ParticleManager.SetParticleControl(storm_particle, 0, this.parent_pos);
            ParticleManager.SetParticleControl(storm_particle, 1, Vector(10, 10, 10));
            ParticleManager.SetParticleControl(storm_particle, 2, Vector(this.storm_duration, 1, 1));
            this.AddParticle(storm_particle, false, false, -1, false, false);
            if (this.storm_radius > this.original_radius) {
                let storm_particle_second = ResHelper.CreateParticleEx(this.storm_particle, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
                ParticleManager.SetParticleControl(storm_particle_second, 0, this.parent_pos);
                ParticleManager.SetParticleControl(storm_particle_second, 1, Vector(10 * this.scale_factor, 10 * this.scale_factor, 10 * this.scale_factor));
                ParticleManager.SetParticleControl(storm_particle_second, 2, Vector(this.storm_duration, 1, 1));
                this.AddParticle(storm_particle_second, false, false, -1, false, false);
            }
            EmitSoundOn(this.sound_storm, this.parent);
        }
    }
    GetAuraRadius(): number {
        return this.storm_radius - 50;
    }
    GetAuraDuration(): number {
        return this.storm_linger + this.caster.GetTalentValue("special_bonus_imba_disruptor_2");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_glimpse_storm_debuff";
    }
    BeRemoved(): void {
        if (IsServer()) {
            StopSoundOn(this.sound_storm, this.parent);
            EmitSoundOnLocationWithCaster(this.parent_pos, this.sound_storm_end, this.parent);
        }
    }
    IsAura(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    AllowIllusionDuplicate(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_glimpse_storm_debuff extends BaseModifier_Plus {
    public target: IBaseNpc_Plus;
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public storm_damage: number;
    public storm_interval: number;
    public stormbearer_buff: any;
    BeCreated(p_0: any,): void {
        this.target = this.GetParentPlus();
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.storm_damage = this.ability.GetSpecialValueFor("storm_damage");
        this.storm_interval = this.ability.GetSpecialValueFor("storm_interval");
        this.stormbearer_buff = "modifier_imba_disruptor_stormbearer";
        this.StartIntervalThink(this.storm_interval);
    }
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeDestroy(): void {
        this.StartIntervalThink(-1);
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_silenced.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (!this.target.IsMagicImmune() || !this.target.IsInvulnerable()) {
                let damageTable = {
                    victim: this.target,
                    attacker: this.caster,
                    damage: this.storm_damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: this.ability
                }
                ApplyDamage(damageTable);
                if (this.caster.HasModifier(this.stormbearer_buff) && this.target.IsRealUnit()) {
                    IncrementStormbearerStacks(this.caster);
                }
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        }
        return state;
    }
}
@registerAbility()
export class imba_disruptor_kinetic_field extends BaseAbility_Plus {
    GetAOERadius(): number {
        let radius = this.GetSpecialValueFor("field_radius");
        return radius;
    }
    GetAbilityTextureName(): string {
        return "disruptor_kinetic_field";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target_point = this.GetCursorPosition();
            let ability = this;
            let cast_response = "disruptor_dis_kineticfield_0" + math.random(1, 5);
            let kinetic_field_sound = "Hero_Disruptor.KineticField";
            let formation_particle = "particles/units/heroes/hero_disruptor/disruptor_kineticfield_formation.vpcf";
            let modifier_kinetic_field = "modifier_imba_kinetic_field";
            let formation_delay = ability.GetSpecialValueFor("formation_delay");
            let field_radius = ability.GetSpecialValueFor("field_radius");
            let duration = ability.GetSpecialValueFor("duration");
            let vision_aoe = ability.GetSpecialValueFor("vision_aoe");
            if (caster.HasTalent("special_bonus_imba_disruptor_10")) {
                formation_delay = formation_delay * caster.GetTalentValue("special_bonus_imba_disruptor_10");
            }
            if (RollPercentage(50)) {
                EmitSoundOn(cast_response, caster);
            }
            EmitSoundOn(kinetic_field_sound, caster);
            let formation_particle_fx = ResHelper.CreateParticleEx(formation_particle, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
            ParticleManager.SetParticleControl(formation_particle_fx, 0, target_point);
            ParticleManager.SetParticleControl(formation_particle_fx, 1, Vector(field_radius, 1, 0));
            ParticleManager.SetParticleControl(formation_particle_fx, 2, Vector(formation_delay, 0, 0));
            ParticleManager.SetParticleControl(formation_particle_fx, 4, Vector(1, 1, 1));
            ParticleManager.SetParticleControl(formation_particle_fx, 15, target_point);
            this.AddTimer(formation_delay, () => {
                BaseModifier_Plus.CreateBuffThinker(caster, ability, modifier_kinetic_field, {
                    duration: duration,
                    target_point_x: target_point.x,
                    target_point_y: target_point.y,
                    target_point_z: target_point.z,
                    formation_particle_fx: formation_particle_fx
                }, target_point, caster.GetTeamNumber(), false);
            });
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_disruptor_kinetic_field_true_sight") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_disruptor_kinetic_field_true_sight")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_disruptor_kinetic_field_true_sight"), "modifier_special_bonus_imba_disruptor_kinetic_field_true_sight", {});
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        return AI_ability.POSITION_most_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_kinetic_field extends BaseModifier_Plus {
    public field_radius: number;
    public caster: IBaseNpc_Plus;
    public target: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public target_point: any;
    public duration: number;
    public sound_cast: any;
    public field_particle: any;
    public storm_radius: number;
    public storm_duration: number;
    public modifier_storm: any;
    public distance: number;
    public storm_overlap_radius: number;
    IsHidden(): boolean {
        return true;
    }
    IsPassive(): boolean {
        return true;
    }
    BeCreated(keys: any): void {
        this.field_radius = this.GetSpecialValueFor("field_radius");
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.target = this.GetParentPlus();
            this.ability = this.GetAbilityPlus();
            this.target_point = Vector(keys.target_point_x, keys.target_point_y, keys.target_point_z);
            let vision_aoe = this.ability.GetSpecialValueFor("vision_aoe");
            this.duration = this.ability.GetSpecialValueFor("duration");
            let particle_field = "particles/units/heroes/hero_disruptor/disruptor_kineticfield.vpcf";
            this.sound_cast = "Hero_Disruptor.KineticField";
            EmitSoundOn(this.sound_cast, this.caster);
            AddFOWViewer(this.caster.GetTeamNumber(), this.target.GetAbsOrigin(), vision_aoe, this.duration, false);
            ParticleManager.DestroyParticle(keys.formation_particle_fx, true);
            ParticleManager.ReleaseParticleIndex(keys.formation_particle_fx);
            this.field_particle = ResHelper.CreateParticleEx(particle_field, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
            ParticleManager.SetParticleControl(this.field_particle, 0, this.target_point);
            ParticleManager.SetParticleControl(this.field_particle, 1, Vector(this.field_radius, 1, 1));
            ParticleManager.SetParticleControl(this.field_particle, 2, Vector(this.duration, 0, 0));
            this.StartIntervalThink(FrameTime());
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            let kinetic_field_sound_end = "Hero_Disruptor.KineticField.End";
            ParticleManager.DestroyParticle(this.field_particle, true);
            ParticleManager.ReleaseParticleIndex(this.field_particle);
            StopSoundEvent(this.sound_cast, caster);
        }
    }
    OnIntervalThink(): void {
        let enemies_in_field = FindUnitsInRadius(this.caster.GetTeamNumber(), this.target_point, undefined, this.field_radius + 200, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies_in_field)) {
            enemy.AddNewModifier(this.caster, this.ability, "modifier_imba_kinetic_field_check_position", {
                duration: this.GetRemainingTime(),
                target_point_x: this.target_point.x,
                target_point_y: this.target_point.y,
                target_point_z: this.target_point.z
            });
        }
        if (this.caster.HasTalent("special_bonus_imba_disruptor_5")) {
            let enemies_inside_field = FindUnitsInRadius(this.caster.GetTeamNumber(), this.target_point, undefined, this.field_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy_in_field] of GameFunc.iPair(enemies_inside_field)) {
                enemy_in_field.AddNewModifier(this.caster, this.ability, "modifier_imba_kinetic_field_check_inside_field", {
                    duration: 0.01
                });
                if (enemy_in_field.HasModifier("modifier_glimpse_talent_indicator")) {
                    let glimpse_ability = this.caster.findAbliityPlus<imba_disruptor_glimpse>("imba_disruptor_glimpse");
                    this.storm_radius = glimpse_ability.GetSpecialValueFor("storm_radius");
                    this.storm_duration = glimpse_ability.GetSpecialValueFor("storm_duration");
                    this.modifier_storm = "modifier_imba_glimpse_storm_aura";
                    let enemy_origin = enemy_in_field.GetAbsOrigin();
                    this.distance = (enemy_origin - this.target_point as Vector).Length2D();
                    this.storm_overlap_radius = this.storm_radius - this.field_radius;
                    if (this.distance >= this.storm_overlap_radius) {
                        this.storm_radius = this.field_radius + this.distance;
                    } else {
                        this.storm_radius = this.storm_radius + 1;
                    }
                    BaseModifier_Plus.CreateBuffThinker(this.caster, glimpse_ability, this.modifier_storm, {
                        duration: this.storm_duration,
                        storm_radius: this.storm_radius
                    }, enemy_origin, this.caster.GetTeamNumber(), false);
                    enemy_in_field.RemoveModifierByName("modifier_glimpse_talent_indicator");
                }
            }
        }
    }
    IsAura(): boolean {
        return this.GetCasterPlus().HasTalent("special_bonus_imba_disruptor_kinetic_field_true_sight") != null;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.field_radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER;
    }
    GetModifierAura(): string {
        return "modifier_truesight";
    }
    GetAuraEntityReject(hTarget: CDOTA_BaseNPC): boolean {
        return !hTarget.IsOther() && hTarget.IsMagicImmune();
    }
}
@registerModifier()
export class modifier_imba_kinetic_field_aura_modifier extends BaseModifier_Plus {
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: false
        };
    }
}
@registerModifier()
export class modifier_imba_kinetic_field_check_inside_field extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_kinetic_field_check_position extends BaseModifier_Plus {
    public target_point: any;
    IsHidden(): boolean {
        return true;
    }
    BeCreated(keys: any): void {
        this.target_point = Vector(keys.target_point_x, keys.target_point_y, keys.target_point_z);
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        this.kineticize(this.GetCasterPlus(), this.GetParentPlus(), this.GetAbilityPlus());
    }
    kineticize(caster: IBaseNpc_Plus, target: IBaseNpc_Plus, ability: IBaseAbility_Plus) {
        let radius = ability.GetSpecialValueFor("field_radius");
        let duration = ability.GetSpecialValueFor("duration");
        let center_of_field = this.target_point;
        let modifier_barrier = "modifier_imba_kinetic_field_barrier";
        let distance = (target.GetAbsOrigin() - center_of_field as Vector).Length2D();
        let distance_from_border = distance - radius;
        let origin_difference = center_of_field - target.GetAbsOrigin() as Vector;
        let origin_difference_radian = math.atan2(origin_difference.y, origin_difference.x);
        origin_difference_radian = origin_difference_radian * 180;
        let angle_from_center = origin_difference_radian / math.pi;
        angle_from_center = angle_from_center + 180.0;
        if (distance_from_border <= 0 && math.abs(distance_from_border) <= math.max(target.GetHullRadius(), 50)) {
            target.InterruptMotionControllers(true);
            target.AddNewModifier(caster, ability, modifier_barrier, {});
            target.AddNewModifier(caster, ability, "modifier_imba_kinetic_field_pull", {
                duration: 0.5 * (1 - target.GetStatusResistance()),
                target_point_x: this.target_point.x,
                target_point_y: this.target_point.y,
                target_point_z: this.target_point.z
            });
        } else if (distance_from_border > 0 && math.abs(distance_from_border) <= math.max(target.GetHullRadius(), 60)) {
            target.InterruptMotionControllers(true);
            target.AddNewModifier(caster, ability, modifier_barrier, {});
            if (caster.HasTalent("special_bonus_imba_disruptor_1")) {
                target.AddNewModifier(caster, ability, "modifier_imba_kinetic_field_pull", {
                    duration: 0.5 * (1 - target.GetStatusResistance()),
                    target_point_x: this.target_point.x,
                    target_point_y: this.target_point.y,
                    target_point_z: this.target_point.z
                });
            } else {
                target.AddNewModifier(caster, ability, "modifier_imba_kinetic_field_knockback", {
                    duration: 0.5 * (1 - target.GetStatusResistance()),
                    target_point_x: this.target_point.x,
                    target_point_y: this.target_point.y,
                    target_point_z: this.target_point.z
                });
            }
        } else {
            if (target.HasModifier(modifier_barrier)) {
                target.RemoveModifierByName(modifier_barrier);
            }
            this.Destroy();
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let target = this.GetParentPlus();
            if (target.HasModifier("modifier_imba_kinetic_field_barrier")) {
                target.RemoveModifierByName("modifier_imba_kinetic_field_barrier");
            }
        }
    }
}
@registerModifier()
export class modifier_imba_kinetic_field_barrier extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let target = this.GetParentPlus();
            let edge_damage_hero = ability.GetSpecialValueFor("edge_damage_hero");
            let edge_damage_creep = ability.GetSpecialValueFor("edge_damage_creep");
            let cooldown_reduction = ability.GetSpecialValueFor("cooldown_reduction");
            let damageTable;
            if (target.IsRealUnit()) {
                damageTable = {
                    victim: target,
                    attacker: caster,
                    damage: edge_damage_hero,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: ability
                }
                IncrementStormbearerStacks(caster, ability.GetSpecialValueFor("stormbearer_stack_amount"));
            } else {
                damageTable = {
                    victim: target,
                    attacker: caster,
                    damage: edge_damage_creep,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: ability
                }
            }
            if (!target.HasModifier("modifier_imba_kinetic_field_knockback") || !target.HasModifier("modifier_imba_kinetic_field_pull")) {
                ApplyDamage(damageTable);
            }
            let kinetic_recharge = true;
            if (!kinetic_recharge && target.IsRealUnit()) {
                let cd_remaining = ability.GetCooldownTimeRemaining();
                ability.EndCooldown();
                if (cd_remaining > cooldown_reduction) {
                    ability.StartCooldown(cd_remaining - cooldown_reduction);
                }
                this.AddTimer(0.2, () => {
                    kinetic_recharge = false;
                });
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE)
    CC_GetModifierMoveSpeed_Absolute(): number {
        return 0.1;
    }
}
@registerModifier()
export class modifier_imba_kinetic_field_knockback extends BaseModifierMotionHorizontal {
    public target_point: any;
    public parent: IBaseNpc_Plus;
    IsHidden(): boolean {
        return true;
    }

    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_HIGH
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.target_point = Vector(keys.target_point_x, keys.target_point_y, keys.target_point_z);
            this.parent = this.GetParentPlus();
            this.BeginMotionOrDestroy();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_electrical.vpcf";
    }
    GetEffectName(): string {
        return "particles/econ/items/disruptor/disruptor_resistive_pinfold/disruptor_kf_wall_rise_electricfleks.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: IsServer()
        }
        return state;
    }


    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let knock_distance = 25;
            let direction = (this.parent.GetAbsOrigin() - this.target_point as Vector).Normalized();
            let set_point = this.parent.GetAbsOrigin() + direction * knock_distance as Vector;
            this.parent.SetAbsOrigin(Vector(set_point.x, set_point.y, GetGroundPosition(set_point, this.parent).z));
            this.parent.SetUnitOnClearGround();
            GridNav.DestroyTreesAroundPoint(this.parent.GetAbsOrigin(), knock_distance, false);
        }
    }
}
@registerModifier()
export class modifier_imba_kinetic_field_pull extends BaseModifierMotionHorizontal {
    public target_point: any;
    public parent: IBaseNpc_Plus;
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    IsHidden(): boolean {
        return true;
    }

    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_HIGH
    }

    BeCreated(keys: any): void {
        if (IsServer()) {
            this.target_point = Vector(keys.target_point_x, keys.target_point_y, keys.target_point_z);
            this.parent = this.GetParentPlus();
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.BeginMotionOrDestroy();

        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_electrical.vpcf";
    }
    GetEffectName(): string {
        return "particles/econ/items/disruptor/disruptor_resistive_pinfold/disruptor_kf_wall_rise_electricfleks.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN;
    }

    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let pull_distance = 15;
            let direction = (this.target_point - this.parent.GetAbsOrigin() as Vector).Normalized();
            let set_point = this.parent.GetAbsOrigin() + direction * pull_distance as Vector;
            this.parent.SetAbsOrigin(Vector(set_point.x, set_point.y, GetGroundPosition(set_point, this.parent).z));
            this.parent.SetUnitOnClearGround();
            GridNav.DestroyTreesAroundPoint(this.parent.GetAbsOrigin(), pull_distance, false);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: IsServer()
        }
        return state;
    }
}
@registerAbility()
export class imba_disruptor_static_storm extends BaseAbility_Plus {
    GetAOERadius(): number {
        let radius = this.GetSpecialValueFor("radius");
        return radius;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this;
            let target_point = this.GetCursorPosition();
            let cast_response = "disruptor_dis_staticstorm_0" + RandomInt(1, 5);
            let sound_end = "Hero_Disruptor.StaticStorm.End";
            let scepter = caster.HasScepter();
            let modifier_static_storm = "modifier_imba_static_storm";
            let scepter_duration = ability.GetSpecialValueFor("scepter_duration");
            let duration = ability.GetSpecialValueFor("duration");
            if (scepter) {
                duration = scepter_duration;
            }
            let pikachu_probability = 10;
            if (RollPercentage(pikachu_probability)) {
                EmitSoundOn("Imba.DisruptorPikachu", caster);
            } else if (RollPercentage(65)) {
                EmitSoundOn(cast_response, caster);
            }
            BaseModifier_Plus.CreateBuffThinker(caster, ability, modifier_static_storm, {
                duration: duration,
                target_point_x: target_point.x,
                target_point_y: target_point.y,
                target_point_z: target_point.z
            }, target_point, caster.GetTeamNumber(), false);
        }
    }
    GetManaCost(level: number): number {
        return 100;
    }

    AutoSpellSelf() {
        return AI_ability.POSITION_most_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_static_storm extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public target: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public radius: number;
    public interval: number;
    public sound_cast: any;
    public stormbearer_buff: any;
    public sound_end: any;
    public debuff_aura: any;
    public damage_increase_pulse: number;
    public max_damage: number;
    public scepter_max_damage: number;
    public damage_increase_enemy: number;
    public stormbearer_stack_damage: number;
    public duration: number;
    public scepter_duration: number;
    public target_point: any;
    public particle_storm: any;
    public particle_storm_fx: any;
    public current_damage: number;
    public damage_increase_from_enemies: number;
    public pulse_num: any;
    public max_pulses: any;
    public particle_timer: number;
    public bonus_damage_per_enemy: number;
    IsHidden(): boolean {
        return true;
    }
    IsPassive(): boolean {
        return true;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.target = this.GetParentPlus();
            this.ability = this.GetAbilityPlus();
            this.radius = this.ability.GetSpecialValueFor("radius");
            this.interval = this.ability.GetSpecialValueFor("interval");
            this.sound_cast = "Hero_Disruptor.StaticStorm";
            this.stormbearer_buff = "modifier_imba_disruptor_stormbearer";
            let scepter = this.caster.HasScepter();
            this.sound_end = "Hero_Disruptor.StaticStorm.End";
            this.debuff_aura = "modifier_imba_static_storm_debuff_aura";
            let initial_damage = this.ability.GetSpecialValueFor("initial_damage");
            this.damage_increase_pulse = this.ability.GetSpecialValueFor("damage_increase_pulse");
            this.max_damage = this.ability.GetSpecialValueFor("max_damage");
            this.scepter_max_damage = this.ability.GetSpecialValueFor("scepter_max_damage");
            this.damage_increase_enemy = this.ability.GetSpecialValueFor("damage_increase_enemy");
            this.stormbearer_stack_damage = this.ability.GetSpecialValueFor("stormbearer_stack_damage");
            this.duration = this.ability.GetSpecialValueFor("duration");
            this.scepter_duration = this.ability.GetSpecialValueFor("scepter_duration");
            this.target_point = Vector(keys.target_point_x, keys.target_point_y, keys.target_point_z);
            this.particle_storm = "particles/units/heroes/hero_disruptor/disruptor_static_storm.vpcf";
            EmitSoundOn(this.sound_cast, this.caster);
            this.particle_storm_fx = ResHelper.CreateParticleEx(this.particle_storm, ParticleAttachment_t.PATTACH_WORLDORIGIN, this.caster);
            ParticleManager.SetParticleControl(this.particle_storm_fx, 0, this.target_point);
            ParticleManager.SetParticleControl(this.particle_storm_fx, 1, Vector(this.radius, 0, 0));
            ParticleManager.SetParticleControl(this.particle_storm_fx, 2, Vector(this.duration, 0, 0));
            if (this.caster.HasModifier(this.stormbearer_buff)) {
                let stormbearer_buff_handler = this.caster.FindModifierByName(this.stormbearer_buff);
                let stacks = stormbearer_buff_handler.GetStackCount();
                initial_damage = initial_damage + this.stormbearer_stack_damage * stacks;
                stormbearer_buff_handler.SetStackCount(0);
            }
            this.max_damage = this.max_damage;
            this.scepter_max_damage = this.scepter_max_damage;
            this.damage_increase_pulse = this.damage_increase_pulse;
            if (scepter) {
                this.duration = this.scepter_duration;
                this.max_damage = this.scepter_max_damage;
            }
            this.current_damage = initial_damage;
            this.damage_increase_from_enemies = 0;
            this.pulse_num = 0;
            this.max_pulses = this.duration / this.interval;
            this.particle_timer = 0;
            BaseModifier_Plus.CreateBuffThinker(this.caster, this.ability, this.debuff_aura, {
                duration: this.duration
            }, this.target_point, this.caster.GetTeamNumber(), false);
            this.StartIntervalThink(this.interval);
        }
    }
    OnIntervalThink(): void {
        this.particle_timer = this.particle_timer + this.interval;
        if (this.particle_timer >= 7) {
            this.particle_storm_fx = ResHelper.CreateParticleEx(this.particle_storm, ParticleAttachment_t.PATTACH_WORLDORIGIN, this.caster);
            ParticleManager.SetParticleControl(this.particle_storm_fx, 0, this.target_point);
            ParticleManager.SetParticleControl(this.particle_storm_fx, 1, Vector(this.radius, 0, 0));
            ParticleManager.SetParticleControl(this.particle_storm_fx, 2, Vector(this.duration, 0, 0));
            this.particle_timer = 0;
        }
        let enemies_in_field = FindUnitsInRadius(this.caster.GetTeamNumber(), this.target_point, undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        this.bonus_damage_per_enemy = GameFunc.GetCount(enemies_in_field) * this.damage_increase_enemy;
        for (const [_, enemy] of GameFunc.iPair(enemies_in_field)) {
            if (!enemy.IsMagicImmune() && !enemy.IsInvulnerable()) {
                if (this.caster.HasTalent("special_bonus_imba_disruptor_6")) {
                    if ((!enemy.HasModifier("modifier_imba_static_storm_talent"))) {
                        enemy.AddNewModifier(this.caster, this.ability, "modifier_imba_static_storm_talent", {});
                    }
                }
                let damageTable = {
                    victim: enemy,
                    attacker: this.caster,
                    damage: this.current_damage,
                    ability: this.ability,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                }
                ApplyDamage(damageTable);
                if (this.caster.HasModifier(this.stormbearer_buff) && enemy.IsRealUnit()) {
                    IncrementStormbearerStacks(this.caster);
                }
            }
        }
        this.pulse_num = this.pulse_num + 1;
        this.current_damage = this.current_damage + this.damage_increase_pulse + this.damage_increase_from_enemies + this.bonus_damage_per_enemy;
        this.damage_increase_from_enemies = 0;
        if (this.current_damage > this.max_damage) {
            this.current_damage = this.max_damage;
        }
        if (this.pulse_num < this.max_pulses) {
        } else {
            this.StartIntervalThink(-1);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            ParticleManager.DestroyParticle(this.particle_storm_fx, false);
            StopSoundEvent(this.sound_cast, caster);
            EmitSoundOnLocationWithCaster(this.target_point, this.sound_end, this.caster);
        }
    }
}
@registerModifier()
export class modifier_imba_static_storm_debuff_aura extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public radius: number;
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.radius = this.ability.GetSpecialValueFor("radius");
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_static_storm_debuff";
    }
    IsAura(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_static_storm_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public target: IBaseNpc_Plus;
    public scepter: any;
    public debuff: any;
    public linger_time: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.target = this.GetParentPlus();
        this.scepter = this.caster.HasScepter();
        this.debuff = "modifier_imba_static_storm_debuff_linger";
        if (this.ability) {
            this.linger_time = this.ability.GetSpecialValueFor("linger_time");
        } else {
            this.linger_time = 1;
        }
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_silenced.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state;
        if (this.scepter) {
            state = {
                [modifierstate.MODIFIER_STATE_SILENCED]: true,
                [modifierstate.MODIFIER_STATE_MUTED]: true
            }
        } else {
            state = {
                [modifierstate.MODIFIER_STATE_SILENCED]: true
            }
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_static_storm_debuff_linger extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public scepter: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.scepter = this.caster.HasScepter();
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_silenced.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = undefined;
        if (this.scepter) {
            state = {
                [modifierstate.MODIFIER_STATE_SILENCED]: true,
                [modifierstate.MODIFIER_STATE_MUTED]: true
            }
        } else {
            state = {
                [modifierstate.MODIFIER_STATE_SILENCED]: true
            }
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_static_storm_talent extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public stack_count: number;
    public duration: number;
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
        if (!IsServer()) {
            return;
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.StartIntervalThink(this.caster.GetTalentValue("special_bonus_imba_disruptor_6"));
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        this.stack_count = this.GetStackCount();
        if (this.parent.HasModifier("modifier_imba_static_storm_debuff")) {
            this.IncrementStackCount();
        } else {
            this.Destroy();
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.stack_count == undefined) {
            return undefined;
        }
        if (this.stack_count > 0) {
            this.duration = this.caster.GetTalentValue("special_bonus_imba_disruptor_6", "interval") * this.stack_count;
            let modifier_talent_stun = this.parent.AddNewModifier(this.caster, this.ability, "modifier_imba_static_storm_talent_ministun", {
                duration: this.duration * (1 - this.parent.GetStatusResistance())
            });
            if (modifier_talent_stun) {
                modifier_talent_stun.SetStackCount(this.stack_count);
            }
        } else {
            return undefined;
        }
    }
}
@registerModifier()
export class modifier_imba_static_storm_talent_ministun extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
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
        if (!IsServer()) {
            return;
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.StartIntervalThink(this.caster.GetTalentValue("special_bonus_imba_disruptor_6", "interval"));
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetStackCount() > 1) {
            this.DecrementStackCount();
        } else {
            this.Destroy();
        }
        this.parent.AddNewModifier(this.caster, this.ability, "modifier_imba_static_storm_talent_ministun_trigger", {
            duration: this.caster.GetTalentValue("special_bonus_imba_disruptor_6", "stun_duration") * (1 - this.parent.GetStatusResistance())
        });
    }
}
@registerModifier()
export class modifier_imba_static_storm_talent_ministun_trigger extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_stunned.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_disruptor_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_disruptor_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_disruptor_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_disruptor_10 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_disruptor_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_disruptor_kinetic_field_true_sight extends BaseModifier_Plus {
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
