import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";

export class imba_abaddon_death_coil extends BaseAbility_Plus {
    public overchannel_damage_increase: any;
    public overchannel_mist_increase: any;
    public killed: any;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_mist_coil_passive";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart( /** unit */  /** , special_cast */): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = unit || this.GetCursorTarget();
            caster.EmitSound("Hero_Abaddon.DeathCoil.Cast");
            if (!special_cast) {
                let responses = {
                    1: "abaddon_abad_deathcoil_01",
                    2: "abaddon_abad_deathcoil_02",
                    3: "abaddon_abad_deathcoil_06",
                    4: "abaddon_abad_deathcoil_08"
                }
                caster.EmitCasterSound("npc_dota_hero_abaddon", responses, 25, DOTA_CAST_SOUND_FLAG_NONE, 20, "coil");
                let health_cost = this.GetSpecialValue("self_damage");
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
                iMoveSpeed: this.GetSpecialValue("missile_speed"),
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
                let damage = this.GetSpecialValue("target_damage") + this.overchannel_damage_increase;
                let damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
                let dealt_damage = ApplyDamage({
                    victim: target,
                    attacker: caster,
                    damage: damage,
                    damage_type: damage_type
                });
                if (caster.HasModifier(this.GetIntrinsicModifierName())) {
                    caster.FindModifierByName(this.GetIntrinsicModifierName()).applied_damage = dealt_damage;
                }
                let curse_of_avernus = caster.findAbliityPlus<imba_abaddon_frostmourne>("imba_abaddon_frostmourne");
                if (curse_of_avernus) {
                    let debuff_duration = curse_of_avernus.GetSpecialValue("slow_duration");
                    if (debuff_duration > 0 && !caster.PassivesDisabled()) {
                        target.AddNewModifier(caster, curse_of_avernus, "modifier_imba_curse_of_avernus_debuff_counter", {
                            duration: debuff_duration * (1 - target.GetStatusResistance())
                        });
                    }
                }
            } else {
                let heal = (this.GetSpecialValue("heal_amount") + this.overchannel_damage_increase);
                target.Heal(heal, caster);
                target.AddNewModifier(caster, null, "modifier_imba_mist_coil_mist_ally", {
                    duration: mist_duration
                });
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, target, heal, undefined);
                let shield_modifier = target.findBuff<modifier_imba_aphotic_shield_buff_block>("modifier_imba_aphotic_shield_buff_block");
                if (shield_modifier && shield_modifier.ResetAndExtendBy) {
                    shield_modifier.ResetAndExtendBy(this.GetSpecialValueFor("shield_duration_extend"));
                }
            }
            if (!special_cast && caster.HasModifier("modifier_over_channel_handler")) {
                let over_channel_particle = ParticleManager.CreateParticle("particles/dev/library/base_dust_hit_detail.vpcf", ParticleAttachment_t.PATTACH_POINT, target);
                ParticleManager.ReleaseParticleIndex(over_channel_particle);
                over_channel_particle = ParticleManager.CreateParticle("particles/dev/library/base_dust_hit_smoke.vpcf", ParticleAttachment_t.PATTACH_POINT, target);
                ParticleManager.ReleaseParticleIndex(over_channel_particle);
            }
            if (!special_cast && caster.GetName() == "npc_dota_hero_abaddon") {
                Timers.CreateTimer(0.4, () => {
                    if (this.killed) {
                        let responses = {
                            1: "abaddon_abad_deathcoil_03",
                            2: "abaddon_abad_deathcoil_07",
                            3: "abaddon_abad_deathcoil_04",
                            4: "abaddon_abad_deathcoil_05",
                            5: "abaddon_abad_deathcoil_09",
                            6: "abaddon_abad_deathcoil_10"
                        }
                        caster.EmitCasterSound("npc_dota_hero_abaddon", responses, 25, DOTA_CAST_SOUND_FLAG_BOTH_TEAMS, undefined, undefined);
                        this.killed = undefined;
                    }
                });
            }
        }
    }
    OnOwnerDied(): void {
        if (this.GetCasterPlus().IsRealHero()) {
            let units = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetCastRange(this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus()), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
            for (const [_, unit] of ipairs(units)) {
                if (unit != this.GetCasterPlus()) {
                    this.OnSpellStart(unit, true);
                }
            }
        }
    }
}
export class modifier_imba_mist_coil_passive extends BaseModifier_Plus {
    public record: any;
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
    DeclareFunctions(): modifierfunction[] {
        let decFuns = {
            1: modifierfunction.MODIFIER_EVENT_ON_DEATH,
            2: modifierfunction.MODIFIER_EVENT_ON_TAKEDAMAGE
        }
        return Object.values(decFuns);
    }
    OnDeath(keys: ModifierInstanceEvent): void {
        if (this.applied_damage) {
            if (keys.attacker == this.GetParentPlus()) {
                if (this.record) {
                    if (this.record == keys.record) {
                        let ability = this.GetAbilityPlus();
                        if (ability) {
                            ability.killed = true;
                        }
                    }
                }
            }
        }
    }
    OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (this.applied_damage) {
            if (keys.attacker == this.GetParentPlus()) {
                if (keys.damage == this.applied_damage) {
                    this.record = keys.record;
                }
            }
        }
    }
}
export class modifier_imba_mist_coil_mist_ally extends BaseModifier_Plus {
    public damage_heal_pct: any;
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
    Init(keys: IModifierTable): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.damage_heal_pct = this.GetAbilityPlus().GetSpecialValueFor("damage_heal_pct") / 100;
    }
    BeDestroy( /** keys */): void {
        if (!this.GetAbilityPlus()) {
            return;
        }
        if (IsServer() && this.GetParentPlus().IsAlive()) {
            this.GetParentPlus().Heal(this.GetStackCount(), this.GetCasterPlus());
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, this.GetParentPlus(), this.GetStackCount(), undefined);
        }
    }
    DeclareFunctions(): modifierfunction[] {
        return Object.values({
            1: modifierfunction.MODIFIER_EVENT_ON_TAKEDAMAGE
        });
    }
    OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus()) {
            this.SetStackCount(this.GetStackCount() + math.floor(keys.damage * this.damage_heal_pct));
        }
    }
}
export class imba_abaddon_aphotic_shield extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            caster.EmitSound("Hero_Abaddon.AphoticShield.Cast");
            // let responses = {
            //     1: "abaddon_abad_aphoticshield_01",
            //     2: "abaddon_abad_aphoticshield_02",
            //     3: "abaddon_abad_aphoticshield_03",
            //     4: "abaddon_abad_aphoticshield_04",
            //     5: "abaddon_abad_aphoticshield_05",
            //     6: "abaddon_abad_aphoticshield_06",
            //     7: "abaddon_abad_aphoticshield_07"
            // }
            // caster.EmitCasterSound("npc_dota_hero_abaddon", responses, 50, DOTA_CAST_SOUND_FLAG_NONE, 20, "aphotic_shield");
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
            let duration = this.GetSpecialValue("duration");
            target.AddNewModifier(caster, null, modifier_name_aphotic_shield, {
                duration: duration
            });
        }
    }
}
export class modifier_imba_aphotic_shield_buff_block extends BaseModifier_Plus {
    public shield_init_value: any;
    public shield_remaining: any;
    public target_current_health: any;
    public has_talent: any;
    public damage_absorption_end: any;
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
    DeclareFunctions(): modifierfunction[] {
        return Object.values({
            1: modifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK
        });
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetParentPlus();
            let shield_size = target.GetModelRadius() * 0.7;
            let ability = this.GetAbilityPlus();
            let ability_level = ability.GetLevel();
            let target_origin = target.GetAbsOrigin();
            let attach_hitloc = "attach_hitloc";
            this.shield_init_value = ability.GetSpecialValue("damage_absorb") + getOverChannelShieldIncrease(caster);
            this.shield_remaining = this.shield_init_value;
            this.target_current_health = target.GetHealth();
            if (caster.HasTalent("special_bonus_imba_abaddon_3")) {
                this.has_talent = true;
                this.damage_absorption_end = GameRules.GetGameTime() + caster.GetTalentValue("special_bonus_imba_abaddon_3");
                this.invulnerability_expired = false;
            }
            let particle = ParticleManager.CreateParticle("particles/units/heroes/hero_abaddon/abaddon_aphotic_shield.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
            let common_vector = Vector(shield_size, 0, shield_size);
            ParticleManager.SetParticleControl(particle, 1, common_vector);
            ParticleManager.SetParticleControl(particle, 2, common_vector);
            ParticleManager.SetParticleControl(particle, 4, common_vector);
            ParticleManager.SetParticleControl(particle, 5, Vector(shield_size, 0, 0));
            ParticleManager.SetParticleControlEnt(particle, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, attach_hitloc, target_origin, true);
            this.AddParticle(particle, false, false, -1, false, false);
            if (caster.HasModifier("modifier_over_channel_handler")) {
                let over_channel_particle = ParticleManager.CreateParticle("particles/econ/courier/courier_baekho/courier_baekho_ambient_vapor.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                ParticleManager.SetParticleControlEnt(over_channel_particle, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, attach_hitloc, target_origin, true);
                this.AddParticle(over_channel_particle, false, false, -1, false, false);
                over_channel_particle = ParticleManager.CreateParticle("particles/econ/courier/courier_baekho/courier_baekho_ambient_swirl.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
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
            let radius = ability.GetSpecialValue("radius");
            let explode_target_team = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH;
            let explode_target_type = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
            let target_vector = target.GetAbsOrigin();
            target.EmitSound("Hero_Abaddon.AphoticShield.Destroy");
            let particle = ParticleManager.CreateParticle("particles/units/heroes/hero_abaddon/abaddon_aphotic_shield_explosion.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(particle, 0, target_vector);
            ParticleManager.ReleaseParticleIndex(particle);
            let units = FindUnitsInRadius(caster.GetTeamNumber(), target_vector, undefined, radius, explode_target_team, explode_target_type, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            let damage = this.shield_init_value;
            let damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
            let curse_of_avernus = caster.findAbliityPlus<imba_abaddon_frostmourne>("imba_abaddon_frostmourne");
            let debuff_duration;
            if (curse_of_avernus) {
                debuff_duration = curse_of_avernus.GetSpecialValue("slow_duration");
            }
            let mist_coil_ability;
            let mist_coil_range;
            if (caster.HasTalent("special_bonus_imba_abaddon_1")) {
                mist_coil_ability = caster.findAbliityPlus<imba_abaddon_death_coil>("imba_abaddon_death_coil");
                if (mist_coil_ability) {
                    mist_coil_range = caster.GetTalentValue("special_bonus_imba_abaddon_1");
                }
            }
            for (const [_, unit] of ipairs(units)) {
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
                        particle = ParticleManager.CreateParticle("particles/units/heroes/hero_abaddon/abaddon_aphotic_shield_hit.vpcf", ParticleAttachment_t.PATTACH_POINT, unit);
                        ParticleManager.SetParticleControlEnt(particle, 0, unit, ParticleAttachment_t.PATTACH_POINT, "attach_hitloc", unit.GetAbsOrigin(), true);
                        let hit_size = unit.GetModelRadius() * 0.3;
                        ParticleManager.SetParticleControl(particle, 1, Vector(hit_size, hit_size, hit_size));
                        ParticleManager.ReleaseParticleIndex(particle);
                    }
                }
                if (mist_coil_ability && CalculateDistance(target, unit) < mist_coil_range) {
                    let info = {
                        Target: unit,
                        Source: target,
                        Ability: mist_coil_ability,
                        EffectName: "particles/units/heroes/hero_abaddon/abaddon_death_coil.vpcf",
                        bDodgeable: false,
                        bProvidesVision: true,
                        bVisibleToEnemies: true,
                        bReplaceExisting: false,
                        iMoveSpeed: mist_coil_ability.GetSpecialValue("missile_speed"),
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
    GetModifierTotal_ConstantBlock(kv: ModifierAttackEvent): number {
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
    ResetAndExtendBy(seconds) {
        this.shield_remaining = this.shield_init_value;
        this.SetDuration(this.GetRemainingTime() + seconds, true);
    }
}
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
export class modifier_imba_curse_of_avernus_passive extends BaseModifier_Plus {
    public caster: any;
    public ability: any;
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
    DeclareFunctions(): modifierfunction[] {
        let funcs = {
            1: modifierfunction.MODIFIER_EVENT_ON_ATTACK,
            2: modifierfunction.MODIFIER_EVENT_ON_ATTACK_LANDED,
            3: modifierfunction.MODIFIER_EVENT_ON_ATTACK_FAIL,
            4: modifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PHYSICAL,
            5: modifierfunction.MODIFIER_EVENT_ON_ORDER
        }
        return Object.values(funcs);
    }
    OnAttack(kv: ModifierAttackEvent): void {
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
                            let slow_duration = this.GetAbilityPlus().GetSpecialValue("slow_duration");
                            target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_curse_of_avernus_debuff_counter", {
                                duration: slow_duration * (1 - target.GetStatusResistance())
                            });
                        }
                    }
                }
            }
        }
    }
    OnOrder(kv: ModifierUnitEvent): void {
        let order_type = kv.order_type;
        if (order_type != dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET) {
            this.ability.curse_of_avernus_target = undefined;
        }
    }
    OnAttackFail(kv: ModifierAttackEvent): void {
        if (this.GetParentPlus() == kv.attacker) {
            this.ability.curse_of_avernus_target = undefined;
        }
    }
    OnAttackLanded(kv: ModifierAttackEvent): void {
        if (this.GetParentPlus() == kv.attacker) {
            this.ability.curse_of_avernus_target = undefined;
        }
    }
    GetModifierProcAttack_BonusDamage_Physical(kv: ModifierAttackEvent): number {
        if (kv.attacker == this.GetCasterPlus() && this.ability.curse_of_avernus_target == kv.target) {
            return this.damage;
        }
        return 0;
    }
}
export class modifier_imba_curse_of_avernus_debuff_counter extends BaseModifier_Plus {
    public has_talent: any;
    public duration_extend: any;
    public hits: any;
    public base_duration: any;
    public pfx: any;
    DeclareFunctions(): modifierfunction[] {
        let funcs = {
            1: modifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(funcs);
    }
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
        if (this.GetStackCount() >= this.GetAbilityPlus().GetSpecialValue("hit_count")) {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_curse_of_avernus_debuff_slow", {
                duration: this.GetAbilityPlus().GetSpecialValue("curse_duration")
            });
            this.GetParentPlus().RemoveModifierByName("modifier_imba_curse_of_avernus_debuff_counter");
            let responses = {
                1: "abaddon_abad_frostmourne_01",
                2: "abaddon_abad_frostmourne_02",
                3: "abaddon_abad_frostmourne_03",
                4: "abaddon_abad_frostmourne_04",
                5: "abaddon_abad_frostmourne_05",
                6: "abaddon_abad_frostmourne_06",
                7: "abaddon_abad_frostmourne_06"
            }
            this.GetCasterPlus().EmitCasterSound("npc_dota_hero_abaddon", responses, 50, DOTA_CAST_SOUND_FLAG_NONE, 30, "curse_of_avernus");
            this.GetCasterPlus().EmitSound("Hero_Abaddon.Curse.Proc");
        }
    }
    OnStackCountChanged(iStackCount: number): void {
        if (!IsServer()) {
            return;
        }
        if (!this.pfx) {
            this.pfx = ParticleManager.CreateParticle("particles/units/heroes/hero_abaddon/abaddon_curse_counter_stack.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
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
    GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetAbilityPlus().GetSpecialValue("movement_speed") * (-1);
    }
}
export class modifier_imba_curse_of_avernus_debuff_slow extends BaseModifier_Plus {
    public has_talent: any;
    public duration_extend: any;
    public hits: any;
    public base_duration: any;
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
    DeclareFunctions(): modifierfunction[] {
        let funcs = {
            1: modifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
            2: modifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
            3: modifierfunction.MODIFIER_EVENT_ON_ATTACK,
            4: modifierfunction.MODIFIER_EVENT_ON_ATTACK_LANDED,
            5: modifierfunction.MODIFIER_EVENT_ON_TAKEDAMAGE
        }
        return Object.values(funcs);
    }
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
                let buff_duration = this.GetAbilityPlus().GetSpecialValue("slow_duration");
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), buff_name, {
                    duration: buff_duration
                });
            } else {
                current_buff.ForceRefresh();
            }
            this.heal_convert = (this.GetAbilityPlus().GetSpecialValueFor("heal_convert") / 100);
        }
    }
    BeRefresh(kv: any): void {
        if (this.has_talent) {
            this.SetDuration(this.base_duration + this.hits * this.duration_extend, true);
        }
    }
    OnAttack(kv: ModifierAttackEvent): void {
        if (IsServer()) {
            let target = kv.target;
            if (target == this.GetParentPlus()) {
                let caster = this.GetCasterPlus();
                let attacker = kv.attacker;
                if (caster.GetTeamNumber() == attacker.GetTeamNumber()) {
                    let ability = this.GetAbilityPlus();
                    let buff_duration = ability.GetSpecialValue("slow_duration");
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
    OnAttackLanded(kv: ModifierAttackEvent): void {
        if (this.has_talent && (kv.attacker == this.GetCasterPlus()) && (kv.target == this.GetParentPlus())) {
            this.hits = this.hits + 1;
        }
    }
    OnTakeDamage(kv: ModifierInstanceEvent): void {
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
                    let healFX = ParticleManager.CreateParticle("particles/generic_gameplay/generic_lifesteal.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, caster);
                    ParticleManager.ReleaseParticleIndex(healFX);
                    caster.Heal(heal_amount, caster);
                    if (caster.HasModifier("modifier_imba_borrowed_time_buff_hot_caster")) {
                        let buffed_allies = caster._borrowed_time_buffed_allies;
                        if (buffed_allies && caster.HasScepter()) {
                            for (const [k, _] of ipairs(buffed_allies)) {
                                healFX = ParticleManager.CreateParticle("particles/generic_gameplay/generic_lifesteal.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, k);
                                ParticleManager.ReleaseParticleIndex(healFX);
                                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, k, heal_amount, undefined);
                                k.Heal(heal_amount, caster);
                            }
                        }
                    }
                }
            }
        }
    }
    GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetAbilityPlus().GetSpecialValue("curse_slow") * (-1);
    }
}
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
        this.attack_increase = this.GetAbilityPlus().GetSpecialValue("curse_attack_speed");
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_abaddon_2")) {
            this.attack_increase = this.attack_increase + this.GetCasterPlus().GetTalentValue("special_bonus_imba_abaddon_2", "value");
        }
    }
    BeCreated(p_0: any,): void {
        this._UpdateIncreaseValues();
    }
    BeRefresh(params: any): void {
        this._UpdateIncreaseValues();
    }
    DeclareFunctions(): modifierfunction[] {
        let funcs = {
            1: modifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
            2: modifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(funcs);
    }
    GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_increase;
    }
}
export class imba_abaddon_over_channel extends BaseAbility_Plus {
    IsStealable() {
        return false;
    }
    IsInnateAbility() {
        return true;
    }
    OnToggle(): void {
        if (this.GetToggleState() && !this.GetCasterPlus().HasModifier("modifier_over_channel_handler")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), null, "modifier_over_channel_handler", {});
        } else if (!this.GetToggleState() && this.GetCasterPlus().HasModifier("modifier_over_channel_handler")) {
            this.GetCasterPlus().RemoveModifierByName("modifier_over_channel_handler");
        }
    }
}
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
        let particle = ParticleManager.CreateParticle(particle_name, ParticleAttachment_t.PATTACH_ABSORIGIN, target);
        ParticleManager.SetParticleControlEnt(particle, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target_origin, true);
        this.AddParticle(particle, false, false, -1, false, false);
        particle = ParticleManager.CreateParticle(particle_name, ParticleAttachment_t.PATTACH_ABSORIGIN, target);
        ParticleManager.SetParticleControlEnt(particle, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", target_origin, true);
        this.AddParticle(particle, false, false, -1, false, false);
    }
    DeclareFunctions(): modifierfunction[] {
        let funcs = {
            1: modifierfunction.MODIFIER_EVENT_ON_ABILITY_EXECUTED
        }
        return Object.values(funcs);
    }
    OnAbilityExecuted(keys: ModifierAbilityEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.GetParentPlus() && !keys.ability.IsItem() && keys.ability.GetName() != "imba_abaddon_over_channel" && keys.ability.GetName() != "ability_capture") {
            this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_over_channel_reduction", {
                duration: this.GetAbilityPlus().GetSpecialValueFor("reduction_duration")
            });
            let parent = this.GetParentPlus();
            Timers.CreateTimer(this.GetAbilityPlus().GetSpecialValueFor("reduction_duration"), () => {
                let overchannel_modifier = parent.findBuff<modifier_over_channel_reduction>("modifier_over_channel_reduction");
                if (overchannel_modifier) {
                    overchannel_modifier.DecrementStackCount();
                }
            });
        }
    }
}
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
    DeclareFunctions(): modifierfunction[] {
        return Object.values({
            1: modifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
            2: modifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT
        });
    }
    GetModifierAttackSpeedBonus_Constant(): number {
        return -this.GetStackCount() * this.GetAbilityPlus().GetSpecialValueFor("reduction_multiplier");
    }
    GetModifierMoveSpeedBonus_Constant(): number {
        return -this.GetStackCount() * this.GetAbilityPlus().GetSpecialValueFor("reduction_multiplier");
    }
}
export class imba_abaddon_borrowed_time extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        if (this.GetCasterPlus().IsRealHero()) {
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
            let buff_duration = this.GetSpecialValue("duration");
            if (caster.HasScepter()) {
                buff_duration = this.GetSpecialValue("duration_scepter");
            }
            caster.AddNewModifier(caster, null, "modifier_imba_borrowed_time_buff_hot_caster", {
                duration: buff_duration
            });
            let responses = {
                1: "abaddon_abad_borrowedtime_02",
                2: "abaddon_abad_borrowedtime_03",
                3: "abaddon_abad_borrowedtime_04",
                4: "abaddon_abad_borrowedtime_05",
                5: "abaddon_abad_borrowedtime_06",
                6: "abaddon_abad_borrowedtime_07",
                7: "abaddon_abad_borrowedtime_08",
                8: "abaddon_abad_borrowedtime_09",
                9: "abaddon_abad_borrowedtime_10",
                10: "abaddon_abad_borrowedtime_11"
            }
            if (!caster.EmitCasterSound("npc_dota_hero_abaddon", responses, 50, DOTA_CAST_SOUND_FLAG_BOTH_TEAMS, undefined, undefined)) {
                caster.EmitCasterSound("npc_dota_hero_abaddon", {
                    1: "abaddon_abad_borrowedtime_01"
                }, 1, DOTA_CAST_SOUND_FLAG_BOTH_TEAMS, undefined, undefined);
            }
            if (caster.HasTalent("special_bonus_imba_abaddon_7")) {
                let target_team = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
                let target_type = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
                let allies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, target_team, target_type, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, unit] of ipairs(allies)) {
                    let over_channel_particle = ParticleManager.CreateParticle("particles/dev/library/base_dust_hit_detail.vpcf", ParticleAttachment_t.PATTACH_POINT, unit);
                    ParticleManager.ReleaseParticleIndex(over_channel_particle);
                    over_channel_particle = ParticleManager.CreateParticle("particles/dev/library/base_dust_hit_smoke.vpcf", ParticleAttachment_t.PATTACH_POINT, unit);
                    ParticleManager.ReleaseParticleIndex(over_channel_particle);
                    unit.Purge(false, true, false, true, false);
                }
            }
        }
    }
}
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
    _CheckHealth(damage) {
        let target = this.GetParentPlus();
        let ability = this.GetAbilityPlus();
        if (!ability.IsHidden() && ability.IsCooldownReady() && !target.PassivesDisabled() && target.IsAlive()) {
            let hp_threshold = this.hp_threshold;
            let current_hp = target.GetHealth();
            if (current_hp <= hp_threshold) {
                target.CastAbilityImmediately(ability, target.GetPlayerID());
            }
        }
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let target = this.GetParentPlus();
            if (target.IsIllusion()) {
                this.Destroy();
            } else {
                this.hp_threshold = this.GetAbilityPlus().GetSpecialValue("hp_threshold");
                this._CheckHealth(0);
            }
        }
    }
    DeclareFunctions(): modifierfunction[] {
        let funcs = {
            1: modifierfunction.MODIFIER_EVENT_ON_TAKEDAMAGE,
            2: modifierfunction.MODIFIER_EVENT_ON_STATE_CHANGED
        }
        return Object.values(funcs);
    }
    OnTakeDamage(kv: ModifierInstanceEvent): void {
        if (IsServer()) {
            let target = this.GetParentPlus();
            if (target == kv.unit) {
                this._CheckHealth(kv.damage);
            }
        }
    }
    OnStateChanged(kv: ModifierUnitEvent): void {
        if (IsServer()) {
            let target = this.GetParentPlus();
            if (target == kv.unit) {
                this._CheckHealth(0);
            }
        }
    }
}
export class modifier_imba_borrowed_time_buff_hot_caster extends BaseModifier_Plus {
    public has_talent: any;
    public ratio: any;
    public mist_duration: any;
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
    DeclareFunctions(): modifierfunction[] {
        let funcs = {
            1: modifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
            2: modifierfunction.MODIFIER_EVENT_ON_TAKEDAMAGE
        }
        return Object.values(funcs);
    }
    GetAuraRadius(): number {
        return this.GetAbilityPlus().GetSpecialValueFor("redirect_range");
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
                this.mist_duration = target.FindTalentValue("special_bonus_imba_abaddon_8", "mist_duration");
            }
            this.target_current_health = target.GetHealth();
            target._borrowed_time_buffed_allies = {}
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
    OnTakeDamage(kv: ModifierInstanceEvent): void {
        if (IsServer()) {
            if ((kv.unit.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin()).Length2D() <= this.GetAbilityPlus().GetSpecialValue("redirect_range_scepter") && this.GetCasterPlus().HasScepter() && kv.unit.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber() && !kv.unit.IsBuilding()) {
                if (!kv.unit.borrowed_time_damage_taken) {
                    kv.unit.borrowed_time_damage_taken = 0;
                }
                kv.unit.borrowed_time_damage_taken = kv.unit.borrowed_time_damage_taken + kv.damage;
                if (kv.unit.borrowed_time_damage_taken / this.GetAbilityPlus().GetSpecialValue("ally_threshold_scepter") >= 1) {
                    for (let i = 1; i <= kv.unit.borrowed_time_damage_taken / this.GetAbilityPlus().GetSpecialValue("ally_threshold_scepter"); i += 1) {
                        kv.unit.borrowed_time_damage_taken = kv.unit.borrowed_time_damage_taken - this.GetAbilityPlus().GetSpecialValue("ally_threshold_scepter");
                        this.GetCasterPlus().findAbliityPlus<imba_abaddon_death_coil>("imba_abaddon_death_coil").OnSpellStart(kv.unit, true);
                    }
                }
            }
        }
    }
    GetModifierIncomingDamage_Percentage(kv: ModifierAttackEvent): number {
        if (IsServer()) {
            let target = this.GetParentPlus();
            let heal_particle = ParticleManager.CreateParticle("particles/units/heroes/hero_abaddon/abaddon_borrowed_time_heal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
            let target_vector = target.GetAbsOrigin();
            ParticleManager.SetParticleControl(heal_particle, 0, target_vector);
            ParticleManager.SetParticleControl(heal_particle, 1, target_vector);
            ParticleManager.ReleaseParticleIndex(heal_particle);
            if (this.has_talent) {
                let current_health = target.GetHealth();
                let max_health = target.GetMaxHealth();
                this.SetStackCount(this.GetStackCount() + math.floor(kv.damage / this.ratio));
            }
            target.Heal(kv.damage, target);
            return -9999999;
        }
    }
}
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
    DeclareFunctions(): modifierfunction[] {
        let funcs = {
            1: modifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE
        }
        return Object.values(funcs);
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetParentPlus();
            let buff_list = caster._borrowed_time_buffed_allies;
            if (buff_list) {
                buff_list[target] = true;
            }
            let target_origin = target.GetAbsOrigin();
            let particle_name = "particles/econ/courier/courier_hyeonmu_ambient/courier_hyeonmu_ambient_trail_steam.vpcf";
            let particle = ParticleManager.CreateParticle(particle_name, ParticleAttachment_t.PATTACH_ABSORIGIN, target);
            ParticleManager.SetParticleControlEnt(particle, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target_origin, true);
            this.AddParticle(particle, false, false, -1, false, false);
            particle = ParticleManager.CreateParticle(particle_name, ParticleAttachment_t.PATTACH_ABSORIGIN, target);
            ParticleManager.SetParticleControlEnt(particle, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", target_origin, true);
            this.AddParticle(particle, false, false, -1, false, false);
        }
    }
    OnRemoved(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let buff_list = caster._borrowed_time_buffed_allies;
            if (buff_list) {
                buff_list[this.GetParentPlus()] = undefined;
            }
        }
    }
    GetModifierIncomingDamage_Percentage(kv: ModifierAttackEvent): number {
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
export class modifier_imba_borrowed_time_buff_mist extends BaseModifier_Plus {
    public duration: any;
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
    DeclareFunctions(): modifierfunction[] {
        let decFuns = {
            1: modifierfunction.MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT
        }
        return Object.values(decFuns);
    }
    GetModifierConstantHealthRegen(): number {
        return this.GetStackCount() / this.duration;
    }
}
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
                curse_of_avernus_ability.GetBehavior();
                curse_of_avernus_ability.GetCooldown();
            }
        }
    }
}
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
