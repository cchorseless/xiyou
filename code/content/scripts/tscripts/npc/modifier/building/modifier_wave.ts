import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

@registerModifier()
export class modifier_wave extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_SUPER_ULTRA
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            if (params.PhysicalArmor != null) {
                this.PhysicalArmor = params.PhysicalArmor;
            }
            if (params.MagicalArmor != null) {
                this.MagicalArmor = params.MagicalArmor;
            }
            if (params.Hp != null) {
                this.Hp = params.Hp;
            }
            if (params.Mp != null) {
                this.Mp = params.Mp;
            }
            this.SetHasCustomTransmitterData(true)
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE)
    public PhysicalArmor: number = 0;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BASE)
    public MagicalArmor: number = 0;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS)
    public Hp: number = 0;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    public Mp: number = 0;

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            // [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true
        }
    }

    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE)
    // GetModelScale() {
    //     if (IsServer()) {
    //         let hParent = this.GetParentPlus()
    //         if (hParent._round_type == "basic") {
    //             return RemapValClamped(CandyMode.GetCandy(hParent._iSpawnerPlayerID), 0, 200, 0, 100)
    //         }
    //     }
    // }
}