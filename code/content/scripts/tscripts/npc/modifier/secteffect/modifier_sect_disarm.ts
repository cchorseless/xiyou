import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_sect_effect_base } from "./modifier_sect_effect_base";



@registerModifier()
export class modifier_sect_disarm_base_a extends modifier_sect_effect_base {

    chance_pect: number;
    duration: number;

    Init() {
        let parent = this.GetParentPlus();
        // "particles/sect/sect_warpath/1.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx("particles/econ/courier/courier_trail_earth/courier_trail_earth.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        this.chance_pect = this.getSpecialData("chance_pect");
        this.duration = this.getSpecialData("duration");

    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACKED)
    CC_ON_ATTACKED(keys: ModifierAttackEvent) {
        if (!IsServer()) { return }
        let parent = this.GetParentPlus();
        let attacker = keys.attacker;
        if (keys.target == parent) {
            if (GFuncRandom.PRD(this.chance_pect, this)) {
                if (IsValid(attacker) && attacker.IsAlive()) {
                    modifier_sect_disarm_stoned.apply(attacker, parent, null, {
                        duration: this.duration
                    })
                }
            }
        }
    }

}
@registerModifier()
export class modifier_sect_disarm_base_b extends modifier_sect_disarm_base_a {
    Init() {
        let parent = this.GetParentPlus();
        // "particles/sect/sect_warpath/1.vpcf"
        this.chance_pect = this.getSpecialData("chance_pect");
        this.duration = this.getSpecialData("duration");
    }
}
@registerModifier()
export class modifier_sect_disarm_base_c extends modifier_sect_disarm_base_a {
    Init() {
        let parent = this.GetParentPlus();
        // "particles/sect/sect_warpath/1.vpcf"
        this.chance_pect = this.getSpecialData("chance_pect");
        this.duration = this.getSpecialData("duration");
    }
}

@registerModifier()
export class modifier_sect_disarm_stoned extends BaseModifier_Plus {

    public Init(params?: IModifierTable): void {
    }

    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_medusa/medusa_stone_gaze_debuff_stoned.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_medusa_stone_gaze.vpcf";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_FROZEN]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }

}