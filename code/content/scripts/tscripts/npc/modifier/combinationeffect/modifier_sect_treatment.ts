import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";



@registerModifier()
export class modifier_sect_treatment_base_a extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        this.buff_fx = ResHelper.CreateParticleEx("particles/econ/items/huskar/huskar_ti8/huskar_ti8_shoulder_heal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        let health_regen = this.getSpecialData("health_regen");
        let damage_per_sec = this.getSpecialData("damage_per_sec");
        let damage_maxhp_pect = this.getSpecialData("damage_maxhp_pect");
        let t = parent.TempData().sect_treatment || { health_regen: 0, damage_per_sec: 0, damage_maxhp_pect: 0 };
        t.health_regen += health_regen;
        t.damage_per_sec += damage_per_sec;
        t.damage_maxhp_pect += damage_maxhp_pect;
        parent.TempData().sect_treatment = t;
        modifier_sect_treatment_radiance_aura.applyOnly(parent, parent)
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_HEALTH_REGEN_CONSTANT() {
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_treatment || { health_regen: 0 };
        return t.health_regen;
    }
}

@registerModifier()
export class modifier_sect_treatment_base_b extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        let health_regen = this.getSpecialData("health_regen");
        let damage_per_sec = this.getSpecialData("damage_per_sec");
        let damage_maxhp_pect = this.getSpecialData("damage_maxhp_pect");
        let t = parent.TempData().sect_treatment || { health_regen: 0, damage_per_sec: 0, damage_maxhp_pect: 0 };
        t.health_regen += health_regen;
        t.damage_per_sec += damage_per_sec;
        t.damage_maxhp_pect += damage_maxhp_pect;
        parent.TempData().sect_treatment = t;
    }

}

@registerModifier()
export class modifier_sect_treatment_base_c extends modifier_sect_treatment_base_b {
}

@registerModifier()
export class modifier_sect_treatment_radiance_aura extends BaseModifier_Plus {
    IsAura(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_sect_treatment_radiance_burn";
    }
    GetAuraRadius(): number {
        return 500;
    }
}
@registerModifier()
export class modifier_sect_treatment_radiance_burn extends BaseModifier_Plus {
    public particle: any;
    public base_damage: number;
    public damage_maxhp_pect: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE
        });
    } */
    BeCreated(p_0: any,): void {
        let caster = this.GetCasterPlus();
        let t = caster.TempData().sect_treatment || { damage_per_sec: 0, damage_maxhp_pect: 0 };
        if (IsServer()) {
            this.particle = ResHelper.CreateParticleEx("particles/items2_fx/radiance.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
            ParticleManager.SetParticleControl(this.particle, 0, this.GetParentPlus().GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle, 1, this.GetCasterPlus().GetAbsOrigin());
            this.base_damage = t.damage_per_sec;
            this.damage_maxhp_pect = t.damage_maxhp_pect;
            this.StartIntervalThink(1);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            ParticleManager.ClearParticle(this.particle, false);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let damage = this.base_damage + this.GetParentPlus().GetHealth() * this.damage_maxhp_pect * 0.01;
            ApplyDamage({
                victim: this.GetParentPlus(),
                attacker: caster,
                ability: null,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
        }
    }
}