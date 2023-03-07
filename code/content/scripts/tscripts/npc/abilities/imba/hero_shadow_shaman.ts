
import { GameFunc } from "../../../GameFunc";
import { AoiHelper } from "../../../helper/AoiHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_shadow_shaman_ether_shock extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_shadow_shaman_ether_shock_handler";
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        if (target.TriggerSpellAbsorb(this)) {
            return;
        }
        this.GetCasterPlus().EmitSound("Hero_ShadowShaman.EtherShock");
        if (this.GetCasterPlus().GetUnitName().includes("shadow_shaman") && RollPercentage(75)) {
            this.GetCasterPlus().EmitSound("shadowshaman_shad_ability_ether_0" + RandomInt(1, 4));
        }
        let enemies = AoiHelper.FindUnitsInBicycleChain(this.GetCasterPlus().GetTeamNumber(), target.GetAbsOrigin(), this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetAbsOrigin() + ((target.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized() * (this.GetSpecialValueFor("end_distance") + GPropertyCalculate.GetCastRangeBonus(this.GetCasterPlus())) as Vector) as Vector, this.GetSpecialValueFor("start_radius"), this.GetSpecialValueFor("end_radius"), undefined, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST, false);
        let enemies_hit = 0;
        let attachment;
        let dramatic_passive_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_shadow_shaman_ether_shock_handler", this.GetCasterPlus()) as modifier_imba_shadow_shaman_ether_shock_handler;
        for (const enemy of (enemies)) {
            if (enemies_hit < this.GetSpecialValueFor("targets")) {
                enemy.EmitSound("Hero_ShadowShaman.EtherShock.Target");
                let ether_shock_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_shadowshaman/shadowshaman_ether_shock.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetCasterPlus());
                if (enemies_hit % 2 == 1) {
                    attachment = "attach_attack1";
                } else {
                    attachment = "attach_attack2";
                }
                ParticleManager.SetParticleControlEnt(ether_shock_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, attachment, this.GetCasterPlus().GetAbsOrigin(), true);
                ParticleManager.SetParticleControl(ether_shock_particle, 1, enemy.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(ether_shock_particle);
                let damageTable: ApplyDamageOptions = {
                    victim: enemy,
                    damage: this.GetTalentSpecialValueFor("damage"),
                    damage_type: this.GetAbilityDamageType(),
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this
                }
                ApplyDamage(damageTable);
                let joy_buzzer_modifier = enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_shadow_shaman_ether_shock_joy_buzzer", {
                    duration: ((this.GetSpecialValueFor("joy_buzzer_stun_duration") + this.GetSpecialValueFor("joy_buzzer_off_duration")) * this.GetSpecialValueFor("joy_buzzer_instances") - this.GetSpecialValueFor("joy_buzzer_stun_duration")) * (1 - enemy.GetStatusResistance())
                });
                if (this == this.GetCasterPlus().FindAbilityByName(this.GetAbilityName()) && dramatic_passive_modifier && dramatic_passive_modifier.dramatic && dramatic_passive_modifier.dramatic == true) {
                    enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_shadow_shaman_ether_shock_mute", {
                        duration: this.GetSpecialValueFor("dramatic_mute_duration") * (1 - enemy.GetStatusResistance())
                    });
                }
                enemies_hit = enemies_hit + 1;
            }
        }
    }
}
@registerModifier()
export class modifier_imba_shadow_shaman_ether_shock_handler extends BaseModifier_Plus {
    public interval: number;
    public enemy_team: any;
    public counter: number;
    public dramatic: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        this.interval = 0.1;
        if (this.GetParentPlus().GetTeamNumber() == DOTATeam_t.DOTA_TEAM_GOODGUYS) {
            this.enemy_team = DOTATeam_t.DOTA_TEAM_BADGUYS;
        } else {
            this.enemy_team = DOTATeam_t.DOTA_TEAM_GOODGUYS;
        }
        if (!IsServer()) {
            return;
        }
        this.counter = 0;
        this.dramatic = false;
        this.StartIntervalThink(this.interval);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (!IsLocationVisible(this.enemy_team, this.GetParentPlus().GetAbsOrigin())) {
            this.counter = math.min(this.counter + this.interval, this.GetSpecialValueFor("dramatic_fog_duration"));
        } else {
            this.counter = math.max(this.counter - this.interval, 0);
        }
        this.SetStackCount(this.counter * 10);
        if (this.counter >= this.GetSpecialValueFor("dramatic_fog_duration")) {
            this.dramatic = true;
        } else if (this.counter <= 0) {
            this.dramatic = false;
        }
    }
}
@registerModifier()
export class modifier_imba_shadow_shaman_ether_shock_joy_buzzer extends BaseModifier_Plus {
    public joy_buzzer_stun_duration: number;
    public joy_buzzer_off_duration: number;
    public joy_buzzer_instances: any;
    public joy_buzzer_instance_duration: number;
    IgnoreTenacity() {
        return true;
    }
    BeCreated(p_0: any,): void {
        this.joy_buzzer_stun_duration = this.GetSpecialValueFor("joy_buzzer_stun_duration");
        this.joy_buzzer_off_duration = this.GetSpecialValueFor("joy_buzzer_off_duration");
        this.joy_buzzer_instances = this.GetSpecialValueFor("joy_buzzer_instances");
        this.joy_buzzer_instance_duration = this.joy_buzzer_stun_duration + this.joy_buzzer_off_duration;
        if (!IsServer()) {
            return;
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state: Partial<Record<modifierstate, boolean>> = {}
        if (this.GetElapsedTime() % this.joy_buzzer_instance_duration >= 0 && this.GetElapsedTime() % this.joy_buzzer_instance_duration <= this.joy_buzzer_stun_duration) {
            state[modifierstate.MODIFIER_STATE_STUNNED] = true;
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_shadow_shaman_ether_shock_mute extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/items4_fx/nullifier_mute_2.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    BeCreated(p_0: any,): void {
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_MUTED]: true
        }
        return state;
    }
}
@registerAbility()
export class imba_shadow_shaman_voodoo extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_shadow_shaman_voodoo_handler";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
    }
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_shadow_shaman_hex_cooldown");
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_shadow_shaman_voodoo_handler", this.GetCasterPlus()) == 0 || target != this.GetCasterPlus()) {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
        } else {
            return UnitFilterResult.UF_SUCCESS;
        }
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget() as IBaseNpc_Plus;
        if (target.IsMagicImmune()) {
            return undefined;
        }
        if (target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            if (!target.TriggerSpellAbsorb(this)) {
                if (target.IsIllusion() && !GFuncEntity.Custom_bIsStrongIllusion(target)) {
                    target.Kill(this, this.GetCasterPlus());
                } else {
                    if (this.GetCasterPlus().GetUnitName().includes("shadow_shaman") && RollPercentage(75)) {
                        this.GetCasterPlus().EmitSound("shadowshaman_shad_ability_voodoo_0" + RandomInt(1, 4));
                    }
                    target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_shadow_shaman_voodoo", {
                        duration: this.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance())
                    });
                }
            }
        } else {
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_shadow_shaman_voodoo", {
                duration: this.GetSpecialValueFor("duration")
            });
        }
        target.EmitSound("Hero_ShadowShaman.Hex.Target");
        target.EmitSound("General.Illusion.Create");
        let chicken_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_shadowshaman/shadowshaman_voodoo.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        ParticleManager.ReleaseParticleIndex(chicken_particle);
    }

    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_shadow_shaman_wards_movement") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_shadow_shaman_wards_movement")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_shadow_shaman_wards_movement"), "modifier_special_bonus_imba_shadow_shaman_wards_movement", {});
        }
    }
}
@registerModifier()
export class modifier_imba_shadow_shaman_voodoo_handler extends BaseModifier_Plus {
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
            1: Enum_MODIFIER_EVENT.ON_ORDER,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
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
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.GetParentPlus() && this.GetCasterPlus().HasTalent("special_bonus_imba_shadow_shaman_hex_parlor_tricks") && !this.GetParentPlus().IsIllusion() && this.GetAbilityPlus() && this.GetAbilityPlus().IsTrained() && this == this.GetParentPlus().FindAllModifiersByName("modifier_imba_shadow_shaman_voodoo_handler")[0] && !keys.target.IsOther() && !keys.target.IsBuilding() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
            if (GFuncRandom.PRD(this.GetCasterPlus().GetTalentValue("special_bonus_imba_shadow_shaman_hex_parlor_tricks"), this)) {
                keys.target.EmitSound("Hero_ShadowShaman.Hex.Target");
                keys.target.EmitSound("General.Illusion.Create");
                keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_shadow_shaman_voodoo", {
                    duration: this.GetCasterPlus().GetTalentValue("special_bonus_imba_shadow_shaman_hex_parlor_tricks", "value2") * (1 - keys.target.GetStatusResistance())
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_shadow_shaman_voodoo extends BaseModifier_Plus {
    public movespeed: number;
    public base_movespeed: number;
    public base_attackrange: number;
    public base_attacktime: number;
    public deprecation_radius: number;
    public deprecation_angle: any;
    public cucco_move_speed: number;
    public cucco_attack_range: number;
    public cucco_attack_speed: number;
    public cucco_base_attack_time: number;
    public targets: EntityIndex[];
    public attack_capability: any;
    IsDebuff(): boolean {
        return this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber();
    }
    BeCreated(p_0: any,): void {
        this.movespeed = this.GetSpecialValueFor("movespeed");
        this.base_movespeed = 285;
        if (this.GetParentPlus().GetBaseMoveSpeed) {
            this.base_movespeed = this.GetParentPlus().GetBaseMoveSpeed();
        }
        this.base_attackrange = 400;
        if (this.GetParentPlus().Script_GetAttackRange) {
            this.base_attackrange = this.GetParentPlus().Script_GetAttackRange();
        }
        this.base_attacktime = 1.7;
        if (this.GetParentPlus().GetBaseAttackTime) {
            this.base_attacktime = this.GetParentPlus().GetBaseAttackTime();
        }
        this.deprecation_radius = this.GetSpecialValueFor("deprecation_radius");
        this.deprecation_angle = this.GetSpecialValueFor("deprecation_angle");
        this.cucco_move_speed = this.GetSpecialValueFor("cucco_move_speed");
        this.cucco_attack_range = this.GetSpecialValueFor("cucco_attack_range");
        this.cucco_attack_speed = this.GetSpecialValueFor("cucco_attack_speed");
        this.cucco_base_attack_time = this.GetSpecialValueFor("cucco_base_attack_time");
        if (!IsServer()) {
            return;
        }
        this.targets = []
        if (this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            this.attack_capability = this.GetParentPlus().GetAttackCapability();
            this.GetParentPlus().SetAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_MELEE_ATTACK);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("General.Illusion.Destroy");
        if (this.attack_capability) {
            this.GetParentPlus().SetAttackCapability(this.attack_capability);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state: Partial<Record<modifierstate, boolean>> = {
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
            [modifierstate.MODIFIER_STATE_MUTED]: true
        }
        if (this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            state[modifierstate.MODIFIER_STATE_DISARMED] = true;
            state[modifierstate.MODIFIER_STATE_BLOCK_DISABLED] = true;
        }
        state[modifierstate.MODIFIER_STATE_HEXED] = true;
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BASE_OVERRIDE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            5: GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT,
            6: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BASE_OVERRIDE)
    CC_GetModifierMoveSpeedOverride(): number {
        if (this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            return this.movespeed;
        } else {
            if (this.cucco_move_speed && this.base_movespeed && this.cucco_move_speed > this.base_movespeed) {
                return this.cucco_move_speed;
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    CC_GetModifierModelChange(): string {
        return "models/props_gameplay/chicken.vmdl";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        if (this.base_attackrange && this.cucco_attack_range && this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            return -this.base_attackrange + this.cucco_attack_range;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            return this.cucco_attack_speed;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)
    CC_GetModifierBaseAttackTimeConstant(): number {
        if (this.cucco_base_attack_time && this.base_attacktime && this.cucco_base_attack_time < this.base_attacktime) {
            return this.cucco_base_attack_time;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND)
    CC_GetAttackSound(): string {
        return "tutorial_smallfence_smash";
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("deprecation_radius") || 500;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        if (this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
        } else {
            return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
        }
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_shadow_shaman_voodoo_deprecation";
    }
    GetAuraEntityReject(hTarget: IBaseNpc_Plus): boolean {
        if (!IsServer()) {
            return;
        }
        return hTarget.IsRoshan() ||
            hTarget == this.GetParentPlus()
            || (math.abs(AngleDiff(VectorToAngles(hTarget.GetForwardVector()).y, VectorToAngles(this.GetParentPlus().GetAbsOrigin() - hTarget.GetAbsOrigin() as Vector).y)) > (this.GetSpecialValueFor("deprecation_angle") || 45))
            || this.targets.includes(hTarget.GetEntityIndex()) || !hTarget.CanEntityBeSeenByMyTeam(this.GetParentPlus());
    }
}
@registerModifier()
export class modifier_imba_shadow_shaman_voodoo_deprecation extends BaseModifier_Plus {
    public deprecation_threshold: any;
    BeCreated(p_0: any,): void {
        this.deprecation_threshold = this.GetSpecialValueFor("deprecation_threshold");
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().SetForwardVector((this.GetCasterPlus().GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Normalized());
        this.GetParentPlus().FaceTowards(this.GetCasterPlus().GetAbsOrigin());
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_VICTORY;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.GetParentPlus() && keys.damage >= this.GetParentPlus().GetMaxHealth() * this.deprecation_threshold * 0.01) {
            let voodoo_modifier = this.GetCasterPlus().findBuff<modifier_imba_shadow_shaman_voodoo>("modifier_imba_shadow_shaman_voodoo");
            if (voodoo_modifier && voodoo_modifier.targets) {
                voodoo_modifier.targets.push(this.GetParentPlus().GetEntityIndex());
                this.Destroy();
            }
        }
    }
}
@registerAbility()
export class imba_shadow_shaman_shackles extends BaseAbility_Plus {
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_CHANNELLED + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_shadow_shaman_shackles_handler";
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (!this.GetCasterPlus().HasModifier("modifier_imba_shadow_shaman_shackles_target_handler") || target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() || target == this.GetCasterPlus()) {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
        } else {
            return UnitFilterResult.UF_SUCCESS;
        }
    }
    GetChannelTime(): number {
        return this.GetCasterPlus().findBuffStack("modifier_imba_shadow_shaman_shackles_handler", this.GetCasterPlus()) * 0.01;
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        if (target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            if (!target.TriggerSpellAbsorb(this)) {
                this.GetCasterPlus().EmitSound("Hero_ShadowShaman.Shackles.Cast");
                if (this.GetCasterPlus().GetUnitName().includes("shadow_shaman") && RollPercentage(75)) {
                    let responses = {
                        "1": "shadowshaman_shad_ability_shackle_01",
                        "2": "shadowshaman_shad_ability_shackle_02",
                        "3": "shadowshaman_shad_ability_shackle_03",
                        "4": "shadowshaman_shad_ability_shackle_04",
                        "5": "shadowshaman_shad_ability_shackle_05",
                        "6": "shadowshaman_shad_ability_shackle_06",
                        "7": "shadowshaman_shad_ability_shackle_08",
                        "8": "shadowshaman_shad_ability_entrap_02",
                        "9": "shadowshaman_shad_ability_entrap_03"
                    }
                    this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(responses));
                }
                let enemies = FindUnitsInLine(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), target.GetAbsOrigin(), undefined, this.GetSpecialValueFor("stronghold_width"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_shadow_shaman_shackles", {
                        duration: this.GetChannelTime()
                    });
                }
            } else {
                this.GetCasterPlus().Interrupt();
            }
        } else {
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_shadow_shaman_shackles_chariot", {
                duration: this.GetChannelTime()
            });
        }
        target.EmitSound("Hero_ShadowShaman.Shackles.Cast");
    }
    OnChannelFinish(bInterrupted: boolean): void {
        if (!IsServer()) {
            return;
        }
        let target = this.GetCursorTarget();
        if (target) {
            target.StopSound("Hero_ShadowShaman.Shackles.Cast");
            if (target.FindModifierByNameAndCaster("modifier_imba_shadow_shaman_shackles", this.GetCasterPlus())) {
                target.RemoveModifierByNameAndCaster("modifier_imba_shadow_shaman_shackles", this.GetCasterPlus());
            } else if (target.FindModifierByNameAndCaster("modifier_imba_shadow_shaman_shackles_chariot", this.GetCasterPlus())) {
                target.RemoveModifierByNameAndCaster("modifier_imba_shadow_shaman_shackles_chariot", this.GetCasterPlus());
            }
        }
    }
}
@registerModifier()
export class modifier_imba_shadow_shaman_shackles_handler extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED,
            2: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_OnAbilityExecuted(keys: ModifierAbilityEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.ability == this.GetAbilityPlus()) {
            if (keys.target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
                this.GetCasterPlus().SetModifierStackCount("modifier_imba_shadow_shaman_shackles_handler", this.GetCasterPlus(), this.GetAbilityPlus().GetTalentSpecialValueFor("channel_time") * (1 - keys.target.GetStatusResistance()) * 100);
            } else {
                this.GetCasterPlus().SetModifierStackCount("modifier_imba_shadow_shaman_shackles_handler", this.GetCasterPlus(), this.GetAbilityPlus().GetTalentSpecialValueFor("channel_time") * this.GetSpecialValueFor("chariot_channel_multiplier") * 100);
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (!IsServer() || keys.unit != this.GetParentPlus() || keys.order_type != dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO || keys.ability != this.GetAbilityPlus()) {
            return;
        }
        if (this.GetAbilityPlus().GetAutoCastState()) {
            this.GetParentPlus().RemoveModifierByName("modifier_imba_shadow_shaman_shackles_target_handler");
        } else {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_shadow_shaman_shackles_target_handler", {});
        }
    }
}
@registerModifier()
export class modifier_imba_shadow_shaman_shackles_target_handler extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(p_0: ModifierUnitEvent,): void {
        if (!this.GetAbilityPlus() || this.GetAbilityPlus().IsNull()) {
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_shadow_shaman_shackles extends BaseModifier_Plus {
    public tick_interval: number;
    public total_damage: number;
    public channel_time: number;
    public swindle_gold_per_tick: any;
    public damage_per_tick: number;
    IgnoreTenacity() {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        let shackle_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_shadowshaman/shadowshaman_shackle.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(shackle_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(shackle_particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(shackle_particle, 4, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(shackle_particle, 5, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(shackle_particle, 6, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
        this.AddParticle(shackle_particle, true, false, -1, true, false);
        this.tick_interval = this.GetSpecialValueFor("tick_interval");
        this.total_damage = this.GetSpecialValueFor("total_damage");
        this.channel_time = this.GetSpecialValueFor("channel_time");
        this.swindle_gold_per_tick = this.GetSpecialValueFor("swindle_gold_per_tick");
        this.damage_per_tick = this.total_damage / (this.channel_time / this.tick_interval);
        this.StartIntervalThink(this.tick_interval * (1 - this.GetParentPlus().GetStatusResistance()));
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetAbilityPlus().IsChanneling()) {
            this.Destroy();
        } else {
            let damageTable = {
                victim: this.GetParentPlus(),
                damage: this.damage_per_tick,
                damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus()
            }
            ApplyDamage(damageTable);
            if (this.GetParentPlus().IsRealUnit() && this.GetParentPlus().GetPlayerOwnerID() /**&& this.GetParentPlus().ModifyGold && this.GetCasterPlus().ModifyGold*/) {
                let actual_gold_to_steal = math.min(this.swindle_gold_per_tick, PlayerResource.GetUnreliableGold(this.GetParentPlus().GetPlayerOwnerID()));
                // this.GetParentPlus().ModifyGold(-actual_gold_to_steal, false, 0);
                // this.GetCasterPlus().ModifyGold(actual_gold_to_steal, false, 0);
                SendOverheadEventMessage(this.GetCasterPlus().GetPlayerOwner(), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_XP, this.GetCasterPlus(), actual_gold_to_steal, undefined);
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_DISABLED;
    }
}
@registerModifier()
export class modifier_imba_shadow_shaman_shackles_chariot extends BaseModifier_Plus {
    public chariot_break_distance: number;
    public chariot_bonus_move_speed: number;
    public chariot_max_length: any;
    public vector: any;
    public current_position: any;
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        this.chariot_break_distance = this.GetSpecialValueFor("chariot_break_distance");
        this.chariot_bonus_move_speed = this.GetSpecialValueFor("chariot_bonus_move_speed");
        if (!IsServer()) {
            return;
        }
        let shackle_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_shadowshaman/shadowshaman_shackle.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(shackle_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(shackle_particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(shackle_particle, 4, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(shackle_particle, 5, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(shackle_particle, 6, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
        this.AddParticle(shackle_particle, true, false, -1, true, false);
        this.chariot_max_length = this.GetAbilityPlus().GetCastRange(this.GetParentPlus().GetAbsOrigin(), this.GetParentPlus());
        this.vector = this.GetParentPlus().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin();
        this.current_position = this.GetParentPlus().GetAbsOrigin();
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetAbilityPlus().IsChanneling() || (this.GetParentPlus().GetAbsOrigin() - this.current_position as Vector).Length2D() > this.chariot_break_distance) {
            this.GetAbilityPlus().SetChanneling(false);
            this.Destroy();
        } else {
            this.chariot_max_length = this.GetAbilityPlus().GetCastRange(this.GetParentPlus().GetAbsOrigin(), this.GetParentPlus());
            this.vector = this.GetCasterPlus().GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin();
            this.current_position = this.GetParentPlus().GetAbsOrigin();
            if ((this.GetParentPlus().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D() > this.chariot_max_length) {
                FindClearSpaceForUnit(this.GetCasterPlus(), this.GetParentPlus().GetAbsOrigin() + this.vector.Normalized() * this.chariot_max_length as Vector, false);
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus() && this.GetAbilityPlus().IsChanneling()) {
            this.GetAbilityPlus().SetChanneling(false);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.chariot_bonus_move_speed;
    }
}
@registerAbility()
export class imba_shadow_shaman_parlor_tricks extends BaseAbility_Plus {
}
@registerModifier()
export class modifier_imba_shadow_shaman_parlor_tricks_handler extends BaseModifier_Plus {
}
@registerAbility()
export class imba_shadow_shaman_mass_serpent_ward extends BaseAbility_Plus {
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE;
    }
    GetAOERadius(): number {
        return 150;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target_point = this.GetCursorPosition();
        let ward_level = this.GetLevel();
        let ward_name = "npc_dota_shadow_shaman_ward_";
        let response = "shadowshaman_shad_ability_ward_";
        let spawn_particle = "particles/units/heroes/hero_shadowshaman/shadowshaman_ward_spawn.vpcf";
        let ward_count = this.GetSpecialValueFor("ward_count");
        let ward_duration = this.GetSpecialValueFor("duration");
        let base_hp = this.GetSpecialValueFor("ward_hp");
        let bonus_hp = 0;
        let bonus_dmg = 0;
        if (caster.HasTalent("special_bonus_imba_shadow_shaman_2")) {
            bonus_hp = caster.GetTalentValue("special_bonus_imba_shadow_shaman_2");
        }
        if (caster.HasTalent("special_bonus_imba_shadow_shaman_3")) {
            bonus_dmg = caster.GetTalentValue("special_bonus_imba_shadow_shaman_3");
        }
        caster.EmitSound("Hero_ShadowShaman.SerpentWard");
        caster.EmitSound(response + RandomInt(4, 7));
        let spawn_particle_fx = ResHelper.CreateParticleEx(spawn_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.SetParticleControl(spawn_particle_fx, 0, target_point);
        let formation_vectors: Vector[] = []
        for (let i = 0; i < ward_count; i++) {
            formation_vectors.push(Vector(math.cos(math.rad(((360 / ward_count) * i))), math.sin(math.rad(((360 / ward_count) * i))), 0) * 150 as Vector);
        }
        let find_clear_space = true;
        let npc_owner = caster;
        let unit_owner = caster;
        for (let i = 0; i < ward_count; i++) {
            this.SummonWard(target_point + formation_vectors[i] as Vector);
        }
    }
    SummonWard(position: Vector, bChild = false, elapsedTime = 0) {
        let new_hp;
        let duration;
        if (!bChild) {
            new_hp = this.GetSpecialValueFor("ward_hp") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_shadow_shaman_2");
            duration = this.GetSpecialValueFor("duration");
        } else {
            new_hp = this.GetSpecialValueFor("snake_charmer_health");
            duration = math.max(this.GetSpecialValueFor("duration") - elapsedTime + this.GetSpecialValueFor("snake_charmer_bonus_duration"), this.GetSpecialValueFor("snake_charmer_bonus_duration"));
        }
        let ward = BaseNpc_Plus.CreateUnitByName("npc_dota_shadow_shaman_ward_" + math.min(this.GetLevel(), 3), position, this.GetCasterPlus(), true);
        ward.SetForwardVector(this.GetCasterPlus().GetForwardVector());
        ward.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_mass_serpent_ward", {});
        ward.AddNewModifier(this.GetCasterPlus(), this, "modifier_kill", {
            duration: duration
        });
        if (this.GetCasterPlus().GetPlayerOwnerID) {
            ward.SetControllableByPlayer(this.GetCasterPlus().GetPlayerOwnerID(), true);
        } else if (this.GetCasterPlus().GetOwnerPlus() && this.GetCasterPlus().GetOwnerPlus().GetPlayerOwnerID) {
            ward.SetControllableByPlayer(this.GetCasterPlus().GetOwnerPlus().GetPlayerOwnerID(), true);
        }
        ward.SetBaseMaxHealth(new_hp);
        ward.SetMaxHealth(new_hp);
        ward.SetHealth(new_hp);
        ward.SetBaseDamageMin(this.GetSpecialValueFor("damage_tooltip") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_shadow_shaman_3"));
        ward.SetBaseDamageMax(this.GetSpecialValueFor("damage_tooltip") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_shadow_shaman_3"));
        if (bChild) {
            ward.SetRenderColor(0, 0, 0);
        }
    }
}
@registerModifier()
export class modifier_imba_mass_serpent_ward extends BaseModifier_Plus {
    public scepter_additional_targets: any;
    public snake_charmer_creep_count: number;
    public snake_charmer_hero_count: number;
    public snake_charmer_creep_bat_reduction_pct: number;
    public snake_charmer_hero_bat_reduction_pct: number;
    public bonus_range: number;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let parent = this.GetParentPlus();
        this.scepter_additional_targets = ability.GetSpecialValueFor("scepter_additional_targets");
        this.snake_charmer_creep_count = this.GetSpecialValueFor("snake_charmer_creep_count");
        this.snake_charmer_hero_count = this.GetSpecialValueFor("snake_charmer_hero_count");
        this.snake_charmer_creep_bat_reduction_pct = this.GetSpecialValueFor("snake_charmer_creep_bat_reduction_pct");
        this.snake_charmer_hero_bat_reduction_pct = this.GetSpecialValueFor("snake_charmer_hero_bat_reduction_pct");
        if (caster.HasScepter()) {
            this.bonus_range = ability.GetSpecialValueFor("scepter_bonus_range");
        }
        if (!IsServer()) {
            return;
        }
        this.AddTimer(FrameTime(), () => {
            FindClearSpaceForUnit(this.GetParentPlus(), this.GetParentPlus().GetAbsOrigin(), false);
        });
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            3: Enum_MODIFIER_EVENT.ON_ATTACK,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS,
            6: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE,
            7: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        };
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return -100;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (IsServer()) {
            if (params.target == this.GetParentPlus()) {
                let damage = 1;
                if (this.GetParentPlus().GetHealth() > damage) {
                    this.GetParentPlus().SetHealth(this.GetParentPlus().GetHealth() - damage);
                } else {
                    this.GetParentPlus().Kill(undefined, params.attacker);
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && !keys.no_attack_cooldown && this.GetCasterPlus() && !this.GetCasterPlus().IsNull() && this.GetCasterPlus().HasScepter()) {
            let enemies = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.GetParentPlus().Script_GetAttackRange(), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_ANY_ORDER, false);
            let targets_aimed = 0;
            for (let i = 0; i < GameFunc.GetCount(enemies); i++) {
                if (enemies[i] != keys.target) {
                    this.GetParentPlus().PerformAttack(enemies[i], false, false, true, true, true, false, false);
                    targets_aimed = targets_aimed + 1;
                    if (targets_aimed >= this.scepter_additional_targets) {
                        return;
                    }
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        return this.bonus_range;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        if (IsServer()) {
            if (params.attacker == this.GetParentPlus()) {
                if (params.damage > 0) {
                    let damageTable = {
                        victim: params.unit,
                        damage: 1,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                        attacker: this.GetCasterPlus(),
                        ability: this.GetAbilityPlus()
                    }
                    ApplyDamage(damageTable);
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE)
    CC_GetModifierMoveSpeed_Absolute(): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_shadow_shaman_wards_movement")) {
            return this.GetCasterPlus().GetTalentValue("special_bonus_imba_shadow_shaman_wards_movement");
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.GetParentPlus() && keys.attacker != keys.unit && this.GetAbilityPlus() && !keys.unit.IsOther() && keys.unit.GetUnitName() != "npc_dota_unit_undying_zombie") {
            if (!keys.unit.IsRealUnit() && !keys.unit.IsBuilding()) {
                this.GetParentPlus().SetMaxHealth(this.GetParentPlus().GetMaxHealth() + this.snake_charmer_creep_count);
                this.GetParentPlus().Heal(this.snake_charmer_creep_count, this.GetAbilityPlus());
                this.GetParentPlus().SetBaseAttackTime(this.GetParentPlus().GetBaseAttackTime() * (1 - (this.snake_charmer_creep_bat_reduction_pct * 0.01)));
                SendOverheadEventMessage(this.GetParentPlus().GetPlayerOwner(), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, this.GetParentPlus(), this.snake_charmer_creep_count, undefined);
            } else {
                this.GetParentPlus().SetMaxHealth(this.GetParentPlus().GetMaxHealth() + this.snake_charmer_hero_count);
                this.GetParentPlus().Heal(this.snake_charmer_hero_count, this.GetAbilityPlus());
                this.GetParentPlus().SetBaseAttackTime(this.GetParentPlus().GetBaseAttackTime() * (1 - (this.snake_charmer_hero_bat_reduction_pct * 0.01)));
                SendOverheadEventMessage(this.GetParentPlus().GetPlayerOwner(), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, this.GetParentPlus(), this.snake_charmer_hero_count, undefined);
            }
            this.GetParentPlus().SetModel("models/items/shadowshaman/serpent_ward/dotapit_s3_wild_tempest_wards/dotapit_s3_wild_tempest_wards.vmdl");
            this.GetParentPlus().SetModelScale(1.3);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let particle = "particles/units/heroes/hero_shadowshaman/shadowshaman_ward_death.vpcf";
            let spawn_particle_fx = ResHelper.CreateParticleEx(particle, ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
            ParticleManager.SetParticleControl(spawn_particle_fx, 0, this.GetParentPlus().GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(spawn_particle_fx);
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_shadow_shaman_shackles_duration extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_shadow_shaman_hex_parlor_tricks extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_shadow_shaman_ether_shock_damage extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_shadow_shaman_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_shadow_shaman_hex_cooldown extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_shadow_shaman_wards_movement extends BaseModifier_Plus {
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
