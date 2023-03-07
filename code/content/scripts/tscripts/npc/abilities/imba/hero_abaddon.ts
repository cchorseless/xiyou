
import { AI_ability } from "../../../ai/AI_ability";
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

function getOverChannelDamageIncrease(caster: IBaseNpc_Plus) {
    if (caster.HasModifier("modifier_over_channel_handler")) {
        let over_channel = caster.FindAbilityByName("imba_abaddon_over_channel");
        if (over_channel) {
            return over_channel.GetSpecialValueFor("extra_dmg") * (1 + caster.GetTalentValue("special_bonus_imba_abaddon_6"));
        }
    }
    return 0;
}
function getOverChannelMistIncrease(caster: IBaseNpc_Plus) {
    if (caster.HasModifier("modifier_over_channel_handler")) {
        let over_channel = caster.FindAbilityByName("imba_abaddon_over_channel");
        if (over_channel) {
            let ability_level = over_channel.GetLevel() - 1;
            return over_channel.GetSpecialValueFor("extra_mist_duration") * (1 + caster.GetTalentValue("special_bonus_imba_abaddon_6"));
        }
    }
    return 0;
}
function getOverChannelShieldIncrease(caster: IBaseNpc_Plus) {
    if (caster.HasModifier("modifier_over_channel_handler")) {
        let over_channel = caster.FindAbilityByName("imba_abaddon_over_channel");
        if (over_channel) {
            let ability_level = over_channel.GetLevel() - 1;
            return over_channel.GetSpecialValueFor("extra_dmg") * (1 + caster.GetTalentValue("special_bonus_imba_abaddon_6"));
        }
    }
    return 0;
}

