
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

function GreavesActivate(caster: IBaseNpc_Plus, ability: IBaseItem_Plus,
    heal_amount: number, mana_amount: number, heal_radius: number, heal_duration: number) {
    caster.Purge(false, true, false, false, false);
    caster.EmitSound("Item.GuardianGreaves.Activate");
    let cast_pfx = ParticleManager.CreateParticle("particles/items3_fx/warmage.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
    ParticleManager.ReleaseParticleIndex(cast_pfx);
    let nearby_allies = FindUnitsInRadius(caster.GetTeam(), caster.GetAbsOrigin(), undefined, heal_radius,
        DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY,
        DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
        DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
        FindOrder.FIND_ANY_ORDER, false);
    for (const ally of (nearby_allies)) {
        ally.ApplyHeal(heal_amount, ability);
        ally.GiveMana(mana_amount);
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_MANA_ADD, ally, mana_amount, undefined);
        ally.EmitSound("Item.GuardianGreaves.Target");
        let particle_name = "particles/items3_fx/warmage_mana_nonhero.vpcf";
        let particle_name_hero = "particles/items3_fx/warmage_recipient.vpcf";
        let particle_target = particle_name;
        if (ally.IsRealUnit()) {
            particle_target = particle_name_hero;
        }
        let target_pfx = ParticleManager.CreateParticle(particle_target, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ally);
        ParticleManager.SetParticleControl(target_pfx, 0, ally.GetAbsOrigin());
        ally.AddNewModifier(caster, ability, "modifier_item_imba_guardian_greaves_heal", {
            duration: heal_duration
        });
        if (caster.GetUnitName().includes("meepo")) {
            let enemyList: IBaseNpc_Plus[] = [];
            // for (const [_, hero] of pairs(HeroList.GetAllHeroes())) {
            for (const hero of (enemyList)) {
                for (let i = 0; i <= 5; i++) {
                    let item = hero.GetItemInSlot(i);
                    if (item && item.GetAbilityName() == "item_imba_guardian_greaves") {
                        item.UseResources(true, false, true);
                        return;
                    }
                }
            }
        } else {
            ability.UseResources(true, false, true);
        }
    }
}

