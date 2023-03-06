
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { GameServiceConfig } from "../../../shared/GameServiceConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_troll_warlord_berserkers_rage extends BaseAbility_Plus {
    public mode: any;
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return false;
    }
    IsNetherWardStealable() {
        return false;
    }
    ResetToggleOnRespawn(): boolean {
        return true;
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    OnUpgrade(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (this.GetLevel() == 1) {
                caster.findAbliityPlus<imba_troll_warlord_whirling_axes_melee>("imba_troll_warlord_whirling_axes_melee").SetActivated(false);
            }
            if (!(caster.HasModifier("modifier_imba_berserkers_rage_ranged") || caster.HasModifier("modifier_imba_berserkers_rage_melee"))) {
                if (this.GetToggleState()) {
                    caster.AddNewModifier(caster, this, "modifier_imba_berserkers_rage_melee", {});
                } else {
                    caster.AddNewModifier(caster, this, "modifier_imba_berserkers_rage_ranged", {});
                }
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.mode == 1) {
            this.ToggleAbility();
            this.ToggleAbility();
            this.ToggleAbility();
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_troll_warlord_1") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_troll_warlord_1")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_troll_warlord_1"), "modifier_special_bonus_imba_troll_warlord_1", {});
        }
    }
    OnToggle(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            caster.EmitSound("Hero_TrollWarlord.BerserkersRage.Toggle");
            if (RollPercentage(25) && (caster.GetName().includes("troll_warlord")) && !caster.TempData().beserk_sound) {
                caster.EmitSound("troll_warlord_troll_beserker_0" + math.random(1, 4));
                caster.TempData().beserk_sound = true;
                this.AddTimer(10, () => {
                    caster.TempData().beserk_sound = undefined;
                });
            }
            caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1);
            if (caster.HasModifier("modifier_imba_berserkers_rage_ranged") && this.GetToggleState()) {
                caster.RemoveModifierByName("modifier_imba_berserkers_rage_ranged");
                caster.AddNewModifier(caster, this, "modifier_imba_berserkers_rage_melee", {});
                caster.findAbliityPlus<imba_troll_warlord_whirling_axes_melee>("imba_troll_warlord_whirling_axes_melee").SetActivated(true);
                caster.findAbliityPlus<imba_troll_warlord_whirling_axes_ranged>("imba_troll_warlord_whirling_axes_ranged").SetActivated(false);
                caster.SetAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_MELEE_ATTACK);
                this.mode = 2;
            } else {
                caster.RemoveModifierByName("modifier_imba_berserkers_rage_melee");
                caster.AddNewModifier(caster, this, "modifier_imba_berserkers_rage_ranged", {});
                caster.findAbliityPlus<imba_troll_warlord_whirling_axes_melee>("imba_troll_warlord_whirling_axes_melee").SetActivated(false);
                caster.findAbliityPlus<imba_troll_warlord_whirling_axes_ranged>("imba_troll_warlord_whirling_axes_ranged").SetActivated(true);
                caster.SetAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK);
                this.mode = 1;
            }
        }
    }
    GetAbilityTextureName(): string {
        if (this.GetCasterPlus().HasModifier("modifier_imba_berserkers_rage_melee")) {
            return "troll_warlord_berserkers_rage_active";
        } else {
            return "troll_warlord_berserkers_rage";
        }
    }
    OnProjectileHit(hTarget: CDOTA_BaseNPC | undefined, vLocation: Vector): boolean | void {
        if (!IsServer()) {
            return;
        }
        let ensnare_duration = this.GetSpecialValueFor("ensnare_duration");
        if (hTarget) {
            hTarget.EmitSound("n_creep_TrollWarlord.Ensnare");
            if (hTarget.IsAlive()) {
                hTarget.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_berserkers_rage_ensnare", {
                    duration: ensnare_duration * (1 - hTarget.GetStatusResistance())
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_berserkers_rage_ensnare extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/units/heroes/hero_troll_warlord/troll_warlord_bersekers_net.vpcf";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        };
    }
}
@registerModifier()
export class modifier_imba_berserkers_rage_melee extends BaseModifier_Plus {
    public bash_talent: any;
    AllowIllusionDuplicate(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT,
            5: GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT,
            6: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            7: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND
        }
        return Object.values(decFuns);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND)
    CC_GetAttackSound(): string {
        return "Hero_TrollWarlord.ProjectileImpact";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.GetSpecialValueFor("bonus_move_speed");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.GetSpecialValueFor("bonus_armor");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)
    CC_GetModifierBaseAttackTimeConstant(): number {
        return this.GetSpecialValueFor("base_attack_time");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (IsServer()) {
            if (params.attacker.PassivesDisabled()) {
                return undefined;
            }
            let parent = this.GetParentPlus();
            if ((parent == params.attacker) && (parent.IsRealUnit() || parent.IsClone()) && params.attacker.GetTeam() != params.target.GetTeam() && !params.target.IsOther() && !params.target.IsBuilding()) {
                let ability = this.GetAbilityPlus();
                if (parent.HasTalent("special_bonus_imba_troll_warlord_9")) {
                    if (!this.bash_talent) {
                        GameServiceConfig.IMBA_DISABLED_SKULL_BASHER.push("troll_warlord");
                        this.bash_talent = true;
                    }
                    if (GFuncRandom.PRD(ability.GetSpecialValueFor("ensnare_chance"), ability)) {
                        let bash_damage = ability.GetSpecialValueFor("bash_damage");
                        let ensnare_duration = ability.GetSpecialValueFor("ensnare_duration");
                        ApplyDamage({
                            victim: params.target,
                            attacker: parent,
                            ability: ability,
                            damage: bash_damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                        });
                        params.target.AddNewModifier(parent, ability, "modifier_stunned", {
                            duration: ensnare_duration * (1 - params.target.GetStatusResistance())
                        });
                        params.target.EmitSound("DOTA_Item.SkullBasher");
                    }
                } else {
                    if (!params.target.IsMagicImmune() && GFuncRandom.PRD(ability.GetSpecialValueFor("ensnare_chance"), ability)) {
                        let net = {
                            Target: params.target,
                            Source: parent,
                            Ability: this.GetAbilityPlus(),
                            bDodgeable: false,
                            EffectName: "particles/units/heroes/hero_troll_warlord/troll_warlord_bersekers_net_projectile.vpcf",
                            iMoveSpeed: 1500,
                            flExpireTime: GameRules.GetGameTime() + 10
                        }
                        ProjectileManager.CreateTrackingProjectile(net);
                    }
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        // if (this.GetParentPlus().GetName() .includes("troll_warlord")) {
        return "melee";
        // }
        // return 0;
    }
    GetPriority(): modifierpriority {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        return -350;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_troll_warlord/troll_warlord_berserk_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_POINT_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_berserkers_rage_ranged extends BaseModifier_Plus {
    AllowIllusionDuplicate(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        }
        return Object.values(decFuns);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.GetCasterPlus().GetTalentValue("special_bonus_imba_troll_warlord_1", "movespeed_pct");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.GetCasterPlus().GetTalentValue("special_bonus_imba_troll_warlord_1", "armor");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)
    CC_GetModifierBaseAttackTimeConstant(): number {
        return this.GetCasterPlus().GetTalentValue("special_bonus_imba_troll_warlord_1", "bat");
    }
    GetPriority(): modifierpriority {
        return 1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (params.attacker.PassivesDisabled()) {
                return undefined;
            }
            if ((parent == params.attacker) && (parent.IsRealUnit() || parent.IsClone())) {
                let ability = this.GetAbilityPlus();
                if (GFuncRandom.PRD(ability.GetSpecialValueFor("ensnare_chance"), ability)) {
                    let hamstring_duration = ability.GetSpecialValueFor("hamstring_duration");
                    params.target.AddNewModifier(parent, ability, "modifier_imba_berserkers_rage_slow", {
                        duration: hamstring_duration * (1 - params.target.GetStatusResistance())
                    });
                    params.target.EmitSound("DOTA_Item.Daedelus.Crit");
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_berserkers_rage_slow extends BaseModifier_Plus {
    public slow: any;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuns);
    } */
    BeCreated(p_0: any,): void {
        this.slow = this.GetSpecialValueFor("hamstring_slow_pct") * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow;
    }
}
@registerAbility()
export class imba_troll_warlord_whirling_axes_ranged extends BaseAbility_Plus {
    tempdata: { [key: string]: any[] } = {};
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return true;
    }
    GetAbilityTextureName(): string {
        return "troll_warlord_whirling_axes_ranged";
    }
    GetCooldown(nLevel: number): number {
        return super.GetCooldown(nLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_troll_warlord_5");
    }
    OnUpgrade(): void {
        if (IsServer()) {
            let ability_melee = this.GetCasterPlus().findAbliityPlus<imba_troll_warlord_whirling_axes_melee>("imba_troll_warlord_whirling_axes_melee");
            let level = this.GetLevel();
            if (ability_melee) {
                if (ability_melee.GetLevel() < level) {
                    ability_melee.SetLevel(level);
                }
            }
        }
    }
    OnAbilityPhaseStart(): boolean {
        if (this.GetCasterPlus().HasModifier("modifier_imba_battle_trance_720")) {
            this.SetOverrideCastPoint(0);
        } else {
            this.SetOverrideCastPoint(0.2);
        }
        return true;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target_loc = this.GetCursorPosition();
            let caster_loc = caster.GetAbsOrigin();
            let axe_width = this.GetSpecialValueFor("axe_width");
            let axe_speed = this.GetSpecialValueFor("axe_speed");
            let axe_range = this.GetSpecialValueFor("axe_range") + GPropertyCalculate.GetCastRangeBonus(caster);
            let axe_damage = this.GetSpecialValueFor("axe_damage");
            let duration = this.GetSpecialValueFor("duration");
            let axe_spread = this.GetSpecialValueFor("axe_spread");
            let axe_count = this.GetSpecialValueFor("axe_count");
            let on_hit_pct = this.GetSpecialValueFor("on_hit_pct");
            let direction;
            if (target_loc == caster_loc) {
                direction = caster.GetForwardVector();
            } else {
                direction = (target_loc - caster_loc as Vector).Normalized();
            }
            axe_count = axe_count + caster.GetTalentValue("special_bonus_imba_troll_warlord_7", "axe_count_increase");
            axe_spread = axe_spread + caster.GetTalentValue("special_bonus_imba_troll_warlord_7", "axe_spread_increase");
            caster.EmitSound("Hero_TrollWarlord.WhirlingAxes.Ranged");
            if ((math.random(1, 100) <= 25) && (caster.GetName().includes("troll_warlord"))) {
                caster.EmitSound("troll_warlord_troll_whirlingaxes_0" + math.random(1, 6));
            }
            let index = DoUniqueString("index");
            this.tempdata[index] = []
            let start_angle;
            let interval_angle = 0;
            if (axe_count == 1) {
                start_angle = 0;
            } else {
                start_angle = axe_spread / 2 * (-1);
                interval_angle = axe_spread / (axe_count - 1);
            }
            for (let i = 0; i < axe_count; i++) {
                let angle = start_angle + (i - 1) * interval_angle;
                let velocity = GFuncVector.RotateVector2D(direction, angle, true) * axe_speed as Vector;
                let projectile = {
                    Ability: this,
                    EffectName: "particles/units/heroes/hero_troll_warlord/troll_warlord_whirling_axe_ranged.vpcf",
                    vSpawnOrigin: caster_loc,
                    fDistance: axe_range,
                    fStartRadius: axe_width,
                    fEndRadius: axe_width,
                    Source: caster,
                    bHasFrontalCone: false,
                    bReplaceExisting: false,
                    iUnitTargetTeam: this.GetAbilityTargetTeam(),
                    iUnitTargetFlags: this.GetAbilityTargetFlags(),
                    iUnitTargetType: this.GetAbilityTargetType(),
                    fExpireTime: GameRules.GetGameTime() + 10.0,
                    bDeleteOnHit: false,
                    vVelocity: Vector(velocity.x, velocity.y, 0),
                    bProvidesVision: false,
                    ExtraData: {
                        index: index,
                        damage: axe_damage,
                        duration: duration,
                        axe_count: axe_count,
                        on_hit_pct: on_hit_pct
                    }
                }
                ProjectileManager.CreateLinearProjectile(projectile);
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        let caster = this.GetCasterPlus();
        if (target) {
            let was_hit = false;
            for (const [_, stored_target] of GameFunc.iPair(this.tempdata[ExtraData.index])) {
                if (target == stored_target) {
                    was_hit = true;
                    return;
                }
            }
            if (was_hit) {
                return undefined;
            }
            this.tempdata[ExtraData.index].push(target);
            ApplyDamage({
                victim: target,
                attacker: caster,
                ability: this,
                damage: ExtraData.damage,
                damage_type: this.GetAbilityDamageType()
            });
            if (GFuncRandom.PRD(ExtraData.on_hit_pct, this)) {
                caster.PerformAttack(target, true, true, true, true, false, true, true);
            }
            target.AddNewModifier(caster, this, "modifier_imba_whirling_axes_ranged", {
                duration: ExtraData.duration * (1 - target.GetStatusResistance())
            });
            target.EmitSound("Hero_TrollWarlord.WhirlingAxes.Target");
        } else {
            this.tempdata[ExtraData.index].push(null);
            if (this.tempdata[ExtraData.index].length == ExtraData.axe_count) {
                this.tempdata[ExtraData.index] = undefined;
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_troll_warlord_2") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_troll_warlord_2")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_troll_warlord_2"), "modifier_special_bonus_imba_troll_warlord_2", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_troll_warlord_5") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_troll_warlord_5")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_troll_warlord_5"), "modifier_special_bonus_imba_troll_warlord_5", {});
        }
    }
}
@registerModifier()
export class modifier_imba_whirling_axes_ranged extends BaseModifier_Plus {
    public slow: any;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.slow = this.GetAbilityPlus().GetTalentSpecialValueFor("movement_speed") * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow;
    }
}
@registerAbility()
export class imba_troll_warlord_whirling_axes_melee extends BaseAbility_Plus {
    tempdata: { [k: string]: IBaseNpc_Plus[] } = {};
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return true;
    }
    GetAbilityTextureName(): string {
        return "troll_warlord_whirling_axes_melee";
    }
    GetCooldown(nLevel: number): number {
        return super.GetCooldown(nLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_troll_warlord_5");
    }
    OnUpgrade(): void {
        if (IsServer()) {
            let ability_ranged = this.GetCasterPlus().findAbliityPlus<imba_troll_warlord_whirling_axes_ranged>("imba_troll_warlord_whirling_axes_ranged");
            let level = this.GetLevel();
            if (ability_ranged) {
                if (ability_ranged.GetLevel() < level) {
                    ability_ranged.SetLevel(level);
                }
            }
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_loc = caster.GetAbsOrigin();
            let axe_radius = this.GetSpecialValueFor("axe_radius");
            let max_range = this.GetSpecialValueFor("max_range");
            let axe_movement_speed = this.GetSpecialValueFor("axe_movement_speed");
            let whirl_duration = this.GetSpecialValueFor("whirl_duration");
            let direction = caster.GetForwardVector();
            caster.EmitSound("Hero_TrollWarlord.WhirlingAxes.Melee");
            if ((math.random(1, 100) <= 25) && (caster.GetName().includes("troll_warlord"))) {
                caster.EmitSound("troll_warlord_troll_whirlingaxes_0" + math.random(1, 6));
            }
            let index = DoUniqueString("index");
            this.tempdata[index] = [];
            let axe_pfx: ParticleID[] = []
            let axe_loc: Vector[] = []
            let axe_random: number[] = []
            for (let i = 0; i < 10; i++) {
                axe_pfx.push(ResHelper.CreateParticleEx("particles/units/heroes/hero_troll_warlord/troll_warlord_whirling_axe_melee.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster));
                ParticleManager.SetParticleControl(axe_pfx[i], 1, caster_loc);
                ParticleManager.SetParticleControl(axe_pfx[i], 4, Vector(whirl_duration, 0, 0));
                axe_random.push(math.random() * 0.9 + 1.8);
            }
            let counter = 0;
            caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2);
            this.AddTimer(FrameTime(), () => {
                counter = counter + FrameTime();
                caster_loc = caster.GetAbsOrigin();
                if (counter <= (whirl_duration / 2)) {
                    for (let i = 0; i < 10; i++) {
                        axe_loc.push(counter * (max_range - axe_radius) * GFuncVector.RotateVector2D(direction, 36 * i + counter * axe_movement_speed, true).Normalized() as Vector);
                        this.DoAxeStuff(index, counter * (max_range - axe_radius) + axe_radius, caster_loc);
                    }
                } else {
                    for (let i = 0; i < 10; i++) {
                        axe_loc.push((whirl_duration - counter / 2) * (max_range - axe_radius) * GFuncVector.RotateVector2D(direction, 36 * i + counter * axe_movement_speed * axe_random[i], true).Normalized() as Vector);
                        this.DoAxeStuff(index, (whirl_duration - counter / 2) * (max_range - axe_radius) + axe_radius, caster_loc);
                    }
                }
                for (let i = 0; i < 10; i++) {
                    ParticleManager.SetParticleControl(axe_pfx[i], 1, caster_loc + axe_loc[i] + Vector(0, 0, 40) as Vector);
                }
                if (counter <= whirl_duration) {
                    return FrameTime();
                } else {
                    for (let i = 0; i < 10; i++) {
                        ParticleManager.DestroyParticle(axe_pfx[i], false);
                        ParticleManager.ReleaseParticleIndex(axe_pfx[i]);
                    }
                }
            });
        }
    }
    DoAxeStuff(index: string, range: number, caster_loc: Vector) {
        let caster = this.GetCasterPlus();
        let damage = this.GetSpecialValueFor("damage");
        let blind_duration = this.GetSpecialValueFor("blind_duration");
        let blind_stacks = this.GetSpecialValueFor("blind_stacks");
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster_loc, undefined, range, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            let was_hit = false;
            for (const [_, stored_target] of GameFunc.iPair(this.tempdata[index])) {
                if (enemy == stored_target) {
                    was_hit = true;
                }
            }
            if (was_hit) {
                return;
            } else {
                this.tempdata[index].push(enemy);
            }
            ApplyDamage({
                victim: enemy,
                attacker: caster,
                ability: this,
                damage: damage,
                damage_type: this.GetAbilityDamageType()
            });
            caster.PerformAttack(enemy, true, true, true, true, false, true, true);
            enemy.AddNewModifier(caster, this, "modifier_imba_whirling_axes_melee", {
                duration: blind_duration * (1 - enemy.GetStatusResistance()),
                blind_stacks: blind_stacks
            });
            enemy.EmitSound("Hero_TrollWarlord.WhirlingAxes.Target");
        }
    }
}
@registerModifier()
export class modifier_imba_whirling_axes_melee extends BaseModifier_Plus {
    public miss_chance: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE
        }
        return Object.values(decFuns);
    } */
    BeCreated(params: any): void {
        this.miss_chance = this.GetSpecialValueFor("blind_pct");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE)
    CC_GetModifierMiss_Percentage(): number {
        return this.miss_chance;
    }
    BeRefresh(params: any): void {
        this.OnCreated(params);
    }
}
@registerAbility()
export class imba_troll_warlord_fervor extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return false;
    }
    IsStealable(): boolean {
        return false;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetAbilityTextureName(): string {
        return "troll_warlord_fervor";
    }
    GetIntrinsicModifierName(): string {
        let hCaster = this.GetCasterPlus();
        if (hCaster.IsRealUnit() || hCaster.IsClone()) {
            return "modifier_imba_fervor";
        }
        return undefined;
    }
    OnUpgrade(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if ((math.random(1, 100) <= 25) && (caster.GetName().includes("troll_warlord"))) {
                caster.EmitSound("troll_warlord_troll_fervor_0" + math.random(1, 6));
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_troll_warlord_4") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_troll_warlord_4")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_troll_warlord_4"), "modifier_special_bonus_imba_troll_warlord_4", {});
        }
    }
}
@registerModifier()
export class modifier_imba_fervor extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(decFuns);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        let parent = this.GetParentPlus();
        if (((params.attacker == parent) || ((params.attacker.GetTeamNumber() == parent.GetTeamNumber()) && params.attacker.HasModifier("modifier_imba_battle_trance") && parent.HasScepter())) && (params.attacker.IsRealUnit() || params.attacker.IsClone()) && params.original_damage > 0) {
            let modifier = params.attacker.FindModifierByNameAndCaster("modifier_imba_fervor_stacks", parent) as modifier_imba_fervor_stacks;
            if (modifier) {
                if (modifier.last_target == params.target) {
                    modifier.IncrementStackCount();
                } else {
                    let loss_pct = 1 - (this.GetAbilityPlus().GetTalentSpecialValueFor("switch_lose_pct") / 100);
                    modifier.SetStackCount(math.max(math.floor(modifier.GetStackCount() * loss_pct), 1));
                    modifier.last_target = params.target;
                }
            } else {
                modifier = params.attacker.AddNewModifier(parent, this.GetAbilityPlus(), "modifier_imba_fervor_stacks", {}) as modifier_imba_fervor_stacks;
                modifier.last_target = params.target;
            }
        }
    }
}
@registerModifier()
export class modifier_imba_fervor_stacks extends BaseModifier_Plus {
    last_target: IBaseNpc_Plus;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.SetStackCount(1);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (!this.GetParentPlus().PassivesDisabled()) {
            return this.GetAbilityPlus().GetTalentSpecialValueFor("bonus_as") * this.GetStackCount();
        }
        return 0;
    }
}
@registerAbility()
export class imba_troll_warlord_battle_trance extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return true;
    }
    GetAbilityTextureName(): string {
        return "troll_warlord_battle_trance";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (IsServer() && this.GetAutoCastState()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        }
    }
    OnUpgrade(): void {
        if (this.GetLevel() == 1) {
            this.ToggleAutoCast();
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (!this.GetAutoCastState()) {
                let duration = this.GetTalentSpecialValueFor("buff_duration");
                let sound = "troll_warlord_troll_battletrance_0" + math.random(1, 6);
                if ((math.random(1, 100) <= 10)) {
                    sound = "Imba.TrollAK47";
                }
                let allies = FindUnitsInRadius(caster.GetTeamNumber(), Vector(0, 0, 0), undefined, FIND_UNITS_EVERYWHERE, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
                caster.EmitSound(sound);
                for (const [_, ally] of GameFunc.iPair(allies)) {
                    let mod = ally.AddNewModifier(caster, this, "modifier_imba_battle_trance", {
                        duration: duration
                    }) as modifier_imba_battle_trance;
                    mod.sound = sound;
                    if (ally.GetAttackTarget && ally.GetAttackTarget()) {
                        ally.GetAttackTarget().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_battle_trance_vision_720", {
                            duration: duration
                        });
                    }
                }
            } else {
                let trance_duration = this.GetSpecialValueFor("trance_duration");
                caster.EmitSound("Hero_TrollWarlord.BattleTrance.Cast");
                caster.Purge(false, true, false, false, false);
                caster.AddNewModifier(caster, this, "modifier_imba_battle_trance_720", {
                    duration: trance_duration
                });
            }
            let cast_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_troll_warlord/troll_warlord_battletrance_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
            ParticleManager.SetParticleControlEnt(cast_pfx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetOrigin(), true);
            ParticleManager.ReleaseParticleIndex(cast_pfx);
            caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_4);
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_troll_warlord_8") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_troll_warlord_8")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_troll_warlord_8"), "modifier_special_bonus_imba_troll_warlord_8", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_troll_warlord_battle_trance_upgrade") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_troll_warlord_battle_trance_upgrade")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_troll_warlord_battle_trance_upgrade"), "modifier_special_bonus_imba_troll_warlord_battle_trance_upgrade", {});
        }
    }
}
@registerModifier()
export class modifier_imba_battle_trance extends BaseModifier_Plus {
    public bonus_as: number;
    public bonus_bat: number;
    sound: string
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT
        });
    } */
    Init(p_0: any,): void {
        let ability = this.GetAbilityPlus();
        let parent = this.GetParentPlus();
        this.bonus_as = ability.GetTalentSpecialValueFor("bonus_as");
        this.bonus_bat = math.min(ability.GetTalentSpecialValueFor("bonus_bat"), parent.GetBaseAttackTime());
        if (parent.IsRealUnit() && IsServer()) {
            EmitSoundOnClient("Hero_TrollWarlord.BattleTrance.Cast.Team", parent.GetPlayerOwner());
            if (this.sound == "Imba.TrollAK47") {
                EmitSoundOnClient("Imba.TrollAK47.Team", parent.GetPlayerOwner());
            }
        }
    }

    BeDestroy(): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (!parent.HasAbility("imba_troll_warlord_fervor") && parent.HasModifier("modifier_imba_fervor_stacks")) {
                parent.RemoveModifierByName("modifier_imba_fervor_stacks");
            }
        }
    }
    GetPriority(): modifierpriority {
        return 10;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_as;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)
    CC_GetModifierBaseAttackTimeConstant(): number {
        return this.bonus_bat;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_troll_warlord/troll_warlord_battletrance_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_POINT_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_battle_trance_720 extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public lifesteal: any;
    public attack_speed: number;
    public movement_speed: number;
    public range: number;
    public bonus_bat: number;
    public target: IBaseNpc_Plus;
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_troll_warlord/troll_warlord_battletrance_buff.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.lifesteal = this.ability.GetSpecialValueFor("lifesteal");
        this.attack_speed = this.ability.GetSpecialValueFor("attack_speed");
        this.movement_speed = this.ability.GetSpecialValueFor("movement_speed");
        this.range = this.ability.GetSpecialValueFor("range");
        this.bonus_bat = math.min(this.ability.GetTalentSpecialValueFor("bonus_bat"), this.parent.GetBaseAttackTime());
        if (!IsServer()) {
            return;
        }
        this.target = undefined;
        this.OnIntervalThink();
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (!IsServer() || this.ability.IsNull()) {
            return;
        }
        if (this.target && this.target.IsAlive() && !this.target.IsAttackImmune() && !this.target.IsInvulnerable() && this.caster.CanEntityBeSeenByMyTeam(this.target)) {
            if (this.GetStackCount() != 1) {
                this.SetStackCount(1);
            }
            this.caster.MoveToTargetToAttack(this.target);
            if (!this.target.HasModifier("modifier_imba_battle_trance_vision_720") && (this.target.GetAbsOrigin() - this.caster.GetAbsOrigin() as Vector).Length2D() <= this.range) {
                this.target.AddNewModifier(this.caster, this.ability, "modifier_imba_battle_trance_vision_720", {});
            } else if (this.target.HasModifier("modifier_imba_battle_trance_vision_720") && (this.target.GetAbsOrigin() - this.caster.GetAbsOrigin() as Vector).Length2D() > this.range) {
                this.target.RemoveModifierByName("modifier_imba_battle_trance_vision_720");
            }
            return;
        } else if (this.target && this.target.HasModifier("modifier_imba_battle_trance_vision_720")) {
            this.target.RemoveModifierByName("modifier_imba_battle_trance_vision_720");
        }
        this.caster.MoveToTargetToAttack(this.target);
        if (this.caster.GetAttackTarget() && this.caster.GetAttackTarget().IsAlive() && !this.caster.GetAttackTarget().IsAttackImmune() && !this.caster.GetAttackTarget().IsInvulnerable() && this.caster.CanEntityBeSeenByMyTeam(this.caster.GetAttackTarget())) {
            this.target = this.caster.GetAttackTarget();
            this.caster.MoveToTargetToAttack(this.target);
            return;
        }
        let hero_enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST, false);
        if (GameFunc.GetCount(hero_enemies) > 0) {
            for (let enemy = 0; enemy < GameFunc.GetCount(hero_enemies); enemy++) {
                if (this.caster.CanEntityBeSeenByMyTeam(hero_enemies[enemy])) {
                    this.caster.MoveToTargetToAttack(hero_enemies[enemy]);
                    this.target = hero_enemies[enemy];
                    this.SetStackCount(1);
                    return;
                }
            }
        }
        let non_hero_enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST, false);
        if (GameFunc.GetCount(non_hero_enemies) > 0) {
            for (let enemy = 0; enemy < GameFunc.GetCount(non_hero_enemies); enemy++) {
                if (this.caster.CanEntityBeSeenByMyTeam(non_hero_enemies[enemy])
                    && !(non_hero_enemies[enemy] as IBaseNpc_Plus).IsRoshan()) {
                    this.caster.MoveToTargetToAttack(non_hero_enemies[enemy]);
                    this.target = non_hero_enemies[enemy];
                    this.SetStackCount(1);
                    return;
                }
            }
        }
        if (this.target) {
            if (this.target.HasModifier("modifier_imba_battle_trance_vision_720")) {
                this.target.RemoveModifierByName("modifier_imba_battle_trance_vision_720");
            }
            this.target = undefined;
        }
        this.SetStackCount(0);
    }
    BeDestroy(): void {
        if (this.target && this.target.HasModifier("modifier_imba_battle_trance_vision_720")) {
            this.target.RemoveModifierByName("modifier_imba_battle_trance_vision_720");
        }
    }
    GetPriority(): modifierpriority {
        return 10;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetStackCount() == 1) {
            let state: Partial<Record<modifierstate, boolean>> = {}
            state[modifierstate.MODIFIER_STATE_IGNORING_MOVE_AND_ATTACK_ORDERS] = true;
            if (this.caster.HasScepter()) {
                state[modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY] = true;
            }
            return state;
        } else {
            return {};
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MIN_HEALTH,
            5: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP,
            6: GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT
        });
    } */
    GetModifierLifesteal() {
        return this.lifesteal;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movement_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE)
    CC_GetModifierIgnoreCastAngle(): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MIN_HEALTH)
    CC_GetMinHealth(): number {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.lifesteal;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)
    CC_GetModifierBaseAttackTimeConstant(): number {
        return this.bonus_bat;
    }
}
@registerModifier()
export class modifier_imba_battle_trance_vision_720 extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return false;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA;
    }
    GetEffectName(): string {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_troll_warlord_battle_trance_upgrade")) {
            return "particles/items2_fx/true_sight_debuff.vpcf";
        }
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_troll_warlord_battle_trance_upgrade")) {
            return {
                [modifierstate.MODIFIER_STATE_INVISIBLE]: false
            };
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        return 1;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_troll_warlord_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_troll_warlord_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_troll_warlord_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_troll_warlord_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_troll_warlord_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_troll_warlord_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_troll_warlord_battle_trance_upgrade extends BaseModifier_Plus {
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
