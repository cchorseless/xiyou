
    import { AI_ability } from "../../../ai/AI_ability";
    import { GameFunc } from "../../../GameFunc";
    import { ResHelper } from "../../../helper/ResHelper";
    import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
    import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
    import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
    import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
    import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
    @registerAbility()
export class item_imba_sheepstick extends BaseItem_Plus {
GetIntrinsicModifierName():string {
    return "modifier_item_imba_sheepstick";
}
CastFilterResultTarget(target:CDOTA_BaseNPC):UnitFilterResult {
    if (this.GetCasterPlus().GetTeamNumber() == target.GetTeamNumber() && this.GetCasterPlus() != target) {
        return UnitFilterResult.UF_FAIL_CUSTOM;
    }
    return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
}
GetCustomCastErrorTarget(target:CDOTA_BaseNPC):string {
    let caster = this.GetCasterPlus();
    if (caster.GetTeamNumber() == target.GetTeamNumber() && caster != target) {
        return "#dota_hud_error_only_cast_on_self";
    }
}
OnSpellStart():void {
    if (IsServer()) {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        let hex_duration = this.GetSpecialValueFor("hex_duration");
        let modified_duration = hex_duration;
        if (target.IsMagicImmune()) {
            return undefined;
        }
        if (target.GetTeam() != caster.GetTeam()) {
            if (target.TriggerSpellAbsorb(this)) {
                return undefined;
            }
        }
        target.EmitSound("DOTA_Item.Sheepstick.Activate");
        if (target.IsIllusion() && !Custom_bIsStrongIllusion(target)) {
            target.ForceKill(true);
            return;
        }
        if (caster == target) {
            target.AddNewModifier(caster,this, "modifier_item_imba_sheepstick_buff", {
                duration: hex_duration
            });
            target.Purge(false, true, false, false, false);
            let nearby_enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, this.GetSpecialValueFor("self_debuff_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of ipairs(nearby_enemies)) {
                if (enemy.IsIllusion() && (!enemy.Custom_IsStrongIllusion || (enemy.Custom_IsStrongIllusion && !enemy.Custom_IsStrongIllusion()))) {
                    enemy.ForceKill(true);
                } else {
                    enemy.AddNewModifier(caster,this, "modifier_item_imba_sheepstick_debuff", {
                        duration: modified_duration * (1 - enemy.GetStatusResistance())
                    });
                }
            }
        } else {
            target.AddNewModifier(caster,this, "modifier_item_imba_sheepstick_debuff", {
                duration: modified_duration * (1 - target.GetStatusResistance())
            });
        }
    }
}
}
@registerModifier()
export class modifier_item_imba_sheepstick extends BaseModifier_Plus {
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
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
        2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
        3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
        4: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT
    }
    return Object.values(funcs);
} */
BeCreated(p_0:any,):void {
    if (IsServer()) {
        if (!this.GetItemPlus()) {
            this.Destroy();
        }
    }
    this.OnIntervalThink();
    this.StartIntervalThink(1.0);
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
CC_GetModifierBonusStats_Strength():number {
    return this.GetItemPlus().GetSpecialValueFor("bonus_strength");
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
CC_GetModifierBonusStats_Agility():number {
    return this.GetItemPlus().GetSpecialValueFor("bonus_agility");
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
CC_GetModifierBonusStats_Intellect():number {
    return this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
CC_GetModifierConstantManaRegen():number {
    return this.GetItemPlus().GetSpecialValueFor("bonus_mana_regen");
}
}
@registerModifier()
export class modifier_item_imba_sheepstick_debuff extends BaseModifier_Plus {
public sheep_pfx : any; 
IsHidden():boolean {
    return false;
}
IsDebuff():boolean {
    return true;
}
IsPurgable():boolean {
    return true;
}
/** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BASE_OVERRIDE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE,
        3: GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA
    }
    return Object.values(funcs);
} */
BeCreated(p_0:any,):void {
    if (IsServer()) {
        this.sheep_pfx = ResHelper.CreateParticleEx("particles/items_fx/item_sheepstick.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
        ParticleManager.SetParticleControl(this.sheep_pfx, 0, this.GetParentPlus().GetAbsOrigin());
        print(this.GetCasterPlus().sheepstick_model);
        if (this.GetCasterPlus().sheepstick_model) {
            if (this.GetCasterPlus().sheepstick_model == "models/props_gameplay/pig_blue.vmdl") {
                this.SetStackCount(1);
            } else if (this.GetCasterPlus().sheepstick_model == "models/props_gameplay/roquelaire/roquelaire.vmdl") {
                this.SetStackCount(2);
            }
        }
    }
}
BeRefresh(p_0:any,):void {
    if (!IsServer()) {
        return;
    }
    this.OnCreated();
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BASE_OVERRIDE)
CC_GetModifierMoveSpeedOverride():number {
    return this.GetItemPlus().GetSpecialValueFor("enemy_move_speed");
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
CC_GetModifierModelChange():string {
    if (this.GetStackCount() == 1) {
        return "models/props_gameplay/pig_blue.vmdl";
    } else if (this.GetStackCount() == 2) {
        return "models/props_gameplay/roquelaire/roquelaire.vmdl";
    }
    return "models/props_gameplay/pig.vmdl";
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA)
CC_GetVisualZDelta():number {
    return 0;
}
CheckState():Partial<Record<modifierstate,boolean>> {
    let states = {
        [modifierstate.MODIFIER_STATE_HEXED]: true,
        [modifierstate.MODIFIER_STATE_DISARMED]: true,
        [modifierstate.MODIFIER_STATE_SILENCED]: true,
        [modifierstate.MODIFIER_STATE_MUTED]: true,
        [modifierstate.MODIFIER_STATE_PASSIVES_DISABLED]: true
    }
    return states;
}
BeDestroy():void {
    if (IsServer()) {
        if (this.sheep_pfx) {
            ParticleManager.DestroyParticle(this.sheep_pfx, false);
            ParticleManager.ReleaseParticleIndex(this.sheep_pfx);
        }
    }
}
}
@registerModifier()
export class modifier_item_imba_sheepstick_buff extends BaseModifier_Plus {
public sheep_pfx : any; 
IsHidden():boolean {
    return false;
}
IsDebuff():boolean {
    return false;
}
IsPurgable():boolean {
    return true;
}
BeCreated(p_0:any,):void {
    if (IsServer()) {
        this.sheep_pfx = ResHelper.CreateParticleEx("particles/items_fx/item_sheepstick.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
        ParticleManager.SetParticleControl(this.sheep_pfx, 0, this.GetParentPlus().GetAbsOrigin());
    }
}
BeDestroy():void {
    if (IsServer()) {
        let owner = this.GetParentPlus();
        GridNav.DestroyTreesAroundPoint(owner.GetAbsOrigin(), this.GetItemPlus().GetSpecialValueFor("tree_radius"), false);
        if (this.sheep_pfx) {
            ParticleManager.DestroyParticle(this.sheep_pfx, false);
            ParticleManager.ReleaseParticleIndex(this.sheep_pfx);
        }
    }
}
/** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE_MIN,
        2: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE
    }
    return Object.values(funcs);
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE_MIN)
CC_GetModifierMoveSpeed_AbsoluteMin():number {
    return this.GetItemPlus().GetSpecialValueFor("self_move_speed");
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
CC_GetModifierModelChange():string {
    return "models/items/courier/mighty_chicken/mighty_chicken_flying.vmdl";
}
CheckState():Partial<Record<modifierstate,boolean>> {
    let states = {
        [modifierstate.MODIFIER_STATE_HEXED]: true,
        [modifierstate.MODIFIER_STATE_FLYING]: true,
        [modifierstate.MODIFIER_STATE_DISARMED]: true,
        [modifierstate.MODIFIER_STATE_SILENCED]: true,
        [modifierstate.MODIFIER_STATE_MUTED]: true
    }
    return states;
}
}
