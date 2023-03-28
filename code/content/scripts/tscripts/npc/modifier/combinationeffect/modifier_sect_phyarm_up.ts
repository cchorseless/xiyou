import { ResHelper } from "../../../helper/ResHelper";
import { registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";


@registerModifier()
export class modifier_sect_phyarm_up_base_a extends modifier_combination_effect {
    public IsHidden(): boolean {
        return true
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    phyarm = this.getSpecialData("phyarm");

    Init(kv: any) {
        let parent = this.GetParentPlus();
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
    public IsHidden(): boolean {
        return true
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    phyarm = this.getSpecialData("phyarm");
}
@registerModifier()
export class modifier_sect_phyarm_up_base_c extends modifier_combination_effect {
    public IsHidden(): boolean {
        return true
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    phyarm = this.getSpecialData("phyarm");
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetAtkBouns() {
        return this.getSpecialData("baseatk_per_phyarm") * this.GetParentPlus().GetPhysicalArmorValue(false);
    }

}

@registerModifier()
export class modifier_sect_phyarm_up_axe_berserkers_call_b extends modifier_combination_effect {

    public Init(params?: IModifierTable): void {
        GLogHelper.print("modifier_sect_phyarm_up_axe_berserkers_call_b")
    }
}
@registerModifier()
export class modifier_sect_phyarm_up_axe_berserkers_call_c extends modifier_combination_effect {

}
@registerModifier()
export class modifier_sect_phyarm_up_chen_divine_favor_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_chen_divine_favor_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_dragon_knight_dragon_blood_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_dragon_knight_dragon_blood_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_elder_titan_ancestral_spirit_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_elder_titan_ancestral_spirit_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_monkey_king_wukongs_command_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_monkey_king_wukongs_command_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_primal_beast_uproar_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_primal_beast_uproar_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_shredder_reactive_armor_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_shredder_reactive_armor_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_slardar_sprint_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_slardar_sprint_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_sven_warcry_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_sven_warcry_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_tiny_grow_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_tiny_grow_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_treant_living_armor_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_treant_living_armor_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_troll_warlord_berserkers_rage_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_troll_warlord_berserkers_rage_c extends modifier_combination_effect {
}