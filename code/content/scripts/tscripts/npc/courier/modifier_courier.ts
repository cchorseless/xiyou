import { KVHelper } from "../../helper/KVHelper";
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
    zOffset: number = 1;
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let sCourierName = params.courier_name
            this.sCourierName = sCourierName
            this.fModelScale = KVHelper.CourierUnits.GetCourierModelScale(sCourierName)
            this.model = KVHelper.CourierUnits.GetCourierModel(sCourierName)
            this.iSkin = KVHelper.CourierUnits.GetCourierSkin(sCourierName)
            this.ambientModifiers = KVHelper.CourierUnits.GetCourierAmbientEffect(sCourierName)
            this.addAbilityName = KVHelper.CourierUnits.GetCourierAbility(sCourierName)
            this.zOffset = KVHelper.CourierUnits.GetCourierVisualZDelta(sCourierName);
            this.StartIntervalThink(0);
            let parent = this.GetParentPlus() as IBaseNpc_Hero_Plus;
            parent.GetBonusManaRegen();
        }
    }
    BeDestroy() {

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

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    CC_GetModelChange(params: IModifierTable) {
        return this.model;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE)
    CC_GetModelScale(params: IModifierTable) {
        return (this.fModelScale - 1) * 100
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA)
    CC_GetVisualZDelta(params: IModifierTable) {
        return this.zOffset
    }
    /**让气血恢复=0 */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_HEALTH_REGEN_CONSTANT(params: IModifierTable) {
        return -10000
    }

    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    // CC_MANA_REGEN_CONSTANT(params: IModifierTable) {
    //     return -10000
    // }


}