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
    sModelName: string;
    fModelScale: number;
    iSkin: number;
    OnCreated(params: ModifierTable) {
        super.OnCreated(params)
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let sCourierName = params.courier_name || "courier_1"
            this.sCourierName = sCourierName
            this.sModelName = KVHelper.CourierUnits.GetCourierModel(sCourierName)
            this.fModelScale = KVHelper.CourierUnits.GetCourierModelScale(sCourierName)
            this.iSkin = KVHelper.CourierUnits.GetCourierSkin(sCourierName)
            this.fVisualZDelta = KVHelper.CourierUnits.GetCourierVisualZDelta(sCourierName)
            this.SetStackCount(this.fVisualZDelta)
            this.StartIntervalThink(0)
        }
    }
    OnDestroy() {
        super.OnDestroy()
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            hParent.SetSkin(0)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hParent = this.GetParentPlus()

            hParent.SetSkin(this.iSkin)

            this.StartIntervalThink(-1)
        }
    }
    //     DeclareFunctions() {
    //         if (IsServer()) {
    //             return {
    // 			@registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MODEL_SCALE,
    // 			@registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.VISUAL_Z_DELTA,
    // 		}
    //     }
    // return {
    // 		@registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.VISUAL_Z_DELTA,
    // 	}
    // }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MODEL_CHANGE)
    CC_GetModelChange(params: ModifierTable) {
        return this.sModelName
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