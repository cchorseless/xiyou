import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_combination_effect } from "./modifier_combination_effect";



@registerModifier()
export class modifier_sect_summon_base_a extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_life_stealer/life_stealer_infested_unit.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        let summon_atk_pect = this.getSpecialData("summon_atk_pect")
        let summon_hp_pect = this.getSpecialData("summon_hp_pect")
        let summon_atkspeed_pect = this.getSpecialData("summon_atkspeed_pect")
        let t = parent.TempData().sect_summon || { summon_atk_pect: 0, summon_hp_pect: 0, summon_atkspeed_pect: 0 };
        t.summon_atk_pect += summon_atk_pect;
        t.summon_hp_pect += summon_hp_pect;
        t.summon_atkspeed_pect += summon_atkspeed_pect;
        parent.TempData().sect_summon = t;

    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_SPAWN_SUMMONNED)
    CC_ON_SPAWN_SUMMONNED(e: ModifierInstanceEvent) {
        let parent = this.GetParentPlus();
        let summon = e.unit;
        if (IsValid(summon)) {
            modifier_sect_summon_buff_active.apply(summon, parent)
        }
    }

}
@registerModifier()
export class modifier_sect_summon_base_b extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        let summon_atk_pect = this.getSpecialData("summon_atk_pect")
        let summon_hp_pect = this.getSpecialData("summon_hp_pect")
        let summon_atkspeed_pect = this.getSpecialData("summon_atkspeed_pect")
        let t = parent.TempData().sect_summon || { summon_atk_pect: 0, summon_hp_pect: 0, summon_atkspeed_pect: 0 };
        t.summon_atk_pect += summon_atk_pect;
        t.summon_hp_pect += summon_hp_pect;
        t.summon_atkspeed_pect += summon_atkspeed_pect;
        parent.TempData().sect_summon = t;
    }
}
@registerModifier()
export class modifier_sect_summon_base_c extends modifier_sect_summon_base_b {

}


@registerModifier()
export class modifier_sect_summon_buff_active extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_PERCENTAGE)
    summon_atk_pect: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_PERCENTAGE)
    summon_hp_pect: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_PERCENTAGE)
    summon_atkspeed_pect: number;

    buff_fx: ParticleID
    Init() {
        let parent = this.GetParentPlus();
        let caster = this.GetCasterPlus();
        // "particles/sect/sect_warpath/1.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_warpath/sect_warpath1.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        let t = caster.TempData().sect_summon || { summon_atk_pect: 0, summon_hp_pect: 0, summon_atkspeed_pect: 0 };
        this.summon_atk_pect = t.summon_atk_pect;
        this.summon_hp_pect = t.summon_hp_pect;
        this.summon_atkspeed_pect = t.summon_atkspeed_pect;
    }


    public BeDestroy(): void {
        if (this.buff_fx) {
            ParticleManager.ClearParticle(this.buff_fx, true)
        }
    }
}