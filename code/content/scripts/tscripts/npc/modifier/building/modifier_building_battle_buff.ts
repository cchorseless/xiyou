import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

@registerModifier()
export class modifier_building_battle_buff extends BaseModifier_Plus {
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }

    IsHidden(): boolean {
        return true;
    }


    CheckState() {
        // 有这个BUFF不能选中
        let state = {
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_PASSIVES_DISABLED]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            // [modifierstate.MODIFIER_STATE_UNSELECTABLE]: iscanselect,
        };
        return state
    }

    isMoveFinished: boolean = false;
    old_pos: Vector;
    public Init(params?: object): void {
        let hParent = this.GetParentPlus();
        let particle = ResHelper.CreateParticleEx("particles/generic_hero_status/status_invisibility_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
        ParticleManager.ReleaseParticleIndex(particle);
        if (IsServer()) {
            let hParent = this.GetParentPlus();
            if (IsValid(hParent) && hParent.ETRoot) {
                let buldingroot = (hParent.ETRoot as IBuildingEntityRoot);
                if (buldingroot.IsBuilding() && buldingroot.WearableComp()) {
                    buldingroot.WearableComp().AddDrawEffect(false)
                }
            }
        }

    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        return 5;
    }

    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_SUPER_ULTRA;
    }
    BeDestroy(): void {
        if (IsServer()) {
            let hParent = this.GetParentPlus();
            if (IsValid(hParent) && hParent.ETRoot) {
                let buldingroot = (hParent.ETRoot as IBuildingEntityRoot);
                if (buldingroot.IsBuilding() && buldingroot.WearableComp()) {
                    buldingroot.WearableComp().AddDrawEffect(true)
                }
            }
        }
    }
}
