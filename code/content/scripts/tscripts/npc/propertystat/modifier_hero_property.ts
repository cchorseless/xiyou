import { KVHelper } from "../../helper/KVHelper"
import { BuildingConfig } from "../../shared/BuildingConfig"
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
    BeCreated(params: IModifierTable) {
        let unitname = this.GetParentPlus().GetUnitName();
        let str_AttributePrimary = KVHelper.GetUnitData(unitname, "AttributePrimary");
        str_AttributePrimary = str_AttributePrimary || "DOTA_ATTRIBUTE_INVALID";
        if (str_AttributePrimary == "DOTA_ATTRIBUTE_STRENGTH") {
            this.AttributePrimary = Attributes.DOTA_ATTRIBUTE_STRENGTH;
        }
        else if (str_AttributePrimary == "DOTA_ATTRIBUTE_AGILITY") {
            this.AttributePrimary = Attributes.DOTA_ATTRIBUTE_AGILITY;
        }
        else if (str_AttributePrimary == "DOTA_ATTRIBUTE_INTELLECT") {
            this.AttributePrimary = Attributes.DOTA_ATTRIBUTE_INTELLECT;
        }
        else {
            this.AttributePrimary = Attributes.DOTA_ATTRIBUTE_INVALID;
        }
        this.AttributeBaseStrength = GToNumber(KVHelper.GetUnitData(unitname, "AttributeBaseStrength"));
        this.AttributeBaseAgility = GToNumber(KVHelper.GetUnitData(unitname, "AttributeBaseAgility"));
        this.AttributeBaseIntelligence = GToNumber(KVHelper.GetUnitData(unitname, "AttributeBaseIntelligence"));
        this.AttributeStrengthGain = GToNumber(KVHelper.GetUnitData(unitname, "AttributeStrengthGain"));
        this.AttributeAgilityGain = GToNumber(KVHelper.GetUnitData(unitname, "AttributeAgilityGain"));
        this.AttributeIntelligenceGain = GToNumber(KVHelper.GetUnitData(unitname, "AttributeIntelligenceGain"));
        if (IsServer()) {
            this.SetPrimaryStat(this.AttributePrimary);
            // this.CalculatePrimaryStat();
            // GTimerHelper.AddTimer(0.1, GHandler.create(this, () => {
            //     this.CalculatePrimaryStat()
            //     return 0.1
            // }))
        }
    }
    AttributePrimary: number;
    AttributeBaseStrength: number = 0;
    AttributeBaseAgility: number = 0;
    AttributeBaseIntelligence: number = 0;
    AttributeStrengthGain: number = 0;
    AttributeAgilityGain: number = 0;
    AttributeIntelligenceGain: number = 0;

    private forceSetAttributes: Attributes = Attributes.DOTA_ATTRIBUTE_INVALID;
    CalculatePrimaryStat() {
        if (IsServer()) {
            let hParent = this.GetParentPlus();
            if (!IsValid(hParent)) {
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
    public BeDestroy(): void {
        if (this.StackCountHandler) {
            this.StackCountHandler.recover();
            this.StackCountHandler = null;
        }
    }
    /**每升一星获取的等级数 */
    LevelPerStar = 5;

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BASE)
    CC_STATS_STRENGTH_BASE() {
        let parent = this.GetParentPlus()
        // let star = parent.GetStar() - 1;
        // star = star > 0 ? star : 0;
        return (parent.GetLevel() + 0 * this.LevelPerStar) * this.AttributeStrengthGain
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BASE)
    CC_STATS_AGILITY_BASE() {
        let parent = this.GetParentPlus()
        // let star = parent.GetStar() - 1;
        // star = star > 0 ? star : 0;
        return (parent.GetLevel() + 0 * this.LevelPerStar) * this.AttributeAgilityGain
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BASE)
    CC_STATS_INTELLECT_BASE() {
        let parent = this.GetParentPlus()
        // let star = parent.GetStar() - 1;
        // star = star > 0 ? star : 0;
        return (parent.GetLevel() + 0 * this.LevelPerStar) * this.AttributeIntelligenceGain
    }

    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.LIFESTEAL_PERCENTAGE)
    // CC_LIFESTEAL_PERCENTAGE() {
    //     return 150
    // }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage(params: IModifierTable) {
        // 升星加成
        let iStackCount = this.GetStackCount()
        let starBonus = this.GetStarUpBouns(iStackCount);
        if (iStackCount == Attributes.DOTA_ATTRIBUTE_STRENGTH) {
            return (GPropertyCalculate.GetStrength(this.GetParentPlus()) + starBonus) * GPropertyConfig.ATTRIBUTE_PRIMARY_ATTACK_DAMAGE
        }
        else if (iStackCount == Attributes.DOTA_ATTRIBUTE_AGILITY) {
            return (GPropertyCalculate.GetAgility(this.GetParentPlus()) + starBonus) * GPropertyConfig.ATTRIBUTE_PRIMARY_ATTACK_DAMAGE
        }
        else if (iStackCount == Attributes.DOTA_ATTRIBUTE_INTELLECT) {
            return (GPropertyCalculate.GetIntellect(this.GetParentPlus()) + starBonus) * GPropertyConfig.ATTRIBUTE_PRIMARY_ATTACK_DAMAGE
        }
        return 0;
    }

    GetStarUpBouns(attr: Attributes, factor = 8) {
        let parent = this.GetParentPlus();
        let star = parent.GetStar();
        star = star > 0 ? star : 0;
        star = star == BuildingConfig.MAX_STAR ? (star) : math.max(star - 1, 0);
        let starBonus = 0;
        if (attr == Attributes.DOTA_ATTRIBUTE_STRENGTH) {
            starBonus = (this.AttributeStrengthGain * factor) * star;
        }
        else if (attr == Attributes.DOTA_ATTRIBUTE_AGILITY) {
            starBonus = (this.AttributeAgilityGain * factor) * star;
        }
        else if (attr == Attributes.DOTA_ATTRIBUTE_INTELLECT) {
            starBonus = (this.AttributeIntelligenceGain * factor) * star;
        }
        return starBonus;
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_HP_BONUS() {
        // 升星加成
        let parent = this.GetParentPlus();
        let strengthbouns = this.GetStarUpBouns(Attributes.DOTA_ATTRIBUTE_STRENGTH);
        return (GPropertyCalculate.GetStrength(parent) + strengthbouns) * GPropertyConfig.ATTRIBUTE_STRENGTH_HP_BONUS
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_HEALTH_REGEN_CONSTANT() {
        return GPropertyCalculate.GetStrength(this.GetParentPlus()) * GPropertyConfig.ATTRIBUTE_STRENGTH_HEALTH_REGEN_CONSTANT;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_STATUS_RESISTANCE() {
        let iStackCount = this.GetStackCount()
        if (iStackCount == Attributes.DOTA_ATTRIBUTE_STRENGTH) {
            return GPropertyCalculate.GetStrength(this.GetParentPlus()) * GPropertyConfig.ATTRIBUTE_STRENGTH_STATUS_RESISTANCE
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE)
    CC_PHYSICAL_ARMOR_BASE() {
        return GPropertyCalculate.GetAgility(this.GetParentPlus()) * GPropertyConfig.ATTRIBUTE_AGILITY_PHYSICAL_ARMOR_BASE;
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_ATTACKSPEED_BONUS_CONSTANT() {
        return GPropertyCalculate.GetAgility(this.GetParentPlus()) * GPropertyConfig.ATTRIBUTE_AGILITY_ATTACK_SPEED;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS,)
    CC_GetModifierMaximumAttackSpeedBonus() {
        let iStackCount = this.GetStackCount()
        if (iStackCount == Attributes.DOTA_ATTRIBUTE_AGILITY) {
            return GPropertyCalculate.GetStrength(this.GetParentPlus()) * GPropertyConfig.ATTRIBUTE_AGILITY_MAX_ATTACK_SPEED
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,)
    CC_GetModifierConstantManaRegen() {
        return GPropertyCalculate.GetIntellect(this.GetParentPlus()) * GPropertyConfig.ATTRIBUTE_INTELLECT_MANA_REGEN;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE,)
    CC_GetModifierPercentageCooldown() {
        let coodown = GPropertyCalculate.GetIntellect(this.GetParentPlus()) * GPropertyConfig.ATTRIBUTE_INTELLECT_COOLDOWN_REDUCTION;
        return math.min(GPropertyConfig.ATTRIBUTE_INTELLECT_MAX_CD, (1 - math.pow(1 - GPropertyConfig.ATTRIBUTE_INTELLECT_COOLDOWN_REDUCTION, coodown)) * 100) || 0
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_SPELL_AMPLIFY_BASE(params: IModifierTable) {
        let iStackCount = this.GetStackCount()
        if (iStackCount == Attributes.DOTA_ATTRIBUTE_INTELLECT) {
            return GPropertyCalculate.GetIntellect(this.GetParentPlus()) * GPropertyConfig.ATTRIBUTE_INTELLECT_SPELL_AMPLIFY
        }
    }
    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ALL_DAMAGE_PERCENTAGE)
    // CC_GetModifierOutgoingAllDamagePercentage(params: IModifierTable) {
    //     return (this.GetStackCount() == Attributes.DOTA_ATTRIBUTE_STRENGTH) && GFuncMath.Clamp(Gmodifier_property.GetStrength(this.GetParentPlus()) * Gmodifier_property.ATTRIBUTE_STRENGTH_ALL_DAMAGE, 0, Gmodifier_property.ATTRIBUTE_STRENGTH_ALL_DAMAGE_MAX) || 0
    // }
    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    // CC_GetModifierManaBonus(params: IModifierTable) {
    //     return Gmodifier_property.GetIntellect(this.GetParentPlus()) * Gmodifier_property.ATTRIBUTE_INTELLECT_MANA || 0
    // }



}

declare global {
    type Imodifier_hero_property = modifier_hero_property;
}