@registerAbility()
export class item_imba_mekansm extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_mekansm";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let heal_amount = this.GetSpecialValueFor("heal_amount") * (1 + this.GetCasterPlus().GetSpellAmplification(false) * 0.01);
            let heal_radius = this.GetSpecialValueFor("heal_radius");
            let heal_duration = this.GetSpecialValueFor("heal_duration");
            this.GetCasterPlus().EmitSound("DOTA_Item.Mekansm.Activate");
            let mekansm_pfx = ResHelper.CreateParticleEx("particles/items2_fx/mekanism.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
            ParticleManager.ReleaseParticleIndex(mekansm_pfx);
            let caster_loc = this.GetCasterPlus().GetAbsOrigin();
            let nearby_allies = FindUnitsInRadius(this.GetCasterPlus().GetTeam(), caster_loc, undefined, heal_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, ally] of GameFunc.iPair(nearby_allies)) {
                ally.ApplyHeal(heal_amount, this);
                ally.EmitSound("DOTA_Item.Mekansm.Target");
                let mekansm_target_pfx = ResHelper.CreateParticleEx("particles/items2_fx/mekanism_recipient.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ally, this.GetCasterPlus());
                ParticleManager.SetParticleControl(mekansm_target_pfx, 0, caster_loc);
                ParticleManager.SetParticleControl(mekansm_target_pfx, 1, ally.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(mekansm_target_pfx);
                ally.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_mekansm_heal", {
                    duration: heal_duration
                });
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_mekansm extends BaseModifier_Plus {
    public bonus_armor: number;
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
    BeCreated(keys: any): void {
        if (!this.GetItemPlus()) {
            if (IsServer()) {
                this.Destroy();
            }
            return;
        }
        this.bonus_armor = this.GetItemPlus().GetSpecialValueFor("bonus_armor");
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (!parent.HasModifier("modifier_item_imba_mekansm_aura_emitter")) {
                parent.AddNewModifier(parent, this.GetItemPlus(), "modifier_item_imba_mekansm_aura_emitter", {});
            }
        }
        this.OnIntervalThink();
        this.StartIntervalThink(1.0);
    }
    BeDestroy( /** keys */): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (!parent.HasModifier("modifier_item_imba_mekansm")) {
                parent.RemoveModifierByName("modifier_item_imba_mekansm_aura_emitter");
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.bonus_armor;
    }
}
@registerModifier()
export class modifier_item_imba_mekansm_aura_emitter extends BaseModifier_Plus {
    IsAura(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        if (IsServer()) {
            if (this.GetParentPlus().IsAlive()) {
                return "modifier_item_imba_mekansm_aura";
            } else {
                return undefined;
            }
        }
    }
    GetAuraRadius(): number {
        return this.GetItemPlus().GetSpecialValueFor("aura_radius");
    }
}
@registerModifier()
export class modifier_item_imba_mekansm_aura extends BaseModifier_Plus {
    public aura_health_regen: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetTexture(): string {
        return "item_mekansm";
    }
    BeCreated(keys: any): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.aura_health_regen = this.GetItemPlus().GetSpecialValueFor("aura_health_regen");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.aura_health_regen;
    }
}
@registerModifier()
export class modifier_item_imba_mekansm_heal extends BaseModifier_Plus {
    public heal_bonus_armor: number;
    public heal_percentage: any;
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
        return "item_mekansm";
    }
    BeCreated(keys: any): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.heal_bonus_armor = this.GetItemPlus().GetSpecialValueFor("heal_bonus_armor");
        this.heal_percentage = this.GetItemPlus().GetSpecialValueFor("heal_percentage");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE_ACTIVE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE)
    CC_GetModifierHealthRegenPercentage(): number {
        return this.heal_percentage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE_ACTIVE)
    CC_GetModifierPhysicalArmorBonusUniqueActive(p_0: ModifierAttackEvent,): number {
        return this.heal_bonus_armor;
    }
}
@registerAbility()
export class item_imba_guardian_greaves extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_guardian_greaves";
    }
    OnAbilityPhaseStart(): boolean {
        if (this.GetCasterPlus().IsClone()) {
            return false;
        }
        return true;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let heal_amount = this.GetSpecialValueFor("replenish_health") * (1 + this.GetCasterPlus().GetSpellAmplification(false) * 0.01);
            let mana_amount = this.GetSpecialValueFor("replenish_mana") + this.GetSpecialValueFor("mend_mana_pct") * this.GetCasterPlus().GetMaxMana() * 0.01;
            let heal_radius = this.GetSpecialValueFor("aura_radius");
            let heal_duration = this.GetSpecialValueFor("mend_duration");
            GreavesActivate(this.GetCasterPlus(), this, heal_amount, mana_amount, heal_radius, heal_duration);
        }
    }
}
@registerModifier()
export class modifier_item_imba_guardian_greaves extends BaseModifier_Plus {
    public bonus_movement: number;
    public bonus_mana: number;
    public bonus_armor: number;
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
    BeCreated(keys: any): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.bonus_movement = this.GetItemPlus().GetSpecialValueFor("bonus_movement");
        this.bonus_mana = this.GetItemPlus().GetSpecialValueFor("bonus_mana");
        this.bonus_armor = this.GetItemPlus().GetSpecialValueFor("bonus_armor");
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (!parent.HasModifier("modifier_item_imba_guardian_greaves_aura_emitter")) {
                parent.AddNewModifier(parent, this.GetItemPlus(), "modifier_item_imba_guardian_greaves_aura_emitter", {});
            }
        }
        this.OnIntervalThink();
        this.StartIntervalThink(1.0);
    }
    BeDestroy( /** keys */): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (!parent.HasModifier("modifier_item_imba_guardian_greaves")) {
                parent.RemoveModifierByName("modifier_item_imba_guardian_greaves_aura_emitter");
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE)
    CC_GetModifierMoveSpeedBonus_Special_Boots(): number {
        return this.bonus_movement;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    CC_GetModifierManaBonus(): number {
        return this.bonus_mana;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.bonus_armor;
    }
}
@registerModifier()
export class modifier_item_imba_guardian_greaves_aura_emitter extends BaseModifier_Plus {
    public aura_radius: number;
    public aura_bonus_threshold: number;
    public replenish_health: any;
    public replenish_mana: any;
    public mend_mana_pct: number;
    public mend_duration: number;
    IsAura(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.aura_radius = this.GetItemPlus().GetSpecialValueFor("aura_radius");
        this.aura_bonus_threshold = this.GetItemPlus().GetSpecialValueFor("aura_bonus_threshold");
        this.replenish_health = this.GetItemPlus().GetSpecialValueFor("replenish_health");
        this.replenish_mana = this.GetItemPlus().GetSpecialValueFor("replenish_mana");
        this.mend_mana_pct = this.GetItemPlus().GetSpecialValueFor("mend_mana_pct");
        this.mend_duration = this.GetItemPlus().GetSpecialValueFor("mend_duration");
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        if (IsServer()) {
            if (this.GetParentPlus().IsAlive()) {
                return "modifier_item_imba_guardian_greaves_aura";
            } else {
                return undefined;
            }
        }
    }
    GetAuraRadius(): number {
        if (!this.GetItemPlus()) {
            return 0;
        }
        return this.aura_radius;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let owner = this.GetParentPlus();
            if (owner != keys.unit) {
                return;
            }
            if (owner.IsIllusion()) {
                return;
            }
            let ability = this.GetItemPlus();
            if (owner.GetHealthPercent() <= this.aura_bonus_threshold && owner.GetHealthPercent() > 0 && ability.IsCooldownReady() && owner.GetMana() >= ability.GetManaCost(-1)) {
                GreavesActivate(owner, ability, this.replenish_health, this.replenish_mana + this.mend_mana_pct * owner.GetMaxMana() * 0.01, this.aura_radius, this.mend_duration);
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_guardian_greaves_aura extends BaseModifier_Plus {
    public aura_health_regen: any;
    public aura_armor: any;
    public aura_health_regen_bonus: number;
    public aura_armor_bonus: number;
    public aura_bonus_threshold: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetTexture(): string {
        return "item_guardian_greaves";
    }
    BeCreated(keys: any): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        let ability = this.GetItemPlus();
        this.aura_health_regen = ability.GetSpecialValueFor("aura_health_regen");
        this.aura_armor = ability.GetSpecialValueFor("aura_armor");
        this.aura_health_regen_bonus = ability.GetSpecialValueFor("aura_health_regen_bonus");
        this.aura_armor_bonus = ability.GetSpecialValueFor("aura_armor_bonus");
        this.aura_bonus_threshold = ability.GetSpecialValueFor("aura_bonus_threshold");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        let owner = this.GetParentPlus();
        if (owner.IsRealUnit()) {
            let bonus_power = (1 - math.max(owner.GetHealthPercent(), this.aura_bonus_threshold) * 0.01) / (1 - this.aura_bonus_threshold * 0.01);
            return this.aura_armor + (this.aura_armor_bonus - this.aura_armor) * bonus_power;
        }
        return this.aura_armor;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        let owner = this.GetParentPlus();
        if (owner.IsRealUnit()) {
            let bonus_power = (1 - math.max(owner.GetHealthPercent(), this.aura_bonus_threshold) * 0.01) / (1 - this.aura_bonus_threshold * 0.01);
            return this.aura_health_regen + (this.aura_health_regen_bonus - this.aura_health_regen) * bonus_power;
        }
        return this.aura_health_regen;
    }
}
@registerModifier()
export class modifier_item_imba_guardian_greaves_heal extends BaseModifier_Plus {
    public mend_regen: any;
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
        return "item_guardian_greaves";
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.mend_regen = this.GetItemPlus().GetSpecialValueFor("mend_regen");
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE)
    CC_GetModifierHealthRegenPercentage(): number {
        return this.mend_regen;
    }
}
