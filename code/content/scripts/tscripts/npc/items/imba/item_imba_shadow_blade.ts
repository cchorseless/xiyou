
    import { AI_ability } from "../../../ai/AI_ability";
    import { GameFunc } from "../../../GameFunc";
    import { ResHelper } from "../../../helper/ResHelper";
    import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
    import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
    import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
    import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
    import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
    @registerAbility()
export class item_imba_shadow_blade extends BaseItem_Plus {
OnSpellStart():void {
    let caster = this.GetCasterPlus();
    let particle_invis_start = "particles/generic_hero_status/status_invisibility_start.vpcf";
    let duration = this.GetSpecialValueFor("invis_duration");
    let fade_time = this.GetSpecialValueFor("invis_fade_time");
    EmitSoundOn("DOTA_Item.InvisibilitySword.Activate", caster);
    this.AddTimer(fade_time, () => {
        let particle_invis_start_fx = ResHelper.CreateParticleEx(particle_invis_start, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.SetParticleControl(particle_invis_start_fx, 0, caster.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(particle_invis_start_fx);
        caster.AddNewModifier(caster,this, "modifier_item_imba_shadow_blade_invis", {
            duration: duration
        });
    });
}
GetIntrinsicModifierName():string {
    return "modifier_item_imba_shadow_blade_passive";
}
}
@registerModifier()
export class modifier_item_imba_shadow_blade_invis extends BaseModifier_Plus {
public bonus_attack_damage : number; 
public bonus_movespeed : number; 
IsDebuff():boolean {
    return false;
}
IsHidden():boolean {
    return false;
}
IsPurgable():boolean {
    return false;
}
BeCreated(p_0:any,):void {
    if (!this.GetItemPlus()) {
        this.Destroy();
        return;
    }
    this.bonus_attack_damage = this.GetItemPlus().GetSpecialValueFor("invis_damage");
    if (IsServer()) {
        if (!this.GetParentPlus().findBuff<modifier_item_imba_shadow_blade_invis_flying_disabled>("modifier_item_imba_shadow_blade_invis_flying_disabled")) {
            this.GetParentPlus().SetMoveCapability(DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_FLY);
        }
    }
    if (this.GetItemPlus() == undefined) {
        return;
    }
    if (!this.GetParentPlus().IsCreature()) {
        this.bonus_movespeed = this.GetItemPlus().GetSpecialValueFor("invis_ms_pct");
    }
}
CheckState():Partial<Record<modifierstate,boolean>> {
    return {
        [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
        [modifierstate.MODIFIER_STATE_INVISIBLE]: true
    };
}
GetPriority():modifierpriority {
    return modifierpriority.MODIFIER_PRIORITY_NORMAL;
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE_POST_CRIT,
        3: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL,
        4: Enum_MODIFIER_EVENT.ON_ATTACK,
        5: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED
    });
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
CC_GetModifierMoveSpeedBonus_Percentage():number {
    return this.bonus_movespeed;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE_POST_CRIT)
CC_GetModifierPreAttack_BonusDamagePostCrit(params:ModifierAttackEvent):number {
    if (IsClient() || (!params.target.IsOther() && !params.target.IsBuilding())) {
        return this.bonus_attack_damage;
    }
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
CC_GetModifierInvisibilityLevel():number {
    return 1;
}
@registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
CC_OnAttack(params:ModifierAttackEvent):void {
    if (IsServer()) {
        if (params.attacker == this.GetParentPlus()) {
            let ability = this.GetItemPlus();
            let debuff_duration = ability.GetSpecialValueFor("turnrate_slow_duration");
            params.target.AddNewModifier(params.attacker, ability, "modifier_item_imba_shadow_blade_invis_turnrate_debuff", {
                duration: debuff_duration * (1 - params.target.GetStatusResistance())
            });
            this.Destroy();
        }
    }
}
@registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
CC_OnAbilityExecuted(keys:ModifierAbilityEvent):void {
    if (IsServer()) {
        let parent = this.GetParentPlus();
        if (keys.unit == parent) {
            this.Destroy();
        }
    }
}
BeDestroy():void {
    if (IsServer()) {
        if (!this.GetParentPlus().findBuff<modifier_shadow_blade_invis_flying_disabled>("modifier_shadow_blade_invis_flying_disabled")) {
            this.GetParentPlus().SetMoveCapability(DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_GROUND);
            GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetAbsOrigin(), 175, false);
            ResolveNPCPositions(this.GetParentPlus().GetAbsOrigin(), 64);
        }
    }
}
}
@registerModifier()
export class modifier_item_imba_shadow_blade_passive extends BaseModifier_Plus {
public attack_damage_bonus : number; 
public attack_speed_bonus : number; 
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
    let ability = this.GetItemPlus();
    if (this.GetParentPlus().IsHero() && ability) {
        this.attack_damage_bonus = ability.GetSpecialValueFor("bonus_damage");
        this.attack_speed_bonus = ability.GetSpecialValueFor("bonus_attack_speed");
        this.CheckUnique(true);
    }
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
        3: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
    });
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
CC_GetModifierPreAttack_BonusDamage():number {
    return this.attack_damage_bonus;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
CC_GetModifierAttackSpeedBonus_Constant():number {
    return this.attack_speed_bonus;
}
@registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
CC_OnTakeDamage(params:ModifierInstanceEvent):void {
    if (IsServer()) {
        if (params.unit == this.GetParentPlus()) {
            let parent = this.GetParentPlus();
            let disable_duration = this.GetItemPlus().GetSpecialValueFor("invis_flying_damage_disable_duration");
            if (params.attacker.IsHeroDamage(params.damage)) {
                parent.AddNewModifier(parent,this, "modifier_item_imba_shadow_blade_invis_flying_disabled", {
                    duration: disable_duration
                });
            }
        }
    }
}
}
@registerModifier()
export class modifier_item_imba_shadow_blade_invis_flying_disabled extends BaseModifier_Plus {
IsDebuff():boolean {
    return false;
}
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
BeCreated(p_0:any,):void {
    if (IsServer()) {
        if (!this.GetItemPlus()) {
            this.Destroy();
        }
    }
    if (IsServer()) {
        this.GetParentPlus().SetMoveCapability(DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_GROUND);
        GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetAbsOrigin(), 175, false);
        ResolveNPCPositions(this.GetParentPlus().GetAbsOrigin(), 64);
    }
}
BeDestroy():void {
    if (IsServer()) {
        if (this.GetParentPlus().findBuff<modifier_item_imba_shadow_blade_invis>("modifier_item_imba_shadow_blade_invis")) {
            this.GetParentPlus().SetMoveCapability(DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_FLY);
        }
    }
}
}
@registerModifier()
export class modifier_item_imba_shadow_blade_invis_turnrate_debuff extends BaseModifier_Plus {
public turnrate : any; 
IsDebuff():boolean {
    return true;
}
IsHidden():boolean {
    return false;
}
IsPurgable():boolean {
    return true;
}
BeCreated(p_0:any,):void {
    if (IsServer()) {
        if (!this.GetItemPlus()) {
            this.Destroy();
        }
    }
    let ability = this.GetItemPlus();
    this.turnrate = ability.GetSpecialValueFor("turnrate_slow");
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE
    });
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE)
CC_GetModifierTurnRate_Percentage():number {
    return this.turnrate;
}
GetEffectName():string {
    return "particles/item/shadow_blade/shadow_blade_panic_debuff.vpcf";
}
GetEffectAttachType():ParticleAttachment_t {
    return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
}
}
