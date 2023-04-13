
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

@registerAbility()
export class imba_furion_sprout extends BaseAbility_Plus { }
@registerAbility()
export class imba_furion_teleportation extends BaseAbility_Plus { }
@registerAbility()
export class imba_furion_force_of_nature extends BaseAbility_Plus { }
@registerAbility()
export class imba_furion_wrath_of_nature extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_furion_wrath_of_nature";
    }
    OnAbilityPhaseStart(): boolean {
        let cast_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_furion/furion_wrath_of_nature_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(cast_particle, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(cast_particle);
        return true;
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Furion.WrathOfNature_Cast.Self");
        EmitSoundOnLocationWithCaster(this.GetCursorPosition(), "Hero_Furion.WrathOfNature_Cast", this.GetCasterPlus());
        BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_furion_wrath_of_nature_thinker", {}, this.GetCursorPosition(), this.GetCasterPlus().GetTeamNumber(), false);
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_furion_wrath_of_nature_boost") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_furion_wrath_of_nature_boost")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_furion_wrath_of_nature_boost"), "modifier_special_bonus_imba_furion_wrath_of_nature_boost", {});
        }
    }
}
@registerModifier()
export class modifier_imba_furion_wrath_of_nature extends BaseModifier_Plus {
    IsHidden(): boolean {
        return !this.GetCasterPlus().HasScepter() && !this.GetCasterPlus().HasTalent("special_bonus_imba_furion_wrath_of_nature_boost");
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return FIND_UNITS_EVERYWHERE;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_furion_wrath_of_nature_aura";
    }
    GetAuraEntityReject(hTarget: CDOTA_BaseNPC): boolean {
        return (!this.GetCasterPlus().HasScepter() && !this.GetCasterPlus().HasTalent("special_bonus_imba_furion_wrath_of_nature_boost")) || !this.GetAbilityPlus().IsTrained() || this.GetParentPlus() != hTarget.GetOwner() || !hTarget.GetModelName().includes("furion") || !hTarget.GetModelName().includes("treant");
    }
}
@registerModifier()
export class modifier_imba_furion_wrath_of_nature_aura extends BaseModifier_Plus {
    public treant_damage_per_stack: number;
    public treant_health_per_stack: number;
    BeCreated(p_0: any,): void {
        this.treant_damage_per_stack = this.GetSpecialValueFor("treant_damage_per_stack");
        this.treant_health_per_stack = this.GetSpecialValueFor("treant_health_per_stack");
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasModifier("modifier_imba_furion_wrath_of_nature")) {
            this.SetStackCount(this.GetCasterPlus().findBuff<modifier_imba_furion_wrath_of_nature>("modifier_imba_furion_wrath_of_nature").GetStackCount());
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.GetStackCount() * this.treant_damage_per_stack;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS)
    CC_GetModifierExtraHealthBonus(): number {
        return this.GetStackCount() * this.treant_health_per_stack;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS)
    CC_GetModifierHealthBonus(): number {
        return this.GetStackCount() * this.treant_health_per_stack;
    }
}
@registerModifier()
export class modifier_imba_furion_wrath_of_nature_thinker extends BaseModifier_Plus {
    public max_targets: any;
    public damage: number;
    public damage_percent_add: number;
    public jump_delay: number;
    public kill_damage: number;
    public kill_damage_duration: number;
    public damage_scepter: number;
    public scepter_buffer: any;
    public treant_large_hp_bonus_tooltip: number;
    public treant_large_damage_bonus_tooltip: number;
    public treant_bonus_damage: number;
    public treant_bonus_damage_hero: number;
    public damage_type: number;
    public hit_enemies: { [key: string]: boolean };
    public counter: number;
    public position: any;
    public target: IBaseNpc_Plus;
    public wrath_particle: any;
    public bFoundTarget: any;
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
        this.max_targets = this.GetSpecialValueFor("max_targets");
        this.damage = this.GetSpecialValueFor("damage");
        this.damage_percent_add = this.GetSpecialValueFor("damage_percent_add");
        this.jump_delay = this.GetSpecialValueFor("jump_delay");
        this.kill_damage = this.GetSpecialValueFor("kill_damage");
        this.kill_damage_duration = this.GetSpecialValueFor("kill_damage_duration");
        this.damage_scepter = this.GetSpecialValueFor("damage_scepter");
        this.scepter_buffer = this.GetSpecialValueFor("scepter_buffer");
        this.treant_large_hp_bonus_tooltip = this.GetSpecialValueFor("treant_large_hp_bonus_tooltip");
        this.treant_large_damage_bonus_tooltip = this.GetSpecialValueFor("treant_large_damage_bonus_tooltip");
        this.treant_bonus_damage = this.GetSpecialValueFor("treant_bonus_damage");
        this.treant_bonus_damage_hero = this.GetSpecialValueFor("treant_bonus_damage_hero");
        if (!IsServer()) {
            return;
        }
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.hit_enemies = {}
        this.counter = 0;
        this.position = this.GetParentPlus().GetAbsOrigin();
        this.target = this.GetParentPlus();
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.position, undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST, false))) {
            if (!this.GetAbilityPlus().GetCursorTarget() || enemy == this.GetAbilityPlus().GetCursorTarget() && !this.GetAbilityPlus().GetCursorTarget().TriggerSpellAbsorb(this.GetAbilityPlus())) {
                this.counter = this.counter + 1;
                this.wrath_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_furion/furion_wrath_of_nature.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, enemy);
                ParticleManager.SetParticleControl(this.wrath_particle, 0, enemy.GetAbsOrigin() + ((this.position - enemy.GetAbsOrigin() as Vector).Normalized() * 200) as Vector);
                ParticleManager.SetParticleControlEnt(this.wrath_particle, 1, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                ParticleManager.SetParticleControl(this.wrath_particle, 2, enemy.GetAbsOrigin() + ((this.position - enemy.GetAbsOrigin() as Vector).Normalized() * 200) as Vector);
                ParticleManager.SetParticleControlEnt(this.wrath_particle, 3, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(this.wrath_particle, 4, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(this.wrath_particle);
                this.position = enemy.GetAbsOrigin();
                if (enemy.IsCreep()) {
                    enemy.EmitSound("Hero_Furion.WrathOfNature_Damage.Creep");
                } else {
                    enemy.EmitSound("Hero_Furion.WrathOfNature_Damage");
                }
                if (this.GetCasterPlus().HasScepter() || this.GetCasterPlus().HasTalent("special_bonus_imba_furion_wrath_of_nature_boost")) {
                    enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_furion_wrath_of_nature_spawn", {
                        duration: this.scepter_buffer * (1 - enemy.GetStatusResistance()),
                        treant_bonus_damage: this.treant_bonus_damage,
                        treant_bonus_damage_hero: this.treant_bonus_damage_hero
                    });
                }
                if (this.GetCasterPlus().HasScepter()) {
                    ApplyDamage({
                        victim: enemy,
                        damage: this.damage_scepter * ((1 + (this.damage_percent_add * 0.01)) ^ this.counter),
                        damage_type: this.damage_type,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.GetCasterPlus(),
                        ability: this.GetAbilityPlus()
                    });
                } else {
                    ApplyDamage({
                        victim: enemy,
                        damage: this.damage * ((1 + (this.damage_percent_add * 0.01)) ^ this.counter),
                        damage_type: this.damage_type,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.GetCasterPlus(),
                        ability: this.GetAbilityPlus()
                    });
                }
                this.hit_enemies[enemy.entindex() + ""] = true;
            }
            return;
        }
        this.StartIntervalThink(this.jump_delay);
    }
    OnIntervalThink(): void {
        this.bFoundTarget = false;
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.position, undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST, false))) {
            if (!this.hit_enemies[enemy.entindex() + ""]) {
                this.bFoundTarget = true;
                this.counter = this.counter + 1;
                this.wrath_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_furion/furion_wrath_of_nature.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, enemy);
                ParticleManager.SetParticleControl(this.wrath_particle, 0, enemy.GetAbsOrigin() + ((this.position - enemy.GetAbsOrigin() as Vector).Normalized() * 200) as Vector);
                ParticleManager.SetParticleControlEnt(this.wrath_particle, 1, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                ParticleManager.SetParticleControl(this.wrath_particle, 2, enemy.GetAbsOrigin() + ((this.position - enemy.GetAbsOrigin() as Vector).Normalized() * 200) as Vector);
                ParticleManager.SetParticleControlEnt(this.wrath_particle, 3, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(this.wrath_particle, 4, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(this.wrath_particle);
                this.position = enemy.GetAbsOrigin();
                if (enemy.IsCreep()) {
                    enemy.EmitSound("Hero_Furion.WrathOfNature_Damage.Creep");
                } else {
                    enemy.EmitSound("Hero_Furion.WrathOfNature_Damage");
                }
                if (this.GetCasterPlus().HasScepter() || this.GetCasterPlus().HasTalent("special_bonus_imba_furion_wrath_of_nature_boost")) {
                    enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_furion_wrath_of_nature_spawn", {
                        duration: this.scepter_buffer * (1 - enemy.GetStatusResistance()),
                        treant_bonus_damage: this.treant_bonus_damage,
                        treant_bonus_damage_hero: this.treant_bonus_damage_hero
                    });
                }
                if (this.GetCasterPlus().HasScepter()) {
                    ApplyDamage({
                        victim: enemy,
                        damage: this.damage_scepter * ((1 + (this.damage_percent_add * 0.01)) ^ this.counter),
                        damage_type: this.damage_type,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.GetCasterPlus(),
                        ability: this.GetAbilityPlus()
                    });
                } else {
                    ApplyDamage({
                        victim: enemy,
                        damage: this.damage * ((1 + (this.damage_percent_add * 0.01)) ^ this.counter),
                        damage_type: this.damage_type,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.GetCasterPlus(),
                        ability: this.GetAbilityPlus()
                    });
                }
                this.hit_enemies[enemy.entindex() + ""] = true;
                if (!enemy.IsAlive()) {
                    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_furion_wrath_of_nature_damage_counter", {
                        duration: this.kill_damage_duration
                    });
                    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_furion_wrath_of_nature_damage_stack", {
                        duration: this.kill_damage_duration,
                        kill_damage: this.kill_damage
                    });
                }
                return;
            }
        }
        if (!this.bFoundTarget || this.counter >= this.max_targets) {
            this.StartIntervalThink(-1);
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_furion_wrath_of_nature_spawn extends BaseModifier_Plus {
    public treant_bonus_damage: number;
    public treant_bonus_damage_hero: number;
    RemoveOnDeath(): boolean {
        return false;
    }
    Init(keys: any): void {
        if (!IsServer()) {
            return;
        }
        this.treant_bonus_damage = keys.treant_bonus_damage;
        this.treant_bonus_damage_hero = keys.treant_bonus_damage_hero;
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus() && (!this.GetParentPlus().IsReincarnating || !this.GetParentPlus().IsReincarnating())) {
            if (this.GetCasterPlus().HasModifier("modifier_imba_furion_wrath_of_nature")) {
                if (this.GetCasterPlus().HasScepter()) {
                    if ((this.GetParentPlus().IsRealUnit() || this.GetParentPlus().IsClone()) && this.treant_bonus_damage_hero) {
                        this.GetCasterPlus().findBuff<modifier_imba_furion_wrath_of_nature>("modifier_imba_furion_wrath_of_nature").SetStackCount(this.GetCasterPlus().FindModifierByName("modifier_imba_furion_wrath_of_nature").GetStackCount() + this.treant_bonus_damage_hero);
                    } else if (this.treant_bonus_damage) {
                        this.GetCasterPlus().findBuff<modifier_imba_furion_wrath_of_nature>("modifier_imba_furion_wrath_of_nature").SetStackCount(this.GetCasterPlus().FindModifierByName("modifier_imba_furion_wrath_of_nature").GetStackCount() + this.treant_bonus_damage);
                    }
                }
                if (this.GetCasterPlus().HasTalent("special_bonus_imba_furion_wrath_of_nature_boost")) {
                    this.GetCasterPlus().findBuff<modifier_imba_furion_wrath_of_nature>("modifier_imba_furion_wrath_of_nature").SetStackCount(this.GetCasterPlus().FindModifierByName("modifier_imba_furion_wrath_of_nature").GetStackCount() + this.GetCasterPlus().GetTalentValue("special_bonus_imba_furion_wrath_of_nature_boost"));
                }
                this.Destroy();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_furion_wrath_of_nature_damage_stack extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(keys: any): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_imba_furion_wrath_of_nature_damage_counter")) {
            this.SetStackCount(keys.kill_damage);
            this.GetParentPlus().findBuff<modifier_imba_furion_wrath_of_nature_damage_counter>("modifier_imba_furion_wrath_of_nature_damage_counter").SetStackCount(this.GetParentPlus().FindModifierByName("modifier_imba_furion_wrath_of_nature_damage_counter").GetStackCount() + this.GetStackCount());
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_imba_furion_wrath_of_nature_damage_counter")) {
            this.GetParentPlus().findBuff<modifier_imba_furion_wrath_of_nature_damage_counter>("modifier_imba_furion_wrath_of_nature_damage_counter").SetStackCount(this.GetParentPlus().FindModifierByName("modifier_imba_furion_wrath_of_nature_damage_counter").GetStackCount() - this.GetStackCount());
        }
    }
}
@registerModifier()
export class modifier_imba_furion_wrath_of_nature_damage_counter extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_special_bonus_imba_furion_wrath_of_nature_boost extends BaseModifier_Plus {
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
