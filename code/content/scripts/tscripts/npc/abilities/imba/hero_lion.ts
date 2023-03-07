
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class imba_lion_earth_spike extends BaseAbility_Plus {
    tempdata: { [k: string]: IBaseNpc_Plus[] } = {};
    GetAbilityTextureName(): string {
        return "lion_impale";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (IsClient()) {
            return super.GetCastRange(location, target);
        } else {
            return super.GetCastRange(location, target) + this.GetCasterPlus().GetTalentValue("special_bonus_imba_lion_9");
        }
    }
    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorPosition();
        let cast_response = "lion_lion_ability_spike_01";
        let sound_cast = "Hero_Lion.Impale";
        let particle_projectile = "particles/units/heroes/hero_lion/lion_spell_impale.vpcf";
        let spike_speed = ability.GetSpecialValueFor("spike_speed");
        let spikes_radius = ability.GetSpecialValueFor("spikes_radius");
        let max_bounces_per_cast = ability.GetSpecialValueFor("max_bounces_per_cast");
        let travel_distance = ability.GetSpecialValueFor("travel_distance");
        if (RollPercentage(15)) {
            EmitSoundOn(cast_response, caster);
        }
        caster.EmitSound(sound_cast);
        let dota_time = tostring(GameRules.GetDOTATime(true, true));
        let hit_targets_index = "hit_targets_" + dota_time;
        let incoming_targets_index = "incoming_targets_" + dota_time;
        this.tempdata[hit_targets_index] = []
        this.tempdata[incoming_targets_index] = []
        this.AddTimer(20, () => {
            delete this.tempdata[hit_targets_index];
            delete this.tempdata[incoming_targets_index];
        });
        travel_distance = travel_distance + GPropertyCalculate.GetCastRangeBonus(caster) + caster.GetTalentValue("special_bonus_imba_lion_9");
        let direction = (target - caster.GetAbsOrigin() as Vector).Normalized();
        let spikes_projectile: CreateLinearProjectileOptions = {
            Ability: ability,
            EffectName: particle_projectile,
            vSpawnOrigin: caster.GetAbsOrigin(),
            fDistance: travel_distance,
            fStartRadius: spikes_radius,
            fEndRadius: spikes_radius,
            Source: caster,
            bHasFrontalCone: false,
            // bReplaceExisting: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            // bDeleteOnHit: false,
            vVelocity: direction * spike_speed * Vector(1, 1, 0) as Vector,
            bProvidesVision: false,
            ExtraData: {
                hit_targets_index: hit_targets_index,
                incoming_targets_index: incoming_targets_index,
                bounces_left: max_bounces_per_cast
            }
        }
        ProjectileManager.CreateLinearProjectile(spikes_projectile);
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, extra_data: any): boolean | void {
        if (!target) {
            return undefined;
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_impact = "Hero_Lion.ImpaleHitTarget";
        let particle_hit = "particles/units/heroes/hero_lion/lion_spell_impale_hit_spikes.vpcf";
        let sound_cast = "Hero_Lion.Impale";
        let particle_projectile = "particles/units/heroes/hero_lion/lion_spell_impale.vpcf";
        let modifier_stun = "modifier_imba_earthspike_stun";
        let modifier_death_spike = "modifier_imba_earthspike_death_spike";
        let hit_targets_index = extra_data.hit_targets_index;
        let incoming_targets_index = extra_data.incoming_targets_index;
        let bounces_left = extra_data.bounces_left;
        let knock_up_height = ability.GetSpecialValueFor("knock_up_height");
        let knock_up_time = ability.GetSpecialValueFor("knock_up_time");
        let damage = ability.GetSpecialValueFor("damage");
        let stun_duration = ability.GetSpecialValueFor("stun_duration");
        let spike_speed = ability.GetSpecialValueFor("spike_speed");
        let travel_distance = ability.GetSpecialValueFor("travel_distance");
        let spikes_radius = ability.GetSpecialValueFor("spikes_radius");
        let extra_spike_AOE = ability.GetSpecialValueFor("extra_spike_AOE");
        let wait_interval = ability.GetSpecialValueFor("wait_interval");
        for (const hit_target of (this.tempdata[hit_targets_index])) {
            if (hit_target == target) {
                return;
            }
        }
        this.tempdata[hit_targets_index].push(target);
        travel_distance = travel_distance + GPropertyCalculate.GetCastRangeBonus(caster);
        let target_position = target.GetAbsOrigin();
        target_position.z = 0;
        let particle_hit_fx = ResHelper.CreateParticleEx(particle_hit, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
        ParticleManager.SetParticleControl(particle_hit_fx, 0, target_position);
        ParticleManager.SetParticleControl(particle_hit_fx, 1, target_position);
        ParticleManager.SetParticleControl(particle_hit_fx, 2, target_position);
        ParticleManager.ReleaseParticleIndex(particle_hit_fx);
        caster.EmitSound(sound_impact);
        let should_branch = false;
        if (caster.HasTalent("special_bonus_imba_lion_1")) {
            if (bounces_left > 0 && (target.IsRealUnit() || target.IsCreep())) {
                should_branch = true;
            }
        } else {
            if (bounces_left > 0 && target.IsRealUnit()) {
                should_branch = true;
            }
        }
        if (this.GetSpecialValueFor("max_bounces_per_cast") == extra_data.bounces_left && target.TriggerSpellAbsorb(this)) {
            return undefined;
        }
        if (should_branch) {
            this.AddTimer(wait_interval, () => {
                let enemies = FindUnitsInRadius(caster.GetTeam(), target.GetAbsOrigin(), undefined, extra_spike_AOE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS, FindOrder.FIND_CLOSEST, false);
                for (const enemy of (enemies)) {
                    let hit_by_earth_spikes = false;
                    let earth_spikes_incoming = false;
                    for (const hit_target of (this.tempdata[hit_targets_index])) {
                        if (hit_target == enemy) {
                            hit_by_earth_spikes = true;
                        }
                    }
                    for (const incoming_target of (this.tempdata[incoming_targets_index])) {
                        if (incoming_target == enemy) {
                            earth_spikes_incoming = true;
                        }
                    }
                    if (enemy != target && !hit_by_earth_spikes && !earth_spikes_incoming) {
                        this.tempdata[incoming_targets_index].push(enemy);
                        bounces_left = bounces_left - 1;
                        let direction = (enemy.GetAbsOrigin() - target.GetAbsOrigin() as Vector).Normalized();
                        caster.EmitSound(sound_cast);
                        let spikes_projectile: CreateLinearProjectileOptions = {
                            Ability: ability,
                            EffectName: particle_projectile,
                            vSpawnOrigin: target.GetAbsOrigin(),
                            fDistance: travel_distance / 2,
                            fStartRadius: spikes_radius,
                            fEndRadius: spikes_radius,
                            Source: caster,
                            bHasFrontalCone: false,
                            // bReplaceExisting: false,
                            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                            // bDeleteOnHit: false,
                            vVelocity: direction * spike_speed * Vector(1, 1, 0) as Vector,
                            bProvidesVision: false,
                            ExtraData: {
                                hit_targets_index: hit_targets_index,
                                incoming_targets_index: incoming_targets_index,
                                bounces_left: bounces_left
                            }
                        }
                        ProjectileManager.CreateLinearProjectile(spikes_projectile);
                        return;
                    }
                }
            });
        }
        target.AddNewModifier(caster, ability, modifier_stun, {
            duration: stun_duration * (1 - target.GetStatusResistance())
        });
        if (caster.HasTalent("special_bonus_imba_lion_7")) {
            target.AddNewModifier(caster, ability, modifier_death_spike, {
                duration: (knock_up_time + caster.GetTalentValue("special_bonus_imba_lion_7", "duration")) * (1 - target.GetStatusResistance())
            });
        }
        let knockbackProperties = {
            center_x: target.GetAbsOrigin().x,
            center_y: target.GetAbsOrigin().y,
            center_z: target.GetAbsOrigin().z,
            duration: knock_up_time * (1 - target.GetStatusResistance()),
            knockback_duration: knock_up_time * (1 - target.GetStatusResistance()),
            knockback_distance: 0,
            knockback_height: knock_up_height
        }
        target.AddNewModifier(target, undefined, "modifier_knockback", knockbackProperties);
        this.AddTimer(knock_up_time, () => {
            let damageTable = {
                victim: target,
                attacker: caster,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: ability
            }
            ApplyDamage(damageTable);
        });
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_lion_9") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_lion_9")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_lion_9"), "modifier_special_bonus_imba_lion_9", {});
        }
    }
}
@registerModifier()
export class modifier_imba_earthspike_stun extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_stunned.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_earthspike_death_spike extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetCasterPlus().GetTalentValue("special_bonus_imba_lion_7", "slow") * (-1);
    }
}
@registerAbility()
export class imba_lion_hex extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "lion_voodoo";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_lion_10")) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET;
        }
    }
    GetAOERadius(): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_lion_10")) {
            return this.GetCasterPlus().GetTalentValue("special_bonus_imba_lion_10");
        } else {
            return 0;
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        let cast_response = {
            "1": "lion_lion_ability_voodoo_03",
            "2": "lion_lion_ability_voodoo_04",
            "3": "lion_lion_ability_voodoo_05",
            "4": "lion_lion_ability_voodoo_06",
            "5": "lion_lion_ability_voodoo_07",
            "6": "lion_lion_ability_voodoo_08",
            "7": "lion_lion_ability_voodoo_09",
            "8": "lion_lion_ability_voodoo_10"
        }
        let sound_cast = "Hero_Lion.Voodoo";
        let particle_hex = "particles/units/heroes/hero_lion/lion_spell_voodoo.vpcf";
        let modifier_hex = "modifier_imba_lion_hex";
        let duration = ability.GetSpecialValueFor("duration");
        if (RollPercentage(75)) {
            EmitSoundOn(GFuncRandom.RandomOne(Object.values(cast_response)), caster);
        }
        if (!caster.HasTalent("special_bonus_imba_lion_10")) {
            EmitSoundOn(sound_cast, target);
            if (target.GetTeam() != caster.GetTeam()) {
                if (target.TriggerSpellAbsorb(ability)) {
                    return undefined;
                }
            }
            if (!target.IsMagicImmune()) {
                let particle_hex_fx = ResHelper.CreateParticleEx(particle_hex, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, target);
                ParticleManager.SetParticleControl(particle_hex_fx, 0, target.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(particle_hex_fx);
                target.AddNewModifier(caster, ability, modifier_hex, {
                    duration: duration * (1 - target.GetStatusResistance())
                });
            }
        } else {
            let targetPos = this.GetCursorPosition();
            EmitSoundOnLocationWithCaster(targetPos, sound_cast, caster);
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), targetPos, undefined, this.GetCasterPlus().GetTalentValue("special_bonus_imba_lion_10"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let particle_hex_fx = ResHelper.CreateParticleEx(particle_hex, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, enemy);
                ParticleManager.SetParticleControl(particle_hex_fx, 0, enemy.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(particle_hex_fx);
                enemy.AddNewModifier(caster, ability, modifier_hex, {
                    duration: duration * (1 - enemy.GetStatusResistance())
                });
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_lion_10") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_lion_10")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_lion_10"), "modifier_special_bonus_imba_lion_10", {});
        }
    }
}
@registerModifier()
export class modifier_imba_lion_hex extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public sound_cast: any;
    public sound_meme_firetoad: any;
    public particle_hex: any;
    public particle_flaming_frog: any;
    public modifier_hex: any;
    public caster_team: any;
    public firetoad_chance: number;
    public duration: number;
    public move_speed: number;
    public hex_bounce_radius: number;
    public maximum_hex_enemies: any;
    public particle_flaming_frog_fx: any;
    public bounce_interval: number;
    public particle_hex_fx: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.sound_cast = "Hero_Lion.Voodoo";
        this.sound_meme_firetoad = "Imba.LionHexREEE";
        this.particle_hex = "particles/units/heroes/hero_lion/lion_spell_voodoo.vpcf";
        this.particle_flaming_frog = "particles/hero/lion/firetoad.vpcf";
        this.modifier_hex = "modifier_imba_lion_hex";
        this.caster_team = this.caster.GetTeamNumber();
        this.firetoad_chance = 10;
        this.duration = this.ability.GetSpecialValueFor("duration");
        this.move_speed = this.ability.GetSpecialValueFor("move_speed");
        this.hex_bounce_radius = this.ability.GetSpecialValueFor("hex_bounce_radius");
        this.maximum_hex_enemies = this.ability.GetSpecialValueFor("maximum_hex_enemies");
        this.maximum_hex_enemies = this.maximum_hex_enemies + this.caster.GetTalentValue("special_bonus_imba_lion_6");
        if (this.parent.IsIllusion() && !GFuncEntity.Custom_bIsStrongIllusion(this.parent)) {
            this.parent.Kill(this.ability, this.caster);
            return undefined;
        }
        if (IsServer()) {
            if (RollPercentage(this.firetoad_chance)) {
                EmitSoundOn(this.sound_meme_firetoad, this.parent);
                this.parent.SetRenderColor(255, 86, 1);
                this.particle_flaming_frog_fx = ResHelper.CreateParticleEx(this.particle_flaming_frog, ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.parent);
                ParticleManager.SetParticleControlEnt(this.particle_flaming_frog_fx, 0, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
                this.AddParticle(this.particle_flaming_frog_fx, false, false, -1, false, false);
            }
            this.AddTimer(FrameTime(), () => {
                this.bounce_interval = math.min(this.ability.GetSpecialValueFor("bounce_interval"), (this.GetRemainingTime() - FrameTime()));
                this.StartIntervalThink(this.bounce_interval);
            });
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let hexed_enemies = 0;
            let enemies = FindUnitsInRadius(this.caster_team, this.parent.GetAbsOrigin(), undefined, this.hex_bounce_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (this.parent != enemy && !enemy.HasModifier(this.modifier_hex) && !enemy.HasModifier("modifier_imba_lion_hex_chain_cooldown")) {
                    EmitSoundOn(this.sound_cast, enemy);
                    if (enemy.GetTeam() != this.caster_team) {
                        if (enemy.TriggerSpellAbsorb(this.ability)) {
                            return undefined;
                        }
                    }
                    this.particle_hex_fx = ResHelper.CreateParticleEx(this.particle_hex, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, enemy);
                    ParticleManager.SetParticleControl(this.particle_hex_fx, 0, enemy.GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(this.particle_hex_fx);
                    enemy.AddNewModifier(this.caster, this.ability, this.modifier_hex, {
                        duration: this.duration * (1 - enemy.GetStatusResistance())
                    });
                    hexed_enemies = hexed_enemies + 1;
                    if (hexed_enemies >= this.maximum_hex_enemies) {
                        return;
                    }
                }
            }
        }
    }
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
        let state;
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_lion_2")) {
            state = {
                [modifierstate.MODIFIER_STATE_HEXED]: true,
                [modifierstate.MODIFIER_STATE_DISARMED]: true,
                [modifierstate.MODIFIER_STATE_SILENCED]: true,
                [modifierstate.MODIFIER_STATE_MUTED]: true,
                [modifierstate.MODIFIER_STATE_PASSIVES_DISABLED]: true
            }
        } else {
            state = {
                [modifierstate.MODIFIER_STATE_HEXED]: true,
                [modifierstate.MODIFIER_STATE_DISARMED]: true,
                [modifierstate.MODIFIER_STATE_SILENCED]: true,
                [modifierstate.MODIFIER_STATE_MUTED]: true
            }
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    CC_GetModifierModelChange(): string {
        return "models/props_gameplay/frog.vmdl";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE)
    CC_GetModifierMoveSpeed_Absolute(): number {
        return this.move_speed;
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.parent.HasModifier("modifier_imba_fiery_soul_blaze_burn")) {
            } else {
                this.parent.SetRenderColor(255, 255, 255);
            }
            this.parent.AddNewModifier(this.caster, this.ability, "modifier_imba_lion_hex_chain_cooldown", {
                duration: this.ability.GetSpecialValueFor("chain_hex_cooldown")
            });
        }
    }
}
@registerModifier()
export class modifier_imba_lion_hex_chain_cooldown extends BaseModifier_Plus {
    IgnoreTenacity() {
        return true;
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
}
@registerAbility()
export class imba_lion_mana_drain extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "lion_mana_drain";
    }
    OnUnStolen(): void {
        let caster = this.GetCasterPlus();
        if (caster.HasModifier("modifier_imba_manadrain_aura")) {
            caster.RemoveModifierByName("modifier_imba_manadrain_aura");
        }
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_manadrain_aura";
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (target.GetMaxMana() == 0) {
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
            if (target == caster) {
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
            let nResult = UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
            return nResult;
        }
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        let caster = this.GetCasterPlus();
        if (target.GetMaxMana() == 0) {
            return "dota_hud_error_mana_drain_no_mana";
        }
        if (target == caster) {
            return "dota_hud_error_mana_drain_self";
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        let sound_cast = "Hero_Lion.ManaDrain";
        let modifier_drain_enemy = "modifier_imba_manadrain_debuff";
        let modifier_drain_ally = "modifier_imba_manadrain_buff";
        let break_distance = ability.GetSpecialValueFor("break_distance") + GPropertyCalculate.GetCastRangeBonus(caster);
        let interval = ability.GetSpecialValueFor("interval");
        let aura_radius = ability.GetSpecialValueFor("aura_radius") + GPropertyCalculate.GetCastRangeBonus(caster);
        caster.EmitSound(sound_cast);
        if (target.GetTeam() != caster.GetTeam()) {
            if (target.TriggerSpellAbsorb(ability)) {
                this.AddTimer(FrameTime(), () => {
                    caster.InterruptChannel();
                });
                return undefined;
            }
        }
        let modifier_manadrain: string = "";
        let enemy_target = false;
        if (target.GetTeamNumber() != caster.GetTeamNumber()) {
            modifier_manadrain = modifier_drain_enemy;
            enemy_target = true;
        } else {
            modifier_manadrain = modifier_drain_ally;
        }
        if (enemy_target && caster.HasTalent("special_bonus_imba_lion_8")) {
            this.AddTimer(interval, () => {
                if (!caster.IsChanneling()) {
                    caster.StopSound(sound_cast);
                    return undefined;
                }
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, aura_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MANA_ONLY, FindOrder.FIND_ANY_ORDER, false);
                if (GameFunc.GetCount(enemies) > 0) {
                    for (const [_, enemy] of GameFunc.iPair(enemies)) {
                        enemy.AddNewModifier(caster, ability, modifier_manadrain, {
                            duration: interval * 2
                        });
                    }
                    return interval;
                } else {
                    caster.InterruptChannel();
                    return undefined;
                }
            });
        } else {
            target.AddNewModifier(caster, ability, modifier_manadrain, {});
            this.AddTimer(interval, () => {
                if (!caster.IsChanneling()) {
                    caster.StopSound(sound_cast);
                    target.RemoveModifierByName(modifier_manadrain);
                    return;
                }
                let distance = (target.GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Length2D();
                let direction = (target.GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Normalized();
                caster.SetForwardVector(direction);
                if (distance > break_distance || target.IsMagicImmune() || target.IsInvulnerable()) {
                    caster.InterruptChannel();
                    caster.StopSound(sound_cast);
                    target.RemoveModifierByName(modifier_manadrain);
                    return;
                }
                return interval;
            });
        }
    }
}
@registerModifier()
export class modifier_imba_manadrain_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public aura_radius: number;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.aura_radius = this.ability.GetSpecialValueFor("aura_radius");
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
    GetAuraDuration(): number {
        return 0.1;
    }
    GetAuraRadius(): number {
        return this.aura_radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetEffectName(): string {
        return "particles/hero/lion/aura_manadrain.vpcf";
        // return ;
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    GetModifierAura(): string {
        return "modifier_imba_manadrain_aura_debuff";
    }
    IsAura(): boolean {
        if (this.caster && !this.caster.IsNull() && this.caster.PassivesDisabled()) {
            return false;
        }
        return true;
    }
}
@registerModifier()
export class modifier_imba_manadrain_aura_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public interval: number;
    public aura_mana_drain_pct: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.interval = this.ability.GetSpecialValueFor("interval");
            this.aura_mana_drain_pct = this.ability.GetSpecialValueFor("aura_mana_drain_pct");
            this.StartIntervalThink(this.interval);
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    OnIntervalThink(): void {
        if (IsServer() && !this.caster.IsNull()) {
            let mana_drain_per_sec = this.parent.GetMaxMana() * this.aura_mana_drain_pct * 0.01;
            let mana_drain = mana_drain_per_sec * this.interval;
            let target_mana = this.parent.GetMana();
            if (target_mana > mana_drain) {
                this.parent.ReduceMana(mana_drain);
                this.caster.GiveMana(mana_drain);
            } else {
                this.parent.ReduceMana(target_mana);
                this.caster.GiveMana(target_mana);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_manadrain_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_drain: any;
    public interval: number;
    public mana_drain_sec: any;
    public mana_pct_as_damage: number;
    public mana_drain_per_interval: number;
    public mana_drained: any;
    public particle_drain_fx: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_drain = "particles/econ/items/lion/lion_demon_drain/lion_spell_mana_drain_demon.vpcf";
        // if (this.parent.IsIllusion() && !GFuncEntity.Custom_bIsStrongIllusion(this.parent)) {
        //     this.parent.Kill(this.ability, this.caster);
        //     return;
        // }
        this.interval = this.ability.GetSpecialValueFor("interval");
        this.mana_drain_sec = this.ability.GetSpecialValueFor("mana_drain_sec");
        this.mana_pct_as_damage = this.ability.GetSpecialValueFor("mana_pct_as_damage");
        this.mana_drain_per_interval = this.mana_drain_sec * this.interval;
        this.mana_drained = undefined;
        this.particle_drain_fx = ResHelper.CreateParticleEx(this.particle_drain, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, this.parent);
        ParticleManager.SetParticleControlEnt(this.particle_drain_fx, 0, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(this.particle_drain_fx, 1, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mouth", this.caster.GetAbsOrigin(), true);
        this.AddParticle(this.particle_drain_fx, false, false, -1, false, false);
        if (IsServer()) {
            this.StartIntervalThink(this.interval);
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let target_mana = this.parent.GetMana();
            if (target_mana > this.mana_drain_per_interval) {
                this.parent.ReduceMana(this.mana_drain_per_interval);
                this.caster.GiveMana(this.mana_drain_per_interval);
                this.mana_drained = this.mana_drain_per_interval;
            } else {
                this.caster.GiveMana(target_mana);
                this.parent.ReduceMana(target_mana);
                this.mana_drained = target_mana;
            }
            let damage = this.mana_drained * this.mana_pct_as_damage * 0.01;
            let damageTable = {
                victim: this.parent,
                attacker: this.caster,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: this.ability
            }
            ApplyDamage(damageTable);
            let mana_over_drain = math.floor(this.mana_drained - (this.caster.GetMaxMana() - this.caster.GetMana()));
            if (this.caster.HasTalent("special_bonus_imba_lion_3") && mana_over_drain > 0) {
                let mana_overcharge = this.caster.findBuff<modifier_imba_manadrain_manaovercharge>("modifier_imba_manadrain_manaovercharge");
                if (!mana_overcharge) {
                    mana_overcharge = this.caster.AddNewModifier(this.caster, this.ability, "modifier_imba_manadrain_manaovercharge", {
                        duration: this.caster.GetTalentValue("special_bonus_imba_lion_3", "duration")
                    }) as modifier_imba_manadrain_manaovercharge;
                }
                if (mana_overcharge) {
                    let mana_overcharge_stacks = mana_overcharge.GetStackCount();
                    mana_overcharge.SetStackCount(mana_overcharge_stacks + mana_over_drain);
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.caster.HasTalent("special_bonus_imba_lion_4")) {
            let maximum_mana = this.parent.GetMaxMana();
            let current_mana = this.parent.GetMana();
            return (100 - ((current_mana / maximum_mana) * 100)) * (-1);
        }
        return this.GetSpecialValueFor("movespeed") * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetSpecialValueFor("mana_drain_sec");
    }
}
@registerModifier()
export class modifier_imba_manadrain_manaovercharge extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_manadrain_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_drain: any;
    public interval: number;
    public mana_drain_sec: any;
    public mana_drain_per_interval: number;
    public mana_drained: any;
    public particle_drain_fx: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.particle_drain = "particles/econ/items/lion/lion_demon_drain/lion_spell_mana_drain_demon.vpcf";
            this.interval = this.ability.GetSpecialValueFor("interval");
            this.mana_drain_sec = this.ability.GetSpecialValueFor("mana_drain_sec");
            this.mana_drain_per_interval = this.mana_drain_sec * this.interval;
            this.mana_drained = undefined;
            this.particle_drain_fx = ResHelper.CreateParticleEx(this.particle_drain, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, this.parent);
            ParticleManager.SetParticleControlEnt(this.particle_drain_fx, 0, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mouth", this.caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(this.particle_drain_fx, 1, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
            this.AddParticle(this.particle_drain_fx, false, false, -1, false, false);
            this.StartIntervalThink(this.interval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let caster_mana = this.caster.GetMana();
            if (caster_mana > this.mana_drain_per_interval) {
                this.caster.ReduceMana(this.mana_drain_per_interval);
                this.parent.GiveMana(this.mana_drain_per_interval);
            } else {
                this.parent.GiveMana(caster_mana);
                this.caster.ReduceMana(caster_mana);
            }
        }
    }
}
@registerAbility()
export class imba_lion_finger_of_death extends BaseAbility_Plus {
    enemy_killed: boolean;
    GetAbilityTextureName(): string {
        return "lion_finger_of_death";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetAOERadius(): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("enemies_frog_radius");
        }
    }
    GetManaCost(level: number): number {
        let caster = this.GetCasterPlus();
        let ability = this;
        let modifier_finger = "modifier_imba_trigger_finger_debuff";
        let base_mana_cost = super.GetManaCost(level);
        let triggerfinger_mana_inc_pct = ability.GetSpecialValueFor("triggerfinger_mana_inc_pct");
        let stacks = 0;
        if (caster.HasModifier(modifier_finger)) {
            stacks = caster.findBuffStack(modifier_finger, caster);
        }
        let mana_cost = base_mana_cost * (1 + (stacks * triggerfinger_mana_inc_pct * 0.01));
        return mana_cost;
    }
    GetCooldown(level: number): number {
        let caster = this.GetCasterPlus();
        let ability = this;
        let scepter = caster.HasScepter();
        let cooldown = super.GetCooldown(level);
        let scepter_cooldown = ability.GetSpecialValueFor("scepter_cooldown");
        let base_cooldown;
        if (scepter) {
            base_cooldown = scepter_cooldown;
        } else {
            base_cooldown = cooldown;
        }
        return base_cooldown;
    }
    OnUnStolen(): void {
        this.GetCasterPlus().RemoveModifierByName("modifier_imba_finger_of_death_counter");
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        let sound_cast = "Hero_Lion.FingerOfDeath";
        let modifier_finger = "modifier_imba_trigger_finger_debuff";
        let modifier_hex = "modifier_imba_finger_of_death_hex";
        let scepter = caster.HasScepter();
        let damage = this.GetSpecialValueFor("damage");
        let scepter_damage = this.GetSpecialValueFor("scepter_damage");
        let scepter_radius = this.GetSpecialValueFor("scepter_radius");
        let triggerfinger_duration = this.GetSpecialValueFor("triggerfinger_duration");
        let projectile_speed = this.GetSpecialValueFor("projectile_speed");
        let enemies_frog_radius = this.GetSpecialValueFor("enemies_frog_radius");
        this.enemy_killed = false;
        EmitSoundOn(sound_cast, caster);
        if (scepter) {
            damage = scepter_damage;
        }
        let mana_overcharge = caster.findBuff<modifier_imba_manadrain_manaovercharge>("modifier_imba_manadrain_manaovercharge");
        if (mana_overcharge) {
            let mana_overcharge_stacks = mana_overcharge.GetStackCount();
            damage = damage + mana_overcharge_stacks;
            caster.RemoveModifierByName("modifier_imba_manadrain_manaovercharge");
        }
        if (target.GetTeam() != caster.GetTeam()) {
            if (target.TriggerSpellAbsorb(this)) {
                return undefined;
            }
        }
        this.FingerOfDeath(target, target, damage, enemies_frog_radius);
        if (scepter) {
            let finger_scepter_enemies: IBaseNpc_Plus[] = []
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, enemies_frog_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!enemy.IsMagicImmune() && !enemy.HasModifier(modifier_hex)) {
                    finger_scepter_enemies.push(enemy);
                }
            }
            enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, scepter_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let marked = false;
                for (const [_, marked_enemy] of GameFunc.iPair(finger_scepter_enemies)) {
                    if (marked_enemy == enemy) {
                        marked = true;
                        return;
                    }
                }
                if (enemy != target && !enemy.IsMagicImmune()) {
                    if (enemy.IsStunned() || enemy.IsHexed() || marked) {
                        this.FingerOfDeath(target, enemy, damage, enemies_frog_radius);
                    }
                }
            }
        }
        this.AddTimer(0.5, () => {
            if (this.enemy_killed) {
                if (!caster.HasModifier(modifier_finger)) {
                    caster.AddNewModifier(caster, this, modifier_finger, {
                        duration: triggerfinger_duration
                    });
                }
                let modifier_finger_handler = caster.FindModifierByName(modifier_finger);
                if (modifier_finger_handler.GetDuration() > triggerfinger_duration) {
                    modifier_finger_handler.SetDuration(triggerfinger_duration, true);
                }
                modifier_finger_handler.IncrementStackCount();
                modifier_finger_handler.ForceRefresh();
                this.AddTimer(FrameTime(), () => {
                    this.EndCooldown();
                    this.StartCooldown(this.GetSpecialValueFor("triggerfinger_cooldown"));
                });
            } else if (caster.HasTalent("special_bonus_imba_lion_5")) {
                if (!caster.HasModifier(modifier_finger)) {
                    caster.AddNewModifier(caster, this, modifier_finger, {
                        duration: caster.GetTalentValue("special_bonus_imba_lion_5")
                    });
                }
                let modifier_finger_handler = caster.FindModifierByName(modifier_finger);
                modifier_finger_handler.SetDuration(caster.GetTalentValue("special_bonus_imba_lion_5"), true);
                modifier_finger_handler.IncrementStackCount();
                modifier_finger_handler.ForceRefresh();
                this.AddTimer(FrameTime(), () => {
                    this.EndCooldown();
                    this.StartCooldown(this.GetSpecialValueFor("triggerfinger_cooldown"));
                });
            }
        });
    }
    FingerOfDeath(main_target: IBaseNpc_Plus, target: IBaseNpc_Plus, damage: number, enemies_frog_radius: number) {
        let caster = this.GetCasterPlus();
        let sound_impact = "Hero_Lion.FingerOfDeathImpact";
        let particle_finger = "particles/units/heroes/hero_lion/lion_spell_finger_of_death.vpcf";
        let modifier_hex = "modifier_imba_finger_of_death_hex";
        let damage_delay = this.GetSpecialValueFor("damage_delay");
        let enemies_frog_duration = this.GetSpecialValueFor("enemies_frog_duration");
        let damage_per_kill = this.GetSpecialValueFor("damage_per_kill");
        let kill_grace_duration = this.GetSpecialValueFor("kill_grace_duration");
        let particle_finger_fx = ResHelper.CreateParticleEx(particle_finger, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
        ParticleManager.SetParticleControlEnt(particle_finger_fx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", caster.GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(particle_finger_fx, 1, target.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_finger_fx, 2, target.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(particle_finger_fx);
        this.AddTimer(damage_delay, () => {
            if (target.IsMagicImmune()) {
                return undefined;
            }
            target.AddNewModifier(caster, this, "modifier_imba_finger_of_death_delay", {
                duration: kill_grace_duration * (1 - target.GetStatusResistance())
            });
            EmitSoundOn(sound_impact, target);
            if (target.HasModifier("modifier_imba_earthspike_death_spike")) {
                damage = damage * (1 + (caster.GetTalentValue("special_bonus_imba_lion_7", "bonus_damage") * 0.01));
            }
            if (caster.HasModifier("modifier_imba_finger_of_death_counter")) {
                damage = damage + caster.findBuff<modifier_imba_finger_of_death_counter>("modifier_imba_finger_of_death_counter").GetStackCount() * damage_per_kill;
            }
            let damageTable = {
                victim: target,
                attacker: caster,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: this
            }
            ApplyDamage(damageTable);
            this.AddTimer(FrameTime(), () => {
                if (!target.IsAlive() && !target.IsIllusion()) {
                    this.enemy_killed = true;
                }
            });
        });
    }
}
@registerModifier()
export class modifier_imba_trigger_finger_debuff extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_finger_of_death_hex extends BaseModifier_Plus {
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
            [modifierstate.MODIFIER_STATE_HEXED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
            [modifierstate.MODIFIER_STATE_MUTED]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    CC_GetModifierModelChange(): string {
        return "models/props_gameplay/frog.vmdl";
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE)
    CC_GetModifierMoveSpeed_Absolute(): number {
        return this.GetSpecialValueFor("hex_move_speed");
    }
}
@registerModifier()
export class modifier_imba_finger_of_death_delay extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    OnRemoved(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetParentPlus().IsAlive() && (this.GetParentPlus().IsRealUnit() || this.GetParentPlus().IsClone()) && (!this.GetParentPlus().IsReincarnating || (this.GetParentPlus().IsReincarnating && !this.GetParentPlus().IsReincarnating()))) {
            this.GetParentPlus().EmitSound("Hero_Lion.KillCounter");
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_finger_of_death_counter", {});
        }
    }
}
@registerModifier()
export class modifier_imba_finger_of_death_counter extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
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
        this.SetStackCount(1);
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetStackCount() * this.GetSpecialValueFor("damage_per_kill");
    }
}
@registerModifier()
export class modifier_special_bonus_imba_lion_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_lion_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_lion_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_lion_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_lion_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_lion_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_lion_10 extends BaseModifier_Plus {
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
