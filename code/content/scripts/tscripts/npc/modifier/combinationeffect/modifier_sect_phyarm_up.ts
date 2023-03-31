import { ResHelper } from "../../../helper/ResHelper";
import { registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";


@registerModifier()
export class modifier_sect_phyarm_up_base_a extends modifier_combination_effect {

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    phyarm: number;

    Init(kv: any) {
        let parent = this.GetParentPlus();
        this.phyarm = this.getSpecialData("phyarm");
        // "particles/sect/sect_phyarm_up/sect_phyarm_up1.vpcf"
        // this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_sven/sven_warcry_buff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_phyarm_up/sect_phyarm_up1.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // ParticleManager.SetParticleControlEnt(this.buff_fx, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, undefined, parent.GetAbsOrigin(), true);
        // ParticleManager.SetParticleControlEnt(this.buff_fx, 1, parent, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, undefined, parent.GetAbsOrigin(), true);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }
}
@registerModifier()
export class modifier_sect_phyarm_up_base_b extends modifier_combination_effect {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    phyarm: number;
    Init(kv: any) {
        this.phyarm = this.getSpecialData("phyarm");
    }
}
@registerModifier()
export class modifier_sect_phyarm_up_base_c extends modifier_combination_effect {
    baseatk_per_phyarm: number = 0;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    phyarm: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetAtkBouns() {
        return this.baseatk_per_phyarm * this.GetParentPlus().GetPhysicalArmorValue(false);
    }
    Init(kv: any) {
        this.phyarm = this.getSpecialData("phyarm");
        this.baseatk_per_phyarm = this.getSpecialData("baseatk_per_phyarm");
    }
}
