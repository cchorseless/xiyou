
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// 净化药水
@registerAbility()
export class item_imba_clarity extends BaseItem_Plus {
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        let cast_sound = "DOTA_Item.ClarityPotion.Activate";
        let modifier_regen = "modifier_imba_clarity";
        let duration = this.GetSpecialValueFor("duration");
        EmitSoundOn(cast_sound, target);
        target.AddNewModifier(caster, this, modifier_regen, {
            duration: duration
        });
        this.SpendCharge();
    }
}
@registerModifier()
export class modifier_imba_clarity extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public modifier_mana_reserves: any;
    public mana_regen: any;
    public vision_increase: any;
    public cast_range_increase: number;
    public mana_reserves_duration: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetTexture(): string {
        return "item_clarity";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.modifier_mana_reserves = "modifier_imba_clarity_mana_reserves";
        this.mana_regen = this.GetItemPlus().GetSpecialValueFor("mana_regen");
        this.vision_increase = this.GetItemPlus().GetSpecialValueFor("vision_increase");
        this.cast_range_increase = this.GetItemPlus().GetSpecialValueFor("cast_range_increase");
        this.mana_reserves_duration = this.GetItemPlus().GetSpecialValueFor("mana_reserves_duration");
        this.parent.TempData().item_clarity_mana_reserves_mana = this.GetItemPlus().GetSpecialValueFor("mana_reserves_mana");
        this.parent.TempData().item_clarity_max_mana_bonus = this.GetItemPlus().GetSpecialValueFor("max_mana_bonus");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION,
            4: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION,
            5: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        return this.mana_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS)
    CC_GetModifierCastRangeBonusStacking(p_0: ModifierAbilityEvent,): number {
        return this.cast_range_increase;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION)
    CC_GetBonusDayVision(): number {
        return this.vision_increase;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
    CC_GetBonusNightVision(): number {
        return this.vision_increase;
    }
    GetEffectName(): string {
        return "particles/items_fx/healing_clarity.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return undefined;
        }
        let attacker = keys.attacker as IBaseNpc_Plus;
        let target = keys.unit;
        let damage = keys.original_damage;
        let damage_flags = keys.damage_flags;
        if (target != this.parent) {
            return undefined;
        }
        if (damage <= 0) {
            return undefined;
        }
        if (attacker == this.parent) {
            return undefined;
        }
        if (damage_flags == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) {
            return undefined;
        }
        if ((attacker.GetTeamNumber() == target.GetOpposingTeamNumber() && attacker.IsRealUnit()) || (attacker.GetTeamNumber() == target.GetOpposingTeamNumber() && attacker.GetPlayerOwner() != undefined) || attacker.GetTeamNumber() == target.GetTeamNumber() || attacker.IsRoshan()) {
            this.Destroy();
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.parent.IsAlive()) {
                this.parent.AddNewModifier(this.caster, this.GetItemPlus(), this.modifier_mana_reserves, {
                    duration: this.mana_reserves_duration
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_clarity_mana_reserves extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public mana_reserves_mana: any;
    public max_mana_bonus: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetTexture(): string {
        return "item_clarity";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.parent = this.GetParentPlus();
        this.mana_reserves_mana = this.parent.TempData().item_clarity_mana_reserves_mana;
        this.max_mana_bonus = this.parent.TempData().item_clarity_max_mana_bonus;
        this.parent.TempData().item_clarity_mana_reserves_mana = undefined;
        this.parent.TempData().item_clarity_max_mana_bonus = undefined;
        if (IsServer()) {
            this.AddTimer(FrameTime(), () => {
                this.parent.GiveMana(this.mana_reserves_mana);
            });
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_MANA_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    CC_GetModifierExtraManaBonus(): number {
        return this.max_mana_bonus;
    }
}
