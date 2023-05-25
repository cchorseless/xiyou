import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_sect_effect_base } from "./modifier_sect_effect_base";



@registerModifier()
export class modifier_sect_double_head_base_a extends modifier_sect_effect_base {
    chance_pect: number;
    extra_time: number;
    Init() {
        let parent = this.GetParentPlus();
        this.chance_pect = this.getSpecialData("chance_pect");
        this.extra_time = this.getSpecialData("extra_time");
        // 全队需要额外加上这个buff
        modifier_sect_double_head_particle.applyOnly(parent, parent)
    }
    castrecord: { [key: string]: number } = {};

    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_ON_ABILITY_FULLY_CAST(params: ModifierAbilityEvent): void {
        if (!IsServer()) {
            return
        }
        let parent = this.GetParentPlus();
        let ability = params.ability;
        let lefttime = this.castrecord[ability.GetEntityIndex() + ""]
        if (lefttime != null) {
            ability.EndCooldown();
            if (ability.GetManaCost(ability.GetLevel()) > 0) {
                ability.RefundManaCost();
                // parent.SetMana(parent.GetMana() + ability.GetManaCost(ability.GetLevel()));
            }
            lefttime--;
            if (lefttime <= 0) {
                delete this.castrecord[ability.GetEntityIndex() + ""];
            }
            else {
                this.castrecord[ability.GetEntityIndex() + ""] = lefttime;
            }
        }
        else {
            if (GFuncRandom.PRD(this.chance_pect, this)) {
                this.castrecord[ability.GetEntityIndex() + ""] = this.extra_time;
                ability.EndCooldown();
                if (ability.GetManaCost(ability.GetLevel()) > 0) {
                    ability.RefundManaCost();
                    // parent.SetMana(parent.GetMana() + ability.GetManaCost(ability.GetLevel()));
                }
            }
        }

    }



}
@registerModifier()
export class modifier_sect_double_head_base_b extends modifier_sect_double_head_base_a {
}
@registerModifier()
export class modifier_sect_double_head_base_c extends modifier_sect_double_head_base_a {
}

@registerModifier()
export class modifier_sect_double_head_particle extends BaseModifier_Plus {
    buff_fx: ParticleID;
    Init() {
        let parent = this.GetParentPlus();
        // "particles/sect/sect_warpath/1.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_double_head/sect_double_head1.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        ParticleManager.SetParticleControl(this.buff_fx, 0, parent.GetAbsOrigin());
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }

    public BeDestroy(): void {
        if (this.buff_fx) {
            ParticleManager.ClearParticle(this.buff_fx, true);
            this.buff_fx = null;
        }
    }
}