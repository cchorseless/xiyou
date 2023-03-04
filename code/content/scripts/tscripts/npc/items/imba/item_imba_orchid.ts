
    import { AI_ability } from "../../../ai/AI_ability";
    import { GameFunc } from "../../../GameFunc";
    import { ResHelper } from "../../../helper/ResHelper";
    import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
    import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
    import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
    import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
    import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
    @registerAbility()
export class item_imba_orchid extends BaseItem_Plus {
GetAbilityTextureName():string {
    return "imba_orchid";
}
GetIntrinsicModifierName():string {
    return "modifier_item_imba_orchid";
}
OnSpellStart():void {
    let target = this.GetCursorTarget();
    if (target.GetTeam() != this.GetCasterPlus().GetTeam()) {
        if (target.TriggerSpellAbsorb(this)) {
            return undefined;
        }
    }
    if (target.IsMagicImmune()) {
        return undefined;
    }
    target.EmitSound("DOTA_Item.Orchid.Activate");
    target.AddNewModifier(this.GetCasterPlus(),this, "modifier_item_imba_orchid_debuff", {
        duration: this.GetSpecialValueFor("silence_duration") * (1 - target.GetStatusResistance())
    });
}
}
@registerModifier()
export class modifier_item_imba_orchid extends BaseModifier_Plus {
public item : any; 
public parent : IBaseNpc_Plus; 
public bonus_intellect : number; 
public bonus_attack_speed : number; 
public bonus_damage : number; 
public bonus_mana_regen : number; 
public spell_power : any; 
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
BeDestroy():void {
    this.CheckUnique(false);
}
BeCreated(p_0:any,):void {
    if (IsServer()) {
        if (!this.GetItemPlus()) {
            this.Destroy();
        }
    }
    this.item = this.GetItemPlus();
    this.parent = this.GetParentPlus();
    if (this.parent.IsHero() && this.item) {
        this.bonus_intellect = this.item.GetSpecialValueFor("bonus_intellect");
        this.bonus_attack_speed = this.item.GetSpecialValueFor("bonus_attack_speed");
        this.bonus_damage = this.item.GetSpecialValueFor("bonus_damage");
        this.bonus_mana_regen = this.item.GetSpecialValueFor("bonus_mana_regen");
        this.spell_power = this.item.GetSpecialValueFor("spell_power");
        this.CheckUnique(true);
    }
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
        2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
        3: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
        4: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
        5: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE
    });
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
CC_GetModifierBonusStats_Intellect():number {
    return this.bonus_intellect;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
CC_GetModifierAttackSpeedBonus_Constant():number {
    return this.bonus_attack_speed;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
CC_GetModifierPreAttack_BonusDamage():number {
    return this.bonus_damage;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
CC_GetModifierConstantManaRegen():number {
    return this.bonus_mana_regen;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
CC_GetModifierSpellAmplify_Percentage(p_0:ModifierAttackEvent,):number {
    return this.CheckUniqueValue(this.spell_power, {
        1: "modifier_item_imba_bloodthorn"
    });
}
}
@registerModifier()
export class modifier_item_imba_orchid_debuff extends BaseModifier_Plus {
public damage_factor : number; 
IsHidden():boolean {
    return false;
}
IsDebuff():boolean {
    return true;
}
IsPurgable():boolean {
    return true;
}
GetEffectName():string {
    return "particles/items2_fx/orchid.vpcf";
}
GetEffectAttachType():ParticleAttachment_t {
    return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
}
BeCreated(p_0:any,):void {
    if (IsServer()) {
        if (!this.GetItemPlus()) {
            this.Destroy();
        }
    }
    if (IsServer()) {
        let owner = this.GetParentPlus();
        owner.orchid_damage_storage = owner.orchid_damage_storage || 0;
        this.damage_factor = this.GetItemPlus().GetSpecialValueFor("silence_damage_percent");
    }
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
    });
} */
CheckState():Partial<Record<modifierstate,boolean>> {
    return {
        [modifierstate.MODIFIER_STATE_SILENCED]: true
    };
}
@registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
CC_OnTakeDamage(keys:ModifierInstanceEvent):void {
    if (IsServer()) {
        let owner = this.GetParentPlus();
        let target = keys.unit;
        if (owner == target) {
            owner.orchid_damage_storage = owner.orchid_damage_storage + keys.damage;
        }
    }
}
BeDestroy():void {
    if (IsServer()) {
        let owner = this.GetParentPlus();
        let ability = this.GetItemPlus();
        let caster = ability.GetCasterPlus();
        if (owner.orchid_damage_storage > 0) {
            let damage = owner.orchid_damage_storage * this.damage_factor * 0.01;
            ApplyDamage({
                attacker: caster,
                victim: owner,
                ability: ability,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
            let orchid_end_pfx = ResHelper.CreateParticleEx("particles/items2_fx/orchid_pop.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, owner);
            ParticleManager.SetParticleControl(orchid_end_pfx, 0, owner.GetAbsOrigin());
            ParticleManager.SetParticleControl(orchid_end_pfx, 1, Vector(100, 0, 0));
            ParticleManager.ReleaseParticleIndex(orchid_end_pfx);
        }
        this.GetParentPlus().orchid_damage_storage = undefined;
    }
}
}
@registerAbility()
export class item_imba_bloodthorn extends BaseItem_Plus {
GetAbilityTextureName():string {
    return "imba_bloodthorn";
}
GetIntrinsicModifierName():string {
    return "modifier_item_imba_bloodthorn";
}
OnSpellStart():void {
    if (IsServer()) {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        let silence_duration = this.GetSpecialValueFor("silence_duration");
        if (target.GetTeam() != caster.GetTeam()) {
            if (target.TriggerSpellAbsorb(this)) {
                return undefined;
            }
        }
        if (target.IsMagicImmune()) {
            return undefined;
        }
        target.EmitSound("DOTA_Item.Orchid.Activate");
        target.AddNewModifier(caster,this, "modifier_item_imba_bloodthorn_debuff", {
            duration: silence_duration * (1 - target.GetStatusResistance())
        });
    }
}
}
@registerModifier()
export class modifier_item_imba_bloodthorn extends BaseModifier_Plus {
public item : any; 
public parent : IBaseNpc_Plus; 
public bonus_intellect : number; 
public bonus_attack_speed : number; 
public bonus_damage : number; 
public bonus_mana_regen : number; 
public spell_power : any; 
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
BeCreated(p_0:any,):void {
    if (IsServer()) {
        if (!this.GetItemPlus()) {
            this.Destroy();
        }
    }
    this.item = this.GetItemPlus();
    this.parent = this.GetParentPlus();
    if (this.parent.IsHero() && this.item) {
        this.bonus_intellect = this.item.GetSpecialValueFor("bonus_intellect");
        this.bonus_attack_speed = this.item.GetSpecialValueFor("bonus_attack_speed");
        this.bonus_damage = this.item.GetSpecialValueFor("bonus_damage");
        this.bonus_mana_regen = this.item.GetSpecialValueFor("bonus_mana_regen");
        this.spell_power = this.item.GetSpecialValueFor("spell_power");
        this.CheckUnique(true);
    }
}
BeDestroy( /** keys */ ):void {
    if (IsServer()) {
        this.CheckUnique(false);
    }
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
        2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
        3: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
        4: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
        5: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE
    });
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
CC_GetModifierBonusStats_Intellect():number {
    return this.bonus_intellect;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
CC_GetModifierAttackSpeedBonus_Constant():number {
    return this.bonus_attack_speed;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
CC_GetModifierPreAttack_BonusDamage():number {
    return this.bonus_damage;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
CC_GetModifierConstantManaRegen():number {
    return this.bonus_mana_regen;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
CC_GetModifierSpellAmplify_Percentage(p_0:ModifierAttackEvent,):number {
    return this.CheckUniqueValue(this.spell_power, undefined);
}
}
@registerModifier()
export class modifier_item_imba_bloodthorn_debuff extends BaseModifier_Plus {
public damage_factor : number; 
public target_crit_multiplier : any; 
IsHidden():boolean {
    return false;
}
IsDebuff():boolean {
    return true;
}
IsPurgable():boolean {
    return true;
}
GetEffectName():string {
    return "particles/items2_fx/orchid.vpcf";
}
GetEffectAttachType():ParticleAttachment_t {
    return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
}
BeCreated(p_0:any,):void {
    if (IsServer()) {
        if (!this.GetItemPlus()) {
            this.Destroy();
        }
    }
    if (IsServer()) {
        let owner = this.GetParentPlus();
        if (!owner.orchid_damage_storage) {
            owner.orchid_damage_storage = 0;
        }
        this.damage_factor = this.GetItemPlus().GetSpecialValueFor("silence_damage_percent");
        this.target_crit_multiplier = this.GetItemPlus().GetSpecialValueFor("target_crit_multiplier");
    }
}
CheckState():Partial<Record<modifierstate,boolean>> {
    return {
        [modifierstate.MODIFIER_STATE_SILENCED]: true,
        [modifierstate.MODIFIER_STATE_EVADE_DISABLED]: true
    };
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
        2: Enum_MODIFIER_EVENT.ON_ATTACK_START
    });
} */
@registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
CC_OnAttackStart(keys:ModifierAttackEvent):void {
    if (IsServer()) {
        let owner = this.GetParentPlus();
        if (owner == keys.target) {
            let attacker = keys.attacker;
            attacker.AddNewModifier(owner, this.GetItemPlus(), "modifier_item_imba_bloodthorn_attacker_crit", {
                duration: 1.0,
                target_crit_multiplier: this.target_crit_multiplier
            });
        }
    }
}
@registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
CC_OnTakeDamage(keys:ModifierInstanceEvent):void {
    if (IsServer()) {
        let owner = this.GetParentPlus();
        let target = keys.unit;
        if (owner == target) {
            owner.orchid_damage_storage = owner.orchid_damage_storage + keys.damage;
        }
    }
}
BeDestroy():void {
    if (IsServer()) {
        let owner = this.GetParentPlus();
        let ability = this.GetItemPlus();
        let caster = ability.GetCasterPlus();
        let damage_factor = ability.GetSpecialValueFor("silence_damage_percent");
        if (owner.orchid_damage_storage > 0) {
            let damage = owner.orchid_damage_storage * damage_factor * 0.01;
            ApplyDamage({
                attacker: caster,
                victim: owner,
                ability: ability,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
            let orchid_end_pfx = ResHelper.CreateParticleEx("particles/items2_fx/orchid_pop.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, owner);
            ParticleManager.SetParticleControl(orchid_end_pfx, 0, owner.GetAbsOrigin());
            ParticleManager.SetParticleControl(orchid_end_pfx, 1, Vector(100, 0, 0));
            ParticleManager.ReleaseParticleIndex(orchid_end_pfx);
        }
        this.GetParentPlus().orchid_damage_storage = undefined;
    }
}
}
@registerModifier()
export class modifier_item_imba_bloodthorn_attacker_crit extends BaseModifier_Plus {
public target_crit_multiplier : any; 
IsHidden():boolean {
    return true;
}
IsDebuff():boolean {
    return false;
}
IsPurgable():boolean {
    return false;
}
BeCreated(keys:any):void {
    if (IsServer()) {
        if (!this.GetItemPlus()) {
            this.Destroy();
        }
    }
    if (IsServer()) {
        this.target_crit_multiplier = keys.target_crit_multiplier;
    }
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE,
        2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
    });
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE)
CC_GetModifierPreAttack_CriticalStrike(p_0:ModifierAttackEvent,):number {
    if (IsServer()) {
        return this.target_crit_multiplier;
    }
}
@registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
CC_OnAttackLanded(keys:ModifierAttackEvent):void {
    if (IsServer()) {
        if (this.GetParentPlus() == keys.attacker) {
            this.GetParentPlus().RemoveModifierByName("modifier_item_imba_bloodthorn_attacker_crit");
            let debuff_modifier = keys.target.findBuff<modifier_item_imba_bloodthorn_debuff>("modifier_item_imba_bloodthorn_debuff");
            if (debuff_modifier) {
                debuff_modifier.target_crit_multiplier = debuff_modifier.target_crit_multiplier + this.GetItemPlus().GetSpecialValueFor("crit_mult_increase");
            }
        }
    }
}
}
