
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_echo_sabre extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_echo_sabre_passive";
    }
    GetAbilityTextureName(): string {
        return "imba_echo_sabre";
    }
}
@registerModifier()
export class modifier_imba_echo_sabre extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public bonus_intellect: number;
    public bonus_strength: number;
    public bonus_attack_speed: number;
    public bonus_damage: number;
    public bonus_mana_regen: number;
    public slow_duration: number;
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    IsHidden(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        let item = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        if (this.parent.IsRealUnit() && item) {
            this.bonus_intellect = item.GetSpecialValueFor("bonus_intellect");
            this.bonus_strength = item.GetSpecialValueFor("bonus_strength");
            this.bonus_attack_speed = item.GetSpecialValueFor("bonus_attack_speed");
            this.bonus_damage = item.GetSpecialValueFor("bonus_damage");
            this.bonus_mana_regen = item.GetSpecialValueFor("bonus_mana_regen");
            this.slow_duration = item.GetSpecialValueFor("slow_duration");
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        let item = this.GetItemPlus();
        let parent = this.GetParentPlus();
        if (keys.attacker == parent && item && !parent.IsIllusion() && this.GetParentPlus().FindAllModifiersByName(this.GetName())[0] == this && !this.GetParentPlus().HasItemInInventory("item_imba_reverb_rapier")) {
            if (!parent.IsRangedAttacker()) {
                if (item.IsCooldownReady() && !keys.no_attack_cooldown) {
                    item.UseResources(false, false, true);
                    parent.AddNewModifier(parent, item, "modifier_imba_echo_rapier_haste", {});
                    if (!keys.target.IsBuilding() && !keys.target.IsOther()) {
                        keys.target.AddNewModifier(this.parent, this.GetItemPlus(), "modifier_imba_echo_rapier_debuff_slow", {
                            duration: this.slow_duration
                        });
                    }
                }
            }
            if (parent.HasModifier("modifier_imba_echo_rapier_haste") && (!parent.HasAbility("imba_slark_essence_shift") || parent.findAbliityPlus("imba_slark_essence_shift").GetCooldownTime() < parent.FindAbilityByName("imba_slark_essence_shift").GetEffectiveCooldown(parent.FindAbilityByName("imba_slark_essence_shift").GetLevel()))) {
                let mod = parent.findBuff<modifier_imba_echo_rapier_haste>("modifier_imba_echo_rapier_haste");
                mod.DecrementStackCount();
                if (mod.GetStackCount() < 1) {
                    mod.Destroy();
                }
            }
        }
    }
    BeRemoved(): void {
        if (!IsServer()) {
            return;
        }
        if ((this.GetParentPlus().findBuff<modifier_imba_echo_rapier_haste>("modifier_imba_echo_rapier_haste"))) {
            this.GetParentPlus().findBuff<modifier_imba_echo_rapier_haste>("modifier_imba_echo_rapier_haste").Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_echo_sabre_passive extends BaseModifier_Plus {
    public echo_modifier: any;
    public parent: IBaseNpc_Plus;
    public bonus_intellect: number;
    public bonus_strength: number;
    public bonus_attack_speed: number;
    public bonus_damage: number;
    public bonus_mana_regen: number;
    public slow_duration: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
                return;
            }
            this.echo_modifier = this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetItemPlus(), "modifier_imba_echo_sabre", {});
        }
        let item = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        if (this.parent.IsRealUnit() && item) {
            this.bonus_intellect = item.GetSpecialValueFor("bonus_intellect");
            this.bonus_strength = item.GetSpecialValueFor("bonus_strength");
            this.bonus_attack_speed = item.GetSpecialValueFor("bonus_attack_speed");
            this.bonus_damage = item.GetSpecialValueFor("bonus_damage");
            this.bonus_mana_regen = item.GetSpecialValueFor("bonus_mana_regen");
            this.slow_duration = item.GetSpecialValueFor("slow_duration");
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.bonus_intellect;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.bonus_strength;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_attack_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        return this.bonus_mana_regen;
    }
    BeRemoved(): void {
        if (!IsServer()) {
            return;
        }
        if (this.echo_modifier) {
            this.echo_modifier.Destroy();
        }
    }
}
@registerAbility()
export class item_imba_reverb_rapier extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_reverb_rapier_passive";
    }
    GetAbilityTextureName(): string {
        return "imba_reverb_rapier";
    }
}
@registerModifier()
export class modifier_imba_reverb_rapier_passive extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public bonus_intellect: number;
    public bonus_strength: number;
    public bonus_attack_speed: number;
    public bonus_damage: number;
    public bonus_mana_regen: number;
    public slow_duration: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            6: Enum_MODIFIER_EVENT.ON_ATTACK
        });
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        let item = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        if (this.parent.IsRealUnit() && item) {
            this.bonus_intellect = item.GetSpecialValueFor("bonus_intellect");
            this.bonus_strength = item.GetSpecialValueFor("bonus_strength");
            this.bonus_attack_speed = item.GetSpecialValueFor("bonus_attack_speed");
            this.bonus_damage = item.GetSpecialValueFor("bonus_damage");
            this.bonus_mana_regen = item.GetSpecialValueFor("bonus_mana_regen");
            this.slow_duration = item.GetSpecialValueFor("slow_duration");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.bonus_intellect;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.bonus_strength;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_attack_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        return this.bonus_mana_regen;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        let item = this.GetItemPlus();
        let parent = this.GetParentPlus();
        if (keys.attacker == parent && item && !parent.IsIllusion() && this.GetParentPlus().FindAllModifiersByName(this.GetName())[0] == this) {
            if (!parent.IsRangedAttacker()) {
                if (item.IsCooldownReady() && !keys.no_attack_cooldown) {
                    item.UseResources(false, false, true);
                    parent.AddNewModifier(parent, item, "modifier_imba_echo_rapier_haste", {});
                    if (!keys.target.IsBuilding() && !keys.target.IsOther()) {
                        keys.target.AddNewModifier(this.parent, this.GetItemPlus(), "modifier_imba_echo_rapier_debuff_slow", {
                            duration: this.slow_duration
                        });
                    }
                }
            }
            if (parent.HasModifier("modifier_imba_echo_rapier_haste") && (!parent.HasAbility("imba_slark_essence_shift") || parent.findAbliityPlus("imba_slark_essence_shift").GetCooldownTime() < parent.FindAbilityByName("imba_slark_essence_shift").GetEffectiveCooldown(parent.FindAbilityByName("imba_slark_essence_shift").GetLevel()))) {
                let mod = parent.findBuff<modifier_imba_echo_rapier_haste>("modifier_imba_echo_rapier_haste");
                mod.DecrementStackCount();
                if (mod.GetStackCount() < 1) {
                    mod.Destroy();
                }
            }
        }
    }
    BeRemoved(): void {
        if (!IsServer()) {
            return;
        }
        if ((this.GetParentPlus().findBuff<modifier_imba_echo_rapier_haste>("modifier_imba_echo_rapier_haste"))) {
            this.GetParentPlus().findBuff<modifier_imba_echo_rapier_haste>("modifier_imba_echo_rapier_haste").Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_echo_rapier_haste extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public slow_duration: number;
    public attack_speed_buff: number;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    Init(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        let item = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        if (item) {
            this.slow_duration = item.GetSpecialValueFor("slow_duration");
            let current_speed = this.parent.GetIncreasedAttackSpeed();
            if (item.GetAbilityName() == "item_imba_reverb_rapier") {
                current_speed = current_speed * 3;
            } else {
                current_speed = current_speed * 2;
            }
            let max_hits = item.GetSpecialValueFor("max_hits");
            this.SetStackCount(max_hits);
            this.attack_speed_buff = math.max(item.GetSpecialValueFor("attack_speed_buff"), current_speed);
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: Enum_MODIFIER_EVENT.ON_ATTACK
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (this.parent == keys.attacker && !keys.target.IsBuilding() && !keys.target.IsOther()) {
            keys.target.AddNewModifier(this.parent, this.GetItemPlus(), "modifier_imba_echo_rapier_debuff_slow", {
                duration: this.slow_duration * (1 - keys.target.GetStatusResistance())
            });
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_speed_buff;
    }
}
@registerModifier()
export class modifier_imba_echo_rapier_debuff_slow extends BaseModifier_Plus {
    public movement_slow: any;
    public attack_speed_slow: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        let item = this.GetItemPlus();
        if (item) {
            this.movement_slow = item.GetSpecialValueFor("movement_slow") * (-1);
            this.attack_speed_slow = item.GetSpecialValueFor("attack_speed_slow") * (-1);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_speed_slow;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movement_slow;
    }
    GetTexture(): string {
        if (this.GetItemPlus().GetAbilityName() == "item_imba_reverb_rapier") {
            return "imba_reverb_rapier";
        } else {
            return "imba_echo_sabre";
        }
    }
}
