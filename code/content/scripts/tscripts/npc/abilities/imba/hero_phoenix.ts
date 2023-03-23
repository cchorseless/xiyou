
import { AI_ability } from "../../../ai/AI_ability";
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseDataDriven, registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

function check_for_canceled(caster: IBaseNpc_Plus) {
    if (caster.IsStunned() || caster.IsHexed() || caster.IsNightmared() || caster.HasModifier("modifier_naga_siren_song_of_the_siren") || caster.HasModifier("modifier_eul_cyclone") || caster.IsFrozen() || caster.IsOutOfGame()) {
        return true;
    } else {
        return false;
    }
}
@registerAbility()
export class imba_phoenix_icarus_dive extends BaseAbility_Plus {
    public progress: any;
    public healthCost: any;
    extPfx: ParticleID;
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
        return false;
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_phoenix_icarus_dive_stop";
    }
    GetAbilityTextureName(): string {
        return "phoenix_icarus_dive";
    }
    GetCastPoint(): number {
        let caster = this.GetCasterPlus();
        if (caster.HasTalent("special_bonus_imba_phoenix_1")) {
            return 0;
        } else {
            return this.GetSpecialValueFor("cast_point");
        }
    }
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_ABILITY_1;
    }
    OnAbilityPhaseStart(): boolean {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1);
        caster.AddNewModifier(caster, this, "modifier_imba_phoenix_icarus_dive_ignore_turn_ray", {});
        return true;
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = this.GetCursorPosition();
        let caster_point = caster.GetAbsOrigin();
        caster.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1);
        let hpCost = this.GetSpecialValueFor("hp_cost_perc");
        let dashLength = this.GetSpecialValueFor("dash_length");
        let dashWidth = this.GetSpecialValueFor("dash_width");
        let dashDuration = this.GetSpecialValueFor("dash_duration");
        let effect_radius = this.GetSpecialValueFor("hit_radius");
        if (caster.HasTalent("special_bonus_imba_phoenix_1")) {
            hpCost = hpCost * 2;
            dashDuration = dashDuration / 2;
        }
        let dummy_modifier = "modifier_imba_phoenix_icarus_dive_dash_dummy";
        caster.AddNewModifier(caster, this, dummy_modifier, {
            duration: dashDuration
        });
        let _direction = (target_point - caster.GetAbsOrigin() as Vector).Normalized();
        caster.SetForwardVector(_direction);
        let casterOrigin = caster.GetAbsOrigin();
        let casterAngles = caster.GetAngles();
        let forwardDir = caster.GetForwardVector();
        let rightDir = caster.GetRightVector();
        let ellipseCenter = casterOrigin + forwardDir * (dashLength / 2);
        let startTime = GameRules.GetGameTime();
        let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_phoenix/phoenix_icarus_dive.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
        this.AddTimer(0, () => {
            ParticleManager.SetParticleControl(pfx, 0, caster.GetAbsOrigin() + caster.GetRightVector() * 32 as Vector);
            let elapsedTime = GameRules.GetGameTime() - startTime;
            let progress = elapsedTime / dashDuration;
            this.progress = progress;
            if (check_for_canceled(caster)) {
                caster.RemoveModifierByName("modifier_imba_phoenix_icarus_dive_dash_dummy");
            }
            if (!caster.HasModifier(dummy_modifier)) {
                ParticleManager.DestroyParticle(pfx, false);
                ParticleManager.ReleaseParticleIndex(pfx);
                return undefined;
            }
            let theta = -2 * math.pi * progress;
            let x = math.sin(theta) * dashWidth * 0.5;
            let y = -math.cos(theta) * dashLength * 0.5;
            let pos = ellipseCenter + rightDir * x + forwardDir * y as Vector;
            let yaw = casterAngles.y + 90 + progress * -360;
            pos = GetGroundPosition(pos, caster);
            caster.SetAbsOrigin(pos);
            caster.SetAngles(casterAngles.x, yaw, casterAngles.z);
            GridNav.DestroyTreesAroundPoint(pos, 80, false);
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, effect_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy != caster) {
                    if (enemy.GetTeamNumber() != caster.GetTeamNumber()) {
                        enemy.AddNewModifier(caster, this, "modifier_imba_phoenix_icarus_dive_slow_debuff", {
                            duration: this.GetSpecialValueFor("burn_duration") * (1 - enemy.GetStatusResistance())
                        });
                    } else {
                        enemy.AddNewModifier(caster, this, "modifier_imba_phoenix_burning_wings_ally_buff", {
                            duration: 0.2
                        });
                    }
                    if (caster.HasTalent("special_bonus_imba_phoenix_2") && caster.GetTeamNumber() != enemy.GetTeamNumber()) {
                        let item = BaseDataDriven.CreateItem("item_imba_dummy", caster);
                        item.ApplyDataDrivenModifier(caster, enemy, "modifier_generic_stunned", {
                            duration: caster.GetTalentValue("special_bonus_imba_phoenix_2", "stun_duration")
                        });
                        UTIL_Remove(item);
                    }
                }
            }
            return 0.03;
        });
        this.healthCost = caster.GetHealth() * hpCost / 100;
        if (caster.HasModifier("modifier_imba_phoenix_burning_wings_buff")) {
            caster.ApplyHeal(this.healthCost, this);
        } else {
            let AfterCastHealth = caster.GetHealth() - this.healthCost;
            if (AfterCastHealth <= 1) {
                caster.SetHealth(1);
            } else {
                caster.SetHealth(AfterCastHealth);
            }
        }
        let sub_ability_name = "imba_phoenix_icarus_dive_stop";
        let main_ability_name = ability.GetAbilityName();
        caster.SwapAbilities(main_ability_name, sub_ability_name, false, true);
    }
    OnUpgrade(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability_name = "imba_phoenix_icarus_dive_stop";
        let ability_handle = caster.FindAbilityByName(ability_name);
        if (ability_handle) {
            ability_handle.SetLevel(1);
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_if_enemy(this, null, null, FindOrder.FIND_FARTHEST)
    }

}
@registerModifier()
export class modifier_imba_phoenix_icarus_dive_dash_dummy extends BaseModifier_Plus {
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
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_phoenix/phoenix_supernova_radiance_streak_light.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE
        }
        return Object.values(decFuns);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE)
    CC_GetModifierIgnoreCastAngle(): 0 | 1 {
        return 1;
    }
    GetTexture(): string {
        return "phoenix_icarus_dive";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        EmitSoundOn("Hero_Phoenix.IcarusDive.Cast", caster);
        let sun_ray = caster.findAbliityPlus<imba_phoenix_sun_ray>("imba_phoenix_sun_ray");
        if (sun_ray) {
            sun_ray.SetActivated(false);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let point = caster.GetAbsOrigin();
        let ability = this.GetAbilityPlus<imba_phoenix_icarus_dive>();
        let hpCost = ability.healthCost;
        let dmg_heal_max = ability.GetSpecialValueFor("stop_dmg_heal_max");
        let radius = ability.GetSpecialValueFor("stop_radius");
        let stop_dmg_heal;
        if (hpCost > dmg_heal_max) {
            stop_dmg_heal = dmg_heal_max;
        } else {
            stop_dmg_heal = hpCost;
        }
        let units = FindUnitsInRadius(caster.GetTeamNumber(), point, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, unit] of GameFunc.iPair(units)) {
            if (unit.GetTeamNumber() == caster.GetTeamNumber() && unit != caster) {
                let heal_amp = 1 + (caster.GetSpellAmplification(false) * 0.01);
                stop_dmg_heal = stop_dmg_heal * heal_amp;
                unit.ApplyHeal(stop_dmg_heal, this.GetAbilityPlus());
            } else if (unit.GetTeamNumber() != caster.GetTeamNumber() && unit != caster) {
                let damageTable = {
                    victim: unit,
                    attacker: caster,
                    damage: stop_dmg_heal,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: this.GetAbilityPlus()
                }
                ApplyDamage(damageTable);
            }
        }
        caster.AddNewModifier(caster, ability, "modifier_imba_phoenix_icarus_dive_extend_burn", {
            duration: ability.GetSpecialValueFor("extend_burn_duration")
        });
        let sun_ray = caster.findAbliityPlus<imba_phoenix_sun_ray>("imba_phoenix_sun_ray");
        if (sun_ray) {
            sun_ray.SetActivated(true);
        }
        let sub_ability_name = "imba_phoenix_icarus_dive";
        let main_ability_name = "imba_phoenix_icarus_dive_stop";
        caster.SwapAbilities(main_ability_name, sub_ability_name, false, true);
        caster.RemoveModifierByName("modifier_imba_phoenix_icarus_dive_ignore_turn_ray");
        StopSoundOn("Hero_Phoenix.IcarusDive.Cast", caster);
        EmitSoundOn("Hero_Phoenix.IcarusDive.Stop", caster);
        caster.RemoveGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1);
        this.AddTimer(0, () => {
            if (!caster.HasModifier("modifier_naga_siren_song_of_the_siren")) {
                FindClearSpaceForUnit(caster, point, false);
                return;
            }
            return 0.1;
        });
    }
}
@registerModifier()
export class modifier_imba_phoenix_icarus_dive_ignore_turn_ray extends BaseModifier_Plus {
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
        return true;
    }
}
@registerModifier()
export class modifier_imba_phoenix_icarus_dive_slow_debuff extends BaseModifier_Plus {
    public slow_movement_speed_pct: number;
    public burn_tick_interval: number;
    public damage_per_second: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        if (this.GetCasterPlus().GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
            return false;
        } else {
            return true;
        }
    }
    IsPurgable(): boolean {
        if (this.GetCasterPlus().GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
            return true;
        } else {
            return false;
        }
    }
    IsPurgeException(): boolean {
        if (this.GetCasterPlus().GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
            return true;
        } else {
            return false;
        }
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
    GetTexture(): string {
        return "phoenix_icarus_dive";
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_phoenix/phoenix_icarus_dive_burn_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow_movement_speed_pct;
    }
    BeCreated(p_0: any,): void {
        this.slow_movement_speed_pct = this.GetSpecialValueFor("slow_movement_speed_pct") * (-1);
        this.burn_tick_interval = this.GetSpecialValueFor("burn_tick_interval");
        this.damage_per_second = this.GetSpecialValueFor("damage_per_second");
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(this.burn_tick_interval);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetParentPlus().IsAlive()) {
            return;
        }
        let damageTable = {
            victim: this.GetParentPlus(),
            attacker: this.GetCasterPlus(),
            damage: this.damage_per_second * (this.burn_tick_interval / 1.0),
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: this.GetAbilityPlus()
        }
        ApplyDamage(damageTable);
    }
}
@registerModifier()
export class modifier_imba_phoenix_icarus_dive_extend_burn extends BaseModifier_Plus {
    public hit_radius: number;
    public burn_duration: number;
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
    GetTexture(): string {
        return "phoenix_icarus_dive";
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_phoenix/phoenix_supernova_radiance_streak_light.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.hit_radius = this.GetSpecialValueFor("hit_radius");
        this.burn_duration = this.GetSpecialValueFor("burn_duration");
        if (!IsServer()) {
            return;
        }
        let ability = this.GetAbilityPlus<imba_phoenix_icarus_dive>();
        let caster = this.GetCasterPlus();
        ability.extPfx = ResHelper.CreateParticleEx("particles/econ/courier/courier_greevil_red/courier_greevil_red_ambient_3.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, caster);
        ParticleManager.SetParticleControlEnt(ability.extPfx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(ability.extPfx, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, this.hit_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            enemy.AddNewModifier(caster, ability, "modifier_imba_phoenix_icarus_dive_slow_debuff", {
                duration: this.burn_duration * (1 - enemy.GetStatusResistance())
            });
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        let ability = this.GetAbilityPlus<imba_phoenix_icarus_dive>();
        ParticleManager.DestroyParticle(ability.extPfx, false);
        ParticleManager.ReleaseParticleIndex(ability.extPfx);
    }
}
@registerAbility()
export class imba_phoenix_icarus_dive_stop extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return true;
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
    GetAssociatedPrimaryAbilities(): string {
        return "imba_phoenix_icarus_dive";
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    GetAbilityTextureName(): string {
        return "phoenix_icarus_dive_stop";
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        caster.RemoveModifierByName("modifier_imba_phoenix_icarus_dive_dash_dummy");
        let ability = caster.findAbliityPlus<imba_phoenix_icarus_dive>("imba_phoenix_icarus_dive");
        if (!ability.progress) {
            return;
        }
        let cdr_pct = ability.progress / 2;
        let cd_now = ability.GetCooldownTimeRemaining();
        let cd_toSet = cd_now * (1 - cdr_pct);
        if (cd_toSet > 0) {
            ability.EndCooldown();
            ability.StartCooldown(cd_toSet);
        }
    }
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_ABILITY_1;
    }
}
@registerAbility()
export class imba_phoenix_fire_spirits extends BaseAbility_Plus {
    public this_ability: any;
    public this_abilityName: any;
    public this_abilityLevel: any;
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
        return false;
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_phoenix_launch_fire_spirit";
    }
    GetAbilityTextureName(): string {
        return "phoenix_fire_spirits";
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2);
        EmitSoundOn("Hero_Phoenix.FireSpirits.Cast", caster);
        caster.TempData().ability_spirits = this;
        let hpCost = this.GetTalentSpecialValueFor("hp_cost_perc");
        let numSpirits = this.GetTalentSpecialValueFor("spirit_count");
        let AfterCastHealth = caster.GetHealth() - (caster.GetHealth() * hpCost / 100);
        if (caster.HasModifier("modifier_imba_phoenix_burning_wings_buff")) {
            caster.ApplyHeal((caster.GetHealth() * hpCost / 100), this);
        } else {
            if (AfterCastHealth <= 1) {
                caster.SetHealth(1);
            } else {
                caster.SetHealth(AfterCastHealth);
            }
        }
        let particleName = "particles/units/heroes/hero_phoenix/phoenix_fire_spirits.vpcf";
        let pfx = ResHelper.CreateParticleEx(particleName, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
        ParticleManager.SetParticleControl(pfx, 1, Vector(numSpirits, 0, 0));
        for (let i = 0; i < numSpirits; i++) {
            ParticleManager.SetParticleControl(pfx, 8 + i, Vector(1, 0, 0));
        }
        caster.TempData().fire_spirits_numSpirits = numSpirits;
        caster.TempData().fire_spirits_pfx = pfx;
        let iDuration = this.GetSpecialValueFor("spirit_duration");
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_phoenix_7")) {
            iDuration = iDuration * this.GetCasterPlus().GetTalentValue("special_bonus_imba_phoenix_7", "duration_pct") / 100;
        }
        caster.AddNewModifier(caster, this, "modifier_imba_phoenix_fire_spirits_count", {
            duration: iDuration
        });
        if (!caster.HasTalent("special_bonus_imba_phoenix_7")) {
            caster.SetModifierStackCount("modifier_imba_phoenix_fire_spirits_count", caster, numSpirits);
        }
        let sub_ability_name = "imba_phoenix_launch_fire_spirit";
        let main_ability_name = this.GetAbilityName();
        caster.SwapAbilities(main_ability_name, sub_ability_name, false, true);
    }
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_ABILITY_2;
    }
    OnUpgrade(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let this_ability = this;
        let this_abilityName = this.GetAbilityName();
        let this_abilityLevel = this.GetLevel();
        let ability_name = "imba_phoenix_launch_fire_spirit";
        let ability_handle = caster.FindAbilityByName(ability_name);
        if (ability_handle) {
            let ability_level = ability_handle.GetLevel();
            if (ability_level != this_abilityLevel) {
                ability_handle.SetLevel(this_abilityLevel);
            }
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_cast(this)
    }
}
@registerModifier()
export class modifier_imba_phoenix_fire_spirits_count extends BaseModifier_Plus {
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
    GetTexture(): string {
        return "phoenix_fire_spirits";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(1.0);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = caster.findAbliityPlus<imba_phoenix_launch_fire_spirit>("imba_phoenix_launch_fire_spirit");
        if (!ability) { return }
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, 192, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            enemy.AddNewModifier(caster, ability, "modifier_imba_phoenix_fire_spirits_debuff", {
                duration: ability.GetSpecialValueFor("duration") * (1 - enemy.GetStatusResistance())
            });
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let pfx = caster.TempData().fire_spirits_pfx;
        if (pfx) {
            ParticleManager.DestroyParticle(pfx, false);
            ParticleManager.ReleaseParticleIndex(pfx);
        }
        let main_ability_name = "imba_phoenix_fire_spirits";
        let sub_ability_name = "imba_phoenix_launch_fire_spirit";
        if (caster) {
            caster.SwapAbilities(main_ability_name, sub_ability_name, true, false);
        }
    }
}
@registerAbility()
export class imba_phoenix_launch_fire_spirit extends BaseAbility_Plus {
    public this_ability: any;
    public this_abilityName: any;
    public this_abilityLevel: any;
    IsHiddenWhenStolen(): boolean {
        return true;
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
    GetAssociatedPrimaryAbilities(): string {
        return "imba_phoenix_fire_spirits";
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    GetAbilityTextureName(): string {
        return "phoenix_launch_fire_spirit";
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    // GetManaCost(p_0: number,): number {
    //     if (!this.GetCasterPlus().HasTalent("special_bonus_imba_phoenix_7")) {
    //         return 0;
    //     } else {
    //         return this.GetCasterPlus().GetTalentValue("special_bonus_imba_phoenix_7", "mana_cost");
    //     }
    // }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let point = this.GetCursorPosition();
        point.z = point.z + 70;
        let modifierName = "modifier_imba_phoenix_fire_spirits_count";
        let iModifier = caster.FindModifierByName(modifierName) as modifier_imba_phoenix_fire_spirits_count;
        caster.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2);
        EmitSoundOn("Hero_Phoenix.FireSpirits.Launch", caster);
        if (!caster.HasTalent("special_bonus_imba_phoenix_7")) {
            let currentStack;
            if (iModifier) {
                iModifier.DecrementStackCount();
                currentStack = iModifier.GetStackCount();
            } else {
                return;
            }
            let pfx = caster.TempData().fire_spirits_pfx;
            ParticleManager.SetParticleControl(pfx, 1, Vector(currentStack, 0, 0));
            for (let i = 1; i <= caster.TempData().fire_spirits_numSpirits; i++) {
                let radius = 0;
                if (i <= currentStack) {
                    radius = 1;
                }
                ParticleManager.SetParticleControl(pfx, 8 + i, Vector(radius, 0, 0));
            }
        }
        let direction = (point - caster.GetAbsOrigin() as Vector).Normalized();
        let DummyUnit = caster.CreateDummyUnit(point, 0.1);
        let cast_target = DummyUnit;
        let info = {
            Target: cast_target,
            Source: caster,
            Ability: this,
            EffectName: "particles/hero/phoenix/phoenix_fire_spirit_launch.vpcf",
            iMoveSpeed: this.GetSpecialValueFor("spirit_speed"),
            vSourceLoc: direction,
            bDrawsOnMinimap: false,
            bDodgeable: false,
            bIsAttack: false,
            bVisibleToEnemies: true,
            bReplaceExisting: false,
            flExpireTime: GameRules.GetGameTime() + 10,
            bProvidesVision: false,
            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION
        }
        ProjectileManager.CreateTrackingProjectile(info);
        if (iModifier.GetStackCount() < 1 && !this.GetCasterPlus().HasTalent("special_bonus_imba_phoenix_7")) {
            iModifier.Destroy();
        }
    }
    OnProjectileThink(vLocation: Vector): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), vLocation, undefined, 20, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (enemy.GetTeamNumber() != caster.GetTeamNumber()) {
                enemy.AddNewModifier(caster, this, "modifier_imba_phoenix_fire_spirits_debuff", {
                    duration: this.GetSpecialValueFor("duration") * (1 - enemy.GetStatusResistance())
                });
            } else {
                enemy.AddNewModifier(caster, this, "modifier_imba_phoenix_burning_wings_ally_buff", {
                    duration: 0.2
                });
            }
        }
    }
    OnProjectileHit(hTarget: CDOTA_BaseNPC | undefined, vLocation: Vector): boolean | void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let location = vLocation;
        if (hTarget) {
            location = hTarget.GetAbsOrigin();
        }
        let DummyUnit = caster.CreateDummyUnit(location, 0.1);
        let pfx_explosion = ResHelper.CreateParticleEx("particles/units/heroes/hero_phoenix/phoenix_fire_spirit_ground.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
        ParticleManager.SetParticleControl(pfx_explosion, 0, location);
        ParticleManager.ReleaseParticleIndex(pfx_explosion);
        EmitSoundOn("Hero_Phoenix.ProjectileImpact", DummyUnit);
        EmitSoundOn("Hero_Phoenix.FireSpirits.Target", DummyUnit);
        AddFOWViewer(caster.GetTeamNumber(), DummyUnit.GetAbsOrigin(), 175, 1, true);
        let units = FindUnitsInRadius(caster.GetTeamNumber(), location, undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, unit] of GameFunc.iPair(units)) {
            if (unit != caster) {
                if (unit.GetTeamNumber() != caster.GetTeamNumber()) {
                    unit.AddNewModifier(caster, this, "modifier_imba_phoenix_fire_spirits_debuff", {
                        duration: this.GetSpecialValueFor("duration") * (1 - unit.GetStatusResistance())
                    });
                } else {
                    unit.AddNewModifier(caster, this, "modifier_imba_phoenix_fire_spirits_buff", {
                        duration: this.GetSpecialValueFor("duration")
                    });
                }
            }
        }
        return true;
    }
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2;
    }
    OnUpgrade(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let this_ability = this;
        let this_abilityName = this.GetAbilityName();
        let this_abilityLevel = this.GetLevel();
        let ability_name = "imba_phoenix_fire_spirits";
        let ability_handle = caster.FindAbilityByName(ability_name);
        let ability_level = ability_handle.GetLevel();
        if (ability_level != this_abilityLevel) {
            ability_handle.SetLevel(this_abilityLevel);
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_phoenix_fire_spirits_debuff extends BaseModifier_Plus {
    public attackspeed_slow: number;
    public tick_interval: number;
    public damage_per_second: number;
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(decFuns);
    } */
    GetTexture(): string {
        return "phoenix_fire_spirits";
    }
    BeCreated(p_0: any,): void {
        this.attackspeed_slow = this.GetSpecialValueFor("attackspeed_slow") * (-1);
        if (!IsServer()) {
            return;
        }
        let ability = this.GetAbilityPlus();
        if (this.GetStackCount() <= 1) {
            this.SetStackCount(1);
        }
        this.tick_interval = this.GetSpecialValueFor("tick_interval");
        this.damage_per_second = this.GetSpecialValueFor("damage_per_second");
        this.StartIntervalThink(this.tick_interval);
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        let ability = this.GetAbilityPlus();
        let caster = this.GetCasterPlus();
        if (this.GetStackCount() <= 1) {
            this.SetStackCount(1);
        }
        if (caster.HasTalent("special_bonus_imba_phoenix_3") && this.GetStackCount() < caster.GetTalentValue("special_bonus_imba_phoenix_3", "max_stacks")) {
            this.IncrementStackCount();
        }
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetParentPlus().IsAlive()) {
            return;
        }
        let damageTable = {
            victim: this.GetParentPlus(),
            attacker: this.GetCasterPlus(),
            damage: (this.damage_per_second * (this.tick_interval / 1.0)) * this.GetStackCount(),
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: this.GetAbilityPlus()
        }
        ApplyDamage(damageTable);
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_phoenix/phoenix_fire_spirit_burn.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (this.GetCasterPlus().GetTeamNumber() == this.GetParentPlus().GetTeamNumber()) {
            return 0;
        } else {
            return this.GetStackCount() * this.attackspeed_slow;
        }
    }
}
@registerModifier()
export class modifier_imba_phoenix_fire_spirits_buff extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    GetTexture(): string {
        return "phoenix_fire_spirits";
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_phoenix/phoenix_fire_spirit_burn.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        let ability = this.GetAbilityPlus();
        if (this.GetStackCount() <= 1) {
            this.SetStackCount(1);
        }
        let tick = ability.GetSpecialValueFor("tick_interval");
        this.StartIntervalThink(tick);
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        let ability = this.GetAbilityPlus();
        let caster = this.GetCasterPlus();
        if (this.GetStackCount() <= 1) {
            this.SetStackCount(1);
        }
        if (caster.HasTalent("special_bonus_imba_phoenix_3") && this.GetStackCount() < caster.GetTalentValue("special_bonus_imba_phoenix_3", "max_stacks")) {
            this.IncrementStackCount();
        }
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetParentPlus().IsAlive()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let tick = ability.GetSpecialValueFor("tick_interval");
        let dmg = ability.GetSpecialValueFor("damage_per_second") * (tick / 1.0);
        let heal_amp = 1 + (caster.GetSpellAmplification(false) * 0.01);
        dmg = dmg * heal_amp;
        this.GetParentPlus().ApplyHeal(dmg * this.GetStackCount(), ability);
    }
}
@registerAbility()
export class imba_phoenix_sun_ray extends BaseAbility_Plus {
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
    GetAssociatedSecondaryAbilities(): string {
        return "imba_phoenix_sun_ray_toggle_move";
    }
    GetAbilityTextureName(): string {
        return "phoenix_sun_ray";
    }
    OnStolen(self: CDOTABaseAbility): void {
        if (!this.GetCasterPlus().HasAbility("imba_phoenix_sun_ray_stop")) {
            this.GetCasterPlus().AddAbility("imba_phoenix_sun_ray_stop").SetHidden(true);
            this.GetCasterPlus().findAbliityPlus<imba_phoenix_sun_ray_stop>("imba_phoenix_sun_ray_stop").SetLevel(1);
        }
    }
    OnUnStolen(): void {
        if (this.GetCasterPlus().HasAbility("imba_phoenix_sun_ray_stop")) {
            if (!this.GetCasterPlus().findAbliityPlus<imba_phoenix_sun_ray_stop>("imba_phoenix_sun_ray_stop").IsHidden()) {
                this.GetCasterPlus().SwapAbilities(this.GetAbilityName(), "imba_phoenix_sun_ray_stop", true, false);
            }
            this.GetCasterPlus().RemoveAbility("imba_phoenix_sun_ray_stop");
            this.GetCasterPlus().RemoveModifierByName("modifier_imba_phoenix_sun_ray_caster_dummy");
        }
    }
    OnSpellStart(): void {
        if (this.GetCasterPlus().HasModifier("modifier_morphling_replicate")) {
            this.GetCasterPlus().AddAbility("imba_phoenix_sun_ray_stop").SetHidden(true);
            this.GetCasterPlus().findAbliityPlus<imba_phoenix_sun_ray_stop>("imba_phoenix_sun_ray_stop").SetLevel(1);
        }
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        let caster = this.GetCasterPlus();
        let ray_stop = caster.findAbliityPlus<imba_phoenix_sun_ray_stop>("imba_phoenix_sun_ray_stop");
        let toggle_move = caster.findAbliityPlus<imba_phoenix_sun_ray_toggle_move>("imba_phoenix_sun_ray_toggle_move");
        if (!ray_stop || !toggle_move) {
            caster.RemoveAbility("imba_phoenix_sun_ray");
            return;
        }
        let pathLength = this.GetSpecialValueFor("beam_range");
        let max_duration = this.GetSpecialValueFor("duration");
        let forwardMoveSpeed = this.GetSpecialValueFor("move_speed");
        let turnRateInitial = this.GetSpecialValueFor("turn_rate_initial");
        let turnRate = this.GetSpecialValueFor("turn_rate");
        let initialTurnDuration = this.GetSpecialValueFor("initial_turn_max_duration");
        let vision_radius = this.GetSpecialValueFor("radius") / 2;
        let numVision = math.ceil(pathLength / vision_radius);
        let modifierCasterName = "modifier_imba_phoenix_sun_ray_caster_dummy";
        let casterOrigin = caster.GetAbsOrigin();
        caster.AddNewModifier(caster, this, modifierCasterName, {
            duration: max_duration
        });
        caster.TempData().sun_ray_is_moving = false;
        caster.TempData().sun_ray_hp_at_start = caster.GetHealth();
        let particleName = "particles/units/heroes/hero_phoenix/phoenix_sunray.vpcf";
        let pfx = ResHelper.CreateParticleEx(particleName, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
        let attach_point = caster.ScriptLookupAttachment("attach_head");
        let endcapSoundName = "Hero_Phoenix.SunRay.Beam";
        StartSoundEvent(endcapSoundName, caster);
        StartSoundEvent("Hero_Phoenix.SunRay.Cast", caster);
        turnRateInitial = turnRateInitial / (1 / 30) * 0.03;
        turnRate = turnRate / (1 / 30) * 0.03;
        let deltaTime = 0.03;
        let lastAngles = caster.GetAngles();
        let isInitialTurn = true;
        let elapsedTime = 0.0;
        this.AddTimer(deltaTime, () => {
            if (this.GetCasterPlus().HasModifier("modifier_mars_arena_of_blood_leash") && this.GetCasterPlus().findBuff("modifier_mars_arena_of_blood_leash").GetAuraOwner() && (this.GetCasterPlus().GetAbsOrigin() - this.GetCasterPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetAuraOwner().GetAbsOrigin() as Vector).Length2D() >= this.GetCasterPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetSpecialValueFor("radius") - this.GetCasterPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetSpecialValueFor("width")) {
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_phoenix_sun_ray_caster_dummy");
            }
            ParticleManager.SetParticleControl(pfx, 0, caster.GetAttachmentOrigin(attach_point));
            if ((check_for_canceled(caster) && ((!this.GetCasterPlus().HasScepter()) || (this.GetCasterPlus().HasScepter() && !this.GetCasterPlus().HasModifier("modifier_imba_phoenix_supernova_caster_dummy")))) || caster.IsSilenced() || caster.HasModifier("modifier_legion_commander_duel") || caster.HasModifier("modifier_lone_druid_savage_roar")) {
                caster.RemoveModifierByName("modifier_imba_phoenix_sun_ray_caster_dummy");
            }
            if (!caster.HasModifier(modifierCasterName)) {
                ParticleManager.DestroyParticle(pfx, false);
                StopSoundEvent(endcapSoundName, caster);
                caster.SetMoveCapability(DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_GROUND);
                return undefined;
            }
            let pos = caster.GetAbsOrigin();
            GridNav.DestroyTreesAroundPoint(pos, 128, false);
            let deltaYawMax;
            if (isInitialTurn) {
                deltaYawMax = turnRateInitial * deltaTime;
            } else {
                deltaYawMax = turnRate * deltaTime;
            }
            let currentAngles = caster.GetAngles();
            let deltaYaw = RotationDelta(lastAngles, currentAngles).y;
            let deltaYawAbs = math.abs(deltaYaw);
            if (deltaYawAbs > deltaYawMax && !caster.HasModifier("modifier_imba_phoenix_icarus_dive_ignore_turn_ray") && !caster.HasTalent("special_bonus_imba_phoenix_8")) {
                let yawSign = (deltaYaw < 0) && -1 || 1;
                let yaw = lastAngles.y + deltaYawMax * yawSign;
                currentAngles.y = yaw;
                caster.SetAngles(currentAngles.x, currentAngles.y, currentAngles.z);
            }
            lastAngles = currentAngles;
            elapsedTime = elapsedTime + deltaTime;
            if (isInitialTurn) {
                if (deltaYawAbs == 0) {
                    isInitialTurn = false;
                }
                if (elapsedTime >= initialTurnDuration) {
                    isInitialTurn = false;
                }
            }
            let casterOrigin = caster.GetAbsOrigin();
            let casterForward = caster.GetForwardVector();
            if (caster.TempData().sun_ray_is_moving && !GameRules.IsGamePaused()) {
                casterOrigin = casterOrigin + casterForward * forwardMoveSpeed * deltaTime as Vector;
                casterOrigin = GetGroundPosition(casterOrigin, caster);
                caster.SetAbsOrigin(casterOrigin);
            }
            let endcapPos = casterOrigin + casterForward * pathLength as Vector;
            endcapPos = GetGroundPosition(endcapPos, undefined);
            endcapPos.z = endcapPos.z + 92;
            ParticleManager.SetParticleControl(pfx, 1, endcapPos);
            let units = FindUnitsInLine(caster.GetTeamNumber(), caster.GetAbsOrigin() + caster.GetForwardVector() * 32 as Vector, endcapPos, undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE);
            for (const [_, unit] of GameFunc.iPair(units)) {
                unit.AddNewModifier(caster, this, "modifier_imba_phoenix_sun_ray_dummy_buff", {
                    duration: this.GetSpecialValueFor("tick_interval")
                });
            }
            for (let i = 0; i < numVision; i++) {
                AddFOWViewer(caster.GetTeamNumber(), (casterOrigin + casterForward * (vision_radius * 2 * (i - 1)) as Vector), vision_radius, deltaTime, false);
            }
            return deltaTime;
        });
    }
    OnUpgrade(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        caster.TempData().sun_ray_is_moving = false;
        let ray_stop = caster.findAbliityPlus<imba_phoenix_sun_ray_stop>("imba_phoenix_sun_ray_stop");
        if (ray_stop) {
            ray_stop.SetLevel(1);
        }
        let toggle_move = caster.findAbliityPlus<imba_phoenix_sun_ray_toggle_move>("imba_phoenix_sun_ray_toggle_move");
        if (toggle_move) {
            toggle_move.SetLevel(1);
            toggle_move.SetActivated(false);
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_phoenix_sun_ray_caster_dummy extends BaseModifier_Plus {
    public pfx_sunray_flare: any;
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
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT,
            2: MODIFIER_PROPERTY_MOVESPEED_MAX,
            3: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE
        }
        return Object.values(funcs);
    } */
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true
        };
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT)
    CC_GetModifierMoveSpeed_Limit(): number {
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_phoenix_8")) {
            return 1;
        } else {
            return undefined;
        }
    }
    GetModifierMoveSpeed_Max() {
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_phoenix_8")) {
            return 1;
        } else {
            return undefined;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE)
    CC_GetModifierIgnoreCastAngle(): 0 | 1 {
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_phoenix_8")) {
            return 1;
        } else {
            return 0;
        }
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_phoenix/phoenix_sunray_mane.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        caster.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_3);
        StartSoundEvent("Hero_Phoenix.SunRay.Loop", caster);
        let particleName = "particles/units/heroes/hero_phoenix/phoenix_sunray_flare.vpcf";
        this.pfx_sunray_flare = ResHelper.CreateParticleEx(particleName, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
        ParticleManager.SetParticleControlEnt(this.pfx_sunray_flare, 9, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mouth", caster.GetAbsOrigin(), true);
        let main_ability_name = "imba_phoenix_sun_ray";
        let sub_ability_name = "imba_phoenix_sun_ray_stop";
        caster.SwapAbilities(main_ability_name, sub_ability_name, false, true);
        caster.TempData().sun_ray_is_moving = false;
        let toggle_move = caster.findAbliityPlus<imba_phoenix_sun_ray_toggle_move>("imba_phoenix_sun_ray_toggle_move");
        if (toggle_move && !this.GetCasterPlus().HasTalent("special_bonus_imba_phoenix_8")) {
            toggle_move.SetActivated(true);
        }
        this.StartIntervalThink(ability.GetSpecialValueFor("tick_interval"));
    }
    OnIntervalThink(): void {
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        caster.AddNewModifier(caster, ability, "modifier_imba_phoenix_sun_ray_dummy_unit_thinker", {
            duration: ability.GetSpecialValueFor("tick_interval") * 1.9
        });
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        if (caster.HasTalent("special_bonus_imba_phoenix_4")) {
            let endcapPos = caster.GetAbsOrigin() + caster.GetForwardVector() * ability.GetSpecialValueFor("beam_range") as Vector;
            let units = FindUnitsInLine(caster.GetTeamNumber(), caster.GetAbsOrigin() + caster.GetForwardVector() * 32 as Vector, endcapPos, undefined, ability.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE);
            for (const [_, unit] of GameFunc.iPair(units)) {
                if (unit != caster) {
                    unit.Purge(false, true, false, true, true);
                }
            }
        }
        caster.RemoveGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_3);
        StartSoundEvent("Hero_Phoenix.SunRay.Stop", caster);
        StopSoundEvent("Hero_Phoenix.SunRay.Loop", caster);
        if (this.pfx_sunray_flare) {
            ParticleManager.DestroyParticle(this.pfx_sunray_flare, false);
            ParticleManager.ReleaseParticleIndex(this.pfx_sunray_flare);
        }
        caster.TempData().sun_ray_is_moving = false;
        let toggle_move = caster.findAbliityPlus<imba_phoenix_sun_ray_toggle_move>("imba_phoenix_sun_ray_toggle_move");
        if (toggle_move) {
            toggle_move.SetActivated(false);
        }
        let main_ability_name = "imba_phoenix_sun_ray_stop";
        let sub_ability_name = "imba_phoenix_sun_ray";
        caster.SwapAbilities(main_ability_name, sub_ability_name, false, true);
        this.AddTimer(0, () => {
            if (!caster.HasModifier("modifier_naga_siren_song_of_the_siren")) {
                FindClearSpaceForUnit(caster, caster.GetAbsOrigin(), false);
                return;
            }
            return 0.1;
        });
    }
}
@registerModifier()
export class modifier_imba_phoenix_sun_ray_dummy_unit_thinker extends BaseModifier_Plus {
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
        return true;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(1);
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
    }
}
@registerModifier()
export class modifier_imba_phoenix_sun_ray_dummy_buff extends BaseModifier_Plus {
    public tick_interval: number;
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
        return true;
    }
    BeCreated(p_0: any,): void {
        this.tick_interval = this.GetSpecialValueFor("tick_interval");
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(this.tick_interval);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let ability = this.GetAbilityPlus();
        let caster = this.GetCasterPlus();
        let target = this.GetParentPlus();
        if (target.GetTeamNumber() != caster.GetTeamNumber()) {
            target.AddNewModifier(caster, ability, "modifier_imba_phoenix_sun_ray_debuff", {
                duration: this.tick_interval * 1.9 * (1 - target.GetStatusResistance())
            });
        } else {
            target.AddNewModifier(caster, ability, "modifier_imba_phoenix_sun_ray_buff", {
                duration: this.tick_interval * 1.9
            });
        }
    }
}
@registerModifier()
export class modifier_imba_phoenix_sun_ray_debuff extends BaseModifier_Plus {
    public tick_interval: number;
    public duration: number;
    public base_damage: number;
    public hp_perc_damage: number;
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
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_phoenix/phoenix_sunray_debuff.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.tick_interval = this.GetSpecialValueFor("tick_interval");
        this.duration = this.GetSpecialValueFor("duration");
        this.base_damage = this.GetSpecialValueFor("base_damage");
        this.hp_perc_damage = this.GetSpecialValueFor("hp_perc_damage");
        this.base_damage = this.GetSpecialValueFor("base_damage");
        if (!IsServer()) {
            return;
        }
        if (this.GetStackCount() < 1) {
            this.SetStackCount(1);
        }
        let ability = this.GetAbilityPlus();
        this.StartIntervalThink(this.tick_interval);
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let ability = this.GetAbilityPlus();
        let caster = this.GetCasterPlus();
        if (!caster.HasModifier("modifier_imba_phoenix_sun_ray_dummy_unit_thinker")) {
            return;
        }
        let num_stack = caster.findBuff<modifier_imba_phoenix_sun_ray_dummy_unit_thinker>("modifier_imba_phoenix_sun_ray_dummy_unit_thinker").GetStackCount();
        let taker = this.GetParentPlus();
        let tick_sum = this.duration / this.tick_interval;
        let base_dmg = this.base_damage;
        base_dmg = base_dmg / tick_sum * num_stack;
        let pct_base_dmg = this.hp_perc_damage / 100;
        pct_base_dmg = pct_base_dmg / tick_sum * num_stack;
        let taker_health = taker.GetMaxHealth();
        let total_damage = base_dmg + taker_health * pct_base_dmg;
        let damageTable = {
            victim: taker,
            attacker: this.GetCasterPlus(),
            damage: total_damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: this.GetAbilityPlus()
        }
        ApplyDamage(damageTable);
        let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_phoenix/phoenix_sunray_debuff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, taker);
        ParticleManager.SetParticleControlEnt(pfx, 1, taker, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", taker.GetAbsOrigin(), true);
        ParticleManager.DestroyParticle(pfx, false);
        ParticleManager.ReleaseParticleIndex(pfx);
        let dive_debuff = taker.FindModifierByNameAndCaster("modifier_imba_phoenix_icarus_dive_slow_debuff", caster);
        let bird_debuff = taker.FindModifierByNameAndCaster("modifier_imba_phoenix_fire_spirits_debuff", caster);
        if (dive_debuff) {
            dive_debuff.SetDuration(dive_debuff.GetDuration(), true);
        }
        if (bird_debuff) {
            bird_debuff.SetDuration(bird_debuff.GetDuration(), true);
        }
    }
}
@registerModifier()
export class modifier_imba_phoenix_sun_ray_buff extends BaseModifier_Plus {
    public tick_interval: number;
    public duration: number;
    public base_heal: any;
    public hp_perc_heal: any;
    public explode_min_time: number;
    public explode_dmg: any;
    public explode_radius: number;
    public hp_cost_perc_per_second: any;
    public this_tick: any;
    public this_time: number;
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
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_phoenix/phoenix_sunray_beam_friend.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.tick_interval = this.GetSpecialValueFor("tick_interval");
        this.duration = this.GetSpecialValueFor("duration");
        this.base_heal = this.GetSpecialValueFor("base_heal");
        this.hp_perc_heal = this.GetSpecialValueFor("hp_perc_heal");
        this.explode_min_time = this.GetSpecialValueFor("explode_min_time");
        this.explode_dmg = this.GetSpecialValueFor("explode_dmg");
        this.explode_radius = this.GetSpecialValueFor("explode_radius");
        this.hp_cost_perc_per_second = this.GetSpecialValueFor("hp_cost_perc_per_second");
        if (!IsServer()) {
            return;
        }
        if (this.GetStackCount() < 1) {
            this.SetStackCount(1);
        }
        let ability = this.GetAbilityPlus();
        this.StartIntervalThink(this.tick_interval);
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        if (!caster.HasModifier("modifier_imba_phoenix_sun_ray_dummy_unit_thinker")) {
            return;
        }
        let num_stack = caster.findBuff<modifier_imba_phoenix_sun_ray_dummy_unit_thinker>("modifier_imba_phoenix_sun_ray_dummy_unit_thinker").GetStackCount();
        let taker = this.GetParentPlus();
        let tick_sum = this.duration / this.tick_interval;
        let base_heal = this.base_heal;
        base_heal = base_heal / tick_sum * num_stack;
        let pct_base_heal = this.hp_perc_heal / 100;
        pct_base_heal = pct_base_heal / tick_sum * num_stack;
        let taker_health = taker.GetMaxHealth();
        let total_heal = base_heal + taker_health * pct_base_heal;
        total_heal = total_heal * (1 + (caster.GetSpellAmplification(false) * 0.01));
        if (taker != this.GetCasterPlus()) {
            taker.ApplyHeal(total_heal, ability);
            let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_phoenix/phoenix_sunray_beam_friend.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, taker);
            ParticleManager.SetParticleControlEnt(pfx, 1, taker, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", taker.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(pfx);
            let explode_stack = this.explode_min_time / this.tick_interval;
            let current_stack = this.GetStackCount();
            if (current_stack > explode_stack && taker.IsRealUnit()) {
                let pfx_explode = ResHelper.CreateParticleEx("particles/hero/phoenix/phoenix_sun_ray_explode.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, taker);
                ParticleManager.SetParticleControlEnt(pfx_explode, 0, taker, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", taker.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(pfx_explode);
                let damage_this_tick = this.explode_dmg / (1 / this.tick_interval);
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), taker.GetAbsOrigin(), undefined, this.explode_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    let damageTable = {
                        victim: enemy,
                        attacker: caster,
                        damage: damage_this_tick,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        ability: this.GetAbilityPlus()
                    }
                    ApplyDamage(damageTable);
                }
            }
        } else {
            let heal_cost_pct = this.hp_cost_perc_per_second / 100;
            let tick_per_sec = 1 / this.tick_interval;
            let heal_cost_per_tick = heal_cost_pct / tick_per_sec;
            let heal_cost_this_time = caster.GetHealth() * heal_cost_per_tick;
            if (caster.HasModifier("modifier_imba_phoenix_burning_wings_buff")) {
                caster.ApplyHeal(heal_cost_this_time, ability);
            } else {
                if ((caster.GetHealth() - heal_cost_this_time) <= 1) {
                    caster.SetHealth(1);
                } else {
                    caster.SetHealth(caster.GetHealth() - heal_cost_this_time);
                }
            }
        }
    }
}
@registerAbility()
export class imba_phoenix_sun_ray_stop extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return true;
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
    ProcsMagicStick(): boolean {
        return false;
    }
    GetAbilityTextureName(): string {
        return "phoenix_sun_ray_stop";
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        caster.RemoveModifierByName("modifier_imba_phoenix_sun_ray_caster_dummy");
    }
}
@registerAbility()
export class imba_phoenix_sun_ray_toggle_move extends BaseAbility_Plus {
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
    ProcsMagicStick(): boolean {
        return false;
    }
    GetAbilityTextureName(): string {
        return "phoenix_sun_ray_toggle_move";
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        if (caster.TempData().sun_ray_is_moving) {
            caster.TempData().sun_ray_is_moving = false;
        } else {
            caster.TempData().sun_ray_is_moving = true;
        }
    }
}
@registerAbility()
export class imba_phoenix_supernova extends BaseAbility_Plus {
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
        return false;
    }
    OnAbilityPhaseStart(): boolean {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_5);
        return true;
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetSpecialValueFor("cast_range");
    }
    GetAbilityTextureName(): string {
        return "phoenix_supernova";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_phoenix_supernova_scepter_passive";
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let location = caster.GetAbsOrigin();
        let ground_location = GetGroundPosition(location, caster);
        let egg_duration = this.GetSpecialValueFor("duration");
        let max_attack = this.GetSpecialValueFor("max_hero_attacks");
        if (!caster.HasScepter()) {
            caster.RemoveModifierByName("modifier_imba_phoenix_sun_ray_caster_dummy");
        }
        caster.AddNewModifier(caster, this, "modifier_imba_phoenix_supernova_caster_dummy", {
            duration: egg_duration
        });
        caster.AddNoDraw();
        let egg = caster.CreateSummon("npc_imba_phoenix_sun", ground_location, egg_duration, false);
        egg.AddNewModifier(caster, this, "modifier_imba_phoenix_supernova_egg_thinker", {
            duration: egg_duration + 0.3
        });
        egg.TempData().max_attack = max_attack;
        egg.TempData().current_attack = 0;
        let egg_playback_rate = 6 / egg_duration;
        egg.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_IDLE, egg_playback_rate);
        caster.TempData().egg = egg;
        caster.TempData().HasDoubleEgg = false;
        caster.TempData<IBaseNpc_Plus>().ally = this.GetCursorTarget();
        if (caster.TempData().ally == caster) {
            caster.TempData().ally = undefined;
        }
        else {
            let ally = caster.TempData<IBaseNpc_Plus>().ally;
            if (!caster.HasTalent("special_bonus_imba_phoenix_6")) {
                ally.AddNewModifier(caster, this, "modifier_imba_phoenix_supernova_caster_dummy", {
                    duration: egg_duration
                });
                ally.AddNoDraw();
                ally.SetAbsOrigin(caster.GetAbsOrigin());
            } else {
                ally.AddNewModifier(ally, this, "modifier_imba_phoenix_supernova_caster_dummy", {
                    duration: egg_duration
                });
                ally.AddNoDraw();
                let _direction = (ally.GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Normalized();
                caster.SetForwardVector(_direction);
                let loaction = caster.GetForwardVector() * 192 + caster.GetAbsOrigin() as Vector;
                let egg2 = ally.CreateSummon("npc_imba_phoenix_sun", loaction, egg_duration, false);
                egg2.AddNewModifier(caster, this, "modifier_imba_phoenix_supernova_egg_double", {});
                egg2.AddNewModifier(ally, this, "modifier_imba_phoenix_supernova_egg_thinker", {
                    duration: egg_duration + 0.3
                });
                max_attack = max_attack * ((100 - caster.GetTalentValue("special_bonus_imba_phoenix_6", "attack_reduce_pct")) / 100);
                egg.TempData().max_attack = max_attack;
                egg.TempData().current_attack = 0;
                egg2.TempData().max_attack = max_attack;
                egg2.TempData().current_attack = 0;
                let info = {
                    Target: egg2,
                    Source: ally,
                    Ability: this,
                    EffectName: "particles/hero/phoenix/phoenix_super_nova_double_egg_projectile.vpcf",
                    iMoveSpeed: 1400,
                    bDrawsOnMinimap: false,
                    bDodgeable: false,
                    bIsAttack: false,
                    bVisibleToEnemies: true,
                    bReplaceExisting: false,
                    flExpireTime: GameRules.GetGameTime() + 10,
                    bProvidesVision: false,
                    iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION
                }
                ProjectileManager.CreateTrackingProjectile(info);
                caster.TempData().HasDoubleEgg = true;
                ally.SetAbsOrigin(egg2.GetAbsOrigin());
                let egg_playback_rate = 6 / egg_duration;
                egg2.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_IDLE, egg_playback_rate);
            }
        }
    }
    GetManaCost(level: number): number {
        return 100;
    }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_friend(this, null, (unit) => {
            return unit.GetHealthLosePect() > 50;
        })
    }
}
@registerModifier()
export class modifier_imba_phoenix_supernova_caster_dummy extends BaseModifier_Plus {
    public abilities: IBaseAbility_Plus[];
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
    IgnoreTenacity() {
        return true;
    }
    GetTexture(): string {
        return "phoenix_supernova";
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_DEATH
        }
        return Object.values(decFuns);
    } */
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state: Partial<Record<modifierstate, boolean>> = {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_MUTED]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true
        }
        if (this.GetCasterPlus() != this.GetParentPlus()) {
            state[modifierstate.MODIFIER_STATE_STUNNED] = true;
        }
        return state;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return -100;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus().IsStolen()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let innate = caster.findAbliityPlus<imba_phoenix_burning_wings>("imba_phoenix_burning_wings");
        if (innate) {
            if (innate.GetToggleState()) {
                innate.ToggleAbility();
            }
        }
        this.abilities = []
        if (this.GetCasterPlus() == this.GetParentPlus()) {
            for (let slot = 0; slot <= 10; slot++) {
                let ability = this.GetParentPlus().GetAbilityByIndex(slot);
                if (ability && ability.IsActivated() && (!this.GetParentPlus().HasScepter() || (this.GetParentPlus().HasScepter() && ability.GetAbilityName() != "imba_phoenix_sun_ray"))) {
                    ability.SetActivated(false);
                    this.abilities.push(ability as IBaseAbility_Plus);
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.GetParentPlus()) {
            if (keys.unit != this.GetCasterPlus()) {
                let caster = this.GetCasterPlus();
                caster.TempData().ally = undefined;
            }
            let eggs = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, 2500, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, egg] of GameFunc.iPair(eggs)) {
                if (egg.GetUnitName() == "npc_imba_phoenix_sun" && egg.GetTeamNumber() == this.GetParentPlus().GetTeamNumber() && egg.GetOwnerPlus() == this.GetParentPlus().GetOwnerPlus()) {
                    egg.Kill(this.GetAbilityPlus(), keys.attacker);
                }
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().GetUnitName().includes("phoenix") || this.GetCasterPlus().GetUnitName().includes("phoenix")) {
            this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_INTRO);
        }
        if (this.GetCasterPlus() == this.GetParentPlus()) {
            for (const ability of (this.abilities)) {
                ability.SetActivated(true);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_phoenix_supernova_bird_thinker extends BaseModifier_Plus {
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
    GetTexture(): string {
        return "phoenix_fire_spirits";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(0.5);
        let numSpirits = this.GetSpecialValueFor("bird_num");
        this.SetStackCount(numSpirits);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let egg = caster.TempData().egg;
        if (!egg) {
            return;
        }
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), egg.GetAbsOrigin(), undefined, ability.GetSpecialValueFor("aura_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        let distance = ability.GetSpecialValueFor("aura_radius") + 1;
        let target;
        let target_num = 0;
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            target_num = target_num + 1;
            if (enemy.GetAttackTarget() == egg) {
                target = enemy;
                return;
            }
            target = enemy;
        }
        if (target_num == 0) {
            return;
        }
        let attach_point = egg.ScriptLookupAttachment("attach_hitloc");
        let info = {
            Target: target,
            Source: caster,
            Ability: caster.findAbliityPlus<imba_phoenix_launch_fire_spirit>("imba_phoenix_launch_fire_spirit"),
            EffectName: "particles/hero/phoenix/phoenix_fire_spirit_launch.vpcf",
            iMoveSpeed: caster.findAbliityPlus<imba_phoenix_launch_fire_spirit>("imba_phoenix_launch_fire_spirit").GetSpecialValueFor("spirit_speed"),
            vSourceLoc: egg.GetAttachmentOrigin(attach_point),
            bDrawsOnMinimap: false,
            bDodgeable: true,
            bIsAttack: false,
            bVisibleToEnemies: true,
            bReplaceExisting: false,
            flExpireTime: GameRules.GetGameTime() + 10,
            bProvidesVision: false,
            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION
        }
        let projectile = ProjectileManager.CreateTrackingProjectile(info);
        EmitSoundOn("Hero_Phoenix.FireSpirits.Launch", caster);
        this.DecrementStackCount();
        if (this.GetStackCount() < 1) {
            this.Destroy();
            return;
        }
    }
    OnProjectileHit(hTarget: CDOTA_BaseNPC | undefined, vLocation: Vector): boolean | void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let location = vLocation;
        if (hTarget) {
            location = hTarget.GetAbsOrigin();
        }
        let DummyUnit = caster.CreateDummyUnit(location, 0.1);
        let pfx_explosion = ResHelper.CreateParticleEx("particles/units/heroes/hero_phoenix/phoenix_fire_spirit_ground.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
        ParticleManager.SetParticleControl(pfx_explosion, 0, location);
        ParticleManager.ReleaseParticleIndex(pfx_explosion);
        EmitSoundOn("Hero_Phoenix.ProjectileImpact", DummyUnit);
        EmitSoundOn("Hero_Phoenix.FireSpirits.Target", DummyUnit);
        AddFOWViewer(caster.GetTeamNumber(), DummyUnit.GetAbsOrigin(), 175, 1, true);
        let units = FindUnitsInRadius(caster.GetTeamNumber(), location, undefined, caster.findAbliityPlus<imba_phoenix_launch_fire_spirit>("imba_phoenix_launch_fire_spirit").GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, unit] of GameFunc.iPair(units)) {
            if (unit != caster) {
                if (unit.GetTeamNumber() != caster.GetTeamNumber()) {
                    unit.AddNewModifier(caster, caster.findAbliityPlus<imba_phoenix_launch_fire_spirit>("imba_phoenix_launch_fire_spirit"), "modifier_imba_phoenix_fire_spirits_debuff", {
                        duration: caster.findAbliityPlus<imba_phoenix_launch_fire_spirit>("imba_phoenix_launch_fire_spirit").GetSpecialValueFor("duration") * (1 - unit.GetStatusResistance())
                    });
                } else {
                    unit.AddNewModifier(caster, caster.findAbliityPlus<imba_phoenix_launch_fire_spirit>("imba_phoenix_launch_fire_spirit"), "modifier_imba_phoenix_fire_spirits_buff", {
                        duration: caster.findAbliityPlus<imba_phoenix_launch_fire_spirit>("imba_phoenix_launch_fire_spirit").GetSpecialValueFor("duration")
                    });
                }
            }
        }
        return true;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
    }
}
@registerModifier()
export class modifier_imba_phoenix_supernova_egg_double extends BaseModifier_Plus {
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
    GetTexture(): string {
        return "phoenix_supernova";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        let egg = this.GetParentPlus();
        let ability = this.GetAbilityPlus();
        let pfx = ResHelper.CreateParticleEx("particles/hero/phoenix/phoenix_super_nova_double_egg.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, egg);
        ParticleManager.SetParticleControlEnt(pfx, 3, egg, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", egg.GetAbsOrigin(), true);
        this.AddTimer(ability.GetSpecialValueFor("duration"), () => {
            ParticleManager.ReleaseParticleIndex(pfx);
        });
    }
}
@registerModifier()
export class modifier_imba_phoenix_supernova_egg_thinker extends BaseModifier_Plus {
    public aura_radius: number;
    public damage_per_sec: number;
    public bIsFirstAttacked: any;
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
    IgnoreTenacity() {
        return true;
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("aura_radius");
    }
    GetModifierAura(): string {
        return "modifier_imba_phoenix_supernova_dmg";
    }
    GetTexture(): string {
        return "phoenix_supernova";
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_ATTACKED,
            3: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return -100;
    }
    BeCreated(p_0: any,): void {
        this.aura_radius = this.GetSpecialValueFor("aura_radius");
        this.damage_per_sec = this.GetSpecialValueFor("damage_per_sec");
        if (!IsServer()) {
            return;
        }
        let egg = this.GetParentPlus();
        let caster = this.GetCasterPlus();
        let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_phoenix/phoenix_supernova_egg.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, egg);
        ParticleManager.SetParticleControlEnt(pfx, 1, egg, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", egg.GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(pfx);
        StartSoundEvent("Hero_Phoenix.SuperNova.Begin", egg);
        StartSoundEvent("Hero_Phoenix.SuperNova.Cast", egg);
        this.ResetUnit(caster);
        caster.SetMana(caster.GetMaxMana());
        this.AddTimer(FrameTime() * 2, () => {
            if (caster.TempData().ally) {
                this.ResetUnit(caster.TempData().ally);
                caster.TempData().ally.SetMana(caster.TempData().ally.GetMaxMana());
            }
        });
        let ability = this.GetAbilityPlus();
        GridNav.DestroyTreesAroundPoint(egg.GetAbsOrigin(), ability.GetSpecialValueFor("cast_range"), false);
        AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), this.aura_radius, 1, false);
        this.StartIntervalThink(1.0);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let egg = this.GetParentPlus();
        if (!egg.IsAlive() || egg.HasModifier("modifier_imba_phoenix_supernova_egg_double")) {
            return;
        }
        AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), this.aura_radius, math.min(1, this.GetRemainingTime()), false);
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), egg.GetAbsOrigin(), undefined, ability.GetSpecialValueFor("aura_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            let damageTable = {
                victim: enemy,
                attacker: caster,
                damage: this.damage_per_sec,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: ability
            }
            ApplyDamage(damageTable);
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let egg = this.GetParentPlus();
        let killer = keys.attacker;
        if (egg != keys.unit) {
            return;
        }
        if (egg.TempData().IsDoubleNova) {
            egg.TempData().IsDoubleNova = undefined;
        }
        if (egg.TempData().NovaCaster) {
            egg.TempData().NovaCaster = undefined;
        }
        caster.RemoveNoDraw();
        if (caster.TempData().ally && !caster.TempData().HasDoubleEgg) {
            caster.TempData().ally.RemoveNoDraw();
        }
        egg.AddNoDraw();
        StopSoundEvent("Hero_Phoenix.SuperNova.Begin", egg);
        StopSoundEvent("Hero_Phoenix.SuperNova.Cast", egg);
        if (egg == killer) {
            StartSoundEvent("Hero_Phoenix.SuperNova.Explode", egg);
            let pfxName = "particles/units/heroes/hero_phoenix/phoenix_supernova_reborn.vpcf";
            let pfx = ResHelper.CreateParticleEx(pfxName, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
            ParticleManager.SetParticleControl(pfx, 0, egg.GetAbsOrigin());
            ParticleManager.SetParticleControl(pfx, 1, Vector(1.5, 1.5, 1.5));
            ParticleManager.SetParticleControl(pfx, 3, egg.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(pfx);
            caster.SetHealth(caster.GetMaxHealth());
            if (caster.TempData().ally && !caster.TempData().HasDoubleEgg && caster.TempData().ally.IsAlive()) {
                caster.TempData().ally.SetHealth(caster.TempData().ally.GetMaxHealth());
            }
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), egg.GetAbsOrigin(), undefined, ability.GetSpecialValueFor("aura_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let item = BaseDataDriven.CreateItem("item_imba_dummy", caster);
                item.ApplyDataDrivenModifier(caster, enemy, "modifier_generic_stunned", {
                    duration: ability.GetSpecialValueFor("stun_duration")
                });
                UTIL_Remove(item);
            }
        } else {
            StartSoundEventFromPosition("Hero_Phoenix.SuperNova.Death", egg.GetAbsOrigin());
            if (!caster.HasTalent("special_bonus_imba_phoenix_5")) {
                if (caster.IsAlive()) {
                    caster.Kill(ability, killer);
                }
                if (caster.TempData().ally && !caster.TempData().HasDoubleEgg && caster.TempData().ally.IsAlive()) {
                    caster.TempData().ally.Kill(ability, killer);
                }
            } else if (caster.IsAlive()) {
                caster.SetHealth(caster.GetMaxHealth() * caster.GetTalentValue("special_bonus_imba_phoenix_5", "reborn_pct") / 100);
                let egg_buff = caster.FindModifierByNameAndCaster("modifier_imba_phoenix_supernova_caster_dummy", caster);
                if (egg_buff) {
                    egg_buff.Destroy();
                }
                if (caster.TempData().ally && caster.TempData().ally.IsAlive()) {
                    caster.TempData().ally.SetHealth(caster.TempData().ally.GetMaxHealth() * caster.GetTalentValue("special_bonus_imba_phoenix_5", "reborn_pct") / 100);
                    let egg_buff2 = caster.TempData().ally.FindModifierByNameAndCaster("modifier_imba_phoenix_supernova_caster_dummy", caster);
                    if (egg_buff2) {
                        egg_buff2.Destroy();
                    }
                }
            }
            let pfxName = "particles/units/heroes/hero_phoenix/phoenix_supernova_death.vpcf";
            let pfx = ResHelper.CreateParticleEx(pfxName, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
            let attach_point = caster.ScriptLookupAttachment("attach_hitloc");
            ParticleManager.SetParticleControl(pfx, 0, caster.GetAttachmentOrigin(attach_point));
            ParticleManager.SetParticleControl(pfx, 1, caster.GetAttachmentOrigin(attach_point));
            ParticleManager.SetParticleControl(pfx, 3, caster.GetAttachmentOrigin(attach_point));
            ParticleManager.ReleaseParticleIndex(pfx);
        }
        caster.TempData().ally = undefined;
        caster.TempData().egg = undefined;
        FindClearSpaceForUnit(caster, egg.GetAbsOrigin(), false);
        if (caster.TempData().ally) {
            FindClearSpaceForUnit(caster.TempData().ally, egg.GetAbsOrigin(), false);
        }
        this.bIsFirstAttacked = undefined;
    }
    ResetUnit(unit: IBaseNpc_Plus) {
        for (let i = 0; i <= 10; i++) {
            let abi = unit.GetAbilityByIndex(i);
            if (abi) {
                if (abi.GetAbilityType() != 1 && !abi.IsItem()) {
                    abi.EndCooldown();
                }
            }
        }
        unit.Purge(true, true, true, true, true);
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACKED)
    CC_OnAttacked(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let egg = this.GetParentPlus();
        let attacker = keys.attacker;
        if (keys.target != egg) {
            return;
        }
        let max_attack = egg.TempData().max_attack;
        let current_attack = egg.TempData().current_attack;
        if (attacker.IsRealUnit() || attacker.IsClone() || attacker.IsTempestDouble()) {
            egg.TempData().current_attack = egg.TempData().current_attack + 1;
        }
        if (egg.TempData().current_attack >= egg.TempData().max_attack) {
            egg.Kill(ability, attacker);
        } else {
            egg.SetHealth((egg.GetMaxHealth() * ((egg.TempData().max_attack - egg.TempData().current_attack) / egg.TempData().max_attack)));
        }
        let pfxName = "particles/units/heroes/hero_phoenix/phoenix_supernova_hit.vpcf";
        let pfx = ResHelper.CreateParticleEx(pfxName, ParticleAttachment_t.PATTACH_POINT_FOLLOW, egg);
        let attach_point = egg.ScriptLookupAttachment("attach_hitloc");
        ParticleManager.SetParticleControlEnt(pfx, 0, egg, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", egg.GetAttachmentOrigin(attach_point), true);
        ParticleManager.SetParticleControlEnt(pfx, 1, egg, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", egg.GetAttachmentOrigin(attach_point), true);
    }
}
@registerModifier()
export class modifier_imba_phoenix_supernova_dmg extends BaseModifier_Plus {
    public extreme_burning_spell_amp: any;
    public pfx: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetHeroEffectName(): string {
        return "particles/units/heroes/hero_phoenix/phoenix_supernova_radiance.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_WORLDORIGIN;
    }
    BeCreated(p_0: any,): void {
        this.extreme_burning_spell_amp = this.GetSpecialValueFor("extreme_burning_spell_amp") * (-1);
        if (!IsServer()) {
            return;
        }
        let target = this.GetParentPlus();
        let caster = this.GetCasterPlus();
        this.pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_phoenix/phoenix_supernova_radiance_streak_light.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, target);
        ParticleManager.SetParticleControlEnt(this.pfx, 8, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        ParticleManager.DestroyParticle(this.pfx, false);
        ParticleManager.ReleaseParticleIndex(this.pfx);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return this.extreme_burning_spell_amp;
    }
}
@registerModifier()
export class modifier_imba_phoenix_supernova_scepter_passive extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        if (this.GetCasterPlus().HasScepter() && !this.GetCasterPlus().HasModifier("modifier_imba_phoenix_supernova_scepter_passive_cooldown")) {
            return false;
        } else {
            return true;
        }
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
        if (this.GetCasterPlus().IsRealUnit()) {
            return false;
        } else {
            return true;
        }
    }

    AllowIllusionDuplicate(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MIN_HEALTH,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MIN_HEALTH)
    CC_GetMinHealth(): number {
        if (this.GetCasterPlus().PassivesDisabled() || this.GetCasterPlus().HasModifier("modifier_imba_phoenix_supernova_caster_dummy") || this.GetCasterPlus().HasModifier("modifier_imba_phoenix_supernova_scepter_passive_cooldown") || !this.GetCasterPlus().IsRealUnit()) {
            return undefined;
        }
        if (!this.GetCasterPlus().HasScepter()) {
            return undefined;
        } else {
            return 1;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit != this.GetCasterPlus()) {
            return;
        }
        if (!this.GetCasterPlus().HasScepter()) {
            return;
        }
        if (this.GetCasterPlus().findBuff<modifier_imba_phoenix_supernova_caster_dummy>("modifier_imba_phoenix_supernova_caster_dummy") || this.GetCasterPlus().HasModifier("modifier_imba_phoenix_supernova_scepter_passive_cooldown")) {
            return;
        }
        if (this.GetCasterPlus().PassivesDisabled() || !this.GetCasterPlus().IsRealUnit()) {
            return;
        }
        if (this.GetCasterPlus().GetHealth() <= 1) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let scepter_cooldown = ability.GetSpecialValueFor("scepter_cooldown");
            let cooldown_modifier = caster.AddNewModifier(caster, ability, "modifier_imba_phoenix_supernova_scepter_passive_cooldown", {
                duration: scepter_cooldown
            });
            let egg_duration = ability.GetSpecialValueFor("duration");
            let extend_duration = ability.GetSpecialValueFor("scepter_additional_duration");
            if (cooldown_modifier != undefined) {
                cooldown_modifier.SetStackCount(scepter_cooldown + egg_duration + extend_duration);
            }
            let location = caster.GetAbsOrigin();
            let max_attack = ability.GetSpecialValueFor("max_hero_attacks");
            caster.AddNewModifier(caster, ability, "modifier_imba_phoenix_supernova_caster_dummy", {
                duration: egg_duration + extend_duration
            });
            caster.AddNoDraw();
            let egg = caster.CreateSummon("npc_imba_phoenix_sun", location, egg_duration + extend_duration, false);
            egg.AddNewModifier(caster, ability, "modifier_imba_phoenix_supernova_egg_thinker", {
                duration: egg_duration + extend_duration + 0.3
            });
            egg.TempData().max_attack = max_attack;
            egg.TempData().current_attack = 0;
            let egg_playback_rate = 6 / (egg_duration + extend_duration);
            egg.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_IDLE, egg_playback_rate);
            caster.TempData().egg = egg;
            caster.SetHealth(caster.GetMaxHealth());
            for (let i = 0; i <= 5; i++) {
                let aghs = caster.GetItemInSlot(i);
                if (aghs != undefined) {
                    if (aghs.GetAbilityName() == 'item_ultimate_scepter') {
                        aghs.StartCooldown(scepter_cooldown + egg_duration + extend_duration);
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_phoenix_supernova_scepter_passive_cooldown extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
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
    AllowIllusionDuplicate(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.StartIntervalThink(1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            this.SetStackCount(this.GetStackCount() - 1);
        }
    }
}
@registerModifier()
export class modifier_imba_phoenix_supernova_force_day extends BaseModifier_Plus {
    public duration: number;
    public current_time_of_day: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.duration = params.duration;
        this.current_time_of_day = params.current_time_of_day;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        GameRules.SetTimeOfDay(this.current_time_of_day + this.duration);
        GameRules.GetGameModeEntity().SetDaynightCycleDisabled(false);
    }
}
@registerAbility()
export class imba_phoenix_burning_wings extends BaseAbility_Plus {
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
    IsInnateAbility() {
        return true;
    }
    GetAbilityTextureName(): string {
        return "phoenix_burningwings";
    }
    OnToggle(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetToggleState()) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_phoenix_burning_wings_buff", {});
        } else {
            this.GetCasterPlus().RemoveModifierByNameAndCaster("modifier_imba_phoenix_burning_wings_buff", this.GetCasterPlus());
            if (this.GetCasterPlus().HasScepter()) {
                this.StartCooldown(this.GetSpecialValueFor("scepter_off_cooldown"));
            } else {
                this.StartCooldown(this.GetSpecialValueFor("off_cooldown"));
            }
        }
    }
}
@registerModifier()
export class modifier_imba_phoenix_burning_wings_buff extends BaseModifier_Plus {
    public pfx: any;
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
    AllowIllusionDuplicate(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    GetEffectName(): string {
        return "particles/hero/phoenix/phoenix_burning_wings.vpcf";
    }
    GetTexture(): string {
        return "phoenix_burningwings";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        let bird = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let hpCost = ability.GetSpecialValueFor("cast_hp_cost") / 100;
        let healthCost = bird.GetMaxHealth() * hpCost;
        let AfterCastHealth = bird.GetHealth() - healthCost;
        if (AfterCastHealth <= 1) {
            bird.SetHealth(1);
        } else {
            bird.SetHealth(AfterCastHealth);
        }
        let particleName = "particles/hero/phoenix/phoenix_burning_wings_2.vpcf";
        this.pfx = {}
        for (let i = 0; i < 5; i++) {
            this.pfx[i] = ResHelper.CreateParticleEx(particleName, ParticleAttachment_t.PATTACH_POINT_FOLLOW, bird);
            ParticleManager.SetParticleControlEnt(this.pfx[i], 0, bird, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", bird.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(this.pfx[i], 1, bird, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", bird.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(this.pfx[i], 4, bird, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_neck", bird.GetAbsOrigin(), true);
        }
        this.StartIntervalThink(ability.GetSpecialValueFor("tick_rate"));
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let hpCost = (ability.GetSpecialValueFor("hp_cost_per_sec") / 100) * ability.GetSpecialValueFor("tick_rate");
        let healthCost = caster.GetMaxHealth() * hpCost;
        let AfterCastHealth = caster.GetHealth() - healthCost;
        if (AfterCastHealth <= 1) {
            caster.SetHealth(1);
        } else {
            caster.SetHealth(AfterCastHealth);
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        if (keys.attacker != caster) {
            return;
        }
        let ability1 = caster.findAbliityPlus<imba_phoenix_icarus_dive>("imba_phoenix_icarus_dive");
        let ability2 = caster.findAbliityPlus<imba_phoenix_icarus_dive_stop>("imba_phoenix_icarus_dive_stop");
        let ability3 = caster.findAbliityPlus<imba_phoenix_fire_spirits>("imba_phoenix_fire_spirits");
        let ability4 = caster.findAbliityPlus<imba_phoenix_launch_fire_spirit>("imba_phoenix_launch_fire_spirit");
        let ability5 = caster.findAbliityPlus<imba_phoenix_sun_ray>("imba_phoenix_sun_ray");
        let abi_table = {
            1: ability1,
            2: ability2,
            3: ability3,
            4: ability4,
            5: ability5
        }
        for (const [_, abi] of GameFunc.Pair(abi_table)) {
            if (keys.inflictor == abi) {
                let damage = keys.damage;
                caster.ApplyHeal(damage, this.GetAbilityPlus());
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        for (let i = 0; i < 5; i++) {
            ParticleManager.DestroyParticle(this.pfx[i], false);
            ParticleManager.ReleaseParticleIndex(this.pfx[i]);
            this.pfx[i] = undefined;
        }
    }
}
@registerModifier()
export class modifier_imba_phoenix_burning_wings_ally_buff extends BaseModifier_Plus {
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
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = caster.findAbliityPlus<imba_phoenix_burning_wings>("imba_phoenix_burning_wings");
        let buff = caster.findBuff<modifier_imba_phoenix_burning_wings_buff>("modifier_imba_phoenix_burning_wings_buff");
        if (!buff || !ability || caster == this.GetParentPlus()) {
            return;
        }
        let num_heal = ability.GetSpecialValueFor("hit_ally_heal") + ability.GetSpecialValueFor("hit_ally_heal") * (caster.GetSpellAmplification(false) / 100);
        caster.ApplyHeal(num_heal, ability);
    }
}
@registerModifier()
export class modifier_special_bonus_imba_phoenix_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_phoenix_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_phoenix_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_phoenix_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_phoenix_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_phoenix_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_phoenix_8 extends BaseModifier_Plus {
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
