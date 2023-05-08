
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../entityPlus/Base_Plus";



// 治疗流
@registerAbility()
export class ability_sect_treatment extends BaseAbility_Plus {


    GetAOERadius(): number {
        return this.radius;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        let rare_cast_response = "omniknight_omni_ability_purif_03";
        let target_cast_response = {
            "1": "omniknight_omni_ability_purif_01",
            "2": "omniknight_omni_ability_purif_02",
            "3": "omniknight_omni_ability_purif_04",
            "4": "omniknight_omni_ability_purif_05",
            "5": "omniknight_omni_ability_purif_06",
            "6": "omniknight_omni_ability_purif_07",
            "7": "omniknight_omni_ability_purif_08"
        }
        let self_cast_response = {
            "1": "omniknight_omni_ability_purif_01",
            "2": "omniknight_omni_ability_purif_05",
            "3": "omniknight_omni_ability_purif_06",
            "4": "omniknight_omni_ability_purif_07",
            "5": "omniknight_omni_ability_purif_08"
        }
        let sound_cast = "Hero_Omniknight.Purification";
        if (caster == target) {
            if (RollPercentage(50)) {
                EmitSoundOn(GFuncRandom.RandomValue(self_cast_response), caster);
            }
        } else {
            if (RollPercentage(5)) {
                EmitSoundOn(rare_cast_response, caster);
            } else if (RollPercentage(50)) {
                EmitSoundOn(GFuncRandom.RandomValue(target_cast_response), caster);
            }
        }
        EmitSoundOn(sound_cast, caster);
        this.Purification(target);

    }
    radius = 275;
    Purification(target: IBaseNpc_Plus) {
        let particle_cast = "particles/units/heroes/hero_omniknight/omniknight_purification_cast.vpcf";
        let particle_aoe = "particles/units/heroes/hero_omniknight/omniknight_purification.vpcf";
        let particle_hit = "particles/units/heroes/hero_omniknight/omniknight_purification_hit.vpcf";
        let caster = this.GetCasterPlus();
        let t = caster.TempData().sect_treatment || { heal_amount: 0, damage_amount: 0 };
        let heal_amount = t.heal_amount;
        let damage_amount = t.damage_amount;
        let radius = this.radius;
        let particle_cast_fx = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
        ParticleManager.SetParticleControlEnt(particle_cast_fx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(particle_cast_fx, 1, target.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(particle_cast_fx);
        let particle_aoe_fx = ResHelper.CreateParticleEx(particle_aoe, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        ParticleManager.SetParticleControl(particle_aoe_fx, 0, target.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_aoe_fx, 1, Vector(radius, 1, 1));
        ParticleManager.ReleaseParticleIndex(particle_aoe_fx);
        target.ApplyHeal(heal_amount, this);
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!enemy.IsMagicImmune()) {
                let damageTable = {
                    victim: enemy,
                    attacker: caster,
                    damage: damage_amount,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    ability: this
                }
                ApplyDamage(damageTable);
                let particle_hit_fx = ResHelper.CreateParticleEx(particle_hit, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy);
                ParticleManager.SetParticleControlEnt(particle_hit_fx, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(particle_hit_fx, 1, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                ParticleManager.SetParticleControl(particle_hit_fx, 3, Vector(radius, 0, 0));
                ParticleManager.ReleaseParticleIndex(particle_hit_fx);
            }
        }
    }


    AutoSpellSelf(): boolean {
        let caster = this.GetCasterPlus();
        if (caster.HasCiTiao(this.GetSectCiTiaoName("a"))) {
            return AI_ability.TARGET_if_friend(this, null, (u) => { return u.GetHealthLosePect() > 10 })
        }
        return false;
    }
}


