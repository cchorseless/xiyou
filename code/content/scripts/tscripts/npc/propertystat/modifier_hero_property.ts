import { GameFunc } from "../../GameFunc"
import { BaseModifier_Plus, registerProp } from "../entityPlus/BaseModifier_Plus"
import { registerModifier } from "../entityPlus/Base_Plus"

@registerModifier()
export class modifier_hero_property extends BaseModifier_Plus {

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
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    DestroyOnExpire() {
        return false
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params)
        if (IsServer()) {
            this.CalculatePrimaryStat();
            GTimerHelper.AddTimer(0.1, GHandler.create(this, () => {
                this.CalculatePrimaryStat()
                return 0.1
            }))
        }
    }

    forceSetAttributes: Attributes = Attributes.DOTA_ATTRIBUTE_INVALID;
    CalculatePrimaryStat() {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            if (!GameFunc.IsValid(hParent)) {
                return
            }
            if (this.forceSetAttributes != Attributes.DOTA_ATTRIBUTE_INVALID) {
                this.SetStackCount(this.forceSetAttributes)
            }
            else {
                let tStats = {
                    [Attributes.DOTA_ATTRIBUTE_STRENGTH + ""]: GPropertyCalculate.GetStrengthWithoutPrimaryStat(hParent),
                    [Attributes.DOTA_ATTRIBUTE_AGILITY + ""]: GPropertyCalculate.GetAgilityWithoutPrimaryStat(hParent),
                    [Attributes.DOTA_ATTRIBUTE_INTELLECT + ""]: GPropertyCalculate.GetIntellectWithoutPrimaryStat(hParent),
                }
                const keys = Object.keys(tStats);
                keys.sort((a, b) => {
                    return tStats[b] - tStats[a];
                })
                this.SetStackCount(GToNumber(keys[0]));
            }
        }
    }
    StackCountHandler: IGHandler;
    OnStackCountChanged(iOldStackCount: number) {
        let iStackCount = this.GetStackCount()
        if (iStackCount != iOldStackCount) {
            if (this.StackCountHandler) {
                this.StackCountHandler.runWith([iStackCount]);
            }
        }
    }
    /**
     * @Both
     * @param attr 
     */
    SetPrimaryStat(attr: Attributes) {
        if (IsServer()) {
            this.forceSetAttributes = attr;
            this.CalculatePrimaryStat()
        }
    }
    public OnDestroy(): void {
        super.OnDestroy();
        if (this.StackCountHandler) {
            this.StackCountHandler.recover();
            this.StackCountHandler = null;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.LIFESTEAL_PERCENTAGE)
    CC_LIFESTEAL_PERCENTAGE() {
        return 150
    }
    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    // CC_GetModifierBaseAttack_BonusDamage(params: IModifierTable) {
    //     // return Gmodifier_property.GetStrength(this.GetParentPlus()) * Gmodifier_property.ATTRIBUTE_STRENGTH_ATTACK_DAMAGE
    //     return 20
    // }

    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ENERGY_REGEN_PERCENTAGE)
    // CC_GetModifierEnergyRegenPercentage(params: IModifierTable) {
    //     return (this.GetStackCount() == Attributes.DOTA_ATTRIBUTE_STRENGTH) && Gmodifier_property.GetStrength(this.GetParentPlus()) * Gmodifier_property.ATTRIBUTE_STRENGTH_ENERGY_GET || 0
    // }
    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ALL_DAMAGE_PERCENTAGE)
    // CC_GetModifierOutgoingAllDamagePercentage(params: IModifierTable) {
    //     return (this.GetStackCount() == Attributes.DOTA_ATTRIBUTE_STRENGTH) && GameFunc.mathUtil.Clamp(Gmodifier_property.GetStrength(this.GetParentPlus()) * Gmodifier_property.ATTRIBUTE_STRENGTH_ALL_DAMAGE, 0, Gmodifier_property.ATTRIBUTE_STRENGTH_ALL_DAMAGE_MAX) || 0
    // }
    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    // CC_GetModifierManaBonus(params: IModifierTable) {
    //     return Gmodifier_property.GetIntellect(this.GetParentPlus()) * Gmodifier_property.ATTRIBUTE_INTELLECT_MANA || 0
    // }

    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,)
    // CC_GetModifierConstantManaRegen(params: IModifierTable) {
    //     return (this.GetStackCount() == Attributes.DOTA_ATTRIBUTE_INTELLECT) && (Gmodifier_property.GetIntellect(this.GetParentPlus()) * Gmodifier_property.ATTRIBUTE_INTELLECT_MANA_REGEN) || 0
    // }
    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE,)
    // CC_GetModifierPercentageCooldown(params: IModifierTable) {
    //     return (this.GetStackCount() == Attributes.DOTA_ATTRIBUTE_INTELLECT) && math.min(Gmodifier_property.ATTRIBUTE_INTELLECT_MAX_CD, (1 - math.pow(1 - Gmodifier_property.ATTRIBUTE_INTELLECT_COOLDOWN_REDUCTION * 0.01, Gmodifier_property.GetIntellect(this.GetParentPlus()))) * 100) || 0
    // }
    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS,)
    // CC_GetModifierMaximumAttackSpeedBonus() {
    //     return (this.GetStackCount() == Attributes.DOTA_ATTRIBUTE_AGILITY) && Gmodifier_property.GetAgility(this.GetParentPlus()) * Gmodifier_property.ATTRIBUTE_AGILITY_MAX_ATTACK_SPEED || 0
    // }
}