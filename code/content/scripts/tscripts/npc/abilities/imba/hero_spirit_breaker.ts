
    import { AI_ability } from "../../../ai/AI_ability";
    import { GameFunc } from "../../../GameFunc";
    import { ResHelper } from "../../../helper/ResHelper";
    import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
    import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
    import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
    import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
    @registerAbility()
export class imba_spirit_breaker_charge_of_darkness extends BaseAbility_Plus {
public charge_cancel_reason : any; 
GetBehavior():DOTA_ABILITY_BEHAVIOR|Uint64 {
    return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DONT_ALERT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
}
GetAssociatedSecondaryAbilities():string {
    return "imba_spirit_breaker_greater_bash";
}
GetIntrinsicModifierName():string {
    return "modifier_imba_spirit_breaker_charge_of_darkness_taxi_tracker";
}
GetCooldown(level:number):number {
    if (this.GetCasterPlus().HasScepter()) {
        return this.GetSpecialValueFor("scepter_cooldown");
    } else {
        return super.GetCooldown(level);
    }
}
OnSpellStart():void {
    this.charge_cancel_reason = undefined;
    let target = this.GetCursorTarget();
    if (target.TriggerSpellAbsorb(this)) {
        return undefined;
    }
    this.GetCasterPlus().Interrupt();
    this.GetCasterPlus().EmitSound("Hero_Spirit_Breaker.ChargeOfDarkness");
    if (this.GetCasterPlus().GetName() == "npc_dota_hero_spirit_breaker" && RollPercentage(10)) {
        let responses = {
            1: "spirit_breaker_spir_ability_charge_02",
            2: "spirit_breaker_spir_ability_charge_14",
            3: "spirit_breaker_spir_ability_charge_19"
        }
        this.GetCasterPlus().EmitSound(responses[RandomInt(1, GameFunc.GetCount(responses))]);
    }
    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(),this, "modifier_imba_spirit_breaker_charge_of_darkness", {
        ent_index: target.GetEntityIndex()
    });
    this.SetActivated(false);
}
OnOwnerSpawned():void {
    if (!IsServer()) {
        return;
    }
    if (this.GetCasterPlus().HasTalent("special_bonus_imba_spirit_breaker_charge_speed") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_spirit_breaker_charge_speed")) {
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_spirit_breaker_charge_speed"), "modifier_special_bonus_imba_spirit_breaker_charge_speed", {});
    }
    if (this.GetCasterPlus().HasTalent("special_bonus_imba_spirit_breaker_bonus_health") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_spirit_breaker_bonus_health")) {
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_spirit_breaker_bonus_health"), "modifier_special_bonus_imba_spirit_breaker_bonus_health", {});
    }
}
}
@registerModifier()
export class modifier_imba_spirit_breaker_charge_of_darkness extends BaseModifierMotionHorizontal_Plus {
public movement_speed : number; 
public stun_duration : number; 
public bash_radius : number; 
public scepter_speed : number; 
public darkness_speed : number; 
public clothesline_duration : number; 
public taxi_radius : number; 
public taxi_distance : number; 
public target : IBaseNpc_Plus; 
public bashed_enemies : any; 
public trees : any; 
public darkness_counter : number; 
public attempting_to_board : any; 
public vision_modifier : any; 
public clothesline_target : any; 
IsPurgable():boolean {
    return false;
}
GetEffectName():string {
    return "particles/units/heroes/hero_spirit_breaker/spirit_breaker_charge.vpcf";
}
GetStatusEffectName():string {
    return "particles/status_fx/status_effect_charge_of_darkness.vpcf";
}
BeCreated(params:any):void {
    if (this.GetAbilityPlus()) {
        this.movement_speed = this.GetAbilityPlus().GetTalentSpecialValueFor("movement_speed");
        this.stun_duration = this.GetSpecialValueFor("stun_duration");
        this.bash_radius = this.GetSpecialValueFor("bash_radius");
        this.scepter_speed = this.GetSpecialValueFor("scepter_speed");
        this.darkness_speed = this.GetSpecialValueFor("darkness_speed");
        this.clothesline_duration = this.GetSpecialValueFor("clothesline_duration");
        this.taxi_radius = this.GetSpecialValueFor("taxi_radius");
        this.taxi_distance = this.GetSpecialValueFor("taxi_distance");
    } else {
        return;
    }
    if (!IsServer()) {
        return;
    }
    this.GetParentPlus().EmitSound("Hero_Spirit_Breaker.ChargeOfDarkness.FP");
    if (this.ApplyHorizontalMotionController() == false) {
        this.Destroy();
        return;
    }
    this.target = EntIndexToHScript(params.ent_index);
    this.bashed_enemies = {}
    this.trees = {}
    this.darkness_counter = 0;
    this.attempting_to_board = {}
    this.vision_modifier = this.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_spirit_breaker_charge_of_darkness_vision", {});
}
UpdateHorizontalMotion(me:CDOTA_BaseNPC, dt:number):void {
    if (!IsServer()) {
        return;
    }
    if (!this.GetAbilityPlus()) {
        this.GetAbilityPlus().charge_cancel_reason = "Ability Does Not Exist";
        this.Destroy();
        return;
    }
    if (!this.target.IsAlive()) {
        let new_targets = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.target.GetAbsOrigin(), undefined, 4000, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST, false);
        this.target = undefined;
        if (GameFunc.GetCount(new_targets) == 0) {
            this.GetAbilityPlus().charge_cancel_reason = "Primary target dead; no other valid targets within 4000 radius";
            this.Destroy();
            return;
        }
        for (const [_, target] of ipairs(new_targets)) {
            if (target != this.clothesline_target) {
                this.target = target;
                this.vision_modifier = this.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_spirit_breaker_charge_of_darkness_vision", {});
                return;
            }
        }
        if (!this.target) {
            this.GetAbilityPlus().charge_cancel_reason = "Primary target dead; only valid target within 4000 radius is being Clotheslined";
            this.Destroy();
            return;
        }
    }
    let greater_bash_ability = this.GetCasterPlus().findAbliityPlus<imba_spirit_breaker_greater_bash>("imba_spirit_breaker_greater_bash");
    let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin() + (this.GetParentPlus().GetForwardVector() * 20), undefined, this.bash_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false);
    for (const [_, enemy] of ipairs(enemies)) {
        if (this.GetAbilityPlus().GetAutoCastState() && !this.clothesline_target && enemy != this.target && !enemy.IsRoshan() && enemy.IsHero()) {
            this.clothesline_target = enemy;
            enemy.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_spirit_breaker_charge_of_darkness_clothesline", {
                duration: this.clothesline_duration * (1 - enemy.GetStatusResistance())
            });
            this.bashed_enemies[enemy] = true;
        } else if (greater_bash_ability && greater_bash_ability.IsTrained() && enemy != this.target && !this.bashed_enemies[enemy]) {
            greater_bash_ability.Bash(enemy, me);
            this.bashed_enemies[enemy] = true;
        }
    }
    let taxi_tracker_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_spirit_breaker_charge_of_darkness_taxi_tracker", this.GetCasterPlus());
    let allies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.taxi_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
    for (const [_, ally] of ipairs(allies)) {
        if (ally != this.GetParentPlus() && (this.attempting_to_board[ally] || (taxi_tracker_modifier && taxi_tracker_modifier.attempting_to_board[ally]))) {
            let taxi_modifier = ally.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_spirit_breaker_charge_of_darkness_taxi", {
                passenger_num: 1,
                taxi_distance: this.taxi_distance
            });
            let taxi_counter_modifier = this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_spirit_breaker_charge_of_darkness_taxi_counter", {
                ent_index: ally.GetEntityIndex()
            });
            let counter_modifiers = this.GetParentPlus().FindAllModifiersByName("modifier_imba_spirit_breaker_charge_of_darkness_taxi_counter");
            for (let num = 1; num <= GameFunc.GetCount(counter_modifiers); num += 1) {
                if (taxi_counter_modifier == counter_modifiers[num]) {
                    taxi_modifier.passenger_num = num;
                    return;
                }
            }
            this.attempting_to_board[ally] = undefined;
            if (taxi_tracker_modifier && taxi_tracker_modifier.attempting_to_board[ally]) {
                taxi_tracker_modifier.attempting_to_board[ally] = undefined;
            }
        }
    }
    let trees = GridNav.GetAllTreesAroundPoint(me.GetOrigin(), me.GetHullRadius(), false);
    for (const [_, tree] of ipairs(trees)) {
        if (!this.trees[tree]) {
            let tree_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_spirit_breaker/spirit_breaker_charge_tree.vpcf", ParticleAttachment_t.PATTACH_POINT, me);
            ParticleManager.ReleaseParticleIndex(tree_particle);
            this.trees[tree] = true;
        }
    }
    if ((this.target.GetOrigin() - me.GetOrigin()).Length2D() <= 128) {
        this.GetParentPlus().EmitSound("Hero_Spirit_Breaker.Charge.Impact");
        if (greater_bash_ability && greater_bash_ability.IsTrained()) {
            greater_bash_ability.Bash(this.target, me);
            if (USE_MEME_SOUNDS && this.GetAbilityPlus()) {
                if (RollPercentage(10)) {
                    this.GetCasterPlus().EmitSound("Hero_Spirit_Breaker.FryingPan");
                    this.GetAbilityPlus().frying_pan = true;
                    this.GetAbilityPlus().timer = GameRules.GetDOTATime(true, true);
                } else {
                    this.GetAbilityPlus().frying_pan = false;
                    this.GetAbilityPlus().timer = undefined;
                }
            }
        }
        if (!this.target.IsMagicImmune() && this.GetAbilityPlus()) {
            this.target.AddNewModifier(me, this.GetAbilityPlus(), "modifier_stunned", {
                duration: this.stun_duration * (1 - this.target.GetStatusResistance())
            });
        }
        if (this.target.IsAlive()) {
            this.GetAbilityPlus().charge_cancel_reason = "Charge connected with target and they were still alive after impact";
            me.SetAggroTarget(this.target);
            this.Destroy();
        }
        return;
    } else if (me.IsStunned() || me.IsOutOfGame() || me.IsHexed() || me.IsRooted()) {
        this.GetAbilityPlus().charge_cancel_reason = "Caster was disabled mid-charge";
        this.Destroy();
        return;
    }
    me.FaceTowards(this.target.GetOrigin());
    let distance = (GetGroundPosition(this.target.GetOrigin(), undefined) - GetGroundPosition(me.GetOrigin(), undefined)).Normalized();
    me.SetOrigin(me.GetOrigin() + distance * me.GetIdealSpeed() * dt);
    if (!this.target.CanEntityBeSeenByMyTeam(this.GetParentPlus())) {
        this.darkness_counter = this.darkness_counter + (this.darkness_speed * dt);
        this.SetStackCount(math.floor(this.darkness_counter));
    }
}
OnHorizontalMotionInterrupted():void {
    this.GetAbilityPlus().charge_cancel_reason = "Horizontal Motion Interrupted";
    this.Destroy();
}
BeDestroy():void {
    if (!IsServer()) {
        return;
    }
    this.GetParentPlus().RemoveHorizontalMotionController();
    if (this.GetAbilityPlus()) {
        this.GetAbilityPlus().SetActivated(true);
        this.GetAbilityPlus().UseResources(false, false, true);
    }
    this.GetParentPlus().StopSound("Hero_Spirit_Breaker.ChargeOfDarkness.FP");
    this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_SPIRIT_BREAKER_CHARGE_END);
    GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetOrigin(), this.GetParentPlus().GetHullRadius(), true);
    if (this.vision_modifier && !this.vision_modifier.IsNull()) {
        this.vision_modifier.Destroy();
    }
    let counter_modifiers = this.GetParentPlus().FindAllModifiersByName("modifier_imba_spirit_breaker_charge_of_darkness_taxi_counter");
    for (const [_, mod] of ipairs(counter_modifiers)) {
        mod.Destroy();
    }
}
CheckState():Partial<Record<modifierstate,boolean>> {
    return {
        [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true
    };
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT,
        2: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_AUTOATTACK,
        3: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT,
        4: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
        5: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS,
        6: Enum_MODIFIER_EVENT.ON_ORDER
    });
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT)
CC_GetModifierIgnoreMovespeedLimit():0|1 {
    return 1;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_AUTOATTACK)
