
import { GameFunc } from "../../../GameFunc";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_wisp_tether extends BaseAbility_Plus {
    public caster_origin: any;
    public target_origin: any;
    public tether_ally: any;
    public tether_slowedUnits: any;
    public target: IBaseNpc_Plus;
    bonus_range: number;
    slow_duration: number;
    slow: number;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_wisp_tether_handler";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().GetLevel() < this.GetSpecialValueFor("backpack_level_unlock")) {
            return super.GetBehavior();
        } else {
            return tonumber(tostring(super.GetBehavior())) + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_wisp_tether_handler", this.GetCasterPlus()) == 0) {
            return super.GetCastRange(location, target) + this.GetCasterPlus().GetTalentValue("special_bonus_imba_wisp_5");
        } else {
            return this.GetSpecialValueFor("backpack_distance") - this.GetCasterPlus().GetCastRangeBonus();
        }
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        if (target == this.GetCasterPlus()) {
            return "dota_hud_error_cant_cast_on_self";
        } else if (target.HasModifier("modifier_imba_wisp_tether") && this.GetCasterPlus().HasModifier("modifier_imba_wisp_tether_ally")) {
            return "WHY WOULD YOU DO THIS";
        }
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let casterID = caster.GetPlayerOwnerID();
            let targetID = target.GetPlayerOwnerID();
            if (target == caster) {
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
            if (target.IsCourier()) {
                return UnitFilterResult.UF_FAIL_COURIER;
            }
            if (target.HasModifier("modifier_imba_wisp_tether") && this.GetCasterPlus().HasModifier("modifier_imba_wisp_tether_ally")) {
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
            let nResult = UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), caster.GetTeamNumber());
            return nResult;
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let destroy_tree_radius = this.GetSpecialValueFor("destroy_tree_radius");
        let movespeed = this.GetSpecialValueFor("movespeed");
        let regen_bonus = this.GetSpecialValueFor("tether_bonus_regen");
        let latch_distance = this.GetSpecialValueFor("latch_distance");
        if (caster.HasTalent("special_bonus_imba_wisp_5")) {
            this.bonus_range = caster.GetTalentValue("special_bonus_imba_wisp_5");
            latch_distance = latch_distance + this.bonus_range;
        }
        this.slow_duration = this.GetSpecialValueFor("stun_duration");
        this.slow = this.GetSpecialValueFor("slow");
        this.caster_origin = this.GetCasterPlus().GetAbsOrigin();
        this.target_origin = this.GetCursorTarget().GetAbsOrigin();
        this.tether_ally = this.GetCursorTarget();
        this.tether_slowedUnits = {}
        this.target = this.GetCursorTarget();
        caster.AddNewModifier(this.target, this, "modifier_imba_wisp_tether", {});
        let tether_modifier = this.GetCursorTarget().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_wisp_tether_ally", {});
        tether_modifier.SetStackCount(movespeed);
        if (caster.HasModifier("modifier_imba_wisp_overcharge")) {
            if (this.target.HasModifier("modifier_imba_wisp_overcharge")) {
                this.target.RemoveModifierByName("modifier_imba_wisp_overcharge");
            }
            imba_wisp_overcharge.AddOvercharge(this.GetCasterPlus(), this.target);
        }
        if (caster.HasAbility("imba_wisp_overcharge_721") && caster.HasModifier("modifier_imba_wisp_overcharge_721")) {
            this.target.AddNewModifier(caster, caster.findAbliityPlus<imba_wisp_overcharge_721>("imba_wisp_overcharge_721"), "modifier_imba_wisp_overcharge_721", {});
        }
        if (caster.HasTalent("special_bonus_imba_wisp_2")) {
            this.tether_ally.SetStolenScepter(true);
            if (this.tether_ally.CalculateStatBonus) {
                this.tether_ally.CalculateStatBonus(true);
            }
        }
        if (caster.HasTalent("special_bonus_imba_wisp_6")) {
            this.target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_wisp_tether_ally_attack", {});
        }
        if (!this.GetAutoCastState()) {
            let distToAlly = (this.GetCursorTarget().GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Length2D();
            if (distToAlly >= latch_distance) {
                caster.AddNewModifier(caster, this, "modifier_imba_wisp_tether_latch", {
                    destroy_tree_radius: destroy_tree_radius
                });
            }
        } else {
            caster.AddNewModifier(this.target, this, "modifier_imba_wisp_tether_backpack", {});
        }
        if (!caster.HasAbility("imba_wisp_tether_break")) {
            caster.AddAbility("imba_wisp_tether_break");
        }
        caster.SwapAbilities("imba_wisp_tether", "imba_wisp_tether_break", false, true);
        caster.findAbliityPlus<imba_wisp_tether_break>("imba_wisp_tether_break").SetLevel(1);
        caster.findAbliityPlus<imba_wisp_tether_break>("imba_wisp_tether_break").StartCooldown(0.25);
    }
    OnUnStolen(): void {
        if (this.GetCasterPlus().HasAbility("imba_wisp_tether_break")) {
            this.GetCasterPlus().RemoveAbility("imba_wisp_tether_break");
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (target != undefined) {
            let caster = this.GetCasterPlus();
            let slow = ExtraData.slow;
            let slow_duration = ExtraData.slow_duration;
            let slow_ref = target.AddNewModifier(caster, this, "modifier_imba_wisp_tether_slow", {
                duration: slow_duration * (1 - target.GetStatusResistance())
            });
            slow_ref.SetStackCount(slow);
        }
    }
}
@registerModifier()
export class modifier_imba_wisp_tether extends BaseModifier_Plus {
    public target: IBaseNpc_Plus;
    public original_speed: number;
    public target_speed: number;
    public difference: any;
    public radius: number;
    public tether_heal_amp: any;
    public total_gained_mana: any;
    public total_gained_health: any;
    public update_timer: number;
    public time_to_send: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_SUPER_ULTRA;
    }
    BeCreated(params: any): void {
        this.target = this.GetCasterPlus();
        this.original_speed = this.GetParentPlus().GetMoveSpeedModifier(this.GetParentPlus().GetBaseMoveSpeed(), false);
        this.target_speed = this.target.GetMoveSpeedModifier(this.target.GetBaseMoveSpeed(), true);
        this.difference = this.target_speed - this.original_speed;
        if (IsServer()) {
            this.radius = this.GetSpecialValueFor("radius");
            this.tether_heal_amp = this.GetSpecialValueFor("tether_heal_amp");
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_wisp_5")) {
                this.radius = this.radius + this.GetCasterPlus().GetTalentValue("special_bonus_imba_wisp_5");
            }
            this.total_gained_mana = 0;
            this.total_gained_health = 0;
            this.update_timer = 0;
            this.time_to_send = 1;
            this.GetCasterPlus().EmitSound("Hero_Wisp.Tether");
        }
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        this.difference = 0;
        this.original_speed = this.GetParentPlus().GetMoveSpeedModifier(this.GetParentPlus().GetBaseMoveSpeed(), false);
        this.target_speed = this.target.GetMoveSpeedModifier(this.target.GetBaseMoveSpeed(), true);
        this.difference = this.target_speed - this.original_speed;
        if (!IsServer()) {
            return;
        }
        if (!this.GetAbilityPlus() || !this.GetAbilityPlus<imba_wisp_tether>().tether_ally) {
            this.Destroy();
            return;
        }
        this.update_timer = this.update_timer + FrameTime();
        if (this.update_timer > this.time_to_send) {
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, this.target, this.total_gained_health * this.tether_heal_amp, undefined);
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_MANA_ADD, this.target, this.total_gained_mana * this.tether_heal_amp, undefined);
            this.total_gained_mana = 0;
            this.total_gained_health = 0;
            this.update_timer = 0;
        }
        if ((this.GetParentPlus().IsOutOfGame())) {
            this.GetParentPlus().RemoveModifierByName("modifier_imba_wisp_tether");
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_imba_wisp_tether_latch")) {
            return;
        }
        if ((this.GetAbilityPlus<imba_wisp_tether>().tether_ally.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D() <= this.radius) {
            return;
        }
        this.GetParentPlus().RemoveModifierByName("modifier_imba_wisp_tether");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_HEAL_RECEIVED,
            2: Enum_MODIFIER_EVENT.ON_MANA_GAINED,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BASE_OVERRIDE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT,
            6: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_HEAL_RECEIVED)
    CC_OnHealReceived(keys: ModifierHealEvent): void {
        if (keys.unit == this.GetParentPlus()) {
            this.target.Heal(keys.gain * this.tether_heal_amp, this.GetAbilityPlus());
            this.total_gained_health = this.total_gained_health + keys.gain;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_MANA_GAINED)
    CC_OnManaGained(keys: ModifierHealEvent): void {
        if (keys.unit == this.GetParentPlus() && this.target.GiveMana) {
            this.target.GiveMana(keys.gain * this.tether_heal_amp);
            this.total_gained_mana = this.total_gained_mana + keys.gain;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BASE_OVERRIDE)
    CC_GetModifierMoveSpeedOverride(): number {
        if (this.target && this.target.GetBaseMoveSpeed) {
            return this.target.GetBaseMoveSpeed();
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        if (this.original_speed && this.target.GetMoveSpeedModifier(this.target.GetBaseMoveSpeed(), true) >= this.original_speed && this.difference) {
            return this.difference;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT)
    CC_GetModifierMoveSpeed_Limit(): number {
        return this.target_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT)
    CC_GetModifierIgnoreMovespeedLimit(): 0 | 1 {
        return 1;
    }
    OnRemoved(): void {
        if (IsServer()) {
            if (this.GetParentPlus().HasModifier("modifier_imba_wisp_tether_latch")) {
                this.GetParentPlus().RemoveModifierByName("modifier_imba_wisp_tether_latch");
            }
            if (this.GetParentPlus().HasModifier("modifier_imba_wisp_tether_backpack")) {
                this.GetParentPlus().RemoveModifierByName("modifier_imba_wisp_tether_backpack");
            }
            if (this.target.HasModifier("modifier_imba_wisp_tether_ally")) {
                this.target.RemoveModifierByName("modifier_imba_wisp_overcharge");
                this.target.RemoveModifierByName("modifier_imba_wisp_tether_ally");
            }
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_wisp_2")) {
                this.target.SetStolenScepter(false);
                // if (this.target.CalculateStatBonus) {
                //     this.target.CalculateStatBonus(true);
                // }
            }
            this.GetCasterPlus().EmitSound("Hero_Wisp.Tether.Stop");
            this.GetCasterPlus().StopSound("Hero_Wisp.Tether");
            this.GetParentPlus().SwapAbilities("imba_wisp_tether_break", "imba_wisp_tether", false, true);
        }
    }
}
@registerModifier()
export class modifier_imba_wisp_tether_ally extends BaseModifier_Plus {
    public pfx: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_wisp/wisp_tether.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
            ParticleManager.SetParticleControlEnt(this.pfx, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(this.pfx, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
            EmitSoundOn("Hero_Wisp.Tether.Target", this.GetParentPlus());
            this.StartIntervalThink(FrameTime());
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
                return;
            }
            let velocity = this.GetParentPlus().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector;
            let vVelocity = velocity / FrameTime() as Vector;
            vVelocity.z = 0;
            let projectile = {
                Ability: this.GetAbilityPlus(),
                vSpawnOrigin: this.GetCasterPlus().GetAbsOrigin(),
                fDistance: velocity.Length2D(),
                fStartRadius: 100,
                fEndRadius: 100,
                bReplaceExisting: false,
                iMoveSpeed: vVelocity,
                Source: this.GetCasterPlus(),
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                fExpireTime: GameRules.GetGameTime() + 1,
                bDeleteOnHit: false,
                vVelocity: vVelocity / 3 as Vector,
                ExtraData: {
                    slow_duration: this.GetAbilityPlus<imba_wisp_tether>().slow_duration,
                    slow: this.GetAbilityPlus<imba_wisp_tether>().slow
                }
            }
            ProjectileManager.CreateLinearProjectile(projectile);
        }
    }
    OnRemoved(): void {
        if (IsServer()) {
            this.GetParentPlus().StopSound("Hero_Wisp.Tether.Target");
            ParticleManager.DestroyParticle(this.pfx, false);
            ParticleManager.ReleaseParticleIndex(this.pfx);
            if (this.GetAbilityPlus()) {
                this.GetAbilityPlus<imba_wisp_tether>().target = undefined;
            }
            this.GetParentPlus().RemoveModifierByName("modifier_imba_wisp_tether_ally_attack");
            this.GetCasterPlus().RemoveModifierByName("modifier_imba_wisp_tether");
            let overcharge_modifier = this.GetParentPlus().FindModifierByNameAndCaster("modifier_imba_wisp_overcharge_721", this.GetCasterPlus());
            if (overcharge_modifier) {
                overcharge_modifier.Destroy();
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.GetAbilityPlus()) {
            return this.GetSpecialValueFor("movespeed");
        }
    }
}
@registerModifier()
export class modifier_imba_wisp_tether_ally_attack extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(params: ModifierAttackEvent): void {
        if (IsServer()) {
            if (params.attacker == this.GetParentPlus()) {
                this.GetCasterPlus().PerformAttack(params.target, true, true, true, false, true, false, false);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_wisp_tether_slow extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_wisp_tether_latch extends BaseModifier_Plus {
    public target: IBaseNpc_Plus;
    public destroy_tree_radius: number;
    public final_latch_distance: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            this.target = this.GetAbilityPlus<imba_wisp_tether>().target;
            this.destroy_tree_radius = params.destroy_tree_radius;
            this.final_latch_distance = 300;
            this.StartIntervalThink(FrameTime());
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.GetParentPlus().IsStunned() || this.GetParentPlus().IsHexed() || this.GetParentPlus().IsOutOfGame() || (this.GetParentPlus().IsFeared && this.GetParentPlus().IsFeared()) || (this.GetParentPlus().IsHypnotized && this.GetParentPlus().IsHypnotized()) || this.GetParentPlus().IsRooted()) {
                this.StartIntervalThink(-1);
                this.Destroy();
                return;
            }
            let casterDir = this.GetCasterPlus().GetAbsOrigin() - this.target.GetAbsOrigin() as Vector;
            let distToAlly = casterDir.Length2D();
            casterDir = casterDir.Normalized();
            if (distToAlly > this.final_latch_distance) {
                distToAlly = distToAlly - this.GetSpecialValueFor("latch_speed") * FrameTime();
                distToAlly = math.max(distToAlly, this.final_latch_distance);
                let pos = this.target.GetAbsOrigin() + casterDir * distToAlly as Vector;
                pos = GetGroundPosition(pos, this.GetCasterPlus());
                this.GetCasterPlus().SetAbsOrigin(pos);
            }
            if (distToAlly <= this.final_latch_distance) {
                GridNav.DestroyTreesAroundPoint(this.GetCasterPlus().GetAbsOrigin(), this.destroy_tree_radius, false);
                ResolveNPCPositions(this.GetCasterPlus().GetAbsOrigin(), 128);
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_wisp_tether_latch");
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        FindClearSpaceForUnit(this.GetParentPlus(), this.GetParentPlus().GetAbsOrigin(), false);
    }
}
@registerAbility()
export class imba_wisp_tether_break extends BaseAbility_Plus {
    IsInnateAbility() {
        return true;
    }
    IsStealable(): boolean {
        return false;
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    OnSpellStart(): void {
        if (!this.GetCasterPlus().HasAbility("imba_wisp_tether")) {
            let stolenAbility = this.GetCasterPlus().AddAbility("imba_wisp_tether");
            stolenAbility.SetLevel(math.min((this.GetCasterPlus().GetLevel() / 2) - 1, 4));
            this.GetCasterPlus().SwapAbilities("imba_wisp_tether_break", "imba_wisp_tether", false, true);
        }
        this.GetCasterPlus().RemoveModifierByName("modifier_imba_wisp_tether");
        let target = this.GetCasterPlus().findAbliityPlus<imba_wisp_tether>("imba_wisp_tether").target;
        if (target != undefined && target.HasModifier("modifier_imba_wisp_overcharge")) {
            target.RemoveModifierByName("modifier_imba_wisp_overcharge");
        }
    }
    OnUnStolen(): void {
        if (this.GetCasterPlus().HasAbility("imba_wisp_tether")) {
            this.GetCasterPlus().RemoveAbility("imba_wisp_tether");
        }
    }
}
@registerModifier()
export class modifier_imba_wisp_tether_handler extends BaseModifier_Plus {
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
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ORDER
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (!IsServer() || keys.unit != this.GetParentPlus() || keys.order_type != dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO || keys.ability != this.GetAbilityPlus()) {
            return;
        }
        if (this.GetAbilityPlus().GetAutoCastState()) {
            this.SetStackCount(0);
        } else {
            this.SetStackCount(1);
        }
    }
}
@registerModifier()
export class modifier_imba_wisp_tether_backpack extends BaseModifier_Plus {
    public backpack_distance: number;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.backpack_distance = this.GetSpecialValueFor("backpack_distance");
        this.GetParentPlus().SetAbsOrigin(this.GetCasterPlus().GetAbsOrigin() + (this.GetCasterPlus().GetForwardVector() * this.backpack_distance * (-1)) as Vector);
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (this.GetParentPlus().IsStunned() || this.GetParentPlus().IsHexed() || this.GetParentPlus().IsRooted() || this.GetParentPlus().IsOutOfGame()) {
            this.Destroy();
            return;
        }
        this.GetParentPlus().SetAbsOrigin(this.GetCasterPlus().GetAbsOrigin() + (this.GetCasterPlus().GetForwardVector() * this.backpack_distance * (-1)) as Vector);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        FindClearSpaceForUnit(this.GetParentPlus(), this.GetParentPlus().GetAbsOrigin(), false);
    }
}
@registerAbility()
export class imba_wisp_spirits extends BaseAbility_Plus {
    public caster: IBaseNpc_Plus;
    public start_time: number;
    public spirits_num_spirits: number = 0;
    public spirits_movementFactor: any;
    spirits_spiritsSpawned: { [k: string]: IBaseNpc_Plus };
    update_timer: number;
    hit_table: IBaseNpc_Plus[];
    GetCooldown(level: number): number {
        return super.GetCooldown(level) * math.max(this.GetCasterPlus().GetTalentValue("special_bonus_imba_wisp_10", "cdr_mult"), 1);
    }
    OnSpellStart(): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.start_time = GameRules.GetGameTime();
            this.spirits_num_spirits = 0;
            let spirit_min_radius = this.GetSpecialValueFor("min_range");
            let spirit_max_radius = this.GetSpecialValueFor("max_range");
            let spirit_movement_rate = this.GetSpecialValueFor("spirit_movement_rate");
            let creep_damage = this.GetSpecialValueFor("creep_damage");
            let explosion_damage = this.GetTalentSpecialValueFor("explosion_damage");
            let slow = this.GetSpecialValueFor("slow");
            let spirit_duration = this.GetSpecialValueFor("spirit_duration");
            let spirit_summon_interval = this.GetSpecialValueFor("spirit_summon_interval");
            let max_spirits = this.GetSpecialValueFor("num_spirits");
            let collision_radius = this.GetSpecialValueFor("collision_radius");
            let explosion_radius = this.GetSpecialValueFor("explode_radius");
            let spirit_turn_rate = this.GetSpecialValueFor("spirit_turn_rate");
            let vision_radius = this.GetSpecialValueFor("explode_radius");
            let vision_duration = this.GetSpecialValueFor("vision_duration");
            let slow_duration = this.GetSpecialValueFor("slow_duration");
            let damage_interval = this.GetSpecialValueFor("damage_interval");
            if (this.caster.HasTalent("special_bonus_imba_wisp_10")) {
                spirit_movement_rate = spirit_movement_rate * math.max(this.caster.GetTalentValue("special_bonus_imba_wisp_10"), 1);
                spirit_summon_interval = spirit_summon_interval / math.max(this.caster.GetTalentValue("special_bonus_imba_wisp_10"), 1);
                max_spirits = max_spirits * math.max(this.caster.GetTalentValue("special_bonus_imba_wisp_10"), 1);
                spirit_turn_rate = spirit_turn_rate * math.max(this.caster.GetTalentValue("special_bonus_imba_wisp_10"), 1);
            }
            this.spirits_movementFactor = 1;
            this.spirits_spiritsSpawned = {};
            EmitSoundOn("Hero_Wisp.Spirits.Cast", this.caster);
            if (this.caster.HasModifier("modifier_imba_wisp_spirits")) {
                this.caster.RemoveModifierByName("modifier_imba_wisp_spirits");
            }
            if (!this.caster.HasAbility("imba_wisp_spirits_toggle")) {
                this.caster.AddAbility("imba_wisp_spirits_toggle");
            }
            this.caster.SwapAbilities("imba_wisp_spirits", "imba_wisp_spirits_toggle", false, true);
            this.caster.findAbliityPlus<imba_wisp_spirits_toggle>("imba_wisp_spirits_toggle").SetLevel(1);
            this.caster.AddNewModifier(this.caster, this, "modifier_imba_wisp_spirits", {
                duration: spirit_duration,
                spirits_starttime: GameRules.GetGameTime(),
                spirit_summon_interval: spirit_summon_interval,
                max_spirits: max_spirits,
                collision_radius: collision_radius,
                explosion_radius: explosion_radius,
                spirit_min_radius: spirit_min_radius,
                spirit_max_radius: spirit_max_radius,
                spirit_movement_rate: spirit_movement_rate,
                spirit_turn_rate: spirit_turn_rate,
                vision_radius: vision_radius,
                vision_duration: vision_duration,
                creep_damage: creep_damage,
                explosion_damage: explosion_damage,
                slow_duration: slow_duration,
                slow: slow
            });
            this.caster.AddNewModifier(this.caster, this, "modifier_imba_wisp_spirit_damage_handler", {
                duration: -1,
                damage_interval: damage_interval
            });
        }
    }
    OnUnStolen(): void {
        if (this.GetCasterPlus().HasAbility("imba_wisp_spirits_toggle")) {
            this.GetCasterPlus().RemoveAbility("imba_wisp_spirits_toggle");
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_wisp_10") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_wisp_10")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_wisp_10"), "modifier_special_bonus_imba_wisp_10", {});
        }
    }
}
@registerModifier()
export class modifier_imba_wisp_spirit_damage_handler extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: imba_wisp_spirits;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.StartIntervalThink(params.damage_interval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            this.ability.hit_table = [];
        }
    }
}
@registerModifier()
export class modifier_imba_wisp_spirits extends BaseModifier_Plus {
    public start_time: number;
    public spirit_summon_interval: number;
    public max_spirits: any;
    public collision_radius: number;
    public explosion_radius: number;
    public spirit_radius: number;
    public spirit_min_radius: number;
    public spirit_max_radius: number;
    public spirit_movement_rate: any;
    public spirit_turn_rate: any;
    public vision_radius: number;
    public vision_duration: number;
    public creep_damage: number;
    public explosion_damage: number;
    public slow_duration: number;
    public slow: any;
    public time_to_update: number;
    public true_sight_radius: number;
    BeCreated(params: any): void {
        if (IsServer()) {
            this.start_time = params.spirits_starttime;
            this.spirit_summon_interval = params.spirit_summon_interval;
            this.max_spirits = params.max_spirits;
            this.collision_radius = params.collision_radius;
            this.explosion_radius = params.explosion_radius;
            this.spirit_radius = params.collision_radius;
            this.spirit_min_radius = params.spirit_min_radius;
            this.spirit_max_radius = params.spirit_max_radius;
            this.spirit_movement_rate = params.spirit_movement_rate;
            this.spirit_turn_rate = params.spirit_turn_rate;
            this.vision_radius = params.vision_radius;
            this.vision_duration = params.vision_duration;
            this.creep_damage = params.creep_damage;
            this.explosion_damage = params.explosion_damage;
            this.slow_duration = params.slow_duration;
            this.slow = params.slow;
            this.GetAbilityPlus<imba_wisp_spirits>().update_timer = 0;
            this.time_to_update = 0.5;
            EmitSoundOn("Hero_Wisp.Spirits.Loop", this.GetCasterPlus());
            this.StartIntervalThink(0.03);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_position = caster.GetAbsOrigin();
            let ability = this.GetAbilityPlus<imba_wisp_spirits>();
            let elapsedTime = GameRules.GetGameTime() - this.start_time;
            let idealNumSpiritsSpawned = elapsedTime / this.spirit_summon_interval;
            ability.update_timer = ability.update_timer + FrameTime();
            idealNumSpiritsSpawned = math.min(idealNumSpiritsSpawned, this.max_spirits);
            if (ability.spirits_num_spirits < idealNumSpiritsSpawned) {
                let newSpirit = BaseNpc_Plus.CreateUnitByName("npc_dota_wisp_spirit", caster_position, caster.GetTeam(), false, caster, caster);
                // let pfx = ResHelper.CreateParticleEx(particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, newSpirit);
                if (caster.HasModifier("modifier_imba_wisp_swap_spirits_disarm")) {
                    let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_wisp/wisp_guardian_disarm_a.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, newSpirit);
                    newSpirit.TempData().spirit_pfx_disarm = pfx;
                } else if (caster.HasModifier("modifier_imba_wisp_swap_spirits_silence")) {
                    let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_wisp/wisp_guardian_silence_a.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, newSpirit);
                    newSpirit.TempData().spirit_pfx_silence = pfx;
                } else {
                    let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_wisp/wisp_guardian.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, newSpirit, caster);
                    newSpirit.TempData().spirit_pfx_silence = pfx;
                }
                if (caster.HasTalent("special_bonus_imba_wisp_3")) {
                    this.true_sight_radius = caster.GetTalentValue("special_bonus_imba_wisp_3", "true_sight_radius");
                    let true_sight_aura = newSpirit.AddNewModifier(caster, ability, "modifier_imba_wisp_spirits_true_sight", {});
                    true_sight_aura.SetStackCount(this.true_sight_radius);
                    newSpirit.SetDayTimeVisionRange(this.true_sight_radius);
                    newSpirit.SetNightTimeVisionRange(this.true_sight_radius);
                }
                let spiritIndex = ability.spirits_num_spirits + 1;
                newSpirit.TempData().spirit_index = spiritIndex;
                ability.spirits_num_spirits = spiritIndex;
                ability.spirits_spiritsSpawned[spiritIndex + ""] = newSpirit;
                newSpirit.AddNewModifier(caster, ability, "modifier_imba_wisp_spirit_handler", {
                    duraiton: -1,
                    vision_radius: this.vision_radius,
                    vision_duration: this.vision_duration,
                    tinkerval: 360 / this.spirit_turn_rate / this.max_spirits,
                    collision_radius: this.collision_radius,
                    explosion_radius: this.explosion_radius,
                    creep_damage: this.creep_damage,
                    explosion_damage: this.explosion_damage,
                    slow_duration: this.slow_duration,
                    slow: this.slow
                });
            }
            let currentRadius = this.spirit_radius;
            let deltaRadius = ability.spirits_movementFactor * this.spirit_movement_rate * 0.03;
            currentRadius = currentRadius + deltaRadius;
            currentRadius = math.min(math.max(currentRadius, this.spirit_min_radius), this.spirit_max_radius);
            this.spirit_radius = currentRadius;
            let currentRotationAngle = elapsedTime * this.spirit_turn_rate;
            let rotationAngleOffset = 360 / this.max_spirits;
            let numSpiritsAlive = 0;
            for (const [k, spirit] of GameFunc.Pair(ability.spirits_spiritsSpawned)) {
                if (!spirit.IsNull()) {
                    numSpiritsAlive = numSpiritsAlive + 1;
                    let rotationAngle = currentRotationAngle - rotationAngleOffset * (tonumber(k) - 1);
                    let relPos = Vector(0, currentRadius, 0);
                    relPos = RotatePosition(Vector(0, 0, 0), QAngle(0, -rotationAngle, 0), relPos);
                    let absPos = GetGroundPosition(relPos + caster_position as Vector, spirit) as Vector;
                    spirit.SetAbsOrigin(absPos);
                    if (ability.update_timer > this.time_to_update) {
                        if (caster.HasModifier("modifier_imba_wisp_swap_spirits_disarm")) {
                            if (spirit.TempData().spirit_pfx_silence != undefined) {
                                ParticleManager.DestroyParticle(spirit.TempData().spirit_pfx_silence, true);
                            }
                        } else if (caster.HasModifier("modifier_imba_wisp_swap_spirits_silence")) {
                            if (spirit.TempData().spirit_pfx_disarm != undefined) {
                                ParticleManager.DestroyParticle(spirit.TempData().spirit_pfx_disarm, true);
                            }
                        }
                    }
                    if (spirit.TempData().spirit_pfx_silence != undefined) {
                        spirit.TempData().currentRadius = Vector(currentRadius, 0, 0);
                        ParticleManager.SetParticleControl(spirit.TempData().spirit_pfx_silence, 1, Vector(currentRadius, 0, 0));
                    }
                    if (spirit.TempData().spirit_pfx_disarm != undefined) {
                        spirit.TempData().currentRadius = Vector(currentRadius, 0, 0);
                        ParticleManager.SetParticleControl(spirit.TempData().spirit_pfx_disarm, 1, Vector(currentRadius, 0, 0));
                    }
                }
            }
            if (ability.update_timer > this.time_to_update) {
                ability.update_timer = 0;
            }
            if (ability.spirits_num_spirits == this.max_spirits && numSpiritsAlive == 0) {
                caster.RemoveModifierByName("modifier_imba_wisp_spirits");
                return;
            }
        }
    }
    static Explode(caster: IBaseNpc_Plus, spirit: IBaseNpc_Plus, explosion_radius: number, explosion_damage: number, ability: imba_wisp_spirits) {
        if (IsServer()) {
            EmitSoundOn("Hero_Wisp.Spirits.Target", spirit);
            ResHelper.CreateParticleEx("particles/units/heroes/hero_wisp/wisp_guardian_explosion.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, spirit, caster);
            let nearby_enemy_units = FindUnitsInRadius(caster.GetTeam(), spirit.GetAbsOrigin(), undefined, explosion_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            let damage_table: ApplyDamageOptions = {} as ApplyDamageOptions
            damage_table.attacker = caster;
            damage_table.ability = ability;
            damage_table.damage_type = ability.GetAbilityDamageType();
            damage_table.damage = explosion_damage;
            for (const [_, enemy] of ipairs(nearby_enemy_units)) {
                if (enemy != undefined) {
                    damage_table.victim = enemy;
                    ApplyDamage(damage_table);
                }
            }
            if (spirit.TempData().spirit_pfx_silence != undefined) {
                ParticleManager.DestroyParticle(spirit.TempData().spirit_pfx_silence, true);
                ParticleManager.ReleaseParticleIndex(spirit.TempData().spirit_pfx_silence);
            }
            delete ability.spirits_spiritsSpawned[spirit.TempData().spirit_index];
        }
    }
    OnRemoved(): void {
        if (IsServer()) {
            this.GetCasterPlus().SwapAbilities("imba_wisp_spirits_toggle", "imba_wisp_spirits", false, true);
            let ability = this.GetAbilityPlus<imba_wisp_spirits>();
            let caster = this.GetCasterPlus();
            for (const [k, spirit] of GameFunc.Pair(ability.spirits_spiritsSpawned)) {
                if (!spirit.IsNull()) {
                    spirit.RemoveModifierByName("modifier_imba_wisp_spirit_handler");
                }
            }
            this.GetCasterPlus().StopSound("Hero_Wisp.Spirits.Loop");
        }
    }
}
@registerModifier()
export class modifier_imba_wisp_spirits_true_sight extends BaseModifier_Plus {
    IsAura(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.GetStackCount();
    }
    GetModifierAura(): string {
        return "modifier_truesight";
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER;
    }
    GetAuraDuration(): number {
        return 0.5;
    }
}
@registerModifier()
export class modifier_imba_wisp_spirits_creep_hit extends BaseModifier_Plus {
    public pfx: any;
    IsHidden(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let target = this.GetParentPlus();
            EmitSoundOn("Hero_Wisp.Spirits.TargetCreep", target);
            this.pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_wisp/wisp_guardian_explosion_small.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target, this.GetCasterPlus());
        }
    }
    OnRemoved(): void {
        if (IsServer()) {
            ParticleManager.DestroyParticle(this.pfx, false);
        }
    }
}
@registerModifier()
export class modifier_imba_wisp_spirits_hero_hit extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            let target = this.GetParentPlus();
            let slow_modifier = target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_wisp_spirits_slow", {
                duration: params.slow_duration * (1 - target.GetStatusResistance())
            });
            slow_modifier.SetStackCount(params.slow);
        }
    }
}
@registerModifier()
export class modifier_imba_wisp_spirits_slow extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_wisp_spirit_handler extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: imba_wisp_spirits;
    public vision_radius: number;
    public vision_duration: number;
    public tinkerval: any;
    public collision_radius: number;
    public explosion_radius: number;
    public creep_damage: number;
    public explosion_damage: number;
    public slow_duration: number;
    public slow: any;
    public damage_interval: number;
    public damage_timer: number;
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_NO_TEAM_MOVE_TO]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_SELECT]: true,
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true,
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true
        }
        return state;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.vision_radius = params.vision_radius;
            this.vision_duration = params.vision_duration;
            this.tinkerval = params.tinkerval;
            this.collision_radius = params.collision_radius;
            this.explosion_radius = params.explosion_radius;
            this.creep_damage = params.creep_damage;
            this.explosion_damage = params.explosion_damage;
            this.slow_duration = params.slow_duration;
            this.slow = params.slow;
            this.damage_interval = 0.10;
            this.damage_timer = 0;
            this.ability.hit_table = []
            this.StartIntervalThink(this.damage_interval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let spirit = this.GetParentPlus();
            let nearby_enemy_units = FindUnitsInRadius(this.caster.GetTeam(), spirit.GetAbsOrigin(), undefined, this.collision_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            spirit.TempData().hit_table = this.ability.hit_table;
            if (nearby_enemy_units != undefined && GameFunc.GetCount(nearby_enemy_units) > 0) {
                this.OnHit(this.caster, spirit, nearby_enemy_units, this.creep_damage, this.ability, this.slow_duration, this.slow);
            }
        }
    }
    OnHit(caster: IBaseNpc_Plus, spirit: IBaseNpc_Plus, enemies_hit: IBaseNpc_Plus[], creep_damage: number, ability: IBaseAbility_Plus, slow_duration: number, slow: number) {
        let hit_hero = false;
        let damage_table = {} as ApplyDamageOptions;
        damage_table.attacker = caster;
        damage_table.ability = ability;
        damage_table.damage_type = ability.GetAbilityDamageType();
        for (const enemy of (enemies_hit)) {
            if (enemy.IsAlive() && !spirit.IsNull()) {
                let hit = false;
                damage_table.victim = enemy;
                if (enemy.IsConsideredHero() && !enemy.IsIllusion()) {
                    enemy.AddNewModifier(caster, ability, "modifier_imba_wisp_spirits_hero_hit", {
                        duration: 0.03,
                        slow_duration: slow_duration,
                        slow: slow
                    });
                    if (caster.HasModifier("modifier_imba_wisp_swap_spirits_disarm")) {
                        enemy.AddNewModifier(caster, ability, "modifier_disarmed", {
                            duration: ability.GetSpecialValueFor("spirit_debuff_duration") * (1 - enemy.GetStatusResistance())
                        });
                    } else if (caster.HasModifier("modifier_imba_wisp_swap_spirits_silence")) {
                        enemy.AddNewModifier(caster, ability, "modifier_silence", {
                            duration: ability.GetSpecialValueFor("spirit_debuff_duration") * (1 - enemy.GetStatusResistance())
                        });
                    }
                    hit_hero = true;
                } else {
                    if (!spirit.TempData<IBaseNpc_Plus[]>().hit_table.includes(enemy)) {
                        spirit.TempData<IBaseNpc_Plus[]>().hit_table.push(enemy);
                        enemy.AddNewModifier(caster, ability, "modifier_imba_wisp_spirits_creep_hit", {
                            duration: 0.03
                        });
                        damage_table.damage = creep_damage;
                        hit = true;
                    }
                }
                if (hit) {
                    ApplyDamage(damage_table);
                }
            }
        }
        if (hit_hero) {
            spirit.RemoveModifierByName("modifier_imba_wisp_spirit_handler");
        }
    }
    OnRemoved(): void {
        if (IsServer()) {
            let spirit = this.GetParentPlus();
            modifier_imba_wisp_spirits.Explode(this.caster, spirit, this.explosion_radius, this.explosion_damage, this.ability);
            if (spirit.TempData().spirit_pfx_silence != undefined) {
                ParticleManager.DestroyParticle(spirit.TempData().spirit_pfx_silence, true);
            }
            if (spirit.TempData().spirit_pfx_disarm != undefined) {
                ParticleManager.DestroyParticle(spirit.TempData().spirit_pfx_disarm, true);
            }
            this.ability.CreateVisibilityNode(spirit.GetAbsOrigin(), this.vision_radius, this.vision_duration);
            spirit.ForceKill(true);
        }
    }
}
@registerAbility()
export class imba_wisp_spirits_toggle extends BaseAbility_Plus {
    IsStealable(): boolean {
        return false;
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            if (!this.GetCasterPlus().HasAbility("imba_wisp_spirits")) {
                let stolenAbility = this.GetCasterPlus().AddAbility("imba_wisp_spirits");
                stolenAbility.SetLevel(math.min((this.GetCasterPlus().GetLevel() / 2) - 1, 4));
                this.GetCasterPlus().SwapAbilities("imba_wisp_spirits_toggle", "imba_wisp_spirits", false, true);
            }
            let caster = this.GetCasterPlus();
            let ability = caster.findAbliityPlus<imba_wisp_spirits>("imba_wisp_spirits");
            let spirits_movementFactor = ability.spirits_movementFactor;
            if (ability.spirits_movementFactor == 1) {
                ability.spirits_movementFactor = -1;
            } else {
                ability.spirits_movementFactor = 1;
            }
        }
    }
    OnUnStolen(): void {
        if (this.GetCasterPlus().HasAbility("imba_wisp_spirits")) {
            this.GetCasterPlus().RemoveAbility("imba_wisp_spirits");
        }
    }
}
@registerAbility()
export class imba_wisp_swap_spirits extends BaseAbility_Plus {
    public particles: any;
    IsInnateAbility() {
        return true;
    }
    IsStealable(): boolean {
        return false;
    }