@registerAbility()
export class imba_abaddon_death_coil extends BaseAbility_Plus {

    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        let range = 200;
        return AI_ability.TARGET_if_enemy(this, range);
    }

    public overchannel_damage_increase: number;
    public overchannel_mist_increase: any;
    public killed: boolean;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_mist_coil_passive";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart() {
        this._OnSpellStart(null, false);
    }
    _OnSpellStart(unit: IBaseNpc_Plus, special_cast: boolean): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = unit || this.GetCursorTarget();
            caster.EmitSound("Hero_Abaddon.DeathCoil.Cast");
            if (!special_cast) {
                let responses = [
                    "abaddon_abad_deathcoil_01",
                    "abaddon_abad_deathcoil_02",
                    "abaddon_abad_deathcoil_06",
                    "abaddon_abad_deathcoil_08"
                ]
                caster.EmitCasterSound(responses, 25, ResHelper.EDOTA_CAST_SOUND.FLAG_NONE, 20, "coil");
                let health_cost = this.GetSpecialValueFor("self_damage");
                if (getOverChannelDamageIncrease) {
                    ApplyDamage({
                        victim: caster,
                        attacker: caster,
                        ability: this,
                        damage: getOverChannelDamageIncrease(caster),
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL
                    });
                }
                ApplyDamage({
                    victim: caster,
                    attacker: caster,
                    ability: this,
                    damage: health_cost,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL
                });
            }
            if (!special_cast) {
                this.overchannel_damage_increase = getOverChannelDamageIncrease(caster);
                this.overchannel_mist_increase = getOverChannelMistIncrease(caster);
            } else {
                this.overchannel_damage_increase = 0;
                this.overchannel_mist_increase = 0;
            }
            let info = {
                Target: target,
                Source: caster,
                Ability: this,
                EffectName: "particles/units/heroes/hero_abaddon/abaddon_death_coil.vpcf",
                bDodgeable: false,
                bProvidesVision: true,
                bVisibleToEnemies: true,
                bReplaceExisting: false,
                iMoveSpeed: this.GetSpecialValueFor("missile_speed"),
                iVisionRadius: 0,
                iVisionTeamNumber: caster.GetTeamNumber(),
                ExtraData: {
                    special_cast: special_cast
                }
            }
            ProjectileManager.CreateTrackingProjectile(info);
        }
    }
    OnProjectileHit_ExtraData(hTarget: CDOTA_BaseNPC | undefined, vLocation: Vector, ExtraData: any): boolean | void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = hTarget;
            let ability_level = this.GetLevel() - 1;
            let special_cast = ExtraData.special_cast || false;
            target.EmitSound("Hero_Abaddon.DeathCoil.Target");
            let mist_duration = this.GetSpecialValueFor("mist_duration");
            if (!special_cast) {
                mist_duration = mist_duration + this.overchannel_mist_increase;
            }
            if (!this.overchannel_damage_increase) {
                return;
            }
            if (target.GetTeam() != caster.GetTeam()) {
                if (target.TriggerSpellAbsorb(this)) {
                    return undefined;
                }
                let damage = this.GetSpecialValueFor("target_damage") + this.overchannel_damage_increase;
                let damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
                let dealt_damage = ApplyDamage({
                    victim: target,
                    attacker: caster,
                    damage: damage,
                    damage_type: damage_type
                });
                if (caster.HasModifier(this.GetIntrinsicModifierName())) {
                    caster.findBuff<modifier_imba_mist_coil_passive>(this.GetIntrinsicModifierName()).applied_damage = dealt_damage;
                }
                let curse_of_avernus = caster.findAbliityPlus<imba_abaddon_frostmourne>("imba_abaddon_frostmourne");
                if (curse_of_avernus) {
                    let debuff_duration = curse_of_avernus.GetSpecialValueFor("slow_duration");
                    if (debuff_duration > 0 && !caster.PassivesDisabled()) {
                        target.AddNewModifier(caster, curse_of_avernus, "modifier_imba_curse_of_avernus_debuff_counter", {
                            duration: debuff_duration * (1 - target.GetStatusResistance())
                        });
                    }
                }
            } else {
                let heal = (this.GetSpecialValueFor("heal_amount") + this.overchannel_damage_increase);
                target.Heal(heal, this);
                target.AddNewModifier(caster, this, "modifier_imba_mist_coil_mist_ally", {
                    duration: mist_duration
                });
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, target, heal, undefined);
                let shield_modifier = target.findBuff<modifier_imba_aphotic_shield_buff_block>("modifier_imba_aphotic_shield_buff_block");
                if (shield_modifier && shield_modifier.ResetAndExtendBy) {
                    shield_modifier.ResetAndExtendBy(this.GetSpecialValueFor("shield_duration_extend"));
                }
            }
            if (!special_cast && caster.HasModifier("modifier_over_channel_handler")) {
                let over_channel_particle = ResHelper.CreateParticleEx("particles/dev/library/base_dust_hit_detail.vpcf", ParticleAttachment_t.PATTACH_POINT, target);
                ParticleManager.ReleaseParticleIndex(over_channel_particle);
                over_channel_particle = ResHelper.CreateParticleEx("particles/dev/library/base_dust_hit_smoke.vpcf", ParticleAttachment_t.PATTACH_POINT, target);
                ParticleManager.ReleaseParticleIndex(over_channel_particle);
            }
            if (!special_cast && caster.GetUnitName().includes("abaddon")) {
                this.AddTimer(0.4, () => {
                    if (this.killed) {
                        let responses = [
                            "abaddon_abad_deathcoil_03",
                            "abaddon_abad_deathcoil_07",
                            "abaddon_abad_deathcoil_04",
                            "abaddon_abad_deathcoil_05",
                            "abaddon_abad_deathcoil_09",
                            "abaddon_abad_deathcoil_10"
                        ];
                        caster.EmitCasterSound(responses, 25, ResHelper.EDOTA_CAST_SOUND.FLAG_BOTH_TEAMS);
                        this.killed = false;
                    }
                });
            }
        }
    }
    OnOwnerDied(): void {
        if (this.GetCasterPlus().IsRealUnit()) {
            let units = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetCastRange(this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus()), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
            for (const unit of (units)) {
                if (unit != this.GetCasterPlus()) {
                    this._OnSpellStart(unit, true);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_mist_coil_passive extends BaseModifier_Plus {
    public record: any;
    public applied_damage: number = 0;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: Enum_MODIFIER_EVENT.ON_DEATH,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuns);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (this.applied_damage) {
            if (keys.attacker == this.GetParentPlus()) {
                if (this.record) {
                    if (this.record == keys.record) {
                        let ability = this.GetAbilityPlus<imba_abaddon_death_coil>();
                        if (ability) {
                            ability.killed = true;
                        }
                    }
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (this.applied_damage) {
            if (keys.attacker == this.GetParentPlus()) {
                if (keys.damage == this.applied_damage) {
                    this.record = keys.record;
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_mist_coil_mist_ally extends BaseModifier_Plus {
    public damage_heal_pct: number;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    Init(keys: any): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.damage_heal_pct = this.GetSpecialValueFor("damage_heal_pct") / 100;
    }

    BeDestroy( /** keys */): void {
        if (!this.GetAbilityPlus()) {
            return;
        }
        if (IsServer() && this.GetParentPlus().IsAlive()) {
            this.GetParentPlus().Heal(this.GetStackCount(), this.GetAbilityPlus());
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, this.GetParentPlus(), this.GetStackCount(), undefined);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus()) {
            this.SetStackCount(this.GetStackCount() + math.floor(keys.damage * this.damage_heal_pct));
        }
    }
}
@registerAbility()
export class imba_abaddon_aphotic_shield extends BaseAbility_Plus {
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        let range = 200;
        return AI_ability.TARGET_if_friend(this, range);
    }


    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            caster.EmitSound("Hero_Abaddon.AphoticShield.Cast");
            let responses = [
                "abaddon_abad_aphoticshield_01",
                "abaddon_abad_aphoticshield_02",
                "abaddon_abad_aphoticshield_03",
                "abaddon_abad_aphoticshield_04",
                "abaddon_abad_aphoticshield_05",
                "abaddon_abad_aphoticshield_06",
                "abaddon_abad_aphoticshield_07"
            ];
            caster.EmitCasterSound(responses, 50, ResHelper.EDOTA_CAST_SOUND.FLAG_NONE, 20, "aphotic_shield");
            let health_cost = getOverChannelDamageIncrease(caster);
            if (health_cost > 0) {
                ApplyDamage({
                    victim: caster,
                    attacker: caster,
                    ability: this,
                    damage: health_cost,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL
                });
            }
            target.Purge(false, true, false, true, true);
            let modifier_name_aphotic_shield = "modifier_imba_aphotic_shield_buff_block";
            target.RemoveModifierByName(modifier_name_aphotic_shield);
            let duration = this.GetSpecialValueFor("duration", 2);
            GLogHelper.print(duration, "duration");
            target.AddNewModifier(caster, this, modifier_name_aphotic_shield, {
                duration: duration
            });
        }
    }
}
@registerModifier()
export class modifier_imba_aphotic_shield_buff_block extends BaseModifier_Plus {
    public shield_init_value: any;
    public shield_remaining: any;
    public target_current_health: any;
    public has_talent: any;
    public damage_absorption_end: number;
    public invulnerability_expired: any;
    IsHidden() {
        return false;
    }
    IsPurgable() {
        return true;
    }
    IsDebuff() {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOTAL_CONSTANT_BLOCK
        });
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetParentPlus();
            let shield_size = target.GetModelRadius() * 0.7;
            let ability = this.GetAbilityPlus();
            let ability_level = ability.GetLevel();
            let target_origin = target.GetAbsOrigin();
            let attach_hitloc = "attach_hitloc";
            this.shield_init_value = ability.GetSpecialValueFor("damage_absorb") + getOverChannelShieldIncrease(caster);
            this.shield_remaining = this.shield_init_value;
            this.target_current_health = target.GetHealth();
            if (caster.HasTalent("special_bonus_imba_abaddon_3")) {
                this.has_talent = true;
                this.damage_absorption_end = GameRules.GetGameTime() + caster.GetTalentValue("special_bonus_imba_abaddon_3");
                this.invulnerability_expired = false;
            }
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_abaddon/abaddon_aphotic_shield.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
            let common_vector = Vector(shield_size, 0, shield_size);
            ParticleManager.SetParticleControl(particle, 1, common_vector);
            ParticleManager.SetParticleControl(particle, 2, common_vector);
            ParticleManager.SetParticleControl(particle, 4, common_vector);
            ParticleManager.SetParticleControl(particle, 5, Vector(shield_size, 0, 0));
            ParticleManager.SetParticleControlEnt(particle, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, attach_hitloc, target_origin, true);
            this.AddParticle(particle, false, false, -1, false, false);
            if (caster.HasModifier("modifier_over_channel_handler")) {
                let over_channel_particle = ResHelper.CreateParticleEx("particles/econ/courier/courier_baekho/courier_baekho_ambient_vapor.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                ParticleManager.SetParticleControlEnt(over_channel_particle, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, attach_hitloc, target_origin, true);
                this.AddParticle(over_channel_particle, false, false, -1, false, false);
                over_channel_particle = ResHelper.CreateParticleEx("particles/econ/courier/courier_baekho/courier_baekho_ambient_swirl.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                ParticleManager.SetParticleControlEnt(over_channel_particle, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, attach_hitloc, target_origin, true);
                this.AddParticle(over_channel_particle, false, false, -1, false, false);
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let target = this.GetParentPlus();
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let ability_level = ability.GetLevel();
            let radius = ability.GetSpecialValueFor("radius");
            let explode_target_team = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH;
            let explode_target_type = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
            let target_vector = target.GetAbsOrigin();
            target.EmitSound("Hero_Abaddon.AphoticShield.Destroy");
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_abaddon/abaddon_aphotic_shield_explosion.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(particle, 0, target_vector);
            ParticleManager.ReleaseParticleIndex(particle);
            let units = FindUnitsInRadius(caster.GetTeamNumber(), target_vector, undefined, radius, explode_target_team, explode_target_type, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            let damage = this.shield_init_value;
            let damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
            let curse_of_avernus = caster.findAbliityPlus<imba_abaddon_frostmourne>("imba_abaddon_frostmourne");
            let debuff_duration;
            if (curse_of_avernus) {
                debuff_duration = curse_of_avernus.GetSpecialValueFor("slow_duration");
            }
            let mist_coil_ability;
            let mist_coil_range;
            if (caster.HasTalent("special_bonus_imba_abaddon_1")) {
                mist_coil_ability = caster.findAbliityPlus<imba_abaddon_death_coil>("imba_abaddon_death_coil");
                if (mist_coil_ability) {
                    mist_coil_range = caster.GetTalentValue("special_bonus_imba_abaddon_1");
                }
            }
            for (const [_, unit] of GameFunc.iPair(units)) {
                if (unit.GetTeam() != caster.GetTeam()) {
                    ApplyDamage({
                        victim: unit,
                        attacker: caster,
                        damage: damage,
                        damage_type: damage_type
                    });
                    if (debuff_duration && debuff_duration > 0) {
                        if (!caster.PassivesDisabled() && curse_of_avernus) {
                            unit.AddNewModifier(caster, curse_of_avernus, "modifier_imba_curse_of_avernus_debuff_counter", {
                                duration: debuff_duration * (1 - unit.GetStatusResistance())
                            });
                        }
                        particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_abaddon/abaddon_aphotic_shield_hit.vpcf", ParticleAttachment_t.PATTACH_POINT, unit);
                        ParticleManager.SetParticleControlEnt(particle, 0, unit, ParticleAttachment_t.PATTACH_POINT, "attach_hitloc", unit.GetAbsOrigin(), true);
                        let hit_size = unit.GetModelRadius() * 0.3;
                        ParticleManager.SetParticleControl(particle, 1, Vector(hit_size, hit_size, hit_size));
                        ParticleManager.ReleaseParticleIndex(particle);
                    }
                }
                if (mist_coil_ability && GFuncVector.CalculateDistance(target, unit) < mist_coil_range) {
                    let info = {
                        Target: unit,
                        Source: target,
                        Ability: mist_coil_ability,
                        EffectName: "particles/units/heroes/hero_abaddon/abaddon_death_coil.vpcf",
                        bDodgeable: false,
                        bProvidesVision: true,
                        bVisibleToEnemies: true,
                        bReplaceExisting: false,
                        iMoveSpeed: mist_coil_ability.GetSpecialValueFor("missile_speed"),
                        iVisionRadius: 0,
                        iVisionTeamNumber: caster.GetTeamNumber(),
                        ExtraData: {
                            special_cast: true
                        }
                    }
                    ProjectileManager.CreateTrackingProjectile(info);
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTAL_CONSTANT_BLOCK)
    CC_GetModifierTotal_ConstantBlock(kv: ModifierAttackEvent): number {
        if (IsServer()) {
            let target = this.GetParentPlus();
            let original_shield_amount = this.shield_remaining;
            let shield_hit_particle = "particles/units/heroes/hero_abaddon/abaddon_aphotic_shield_hit.vpcf";
            if (!target.HasModifier("modifier_imba_borrowed_time_buff_hot_caster") && kv.damage > 0 && bit.band(kv.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) {
                if (this.has_talent && !this.invulnerability_expired) {
                    if (GameRules.GetGameTime() <= this.damage_absorption_end) {
                        this.shield_remaining = this.shield_remaining + kv.damage;
                        original_shield_amount = this.shield_remaining;
                        if (this.shield_remaining > this.shield_init_value) {
                            this.shield_init_value = this.shield_remaining;
                        }
                    } else {
                        this.shield_remaining = this.shield_remaining - kv.damage;
                        this.invulnerability_expired = true;
                    }
                } else {
                    this.shield_remaining = this.shield_remaining - kv.damage;
                }
                if (kv.damage < original_shield_amount) {
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BLOCK, target, kv.damage, undefined);
                    return kv.damage;
                } else {
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BLOCK, target, original_shield_amount, undefined);
                    this.Destroy();
                    return original_shield_amount;
                }
            }
        }
    }
    ResetAndExtendBy(seconds: number) {
        this.shield_remaining = this.shield_init_value;
        this.SetDuration(this.GetRemainingTime() + seconds, true);
    }
}
@registerAbility()
export class imba_abaddon_frostmourne extends BaseAbility_Plus {
    public curse_of_avernus_target: any;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_curse_of_avernus_passive";
    }
    BeCreated(p_0: any,): void {
        this.curse_of_avernus_target = undefined;
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_abaddon_4")) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE;
        }
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE;
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        this.EndCooldown();
    }
    GetCooldown(p_0: number,): number {
        if (this.GetBehavior() != DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE) {
            return this.GetCasterPlus().GetTalentValue("special_bonus_imba_abaddon_4", "active_cooldown");
        }
        return 0;
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetCasterPlus().Script_GetAttackRange();
    }
}
@registerModifier()
export class modifier_imba_curse_of_avernus_passive extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: imba_abaddon_frostmourne;
    public damage: number = 0;
    IsHidden() {
        return true;
    }
    IsPurgable() {
        return false;
    }
    IsDebuff() {
        return false;
    }
    AllowIllusionDuplicate() {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        if (IsServer()) {
            let target = this.GetParentPlus();
            if (target.IsIllusion()) {
                this.Destroy();
            }
        }
    }
    GetAuraRadius(): number {
        return this.caster.GetTalentValue("special_bonus_imba_abaddon_5");
    }
    GetAuraEntityReject(hEntity: CDOTA_BaseNPC): boolean {
        if (hEntity.HasModifier("modifier_imba_curse_of_avernus_buff_haste")) {
            return true;
        }
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_FAIL,
            4: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL,
            5: Enum_MODIFIER_EVENT.ON_ORDER
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(kv: ModifierAttackEvent): void {
        if (IsServer()) {
            if (!this.GetCasterPlus().PassivesDisabled()) {
                let attacker = kv.attacker;
                if (attacker == this.GetCasterPlus()) {
                    let target = kv.target;
                    if (target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() && !target.HasModifier("modifier_imba_curse_of_avernus_debuff_slow")) {
                        if (this.GetCasterPlus().HasModifier("modifier_imba_curse_of_avernus_buff_haste")) {
                            this.GetCasterPlus().RemoveModifierByName("modifier_imba_curse_of_avernus_buff_haste");
                        }
                        if (this.GetAbilityPlus()) {
                            let slow_duration = this.GetSpecialValueFor("slow_duration");
                            target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_curse_of_avernus_debuff_counter", {
                                duration: slow_duration * (1 - target.GetStatusResistance())
                            });
                        }
                    }
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(kv: ModifierUnitEvent): void {
        let order_type = kv.order_type;
        if (order_type != dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET) {
            this.ability.curse_of_avernus_target = undefined;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_FAIL)
    CC_OnAttackFail(kv: ModifierAttackEvent): void {
        if (this.GetParentPlus() == kv.attacker) {
            this.ability.curse_of_avernus_target = undefined;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(kv: ModifierAttackEvent): void {
        if (this.GetParentPlus() == kv.attacker) {
            this.ability.curse_of_avernus_target = undefined;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL)
    CC_GetModifierProcAttack_BonusDamage_Physical(kv: ModifierAttackEvent): number {
        if (kv.attacker == this.GetCasterPlus() && this.ability.curse_of_avernus_target == kv.target) {
            return this.damage;
        }
        return 0;
    }
}
@registerModifier()
export class modifier_imba_curse_of_avernus_debuff_counter extends BaseModifier_Plus {
    public has_talent: any;
    public duration_extend: number;
    public hits: any;
    public base_duration: number;
    public pfx: any;
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    BeCreated(kv: any): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_abaddon_2")) {
            this.has_talent = true;
            this.duration_extend = this.GetCasterPlus().GetTalentValue("special_bonus_imba_abaddon_2", "extend_duration");
            this.hits = 0;
            this.base_duration = kv.duration;
        }
        this.SetStackCount(1);
    }
    BeRefresh(kv: any): void {
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
        if (this.GetStackCount() >= this.GetSpecialValueFor("hit_count")) {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_curse_of_avernus_debuff_slow", {
                duration: this.GetSpecialValueFor("curse_duration")
            });
            this.GetParentPlus().RemoveModifierByName("modifier_imba_curse_of_avernus_debuff_counter");
            let responses = [
                "abaddon_abad_frostmourne_01",
                "abaddon_abad_frostmourne_02",
                "abaddon_abad_frostmourne_03",
                "abaddon_abad_frostmourne_04",
                "abaddon_abad_frostmourne_05",
                "abaddon_abad_frostmourne_06",
                "abaddon_abad_frostmourne_06",
            ];

            this.GetCasterPlus().EmitCasterSound(responses, 50, ResHelper.EDOTA_CAST_SOUND.FLAG_NONE, 30, "curse_of_avernus");
            this.GetCasterPlus().EmitSound("Hero_Abaddon.Curse.Proc");
        }
    }
    OnStackCountChanged(iStackCount: number): void {
        if (!IsServer()) {
            return;
        }
        if (!this.pfx) {
            this.pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_abaddon/abaddon_curse_counter_stack.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
        }
        ParticleManager.SetParticleControl(this.pfx, 1, Vector(0, this.GetStackCount(), 0));
    }
    OnRemoved(): void {
        if (!IsServer()) {
            return;
        }
        if (this.pfx) {
            ParticleManager.DestroyParticle(this.pfx, false);
            ParticleManager.ReleaseParticleIndex(this.pfx);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetSpecialValueFor("movement_speed") * (-1);
    }
}
@registerModifier()
export class modifier_imba_curse_of_avernus_debuff_slow extends BaseModifier_Plus {
    public has_talent: any;
    public duration_extend: number;
    public hits: any;
    public base_duration: number;
    public heal_convert: any;
    IsHidden() {
        return false;
    }
    IsPurgable() {
        return true;
    }
    IsDebuff() {
        return true;
    }
    GetEffectName() {
        return "particles/units/heroes/hero_abaddon/abaddon_curse_frostmourne_debuff.vpcf";
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            3: Enum_MODIFIER_EVENT.ON_ATTACK,
            4: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            5: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(funcs);
    } */
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        };
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            let buff_name = "modifier_imba_curse_of_avernus_buff_haste";
            let current_buff = this.GetCasterPlus().FindModifierByName(buff_name);
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_abaddon_2")) {
                this.has_talent = true;
                this.duration_extend = this.GetCasterPlus().GetTalentValue("special_bonus_imba_abaddon_2", "extend_duration");
                this.hits = 0;
                this.base_duration = kv.duration;
            }
            if (!current_buff) {
                let buff_duration = this.GetSpecialValueFor("slow_duration");
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), buff_name, {
                    duration: buff_duration
                });
            } else {
                current_buff.ForceRefresh();
            }
            this.heal_convert = (this.GetSpecialValueFor("heal_convert") / 100);
        }
    }
    BeRefresh(kv: any): void {
        if (this.has_talent) {
            this.SetDuration(this.base_duration + this.hits * this.duration_extend, true);
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(kv: ModifierAttackEvent): void {
        if (IsServer()) {
            let target = kv.target;
            if (target == this.GetParentPlus()) {
                let caster = this.GetCasterPlus();
                let attacker = kv.attacker;
                if (caster.GetTeamNumber() == attacker.GetTeamNumber()) {
                    let ability = this.GetAbilityPlus();
                    let buff_duration = ability.GetSpecialValueFor("slow_duration");
                    if (this.has_talent) {
                        buff_duration = buff_duration + this.hits * this.duration_extend;
                    }
                    attacker.AddNewModifier(caster, ability, "modifier_imba_curse_of_avernus_buff_haste", {
                        duration: buff_duration
                    });
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(kv: ModifierAttackEvent): void {
        if (this.has_talent && (kv.attacker == this.GetCasterPlus()) && (kv.target == this.GetParentPlus())) {
            this.hits = this.hits + 1;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(kv: ModifierInstanceEvent): void {
        if (IsServer()) {
            let heal_convert = this.heal_convert;
            if (heal_convert > 0) {
                let target = this.GetParentPlus();
                if (target == kv.unit) {
                    let caster = this.GetCasterPlus();
                    let damage = kv.damage;
                    let target_health_left = target.GetHealth();
                    let heal_amount;
                    if (damage > target_health_left) {
                        heal_amount = target_health_left;
                    } else {
                        heal_amount = damage;
                    }
                    heal_amount = heal_amount * heal_convert;
                    let life_steal_particle_name = "particles/generic_gameplay/generic_lifesteal.vpcf";
                    let healFX = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_lifesteal.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, caster);
                    ParticleManager.ReleaseParticleIndex(healFX);
                    caster.Heal(heal_amount, this.GetAbilityPlus());
                    if (caster.HasModifier("modifier_imba_borrowed_time_buff_hot_caster")) {
                        let buffed_allies: IBaseNpc_Plus[] = caster.TempData()._borrowed_time_buffed_allies;
                        if (buffed_allies && caster.HasScepter()) {
                            for (const [_, k] of GameFunc.iPair(buffed_allies)) {
                                healFX = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_lifesteal.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, k);
                                ParticleManager.ReleaseParticleIndex(healFX);
                                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, k, heal_amount, undefined);
                                k.Heal(heal_amount, this.GetAbilityPlus());
                            }
                        }
                    }
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetSpecialValueFor("curse_slow") * (-1);
    }
}
@registerModifier()
export class modifier_imba_curse_of_avernus_buff_haste extends BaseModifier_Plus {
    public attack_increase: any;
    IsHidden() {
        return false;
    }
    IsPurgable() {
        return true;
    }
    IsDebuff() {
        return false;
    }
    GetEffectName() {
        return "particles/units/heroes/hero_abaddon/abaddon_frost_buff.vpcf";
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    _UpdateIncreaseValues() {
        this.attack_increase = this.GetSpecialValueFor("curse_attack_speed");
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_abaddon_2")) {
            this.attack_increase = this.attack_increase + this.GetCasterPlus().GetTalentValue("special_bonus_imba_abaddon_2", "value");
        }
    }
    Init(p_0: any,): void {
        this._UpdateIncreaseValues();
    }

    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_increase;
    }
}
@registerAbility()
export class imba_abaddon_over_channel extends BaseAbility_Plus {
    IsStealable() {
        return false;
    }
    IsInnateAbility() {
        return true;
    }
    OnToggle(): void {
        if (this.GetToggleState() && !this.GetCasterPlus().HasModifier("modifier_over_channel_handler")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_over_channel_handler", {});
        } else if (!this.GetToggleState() && this.GetCasterPlus().HasModifier("modifier_over_channel_handler")) {
            this.GetCasterPlus().RemoveModifierByName("modifier_over_channel_handler");
        }
    }
}
@registerModifier()
export class modifier_over_channel_handler extends BaseModifier_Plus {
    IsHidden() {
        return false;
    }
    IsPurgable() {
        return false;
    }
    IsDebuff() {
        return false;
    }
    RemoveOnDeath() {
        return true;
    }
    AllowIllusionDuplicate() {
        return false;
    }
    BeCreated(p_0: any,): void {
        let target = this.GetParentPlus();
        let target_origin = target.GetAbsOrigin();
        let particle_name = "particles/econ/courier/courier_hyeonmu_ambient/courier_hyeonmu_ambient_trail_steam_blue.vpcf";
        let particle = ResHelper.CreateParticleEx(particle_name, ParticleAttachment_t.PATTACH_ABSORIGIN, target);
        ParticleManager.SetParticleControlEnt(particle, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target_origin, true);
        this.AddParticle(particle, false, false, -1, false, false);
        particle = ResHelper.CreateParticleEx(particle_name, ParticleAttachment_t.PATTACH_ABSORIGIN, target);
        ParticleManager.SetParticleControlEnt(particle, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", target_origin, true);
        this.AddParticle(particle, false, false, -1, false, false);
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_OnAbilityExecuted(keys: ModifierAbilityEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.GetParentPlus() && !keys.ability.IsItem() && keys.ability.GetAbilityName() != "imba_abaddon_over_channel" && keys.ability.GetAbilityName() != "ability_capture") {
            this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_over_channel_reduction", {
                duration: this.GetSpecialValueFor("reduction_duration")
            });
            let parent = this.GetParentPlus();
            this.AddTimer(this.GetSpecialValueFor("reduction_duration"), () => {
                let overchannel_modifier = parent.findBuff<modifier_over_channel_reduction>("modifier_over_channel_reduction");
                if (overchannel_modifier) {
                    overchannel_modifier.DecrementStackCount();
                }
            });
        }
    }
}
@registerModifier()
export class modifier_over_channel_reduction extends BaseModifier_Plus {
    IsHidden() {
        return false;
    }
    IsPurgable() {
        return false;
    }
    IsDebuff() {
        return true;
    }
    RemoveOnDeath() {
        return true;
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return -this.GetStackCount() * this.GetSpecialValueFor("reduction_multiplier");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return -this.GetStackCount() * this.GetSpecialValueFor("reduction_multiplier");
    }
}
@registerAbility()
export class imba_abaddon_borrowed_time extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        if (this.GetCasterPlus().IsRealUnit()) {
            return "modifier_imba_borrowed_time_handler";
        }
    }
    IsNetherWardStealable() {
        return false;
    }
    OnUpgrade(): void {
        let over_channel = this.GetCasterPlus().findAbliityPlus<imba_abaddon_over_channel>("imba_abaddon_over_channel");
        if (over_channel) {
            over_channel.SetLevel(1 + this.GetLevel());
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability_level = this.GetLevel();
            let buff_duration = this.GetSpecialValueFor("duration");
            if (caster.HasScepter()) {
                buff_duration = this.GetSpecialValueFor("duration_scepter");
            }
            caster.AddNewModifier(caster, this, "modifier_imba_borrowed_time_buff_hot_caster", {
                duration: buff_duration
            });
            let responses = {
                "1": "abaddon_abad_borrowedtime_02",
                "2": "abaddon_abad_borrowedtime_03",
                "3": "abaddon_abad_borrowedtime_04",
                "4": "abaddon_abad_borrowedtime_05",
                "5": "abaddon_abad_borrowedtime_06",
                "6": "abaddon_abad_borrowedtime_07",
                "7": "abaddon_abad_borrowedtime_08",
                "8": "abaddon_abad_borrowedtime_09",
                "9": "abaddon_abad_borrowedtime_10",
                "10": "abaddon_abad_borrowedtime_11"
            }
            if (!caster.EmitCasterSound(Object.values(responses), 50, ResHelper.EDOTA_CAST_SOUND.FLAG_BOTH_TEAMS)) {
                caster.EmitCasterSound(["abaddon_abad_borrowedtime_01"], 1, ResHelper.EDOTA_CAST_SOUND.FLAG_BOTH_TEAMS);
            }
            if (caster.HasTalent("special_bonus_imba_abaddon_7")) {
                let target_team = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
                let target_type = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
                let allies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, target_team, target_type, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, unit] of GameFunc.iPair(allies)) {
                    let over_channel_particle = ResHelper.CreateParticleEx("particles/dev/library/base_dust_hit_detail.vpcf", ParticleAttachment_t.PATTACH_POINT, unit);
                    ParticleManager.ReleaseParticleIndex(over_channel_particle);
                    over_channel_particle = ResHelper.CreateParticleEx("particles/dev/library/base_dust_hit_smoke.vpcf", ParticleAttachment_t.PATTACH_POINT, unit);
                    ParticleManager.ReleaseParticleIndex(over_channel_particle);
                    unit.Purge(false, true, false, true, false);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_borrowed_time_handler extends BaseModifier_Plus {
    public hp_threshold: any;
    IsHidden() {
        return true;
    }
    IsPurgable() {
        return false;
    }
    IsDebuff() {
        return false;
    }
    AllowIllusionDuplicate() {
        return false;
    }
    _CheckHealth(damage: number): void {
        let target = this.GetParentPlus();
        let ability = this.GetAbilityPlus();
        if (!ability.IsHidden() && ability.IsCooldownReady() && !target.PassivesDisabled() && target.IsAlive()) {
            let hp_threshold = this.hp_threshold;
            let current_hp = target.GetHealth();
            if (current_hp <= hp_threshold) {
                target.CastAbilityImmediately(ability, target.GetPlayerOwnerID());
            }
        }
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let target = this.GetParentPlus();
            if (target.IsIllusion()) {
                this.Destroy();
            } else {
                this.hp_threshold = this.GetSpecialValueFor("hp_threshold");
                this._CheckHealth(0);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            2: Enum_MODIFIER_EVENT.ON_STATE_CHANGED
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    CC_OnTakeDamage(kv: ModifierInstanceEvent): void {
        if (IsServer()) {
            let target = this.GetParentPlus();
            if (target == kv.unit) {
                this._CheckHealth(kv.damage);
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_STATE_CHANGED)
    CC_OnStateChanged(kv: ModifierUnitEvent): void {
        if (IsServer()) {
            let target = this.GetParentPlus();
            if (target == kv.unit) {
                this._CheckHealth(0);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_borrowed_time_buff_hot_caster extends BaseModifier_Plus {
    public has_talent: any;
    public ratio: any;
    public mist_duration: number;
    public target_current_health: any;
    IsHidden() {
        return false;
    }
    IsPurgable() {
        return false;
    }
    IsDebuff() {
        return false;
    }
    IsAura() {
        return true;
    }
    IsAuraActiveOnDeath() {
        return false;
    }
    GetModifierAura() {
        return "modifier_imba_borrowed_time_buff_hot_ally";
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetEffectName() {
        return "particles/units/heroes/hero_abaddon/abaddon_borrowed_time.vpcf";
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    GetStatusEffectName() {
        return "particles/status_fx/status_effect_abaddon_borrowed_time.vpcf";
    }
    StatusEffectPriority() {
        return 15;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(funcs);
    } */
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("redirect_range");
    }
    GetAuraEntityReject(hEntity: CDOTA_BaseNPC): boolean {
        if (hEntity == this.GetParentPlus() || hEntity.HasModifier("modifier_imba_borrowed_time_buff_hot_caster")) {
            return true;
        }
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let target = this.GetParentPlus();
            if (target.HasTalent("special_bonus_imba_abaddon_8")) {
                this.has_talent = true;
                this.ratio = 1 / target.GetTalentValue("special_bonus_imba_abaddon_8", "ratio_pct") * 100;
                this.mist_duration = target.GetTalentValue("special_bonus_imba_abaddon_8", "mist_duration");
            }
            this.target_current_health = target.GetHealth();
            target.TempData()._borrowed_time_buffed_allies = [];
            if (RollPercentage(15)) {
                target.EmitSound("Imba.AbaddonHeyYou");
            }
            target.EmitSound("Hero_Abaddon.BorrowedTime");
            target.Purge(false, true, false, true, false);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            StopSoundEvent("Imba.AbaddonHeyYou", this.GetParentPlus());
            if (this.has_talent && this.GetStackCount() > 0) {
                let target = this.GetParentPlus();
                if (target.IsAlive()) {
                    target.AddNewModifier(target, this.GetAbilityPlus(), "modifier_imba_borrowed_time_buff_mist", {
                        duration: this.mist_duration
                    });
                    target.findBuff<modifier_imba_borrowed_time_buff_mist>("modifier_imba_borrowed_time_buff_mist").SetStackCount(this.GetStackCount());
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(kv: ModifierInstanceEvent): void {
        if (IsServer()) {
            if (GFuncVector.AsVector(kv.unit.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin()).Length2D() <= this.GetSpecialValueFor("redirect_range_scepter") && this.GetCasterPlus().HasScepter() && kv.unit.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber() && !kv.unit.IsBuilding()) {
                if (!kv.unit.TempData().borrowed_time_damage_taken) {
                    kv.unit.TempData().borrowed_time_damage_taken = 0;
                }
                kv.unit.TempData().borrowed_time_damage_taken = kv.unit.TempData().borrowed_time_damage_taken + kv.damage;
                if (kv.unit.TempData().borrowed_time_damage_taken / this.GetSpecialValueFor("ally_threshold_scepter") >= 1) {
                    for (let i = 0; i < kv.unit.TempData().borrowed_time_damage_taken / this.GetSpecialValueFor("ally_threshold_scepter"); i++) {
                        kv.unit.TempData().borrowed_time_damage_taken = kv.unit.TempData().borrowed_time_damage_taken - this.GetSpecialValueFor("ally_threshold_scepter");
                        this.GetCasterPlus().findAbliityPlus<imba_abaddon_death_coil>("imba_abaddon_death_coil")._OnSpellStart(kv.unit, true);
                    }
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(kv: ModifierAttackEvent): number {
        if (IsServer()) {
            let target = this.GetParentPlus();
            let heal_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_abaddon/abaddon_borrowed_time_heal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
            let target_vector = target.GetAbsOrigin();
            ParticleManager.SetParticleControl(heal_particle, 0, target_vector);
            ParticleManager.SetParticleControl(heal_particle, 1, target_vector);
            ParticleManager.ReleaseParticleIndex(heal_particle);
            if (this.has_talent) {
                let current_health = target.GetHealth();
                let max_health = target.GetMaxHealth();
                this.SetStackCount(this.GetStackCount() + math.floor(kv.damage / this.ratio));
            }
            target.Heal(kv.damage, this.GetAbilityPlus());
            return -9999999;
        }
    }
}
@registerModifier()
export class modifier_imba_borrowed_time_buff_hot_ally extends BaseModifier_Plus {
    IsHidden() {
        return false;
    }
    IsPurgable() {
        return false;
    }
    IsDebuff() {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetParentPlus();
            let buff_list: any[] = caster.TempData()._borrowed_time_buffed_allies;
            if (buff_list) {
                buff_list.push(target);
            }
            let target_origin = target.GetAbsOrigin();
            let particle_name = "particles/econ/courier/courier_hyeonmu_ambient/courier_hyeonmu_ambient_trail_steam.vpcf";
            let particle = ResHelper.CreateParticleEx(particle_name, ParticleAttachment_t.PATTACH_ABSORIGIN, target);
            ParticleManager.SetParticleControlEnt(particle, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target_origin, true);
            this.AddParticle(particle, false, false, -1, false, false);
            particle = ResHelper.CreateParticleEx(particle_name, ParticleAttachment_t.PATTACH_ABSORIGIN, target);
            ParticleManager.SetParticleControlEnt(particle, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", target_origin, true);
            this.AddParticle(particle, false, false, -1, false, false);
        }
    }
    OnRemoved(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let buff_list: IBaseNpc_Plus[] = caster.TempData()._borrowed_time_buffed_allies;
            if (buff_list) {
                let index = buff_list.indexOf(this.GetParentPlus());
                buff_list.splice(index, 1);
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(kv: ModifierAttackEvent): number {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            let ability_level = ability.GetLevel();
            let attacker = kv.attacker;
            let redirect_pct = (ability.GetLevelSpecialValueFor("redirect", ability_level));
            let redirect_damage = kv.damage * (redirect_pct / 100);
            ApplyDamage({
                victim: caster,
                attacker: attacker,
                damage: redirect_damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE
            });
            return -(redirect_pct);
        }
    }
}
@registerModifier()
export class modifier_imba_borrowed_time_buff_mist extends BaseModifier_Plus {
    public duration: number;
    IsHidden() {
        return false;
    }
    IsPurgable() {
        return true;
    }
    IsDebuff() {
        return false;
    }
    GetEffectName() {
        return "particles/units/heroes/hero_abaddon/abaddon_borrowed_time.vpcf";
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    BeCreated(params: any): void {
        this.duration = this.GetDuration();
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT
        }
        return Object.values(decFuns);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.GetStackCount() / this.duration;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_abaddon_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_abaddon_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_abaddon_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_abaddon_4 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            let curse_of_avernus_ability = this.GetParentPlus().findAbliityPlus<imba_abaddon_frostmourne>("imba_abaddon_frostmourne");
            if (curse_of_avernus_ability) {
                // curse_of_avernus_ability.GetBehavior();
                // curse_of_avernus_ability.GetCooldown();
            }
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_abaddon_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_abaddon_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_abaddon_8 extends BaseModifier_Plus {
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
