
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_mantle extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_mantle";
    }
}
@registerModifier()
export class modifier_imba_mantle extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public bonus_int: number;
    public magical_damage: number;
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
        this.bonus_int = this.ability.GetSpecialValueFor("bonus_int");
        this.magical_damage = this.ability.GetSpecialValueFor("magical_damage");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_MAGICAL
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.bonus_int;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_MAGICAL)
    CC_GetModifierProcAttack_BonusDamage_Magical(keys: ModifierAttackEvent): number {
        if (IsServer()) {
            if (this.GetParentPlus().FindAllModifiersByName(this.GetName())[0] == this) {
                let target = keys.target;
                if (this.ability.IsCooldownReady()) {
                    this.ability.UseResources(false, false, true);
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, target, this.magical_damage, undefined);
                    return this.magical_damage;
                }
                return undefined;
            }
        }
    }
}
