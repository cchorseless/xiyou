import { ResHelper } from "../../../helper/ResHelper";
import { registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_combination_effect } from "./modifier_combination_effect";


@registerModifier()
export class modifier_sect_warpath_base_a extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        // "particles/sect/sect_warpath/1.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_warpath/sect_warpath1.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        this.atk_bonus_pect = this.getSpecialData("atk_bonus_pect");
        EmitSoundOn("hero_bloodseeker.bloodRage", parent);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_PERCENTAGE)
    atk_bonus_pect: number;

    @registerEvent(Enum_MODIFIER_EVENT.ON_SPAWN_SUMMONNED)
    CC_ON_SPAWN_SUMMONNED(e: ModifierInstanceEvent) {
        let parent = this.GetParentPlus();
        let summon = e.unit;
        if (IsValid(summon)) {
            modifier_sect_warpath_base_a.apply(summon, parent)
        }
    }
}



@registerModifier()
export class modifier_sect_warpath_base_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_base_c extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        // "particles/sect/sect_warpath/1.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_ursa/ursa_fury_swipes_debuff.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }
}

