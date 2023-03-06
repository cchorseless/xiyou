
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_leshrac_split_earth extends BaseAbility_Plus {
    GetCooldown(level: number): number {
        let cd = super.GetCooldown(level);
        if (this.GetCasterPlus().HasModifier("modifier_imba_tormented_soul_form")) {
            let tormented_form_cd_rdct_pct = this.GetSpecialValueFor("tormented_form_cd_rdct_pct");
            if (tormented_form_cd_rdct_pct) {
                cd = cd * tormented_form_cd_rdct_pct * 0.01;
            }
        }
        return cd;
    }
    GetAOERadius(): number {
        let caster = this.GetCasterPlus();
        let ability = this;
        let modifier_empowered = "modifier_imba_split_earth_empowered_split";
        let radius = ability.GetSpecialValueFor("radius");
        let empowered_split_radius = ability.GetSpecialValueFor("empowered_split_radius");
        if (caster.HasModifier(modifier_empowered)) {
            let radius_increase = caster.findBuffStack(modifier_empowered, caster) * empowered_split_radius;
            radius = radius + radius_increase;
        }
        return radius;
    }
    OnSpellStart(ese_location?: Vector, ese_radius?: number): void {
        if (IsClient()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = ability.GetCursorPosition();
        let cast_sound = "Hero_Leshrac.Split_Earth";
        let particle_spikes = "particles/units/heroes/hero_leshrac/leshrac_split_earth.vpcf";
        let particle_orb = "particles/hero/leshrac/leshrac_splitter_blast_projectile.vpcf";
        let modifier_stun = "modifier_imba_split_earth_stun";
        let modifier_empowered = "modifier_imba_split_earth_empowered_split";
        let modifier_tormented = "modifier_imba_tormented_soul_form";
        let modifier_truesight = "modifier_imba_split_earth_tormented_true_sight";
        let delay = ability.GetSpecialValueFor("delay");
        let radius = ability.GetSpecialValueFor("radius");
        let duration = ability.GetSpecialValueFor("duration");
        let damage = ability.GetSpecialValueFor("damage");
        let empowered_split_duration = ability.GetSpecialValueFor("empowered_split_duration");
        let empowered_split_radius = ability.GetSpecialValueFor("empowered_split_radius");
        let empowered_split_damage = ability.GetSpecialValueFor("empowered_split_damage");
        let splitter_blast_radius = ability.GetSpecialValueFor("splitter_blast_radius");
        let splitter_blast_unit_energy_count = ability.GetSpecialValueFor("splitter_blast_unit_energy_count");
        let splitter_blast_hero_energy_count = ability.GetSpecialValueFor("splitter_blast_hero_energy_count");
        let splitter_blast_projectile_speed = ability.GetSpecialValueFor("splitter_blast_projectile_speed");
        let splitter_blast_delay = ability.GetSpecialValueFor("splitter_blast_delay");
        let tormented_form_trusight_duration = ability.GetSpecialValueFor("tormented_form_trusight_duration");
        if (caster.HasTalent("special_bonus_unique_imba_leshrac_empowered_split_earth_duration")) {
            empowered_split_duration = empowered_split_duration + caster.GetTalentValue("special_bonus_unique_imba_leshrac_empowered_split_earth_duration");
        }
        if (caster.HasModifier(modifier_empowered)) {
            let modifier_empowered_handle = caster.FindModifierByName(modifier_empowered);
            if (modifier_empowered_handle) {
                let stacks = modifier_empowered_handle.GetStackCount();
                radius = radius + empowered_split_radius * stacks;
                damage = damage + empowered_split_damage * stacks;
            }
        }
        if (ese_location && ese_radius) {
            target_point = ese_location;
            radius = ese_radius;
            delay = 0;
        }
        let energy_orb_count = 0;
        this.AddTimer(delay, () => {
            GridNav.DestroyTreesAroundPoint(target_point, radius, true);
            EmitSoundOnLocationWithCaster(target_point, cast_sound, caster);
            let particle_spikes_fx = ResHelper.CreateParticleEx(particle_spikes, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined, caster);
            ParticleManager.SetParticleControl(particle_spikes_fx, 0, target_point);
            ParticleManager.SetParticleControl(particle_spikes_fx, 1, Vector(radius, 1, 1));
            ParticleManager.ReleaseParticleIndex(particle_spikes_fx);
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target_point, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                enemy.AddNewModifier(caster, ability, modifier_stun, {
                    duration: duration * (1 - enemy.GetStatusResistance())
                });
                if (caster.HasModifier(modifier_tormented)) {
                    enemy.AddNewModifier(caster, ability, modifier_truesight, {
                        duration: tormented_form_trusight_duration
                    });
                }
                let damageTable = {
                    victim: enemy,
                    attacker: caster,
                    damage: damage,
                    damage_type: ability.GetAbilityDamageType(),
                    ability: ability
                }
                ApplyDamage(damageTable);
                if (enemy.IsRealUnit()) {
                    if (!caster.HasModifier(modifier_empowered)) {
                        caster.AddNewModifier(caster, ability, modifier_empowered, {
                            duration: empowered_split_duration
                        });
                    }
                    let modifier_empowered_handle = caster.FindModifierByName(modifier_empowered);
                    if (modifier_empowered_handle) {
                        modifier_empowered_handle.IncrementStackCount();
                    }
                }
                if (enemy.IsRealUnit() || enemy.IsConsideredHero()) {
                    energy_orb_count = energy_orb_count + splitter_blast_hero_energy_count;
                } else {
                    energy_orb_count = energy_orb_count + splitter_blast_unit_energy_count;
                }
            }
            if (radius > splitter_blast_radius) {
                splitter_blast_radius = radius;
            }
            let splitter_enemies = FindUnitsInRadius(caster.GetTeamNumber(), target_point, undefined, splitter_blast_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
            if (GameFunc.GetCount(splitter_enemies) > 0) {
                let dummy = BaseNpc_Plus.CreateUnitByName("npc_dummy_unit", target_point, caster.GetTeamNumber(), false, caster, caster);
                let orbs_fired = 0;
                this.AddTimer(splitter_blast_delay, () => {
                    let chosen_enemy;
                    let valid_chosen_enemy = false;
                    let tries = 0;
                    while (!valid_chosen_enemy) {
                        let picked_enemy_num = RandomInt(1, GameFunc.GetCount(splitter_enemies));
                        chosen_enemy = splitter_enemies[picked_enemy_num];
                        if (chosen_enemy && !chosen_enemy.IsMagicImmune() && chosen_enemy.IsAlive()) {
                            valid_chosen_enemy = true;
                        } else {
                            tries = tries + 1;
                            if (tries >= 5) {
                                return;
                            }
                        }
                    }
                    if (valid_chosen_enemy && chosen_enemy) {
                        let projectile = {
                            Target: chosen_enemy,
                            Source: dummy,
                            Ability: ability,
                            EffectName: particle_orb,
                            iMoveSpeed: splitter_blast_projectile_speed,
                            vSpawnOrigin: dummy.GetAbsOrigin(),
                            bDrawsOnMinimap: false,
                            bDodgeable: true,
                            bIsAttack: false,
                            bVisibleToEnemies: true,
                            bReplaceExisting: false,
                            flExpireTime: GameRules.GetGameTime() + 10
                        }
                        ProjectileManager.CreateTrackingProjectile(projectile);
                    }
                    orbs_fired = orbs_fired + 1;
                    if (orbs_fired < energy_orb_count) {
                        return splitter_blast_delay;
                    } else {
                        UTIL_Remove(dummy);
                        return undefined;
                    }
                });
            }
        });
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (!target) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let splitter_blast_damage = ability.GetSpecialValueFor("splitter_blast_damage");
        let damageTable = {
            victim: target,
            attacker: caster,
            damage: splitter_blast_damage,
            damage_type: ability.GetAbilityDamageType(),
            ability: ability
        }
        ApplyDamage(damageTable);
    }
}
@registerModifier()
export class modifier_imba_split_earth_stun extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }

    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_DISABLED;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_stunned.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_split_earth_empowered_split extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public empowered_split_duration: number;
    public stack_table: number[];
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.empowered_split_duration = this.ability.GetSpecialValueFor("empowered_split_duration");
        if (this.caster.HasTalent("special_bonus_unique_imba_leshrac_empowered_split_earth_duration")) {
            this.empowered_split_duration = this.empowered_split_duration + this.caster.GetTalentValue("special_bonus_unique_imba_leshrac_empowered_split_earth_duration");
        }
        this.stack_table = []
        if (IsServer()) {
            this.StartIntervalThink(1);
        }
    }
    OnStackCountChanged(prev_stacks: number): void {
        if (!IsServer()) {
            return;
        }
        let stacks = this.GetStackCount();
        if (stacks > prev_stacks) {
            this.stack_table.push(GameRules.GetGameTime());
            this.ForceRefresh();
        }
    }
    OnIntervalThink(): void {
        let repeat_needed = true;
        while (repeat_needed) {
            let item_time = this.stack_table[0];
            if (GameRules.GetGameTime() - item_time >= this.empowered_split_duration) {
                if (this.GetStackCount() == 1) {
                    this.Destroy();
                    return;
                } else {
                    this.stack_table.shift();
                    this.DecrementStackCount();
                }
            } else {
                repeat_needed = false;
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.ability.GetSpecialValueFor("empowered_split_radius") * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2)
    CC_OnTooltip2(): number {
        return this.ability.GetSpecialValueFor("empowered_split_damage") * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_split_earth_tormented_true_sight extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        return 1;
    }
}
@registerAbility()
export class imba_leshrac_diabolic_edict extends BaseAbility_Plus {
    OnSpellStart(ese_target?: IBaseNpc_Plus, ese_explosion_count?: number): void {
        if (IsClient()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let cast_sound = "Hero_Leshrac.Diabolic_Edict_lp";
        let modifier_diabolic = "modifier_imba_leshrac_diabolic_edict";
        let duration = ability.GetSpecialValueFor("duration");
        this.GetCasterPlus().EmitSound(cast_sound);
        if (ese_target && ese_explosion_count) {
            let num_explosions = ability.GetSpecialValueFor("num_explosions");
            duration = duration / num_explosions * ese_explosion_count;
            this.GetCasterPlus().AddNewModifier(caster, ability, modifier_diabolic, {
                duration: duration,
                ese_explosion_count: ese_explosion_count,
                ese_target: ese_target.entindex()
            });
        } else {
            this.GetCasterPlus().AddNewModifier(caster, ability, modifier_diabolic, {
                duration: duration
            });
        }
    }
}
@registerModifier()
export class modifier_imba_leshrac_diabolic_edict extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public hit_sound: any;
    public particle_explosion: any;
    public particle_ring: any;
    public particle_hit: any;
    public modifier_tormented: any;
    public modifier_weakening: any;
    public num_explosions: any;
    public radius: number;
    public tower_bonus: number;
    public damage: number;
    public tormented_soul_weakening_duration: number;
    public diabolic_adapt_radius_inc: number;
    public diabolic_adapt_duration_inc: number;
    public purity_casing_radius: number;
    public purity_casing_fixed_dmg: any;
    public purity_casing_dmg_per_stack: number;
    public purity_casing_ring_duration: number;
    public target: IBaseNpc_Plus;
    public delay: number;
    public explosion_radius: number;
    public particle_ring_fx: any;
    public particle_hit_fx: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        if (IsClient()) {
            return;
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.hit_sound = "Hero_Leshrac.Diabolic_Edict";
        this.particle_explosion = "particles/hero/leshrac/leshrac_diabolic_edict.vpcf";
        this.particle_ring = "particles/hero/leshrac/leshrac_purity_casing_ring.vpcf";
        this.particle_hit = "particles/hero/leshrac/leshrac_purity_casing_hit.vpcf";
        this.modifier_tormented = "modifier_imba_tormented_soul_form";
        this.modifier_weakening = "modifier_imba_leshrac_diabolic_edict_weakening_torment";
        this.num_explosions = this.ability.GetSpecialValueFor("num_explosions") + this.caster.GetTalentValue("special_bonus_unique_leshrac_1");
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.tower_bonus = this.ability.GetSpecialValueFor("tower_bonus");
        this.damage = this.ability.GetSpecialValueFor("damage");
        this.tormented_soul_weakening_duration = this.ability.GetSpecialValueFor("tormented_soul_weakening_duration");
        this.diabolic_adapt_radius_inc = this.ability.GetSpecialValueFor("diabolic_adapt_radius_inc");
        this.diabolic_adapt_duration_inc = this.ability.GetSpecialValueFor("diabolic_adapt_duration_inc");
        this.purity_casing_radius = this.ability.GetSpecialValueFor("purity_casing_radius");
        this.purity_casing_fixed_dmg = this.ability.GetSpecialValueFor("purity_casing_fixed_dmg");
        this.purity_casing_dmg_per_stack = this.ability.GetSpecialValueFor("purity_casing_dmg_per_stack");
        this.purity_casing_ring_duration = this.ability.GetSpecialValueFor("purity_casing_ring_duration");
        if (this.caster.HasTalent("special_bonus_unique_imba_leshrac_diabolic_edict_explosions")) {
            this.num_explosions = this.num_explosions + this.caster.GetTalentValue("special_bonus_unique_imba_leshrac_diabolic_edict_explosions");
        }
        if (keys.ese_explosion_count && keys.ese_target) {
            this.num_explosions = keys.ese_explosion_count;
            this.target = EntIndexToHScript(keys.ese_target) as IBaseNpc_Plus;
        }
        this.delay = this.GetDuration() / this.num_explosions;
        this.explosion_radius = 0;
        this.StartIntervalThink(this.delay);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (this.target && this.target.IsAlive() && IsValidEntity(this.target)) {
            this.DiabolicEditExplosion(this.target);
            return;
        }
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.radius, this.GetAbilityPlus().GetAbilityTargetTeam(), this.GetAbilityPlus().GetAbilityTargetType(), DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
        let enemy = enemies[RandomInt(1, GameFunc.GetCount(enemies))];
        if (enemy) {
            this.DiabolicEditExplosion(enemy);
        } else {
            this.DiabolicEditExplosion(undefined);
            this.IncrementStackCount();
        }
    }
    DiabolicEditExplosion(target: IBaseNpc_Plus) {
        let pfx = ResHelper.CreateParticleEx(this.particle_explosion, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined, this.caster);
        let position_cast: Vector;
        if (target) {
            position_cast = target.GetAbsOrigin();
            let damage = this.damage;
            if (target.IsBuilding()) {
                damage = damage * (1 + this.tower_bonus * 0.01);
            }
            ApplyDamage({
                attacker: this.caster,
                victim: target,
                damage: damage,
                damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_BYPASSES_BLOCK,
                ability: this.ability
            });
            if (this.caster.HasModifier(this.modifier_tormented)) {
                if (!target.HasModifier(this.modifier_weakening)) {
                    target.AddNewModifier(this.caster, this.ability, this.modifier_weakening, {
                        duration: this.tormented_soul_weakening_duration * (1 - target.GetStatusResistance())
                    });
                }
                let modifier_weakening_handle = target.FindModifierByName(this.modifier_weakening);
                if (modifier_weakening_handle) {
                    modifier_weakening_handle.IncrementStackCount();
                    modifier_weakening_handle.ForceRefresh();
                }
            }
            if (target.IsRealUnit()) {
                this.explosion_radius = this.explosion_radius + this.diabolic_adapt_radius_inc;
                this.SetDuration(this.GetRemainingTime() + this.diabolic_adapt_duration_inc, true);
            }
            ParticleManager.SetParticleControlEnt(pfx, 1, target, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(pfx, 2, Vector(math.max(this.explosion_radius, RandomInt(50, 100)), 0, 0));
            if (this.explosion_radius > 0) {
                let explosion_enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.explosion_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, explosion_enemy] of GameFunc.iPair(explosion_enemies)) {
                    if (explosion_enemy != target) {
                        let damageTable = {
                            victim: explosion_enemy,
                            attacker: this.caster,
                            damage: this.damage,
                            damage_type: this.ability.GetAbilityDamageType(),
                            ability: this.ability
                        }
                        ApplyDamage(damageTable);
                    }
                }
            }
        } else {
            position_cast = this.caster.GetAbsOrigin() + RandomVector(RandomInt(0, this.radius)) as Vector;
            ParticleManager.SetParticleControl(pfx, 1, position_cast);
        }
        EmitSoundOnLocationWithCaster(position_cast, this.hit_sound, this.caster);
        ParticleManager.ReleaseParticleIndex(pfx);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_Leshrac.Diabolic_Edict_lp");
        if (this.GetStackCount() <= 0) {
            return;
        }
        this.particle_ring_fx = ResHelper.CreateParticleEx(this.particle_ring, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.caster, this.caster);
        ParticleManager.SetParticleControl(this.particle_ring_fx, 0, this.caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle_ring_fx, 1, Vector(100, 0, this.purity_casing_radius));
        ParticleManager.ReleaseParticleIndex(this.particle_ring_fx);
        let damage = this.purity_casing_fixed_dmg + this.purity_casing_dmg_per_stack * this.GetStackCount();
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.purity_casing_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            let damageTable = {
                victim: enemy,
                attacker: this.caster,
                damage: damage,
                damage_type: this.ability.GetAbilityDamageType(),
                ability: this.ability
            }
            ApplyDamage(damageTable);
            this.particle_hit_fx = ResHelper.CreateParticleEx(this.particle_hit, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy, this.caster);
            ParticleManager.SetParticleControl(this.particle_hit_fx, 0, enemy.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(this.particle_hit_fx);
        }
    }
}
@registerModifier()
export class modifier_imba_leshrac_diabolic_edict_weakening_torment extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public tormented_soul_phys_armor_rdct: any;
    public tormented_soul_magic_resist_rdct: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.tormented_soul_phys_armor_rdct = this.ability.GetSpecialValueFor("tormented_soul_phys_armor_rdct");
        this.tormented_soul_magic_resist_rdct = this.ability.GetSpecialValueFor("tormented_soul_magic_resist_rdct");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.tormented_soul_phys_armor_rdct * this.GetStackCount() * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.tormented_soul_magic_resist_rdct * this.GetStackCount() * (-1);
    }
}
@registerAbility()
export class imba_leshrac_lightning_storm extends BaseAbility_Plus {
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        let caster = this.GetCasterPlus();
        let modifier_tormented = "modifier_imba_tormented_soul_form";
        if (caster.HasModifier(modifier_tormented)) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE;
        }
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET;
    }
    GetAOERadius(): number {
        let caster = this.GetCasterPlus();
        let modifier_tormented = "modifier_imba_tormented_soul_form";
        if (caster.HasModifier(modifier_tormented)) {
            return this.GetSpecialValueFor("tormented_soul_aoe_radius");
        }
        return 0;
    }
    OnSpellStart(ese_target?: IBaseNpc_Plus, ese_jump_count?: number): void {
        if (IsClient()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = ability.GetCursorTarget();
        let modifier_tormented = "modifier_imba_tormented_soul_form";
        let modifier_tormented_mark = "modifier_imba_leshrac_lightning_storm_tormented_mark";
        let jump_count = ability.GetSpecialValueFor("jump_count");
        let radius = ability.GetSpecialValueFor("radius");
        let jump_delay = ability.GetSpecialValueFor("jump_delay");
        let tormented_soul_aoe_radius = ability.GetSpecialValueFor("tormented_soul_aoe_radius");
        let tormented_soul_mark_duration = ability.GetSpecialValueFor("tormented_soul_mark_duration");
        if (ese_target && ese_jump_count) {
            target = ese_target;
            jump_count = ese_jump_count;
        }
        if (target.TriggerSpellAbsorb(ability)) {
            return undefined;
        }
        let remaining_jumps = jump_count + 1;
        let enemies_table: EntityIndex[] = []
        let tormented_cast = false;
        if (caster.HasModifier(modifier_tormented)) {
            tormented_cast = true;
        }
        if (tormented_cast) {
            let marked_units = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, tormented_soul_aoe_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, marked_unit] of GameFunc.iPair(marked_units)) {
                marked_unit.AddNewModifier(caster, ability, modifier_tormented_mark, {
                    duration: tormented_soul_mark_duration * (1 - marked_unit.GetStatusResistance())
                });
            }
        }
        this.AddTimer(0, () => {
            this.LaunchLightningBoltOnTarget(target);
            if (!target.HasModifier(modifier_tormented_mark)) {
                enemies_table.push(target.entindex());
            }
            remaining_jumps = remaining_jumps - 1;
            if (remaining_jumps > 0) {
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    if (!enemies_table.includes(enemy.entindex()) && enemy != target) {
                        target = enemy;
                        return jump_delay;
                    }
                }
            }
            return undefined;
        });
    }
    LaunchLightningBoltOnTarget(target: IBaseNpc_Plus) {
        let caster = this.GetCasterPlus();
        let ability = this;
        let hit_sound = "Hero_Leshrac.Lightning_Storm";
        let particle_bolt = "particles/units/heroes/hero_leshrac/leshrac_lightning_bolt.vpcf";
        let modifier_slow = "modifier_imba_leshrac_lightning_storm_slow";
        let modifier_rider = "modifier_imba_leshrac_lightning_storm_lightning_rider";
        let slow_duration = ability.GetSpecialValueFor("slow_duration");
        let rider_stack_duration = ability.GetSpecialValueFor("rider_stack_duration");
        if (caster.HasTalent("special_bonus_unique_imba_leshrac_lightning_storm_duration")) {
            slow_duration = slow_duration + caster.GetTalentValue("special_bonus_unique_imba_leshrac_lightning_storm_duration");
        }
        EmitSoundOn(hit_sound, target);
        let particle_bolt_fx = ResHelper.CreateParticleEx(particle_bolt, ParticleAttachment_t.PATTACH_ABSORIGIN, target, caster);
        ParticleManager.SetParticleControlEnt(particle_bolt_fx, 0, target, ParticleAttachment_t.PATTACH_ABSORIGIN, "attach_hitloc", target.GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(particle_bolt_fx, 1, target.GetAbsOrigin() + Vector(0, 0, 2000) as Vector);
        ParticleManager.SetParticleControl(particle_bolt_fx, 2, target.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_bolt_fx, 5, target.GetAbsOrigin());
        if (target.IsMagicImmune() || target.IsOutOfGame() || target.IsInvulnerable()) {
            return;
        }
        let damageTable = {
            victim: target,
            attacker: caster,
            damage: ability.GetAbilityDamage(),
            damage_type: ability.GetAbilityDamageType(),
            ability: ability
        }
        ApplyDamage(damageTable);
        target.AddNewModifier(caster, ability, modifier_slow, {
            duration: slow_duration * (1 - target.GetStatusResistance())
        });
        if (!caster.HasModifier(modifier_rider)) {
            caster.AddNewModifier(caster, ability, modifier_rider, {
                duration: rider_stack_duration
            });
        }
        let modifier_rider_handle = caster.FindModifierByName(modifier_rider);
        if (modifier_rider_handle) {
            modifier_rider_handle.IncrementStackCount();
        }
    }
    OnInventoryContentsChanged(): void {
        let modifier_thinker = "modifier_imba_leshrac_lightning_storm_scepter_thinker";
        if (this.GetCasterPlus().HasScepter()) {
            if (!this.GetCasterPlus().HasModifier(modifier_thinker)) {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, modifier_thinker, {});
            }
        } else {
            if (this.GetCasterPlus().HasModifier(modifier_thinker)) {
                this.GetCasterPlus().RemoveModifierByName(modifier_thinker);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_leshrac_lightning_storm_slow extends BaseModifier_Plus {
    public slow_movement_speed: number;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public particle_slow: any;
    public particle_slow_fx: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            if (IsServer()) {
                this.Destroy();
            }
            return;
        }
        this.slow_movement_speed = this.GetSpecialValueFor("slow_movement_speed");
        if (!IsServer()) {
            return;
        }
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.particle_slow = "particles/units/heroes/hero_leshrac/leshrac_lightning_slow.vpcf";
        this.particle_slow_fx = ResHelper.CreateParticleEx(this.particle_slow, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent, this.caster);
        ParticleManager.SetParticleControl(this.particle_slow_fx, 0, this.parent.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle_slow_fx, 1, this.parent.GetAbsOrigin());
        this.AddParticle(this.particle_slow_fx, false, false, -1, false, false);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.slow_movement_speed && this.slow_movement_speed != 0) {
            return this.slow_movement_speed * (-1);
        }
    }
}
@registerModifier()
export class modifier_imba_leshrac_lightning_storm_scepter_thinker extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: imba_leshrac_lightning_storm;
    public modifier_nova: any;
    public radius_scepter: number;
    public interval_scepter: number;
    public lightning_ready: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.modifier_nova = "modifier_imba_leshrac_pulse_nova";
        this.radius_scepter = this.ability.GetSpecialValueFor("radius_scepter");
        this.interval_scepter = this.ability.GetSpecialValueFor("interval_scepter");
        if (IsServer()) {
            this.lightning_ready = true;
        }
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.caster.HasModifier(this.modifier_nova)) {
            return;
        }
        if (!this.lightning_ready) {
            return;
        }
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.radius_scepter, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
        if (GameFunc.GetCount(enemies) == 0) {
            return;
        }
        let enemy_found = false;
        let chosen_enemy;
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (enemy.IsRealUnit()) {
                enemy_found = true;
                chosen_enemy = enemy;
                return;
            }
        }
        if (!enemy_found) {
            chosen_enemy = enemies[RandomInt(1, GameFunc.GetCount(enemies))];
            enemy_found = true;
        }
        if (chosen_enemy && enemy_found) {
            this.ability.LaunchLightningBoltOnTarget(chosen_enemy);
            this.lightning_ready = false;
            this.AddTimer(this.interval_scepter, () => {
                this.lightning_ready = true;
            });
        }
    }
}
@registerModifier()
export class modifier_imba_leshrac_lightning_storm_lightning_rider extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public rider_ms_per_stack_pct: number;
    public rider_stack_duration: number;
    public rider_static_ms_limit: any;
    public rider_static_limit_per_stack: number;
    public stack_table: number[];
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.rider_ms_per_stack_pct = this.ability.GetSpecialValueFor("rider_ms_per_stack_pct");
        this.rider_stack_duration = this.ability.GetSpecialValueFor("rider_stack_duration");
        this.rider_static_ms_limit = this.ability.GetSpecialValueFor("rider_static_ms_limit");
        this.rider_static_limit_per_stack = this.ability.GetSpecialValueFor("rider_static_limit_per_stack");
        this.stack_table = []
        if (IsServer()) {
            this.StartIntervalThink(1);
        }
    }
    OnStackCountChanged(prev_stacks: number): void {
        if (!IsServer()) {
            return;
        }
        let stacks = this.GetStackCount();
        if (stacks > prev_stacks) {
            this.stack_table.push(GameRules.GetGameTime());
            this.ForceRefresh();
        }
    }
    OnIntervalThink(): void {
        let repeat_needed = true;
        while (repeat_needed) {
            let item_time = this.stack_table[0];
            if (GameRules.GetGameTime() - item_time >= this.rider_stack_duration) {
                if (this.GetStackCount() == 1) {
                    this.Destroy();
                    return;
                } else {
                    this.stack_table.shift();
                    this.DecrementStackCount();
                }
            } else {
                repeat_needed = false;
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.rider_ms_per_stack_pct * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT)
    CC_GetModifierIgnoreMovespeedLimit(): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT)
    CC_GetModifierMoveSpeed_Limit(): number {
        return this.rider_static_ms_limit + this.rider_static_limit_per_stack * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_leshrac_lightning_storm_tormented_cloud_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_storm_cloud: any;
    public modifier_aura_debuff: any;
    public tormented_soul_cast_aura_radius: number;
    public particle_storm_cloud_fx: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_storm_cloud = "particles/hero/leshrac/leshrac_tormented_lightning_storm_cloud.vpcf";
        this.modifier_aura_debuff = "modifier_imba_leshrac_lightning_storm_tormented_cloud_debuff";
        this.tormented_soul_cast_aura_radius = this.ability.GetSpecialValueFor("tormented_soul_cast_aura_radius");
        if (IsServer()) {
            this.particle_storm_cloud_fx = ResHelper.CreateParticleEx(this.particle_storm_cloud, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined, this.caster);
            ParticleManager.SetParticleControl(this.particle_storm_cloud_fx, 0, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle_storm_cloud_fx, 1, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle_storm_cloud_fx, 2, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle_storm_cloud_fx, 3, Vector(this.tormented_soul_cast_aura_radius, 0, 0));
            ParticleManager.SetParticleControl(this.particle_storm_cloud_fx, 62, Vector(1, 1, 1));
            this.AddParticle(this.particle_storm_cloud_fx, false, false, -1, false, false);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_DEATH
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.caster) {
            this.parent.ForceKill(false);
            this.Destroy();
        }
    }
    GetAuraRadius(): number {
        return this.tormented_soul_cast_aura_radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return this.modifier_aura_debuff;
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraDuration(): number {
        return 0.1;
    }
}
@registerModifier()
export class modifier_imba_leshrac_lightning_storm_tormented_cloud_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: imba_leshrac_lightning_storm;
    public parent: IBaseNpc_Plus;
    public tormented_soul_cast_zap_chance: number;
    public tormented_soul_cast_interval: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.tormented_soul_cast_zap_chance = this.ability.GetSpecialValueFor("tormented_soul_cast_zap_chance");
        this.tormented_soul_cast_interval = this.ability.GetSpecialValueFor("tormented_soul_cast_interval");
        if (IsServer()) {
            this.StartIntervalThink(this.tormented_soul_cast_interval);
        }
    }
    OnIntervalThink(): void {
        if (GFuncRandom.PRD(this.tormented_soul_cast_zap_chance, this)) {
            this.ability.LaunchLightningBoltOnTarget(this.parent);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.tormented_soul_cast_zap_chance;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2)
    CC_OnTooltip2(): number {
        return this.tormented_soul_cast_interval;
    }
}
@registerModifier()
export class modifier_imba_leshrac_lightning_storm_tormented_mark extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/hero/leshrac/leshrac_lightning_storm_tormented_mark.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerAbility()
export class imba_leshrac_pulse_nova extends BaseAbility_Plus {
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("radius") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_imba_leshrac_pulse_nova_radius");
    }
    OnUpgrade(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let ability_tormented_soul = "imba_leshrac_tormented_soul_form";
        if (caster.HasAbility(ability_tormented_soul)) {
            let ability_tormented_soul_handle = caster.FindAbilityByName(ability_tormented_soul);
            if (ability_tormented_soul_handle) {
                ability_tormented_soul_handle.SetLevel(ability_tormented_soul_handle.GetLevel() + 1);
            }
        }
    }
    OnToggle(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let cast_sound = "Hero_Leshrac.Pulse_Nova";
        let modifier_nova = "modifier_imba_leshrac_pulse_nova";
        let state = ability.GetToggleState();
        if (state) {
            caster.AddNewModifier(caster, ability, modifier_nova, {});
        } else {
            caster.RemoveModifierByName(modifier_nova);
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_unique_imba_leshrac_pulse_nova_radius") && !this.GetCasterPlus().HasModifier("modifier_modifier_special_bonus_unique_imba_leshrac_pulse_nova_radius")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_unique_imba_leshrac_pulse_nova_radius"), "modifier_special_bonus_unique_imba_leshrac_pulse_nova_radius", {});
        }
    }
}
@registerModifier()
export class modifier_imba_leshrac_pulse_nova extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public sound_hit: any;
    public particle_hit: any;
    public modifier_ese: any;
    public modifier_tormented: any;
    public mana_cost_per_second: any;
    public radius: number;
    public damage: number;
    public interval: number;
    public nova_circulation_radius_per_hit: number;
    public nova_circulation_max_radius: number;
    public ese_debuff_duration: number;
    public tormented_soul_interval_rdct_pct: number;
    public mana_cost_per_interval: number;
    public tormented_pulse: any;
    public circulation_bonus_radius: number;
    public particle_hit_fx: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.sound_hit = "Hero_Leshrac.Pulse_Nova_Strike";
        this.particle_hit = "particles/units/heroes/hero_leshrac/leshrac_pulse_nova.vpcf";
        this.modifier_ese = "modifier_imba_leshrac_pulse_nova_earth_edict_storm_debuff";
        this.modifier_tormented = "modifier_imba_tormented_soul_form";
        this.mana_cost_per_second = this.ability.GetSpecialValueFor("mana_cost_per_second");
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.damage = this.ability.GetSpecialValueFor("damage");
        this.interval = this.ability.GetSpecialValueFor("interval");
        this.nova_circulation_radius_per_hit = this.ability.GetSpecialValueFor("nova_circulation_radius_per_hit");
        this.nova_circulation_max_radius = this.ability.GetSpecialValueFor("nova_circulation_max_radius");
        this.ese_debuff_duration = this.ability.GetSpecialValueFor("ese_debuff_duration");
        this.tormented_soul_interval_rdct_pct = this.ability.GetSpecialValueFor("tormented_soul_interval_rdct_pct");
        if (this.caster.HasTalent("special_bonus_unique_imba_leshrac_pulse_nova_radius")) {
            this.radius = this.radius + this.caster.GetTalentValue("special_bonus_unique_imba_leshrac_pulse_nova_radius");
        }
        this.mana_cost_per_interval = this.mana_cost_per_second * this.interval;
        if (IsServer()) {
            this.tormented_pulse = false;
            if (this.caster.HasModifier(this.modifier_tormented)) {
                this.tormented_pulse = true;
            }
            let actual_interval = this.interval;
            if (this.tormented_pulse) {
                actual_interval = actual_interval * (1 - (this.tormented_soul_interval_rdct_pct * 0.01));
            }
            this.circulation_bonus_radius = 0;
            this.OnIntervalThink();
            this.StartIntervalThink(actual_interval);
        }
    }
    OnIntervalThink(tormented_radius = 0): void {
        if (!IsServer()) {
            return;
        }
        let tormented_cast = false;
        if (tormented_radius) {
            tormented_cast = true;
        }
        if (this.caster.GetMana() < this.mana_cost_per_interval) {
            this.ability.ToggleAbility();
        }
        this.caster.SpendMana(this.mana_cost_per_interval, this.ability);
        let actual_radius = this.radius + this.circulation_bonus_radius;
        if (tormented_cast) {
            actual_radius = actual_radius * tormented_radius;
        }
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, actual_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        let damage = this.damage;
        if (this.caster.HasTalent("special_bonus_unique_imba_leshrac_pulse_nova_damage")) {
            damage = damage + this.caster.GetTalentValue("special_bonus_unique_imba_leshrac_pulse_nova_damage") * GameFunc.GetCount(enemies);
        }
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            EmitSoundOn(this.sound_hit, enemy);
            this.particle_hit_fx = ResHelper.CreateParticleEx(this.particle_hit, ParticleAttachment_t.PATTACH_ABSORIGIN, enemy, this.caster);
            ParticleManager.SetParticleControl(this.particle_hit_fx, 0, enemy.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle_hit_fx, 1, Vector(1, 0, 0));
            ParticleManager.ReleaseParticleIndex(this.particle_hit_fx);
            let damageTable;
            if (tormented_cast) {
                damageTable = {
                    victim: enemy,
                    attacker: this.caster,
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    ability: this.ability
                }
            } else {
                damageTable = {
                    victim: enemy,
                    attacker: this.caster,
                    damage: damage,
                    damage_type: this.ability.GetAbilityDamageType(),
                    ability: this.ability
                }
            }
            ApplyDamage(damageTable);
            if (!enemy.HasModifier(this.modifier_ese)) {
                enemy.AddNewModifier(this.caster, this.ability, this.modifier_ese, {
                    duration: this.ese_debuff_duration
                });
            }
            let modifier_ese_handle = enemy.FindModifierByName(this.modifier_ese);
            if (modifier_ese_handle) {
                modifier_ese_handle.IncrementStackCount();
                modifier_ese_handle.ForceRefresh();
            }
            this.circulation_bonus_radius = this.circulation_bonus_radius + this.nova_circulation_radius_per_hit;
            if (this.circulation_bonus_radius >= this.nova_circulation_max_radius) {
                this.circulation_bonus_radius = this.nova_circulation_max_radius;
            }
        }
        if (this.caster.HasModifier(this.modifier_tormented) != this.tormented_pulse) {
            let actual_interval = this.interval;
            if (this.caster.HasModifier(this.modifier_tormented)) {
                this.tormented_pulse = true;
                actual_interval = actual_interval * (1 - (this.tormented_soul_interval_rdct_pct * 0.01));
            } else {
                this.tormented_pulse = false;
            }
            this.StartIntervalThink(actual_interval);
        }
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_leshrac/leshrac_pulse_nova_ambient.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_leshrac_pulse_nova_earth_edict_storm_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public ability_earth: any;
    public ability_edict: any;
    public ability_storm: any;
    public ese_stacks_threshold: number;
    public ese_earth_proc_chance: number;
    public ese_earth_radius: number;
    public ese_edict_proc_chance: number;
    public ese_edict_exp_count: number;
    public ese_storm_proc_chance: number;
    public ese_storm_jumps: any;
    public ese_earth_current_proc: any;
    public ese_edict_current_proc: any;
    public ese_storm_current_proc: any;
    public last_chosen_effect: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.ability_earth = "imba_leshrac_split_earth";
        this.ability_edict = "imba_leshrac_diabolic_edict";
        this.ability_storm = "imba_leshrac_lightning_storm";
        this.ese_stacks_threshold = this.ability.GetSpecialValueFor("ese_stacks_threshold");
        this.ese_earth_proc_chance = this.ability.GetSpecialValueFor("ese_earth_proc_chance");
        this.ese_earth_radius = this.ability.GetSpecialValueFor("ese_earth_radius");
        this.ese_edict_proc_chance = this.ability.GetSpecialValueFor("ese_edict_proc_chance");
        this.ese_edict_exp_count = this.ability.GetSpecialValueFor("ese_edict_exp_count");
        this.ese_storm_proc_chance = this.ability.GetSpecialValueFor("ese_storm_proc_chance");
        this.ese_storm_jumps = this.ability.GetSpecialValueFor("ese_storm_jumps");
        if (this.caster.HasTalent("special_bonus_unique_imba_leshrac_pulse_nova_ese_threshold")) {
            this.ese_stacks_threshold = this.caster.GetTalentValue("special_bonus_unique_imba_leshrac_pulse_nova_ese_threshold");
        }
        this.ese_earth_current_proc = this.ese_earth_proc_chance;
        this.ese_edict_current_proc = this.ese_edict_proc_chance;
        this.ese_storm_current_proc = this.ese_storm_proc_chance;
        this.last_chosen_effect = undefined;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.ese_stacks_threshold;
    }
    OnStackCountChanged(prev_stacks: number): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetStackCount() < this.ese_stacks_threshold) {
            return;
        }
        this.SetStackCount(0);
        let result = RandomInt(1, 100);
        if (result <= this.ese_earth_current_proc) {
            this.ProcSplitEarth();
            this.CutChosenEffect("earth");
        } else if (result <= this.ese_earth_current_proc + this.ese_edict_current_proc) {
            this.ProcDiabolicEdict();
            this.CutChosenEffect("edict");
        } else {
            this.ProcStormLightning();
            this.CutChosenEffect("storm");
        }
    }
    CutChosenEffect(chosen_effect: string) {
        if (!IsServer()) {
            return;
        }
        if (!this.last_chosen_effect || chosen_effect != this.last_chosen_effect) {
            this.ese_earth_current_proc = this.ese_earth_proc_chance;
            this.ese_edict_current_proc = this.ese_edict_proc_chance;
            this.ese_storm_current_proc = this.ese_storm_proc_chance;
        }
        this.last_chosen_effect = chosen_effect;
        let stored_value;
        if (chosen_effect == "earth") {
            stored_value = this.ese_earth_current_proc / 2 / 2;
            this.ese_earth_current_proc = this.ese_earth_current_proc / 2;
            this.ese_edict_current_proc = this.ese_edict_current_proc + stored_value;
            this.ese_storm_current_proc = this.ese_storm_current_proc + stored_value;
        } else if (chosen_effect == "edict") {
            stored_value = this.ese_edict_current_proc / 2 / 2;
            this.ese_earth_current_proc = this.ese_earth_current_proc + stored_value;
            this.ese_edict_current_proc = this.ese_edict_current_proc / 2;
            this.ese_storm_current_proc = this.ese_storm_current_proc + stored_value;
        } else {
            stored_value = this.ese_storm_current_proc / 2 / 2;
            this.ese_earth_current_proc = this.ese_earth_current_proc + stored_value;
            this.ese_edict_current_proc = this.ese_edict_current_proc + stored_value;
            this.ese_storm_current_proc = this.ese_storm_current_proc / 2;
        }
    }
    ProcSplitEarth() {
        if (!IsServer()) {
            return;
        }
        if (this.caster.HasAbility(this.ability_earth)) {
            let ability_earth_handle = this.caster.FindAbilityByName(this.ability_earth) as imba_leshrac_split_earth;
            if (ability_earth_handle && ability_earth_handle.GetLevel() > 0) {
                ability_earth_handle.OnSpellStart(this.parent.GetAbsOrigin(), this.ese_earth_radius);
            }
        }
    }
    ProcDiabolicEdict() {
        if (!IsServer()) {
            return;
        }
        if (this.caster.HasAbility(this.ability_edict)) {
            let ability_edict_handle = this.caster.FindAbilityByName(this.ability_edict) as imba_leshrac_diabolic_edict;
            if (ability_edict_handle && ability_edict_handle.GetLevel() > 0) {
                ability_edict_handle.OnSpellStart(this.parent, this.ese_edict_exp_count);
            }
        }
    }
    ProcStormLightning() {
        if (!IsServer()) {
            return;
        }
        if (this.caster.HasAbility(this.ability_storm)) {
            let ability_storm_handle = this.caster.FindAbilityByName(this.ability_storm) as imba_leshrac_lightning_storm;
            if (ability_storm_handle && ability_storm_handle.GetLevel() > 0) {
                ability_storm_handle.OnSpellStart(this.parent, this.ese_storm_jumps);
            }
        }
    }
}
@registerAbility()
export class imba_leshrac_tormented_soul_form extends BaseAbility_Plus {
    IsInnateAbility() {
        return true;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetManaCost(level: number): number {
        let caster = this.GetCasterPlus();
        let ability = this;
        let max_hp_mp_cost_pct = ability.GetSpecialValueFor("max_hp_mp_cost_pct");
        let mana_cost = caster.GetMaxMana() * max_hp_mp_cost_pct * 0.01;
        return mana_cost;
    }
    OnSpellStart(): void {
        if (IsClient()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let cast_sound = "Hero_Leshrac.Split_Earth.Tormented";
        let modifier_buff = "modifier_imba_tormented_soul_form";
        let max_hp_mp_cost_pct = ability.GetSpecialValueFor("max_hp_mp_cost_pct");
        let duration = ability.GetSpecialValueFor("duration");
        if (caster.HasTalent("special_bonus_unique_imba_leshrac_tormented_soul_form_duration")) {
            duration = duration + caster.GetTalentValue("special_bonus_unique_imba_leshrac_tormented_soul_form_duration");
        }
        EmitSoundOn(cast_sound, caster);
        let damage = caster.GetMaxHealth() * max_hp_mp_cost_pct * 0.01;
        let damageTable = {
            victim: caster,
            attacker: caster,
            damage: damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_DAMAGE_MULTIPLIERS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_BYPASSES_INVULNERABILITY,
            ability: ability
        }
        ApplyDamage(damageTable);
        caster.AddNewModifier(caster, ability, modifier_buff, {
            duration: duration
        });
        this.TormentedSplitEarthCast();
        this.TormentedDiabolicEdict();
        this.TormentedLightningStorm();
        this.TormentedPulseNova();
    }
    TormentedSplitEarthCast() {
        let caster = this.GetCasterPlus();
        let ability = this;
        let ability_split = "imba_leshrac_split_earth";
        let ability_split_handle;
        if (caster.HasAbility(ability_split)) {
            ability_split_handle = caster.FindAbilityByName(ability_split);
            if (ability_split_handle) {
                if (!ability_split_handle.IsCooldownReady()) {
                    let total_cooldown = ability_split_handle.GetCooldown(ability_split_handle.GetLevel());
                    let remaining_cooldown = ability_split_handle.GetCooldownTimeRemaining();
                    if (remaining_cooldown <= total_cooldown) {
                        ability_split_handle.EndCooldown();
                    } else {
                        ability_split_handle.EndCooldown();
                        ability_split_handle.StartCooldown(remaining_cooldown - total_cooldown);
                    }
                }
            }
        }
    }
    TormentedDiabolicEdict() {
        let caster = this.GetCasterPlus();
        let ability = this;
        let ability_diabolic = "imba_leshrac_diabolic_edict";
        let modifier_diabolic = "modifier_imba_leshrac_diabolic_edict";
        if (!caster.HasModifier(modifier_diabolic)) {
            return;
        }
        if (caster.HasAbility(ability_diabolic)) {
            let ability_diabolic_handle = caster.FindAbilityByName(ability_diabolic);
            let modifier_diabolic_handle = caster.FindModifierByName(modifier_diabolic) as modifier_imba_leshrac_diabolic_edict;
            if (ability_diabolic_handle && modifier_diabolic_handle) {
                let tormented_soul_cast_exp_count = ability_diabolic_handle.GetSpecialValueFor("tormented_soul_cast_exp_count");
                let tormented_soul_cast_exp_delay = ability_diabolic_handle.GetSpecialValueFor("tormented_soul_cast_exp_delay");
                let radius = ability_diabolic_handle.GetSpecialValueFor("radius");
                if (tormented_soul_cast_exp_count && tormented_soul_cast_exp_delay) {
                    let fired_explosions = 0;
                    this.AddTimer(0, () => {
                        if (!caster.HasModifier(modifier_diabolic)) {
                            return;
                        }
                        modifier_diabolic_handle.OnIntervalThink();
                        fired_explosions = fired_explosions + 1;
                        if (fired_explosions < tormented_soul_cast_exp_count) {
                            return tormented_soul_cast_exp_delay;
                        } else {
                            return;
                        }
                    });
                }
            }
        }
    }
    TormentedLightningStorm() {
        let caster = this.GetCasterPlus();
        let ability = this;
        let ability_lightning = "imba_leshrac_lightning_storm";
        let modifier_storm_cloud = "modifier_imba_leshrac_lightning_storm_tormented_cloud_aura";
        if (caster.HasAbility(ability_lightning)) {
            let ability_lightning_handle = caster.FindAbilityByName(ability_lightning);
            if (ability_lightning_handle) {
                let tormented_soul_cast_duration = ability_lightning_handle.GetSpecialValueFor("tormented_soul_cast_duration");
                if (tormented_soul_cast_duration) {
                    CreateModifierThinker(caster, ability_lightning_handle, modifier_storm_cloud, {
                        duration: tormented_soul_cast_duration
                    }, caster.GetAbsOrigin(), caster.GetTeamNumber(), false);
                }
            }
        }
    }
    TormentedPulseNova() {
        let caster = this.GetCasterPlus();
        let ability = this;
        let ability_nova = "imba_leshrac_pulse_nova";
        let modifier_nova = "modifier_imba_leshrac_pulse_nova";
        if (!caster.HasModifier(modifier_nova)) {
            return;
        }
        if (caster.HasAbility(ability_nova)) {
            let ability_nova_handle = caster.FindAbilityByName(ability_nova);
            let modifier_nova_handle = caster.FindModifierByName(modifier_nova) as modifier_imba_leshrac_pulse_nova;
            if (ability_nova_handle && modifier_nova_handle) {
                let tormented_soul_cast_range_mult = ability_nova_handle.GetSpecialValueFor("tormented_soul_cast_range_mult");
                modifier_nova_handle.OnIntervalThink(tormented_soul_cast_range_mult);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_tormented_soul_form extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public particle_buff: any;
    public particle_totalsteal: any;
    public totalsteal_convertion_pct: number;
    public max_hp_mp_cost_pct: number;
    public particle_buff_fx: any;
    public max_hp_reduction: any;
    public max_mp_reduction: any;
    public adjusted_health: any;
    public adjusted_mana: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.particle_buff = "particles/hero/leshrac/leshrac_tormented_soulrocks.vpcf";
        this.particle_totalsteal = "particles/hero/leshrac/totalsteal_lifesteal.vpcf";
        this.totalsteal_convertion_pct = this.ability.GetSpecialValueFor("totalsteal_convertion_pct");
        this.max_hp_mp_cost_pct = this.ability.GetSpecialValueFor("max_hp_mp_cost_pct");
        if (this.caster.HasTalent("special_bonus_unique_imba_leshrac_tormented_soul_form_totalsteal")) {
            this.totalsteal_convertion_pct = this.totalsteal_convertion_pct + this.caster.GetTalentValue("special_bonus_unique_imba_leshrac_tormented_soul_form_totalsteal");
        }
        if (IsServer()) {
            this.particle_buff_fx = ResHelper.CreateParticleEx(this.particle_buff, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.caster, this.caster);
            ParticleManager.SetParticleControl(this.particle_buff_fx, 0, this.caster.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle_buff_fx, 5, this.caster.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle_buff_fx, 6, this.caster.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle_buff_fx, 7, Vector(1, 0, 0));
            this.AddParticle(this.particle_buff_fx, false, false, -1, false, false);
            this.max_hp_reduction = this.caster.GetMaxHealth() * this.max_hp_mp_cost_pct * 0.01;
            this.max_mp_reduction = this.caster.GetMaxMana() * this.max_hp_mp_cost_pct * 0.01;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_MANA_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.totalsteal_convertion_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS)
    CC_GetModifierExtraHealthBonus(): number {
        if (!IsServer()) {
            return;
        }
        return this.max_hp_reduction * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_MANA_BONUS)
    CC_GetModifierExtraManaBonus(): number {
        if (!IsServer()) {
            return;
        }
        return this.max_mp_reduction * (-1);
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.caster && keys.unit.GetTeamNumber() != this.caster.GetTeamNumber()) {
            let damage = keys.damage;
            let replenish = damage * this.totalsteal_convertion_pct * 0.01;
            let particle_totalsteal_fx = ResHelper.CreateParticleEx(this.particle_totalsteal, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.caster, this.caster);
            ParticleManager.SetParticleControl(particle_totalsteal_fx, 0, this.caster.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(particle_totalsteal_fx);
            this.caster.Heal(replenish, this.GetAbilityPlus());
            this.caster.GiveMana(replenish);
        }
    }
    OnRemoved(): void {
        if (!IsServer()) {
            return;
        }
        let current_health_pct = this.caster.GetHealthPercent();
        let current_mana_pct = this.caster.GetManaPercent();
        this.adjusted_health = (this.caster.GetMaxHealth() + this.max_hp_reduction) * current_health_pct * 0.01;
        this.adjusted_mana = (this.caster.GetMaxMana() + this.max_mp_reduction) * current_mana_pct * 0.01;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.caster.SetHealth(this.adjusted_health);
        this.caster.SetMana(this.adjusted_mana);
    }
}
@registerModifier()
export class modifier_special_bonus_unique_imba_leshrac_empowered_split_earth_duration extends BaseModifier_Plus {
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
export class modifier_special_bonus_unique_imba_leshrac_pulse_nova_damage extends BaseModifier_Plus {
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
export class modifier_special_bonus_unique_imba_leshrac_lightning_storm_duration extends BaseModifier_Plus {
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
export class modifier_special_bonus_unique_imba_leshrac_tormented_soul_form_duration extends BaseModifier_Plus {
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
export class modifier_special_bonus_unique_imba_leshrac_pulse_nova_radius extends BaseModifier_Plus {
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
export class modifier_special_bonus_unique_imba_leshrac_diabolic_edict_explosions extends BaseModifier_Plus {
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
export class modifier_special_bonus_unique_imba_leshrac_tormented_soul_form_totalsteal extends BaseModifier_Plus {
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
export class modifier_special_bonus_unique_imba_leshrac_pulse_nova_ese_threshold extends BaseModifier_Plus {
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
