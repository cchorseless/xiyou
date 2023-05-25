import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_sect_effect_base } from "./modifier_sect_effect_base";


@registerModifier()
export class modifier_sect_vanity_base_a extends modifier_sect_effect_base {

    GetStatusEffectName(): string {
        return "particles/sect/sect_vanity/sect_vanity1.vpcf";
    }
    Init() {
        let magic_arm = this.getSpecialData("magic_arm");
        let chance_pect = this.getSpecialData("chance_pect");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_vanity || { magic_arm: 0, chance_pect: 0 };
        t.magic_arm += magic_arm;
        t.chance_pect += chance_pect;
        parent.TempData().sect_vanity = t;
        this.addBuff();
        this.AddTimer(3, () => {
            this.addBuff();
            return 3
        })

    }
    addBuff() {
        let duration = this.getSpecialData("duration");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_vanity || { magic_arm: 0, chance_pect: 0 };
        if (RollPercentage(t.chance_pect)) {
            modifier_sect_vanity_black_king_bar_buff.apply(parent, parent, null, {
                duration: duration
            })
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS)
    CC_MAGICAL_ARMOR_BONUS() {
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_vanity || { magic_arm: 0 };
        return t.magic_arm;
    }
}
@registerModifier()
export class modifier_sect_vanity_base_b extends modifier_sect_effect_base {
    Init() {
        let magic_arm = this.getSpecialData("magic_arm");
        let chance_pect = this.getSpecialData("chance_pect");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_vanity || { magic_arm: 0, chance_pect: 0 };
        t.magic_arm += magic_arm;
        t.chance_pect += chance_pect;
        parent.TempData().sect_vanity = t;
    }
}
@registerModifier()
export class modifier_sect_vanity_base_c extends modifier_sect_vanity_base_b {
}

@registerModifier()
export class modifier_sect_vanity_black_king_bar_buff extends BaseModifier_Plus {
    public model_scale: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/items_fx/black_king_bar_avatar.vpcf";
    }
    BeCreated(p_0: any,): void {
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE
        }
    } */
    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE)
    // CC_GetModifierModelScale(): number {
    //     return this.model_scale;
    // }
}