CC_GetDisableAutoAttack():0|1 {
    return 1;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
CC_GetModifierMoveSpeedBonus_Constant():number {
    if (this.GetCasterPlus().HasScepter()) {
        return this.movement_speed + this.GetStackCount() + this.scepter_speed;
    } else {
        return this.movement_speed + this.GetStackCount();
    }
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
CC_GetOverrideAnimation():GameActivity_t {
    return GameActivity_t.ACT_DOTA_RUN;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
CC_GetActivityTranslationModifiers():string {
    return "charge";
}
@registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
CC_OnOrder(keys:ModifierUnitEvent):void {
    if (!IsServer()) {
        return;
    }
    if (keys.unit == this.GetParentPlus()) {
        let cancel_commands = {
            [dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_HOLD_POSITION]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_STOP]: true
        }
        if (cancel_commands[keys.order_type]) {
            this.GetAbilityPlus().charge_cancel_reason = "Cancel Order Issued: " + keys.order_type;
            this.Destroy();
        }
    } else if (keys.unit.GetTeamNumber() == this.GetParentPlus().GetTeamNumber()) {
        if (keys.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET && keys.target == this.GetParentPlus() && !keys.unit.HasModifier("modifier_imba_spirit_breaker_charge_of_darkness_taxi")) {
            this.attempting_to_board[keys.unit] = true;
        } else if (this.attempting_to_board[keys.unit]) {
            this.attempting_to_board[keys.unit] = undefined;
        }
    }
}
}
@registerModifier()
export class modifier_imba_spirit_breaker_charge_of_darkness_vision extends BaseModifier_Plus {
public particle : any; 
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
GetAttributes():DOTAModifierAttribute_t {
    return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
}
ShouldUseOverheadOffset():boolean {
    return true;
}
BeCreated(p_0:any,):void {
    if (!IsServer()) {
        return;
    }
    this.particle = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_spirit_breaker/spirit_breaker_charge_target.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus(), this.GetCasterPlus().GetTeamNumber());
    this.AddParticle(this.particle, false, false, -1, false, true);
}
CheckState():Partial<Record<modifierstate,boolean>> {
    return {
        [modifierstate.MODIFIER_STATE_PROVIDES_VISION]: true
    };
}
}
@registerModifier()
export class modifier_imba_spirit_breaker_charge_of_darkness_clothesline extends BaseModifierMotionHorizontal_Plus {
BeCreated(params:any):void {
    if (!IsServer()) {
        return;
    }
    if (this.ApplyHorizontalMotionController() == false) {
        this.Destroy();
        return;
    }
}
UpdateHorizontalMotion(me:CDOTA_BaseNPC, dt:number):void {
    if (!IsServer()) {
        return;
    }
    if (!this.GetCasterPlus().HasModifier("modifier_imba_spirit_breaker_charge_of_darkness") || me.IsOutOfGame()) {
        this.Destroy();
        return;
    }
    me.SetOrigin(this.GetCasterPlus().GetOrigin() + (this.GetCasterPlus().GetForwardVector() * 128));
}
OnHorizontalMotionInterrupted():void {
    this.Destroy();
}
BeDestroy():void {
    if (!IsServer()) {
        return;
    }
    this.GetParentPlus().RemoveHorizontalMotionController();
    let greater_bash_ability = this.GetCasterPlus().findAbliityPlus<imba_spirit_breaker_greater_bash>("imba_spirit_breaker_greater_bash");
    if (greater_bash_ability && greater_bash_ability.IsTrained()) {
        greater_bash_ability.Bash(this.GetParentPlus(), this.GetCasterPlus());
    }
}
CheckState():Partial<Record<modifierstate,boolean>> {
    let state = {
        [modifierstate.MODIFIER_STATE_STUNNED]: true
    }
    return state;
}
/** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
    }
    return Object.values(decFuncs);
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
CC_GetOverrideAnimation():GameActivity_t {
    return GameActivity_t.ACT_DOTA_FLAIL;
}
}
@registerModifier()
export class modifier_imba_spirit_breaker_charge_of_darkness_taxi extends BaseModifierMotionHorizontal_Plus {
public passenger_num : any; 
public taxi_distance : number; 
IsPurgable():boolean {
    return false;
}
GetEffectName():string {
    return "particles/units/heroes/hero_spirit_breaker/spirit_breaker_charge.vpcf";
}
GetStatusEffectName():string {
    return "particles/status_fx/status_effect_charge_of_darkness.vpcf";
}
BeCreated(params:any):void {
    if (!IsServer()) {
        return;
    }
    this.passenger_num = params.passenger_num;
    this.taxi_distance = params.taxi_distance;
    this.GetParentPlus().EmitSound("Hero_Spirit_Breaker.ChargeOfDarkness.FP");
    if (this.ApplyHorizontalMotionController() == false) {
        this.Destroy();
        return;
    }
}
UpdateHorizontalMotion(me:CDOTA_BaseNPC, dt:number):void {
    if (!IsServer()) {
        return;
    }
    if (!this.GetCasterPlus().HasModifier("modifier_imba_spirit_breaker_charge_of_darkness") || me.IsStunned() || me.IsOutOfGame() || me.IsHexed() || me.IsRooted()) {
        this.Destroy();
        return;
    }
    me.SetOrigin(this.GetCasterPlus().GetOrigin() + (this.GetCasterPlus().GetForwardVector() * (-1) * (this.passenger_num * this.taxi_distance)));
}
OnHorizontalMotionInterrupted():void {
    this.Destroy();
}
BeDestroy():void {
    if (!IsServer()) {
        return;
    }
    this.GetParentPlus().RemoveHorizontalMotionController();
    let charge_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_spirit_breaker_charge_of_darkness", this.GetCasterPlus());
    if (charge_modifier && charge_modifier.passengers) {
        charge_modifier.passengers = math.max(charge_modifier.passengers - 1, 0);
    }
    let counter_modifiers = this.GetCasterPlus().FindAllModifiersByName("modifier_imba_spirit_breaker_charge_of_darkness_taxi_counter");
    for (let num = 1; num <= GameFunc.GetCount(counter_modifiers); num += 1) {
        if (counter_modifiers[num].target == this.GetParentPlus()) {
            counter_modifiers[num].Destroy();
            return;
        }
    }
    let counter_modifiers = this.GetCasterPlus().FindAllModifiersByName("modifier_imba_spirit_breaker_charge_of_darkness_taxi_counter");
    for (let num = 1; num <= GameFunc.GetCount(counter_modifiers); num += 1) {
        if (counter_modifiers[num].target) {
            let taxi_modifier = counter_modifiers[num].target.findBuff<modifier_imba_spirit_breaker_charge_of_darkness_taxi>("modifier_imba_spirit_breaker_charge_of_darkness_taxi");
            if (taxi_modifier) {
                taxi_modifier.passenger_num = num;
            }
        }
    }
}
/** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: Enum_MODIFIER_EVENT.ON_ORDER
    }
    return Object.values(decFuncs);
} */
@registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
CC_OnOrder(keys:ModifierUnitEvent):void {
    if (!IsServer()) {
        return;
    }
    if (keys.unit == this.GetParentPlus()) {
        let cancel_commands = {
            [dotaunitorder_t.DOTA_UNIT_ORDER_HOLD_POSITION]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_STOP]: true
        }
        if (cancel_commands[keys.order_type]) {
            this.Destroy();
        }
    }
}
}
@registerModifier()
export class modifier_imba_spirit_breaker_charge_of_darkness_taxi_counter extends BaseModifier_Plus {
public target : IBaseNpc_Plus; 
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
GetAttributes():DOTAModifierAttribute_t {
    return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
}
BeCreated(params:any):void {
    if (!IsServer()) {
        return;
    }
    this.target = EntIndexToHScript(params.ent_index);
}
}
@registerModifier()
export class modifier_imba_spirit_breaker_charge_of_darkness_taxi_tracker extends BaseModifier_Plus {
public attempting_to_board : any; 
IsHidden():boolean {
    return true;
}
BeCreated(p_0:any,):void {
    if (!IsServer()) {
        return;
    }
    this.attempting_to_board = {}
}
/** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: Enum_MODIFIER_EVENT.ON_ORDER
    }
    return Object.values(decFuncs);
} */
@registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
CC_OnOrder(keys:ModifierUnitEvent):void {
    if (!IsServer()) {
        return;
    }
    if (keys.unit.GetTeamNumber() == this.GetParentPlus().GetTeamNumber()) {
        if (keys.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET && keys.target == this.GetParentPlus() && !keys.unit.HasModifier("modifier_imba_spirit_breaker_charge_of_darkness_taxi")) {
            this.attempting_to_board[keys.unit] = true;
        } else if (this.attempting_to_board[keys.unit]) {
            this.attempting_to_board[keys.unit] = undefined;
        }
    }
}
}
@registerAbility()
export class imba_spirit_breaker_bulldoze extends BaseAbility_Plus {
GetIntrinsicModifierName():string {
    return "modifier_imba_spirit_breaker_bulldoze_empowering_haste_aura";
}
GetCooldown(nLevel:number):number {
    return super.GetCooldown(nLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_spirit_breaker_bulldoze_cooldown");
}
OnSpellStart():void {
    this.GetCasterPlus().EmitSound("Hero_Spirit_Breaker.Bulldoze.Cast");
    if (this.GetCasterPlus().GetName() == "npc_dota_hero_spirit_breaker" && RollPercentage(50)) {
        let responses = {
            1: "spirit_breaker_spir_ability_charge_03",
            2: "spirit_breaker_spir_ability_charge_05",
            3: "spirit_breaker_spir_ability_charge_13"
        }
        this.GetCasterPlus().EmitSound(responses[RandomInt(1, GameFunc.GetCount(responses))]);
    }
    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(),this, "modifier_imba_spirit_breaker_bulldoze", {
        duration: this.GetSpecialValueFor("duration")
    });
}
OnOwnerSpawned():void {
    if (!IsServer()) {
        return;
    }
    if (this.GetCasterPlus().HasTalent("special_bonus_imba_spirit_breaker_bulldoze_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_spirit_breaker_bulldoze_cooldown")) {
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_spirit_breaker_bulldoze_cooldown"), "modifier_special_bonus_imba_spirit_breaker_bulldoze_cooldown", {});
    }
}
}
@registerModifier()
export class modifier_imba_spirit_breaker_bulldoze extends BaseModifier_Plus {
public movement_speed : number; 
public status_resistance : any; 
GetEffectName():string {
    return "particles/units/heroes/hero_spirit_breaker/spirit_breaker_haste_owner.vpcf";
}
BeCreated(p_0:any,):void {
    this.movement_speed = this.GetSpecialValueFor("movement_speed");
    this.status_resistance = this.GetSpecialValueFor("status_resistance");
}
/** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
    }
    return Object.values(decFuncs);
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
CC_GetModifierMoveSpeedBonus_Percentage():number {
    return this.movement_speed;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
CC_GetModifierStatusResistanceStacking():number {
    return this.status_resistance;
}
}
@registerModifier()
export class modifier_imba_spirit_breaker_bulldoze_empowering_haste_aura extends BaseModifier_Plus {
IsHidden():boolean {
    return true;
}
IsAura():boolean {
    return true;
}
IsAuraActiveOnDeath():boolean {
    return false;
}
GetAuraRadius():number {
    return this.GetSpecialValueFor("empowering_aura_radius");
}
GetAuraSearchFlags():DOTA_UNIT_TARGET_FLAGS {
    return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD;
}
GetAuraSearchTeam():DOTA_UNIT_TARGET_TEAM {
    return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
}
GetAuraSearchType():DOTA_UNIT_TARGET_TYPE {
    return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
}
GetModifierAura():string {
    return "modifier_imba_spirit_breaker_bulldoze_empowering_haste";
}
GetAuraEntityReject(hTarget:CDOTA_BaseNPC):boolean {
    return this.GetCasterPlus().PassivesDisabled();
}
}
@registerModifier()
export class modifier_imba_spirit_breaker_bulldoze_empowering_haste extends BaseModifier_Plus {
public empowering_aura_move_speed : number; 
IsHidden():boolean {
    return !(this.GetAbilityPlus() && this.GetAbilityPlus().GetLevel() >= 1);
}
GetTexture():string {
    return "spirit_breaker_empowering_haste";
}
BeCreated(p_0:any,):void {
    this.empowering_aura_move_speed = this.GetSpecialValueFor("empowering_aura_move_speed");
}
/** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
    }
    return Object.values(decFuncs);
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
CC_GetModifierMoveSpeedBonus_Percentage():number {
    return this.empowering_aura_move_speed;
}
}
@registerAbility()
export class imba_spirit_breaker_greater_bash extends BaseAbility_Plus {
GetIntrinsicModifierName():string {
    return "modifier_imba_spirit_breaker_greater_bash";
}
Bash(target:IBaseNpc_Plus, parent, bUltimate) {
    if (!IsServer()) {
        return;
    }
    let parent_loc = parent.GetAbsOrigin();
    if (!target.IsCreep()) {
        target.EmitSound("Hero_Spirit_Breaker.GreaterBash");
    } else {
        target.EmitSound("Hero_Spirit_Breaker.GreaterBash.Creep");
    }
    let bash_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_spirit_breaker/spirit_breaker_greater_bash.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
    ParticleManager.ReleaseParticleIndex(bash_particle);
    if (!target.IsRoshan()) {
        let knockback_modifier = target.FindModifierByNameAndCaster("modifier_knockback", parent);
        if (knockback_modifier) {
            knockback_modifier.Destroy();
        }
        knockback_properties = {
            center_x: parent_loc.x,
            center_y: parent_loc.y,
            center_z: parent_loc.z,
            duration: this.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance()),
            knockback_duration: this.GetSpecialValueFor("knockback_duration") * (1 - target.GetStatusResistance()),
            knockback_distance: this.GetSpecialValueFor("knockback_distance"),
            knockback_height: this.GetSpecialValueFor("knockback_height")
        }
        if (bUltimate) {
            knockback_properties.knockback_distance = knockback_properties.knockback_distance * 2;
        }
        knockback_modifier = target.AddNewModifier(parent,this, "modifier_knockback", knockback_properties);
    }
    let damageTable = {
        victim: target,
        damage: parent.GetIdealSpeed() * this.GetSpecialValueFor("damage") * 0.01,
        damage_type: this.GetAbilityDamageType(),
        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
        attacker: parent,
        ability: this
    }
    damage_dealt = ApplyDamage(damageTable);
    parent.AddNewModifier(parent,this, "modifier_imba_spirit_breaker_greater_bash_speed", {
        duration: this.GetSpecialValueFor("movespeed_duration")
    });
}
}
@registerModifier()
export class modifier_imba_spirit_breaker_greater_bash extends BaseModifier_Plus {
IsHidden():boolean {
    return true;
}
/** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
    }
    return Object.values(decFuncs);
} */
@registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
CC_OnAttackLanded(keys:ModifierAttackEvent):void {
    if (!IsServer()) {
        return;
    }
    if (this.GetAbilityPlus() && this.GetAbilityPlus().IsTrained() && this.GetAbilityPlus().IsCooldownReady() && keys.attacker == this.GetParentPlus() && !keys.attacker.PassivesDisabled() && !keys.target.IsOther() && !keys.target.IsBuilding() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && !this.GetParentPlus().IsIllusion()) {
        if (GFuncRandom.PRD(this.GetAbilityPlus().GetTalentSpecialValueFor("chance_pct"), )) {
            this.GetAbilityPlus().Bash(keys.target, keys.attacker);
            this.GetAbilityPlus().UseResources(false, false, true);
        }
    }
}
}
@registerModifier()
export class modifier_imba_spirit_breaker_greater_bash_speed extends BaseModifier_Plus {
public bonus_movespeed_pct : number; 
BeCreated(p_0:any,):void {
    if (this.GetAbilityPlus()) {
        this.bonus_movespeed_pct = this.GetSpecialValueFor("bonus_movespeed_pct");
    } else {
        this.Destroy();
    }
}
CheckState():Partial<Record<modifierstate,boolean>> {
    return {
        [modifierstate.MODIFIER_STATE_UNSLOWABLE]: true
    };
}
/** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
    }
    return Object.values(decFuncs);
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
CC_GetModifierMoveSpeedBonus_Percentage():number {
    return this.bonus_movespeed_pct;
}
}
@registerAbility()
export class imba_spirit_breaker_nether_strike extends BaseAbility_Plus {
public vision_modifier : any; 
public energy_modifier : any; 
public randy : any; 
public wtf_mode : any; 
GetAssociatedSecondaryAbilities():string {
    return "imba_spirit_breaker_greater_bash";
}
GetBehavior():DOTA_ABILITY_BEHAVIOR|Uint64 {
    return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
}
OnUpgrade():void {
    if (this.GetLevel() == 1) {
        this.ToggleAutoCast();
    }
}
GetCooldown(nLevel:number):number {
    return super.GetCooldown(nLevel);
}
GetCastRange(location:Vector, target:CDOTA_BaseNPC|undefined):number {
    return super.GetCastRange(location, target);
}
GetCastPoint():number {
    if (this.GetCasterPlus().HasModifier("modifier_imba_spirit_breaker_nether_strike_planeswalker")) {
        return super.GetCastPoint() * (100 - this.GetTalentSpecialValueFor("planeswalker_reduction")) * 0.01;
    } else {
        return super.GetCastPoint();
    }
}
GetManaCost(iLevel:number):number {
    if (this.GetCasterPlus().HasModifier("modifier_imba_spirit_breaker_nether_strike_planeswalker")) {
        return super.GetManaCost(iLevel) * (100 - this.GetTalentSpecialValueFor("planeswalker_reduction")) * 0.01;
    } else {
        return super.GetManaCost(iLevel);
    }
}
CastFilterResultTarget(hTarget:CDOTA_BaseNPC):UnitFilterResult {
    if (!IsServer()) {
        return;
    }
    if (this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_spirit_breaker_nether_strike_planeswalker", this.GetCasterPlus())) {
        if (hTarget.FindModifierByNameAndCaster("modifier_imba_spirit_breaker_nether_strike_planeswalker_enemy", this.GetCasterPlus())) {
            return UnitFilterResult.UF_SUCCESS;
        } else {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
    } else {
        let nResult = UnitFilter(hTarget, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
        return nResult;
    }
}
GetCustomCastErrorTarget(hTarget:CDOTA_BaseNPC):string {
    if (!IsServer()) {
        return;
    }
    if (this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_spirit_breaker_nether_strike_planeswalker", this.GetCasterPlus()) && !hTarget.FindModifierByNameAndCaster("modifier_imba_spirit_breaker_nether_strike_planeswalker_enemy", this.GetCasterPlus())) {
        return "Invalid Planeswalker Target";
    }
}
OnAbilityPhaseStart():boolean {
    if (!IsServer()) {
        return;
    }
    if (!this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_spirit_breaker_nether_strike_planeswalker", this.GetCasterPlus())) {
        this.GetCasterPlus().EmitSound("Hero_Spirit_Breaker.NetherStrike.Begin");
        this.vision_modifier = this.GetCursorTarget().AddNewModifier(this.GetCasterPlus(),this, "modifier_imba_spirit_breaker_nether_strike_vision", {
            duration: this.GetCastPoint()
        });
        this.energy_modifier = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(),this, "modifier_imba_spirit_breaker_nether_strike", {
            duration: this.GetCastPoint()
        });
        if (USE_MEME_SOUNDS) {
            if (RollPercentage(20)) {
                this.GetCasterPlus().EmitSound("Hero_Spirit_Breaker.RandyOrton1");
                this.randy = true;
            } else {
                this.randy = false;
            }
        }
    }
    return true;
}
OnAbilityPhaseInterrupted():void {
    if (!IsServer()) {
        return;
    }
    this.GetCasterPlus().StopSound("Hero_Spirit_Breaker.NetherStrike.Begin");
    if (this.vision_modifier && !this.vision_modifier.IsNull()) {
        this.vision_modifier.Destroy();
    }
    if (this.energy_modifier && !this.energy_modifier.IsNull()) {
        this.energy_modifier.Destroy();
    }
    if (USE_MEME_SOUNDS && this.randy) {
        this.GetCasterPlus().StopSound("Hero_Spirit_Breaker.RandyOrton1");
        this.randy = false;
    }
}
OnSpellStart():void {
    if (!IsServer()) {
        return;
    }
    let target = this.GetCursorTarget();
    if (this.vision_modifier && !this.vision_modifier.IsNull()) {
        this.vision_modifier.Destroy();
    }
    if (this.energy_modifier && !this.energy_modifier.IsNull()) {
        this.energy_modifier.Destroy();
    }
    if (target.TriggerSpellAbsorb(this)) {
        return undefined;
    }
    this.GetCasterPlus().EmitSound("Hero_Spirit_Breaker.NetherStrike.End");
    if (USE_MEME_SOUNDS) {
        if (this.randy) {
            this.GetCasterPlus().EmitSound("Hero_Spirit_Breaker.RandyOrton2");
            this.randy = false;
        }
        let charge_ability = this.GetCasterPlus().findAbliityPlus<imba_spirit_breaker_charge_of_darkness>("imba_spirit_breaker_charge_of_darkness");
        if (charge_ability && charge_ability.frying_pan && charge_ability.timer && GameRules.GetDOTATime(true, true) - charge_ability.timer <= 3) {
            this.GetCasterPlus().EmitSound("Hero_Spirit_Breaker.FryingPan");
            charge_ability.frying_pan = false;
            charge_ability.timer = undefined;
        }
    }
    let start_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_spirit_breaker/spirit_breaker_nether_strike_begin.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
    FindClearSpaceForUnit(this.GetCasterPlus(), target.GetAbsOrigin() + ((target.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin()).Normalized() * (54)), false);
    ProjectileManager.ProjectileDodge(this.GetCasterPlus());
    ParticleManager.SetParticleControl(start_particle, 2, this.GetCasterPlus().GetAbsOrigin());
    ParticleManager.ReleaseParticleIndex(start_particle);
    let end_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_spirit_breaker/spirit_breaker_nether_strike_end.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
    ParticleManager.ReleaseParticleIndex(end_particle);
    let greater_bash_ability = this.GetCasterPlus().findAbliityPlus<imba_spirit_breaker_greater_bash>("imba_spirit_breaker_greater_bash");
    let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("bash_radius_scepter"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
    if (greater_bash_ability && greater_bash_ability.IsTrained()) {
        greater_bash_ability.Bash(target, this.GetCasterPlus(), true);
    }
    let damageTable = {
        victim: target,
        damage: this.GetSpecialValueFor("damage"),
        damage_type: this.GetAbilityDamageType(),
        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
        attacker: this.GetCasterPlus(),
        ability: this
    }
    damage_dealt = ApplyDamage(damageTable);
    if (this.GetAutoCastState()) {
        if (!this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_spirit_breaker_nether_strike_planeswalker", this.GetCasterPlus())) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(),this, "modifier_imba_spirit_breaker_nether_strike_planeswalker", {
                duration: this.GetSpecialValueFor("planeswalker_duration")
            });
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetCastRange(this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus()), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of ipairs(enemies)) {
                if (enemy != target && !target.FindModifierByNameAndCaster("modifier_imba_spirit_breaker_nether_strike_planeswalker_enemy", this.GetCasterPlus())) {
                    enemy.AddNewModifier(this.GetCasterPlus(),this, "modifier_imba_spirit_breaker_nether_strike_planeswalker_enemy", {
                        duration: this.GetSpecialValueFor("planeswalker_duration")
                    });
                }
            }
        } else if (target.FindModifierByNameAndCaster("modifier_imba_spirit_breaker_nether_strike_planeswalker_enemy", this.GetCasterPlus())) {
            target.RemoveModifierByNameAndCaster("modifier_imba_spirit_breaker_nether_strike_planeswalker_enemy", this.GetCasterPlus());
        }
        if (this.GetCooldownTimeRemaining() <= 0) {
            this.wtf_mode = true;
        } else {
            this.wtf_mode = false;
            this.EndCooldown();
        }
    }
}
}
@registerModifier()
export class modifier_imba_spirit_breaker_nether_strike extends BaseModifier_Plus {
public big_dmg_reduction : any; 
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
BeCreated(p_0:any,):void {
    this.big_dmg_reduction = this.GetSpecialValueFor("big_dmg_reduction");
}
/** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
    }
    return Object.values(decFuncs);
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
CC_GetModifierIncomingDamage_Percentage(p_0:ModifierAttackEvent,):number {
    return this.big_dmg_reduction;
}
}
@registerModifier()
export class modifier_imba_spirit_breaker_nether_strike_vision extends BaseModifier_Plus {
IgnoreTenacity() {
    return true;
}
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
GetAttributes():DOTAModifierAttribute_t {
    return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION
    });
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
CC_GetModifierProvidesFOWVision():0|1 {
    return 1;
}
}
@registerModifier()
export class modifier_imba_spirit_breaker_nether_strike_planeswalker extends BaseModifier_Plus {
IsPurgable():boolean {
    return false;
}
GetEffectName():string {
    return "particles/units/heroes/hero_ember_spirit/ember_spirit_remnant_dash_trail_base.vpcf";
}
BeCreated(p_0:any,):void {
    if (!IsServer()) {
        return;
    }
    let planeswalker_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_spirit_breaker/spirit_breaker_nether_strike_planeswalker_buff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
    ParticleManager.SetParticleControlEnt(planeswalker_particle, 3, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
    this.AddParticle(planeswalker_particle, false, false, -1, false, false);
}
BeDestroy():void {
    if (!IsServer() || !this.GetAbilityPlus()) {
        return;
    }
    this.GetAbilityPlus().EndCooldown();
    if (!this.GetAbilityPlus().wtf_mode) {
        this.GetAbilityPlus().StartCooldown(math.max(this.GetAbilityPlus().GetEffectiveCooldown(this.GetAbilityPlus().GetLevel() - 1) - this.GetElapsedTime(), 0));
    }
}
}
@registerModifier()
export class modifier_imba_spirit_breaker_nether_strike_planeswalker_enemy extends BaseModifier_Plus {
IgnoreTenacity() {
    return true;
}
IsPurgable():boolean {
    return false;
}
GetAttributes():DOTAModifierAttribute_t {
    return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
}
BeCreated(p_0:any,):void {
    if (!IsServer()) {
        return;
    }
    let enemy_planeswalker_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_spirit_breaker/spirit_breaker_nether_strike_planeswalker.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
    this.AddParticle(enemy_planeswalker_particle, false, false, -1, false, false);
}
CheckState():Partial<Record<modifierstate,boolean>> {
    let state = {
        [modifierstate.MODIFIER_STATE_PROVIDES_VISION]: true
    }
    return state;
}
}
@registerAbility()
export class imba_spirit_breaker_greater_bash extends BaseAbility_Plus {
GetIntrinsicModifierName():string {
    return "modifier_imba_spirit_breaker_greater_bash";
}
Bash(target:IBaseNpc_Plus, parent, bUltimate) {
    if (!IsServer()) {
        return;
    }
    let parent_loc = parent.GetAbsOrigin();
    if (!target.IsCreep()) {
        target.EmitSound("Hero_Spirit_Breaker.GreaterBash");
    } else {
        target.EmitSound("Hero_Spirit_Breaker.GreaterBash.Creep");
    }
    let bash_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_spirit_breaker/spirit_breaker_greater_bash.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
    ParticleManager.ReleaseParticleIndex(bash_particle);
    if (!target.IsRoshan()) {
        let knockback_modifier = target.FindModifierByNameAndCaster("modifier_knockback", parent);
        if (knockback_modifier) {
            knockback_modifier.Destroy();
        }
        knockback_properties = {
            center_x: parent_loc.x,
            center_y: parent_loc.y,
            center_z: parent_loc.z,
            duration: this.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance()),
            knockback_duration: this.GetSpecialValueFor("knockback_duration") * (1 - target.GetStatusResistance()),
            knockback_distance: this.GetSpecialValueFor("knockback_distance"),
            knockback_height: this.GetSpecialValueFor("knockback_height")
        }
        if (bUltimate) {
            knockback_properties.knockback_distance = knockback_properties.knockback_distance * 2;
        }
        knockback_modifier = target.AddNewModifier(parent,this, "modifier_knockback", knockback_properties);
    }
    let damageTable = {
        victim: target,
        damage: parent.GetIdealSpeed() * this.GetSpecialValueFor("damage") * 0.01,
        damage_type: this.GetAbilityDamageType(),
        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
        attacker: parent,
        ability: this
    }
    damage_dealt = ApplyDamage(damageTable);
    parent.AddNewModifier(parent,this, "modifier_imba_spirit_breaker_greater_bash_speed", {
        duration: this.GetSpecialValueFor("movespeed_duration")
    });
}
}
@registerModifier()
export class modifier_special_bonus_imba_spirit_breaker_charge_speed extends BaseModifier_Plus {
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
RemoveOnDeath():boolean {
    return false;
}
}
@registerModifier()
export class modifier_special_bonus_imba_spirit_breaker_bulldoze_cooldown extends BaseModifier_Plus {
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
RemoveOnDeath():boolean {
    return false;
}
}
@registerModifier()
export class modifier_special_bonus_imba_spirit_breaker_bonus_health extends BaseModifier_Plus {
public bonus_health : number; 
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
RemoveOnDeath():boolean {
    return false;
}
BeCreated(p_0:any,):void {
    this.bonus_health = this.GetParentPlus().GetTalentValue("special_bonus_imba_spirit_breaker_bonus_health");
}
/** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS
    }
    return Object.values(decFuncs);
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
CC_GetModifierHealthBonus():number {
    return this.bonus_health;
}
}
@registerModifier()
export class modifier_special_bonus_imba_spirit_breaker_bash_chance extends BaseModifier_Plus {
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
RemoveOnDeath():boolean {
    return false;
}
}
