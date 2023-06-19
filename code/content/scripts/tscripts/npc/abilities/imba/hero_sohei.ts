
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class sohei_dash extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_generic_charges";
    }
    PerformDash() {
        let caster = this.GetCasterPlus();
        let distance = this.GetSpecialValueFor("dash_distance");
        let speed = this.GetSpecialValueFor("dash_speed");
        let treeRadius = this.GetSpecialValueFor("tree_radius");
        let duration = distance / speed;
        caster.RemoveModifierByName("modifier_sohei_dash_movement");
        caster.EmitSound("Sohei.Dash");
        caster.StartGesture(GameActivity_t.ACT_DOTA_RUN);
        caster.AddNewModifier(undefined, undefined, "modifier_sohei_dash_movement", {
            duration: duration,
            distance: distance,
            tree_radius: treeRadius,
            speed: speed
        });
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let dashDistance = this.GetSpecialValueFor("dash_distance");
        let dashSpeed = this.GetSpecialValueFor("dash_speed");
        this.PerformDash();
        let cdRefund = this.GetSpecialValueFor("momentum_cd_refund");
        if (cdRefund > 0) {
            let momentum = caster.findAbliityPlus<sohei_momentum>("sohei_momentum");
            if (momentum && !momentum.IsCooldownReady()) {
                let momentumCooldown = momentum.GetCooldownTimeRemaining();
                let refundCooldown = momentumCooldown * (cdRefund / 100.0);
                momentum.EndCooldown();
                momentum.StartCooldown(momentumCooldown - refundCooldown);
            }
        }
    }
}
@registerModifier()
export class modifier_sohei_dash_movement extends BaseModifierMotionHorizontal_Plus {
    public direction: any;
    public distance: number;
    public speed: number;
    public tree_radius: number;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_SUPER_ULTRA;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        }
        return state;
    }
    BeCreated(event: any): void {
        let parent = this.GetParentPlus();
        this.direction = parent.GetForwardVector();
        this.distance = event.distance;
        this.speed = event.speed;
        this.tree_radius = event.tree_radius;
        if (this.BeginMotionOrDestroy() == false) {
            return;
        }
        let trail_pfx = ResHelper.CreateParticleEx("particles/econ/items/juggernaut/bladekeeper_omnislash/_dc_juggernaut_omni_slash_trail.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, parent);
        ParticleManager.SetParticleControl(trail_pfx, 0, parent.GetAbsOrigin());
        ParticleManager.SetParticleControl(trail_pfx, 1, parent.GetAbsOrigin() + parent.GetForwardVector() * 300 as Vector);
        ParticleManager.ReleaseParticleIndex(trail_pfx);
    }
    BeDestroy(): void {
        let parent = this.GetParentPlus();
        parent.FadeGesture(GameActivity_t.ACT_DOTA_RUN);
        parent.RemoveHorizontalMotionController(this);
        ResolveNPCPositions(parent.GetAbsOrigin(), 128);
    }
    UpdateHorizontalMotion(parent: CDOTA_BaseNPC, deltaTime: number): void {
        let parentOrigin = parent.GetAbsOrigin();
        let tickSpeed = this.speed * deltaTime;
        tickSpeed = math.min(tickSpeed, this.distance);
        let tickOrigin = parentOrigin + (tickSpeed * this.direction) as Vector;
        parent.SetAbsOrigin(tickOrigin);
        this.distance = this.distance - tickSpeed;
        GridNav.DestroyTreesAroundPoint(tickOrigin, this.tree_radius, false);
    }
    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }
}
@registerAbility()
export class sohei_flurry_of_blows extends BaseAbility_Plus {
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasAbility("special_bonus_imba_sohei_fob_radius") && this.GetCasterPlus().findAbliityPlus("special_bonus_imba_sohei_fob_radius").IsTrained() && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_sohei_fob_radius")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_sohei_fob_radius", {});
        }
    }
    GetAssociatedSecondaryAbilities(): string {
        return "sohei_momentum";
    }
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2;
    }
    GetPlaybackRateOverride(): number {
        return 1.2;
    }
    OnAbilityPhaseStart(): boolean {
        if (IsServer()) {
            this.GetCasterPlus().EmitSound("Hero_EmberSpirit.FireRemnant.Stop");
            return true;
        }
    }

    GetChannelTime(): number {
        return this.GetSpecialValueFor("max_duration");
    }
    OnAbilityPhaseInterrupted(): void {
        if (IsServer()) {
            this.GetCasterPlus().StopSound("Hero_EmberSpirit.FireRemnant.Stop");
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target_loc = this.GetCursorPosition();
        let flurry_radius = this.GetAOERadius();
        let max_attacks = this.GetSpecialValueFor("max_attacks");
        let max_duration = this.GetSpecialValueFor("max_duration");
        let attack_interval = this.GetSpecialValueFor("attack_interval");
        caster.EmitSound("Hero_EmberSpirit.FireRemnant.Cast");
        if (caster.TempData().flurry_ground_pfx) {
            ParticleManager.DestroyParticle(caster.TempData().flurry_ground_pfx, false);
            ParticleManager.ReleaseParticleIndex(caster.TempData().flurry_ground_pfx);
        }
        caster.TempData().flurry_ground_pfx = ResHelper.CreateParticleEx("particles/hero/sohei/flurry_of_blows_ground.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
        ParticleManager.SetParticleControl(caster.TempData().flurry_ground_pfx, 0, target_loc);
        ParticleManager.SetParticleControl(caster.TempData().flurry_ground_pfx, 10, Vector(flurry_radius, 0, 0));
        caster.SetAbsOrigin(target_loc + Vector(0, 0, 200) as Vector);
        caster.AddNewModifier(caster, this, "modifier_sohei_flurry_self", {
            duration: max_duration,
            max_attacks: max_attacks,
            flurry_radius: flurry_radius,
            attack_interval: attack_interval
        });
    }
    OnChannelFinish(p_0: boolean,): void {
        let caster = this.GetCasterPlus();
        caster.RemoveModifierByName("modifier_sohei_flurry_self");
    }
    GetAOERadius(): number {
        let caster = this.GetCasterPlus();
        let additionalRadius = 0;
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_sohei_fob_radius")) {
            additionalRadius = this.GetCasterPlus().GetTalentValue("special_bonus_imba_sohei_fob_radius");
        }
        return this.GetSpecialValueFor("flurry_radius") + additionalRadius;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_sohei_fob_radius extends BaseModifier_Plus {
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
export class modifier_sohei_flurry_self extends BaseModifier_Plus {
    public remaining_attacks: any;
    public radius: number;
    public attack_interval: number;
    public position: any;
    public positionGround: any;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    StatusEffectPriority(): modifierpriority {
        return 4;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_omnislash.vpcf";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        };
    }
    BeDestroy(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            ParticleManager.DestroyParticle(caster.TempData().flurry_ground_pfx, false);
            ParticleManager.ReleaseParticleIndex(caster.TempData().flurry_ground_pfx);
            caster.TempData().flurry_ground_pfx = undefined;
            caster.FadeGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2);
            caster.Interrupt();
            caster.RemoveNoDraw();
        }
    }
    BeCreated(event: any): void {
        this.remaining_attacks = event.max_attacks;
        this.radius = event.flurry_radius;
        this.attack_interval = event.attack_interval;
        this.position = this.GetCasterPlus().GetAbsOrigin();
        this.positionGround = this.position - Vector(0, 0, 200);
        this.StartIntervalThink(this.attack_interval);
        this.GetCasterPlus().StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2, 1.4);
        if (this.PerformFlurryBlow()) {
            this.remaining_attacks = this.remaining_attacks - 1;
        }
    }
    OnIntervalThink(): void {
        if (this.PerformFlurryBlow()) {
            this.remaining_attacks = this.remaining_attacks - 1;
        }
        if (this.remaining_attacks <= 0) {
            this.Destroy();
        }
    }
    PerformFlurryBlow() {
        let parent = this.GetParentPlus();
        let targets = FindUnitsInRadius(parent.GetTeamNumber(), this.positionGround, undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, bit.bor(DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE), FindOrder.FIND_ANY_ORDER, false);
        if (targets[0]) {
            let target = targets[0];
            let targetOrigin = target.GetAbsOrigin();
            let abilityDash = parent.findAbliityPlus<sohei_dash>("sohei_dash");
            let abilityMomentum = parent.findAbliityPlus<sohei_momentum>("sohei_momentum");
            let distance = 50;
            parent.RemoveNoDraw();
            if (abilityDash) {
                distance = abilityDash.GetSpecialValueFor("dash_distance") + 50;
            }
            let targetOffset = (targetOrigin - this.positionGround as Vector).Normalized() * distance;
            let tickOrigin = targetOrigin + targetOffset as Vector;
            parent.SetAbsOrigin(tickOrigin);
            parent.SetForwardVector(((this.positionGround) - tickOrigin as Vector).Normalized());
            parent.FaceTowards(targetOrigin);
            if (abilityDash && abilityDash.GetLevel() > 0) {
                abilityDash.PerformDash();
            }
            if (abilityMomentum && abilityMomentum.GetLevel() > 0) {
                if (!abilityMomentum.GetToggleState()) {
                    abilityMomentum.ToggleAbility();
                }
            }
            parent.AttackOnce(targets[0], true, true, true, false, false, false, false);
            return true;
        } else {
            parent.AddNoDraw();
            parent.SetAbsOrigin(this.position);
            parent.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2, 0.5);
            return false;
        }
    }
}
@registerAbility()
export class sohei_wholeness_of_body extends BaseAbility_Plus {
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("knockback_radius") - this.GetCasterPlus().GetCastRangeBonus();
    }
    GetIntrinsicModifierName(): string {
        return "modifier_sohei_wholeness_of_body_handler";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        let caster = this.GetCasterPlus();
        if (caster.HasTalent("special_bonus_imba_sohei_wholeness_allycast") || caster.HasModifier("modifier_special_bonus_imba_sohei_wholeness_allycast")) {
            if (this.GetCasterPlus().findBuffStack("modifier_sohei_wholeness_of_body_handler", this.GetCasterPlus()) == 0) {
                return tonumber(tostring(super.GetBehavior())) + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
            } else {
                return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
            }
        }
        return super.GetBehavior();
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget() || caster;
        target.EmitSound("Sohei.Guard");
        target.Purge(false, true, false, false, false);
        target.AddNewModifier(caster, this, "modifier_sohei_wholeness_of_body_status", {
            duration: this.GetSpecialValueFor("sr_duration")
        });
        let momentum_ability = this.GetCasterPlus().findAbliityPlus<sohei_momentum>("sohei_momentum");
        if (momentum_ability && momentum_ability.IsTrained()) {
            for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), target.GetAbsOrigin(), undefined, this.GetSpecialValueFor("knockback_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false))) {
                enemy.RemoveModifierByName("modifier_sohei_momentum_knockback");
                enemy.AddNewModifier(this.GetCasterPlus(), momentum_ability, "modifier_sohei_momentum_knockback", {
                    duration: momentum_ability.GetSpecialValueFor("knockback_distance") / momentum_ability.GetSpecialValueFor("knockback_speed"),
                    distance: momentum_ability.GetSpecialValueFor("knockback_distance"),
                    speed: momentum_ability.GetSpecialValueFor("knockback_speed"),
                    collision_radius: momentum_ability.GetSpecialValueFor("collision_radius"),
                    source_entindex: target.entindex()
                });
            }
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_sohei_wholeness_allycast") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_sohei_wholeness_allycast")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_sohei_wholeness_allycast"), "modifier_special_bonus_imba_sohei_wholeness_allycast", {});
        }
    }
}
@registerModifier()
export class modifier_sohei_wholeness_of_body_status extends BaseModifier_Plus {
    public status_resistance: any;
    public damageheal: number;
    public endHeal: any;
    public wholeness_particle: any;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        let ability = this.GetAbilityPlus();
        this.status_resistance = ability.GetSpecialValueFor("status_resistance");
        this.damageheal = ability.GetSpecialValueFor("damage_taken_heal") / 100;
        this.endHeal = 0;
        if (!IsServer()) {
            return;
        }
        this.wholeness_particle = ResHelper.CreateParticleEx("particles/hero/sohei/guard.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(this.wholeness_particle, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        this.AddParticle(this.wholeness_particle, false, false, -1, false, false);
    }
    BeRefresh(p_0: any,): void {
        let ability = this.GetAbilityPlus();
        this.status_resistance = ability.GetSpecialValueFor("status_resistance");
        this.damageheal = ability.GetSpecialValueFor("damage_taken_heal") / 100;
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.GetParentPlus().ApplyHeal(this.endHeal + this.GetAbilityPlus().GetSpecialValueFor("post_heal"), this.GetAbilityPlus());
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE,
        2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
    }
    return Object.values(funcs);
    } */
    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE)
    // CC_GetModifierStatusResistance(): number {
    //     return this.status_resistance;
    // }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        if (params.unit == this.GetParentPlus()) {
            this.endHeal = this.endHeal + params.damage * this.damageheal;
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_sohei_wholeness_allycast extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    AllowIllusionDuplicate(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasAbility("sohei_wholeness_of_body")) {
            this.GetParentPlus().findAbliityPlus<sohei_wholeness_of_body>("sohei_wholeness_of_body").ToggleAutoCast();
            if (this.GetParentPlus().HasModifier("modifier_sohei_wholeness_of_body_handler")) {
                this.GetParentPlus().findBuff<modifier_sohei_wholeness_of_body_handler>("modifier_sohei_wholeness_of_body_handler").SetStackCount(1);
            }
        }
    }
}
@registerModifier()
export class modifier_sohei_wholeness_of_body_handler extends BaseModifier_Plus {
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
        1: Enum_MODIFIER_EVENT.ON_ORDER
    });
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
@registerAbility()
export class sohei_momentum extends BaseAbility_Plus {
    intrMod: modifier_sohei_momentum_passive;
    GetAbilityTextureName(): string {
        let baseName = super.GetAbilityTextureName();
        if (this.GetSpecialValueFor("trigger_distance") <= 0) {
            return baseName;
        }
        if (this.intrMod && !this.intrMod.IsNull() && !this.intrMod.IsMomentumReady()) {
            return baseName + "_inactive";
        }
        return baseName;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_sohei_momentum_passive";
    }
}
@registerModifier()
export class modifier_sohei_momentum_passive extends BaseModifier_Plus {
    public parentOrigin: any;
    public attackPrimed: any;
    public force_casting: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
    IsMomentumReady() {
        if (this.GetParentPlus().HasModifier("modifier_sohei_flurry_self")) {
            return true;
        }
        let distanceFull = this.GetSpecialValueFor("trigger_distance");
        return this.GetStackCount() >= distanceFull;
    }
    BeCreated(event: any): void {
        this.GetAbilityPlus<sohei_momentum>().intrMod = this;
        this.parentOrigin = this.GetParentPlus().GetAbsOrigin();
        this.attackPrimed = false;
        if (IsServer() && this.GetAbilityPlus()) {
            this.GetAbilityPlus().ToggleAutoCast();
        }
        this.StartIntervalThink(1 / 30);
    }
    BeRefresh(event: any): void {
        this.SetStackCount(0);
    }
    OnIntervalThink(): void {
        let parent = this.GetParentPlus();
        let spell = this.GetAbilityPlus();
        let oldOrigin = this.parentOrigin;
        this.parentOrigin = parent.GetAbsOrigin();
        if (!this.IsMomentumReady()) {
            if (spell.IsCooldownReady()) {
                this.SetStackCount(this.GetStackCount() + (this.parentOrigin - oldOrigin as Vector).Length2D());
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE_UNIQUE,
        2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
        3: Enum_MODIFIER_EVENT.ON_ORDER
    }
    return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(kv: ModifierAbilityEvent): void {
        let order_type = kv.order_type;
        let unit = kv.unit;
        let target = kv.target;
        this.force_casting = false;
        if (this.GetCasterPlus() == unit) {
            if (order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET) {
                this.force_casting = true;
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE_UNIQUE)
    CC_GetModifierPreAttack_CriticalStrike(event: ModifierAttackEvent): number {
        if ((this.force_casting == true || this.GetAbilityPlus().GetAutoCastState() == true) && this.IsMomentumReady() && (this.GetAbilityPlus().IsCooldownReady() || this.GetParentPlus().HasModifier("modifier_sohei_flurry_self"))) {
            let ufResult = UnitFilter(event.target, this.GetAbilityPlus().GetAbilityTargetTeam(), this.GetAbilityPlus().GetAbilityTargetType(), this.GetAbilityPlus().GetAbilityTargetFlags(), this.GetParentPlus().GetTeamNumber());
            if (ufResult != UnitFilterResult.UF_SUCCESS) {
                return 0;
            }
            this.attackPrimed = true;
            return this.GetSpecialValueFor("crit_damage");
        }
        this.attackPrimed = false;
        return 0;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(event: ModifierAttackEvent): void {
        if (event.attacker == this.GetParentPlus() && this.attackPrimed == true) {
            let attacker = this.GetParentPlus();
            let target = event.target;
            let spell = this.GetAbilityPlus();
            if (target.GetTeam() == this.GetParentPlus().GetTeam()) {
                return undefined;
            }
            if (target.IsBuilding()) {
                return undefined;
            }
            this.ForceRefresh();
            let distance = spell.GetSpecialValueFor("knockback_distance");
            let speed = spell.GetSpecialValueFor("knockback_speed");
            let duration = distance / speed;
            let collision_radius = spell.GetSpecialValueFor("collision_radius");
            target.RemoveModifierByName("modifier_sohei_momentum_knockback");
            target.AddNewModifier(attacker, spell, "modifier_sohei_momentum_knockback", {
                duration: duration,
                distance: distance,
                speed: speed,
                collision_radius: collision_radius
            });
            target.EmitSound("Sohei.Momentum");
            let momentum_pfx = ResHelper.CreateParticleEx("particles/hero/sohei/momentum.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
            ParticleManager.SetParticleControl(momentum_pfx, 0, target.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(momentum_pfx);
            let guard = attacker.findAbliityPlus("sohei_guard");
            let talent = attacker.findAbliityPlus("special_bonus_imba_sohei_momentum_guard_cooldown");
            if (talent && talent.GetLevel() > 0) {
                let cooldown_reduction = talent.GetSpecialValueFor("value");
                if (!guard.IsCooldownReady()) {
                    let newCooldown = guard.GetCooldownTimeRemaining() - cooldown_reduction;
                    guard.EndCooldown();
                    guard.StartCooldown(newCooldown);
                }
            }
            if (!this.GetParentPlus().HasModifier("modifier_sohei_flurry_self")) {
                spell.UseResources(true, false, true, true);
            }
        }
    }
}
@registerModifier()
export class modifier_sohei_momentum_knockback extends BaseModifierMotionHorizontal_Plus {
    public direction: any;
    public distance: number;
    public speed: number;
    public collision_radius: number;
    public slow_duration: number;
    public stun_duration: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    GetEffectName(): string {
        return "particles/hero/sohei/knockback.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
        2: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION_RATE
    }
    return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation( /** event */): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
    BeCreated(event: any): void {
        let unit = this.GetParentPlus();
        let caster = this.GetCasterPlus();
        let difference: Vector = undefined;
        if (!event.source_entindex) {
            difference = unit.GetAbsOrigin() - caster.GetAbsOrigin() as Vector;
        } else {
            difference = unit.GetAbsOrigin() - EntIndexToHScript(event.source_entindex).GetAbsOrigin() as Vector;
        }
        this.direction = difference.Normalized();
        this.distance = event.distance;
        this.speed = event.speed;
        this.collision_radius = event.collision_radius;
        this.slow_duration = this.GetAbilityPlus().GetSpecialValueFor("slow_duration");
        this.stun_duration = this.GetAbilityPlus().GetSpecialValueFor("stun_duration");
        if (this.BeginMotionOrDestroy() == false) {
            return;
        }
    }
    BeDestroy(): void {
        let parent = this.GetParentPlus();
        parent.RemoveHorizontalMotionController(this);
        ResolveNPCPositions(parent.GetAbsOrigin(), 128);
    }
    UpdateHorizontalMotion(parent: CDOTA_BaseNPC, deltaTime: number): void {
        let caster = this.GetCasterPlus();
        let parentOrigin = parent.GetAbsOrigin();
        let tickSpeed = this.speed * deltaTime;
        tickSpeed = math.min(tickSpeed, this.distance);
        let tickOrigin = parentOrigin + (tickSpeed * this.direction) as Vector;
        this.distance = this.distance - tickSpeed;
        let targets = FindUnitsInRadius(caster.GetTeamNumber(), tickOrigin, undefined, this.collision_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false);
        let secondary_target = targets[0];
        if (secondary_target == parent) {
            secondary_target = targets[1];
        }
        let spell = this.GetAbilityPlus();
        if (secondary_target) {
            this.SlowAndStun(parent, caster, spell);
            this.SlowAndStun(secondary_target, caster, spell);
            this.Destroy();
        } else if (!GridNav.IsTraversable(tickOrigin) || GridNav.IsBlocked(tickOrigin) || GridNav.IsNearbyTree(tickOrigin, this.GetParentPlus().GetHullRadius(), true)) {
            this.SlowAndStun(parent, caster, spell);
            GridNav.DestroyTreesAroundPoint(tickOrigin, this.collision_radius, false);
            this.Destroy();
        } else {
            parent.SetAbsOrigin(tickOrigin);
        }
    }
    SlowAndStun(unit: IBaseNpc_Plus, caster: IBaseNpc_Plus, ability: IBaseAbility_Plus) {
        unit.AddNewModifier(caster, ability, "modifier_sohei_momentum_slow", {
            duration: this.slow_duration * (1 - unit.GetStatusResistance())
        });
        unit.AddNewModifier(caster, ability, "modifier_generic_stunned", {
            duration: this.stun_duration * (1 - unit.GetStatusResistance())
        });
    }
}
@registerModifier()
export class modifier_sohei_momentum_slow extends BaseModifier_Plus {
    public slow: any;
    IsDebuff(): boolean {
        return true;
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
    GetTexture(): string {
        if (this.GetAbilityPlus()) {
            return this.GetAbilityPlus().GetAbilityTextureName();
        }
    }
    BeCreated(event: any): void {
        this.slow = this.GetSpecialValueFor("movement_slow");
    }
    BeRefresh(event: any): void {
        this.slow = this.GetSpecialValueFor("movement_slow");
    }
    /** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
    }
    return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow;
    }
}
@registerAbility()
export class sohei_palm_of_life extends BaseAbility_Plus {
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        let caster = this.GetCasterPlus();
        if (caster == target) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
        let ufResult = UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, caster.GetTeamNumber());
        return ufResult;
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        if (this.GetCasterPlus() == target) {
            return "#dota_hud_error_cant_cast_on_self";
        }
        return "";
    }
    OnHeroCalculateStatBonus(): void {
        let caster = this.GetCasterPlus();
        if (caster.HasScepter()) {
            this.SetHidden(false);
            if (this.GetLevel() <= 0) {
                this.SetLevel(1);
            }
        } else {
            this.SetHidden(true);
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let modifier_charges = caster.findBuff("modifier_generic_charges");
        if (modifier_charges && !modifier_charges.IsNull()) {
            if (modifier_charges.GetStackCount() >= 1) {
                modifier_charges.SetStackCount(modifier_charges.GetStackCount() - 1);
            }
        }
        let target = this.GetCursorTarget();
        let speed = this.GetSpecialValueFor("dash_speed");
        let treeRadius = this.GetSpecialValueFor("tree_radius");
        let duration = this.GetSpecialValueFor("max_duration");
        let endDistance = this.GetSpecialValueFor("end_distance");
        let modMomentum = caster.findBuff<modifier_sohei_momentum_passive>("modifier_sohei_momentum_passive");
        let spellMomentum = caster.findAbliityPlus<sohei_momentum>("sohei_momentum");
        caster.RemoveModifierByName("modifier_sohei_palm_of_life_movement");
        caster.RemoveModifierByName("modifier_sohei_dash_movement");
        caster.EmitSound("Sohei.Dash");
        caster.StartGesture(GameActivity_t.ACT_DOTA_RUN);
        caster.AddNewModifier(caster, this, "modifier_sohei_palm_of_life_movement", {
            duration: duration,
            target: target.entindex(),
            tree_radius: treeRadius,
            speed: speed,
            endDistance: endDistance,
            doHeal: 1
        });
    }
}
@registerModifier()
export class modifier_sohei_palm_of_life_movement extends BaseModifierMotionHorizontal_Plus {
    public target: IBaseNpc_Plus;
    public speed: number;
    public tree_radius: number;
    public endDistance: any;
    public doHeal: any;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        }
        return state;
    }
    BeCreated(event: any): void {
        let parent = this.GetParentPlus();
        this.target = EntIndexToHScript(event.target) as IBaseNpc_Plus;
        this.speed = event.speed;
        this.tree_radius = event.tree_radius;
        this.endDistance = event.endDistance;
        this.doHeal = event.doHeal > 0;
        if (this.BeginMotionOrDestroy() == false) {
            return;
        }
        let trail_pfx = ResHelper.CreateParticleEx("particles/econ/items/juggernaut/bladekeeper_omnislash/_dc_juggernaut_omni_slash_trail.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, parent);
        ParticleManager.SetParticleControl(trail_pfx, 0, parent.GetAbsOrigin());
        ParticleManager.SetParticleControl(trail_pfx, 1, (this.target.GetAbsOrigin() - parent.GetAbsOrigin() as Vector).Normalized() * 300 as Vector);
        ParticleManager.ReleaseParticleIndex(trail_pfx);
    }
    BeDestroy(): void {
        let parent = this.GetParentPlus();
        parent.FadeGesture(GameActivity_t.ACT_DOTA_RUN);
        parent.RemoveHorizontalMotionController(this);
        ResolveNPCPositions(parent.GetAbsOrigin(), 128);
    }
    UpdateHorizontalMotion(parent: CDOTA_BaseNPC, deltaTime: number): void {
        let parentOrigin = parent.GetAbsOrigin();
        let targetOrigin = this.target.GetAbsOrigin();
        let dA = parentOrigin;
        dA.z = 0;
        let dB = targetOrigin;
        dB.z = 0;
        let direction = (dB - dA as Vector).Normalized();
        let tickSpeed = this.speed * deltaTime;
        tickSpeed = math.min(tickSpeed, this.endDistance);
        let tickOrigin = parentOrigin + (tickSpeed * direction) as Vector;
        parent.SetAbsOrigin(tickOrigin);
        parent.FaceTowards(targetOrigin);
        GridNav.DestroyTreesAroundPoint(tickOrigin, this.tree_radius, false);
        let distance = parent.GetRangeToUnit(this.target);
        if (distance <= this.endDistance) {
            if (this.doHeal) {
                let spell = this.GetAbilityPlus();
                let healAmount = parent.GetHealth() * (spell.GetSpecialValueFor("hp_as_heal") / 100);
                this.target.ApplyHeal(healAmount, this.GetAbilityPlus());
                this.target.EmitSound("Sohei.PalmOfLife.Heal");
                let part = ResHelper.CreateParticleEx("particles/units/heroes/hero_omniknight/omniknight_purification.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.target);
                ParticleManager.SetParticleControl(part, 1, Vector(this.target.GetModelRadius(), 1, 1));
                ParticleManager.ReleaseParticleIndex(part);
                SendOverheadEventMessage(undefined, 10, this.target, healAmount, undefined);
                let modMomentum = parent.findBuff<modifier_sohei_momentum_passive>("modifier_sohei_momentum_passive");
                if (modMomentum && modMomentum.IsMomentumReady()) {
                    modMomentum.SetStackCount(0);
                }
                let spellMomentum = parent.findAbliityPlus<sohei_momentum>("sohei_momentum");
                if (spellMomentum) {
                    spellMomentum.EndCooldown();
                    spellMomentum.UseResources(true, false, true, true);
                }
            }
            this.Destroy();
        }
    }
    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }
}
@registerModifier()
export class modifier_special_bonus_imba_sohei_wholeness_of_body_heal extends BaseModifier_Plus {
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
