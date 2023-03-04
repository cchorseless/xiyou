
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_ironleaf_boots extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_ironleaf_boots";
    }
}
@registerModifier()
export class modifier_imba_ironleaf_boots extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public modifier_self: any;
    public modifier_unique: any;
    public base_move_speed: number;
    public base_health_regen: any;
    public mana_regen: any;
    public attack_speed: number;
    public base_magic_resistance: any;
    AllowIllusionDuplicate(): boolean {
        return false;
    }
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
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.modifier_self = "modifier_imba_ironleaf_boots";
        this.modifier_unique = "modifier_imba_ironleaf_boots_unique";
        this.base_move_speed = this.ability.GetSpecialValueFor("base_move_speed");
        this.base_health_regen = this.ability.GetSpecialValueFor("base_health_regen");
        this.mana_regen = this.ability.GetSpecialValueFor("mana_regen");
        this.attack_speed = this.ability.GetSpecialValueFor("attack_speed");
        this.base_magic_resistance = this.ability.GetSpecialValueFor("base_magic_resistance");
        if (IsServer()) {
            if (!this.caster.HasModifier(this.modifier_unique)) {
                this.caster.AddNewModifier(this.caster, this.ability, this.modifier_unique, {});
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (!this.caster.HasModifier(this.modifier_self)) {
                this.caster.RemoveModifierByName(this.modifier_unique);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.base_move_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.base_health_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        return this.mana_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.base_magic_resistance;
    }
}
@registerModifier()
export class modifier_imba_ironleaf_boots_unique extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public modifier_meditate: any;
    public modifier_leafwalk: any;
    public modifier_mres: any;
    public iron_body_thrshold: any;
    public iron_body_high_reduction: any;
    public iron_body_normal_reduction: any;
    public iron_body_min_stacks_req: number;
    public leafwalk_hold_time: number;
    public leafwalk_duration: number;
    public last_movement: any;
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetItemPlus();
            this.modifier_meditate = "modifier_imba_ironleaf_boots_meditate";
            this.modifier_leafwalk = "modifier_imba_ironleaf_boots_leafwalk";
            this.modifier_mres = "modifier_imba_ironleaf_boots_magic_res";
            this.iron_body_thrshold = this.ability.GetSpecialValueFor("iron_body_thrshold");
            this.iron_body_high_reduction = this.ability.GetSpecialValueFor("iron_body_high_reduction");
            this.iron_body_normal_reduction = this.ability.GetSpecialValueFor("iron_body_normal_reduction");
            this.iron_body_min_stacks_req = this.ability.GetSpecialValueFor("iron_body_min_stacks_req");
            this.leafwalk_hold_time = this.ability.GetSpecialValueFor("leafwalk_hold_time");
            this.leafwalk_duration = this.ability.GetSpecialValueFor("leafwalk_duration");
            this.caster.AddNewModifier(this.caster, this.ability, this.modifier_meditate, {});
            this.last_movement = GameRules.GetGameTime();
            this.StartIntervalThink(0.2);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (!this.GetItemPlus().IsCooldownReady()) {
                this.SetStackCount(1);
                this.last_movement = GameRules.GetGameTime();
                if (this.caster.HasModifier(this.modifier_leafwalk)) {
                    let leafwalk_handler = this.caster.FindModifierByName(this.modifier_leafwalk);
                    if (leafwalk_handler) {
                        leafwalk_handler.Destroy();
                    }
                }
            } else {
                this.SetStackCount(0);
            }
            if (this.caster.HasModifier(this.modifier_leafwalk)) {
                return undefined;
            }
            if (GameRules.GetGameTime() - this.last_movement >= this.leafwalk_hold_time) {
                this.caster.AddNewModifier(this.caster, this.ability, this.modifier_leafwalk, {
                    duration: this.leafwalk_duration
                });
                this.caster.AddNewModifier(this.caster, this.ability, this.modifier_mres, {
                    duration: this.leafwalk_duration
                });
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.caster.HasModifier(this.modifier_meditate)) {
                this.caster.RemoveModifierByName(this.modifier_meditate);
            }
            if (this.caster.HasModifier(this.modifier_leafwalk)) {
                this.caster.RemoveModifierByName(this.modifier_leafwalk);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK,
            2: Enum_MODIFIER_EVENT.ON_UNIT_MOVED,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_START,
            4: Enum_MODIFIER_EVENT.ON_ABILITY_START,
            5: Enum_MODIFIER_EVENT.ON_RESPAWN
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_RESPAWN)
    CC_OnRespawn(keys: ModifierUnitEvent): void {
        if (IsServer()) {
            let unit = keys.unit;
            if (this.caster == unit) {
                this.last_movement = GameRules.GetGameTime();
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            if (this.caster == attacker) {
                this.last_movement = GameRules.GetGameTime();
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_START)
    CC_OnAbilityStart(keys: ModifierAbilityEvent): void {
        if (IsServer()) {
            let unit = keys.unit;
            if (this.caster == unit) {
                this.last_movement = GameRules.GetGameTime();
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_UNIT_MOVED)
    CC_OnUnitMoved(keys: ModifierUnitEvent): void {
        if (IsServer()) {
            let unit = keys.unit;
            if (this.caster == unit) {
                this.last_movement = GameRules.GetGameTime();
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK)
    CC_GetModifierPhysical_ConstantBlock(keys: ModifierAttackEvent): number {
        if (IsServer()) {
            let target = keys.target;
            let damage = keys.damage;
            if (this.caster == target) {
                let modifier_meditate_handler = this.caster.FindModifierByName(this.modifier_meditate);
                if (modifier_meditate_handler) {
                    let stacks = modifier_meditate_handler.GetStackCount();
                    if (stacks >= this.iron_body_min_stacks_req) {
                        if (damage >= this.iron_body_thrshold) {
                            return this.iron_body_high_reduction;
                        } else {
                            return this.iron_body_normal_reduction;
                        }
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_ironleaf_boots_meditate extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public meditate_interval: number;
    public meditate_movespeed_bonus_pct: number;
    public meditate_health_regen: any;
    public max_stacks: number;
    public meditate_stacks_loss_creep: number;
    public meditate_stacks_loss_hero: number;
    public broken_meditate_efficiency_pct: number;
    public modifier_unique: any;
    IsHidden(): boolean {
        if (this.GetStackCount() == 0) {
            return true;
        }
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.meditate_interval = this.ability.GetSpecialValueFor("meditate_interval");
        this.meditate_movespeed_bonus_pct = this.ability.GetSpecialValueFor("meditate_movespeed_bonus_pct");
        this.meditate_health_regen = this.ability.GetSpecialValueFor("meditate_health_regen");
        this.max_stacks = this.ability.GetSpecialValueFor("max_stacks");
        this.meditate_stacks_loss_creep = this.ability.GetSpecialValueFor("meditate_stacks_loss_creep");
        this.meditate_stacks_loss_hero = this.ability.GetSpecialValueFor("meditate_stacks_loss_hero");
        this.broken_meditate_efficiency_pct = this.ability.GetSpecialValueFor("broken_meditate_efficiency_pct");
        this.modifier_unique = "modifier_imba_ironleaf_boots_unique";
        if (IsServer()) {
            this.StartIntervalThink(this.meditate_interval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (!this.ability.IsCooldownReady()) {
                return undefined;
            }
            let stacks = this.GetStackCount();
            if (stacks < this.max_stacks) {
                this.IncrementStackCount();
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.caster.findBuffStack(this.modifier_unique, this.caster) == 1) {
            return this.meditate_movespeed_bonus_pct * this.GetStackCount() * this.broken_meditate_efficiency_pct * 0.01;
        }
        return this.meditate_movespeed_bonus_pct * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        if (this.caster.findBuffStack(this.modifier_unique, this.caster) == 1) {
            return this.meditate_health_regen * this.GetStackCount() * this.broken_meditate_efficiency_pct * 0.01;
        }
        return this.meditate_health_regen * this.GetStackCount();
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (this.caster == target) {
                if (attacker.GetTeamNumber() == this.caster.GetTeamNumber()) {
                    return undefined;
                }
                let stacks = this.GetStackCount();
                let meditate_stacks_loss;
                if (attacker.IsHero()) {
                    meditate_stacks_loss = this.meditate_stacks_loss_hero;
                } else {
                    meditate_stacks_loss = this.meditate_stacks_loss_creep;
                }
                if (stacks >= meditate_stacks_loss) {
                    this.SetStackCount(this.GetStackCount() - meditate_stacks_loss);
                } else {
                    this.SetStackCount(0);
                }
                this.ability.UseResources(false, false, true);
                this.StartIntervalThink(this.meditate_interval);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_ironleaf_boots_leafwalk extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetItemPlus();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED,
            2: Enum_MODIFIER_EVENT.ON_ATTACK,
            3: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_OnAbilityExecuted(keys: ModifierAbilityEvent): void {
        if (IsServer()) {
            let unit = keys.unit;
            if (this.caster == unit) {
                this.Destroy();
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            if (this.caster == attacker) {
                this.Destroy();
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        return 1;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_ironleaf_boots_magic_res extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public leafwalk_magic_res: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.leafwalk_magic_res = this.ability.GetSpecialValueFor("leafwalk_magic_res");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.leafwalk_magic_res;
    }
}
