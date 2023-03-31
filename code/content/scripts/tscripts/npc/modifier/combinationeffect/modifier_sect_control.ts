import { GameFunc } from "../../../GameFunc";
import { AoiHelper } from "../../../helper/AoiHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_combination_effect } from "./modifier_combination_effect";



@registerModifier()
export class modifier_sect_control_base_a extends modifier_combination_effect {
    Init() {
        let duration = this.getSpecialData("duration");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_control || { duration: 0 };
        t.duration += duration;
        parent.TempData().sect_control = t;
        // this.buff_fx = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_silenced.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        // this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus()) {
            let t = this.GetParentPlus().TempData().sect_control || { duration: 1 };
            BaseModifier_Plus.CreateBuffThinker(this.GetParentPlus(), null,
                "modifier_sect_control_tidehunter_ravage_thinker", t,
                this.GetParentPlus().GetAbsOrigin(), this.GetParentPlus().GetTeamNumber(), false)
        }
    }
}
@registerModifier()
export class modifier_sect_control_base_b extends modifier_combination_effect {
    Init() {
        let duration = this.getSpecialData("duration");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_control || { duration: 0 };
        t.duration += duration;
        parent.TempData().sect_control = t;
        // this.buff_fx = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_silenced.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        // this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }
}
@registerModifier()
export class modifier_sect_control_base_c extends modifier_sect_control_base_b {
}


@registerModifier()
export class modifier_sect_control_tidehunter_ravage_thinker extends BaseModifier_Plus {

    public Init(params?: IModifierTable): void {
        let parent = this.GetParentPlus();
        let caster_pos = parent.GetAbsOrigin();
        if (!IsServer()) {
            return
        }
        let cast_sound = "Ability.Ravage";
        let hit_sound = "Hero_Tidehunter.RavageDamage";
        let particle = "particles/units/heroes/hero_tidehunter/tidehunter_spell_ravage.vpcf";
        let end_radius = 1250;
        EmitSoundOn(cast_sound, parent);
        let particle_fx = ResHelper.CreateParticleEx(particle, ParticleAttachment_t.PATTACH_ABSORIGIN, parent);
        ParticleManager.SetParticleControl(particle_fx, 0, caster_pos);
        for (let i = 0; i < 5; i++) {
            ParticleManager.SetParticleControl(particle_fx, i, Vector(end_radius * 0.2 * i, 0, 0));
        }
        ParticleManager.ReleaseParticleIndex(particle_fx);
        let radius = end_radius * 0.2;
        let ring = 1;
        let hit_units: IBaseNpc_Plus[] = []
        this.AddTimer(0.1, () => {
            let enemies = AoiHelper.FindUnitsInRing(parent.GetTeamNumber(), caster_pos, undefined, ring * radius, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!hit_units.includes(enemy)) {
                    enemy.EmitSound(hit_sound);
                    enemy.ApplyStunned(null, parent, this.GetDuration());
                    let knockback = {
                        knockback_duration: 0.5 * (1 - enemy.GetStatusResistance()),
                        duration: 0.5 * (1 - enemy.GetStatusResistance()),
                        knockback_distance: 0,
                        knockback_height: 350
                    }
                    enemy.RemoveModifierByName("modifier_knockback");
                    enemy.AddNewModifier(parent, null, "modifier_knockback", knockback);
                    hit_units.push(enemy);
                }
            }
            if (ring < 5) {
                ring = ring + 1;
                return 0.2;
            }
        });
    }
}