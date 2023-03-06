
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class imba_elder_titan_echo_stomp extends BaseAbility_Plus {
    public combined_particle: any;
    GetAbilityTextureName(): string {
        return "imba_elder_titan_echo_stomp";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return super.GetCastRange(location, target);
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_elder_titan_7")) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_CHANNELLED;
        }
    }
    GetCastPoint(): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_elder_titan_7")) {
            return this.GetSpecialValueFor("cast_time");
        } else {
            return super.GetCastPoint();
        }
    }
    GetChannelTime(): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_elder_titan_7")) {
            return 0;
        } else {
            return this.GetSpecialValueFor("cast_time");
        }
    }
    OnAbilityPhaseStart(): boolean {
        let caster = this.GetCasterPlus();
        let astral_spirit = caster.TempData<IBaseNpc_Plus>().astral_spirit;
        if (astral_spirit && !astral_spirit.IsNull() && astral_spirit.findAbliityPlus<imba_elder_titan_echo_stomp_spirit>("imba_elder_titan_echo_stomp_spirit")) {
            this.AddTimer(0.03, () => {
                astral_spirit.CastAbilityNoTarget(astral_spirit.findAbliityPlus<imba_elder_titan_echo_stomp_spirit>("imba_elder_titan_echo_stomp_spirit"), astral_spirit.GetPlayerOwnerID());
            });
        } else {
            this.combined_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_elder_titan/elder_titan_echo_stomp_cast_combined.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        }
        EmitSoundOn("Hero_ElderTitan.EchoStomp.Channel", this.GetCasterPlus());
        return true;
    }
    OnSpellStart(): void {
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_elder_titan_7")) {
            return;
        }
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let radius = this.GetSpecialValueFor("radius");
            let stun_duration = this.GetSpecialValueFor("sleep_duration");
            let stomp_damage = this.GetSpecialValueFor("stomp_damage");
            EmitSoundOn("Hero_ElderTitan.EchoStomp", caster);
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!enemy.IsMagicImmune()) {
                    let damageTable = {
                        victim: enemy,
                        attacker: caster,
                        damage: stomp_damage,
                        damage_type: this.GetAbilityDamageType(),
                        ability: this
                    }
                    ApplyDamage(damageTable);
                    enemy.AddNewModifier(caster, this, "modifier_stunned", {
                        duration: stun_duration * (1 - enemy.GetStatusResistance())
                    });
                }
            }
        }
    }
    OnChannelFinish(interrupted: boolean): void {
        if (IsServer()) {
            if (this.GetCasterPlus().HasModifier("modifier_imba_elder_titan_magic_immune")) {
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_elder_titan_magic_immune");
            }
            if (this.combined_particle) {
                ParticleManager.DestroyParticle(this.combined_particle, true);
                ParticleManager.ReleaseParticleIndex(this.combined_particle);
            }
            if (interrupted) {
                let caster = this.GetCasterPlus();
                let astral_spirit = caster.TempData<IBaseNpc_Plus>().astral_spirit;
                if (astral_spirit && !astral_spirit.IsNull() && !astral_spirit.TempData().is_returning) {
                    astral_spirit.Interrupt();
                }
            } else {
                let caster = this.GetCasterPlus();
                let ability = this;
                let radius = ability.GetSpecialValueFor("radius");
                let stun_duration = ability.GetSpecialValueFor("sleep_duration");
                let stomp_damage = ability.GetSpecialValueFor("stomp_damage");
                EmitSoundOn("Hero_ElderTitan.EchoStomp.ti7", caster);
                EmitSoundOn("Hero_ElderTitan.EchoStomp.ti7_layer", caster);
                let particle_stomp_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_elder_titan/elder_titan_echo_stomp_physical.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
                ParticleManager.SetParticleControl(particle_stomp_fx, 0, caster.GetAbsOrigin());
                ParticleManager.SetParticleControl(particle_stomp_fx, 1, Vector(radius, 1, 1));
                ParticleManager.SetParticleControl(particle_stomp_fx, 2, caster.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(particle_stomp_fx);
                let magical_particle = undefined;
                let astral_spirit = caster.TempData<IBaseNpc_Plus>().astral_spirit;
                if (astral_spirit && !astral_spirit.IsNull()) {
                    magical_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_elder_titan/elder_titan_echo_stomp_magical.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, astral_spirit);
                    ParticleManager.SetParticleControl(magical_particle, 2, astral_spirit.GetAbsOrigin());
                } else {
                    magical_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_elder_titan/elder_titan_echo_stomp_magical.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
                    ParticleManager.SetParticleControl(magical_particle, 2, caster.GetAbsOrigin());
                }
                ParticleManager.SetParticleControl(magical_particle, 1, Vector(radius, 1, 1));
                ParticleManager.ReleaseParticleIndex(magical_particle);
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
                let heroes_hit = 0;
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    if (!enemy.IsMagicImmune()) {
                        ApplyDamage({
                            victim: enemy,
                            attacker: caster,
                            damage: stomp_damage,
                            damage_type: ability.GetAbilityDamageType(),
                            ability: ability
                        });
                        if (!astral_spirit || astral_spirit.IsNull()) {
                            ApplyDamage({
                                victim: enemy,
                                attacker: caster,
                                damage: stomp_damage,
                                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                                ability: ability
                            });
                        }
                        enemy.AddNewModifier(caster, ability, "modifier_stunned", {
                            duration: stun_duration * (1 - enemy.GetStatusResistance())
                        });
                        if (enemy.IsRealHero()) {
                            heroes_hit = heroes_hit + 1;
                        }
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_elder_titan_magic_immune extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/items_fx/black_king_bar_avatar.vpcf";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        };
    }
}
@registerAbility()
export class imba_elder_titan_ancestral_spirit extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "elder_titan_ancestral_spirit";
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_elder_titan_return_spirit";
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_elder_titan_1")) {
            return this.GetCasterPlus().GetTalentValue("special_bonus_imba_elder_titan_1");
        } else {
            return super.GetCastRange(location, target);
        }
    }
    IsNetherWardStealable() {
        return false;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target_point = this.GetCursorPosition();
        let radius = this.GetSpecialValueFor("radius");
        let duration = this.GetSpecialValueFor("spirit_duration");
        let spirit_movespeed = this.GetTalentSpecialValueFor("speed");
        EmitSoundOn("Hero_ElderTitan.AncestralSpirit.Cast", caster);
        caster.SwapAbilities("imba_elder_titan_ancestral_spirit", "imba_elder_titan_return_spirit", false, true);
        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_elder_titan/elder_titan_ancestral_spirit_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.SetParticleControl(particle, 0, target_point);
        ParticleManager.ReleaseParticleIndex(particle);
        let astral_spirit = BaseNpc_Plus.CreateUnitByName("npc_dota_elder_titan_ancestral_spirit", target_point, caster.GetTeamNumber(), true, caster, caster);
        caster.TempData().astral_spirit = astral_spirit;
        astral_spirit.SetControllableByPlayer(caster.GetPlayerID(), true);
        astral_spirit.AddNewModifier(astral_spirit, this, "modifier_imba_elder_titan_ancestral_spirit_self", {});
        astral_spirit.TempData().basemovespeed = spirit_movespeed;
        if (!astral_spirit.IsNull()) {
            if (caster.findAbliityPlus<imba_elder_titan_echo_stomp>("imba_elder_titan_echo_stomp") != undefined) {
                astral_spirit.findAbliityPlus<imba_elder_titan_echo_stomp_spirit>("imba_elder_titan_echo_stomp_spirit").SetLevel(caster.FindAbilityByName("imba_elder_titan_echo_stomp").GetLevel());
            }
            if (caster.findAbliityPlus<imba_elder_titan_return_spirit>("imba_elder_titan_return_spirit") != undefined) {
                astral_spirit.findAbliityPlus<imba_elder_titan_return_spirit>("imba_elder_titan_return_spirit").SetHidden(false);
                astral_spirit.findAbliityPlus<imba_elder_titan_return_spirit>("imba_elder_titan_return_spirit").SetLevel(caster.FindAbilityByName("imba_elder_titan_return_spirit").GetLevel());
            }
            if (caster.findAbliityPlus<imba_elder_titan_natural_order>("imba_elder_titan_natural_order") != undefined) {
                astral_spirit.findAbliityPlus<imba_elder_titan_natural_order>("imba_elder_titan_natural_order").SetLevel(caster.FindAbilityByName("imba_elder_titan_natural_order").GetLevel());
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_elder_titan_1") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_elder_titan_1")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_elder_titan_1"), "modifier_special_bonus_imba_elder_titan_1", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_elder_titan_2") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_elder_titan_2")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_elder_titan_2"), "modifier_special_bonus_imba_elder_titan_2", {});
        }
    }
}
@registerModifier()
export class modifier_imba_elder_titan_ancestral_spirit_self extends BaseModifier_Plus {
    public return_timer: number;
    public radius: number;
    public duration: number;
    public buff_duration: number;
    public pass_damage: number;
    public damage_heroes: number;
    public damage_creeps: number;
    public speed_heroes: number;
    public speed_creeps: number;
    public armor_creeps: any;
    public armor_heroes: any;
    public scepter_magic_immune_per_hero: any;
    public bonus_damage: number;
    public bonus_ms: number;
    public bonus_armor: number;
    public targets_hit: any;
    public real_hero_counter: number;
    public et_ab: any;
    public owner_echo_stomp_ability: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_elder_titan/elder_titan_ancestral_spirit_ambient.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.return_timer = 0.0;
        this.radius = this.GetSpecialValueFor("radius");
        this.duration = this.GetSpecialValueFor("spirit_duration");
        this.buff_duration = this.GetSpecialValueFor("buff_duration");
        this.pass_damage = this.GetSpecialValueFor("pass_damage");
        this.damage_heroes = this.GetSpecialValueFor("damage_heroes");
        this.damage_creeps = this.GetSpecialValueFor("damage_creeps");
        this.speed_heroes = this.GetSpecialValueFor("move_pct_heroes");
        this.speed_creeps = this.GetSpecialValueFor("move_pct_creeps");
        this.armor_creeps = this.GetSpecialValueFor("armor_creeps");
        this.armor_heroes = this.GetSpecialValueFor("armor_heroes");
        this.scepter_magic_immune_per_hero = this.GetSpecialValueFor("scepter_magic_immune_per_hero");
        this.bonus_damage = 0;
        this.bonus_ms = 0;
        this.bonus_armor = 0;
        this.targets_hit = {}
        if (IsServer()) {
            this.real_hero_counter = 0;
            EmitSoundOn("Hero_ElderTitan.AncestralSpirit.Spawn", this.GetParentPlus());
            this.StartIntervalThink(0.1);
            this.AddTimer(FrameTime(), () => {
                this.GetParentPlus().SetBaseMoveSpeed(this.GetParentPlus().TempData().basemovespeed);
            });
        }
    }
    OnIntervalThink(): void {
        if (this.GetAbilityPlus() == undefined) {
            this.GetParentPlus().RemoveSelf();
        }
        let owner = this.GetParentPlus().GetOwner() as IBaseNpc_Plus;
        let duration = this.GetAbilityPlus().GetCaster().GetTalentValue("special_bonus_imba_elder_titan_3");
        let nearby_enemies = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(nearby_enemies)) {
            let enemy_has_been_hit = false;
            for (const [_, enemy_hit] of GameFunc.iPair(this.targets_hit)) {
                if (enemy == enemy_hit) {
                    enemy_has_been_hit = true;
                    return;
                }
            }
            if (!enemy_has_been_hit) {
                let hit_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_elder_titan/elder_titan_ancestral_spirit_touch.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, enemy);
                ParticleManager.SetParticleControl(hit_pfx, 0, this.GetParentPlus().GetAbsOrigin());
                ParticleManager.SetParticleControlEnt(hit_pfx, 1, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(hit_pfx);
                EmitSoundOn("Hero_ElderTitan.AncestralSpirit.Buff", enemy);
                ApplyDamage({
                    attacker: this.GetParentPlus(),
                    victim: enemy,
                    ability: this.GetAbilityPlus(),
                    damage: this.pass_damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                });
                if (owner.HasTalent("special_bonus_imba_elder_titan_3")) {
                    enemy.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_rooted", {
                        duration: duration * (1 - enemy.GetStatusResistance())
                    });
                    let root_fx = ResHelper.CreateParticleEx("particles/units/heroes/heroes_underlord/abyssal_underlord_pitofmalice_stun.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy);
                    ParticleManager.SetParticleControl(root_fx, 0, enemy.GetAbsOrigin());
                    this.AddTimer(duration, () => {
                        ParticleManager.DestroyParticle(root_fx, true);
                        ParticleManager.ReleaseParticleIndex(root_fx);
                    });
                }
                this.targets_hit[GameFunc.GetCount(this.targets_hit) + 1] = enemy;
                if (enemy.IsRealHero()) {
                    this.bonus_damage = this.bonus_damage + this.damage_heroes;
                    this.bonus_ms = this.bonus_ms + this.speed_heroes;
                    this.bonus_armor = this.bonus_armor + this.armor_heroes;
                    this.real_hero_counter = this.real_hero_counter + 1;
                } else {
                    this.bonus_damage = this.bonus_damage + this.damage_creeps;
                    this.bonus_ms = this.bonus_ms + this.speed_creeps;
                    this.bonus_armor = this.bonus_armor + this.armor_creeps;
                }
            }
        }
        if (!owner.IsAlive()) {
            owner.SwapAbilities("imba_elder_titan_ancestral_spirit", "imba_elder_titan_return_spirit", true, false);
            this.GetParentPlus().RemoveSelf();
            owner.TempData().astral_spirit = undefined;
            return undefined;
        }
        if (!this.et_ab) {
            this.et_ab = this.GetParentPlus().findAbliityPlus<imba_elder_titan_echo_stomp_spirit>("imba_elder_titan_echo_stomp_spirit");
        }
        if (!this.owner_echo_stomp_ability) {
            this.owner_echo_stomp_ability = owner.findAbliityPlus<imba_elder_titan_echo_stomp>("imba_elder_titan_echo_stomp");
        }
        if (this.et_ab && this.return_timer > this.duration && !this.et_ab.IsInAbilityPhase() && !this.GetParentPlus().TempData().is_returning) {
            this.GetParentPlus().MoveToNPC(owner);
            this.GetParentPlus().TempData().is_returning = true;
            this.GetParentPlus().findBuff<modifier_imba_elder_titan_ancestral_spirit_self>("modifier_imba_elder_titan_ancestral_spirit_self").SetStackCount(1);
            EmitSoundOn("Hero_ElderTitan.AncestralSpirit.Return", this.GetParentPlus());
        }
        if (this.GetParentPlus().TempData().is_returning && (!this.owner_echo_stomp_ability || (!this.owner_echo_stomp_ability.IsInAbilityPhase() && !this.owner_echo_stomp_ability.IsChanneling()))) {
            this.GetParentPlus().MoveToNPC(owner);
        }
        if (this.return_timer - 10.0 > this.duration || (this.GetParentPlus().TempData().is_returning == true && (this.GetParentPlus().GetOwner().GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Length() < 180)) {
            owner.SwapAbilities("imba_elder_titan_ancestral_spirit", "imba_elder_titan_return_spirit", true, false);
            if (this.bonus_damage > 0) {
                let damage_mod = owner.AddNewModifier(owner, this.GetAbilityPlus(), "modifier_imba_elder_titan_ancestral_spirit_damage", {
                    duration: this.buff_duration
                });
                damage_mod.SetStackCount(this.bonus_damage);
            }
            if (this.bonus_ms > 0) {
                let speed_mod = owner.AddNewModifier(owner, this.GetAbilityPlus(), "modifier_imba_elder_titan_ancestral_spirit_ms", {
                    duration: this.buff_duration
                });
                speed_mod.SetStackCount(this.bonus_ms);
            }
            if (this.bonus_armor > 0) {
                let armor_mod = owner.AddNewModifier(owner, this.GetAbilityPlus(), "modifier_imba_elder_titan_ancestral_spirit_armor", {
                    duration: this.buff_duration
                });
                armor_mod.SetStackCount(this.bonus_armor * 10);
            }
            if (owner.HasScepter()) {
                owner.AddNewModifier(owner, this.GetAbilityPlus(), "modifier_imba_elder_titan_magic_immune", {
                    duration: this.real_hero_counter * this.scepter_magic_immune_per_hero
                });
            }
            this.GetParentPlus().RemoveSelf();
            owner.TempData().astral_spirit = undefined;
            return undefined;
        }
        this.return_timer = this.return_timer + 0.1;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (IsServer()) {
            let state = {}
            state = {
                [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
                [modifierstate.MODIFIER_STATE_FLYING]: true,
                [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
                [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
                [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: false
            }
            if (this.GetStackCount() == 1) {
                state = {
                    [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
                    [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
                    [modifierstate.MODIFIER_STATE_FLYING]: true,
                    [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
                    [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
                    [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true
                }
            }
            return state;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE_MIN,
            2: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
            4: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION_RATE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE_MIN)
    CC_GetModifierMoveSpeed_AbsoluteMin( /** keys */): number {
        return this.GetParentPlus().TempData().basemovespeed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT)
    CC_GetModifierIgnoreMovespeedLimit(): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        if (this.GetStackCount() == 1) {
            return GameActivity_t.ACT_DOTA_FLAIL;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION_RATE)
    CC_GetOverrideAnimationRate(): number {
        if (this.GetStackCount() == 1) {
            return 0.2;
        }
    }
    BeDestroy( /** keys */): void {
        let owner = this.GetParentPlus().GetOwner() as IBaseNpc_Plus;
        if (owner) {
            owner.SwapAbilities("imba_elder_titan_ancestral_spirit", "imba_elder_titan_return_spirit", true, false);
        }
    }
}
@registerModifier()
export class modifier_imba_elder_titan_ancestral_spirit_damage extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_elder_titan/elder_titan_ancestral_spirit_buff.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_elder_titan_ancestral_spirit_ms extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_elder_titan_ancestral_spirit_armor extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount() * 0.1;
    }
}
@registerAbility()
export class imba_elder_titan_return_spirit extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "elder_titan_return_spirit";
    }
    IsInnateAbility() {
        return true;
    }
    IsStealable(): boolean {
        return false;
    }
    IsHiddenWhenStolen(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return false;
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    GetAssociatedPrimaryAbilities(): string {
        return "imba_elder_titan_ancestral_spirit";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let astral_spirit = caster.TempData<IBaseNpc_Plus>().astral_spirit;
        if (astral_spirit && !astral_spirit.TempData().is_returning) {
            astral_spirit.MoveToNPC(astral_spirit.GetOwner() as IBaseNpc_Plus);
            astral_spirit.TempData().is_returning = true;
            astral_spirit.findBuff<modifier_imba_elder_titan_ancestral_spirit_self>("modifier_imba_elder_titan_ancestral_spirit_self").SetStackCount(1);
            EmitSoundOn("Hero_ElderTitan.AncestralSpirit.Return", astral_spirit);
        }
    }
}
@registerAbility()
export class imba_elder_titan_natural_order extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        if (this.GetCasterPlus().GetUnitName() == "npc_dota_elder_titan_ancestral_spirit") {
            return "elder_titan_natural_order_spirit";
        }
        return "elder_titan_natural_order";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_elder_titan_natural_order_aura";
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_elder_titan_4") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_elder_titan_4")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_elder_titan_4"), "modifier_special_bonus_imba_elder_titan_4", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_elder_titan_5") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_elder_titan_5")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_elder_titan_5"), "modifier_special_bonus_imba_elder_titan_5", {});
        }
    }
}
@registerModifier()
export class modifier_imba_elder_titan_natural_order_aura extends BaseModifier_Plus {
    public natural_order_radius: number;
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.natural_order_radius = this.GetSpecialValueFor("radius");
    }
    GetAuraRadius(): number {
        return this.natural_order_radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return this.GetAbilityPlus().GetAbilityTargetFlags();
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return this.GetAbilityPlus().GetAbilityTargetTeam();
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return this.GetAbilityPlus().GetAbilityTargetType();
    }
    GetModifierAura(): string {
        return "modifier_imba_elder_titan_natural_order";
    }
    GetAuraDuration(): number {
        return 1;
    }
}
@registerModifier()
export class modifier_imba_elder_titan_natural_order extends BaseModifier_Plus {
    public base_armor_reduction: any;
    public magic_resist_reduction: any;
    public status_resistance_pct: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_elder_titan/elder_titan_natural_order_physical.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.base_armor_reduction = this.GetSpecialValueFor("armor_reduction_pct");
        this.magic_resist_reduction = this.GetSpecialValueFor("magic_resistance_pct");
        this.status_resistance_pct = this.GetSpecialValueFor("status_resistance_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.base_armor_reduction * 0.01 * this.GetParentPlus().GetPhysicalArmorBaseValue();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.magic_resist_reduction * 0.01 * this.GetParentPlus().GetBaseMagicalResistanceValue();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage(): number {
        if (this.GetCasterPlus() != undefined && this.GetCasterPlus().HasTalent("special_bonus_imba_elder_titan_4")) {
            if (this.GetCasterPlus().GetName() == "npc_dota_elder_titan_ancestral_spirit") {
                return (this.GetCasterPlus().GetOwner() as IBaseNpc_Plus).GetTalentValue("special_bonus_imba_elder_titan_4") * (-1);
            } else {
                return this.GetCasterPlus().GetTalentValue("special_bonus_imba_elder_titan_4") * (-1);
            }
        } else {
            return 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.status_resistance_pct * (-1);
    }
}
@registerAbility()
export class imba_elder_titan_echo_stomp_spirit extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "imba_elder_titan_echo_stomp";
    }
    GetPlaybackRateOverride(): number {
        return 1.7 / this.GetSpecialValueFor("cast_time");
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetCastPoint(): number {
        return super.GetCastPoint() - (FrameTime());
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        let caster = this.GetCasterPlus();
        let base_range = super.GetCastRange(location, target);
        return base_range;
    }
    OnAbilityPhaseStart(): boolean {
        if (this.GetCasterPlus().GetOwner()) {
            let owner = this.GetCasterPlus().GetOwner() as IBaseNpc_Plus;
            let ab = owner.findAbliityPlus<imba_elder_titan_echo_stomp>("imba_elder_titan_echo_stomp");
            if (owner.HasTalent("special_bonus_imba_elder_titan_7")) {
                if (ab.IsInAbilityPhase() == false) {
                    owner.CastAbilityNoTarget(ab, owner.GetPlayerID());
                }
            } else {
                if (owner.IsChanneling() == false) {
                    owner.CastAbilityNoTarget(ab, owner.GetPlayerID());
                }
            }
        }
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1);
        EmitSoundOn("Hero_ElderTitan.EchoStomp.Channel.ti7_layer", this.GetCasterPlus());
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1);
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this;
            let radius = ability.GetSpecialValueFor("radius");
            let stun_duration = ability.GetSpecialValueFor("sleep_duration");
            let stomp_damage = ability.GetSpecialValueFor("stomp_damage");
            EmitSoundOn("Hero_ElderTitan.EchoStomp.ti7", caster);
            EmitSoundOn("Hero_ElderTitan.EchoStomp.ti7_layer", caster);
            let particle_stomp_fx = ResHelper.CreateParticleEx("particles/econ/items/elder_titan/elder_titan_ti7/elder_titan_echo_stomp_ti7.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(particle_stomp_fx, 0, caster.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_stomp_fx, 1, Vector(radius, 1, 1));
            ParticleManager.SetParticleControl(particle_stomp_fx, 2, caster.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(particle_stomp_fx);
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!enemy.IsMagicImmune()) {
                    let damageTable = {
                        victim: enemy,
                        attacker: caster,
                        damage: stomp_damage,
                        damage_type: ability.GetAbilityDamageType(),
                        ability: ability
                    }
                    ApplyDamage(damageTable);
                    enemy.AddNewModifier(caster, ability, "modifier_stunned", {
                        duration: stun_duration * (1 - enemy.GetStatusResistance())
                    });
                }
            }
            this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1);
        }
    }
}
@registerAbility()
export class imba_elder_titan_earth_splitter extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "elder_titan_earth_splitter";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_elder_titan_6")) {
            return super.GetCastRange(location, target) + this.GetCasterPlus().GetTalentValue("special_bonus_imba_elder_titan_6");
        } else {
            return super.GetCastRange(location, target);
        }
    }
    GetCooldown(level: number): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_elder_titan_9")) {
            return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_elder_titan_9");
        } else {
            return super.GetCooldown(level);
        }
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let caster_position = caster.GetAbsOrigin();
        let target_point = this.GetCursorPosition();
        let playerID = caster.GetPlayerID();
        let scepter = caster.HasScepter();
        let radius = this.GetSpecialValueFor("radius");
        let duration = this.GetSpecialValueFor("duration");
        let slow_duration = this.GetSpecialValueFor("slow_duration");
        if (scepter) {
            slow_duration = this.GetSpecialValueFor("slow_duration_scepter");
        }
        let bonus_hp_per_str = this.GetSpecialValueFor("bonus_hp_per_str");
        let effect_delay = this.GetSpecialValueFor("crack_time");
        let crack_width = this.GetSpecialValueFor("crack_width");
        let crack_distance = this.GetSpecialValueFor("crack_distance");
        if (caster.HasTalent("special_bonus_imba_elder_titan_6")) {
            crack_distance = this.GetSpecialValueFor("crack_distance") + caster.GetTalentValue("special_bonus_imba_elder_titan_6");
        }
        let crack_damage = this.GetSpecialValueFor("damage_pct") / 2;
        let caster_fw = caster.GetForwardVector();
        let crack_ending = caster_position + caster_fw * crack_distance as Vector;
        EmitSoundOn("Hero_ElderTitan.EarthSplitter.Cast", caster);
        let particle_start_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_elder_titan/elder_titan_earth_splitter.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, caster);
        ParticleManager.SetParticleControl(particle_start_fx, 0, caster_position);
        ParticleManager.SetParticleControl(particle_start_fx, 1, crack_ending);
        ParticleManager.SetParticleControl(particle_start_fx, 3, Vector(0, effect_delay, 0));
        GridNav.DestroyTreesAroundPoint(target_point, radius, false);
        this.AddTimer(effect_delay, () => {
            EmitSoundOn("Hero_ElderTitan.EarthSplitter.Destroy", caster);
            let enemies = FindUnitsInLine(caster.GetTeamNumber(), caster_position, crack_ending, undefined, crack_width, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags());
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                enemy.Interrupt();
                enemy.AddNewModifier(caster, this, "modifier_imba_earth_splitter", {
                    duration: slow_duration * (1 - enemy.GetStatusResistance())
                });
                if (caster.HasScepter()) {
                    enemy.AddNewModifier(caster, this, "modifier_imba_earth_splitter_scepter", {
                        duration: slow_duration * (1 - enemy.GetStatusResistance())
                    });
                }
                ApplyDamage({
                    victim: enemy,
                    attacker: caster,
                    damage: enemy.GetMaxHealth() * crack_damage * 0.01,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                    ability: this
                });
                ApplyDamage({
                    victim: enemy,
                    attacker: caster,
                    damage: enemy.GetMaxHealth() * crack_damage * 0.01,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: this
                });
                let closest_point = this.FindNearestPointFromLine(caster_position, caster_fw, enemy.GetAbsOrigin());
                FindClearSpaceForUnit(enemy, closest_point, false);
            }
            ParticleManager.ReleaseParticleIndex(particle_start_fx);
        });
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_elder_titan_6") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_elder_titan_6")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_elder_titan_6"), "modifier_special_bonus_imba_elder_titan_6", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_elder_titan_9") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_elder_titan_9")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_elder_titan_9"), "modifier_special_bonus_imba_elder_titan_9", {});
        }
    }
    FindNearestPointFromLine(caster: Vector, dir: Vector, affected: Vector) {
        let castertoaffected = affected - caster as Vector;
        let len = castertoaffected.Dot(dir);
        let ntgt = Vector(dir.x * len, dir.y * len, caster.z);
        return caster + ntgt as Vector;
    }
}
@registerModifier()
export class modifier_imba_earth_splitter extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_PASSIVES_DISABLED]: true
        }
        return state;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetSpecialValueFor("slow_pct");
    }
}
@registerModifier()
export class modifier_imba_earth_splitter_scepter extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_elder_titan_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_elder_titan_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_elder_titan_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_elder_titan_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_elder_titan_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_elder_titan_9 extends BaseModifier_Plus {
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
