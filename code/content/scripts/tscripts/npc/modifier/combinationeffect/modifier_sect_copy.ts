import { ResHelper } from "../../../helper/ResHelper";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_combination_effect } from "./modifier_combination_effect";



@registerModifier()
export class modifier_sect_copy_base_a extends modifier_combination_effect {

    Init() {
        let damage = this.getSpecialData("damage");
        let copy_pect = this.getSpecialData("copy_pect");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_copy || { damage: 0, copy_pect: 0 };
        t.damage += damage;
        t.copy_pect += copy_pect;
        parent.TempData().sect_copy = t;
        // this.buff_fx = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_silenced.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        // this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }
    // @registerEvent(Enum_MODIFIER_EVENT.ON_SPAWN_ILLUSION)
    // CC_ON_SPAWN_ILLUSION(keys: ModifierInstanceEvent): void {
    //     if (!IsServer()) { return }
    //     let parent = this.GetParentPlus();
    //     if (!GFuncEntity.IsValid(parent)) { return }
    //     GLogHelper.print("CC_ON_SPAWN_ILLUSION ", parent.GetUnitName(), keys.unit.GetUnitName(), keys.unit.GetEntityIndex())
    // }

    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH_ILLUSION)
    CC_ON_DEATH_ILLUSION(keys: ModifierInstanceEvent): void {
        if (!IsServer()) { return }
        let parent = this.GetParentPlus();
        if (!GFuncEntity.IsValid(parent)) { return }
        let t = parent.TempData().sect_copy || { damage: 0, copy_pect: 0 };
        let particle_blast = "particles/sect/sect_copy/sect_copy2.vpcf"
        let particle_blast_fx = ResHelper.CreateParticleEx(particle_blast, ParticleAttachment_t.PATTACH_ABSORIGIN, keys.unit);
        ParticleManager.SetParticleControl(particle_blast_fx, 0, keys.unit.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_blast_fx, 1, Vector(400, 0, 0));
        ParticleManager.ReleaseParticleIndex(particle_blast_fx);
        let units = keys.unit.FindUnitsInRadiusPlus(400);
        units.forEach(unit => {
            ApplyDamage({
                victim: unit,
                attacker: parent,
                damage: t.damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: null,
            })
        });
        if (GFuncRandom.PRD(t.copy_pect, this)) {
            parent.CreateIllusion(parent, {
                duration: 10,
                outgoing_damage: 100,
                incoming_damage: 100,
            }, 1, keys.unit.GetAbsOrigin())
        }
    }

}
@registerModifier()
export class modifier_sect_copy_base_b extends modifier_combination_effect {
    Init() {
        let damage = this.getSpecialData("damage");
        let copy_pect = this.getSpecialData("copy_pect");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_copy || { damage: 0, copy_pect: 0 };
        t.damage += damage;
        t.copy_pect += copy_pect;
        parent.TempData().sect_copy = t;
        // this.buff_fx = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_silenced.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        // this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }
}
@registerModifier()
export class modifier_sect_copy_base_c extends modifier_sect_copy_base_b {

}