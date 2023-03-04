
    import { AI_ability } from "../../../ai/AI_ability";
    import { GameFunc } from "../../../GameFunc";
    import { ResHelper } from "../../../helper/ResHelper";
    import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
    import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
    import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
    import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
    import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
    @registerAbility()
export class item_imba_spirit_vessel extends BaseItem_Plus {
public caster : IBaseNpc_Plus; 
public soul_radius : number; 
public soul_initial_charge : any; 
public soul_additional_charges : any; 
public soul_heal_amount : number; 
public soul_damage_amount : number; 
public duration : number; 
public soul_release_range_tooltip : number; 
public hp_regen_reduction_enemy : any; 
public enemy_hp_drain : any; 
public soul_sacrifice_max_health_pct : number; 
public target : IBaseNpc_Plus; 
public particle : any; 
GetIntrinsicModifierName():string {
    return "modifier_item_imba_spirit_vessel";
}
OnSpellStart():void {
    if (this.GetPurchaseTime() == -1) {
        return;
    }
    this.caster = this.GetCasterPlus();
    this.soul_radius = this.GetSpecialValueFor("soul_radius");
    this.soul_initial_charge = this.GetSpecialValueFor("soul_initial_charge");
    this.soul_additional_charges = this.GetSpecialValueFor("soul_additional_charges");
    this.soul_heal_amount = this.GetSpecialValueFor("soul_heal_amount");
    this.soul_damage_amount = this.GetSpecialValueFor("soul_damage_amount");
    this.duration = this.GetSpecialValueFor("duration");
    this.soul_release_range_tooltip = this.GetSpecialValueFor("soul_release_range_tooltip");
    this.hp_regen_reduction_enemy = this.GetSpecialValueFor("hp_regen_reduction_enemy");
    this.enemy_hp_drain = this.GetSpecialValueFor("enemy_hp_drain");
    this.soul_sacrifice_max_health_pct = this.GetSpecialValueFor("soul_sacrifice_max_health_pct");
    if (this.GetCooldownTimeRemaining() > 0) {
        if (this.GetCurrentCharges() == 0) {
            this.caster.AddNewModifier(this.caster,this, "modifier_item_imba_spirit_vessel_damage", {
                duration: this.duration
            });
        } else {
            this.SetCurrentCharges(math.max(this.GetCurrentCharges() - 1, 0));
        }
    }
    this.target = this.GetCursorTarget();
    this.caster.EmitSound("DOTA_Item.SpiritVessel.Cast");
    this.particle = ResHelper.CreateParticleEx("particles/items4_fx/spirit_vessel_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.caster);
    ParticleManager.SetParticleControl(this.particle, 1, this.target.GetAbsOrigin());
    ParticleManager.ReleaseParticleIndex(this.particle);
    let vesselSound = "DOTA_Item.SpiritVessel.Target.Enemy";
    let vesselModifier = "modifier_item_imba_spirit_vessel_damage";
    if (this.target.GetTeam() == this.caster.GetTeam()) {
        vesselSound = "DOTA_Item.SpiritVessel.Target.Ally";
        vesselModifier = "modifier_item_imba_spirit_vessel_heal";
    }
    this.target.EmitSound(vesselSound);
    this.target.AddNewModifier(this.caster,this, vesselModifier, {
        duration: this.duration
    });
}
}
@registerModifier()
export class modifier_item_imba_spirit_vessel extends BaseModifier_Plus {
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
RemoveOnDeath():boolean {
    return false;
}
GetAttributes():DOTAModifierAttribute_t {
    return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS,
        2: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
        3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
        4: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
        5: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
        6: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
        7: Enum_MODIFIER_EVENT.ON_DEATH
    });
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
CC_GetModifierHealthBonus():number {
    if (this.GetItemPlus()) {
        return this.GetItemPlus().GetSpecialValueFor("bonus_health");
    }
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
CC_GetModifierConstantManaRegen():number {
    if (this.GetItemPlus()) {
        return this.GetItemPlus().GetSpecialValueFor("bonus_mana_regen");
    }
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
CC_GetModifierBonusStats_Strength():number {
    if (this.GetItemPlus()) {
        return this.GetItemPlus().GetSpecialValueFor("bonus_all_stats");
    }
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
CC_GetModifierBonusStats_Agility():number {
    if (this.GetItemPlus()) {
        return this.GetItemPlus().GetSpecialValueFor("bonus_all_stats");
    }
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
CC_GetModifierBonusStats_Intellect():number {
    if (this.GetItemPlus()) {
        return this.GetItemPlus().GetSpecialValueFor("bonus_all_stats");
    }
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
CC_GetModifierPhysicalArmorBonus(p_0:ModifierAttackEvent,):number {
    if (this.GetItemPlus()) {
        return this.GetItemPlus().GetSpecialValueFor("bonus_armor");
    }
}
@registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
CC_OnDeath(keys:ModifierInstanceEvent):void {
    if (this.GetItemPlus() && keys.unit.IsRealHero() && this.GetCasterPlus().IsRealHero() && this.GetCasterPlus().GetTeam() != keys.unit.GetTeam() && (!keys.unit.IsReincarnating || (keys.unit.IsReincarnating && !keys.unit.IsReincarnating())) && this.GetCasterPlus().IsAlive() && (this.GetCasterPlus().GetAbsOrigin() - keys.unit.GetAbsOrigin() as Vector).Length2D() <= this.GetItemPlus().GetSpecialValueFor("soul_radius")) {
        let nearbyAllies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), keys.unit.GetAbsOrigin(), undefined, this.GetItemPlus().GetSpecialValueFor("soul_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_CLOSEST, false);
        for (const [_, ally] of ipairs(nearbyAllies)) {
            if (ally == this.GetCasterPlus()) {
                return;
            } else if (ally.HasItemInInventory(this.GetItemPlus().GetName())) {
                return;
            }
        }
        if (this == this.GetCasterPlus().FindAllModifiersByName("modifier_item_imba_spirit_vessel")[1]) {
            for (let itemSlot = 0; itemSlot <= 5; itemSlot += 1) {
                let item = this.GetCasterPlus().GetItemInSlot(itemSlot);
                if (item && item.GetName() == this.GetItemPlus().GetName()) {
                    if (item.GetCurrentCharges() == 0) {
                        item.SetCurrentCharges(item.GetCurrentCharges() + this.GetItemPlus().GetSpecialValueFor("soul_initial_charge"));
                    } else {
                        item.SetCurrentCharges(item.GetCurrentCharges() + this.GetItemPlus().GetSpecialValueFor("soul_additional_charges"));
                    }
                    return;
                }
            }
        }
    }
}
}
@registerModifier()
export class modifier_item_imba_spirit_vessel_heal extends BaseModifier_Plus {
public ability : IBaseItem_Plus; 
public caster : IBaseNpc_Plus; 
public parent : IBaseNpc_Plus; 
public bonus_health : number; 
public bonus_movement_speed : number; 
public bonus_mana_regen : number; 
public bonus_all_stats : number; 
public bonus_armor : number; 
public soul_radius : number; 
public soul_initial_charge : any; 
public soul_additional_charges : any; 
public soul_heal_amount : number; 
public soul_damage_amount : number; 
public duration : number; 
public soul_release_range_tooltip : number; 
public hp_regen_reduction_enemy : any; 
public enemy_hp_drain : any; 
GetEffectName():string {
    return "particles/items4_fx/spirit_vessel_heal.vpcf";
}
BeCreated(p_0:any,):void {
    if (IsServer()) {
        if (!this.GetItemPlus()) {
            this.Destroy();
        }
    }
    this.ability = this.GetItemPlus();
    this.caster = this.GetCasterPlus();
    this.parent = this.GetParentPlus();
    this.bonus_health = this.ability.GetSpecialValueFor("bonus_health");
    this.bonus_movement_speed = this.ability.GetSpecialValueFor("bonus_movement_speed");
    this.bonus_mana_regen = this.ability.GetSpecialValueFor("bonus_mana_regen");
    this.bonus_all_stats = this.ability.GetSpecialValueFor("bonus_all_stats");
    this.bonus_armor = this.ability.GetSpecialValueFor("bonus_armor");
    this.soul_radius = this.ability.GetSpecialValueFor("soul_radius");
    this.soul_initial_charge = this.ability.GetSpecialValueFor("soul_initial_charge");
    this.soul_additional_charges = this.ability.GetSpecialValueFor("soul_additional_charges");
    this.soul_heal_amount = this.ability.GetSpecialValueFor("soul_heal_amount");
    this.soul_damage_amount = this.ability.GetSpecialValueFor("soul_damage_amount");
    this.duration = this.ability.GetSpecialValueFor("duration");
    this.soul_release_range_tooltip = this.ability.GetSpecialValueFor("soul_release_range_tooltip");
    this.hp_regen_reduction_enemy = this.ability.GetSpecialValueFor("hp_regen_reduction_enemy");
    this.enemy_hp_drain = this.ability.GetSpecialValueFor("enemy_hp_drain");
    if (!IsServer()) {
        return;
    }
    if (this.parent.HasModifier("modifier_imba_urn_of_shadows_active_ally")) {
        this.parent.findBuff<modifier_imba_urn_of_shadows_active_ally>("modifier_imba_urn_of_shadows_active_ally").Destroy();
    }
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
        2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
    });
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
CC_GetModifierConstantHealthRegen():number {
    return this.soul_heal_amount;
}
@registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
CC_OnTakeDamage(keys:ModifierInstanceEvent):void {
    if (!IsServer()) {
        return;
    }
    if (keys.unit == this.parent && keys.attacker != this.parent && (keys.attacker.IsConsideredHero() || keys.attacker.IsRoshan()) && keys.damage > 0) {
        this.Destroy();
    }
}
}
@registerModifier()
export class modifier_item_imba_spirit_vessel_damage extends BaseModifier_Plus {
public ability : IBaseItem_Plus; 
public caster : IBaseNpc_Plus; 
public parent : IBaseNpc_Plus; 
public debuff_multiplier : any; 
public bonus_health : number; 
public bonus_movement_speed : number; 
public bonus_mana_regen : number; 
public bonus_all_stats : number; 
public bonus_armor : number; 
public soul_radius : number; 
public soul_initial_charge : any; 
public soul_additional_charges : any; 
public soul_heal_amount : number; 
public soul_damage_amount : number; 
public duration : number; 
public soul_release_range_tooltip : number; 
public hp_regen_reduction_enemy : any; 
public enemy_hp_drain : any; 
public curse_activation_reduction : any; 
IsDebuff():boolean {
    return true;
}
GetEffectName():string {
    return "particles/items4_fx/spirit_vessel_damage.vpcf";
}
IgnoreTenacity() {
    return true;
}
BeCreated(params:any):void {
    if (IsServer()) {
        if (!this.GetItemPlus()) {
            this.Destroy();
        }
    }
    this.ability = this.GetItemPlus();
    this.caster = this.GetCasterPlus();
    this.parent = this.GetParentPlus();
    if (params && params.curse_stack) {
        this.SetStackCount(params.curse_stack);
    }
    this.debuff_multiplier = math.max(this.GetStackCount(), 1);
    this.bonus_health = this.ability.GetSpecialValueFor("bonus_health");
    this.bonus_movement_speed = this.ability.GetSpecialValueFor("bonus_movement_speed");
    this.bonus_mana_regen = this.ability.GetSpecialValueFor("bonus_mana_regen");
    this.bonus_all_stats = this.ability.GetSpecialValueFor("bonus_all_stats");
    this.bonus_armor = this.ability.GetSpecialValueFor("bonus_armor");
    this.soul_radius = this.ability.GetSpecialValueFor("soul_radius");
    this.soul_initial_charge = this.ability.GetSpecialValueFor("soul_initial_charge");
    this.soul_additional_charges = this.ability.GetSpecialValueFor("soul_additional_charges");
    this.soul_heal_amount = this.ability.GetSpecialValueFor("soul_heal_amount");
    this.soul_damage_amount = this.ability.GetSpecialValueFor("soul_damage_amount") * this.debuff_multiplier;
    this.duration = this.ability.GetSpecialValueFor("duration");
    this.soul_release_range_tooltip = this.ability.GetSpecialValueFor("soul_release_range_tooltip");
    this.hp_regen_reduction_enemy = this.ability.GetSpecialValueFor("hp_regen_reduction_enemy") * this.debuff_multiplier * (-1);
    this.enemy_hp_drain = this.ability.GetSpecialValueFor("enemy_hp_drain") * this.debuff_multiplier;
    this.curse_activation_reduction = this.ability.GetSpecialValueFor("curse_activation_reduction");
    if (!IsServer()) {
        return;
    }
    if (this.parent.HasModifier("modifier_imba_urn_of_shadows_active_enemy")) {
        this.parent.findBuff<modifier_imba_urn_of_shadows_active_enemy>("modifier_imba_urn_of_shadows_active_enemy").Destroy();
    }
    this.StartIntervalThink(1);
}
BeRefresh(p_0:any,):void {
    this.OnCreated();
}
OnIntervalThink():void {
    if (!IsServer()) {
        return;
    }
    let damageTableHP = {
        victim: this.parent,
        damage: this.soul_damage_amount + (this.parent.GetHealth() * (this.enemy_hp_drain / 100)),
        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
        attacker: this.caster,
        ability: this.ability
    }
    ApplyDamage(damageTableHP);
}
BeDestroy():void {
    if (!IsServer()) {
        return;
    }
    let duration = math.max(this.GetRemainingTime() - this.curse_activation_reduction, 0);
    let curse_stack = math.max(this.GetStackCount(), 1) * this.GetItemPlus().GetSpecialValueFor("curse_activation_mult");
    if (this.GetParentPlus().HasModifier("modifier_slark_dark_pact_pulses") || this.GetParentPlus().HasModifier("modifier_imba_slark_dark_pact_pulses") || (this.GetParentPlus().HasModifier("modifier_imba_tidehunter_kraken_shell") && !this.GetParentPlus().PassivesDisabled()) || this.GetParentPlus().HasModifier("modifier_imba_voodoo_restoration")) {
        duration = math.max(this.GetRemainingTime() + this.curse_activation_reduction, 0);
        curse_stack = undefined;
    }
    if ((this.GetRemainingTime() / this.GetDuration()) >= 0.5) {
        this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_item_imba_spirit_vessel_damage", {
            duration: duration,
            curse_stack: curse_stack
        });
    }
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.HEAL_AMPLIFY_PERCENTAGE_TARGET,
        2: GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE,
        3: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
    });
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEAL_AMPLIFY_PERCENTAGE_TARGET)
CC_GetModifierHealAmplify_PercentageTarget():void {
    return this.hp_regen_reduction_enemy;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE)
CC_GetModifierHPRegenAmplify_Percentage():number {
    return this.hp_regen_reduction_enemy;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
CC_OnTooltip():number {
    return this.hp_regen_reduction_enemy;
}
}
