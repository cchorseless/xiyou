import { KVHelper } from "../../helper/KVHelper";
import { GameEnum } from "../../shared/GameEnum";
import { BaseModifier_Plus, registerProp } from "../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../entityPlus/Base_Plus";

/**信使 */
@registerModifier()
export class modifier_courier extends BaseModifier_Plus {
    IsHidden() {
        return true;
    }
    IsDebuff() {
        return false;
    }
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }
    AllowIllusionDuplicate() {
        return false;
    }
    RemoveOnDeath() {
        return false;
    }

    GetCourierName() {
        return this.sCourierName
    }
    sCourierName: string;
    model: string;
    fModelScale: number;
    iSkin: number;
    ambientModifiers: string;
    addAbilityName: string;
    OnCreated(params: ModifierTable) {
        super.OnCreated(params)
        if (IsServer()) {
            let sCourierName = params.courier_name
            this.sCourierName = sCourierName
            this.fModelScale = KVHelper.CourierUnits.GetCourierModelScale(sCourierName)
            this.model = KVHelper.CourierUnits.GetCourierModel(sCourierName)
            this.iSkin = KVHelper.CourierUnits.GetCourierSkin(sCourierName)
            this.ambientModifiers = KVHelper.CourierUnits.GetCourierAmbientEffect(sCourierName)
            this.addAbilityName = KVHelper.CourierUnits.GetCourierAbility(sCourierName)
            this.SetStackCount(KVHelper.CourierUnits.GetCourierVisualZDelta(sCourierName))
            this.StartIntervalThink(0)
        }
    }
    OnDestroy() {
        super.OnDestroy()
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            hParent.SetSkin(0);
            if (this.ambientModifiers && this.ambientModifiers.length > 0) {
                hParent.removeBuff(this.ambientModifiers);
            }
            if (this.addAbilityName && this.addAbilityName.length > 0) {
                hParent.removeAbilityPlus(this.addAbilityName)
            }

        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            hParent.SetSkin(this.iSkin)
            if (this.ambientModifiers && this.ambientModifiers.length > 0) {
                hParent.addBuff(this.ambientModifiers, hParent)
            }
            if (this.addAbilityName && this.addAbilityName.length > 0) {
                hParent.addAbilityPlus(this.addAbilityName)
            }
            this.StartIntervalThink(-1)
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MODEL_CHANGE)
    CC_GetModelChange(params: ModifierTable) {
        return this.model;
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MODEL_SCALE)
    CC_GetModelScale(params: ModifierTable) {
        return (this.fModelScale - 1) * 100
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.VISUAL_Z_DELTA)
    CC_GetVisualZDelta(params: ModifierTable) {
        return this.GetStackCount()
    }
}