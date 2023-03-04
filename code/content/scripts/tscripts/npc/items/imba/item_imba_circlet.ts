
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_circlet extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_circlet";
    }
}
@registerModifier()
export class modifier_imba_circlet extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public bonus_all_stats: number;
    public hidden_pwr_stat_bonus: number;
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.bonus_all_stats = this.ability.GetSpecialValueFor("bonus_all_stats");
        this.hidden_pwr_stat_bonus = this.ability.GetSpecialValueFor("hidden_pwr_stat_bonus");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        let strength = this.bonus_all_stats;
        if (this.caster.GetPrimaryAttribute() == Attributes.DOTA_ATTRIBUTE_STRENGTH) {
            strength = strength + this.hidden_pwr_stat_bonus;
        }
        return strength;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        let agility = this.bonus_all_stats;
        if (this.caster.GetPrimaryAttribute() == Attributes.DOTA_ATTRIBUTE_AGILITY) {
            agility = agility + this.hidden_pwr_stat_bonus;
        }
        return agility;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        let int = this.bonus_all_stats;
        if (this.caster.GetPrimaryAttribute() == Attributes.DOTA_ATTRIBUTE_INTELLECT) {
            int = int + this.hidden_pwr_stat_bonus;
        }
        return int;
    }
}
