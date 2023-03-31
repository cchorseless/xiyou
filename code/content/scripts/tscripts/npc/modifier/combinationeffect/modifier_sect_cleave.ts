import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_combination_effect } from "./modifier_combination_effect";

@registerModifier()
export class modifier_sect_cleave_base_a extends modifier_combination_effect {
    Init() {
        let cleave_damage_pct = this.getSpecialData("cleave_damage_pct");
        let cleave_damage_ranged = this.getSpecialData("cleave_damage_ranged");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_cleave || { cleave_damage_pct: 0, cleave_damage_ranged: 0 };
        t.cleave_damage_pct += cleave_damage_pct;
        t.cleave_damage_ranged += cleave_damage_ranged;
        parent.TempData().sect_cleave = t;
        this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_magnataur/magnataur_empower.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, parent);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        EmitSoundOn("Hero_Magnataur.Empower.Target", parent);
    }
    cleave_radius_start: number = 150;
    cleave_radius_end: number = 360;
    cleave_distance: number = 650;
    splash_radius: number = 360;
    bonus_damage_pct: number = 30;

    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    // CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
    //     return this.bonus_damage_pct;
    // }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            let parent = this.GetParentPlus();
            if (params.attacker == parent && (!parent.IsIllusion()) && params.attacker.GetTeamNumber() != params.target.GetTeamNumber()) {
                let cleave_particle = "particles/units/heroes/hero_magnataur/magnataur_empower_cleave_effect.vpcf";
                let splash_particle = "particles/hero/magnataur/magnataur_empower_splash.vpcf";
                let cleave_splash_particle = "particles/hero/magnataur/magnataur_empower_cleave_splash_effect.vpcf";
                let t = parent.TempData().sect_cleave || { cleave_damage_pct: 0, cleave_damage_ranged: 0 };
                let cleave_damage_pct = t.cleave_damage_pct;
                let cleave_damage_ranged = t.cleave_damage_ranged;
                if (params.attacker.IsRangedAttacker()) {
                    let splash_radius = this.splash_radius;
                    let enemies = parent.FindUnitsInRadiusPlus(splash_radius, params.target.GetAbsOrigin(), null, null, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES);
                    for (const [_, enemy] of GameFunc.iPair(enemies)) {
                        if (enemy != params.target && !enemy.IsAttackImmune()) {
                            ApplyDamage({
                                attacker: params.attacker,
                                victim: enemy,
                                ability: ability,
                                damage: (params.damage * cleave_damage_ranged),
                                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
                            });
                        }
                    }
                    let cleave_pfx = ResHelper.CreateParticleEx(splash_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, params.target);
                    ParticleManager.SetParticleControl(cleave_pfx, 0, params.target.GetAbsOrigin());
                    ParticleManager.SetParticleControl(cleave_pfx, 1, Vector(splash_radius, 0, 0));
                    ParticleManager.ReleaseParticleIndex(cleave_pfx);
                }
                else {
                    let cleave_radius_start = this.cleave_radius_start;
                    let cleave_radius_end = this.cleave_radius_end;
                    let cleave_distance = this.cleave_distance;
                    let cleave_splash_pfx = ResHelper.CreateParticleEx(cleave_splash_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, params.target);
                    ParticleManager.SetParticleControl(cleave_splash_pfx, 0, params.target.GetAbsOrigin());
                    ParticleManager.SetParticleControl(cleave_splash_pfx, 1, Vector(cleave_distance, 0, 0));
                    ParticleManager.ReleaseParticleIndex(cleave_splash_pfx);
                    DoCleaveAttack(params.attacker, params.target, ability, (params.damage * cleave_damage_pct), cleave_radius_start, cleave_radius_end, cleave_distance, cleave_particle);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_sect_cleave_base_b extends modifier_combination_effect {
    cleave_damage_pct: number = 20;
    cleave_damage_ranged: number = 20;
    Init() {
        this.cleave_damage_pct = this.getSpecialData("cleave_damage_pct");
        this.cleave_damage_ranged = this.getSpecialData("cleave_damage_ranged");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_cleave || { cleave_damage_pct: 0, cleave_damage_ranged: 0 };
        t.cleave_damage_pct += this.cleave_damage_pct;
        t.cleave_damage_ranged += this.cleave_damage_ranged;
        parent.TempData().sect_cleave = t;
    }
}
@registerModifier()
export class modifier_sect_cleave_base_c extends modifier_sect_cleave_base_b {
}