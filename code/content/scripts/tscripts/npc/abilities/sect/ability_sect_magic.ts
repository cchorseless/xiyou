
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { EnemyConfig } from "../../../shared/EnemyConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

// 法师流
@registerAbility()
export class ability_sect_magic extends BaseAbility_Plus {

    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let cast_sound = "Hero_Leshrac.Diabolic_Edict_lp";
        let modifier_diabolic = "modifier_ability_sect_magic_diabolic_edict";
        let duration = 10;
        this.GetCasterPlus().EmitSound(cast_sound);
        this.GetCasterPlus().AddNewModifier(caster, this, modifier_diabolic, {
            duration: duration
        });
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        let caster = this.GetCasterPlus();
        if (caster.HasCiTiao(this.GetSectCiTiaoName("a"))) {
            return AI_ability.NO_TARGET_if_enemy(this)
        }
        return false;

    }
}
@registerModifier()
export class modifier_ability_sect_magic_diabolic_edict extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public hit_sound: string;
    public particle_explosion: string;
    public particle_ring: string;
    public particle_hit: string;
    public num_explosions: number;
    public radius: number;
    public tower_bonus: number;
    public damage: number;
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
        if (!IsServer()) {
            return;
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.hit_sound = "Hero_Leshrac.Diabolic_Edict";
        this.particle_explosion = "particles/hero/leshrac/leshrac_diabolic_edict.vpcf";
        this.particle_ring = "particles/hero/leshrac/leshrac_purity_casing_ring.vpcf";
        this.particle_hit = "particles/hero/leshrac/leshrac_purity_casing_hit.vpcf";
        this.radius = this.ability.GetCastRangePlus();
        let t = this.caster.TempData().sect_magic || {
            damage: 0,
            extra_damage_pect: 0,
            count: 0,
        };
        this.tower_bonus = t.extra_damage_pect;
        this.damage = t.damage;
        this.num_explosions = t.count;
        this.StartIntervalThink(0.2);
        if (this.caster.HasCiTiao(this.ability.GetSectCiTiaoName("c"))) {
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.radius, this.GetAbilityPlus().GetAbilityTargetTeam(), this.GetAbilityPlus().GetAbilityTargetType(), DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
            let t = this.caster.TempData().sect_magic || {
                ice_duration: 1,
            };
            for (let enemy of enemies) {
                if (enemy) {
                    modifier_ability_sect_magic_enemy_ice.apply(enemy, this.caster, this.ability, {
                        duration: t.ice_duration
                    });
                }
            }

        }
    }



    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.radius, this.GetAbilityPlus().GetAbilityTargetTeam(), this.GetAbilityPlus().GetAbilityTargetType(), DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
        if (enemies.length > this.num_explosions) {
            enemies = GFuncRandom.RandomArray(enemies, this.num_explosions);
        }
        for (let enemy of enemies) {
            if (enemy) {
                this.DiabolicEditExplosion(enemy);
            } else {
                this.DiabolicEditExplosion(undefined);
            }
        }
    }
    DiabolicEditExplosion(target: IBaseNpc_Plus) {
        let pfx = ResHelper.CreateParticleEx(this.particle_explosion, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined, this.caster);
        let position_cast: Vector;
        if (target) {
            position_cast = target.GetAbsOrigin();
            let damage = this.damage;
            if (target.GetUnitLabel() == EnemyConfig.EEnemyUnitType.Tower) {
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
            ParticleManager.SetParticleControlEnt(pfx, 1, target, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(pfx, 2, Vector(math.max(100, RandomInt(50, 100)), 0, 0));

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

    }
}

@registerModifier()
export class modifier_ability_sect_magic_enemy_ice extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/units/heroes/hero_crystalmaiden/maiden_frostbite_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_INVISIBLE]: false
        };
    }

    public Init(params?: IModifierTable): void {
        if (IsServer()) {
            this.GetParentPlus().EmitSound("Hero_Crystal.Frostbite");
        }
    }
}