    GetIntrinsicModifierName(): string {
        return "modifier_imba_wisp_swap_spirits_silence";
    }
    GetAbilityTextureName(): string {
        if (this.GetCasterPlus().HasModifier("modifier_imba_wisp_swap_spirits_silence")) {
            return "wisp_swap_spirits_silence";
        } else if (this.GetCasterPlus().HasModifier("modifier_imba_wisp_swap_spirits_disarm")) {
            return "wisp_swap_spirits_disarm";
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = caster.findAbliityPlus<imba_wisp_spirits>("imba_wisp_spirits");
            let particle = undefined;
            let silence = false;
            let disarm = false;
            if (!this.particles) {
                this.particles = {}
            }
            if (caster.HasModifier("modifier_imba_wisp_swap_spirits_disarm")) {
                caster.RemoveModifierByName("modifier_imba_wisp_swap_spirits_disarm");
                caster.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_wisp_swap_spirits_silence", {});
            } else if (caster.HasModifier("modifier_imba_wisp_swap_spirits_silence")) {
                caster.RemoveModifierByName("modifier_imba_wisp_swap_spirits_silence");
                caster.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_wisp_swap_spirits_disarm", {});
            }
            if (caster.HasModifier("modifier_imba_wisp_swap_spirits_silence")) {
                particle = "particles/units/heroes/hero_wisp/wisp_guardian_silence_a.vpcf";
                silence = true;
                disarm = false;
            } else if (caster.HasModifier("modifier_imba_wisp_swap_spirits_disarm")) {
                particle = "particles/units/heroes/hero_wisp/wisp_guardian_disarm_a.vpcf";
                silence = false;
                disarm = true;
            }
            if (ability.spirits_spiritsSpawned) {
                for (const [k, spirit] of ipairs(ability.spirits_spiritsSpawned)) {
                    if (!spirit.IsNull()) {
                        if (this.particles[k]) {
                            ParticleManager.DestroyParticle(this.particles[k], false);
                            ParticleManager.ReleaseParticleIndex(this.particles[k]);
                        }
                        this.particles[k] = ResHelper.CreateParticleEx(particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, spirit);
                        if (silence) {
                            spirit.TempData().spirit_pfx_silence = this.particles[k];
                        } else if (disarm) {
                            spirit.TempData().spirit_pfx_disarm = this.particles[k];
                        }
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_wisp_swap_spirits_disarm extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_wisp_swap_spirits_silence extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerAbility()
export class imba_wisp_overcharge extends BaseAbility_Plus {
    IsNetherWardStealable() {
        return false;
    }
    static AddOvercharge(caster: IBaseNpc_Plus, target: IBaseNpc_Plus, efficiency: number = null, overcharge_duration: number = null) {
        let ability = caster.findAbliityPlus<imba_wisp_overcharge>("imba_wisp_overcharge");
        let tether_ability = caster.findAbliityPlus<imba_wisp_tether>("imba_wisp_tether");
        let bonus_attack_speed = ability.GetSpecialValueFor("bonus_attack_speed");
        let bonus_cast_speed = ability.GetSpecialValueFor("bonus_cast_speed");
        let bonus_missile_speed = ability.GetSpecialValueFor("bonus_missile_speed");
        let bonus_damage_pct = ability.GetSpecialValueFor("bonus_damage_pct");
        let bonus_attack_range = ability.GetSpecialValueFor("bonus_attack_range");
        if (caster.HasTalent("special_bonus_imba_wisp_1")) {
            let bonus_effect = caster.GetTalentValue("special_bonus_imba_wisp_1");
            bonus_attack_speed = bonus_attack_speed + bonus_effect;
            bonus_cast_speed = bonus_cast_speed;
            bonus_missile_speed = bonus_missile_speed + bonus_effect;
            bonus_attack_range = bonus_attack_range + bonus_effect;
        }
        if (caster.HasTalent("special_bonus_imba_wisp_4")) {
            let damage_reduction = caster.GetTalentValue("special_bonus_imba_wisp_4");
            bonus_damage_pct = bonus_damage_pct - damage_reduction;
        }
        if (caster.HasTalent("special_bonus_imba_wisp_8") && efficiency == 1.0) {
            let bonus_regen = caster.GetTalentValue("special_bonus_imba_wisp_8", "bonus_regen");
            let overcharge_regen = caster.AddNewModifier(caster, ability, "modifier_imba_wisp_overcharge_regen_talent", {});
            overcharge_regen.SetStackCount(bonus_regen);
        }
        if (efficiency != undefined && efficiency < 1.0) {
            bonus_attack_speed = bonus_attack_speed * efficiency;
            bonus_cast_speed = bonus_cast_speed * efficiency;
            bonus_missile_speed = bonus_missile_speed * efficiency;
            bonus_attack_range = bonus_attack_range * efficiency;
            bonus_damage_pct = bonus_damage_pct * efficiency;
        }
        NetTablesHelper.SetDotaEntityData(ability.GetEntityIndex(), {
            overcharge_bonus_attack_speed: bonus_attack_speed,
            overcharge_bonus_cast_speed: bonus_cast_speed,
            overcharge_bonus_missile_speed: bonus_missile_speed,
            overcharge_bonus_damage_pct: bonus_damage_pct,
            overcharge_bonus_attack_range: bonus_attack_range
        }, ability.GetAbilityName());
        target.AddNewModifier(caster, ability, "modifier_imba_wisp_overcharge", {
            duration: overcharge_duration,
            bonus_attack_speed: bonus_attack_speed,
            bonus_cast_speed: bonus_cast_speed,
            bonus_missile_speed: bonus_missile_speed,
            bonus_damage_pct: bonus_damage_pct,
            bonus_attack_range: bonus_attack_range
        });
    }
    OnToggle(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = caster.findAbliityPlus<imba_wisp_overcharge>("imba_wisp_overcharge");
            let tether_ability = caster.findAbliityPlus<imba_wisp_tether>("imba_wisp_tether");
            if (ability.GetToggleState()) {
                EmitSoundOn("Hero_Wisp.Overcharge", caster);
                let drain_interval = ability.GetSpecialValueFor("drain_interval");
                let drain_pct = ability.GetSpecialValueFor("drain_pct");
                imba_wisp_overcharge.AddOvercharge(caster, caster, 1.0, -1);
                if (caster.HasModifier("modifier_imba_wisp_tether")) {
                    if (tether_ability.target.HasModifier("modifier_imba_wisp_overcharge")) {
                        tether_ability.target.RemoveModifierByName("modifier_imba_wisp_overcharge");
                    }
                    imba_wisp_overcharge.AddOvercharge(caster, tether_ability.target, 1.0, -1);
                }
                if (caster.HasScepter()) {
                    caster.AddNewModifier(caster, ability, "modifier_imba_wisp_overcharge_aura", {});
                }
                drain_pct = drain_pct / 100;
                caster.AddNewModifier(caster, ability, "modifier_imba_wisp_overcharge_drain", {
                    duration: -1,
                    drain_interval: drain_interval,
                    drain_pct: drain_pct
                });
            } else {
                caster.StopSound("Hero_Wisp.Overcharge");
                caster.RemoveModifierByName("modifier_imba_wisp_overcharge");
                caster.RemoveModifierByName("modifier_imba_wisp_overcharge_drain");
                caster.RemoveModifierByName("modifier_imba_wisp_overcharge_regen_talent");
                caster.RemoveModifierByName("modifier_imba_wisp_overcharge_aura");
                if (caster.HasModifier("modifier_imba_wisp_tether")) {
                    tether_ability.target.RemoveModifierByName("modifier_imba_wisp_overcharge");
                    tether_ability.target.RemoveModifierByName("modifier_imba_wisp_overcharge_regen_talent");
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_wisp_overcharge_aura extends BaseModifier_Plus {
    public ability: imba_wisp_overcharge;
    public tether_ability: any;
    public scepter_radius: number;
    public scepter_efficiency: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsNetherWardStealable() {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.ability = this.GetAbilityPlus();
            this.tether_ability = this.GetCasterPlus().findAbliityPlus<imba_wisp_tether>("imba_wisp_tether");
            this.scepter_radius = this.ability.GetSpecialValueFor("scepter_radius");
            this.scepter_efficiency = this.ability.GetSpecialValueFor("scepter_efficiency");
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let nearby_friendly_units = FindUnitsInRadius(caster.GetTeam(), caster.GetAbsOrigin(), undefined, this.scepter_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, unit] of ipairs(nearby_friendly_units)) {
                if (unit != caster && unit != this.tether_ability.target /** && unit != "npc_dota_hero" */) {
                    imba_wisp_overcharge.AddOvercharge(caster, unit, this.scepter_efficiency, 1);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_wisp_overcharge extends BaseModifier_Plus {
    public overcharge_pfx: any;
    public bonus_attack_speed: number;
    public bonus_cast_speed: number;
    public bonus_missile_speed: number;
    public bonus_damage_pct: number;
    public bonus_attack_range: number;
    IsBuff() {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsNetherWardStealable() {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_SPEED_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    BeCreated(params: any): void {
        if (IsServer()) {
            this.overcharge_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_wisp/wisp_overcharge.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
            this.bonus_attack_speed = params.bonus_attack_speed;
            this.bonus_cast_speed = params.bonus_cast_speed;
            this.bonus_missile_speed = params.bonus_missile_speed;
            this.bonus_damage_pct = params.bonus_damage_pct;
            this.bonus_attack_range = params.bonus_attack_range;
        } else {
            let net_table = NetTablesHelper.GetDotaEntityData(this.GetAbilityPlus().GetEntityIndex(), this.GetAbilityPlus().GetAbilityName()) || {}
            this.bonus_attack_speed = net_table.overcharge_bonus_attack_speed || 0;
            this.bonus_cast_speed = net_table.overcharge_bonus_cast_speed || 0;
            this.bonus_missile_speed = net_table.overcharge_bonus_missile_speed || 0;
            this.bonus_damage_pct = net_table.overcharge_bonus_damage_pct || 0;
            this.bonus_attack_range = net_table.overcharge_bonus_attack_range || 0;
        }
    }
    OnRemoved(): void {
        if (IsServer()) {
            ParticleManager.DestroyParticle(this.overcharge_pfx, false);
            if (!this.GetCasterPlus().HasModifier("modifier_imba_wisp_overcharge")) {
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_wisp_overcharge_drain");
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_attack_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE)
    CC_GetModifierPercentageCasttime(p_0: ModifierAbilityEvent,): number {
        return this.bonus_cast_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_SPEED_BONUS)
    CC_GetModifierProjectileSpeedBonus(): number {
        return this.bonus_missile_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return this.bonus_damage_pct;
    }
}
@registerModifier()
export class modifier_imba_wisp_overcharge_drain extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public drain_pct: number;
    public drain_interval: number;
    public deltaDrainPct: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.drain_pct = params.drain_pct;
            this.drain_interval = params.drain_interval;
            this.deltaDrainPct = this.drain_interval * this.drain_pct;
            this.StartIntervalThink(this.drain_interval);
        }
    }
    OnIntervalThink(): void {
        let current_health = this.caster.GetHealth();
        let health_drain = current_health * this.deltaDrainPct;
        this.caster.ModifyHealth(current_health - health_drain, this.ability, true, 0);
        this.caster.SpendMana(this.caster.GetMana() * this.deltaDrainPct, this.ability);
    }
}
@registerModifier()
export class modifier_imba_wisp_overcharge_regen_talent extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_TOTAL_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_TOTAL_PERCENTAGE)
    CC_GetModifierTotalPercentageManaRegen(): number {
        return this.GetStackCount();
    }
}
@registerAbility()
export class imba_wisp_relocate extends BaseAbility_Plus {
    public relocate_target_point: any;
    public ally: any;
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_wisp_9");
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (IsServer()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_POINT;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_UNIT_TARGET;
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let unit = this.GetCursorTarget();
            let tether_ability = this.GetCasterPlus().findAbliityPlus<imba_wisp_tether>("imba_wisp_tether");
            this.relocate_target_point = this.GetCursorPosition();
            let vision_radius = this.GetSpecialValueFor("vision_radius");
            let cast_delay = this.GetSpecialValueFor("cast_delay");
            let return_time = this.GetSpecialValueFor("return_time");
            let destroy_tree_radius = this.GetSpecialValueFor("destroy_tree_radius");
            EmitSoundOn("Hero_Wisp.Relocate", this.GetCasterPlus());
            if (unit == this.GetCasterPlus()) {
                if (this.GetCasterPlus().GetTeam() == DOTATeam_t.DOTA_TEAM_GOODGUYS) {
                    this.relocate_target_point = Vector(-7168, -6646, 528);
                } else {
                    this.relocate_target_point = Vector(7037, 6458, 512);
                }
            }
            let channel_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_wisp/wisp_relocate_channel.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
            ParticleManager.SetParticleControl(channel_pfx, 0, this.GetCasterPlus().GetAbsOrigin());
            let endpoint_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_wisp/wisp_relocate_marker_endpoint.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus(), this.GetCasterPlus());
            ParticleManager.SetParticleControl(endpoint_pfx, 0, this.relocate_target_point);
            this.CreateVisibilityNode(this.relocate_target_point, vision_radius, cast_delay);
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_wisp_7")) {
                let immunity_duration = this.GetCasterPlus().GetTalentValue("special_bonus_imba_wisp_7", "duration");
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_wisp_relocate_talent", {
                    duration: immunity_duration
                });
                if (tether_ability.target != undefined) {
                    tether_ability.target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_wisp_relocate_talent", {
                        duration: immunity_duration
                    });
                }
            }
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_wisp_relocate_cast_delay", {
                duration: cast_delay
            });
            this.AddTimer(cast_delay, () => {
                ParticleManager.DestroyParticle(channel_pfx, false);
                ParticleManager.DestroyParticle(endpoint_pfx, false);
                if (!this.InterruptRelocate(this.GetCasterPlus(), this, tether_ability)) {
                    EmitSoundOn("Hero_Wisp.Return", this.GetCasterPlus());
                    EmitSoundOn("Hero_Wisp.ReturnCounter", this.GetCasterPlus());
                    GridNav.DestroyTreesAroundPoint(this.relocate_target_point, destroy_tree_radius, false);
                    if (!this.GetCasterPlus().HasAbility("imba_wisp_relocate_break")) {
                        this.GetCasterPlus().AddAbility("imba_wisp_relocate_break");
                    }
                    this.GetCasterPlus().SwapAbilities("imba_wisp_relocate", "imba_wisp_relocate_break", false, true);
                    let break_ability = this.GetCasterPlus().findAbliityPlus<imba_wisp_relocate_break>("imba_wisp_relocate_break");
                    break_ability.SetLevel(1);
                    if (this.GetCasterPlus().HasModifier("modifier_imba_wisp_tether") && tether_ability.target.IsHero()) {
                        this.ally = tether_ability.target;
                    } else {
                        this.ally = undefined;
                    }
                    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_wisp_relocate", {
                        duration: return_time,
                        return_time: return_time
                    });
                }
            }
            );
        }
    }
    InterruptRelocate(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, tether_ability: imba_wisp_tether) {
        if (!caster.IsAlive() || caster.IsStunned() || caster.IsHexed() || caster.IsNightmared() || caster.IsOutOfGame() || caster.IsRooted()) {
            return true;
        }
        return false;
    }
    OnUnStolen(): void {
        if (this.GetCasterPlus().HasAbility("imba_wisp_relocate_break")) {
            this.GetCasterPlus().RemoveAbility("imba_wisp_relocate_break");
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_wisp_9") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_wisp_9")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_wisp_9"), "modifier_special_bonus_imba_wisp_9", {});
        }
    }
}
@registerModifier()
export class modifier_imba_wisp_relocate_cast_delay extends BaseModifier_Plus {
}
@registerModifier()
export class modifier_imba_wisp_relocate extends BaseModifier_Plus {
    public return_time: number;
    public return_point: any;
    public eject_cooldown_mult: number;
    public caster_origin_pfx: any;
    public ally_teleport_pfx: any;
    public timer_buff: ParticleID;
    public relocate_timerPfx: ParticleID;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus<imba_wisp_relocate>();
            let ally = ability.ally;
            this.return_time = params.return_time;
            this.return_point = this.GetCasterPlus().GetAbsOrigin();
            this.eject_cooldown_mult = this.GetSpecialValueFor("eject_cooldown_mult");
            this.caster_origin_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_wisp/wisp_relocate_marker.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, caster, caster);
            ParticleManager.SetParticleControl(this.caster_origin_pfx, 0, caster.GetAbsOrigin());
            let caster_teleport_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_wisp/wisp_relocate_teleport.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster, caster);
            ParticleManager.SetParticleControl(caster_teleport_pfx, 0, caster.GetAbsOrigin());
            FindClearSpaceForUnit(caster, ability.relocate_target_point, true);
            caster.Interrupt();
            let teleport_out_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_wisp/wisp_relocate_marker_endpoint.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
            ParticleManager.DestroyParticle(teleport_out_pfx, false);
            ParticleManager.ReleaseParticleIndex(teleport_out_pfx);
            if (caster.HasModifier("modifier_imba_wisp_tether") && ally != undefined && ally.IsHero()) {
                this.ally_teleport_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_wisp/wisp_relocate_teleport.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, ally, caster);
                ParticleManager.SetParticleControl(this.ally_teleport_pfx, 0, ally.GetAbsOrigin());
                FindClearSpaceForUnit(ally, ability.relocate_target_point + Vector(100, 0, 0), true);
                ally.Interrupt();
            }
            this.timer_buff = ResHelper.CreateParticleEx("particles/units/heroes/hero_wisp/wisp_relocate_timer_buff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster, caster);
            ParticleManager.SetParticleControlEnt(this.timer_buff, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(this.timer_buff, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
            this.relocate_timerPfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_wisp/wisp_relocate_timer.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, caster);
            let timerCP1_x = this.return_time >= 10 && 1 || 0;
            let timerCP1_y = this.return_time % 10;
            ParticleManager.SetParticleControl(this.relocate_timerPfx, 1, Vector(timerCP1_x, timerCP1_y, 0));
            this.StartIntervalThink(1.0);
        }
    }
    OnIntervalThink(): void {
        this.return_time = this.return_time - 1;
        let timerCP1_x = this.return_time >= 10 && 1 || 0;
        let timerCP1_y = this.return_time % 10;
        ParticleManager.SetParticleControl(this.relocate_timerPfx, 1, Vector(timerCP1_x, timerCP1_y, 0));
    }
    OnRemoved(): void {
        if (IsServer()) {
            EmitSoundOn("Hero_Wisp.TeleportOut", this.GetCasterPlus());
            StopSoundOn("Hero_Wisp.ReturnCounter", this.GetCasterPlus());
            let caster_teleport_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_wisp/wisp_relocate_teleport.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.GetCasterPlus(), this.GetCasterPlus());
            ParticleManager.SetParticleControl(caster_teleport_pfx, 0, this.GetCasterPlus().GetAbsOrigin());
            ParticleManager.DestroyParticle(this.relocate_timerPfx, false);
            ParticleManager.DestroyParticle(this.caster_origin_pfx, false);
            ParticleManager.DestroyParticle(this.timer_buff, false);
            this.GetCasterPlus().SetAbsOrigin(this.return_point);
            this.GetCasterPlus().Interrupt();
            let tether_ability = this.GetCasterPlus().findAbliityPlus<imba_wisp_tether>("imba_wisp_tether");
            if (this.GetCasterPlus().HasModifier("modifier_imba_wisp_tether") && tether_ability.target != undefined && tether_ability.target.IsHero() && this.GetCasterPlus().IsAlive()) {
                tether_ability.target.SetAbsOrigin(this.return_point + Vector(100, 0, 0));
                this.ally_teleport_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_wisp/wisp_relocate_teleport.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, tether_ability.target, this.GetCasterPlus());
                ParticleManager.SetParticleControlEnt(this.ally_teleport_pfx, 0, tether_ability.target, ParticleAttachment_t.PATTACH_POINT, "attach_hitloc", tether_ability.target.GetAbsOrigin(), true);
                tether_ability.target.Interrupt();
            }
            this.GetCasterPlus().SwapAbilities("imba_wisp_relocate_break", "imba_wisp_relocate", false, true);
            if (this.GetRemainingTime() >= 0) {
                let relocate_ability = this.GetCasterPlus().findAbliityPlus<imba_wisp_relocate>("imba_wisp_relocate");
                relocate_ability.StartCooldown(relocate_ability.GetCooldownTimeRemaining() + (this.GetRemainingTime() * this.eject_cooldown_mult));
            }
        }
    }
}
@registerModifier()
export class modifier_imba_wisp_relocate_talent extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        }
        return state;
    }
    GetEffectName(): string {
        return "particles/item/black_queen_cape/black_king_bar_avatar.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerAbility()
export class imba_wisp_relocate_break extends BaseAbility_Plus {
    IsStealable(): boolean {
        return false;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            caster.RemoveModifierByName("modifier_imba_wisp_relocate");
        }
    }
}
@registerAbility()
export class imba_wisp_overcharge_721 extends BaseAbility_Plus {
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_wisp_12")) {
            if (this.GetCasterPlus().findBuffStack("modifier_imba_wisp_overcharge_721_handler", this.GetCasterPlus()) == 0) {
                return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
            } else {
                return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
            }
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE;
        }
    }
    GetCooldown(level: number): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_wisp_12")) {
            if (this.GetCasterPlus().findBuffStack("modifier_imba_wisp_overcharge_721_handler", this.GetCasterPlus()) == 0) {
                return this.GetSpecialValueFor("talent_cooldown");
            } else {
                return super.GetCooldown(level);
            }
        } else {
            return super.GetCooldown(level);
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_wisp_overcharge_721_handler";
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_wisp_overcharge_721", {
            duration: this.GetSpecialValueFor("duration")
        });
    }
    OnToggle(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetToggleState()) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_wisp_overcharge_721", {});
        } else {
            this.GetCasterPlus().RemoveModifierByNameAndCaster("modifier_imba_wisp_overcharge_721", this.GetCasterPlus());
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_wisp_4") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_wisp_4")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_wisp_4"), "modifier_special_bonus_imba_wisp_4", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_wisp_12") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_wisp_12")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_wisp_12"), "modifier_special_bonus_imba_wisp_12", {});
        }
    }
}
@registerModifier()
export class modifier_imba_wisp_overcharge_721 extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public bonus_attack_speed: number;
    public bonus_damage_pct: number;
    public hp_regen: any;
    public bonus_missile_speed: number;
    public bonus_cast_speed: number;
    public bonus_attack_range: number;
    public talent_drain_interval: number;
    public talent_drain_pct: number;
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return this.GetParentPlus().TempData().overcharge_effect;
    }
    Init(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.bonus_attack_speed = this.ability.GetSpecialValueFor("bonus_attack_speed");
        this.bonus_damage_pct = this.ability.GetSpecialValueFor("bonus_damage_pct") - this.caster.GetTalentValue("special_bonus_imba_wisp_4");
        this.hp_regen = this.ability.GetSpecialValueFor("hp_regen");
        this.bonus_missile_speed = this.ability.GetSpecialValueFor("bonus_missile_speed");
        this.bonus_cast_speed = this.ability.GetSpecialValueFor("bonus_cast_speed");
        this.bonus_attack_range = this.ability.GetSpecialValueFor("bonus_attack_range");
        this.talent_drain_interval = this.ability.GetSpecialValueFor("talent_drain_interval");
        this.talent_drain_pct = this.ability.GetSpecialValueFor("talent_drain_pct");
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("Hero_Wisp.Overcharge");
        let tether_ability = this.GetCasterPlus().findAbliityPlus<imba_wisp_tether>("imba_wisp_tether");
        if (tether_ability && tether_ability.target && !tether_ability.target.HasModifier("modifier_imba_wisp_overcharge_721")) {
            tether_ability.target.AddNewModifier(this.caster, this.ability, "modifier_imba_wisp_overcharge_721", {});
        }
        if (this.caster == this.parent && this.ability.GetToggleState()) {
            if (!this.ability.GetAutoCastState()) {
                this.SetDuration(-1, true);
                this.StartIntervalThink(this.talent_drain_interval);
            } else {
                this.ability.ToggleAbility();
                this.StartIntervalThink(-1);
                this.ability.CastAbility();
            }
        }
    }
    OnIntervalThink(): void {
        this.parent.ModifyHealth(this.caster.GetHealth() * (1 - (this.talent_drain_pct * 0.01 * this.talent_drain_interval)), this.ability, false, 0);
        this.parent.ReduceMana(this.caster.GetMana() * this.talent_drain_pct * 0.01 * this.talent_drain_interval);
    }

    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_Wisp.Overcharge");
        let tether_ability = this.GetCasterPlus().findAbliityPlus<imba_wisp_tether>("imba_wisp_tether");
        if (tether_ability && tether_ability.target) {
            let overcharge_modifier = tether_ability.target.FindModifierByNameAndCaster("modifier_imba_wisp_overcharge_721", this.GetCasterPlus());
            if (overcharge_modifier) {
                overcharge_modifier.Destroy();
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_SPEED_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_attack_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE)
    CC_GetModifierHealthRegenPercentage(): number {
        return this.hp_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_SPEED_BONUS)
    CC_GetModifierProjectileSpeedBonus(): number {
        return this.bonus_missile_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE)
    CC_GetModifierPercentageCasttime(keys: ModifierAbilityEvent): number {
        // todo
        if (this.GetParentPlus().HasAbility && this.GetParentPlus().HasAbility("furion_teleportation") && this.GetParentPlus().findAbliityPlus("furion_teleportation").IsInAbilityPhase()) {
            return 0;
        } else {
            return this.bonus_cast_speed;
        }
    }
    IsAura(): boolean {
        return this.GetParentPlus() == this.GetCasterPlus() && this.GetCasterPlus().HasScepter();
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("scepter_radius");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_wisp_overcharge_721_aura";
    }
    GetAuraEntityReject(hEntity: CDOTA_BaseNPC): boolean {
        return hEntity.HasModifier("modifier_imba_wisp_overcharge_721");
    }
}
@registerModifier()
export class modifier_imba_wisp_overcharge_721_aura extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public scepter_efficiency: any;
    public bonus_attack_speed: number;
    public bonus_damage_pct: number;
    public hp_regen: any;
    public bonus_missile_speed: number;
    public bonus_cast_speed: number;
    public bonus_attack_range: number;
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return this.GetParentPlus().TempData().overcharge_effect;
    }
    Init(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.scepter_efficiency = this.ability.GetSpecialValueFor("scepter_efficiency");
        this.bonus_attack_speed = this.ability.GetSpecialValueFor("bonus_attack_speed") * this.scepter_efficiency;
        this.bonus_damage_pct = this.ability.GetSpecialValueFor("bonus_damage_pct") - this.caster.GetTalentValue("special_bonus_imba_wisp_4") * this.scepter_efficiency;
        this.hp_regen = this.ability.GetSpecialValueFor("hp_regen") * this.scepter_efficiency;
        this.bonus_missile_speed = this.ability.GetSpecialValueFor("bonus_missile_speed") * this.scepter_efficiency;
        this.bonus_cast_speed = this.ability.GetSpecialValueFor("bonus_cast_speed") * this.scepter_efficiency;
        this.bonus_attack_range = this.ability.GetSpecialValueFor("bonus_attack_range") * this.scepter_efficiency;
    }

    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_SPEED_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_attack_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE)
    CC_GetModifierHealthRegenPercentage(): number {
        return this.hp_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_SPEED_BONUS)
    CC_GetModifierProjectileSpeedBonus(): number {
        return this.bonus_missile_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE)
    CC_GetModifierPercentageCasttime(p_0: ModifierAbilityEvent,): number {
        return this.bonus_cast_speed;
    }
}
@registerModifier()
export class modifier_imba_wisp_overcharge_721_handler extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ORDER
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (!IsServer() || keys.unit != this.GetParentPlus() || !this.GetParentPlus().HasTalent("special_bonus_imba_wisp_12") || keys.order_type != dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO || keys.ability != this.GetAbilityPlus()) {
            return;
        }
        if (this.GetAbilityPlus().GetAutoCastState()) {
            this.SetStackCount(0);
        } else {
            this.SetStackCount(1);
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_wisp_11 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_wisp_6 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_wisp_4 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_wisp_9 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_wisp_10 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_wisp_12 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_wisp_death extends BaseModifier_Plus {
    RemoveOnDeath(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (params.unit == this.GetParentPlus()) {
            print("WISP IS DEAD!");
            let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_wisp/wisp_death_override.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetParentPlus());
        }
    }
}
