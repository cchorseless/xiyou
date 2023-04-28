import { ResHelper } from "../../../helper/ResHelper";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_combination_effect } from "./modifier_combination_effect";

@registerModifier()
export class modifier_sect_phycrit_base_a extends modifier_combination_effect {
    crit_chance: number;
    crit_damage: number;
    Init() {
        let parent = this.GetParentPlus();
        "particles/econ/items/bloodseeker/bloodseeker_eztzhok_weapon/bloodseeker_bloodrage_ground_eztzhok.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx("effect/assassin_buff/econ/items/bloodseeker/bloodseeker_eztzhok_weapon/bloodseeker_bloodrage_ground_eztzhok.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        this.crit_chance = this.getSpecialData("crit_chance")
        this.crit_damage = this.getSpecialData("crit_damage")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let target = keys.target as IBaseNpc_Plus;
            let attacker = keys.attacker;
            if (attacker == this.GetParentPlus() && RollPercentage(this.crit_chance)) {
                let blood_pfx = ResHelper.CreateParticleEx("particles/hero/phantom_assassin/screen_blood_splatter.vpcf", ParticleAttachment_t.PATTACH_EYES_FOLLOW, target, attacker);
                ParticleManager.ReleaseParticleIndex(blood_pfx);
                target.EmitSound("Hero_PhantomAssassin.CoupDeGrace");
                this.GetCasterPlus().EmitSound("Imba.PhantomAssassinFatality");
                let coup_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_assassin/phantom_assassin_crit_impact.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target, attacker);
                ParticleManager.SetParticleControlEnt(coup_pfx, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                ParticleManager.SetParticleControl(coup_pfx, 1, target.GetAbsOrigin());
                ParticleManager.SetParticleControlOrientation(coup_pfx, 1, this.GetParentPlus().GetForwardVector() * (-1) as Vector, this.GetParentPlus().GetRightVector(), this.GetParentPlus().GetUpVector());
                ParticleManager.ReleaseParticleIndex(coup_pfx);
                let damage = keys.damage * this.crit_damage / 100;
                ApplyDamage({
                    victim: target,
                    attacker: this.GetParentPlus(),
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    ability: undefined,
                })
            }
        }
    }
}
@registerModifier()
export class modifier_sect_phycrit_base_b extends modifier_sect_phycrit_base_a {
}
@registerModifier()
export class modifier_sect_phycrit_base_c extends modifier_sect_phycrit_base_a {
}