
import { GameFunc } from "../../../GameFunc";
import { AoiHelper } from "../../../helper/AoiHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_kunkka_ebb_and_flow extends BaseAbility_Plus {

    GetIntrinsicModifierName(): string {
        return "modifier_imba_ebb_and_flow_thinker";
    }
    IsNetherWardStealable() {
        return false;
    }
    IsInnateAbility() {
        return true;
    }
    IsStealable(): boolean {
        return false;
    }
    RemoveTide() {
        let caster = this.GetCasterPlus();
        if (caster.HasModifier("modifier_imba_ebb_and_flow_tsunami")) {
            caster.RemoveModifierByName("modifier_imba_ebb_and_flow_tsunami");
        }
        if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_low")) {
            caster.RemoveModifierByName("modifier_imba_ebb_and_flow_tide_low");
        }
        if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_red")) {
            caster.RemoveModifierByName("modifier_imba_ebb_and_flow_tide_red");
        }
        if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_flood")) {
            caster.RemoveModifierByName("modifier_imba_ebb_and_flow_tide_flood");
        }
        if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_high")) {
            caster.RemoveModifierByName("modifier_imba_ebb_and_flow_tide_high");
        }
        if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_wave")) {
            caster.RemoveModifierByName("modifier_imba_ebb_and_flow_tide_wave");
        }
    }
    GetCooldown(nLevel: number): number {
        let cooldown = super.GetCooldown(nLevel);
        return cooldown;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let modifier = caster.findBuff<modifier_imba_ebb_and_flow_thinker>("modifier_imba_ebb_and_flow_thinker");
            this.RemoveTide();
            modifier.tsunami_check = 0;
        }
    }
    GetAbilityTextureName(): string {
        let caster = this.GetCasterPlus();
        if (caster.HasModifier("modifier_imba_ebb_and_flow_tsunami")) {
            return "kunnka_tide_tsunami";
        }
        if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_low")) {
            return "kunnka_tide_low";
        }
        if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_red")) {
            return "kunnka_tide_red";
        }
        if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_flood")) {
            return "kunnka_tide_flood";
        }
        if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_high")) {
            return "kunnka_tide_high";
        }
        if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_wave")) {
            return "kunnka_tide_wave";
        }
        return "kunkka_ebb_and_flow";
    }
}
@registerModifier()
export class modifier_imba_ebb_and_flow_thinker extends BaseModifier_Plus {
    public tide_counter: number;
    public tsunami_check: any;
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.tide_counter = 1;
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            this.tsunami_check = this.tsunami_check || 0;
            if (this.tsunami_check == 0) {
                let tsunami_chance = ability.GetTalentSpecialValueFor("tsunami_chance");
                if (tsunami_chance >= RandomInt(1, 100)) {
                    this.tsunami_check = 1;
                } else {
                    this.tsunami_check = 2;
                    this.NextTide();
                }
            }
            let current_tide_modifier;
            if (this.tsunami_check == 1) {
                current_tide_modifier = "modifier_imba_ebb_and_flow_tsunami";
            } else {
                current_tide_modifier = this.GetCurrentTide(this.tide_counter);
            }
            if (ability.IsCooldownReady() && !caster.HasModifier(current_tide_modifier)) {
                caster.AddNewModifier(caster, ability, current_tide_modifier, {});
            }
        }
    }
    GetCurrentTide(index: number | string): string {
        let tide_list: { [key: string]: string };
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_kunkka_1")) {
            tide_list = {
                1: "modifier_imba_ebb_and_flow_tide_low",
                2: "modifier_imba_ebb_and_flow_tide_red",
                3: "modifier_imba_ebb_and_flow_tide_flood",
                4: "modifier_imba_ebb_and_flow_tide_high",
                5: "modifier_imba_ebb_and_flow_tide_wave",
                6: "modifier_imba_ebb_and_flow_tsunami"
            }
        } else {
            tide_list = {
                1: "modifier_imba_ebb_and_flow_tide_low",
                2: "modifier_imba_ebb_and_flow_tide_red",
                3: "modifier_imba_ebb_and_flow_tide_flood",
                4: "modifier_imba_ebb_and_flow_tide_high",
                5: "modifier_imba_ebb_and_flow_tide_wave"
            }
        }
        tide_list['tide_count'] = Object.keys(tide_list).length + "";
        return tide_list[index + ""];
    }
    NextTide() {
        if ((this.tide_counter >= GToNumber(this.GetCurrentTide('tide_count')))) {
            this.tide_counter = 1;
        } else {
            this.tide_counter = this.tide_counter + 1;
        }
    }
}
@registerModifier()
export class modifier_imba_ebb_and_flow_tide_low extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetTexture(): string {
        return "kunnka_tide_low";
    }
}
@registerModifier()
export class modifier_imba_ebb_and_flow_tide_red extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetTexture(): string {
        return "kunnka_tide_red";
    }
}
@registerModifier()
export class modifier_imba_ebb_and_flow_tide_flood extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetTexture(): string {
        return "kunnka_tide_flood";
    }
}
@registerModifier()
export class modifier_imba_ebb_and_flow_tide_high extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetTexture(): string {
        return "kunnka_tide_high";
    }
}
@registerModifier()
export class modifier_imba_ebb_and_flow_tide_wave extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetTexture(): string {
        return "kunnka_tide_wave";
    }
}
@registerModifier()
export class modifier_imba_ebb_and_flow_tsunami extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetTexture(): string {
        return "kunnka_tide_tsunami";
    }
}
@registerAbility()
export class imba_kunkka_torrent extends BaseAbility_Plus {
    torrent_count: number;
    GetAbilityTextureName(): string {
        return "kunkka_torrent";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_torrent_handler";
    }
    OnUpgrade(): void {
        // todo
        if (this.GetCasterPlus().HasAbility("kunkka_torrent")) {
            this.GetCasterPlus().findAbliityPlus("kunkka_torrent").SetLevel(this.GetLevel());
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorPosition();
            let vision_duration = 4;
            let first_delay = this.GetSpecialValueFor("launch_delay");
            let radius = this.GetTalentSpecialValueFor("radius");
            let slow_duration = this.GetSpecialValueFor("slow_duration");
            let stun_duration = this.GetSpecialValueFor("stun_duration");
            let damage = this.GetSpecialValueFor("damage");
            let sec_torrent_count = this.GetSpecialValueFor("sec_torrent_count");
            let sec_torrent_stun = this.GetSpecialValueFor("sec_torrent_stun");
            let sec_torrent_damage = this.GetTalentSpecialValueFor("sec_torrent_damage");
            let sec_torrent_slow_duration = this.GetSpecialValueFor("sec_torrent_slow_duration");
            let tick_count = this.GetSpecialValueFor("tick_count");
            let torrent_height = this.GetSpecialValueFor("torrent_height");
            let tsunami = caster.HasModifier("modifier_imba_ebb_and_flow_tsunami");
            if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_flood") || tsunami) {
                damage = damage + this.GetSpecialValueFor("tide_flood_damage");
            }
            if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_high") || tsunami) {
                radius = radius + this.GetSpecialValueFor("tide_high_radius");
            }
            if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_wave") || tsunami) {
                first_delay = first_delay / 2;
            }
            let extra_slow = false;
            if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_red") || tsunami) {
                extra_slow = true;
            }
            if (caster.HasAbility("imba_kunkka_ebb_and_flow")) {
                let ability_tide = caster.findAbliityPlus<imba_kunkka_ebb_and_flow>("imba_kunkka_ebb_and_flow");
                ability_tide.CastAbility();
            }
            let tick_interval = stun_duration / tick_count;
            let damage_tick = damage / tick_count;
            vision_duration = vision_duration + (sec_torrent_count * 2);
            slow_duration = slow_duration + stun_duration;
            sec_torrent_slow_duration = sec_torrent_slow_duration + sec_torrent_stun;
            this.CreateVisibilityNode(target, radius, vision_duration);
            let bubbles_pfx = ParticleManager.CreateParticleForTeam("particles/hero/kunkka/torrent_bubbles.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster, caster.GetTeam());
            ParticleManager.SetParticleControl(bubbles_pfx, 0, target);
            ParticleManager.SetParticleControl(bubbles_pfx, 1, Vector(radius, 0, 0));
            let bubbles_sec_pfc: ParticleID;
            EmitSoundOnLocationForAllies(target, "Ability.pre.Torrent", caster);
            if (caster.HasTalent("special_bonus_imba_kunkka_4")) {
                let thinker = CreateModifierThinker(caster, this, "modifier_imba_kunkka_torrent_talent_thinker", {
                    duration: (first_delay + sec_torrent_count),
                    pos_x: target.x,
                    pos_y: target.y,
                    pos_z: target.z,
                    affected_radius: radius,
                    sec_torrent_radius: this.GetSpecialValueFor("sec_torrent_radius"),
                    sec_torrent_stun: sec_torrent_stun,
                    sec_torrent_count: sec_torrent_count,
                    sec_torrent_damage: sec_torrent_damage,
                    sec_torrent_slow_duration: sec_torrent_slow_duration,
                    tick_count: tick_count,
                    torrent_height: torrent_height,
                    tsunami: tsunami
                }, target, caster.GetTeamNumber(), false);
            }
            let target_team = this.GetAbilityTargetTeam();
            let target_type = this.GetAbilityTargetType();
            let target_flags = this.GetAbilityTargetFlags();
            let damage_type = this.GetAbilityDamageType();
            let sec_torrent_radius = this.GetSpecialValueFor("sec_torrent_radius");
            this.torrent_count = 0;
            for (let torrent_count = 0; torrent_count < sec_torrent_count; torrent_count += 1) {
                let delay = first_delay + (torrent_count * 2);
                this.AddTimer(delay, () => {
                    this.torrent_count = torrent_count;
                    if (torrent_count > 0) {
                        damage_tick = sec_torrent_damage / tick_count;
                        stun_duration = sec_torrent_stun;
                        torrent_height = torrent_height / 1.5;
                        radius = sec_torrent_radius;
                    }
                    if (torrent_count == 0) {
                        ParticleManager.DestroyParticle(bubbles_pfx, false);
                        ParticleManager.ReleaseParticleIndex(bubbles_pfx);
                        bubbles_sec_pfc = ParticleManager.CreateParticleForTeam("particles/hero/kunkka/torrent_bubbles.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster, caster.GetTeam());
                        ParticleManager.SetParticleControl(bubbles_sec_pfc, 0, target);
                        ParticleManager.SetParticleControl(bubbles_sec_pfc, 1, Vector(radius, 0, 0));
                    }
                    if (torrent_count == sec_torrent_count) {
                        ParticleManager.DestroyParticle(bubbles_sec_pfc, false);
                        ParticleManager.ReleaseParticleIndex(bubbles_sec_pfc);
                    }
                    let enemies = FindUnitsInRadius(caster.GetTeam(), target, undefined, radius, target_team, target_type, target_flags, 0, false);
                    if ((GameFunc.GetCount(enemies) > 0) && (caster.GetName() == "npc_dota_hero_kunkka")) {
                        if (math.random(1, 10) < 3) {
                            caster.EmitSound("kunkka_kunk_ability_torrent_0" + math.random(1, 4));
                        }
                    }
                    for (const [_, enemy] of ipairs(enemies)) {
                        ApplyDamage({
                            victim: enemy,
                            attacker: caster,
                            ability: this,
                            damage: damage_tick,
                            damage_type: damage_type
                        });
                        let current_ticks = 0;
                        let randomness_x = 0;
                        let randomness_y = 0;
                        let torrent_border = (enemy.GetAbsOrigin() - target as Vector).Normalized() * (radius + 100);
                        let distance_from_center = (enemy.GetAbsOrigin() - target as Vector).Length2D();
                        if (!(tsunami && torrent_count == 0)) {
                            distance_from_center = 0;
                        } else {
                            randomness_x = math.random() * math.random(-30, 30);
                            randomness_y = math.random() * math.random(-30, 30);
                        }
                        let knockback = {
                            should_stun: 1,
                            knockback_duration: stun_duration,
                            duration: stun_duration,
                            knockback_distance: distance_from_center,
                            knockback_height: torrent_height,
                            center_x: (target + torrent_border as Vector).x + randomness_x,
                            center_y: (target + torrent_border as Vector).y + randomness_y,
                            center_z: (target + torrent_border as Vector).z
                        }
                        enemy.RemoveModifierByName("modifier_knockback");
                        enemy.AddNewModifier(caster, this, "modifier_knockback", knockback).SetDuration(stun_duration, true);
                        enemy.AddNewModifier(caster, this, "modifier_imba_torrent_phase", {
                            duration: stun_duration
                        });
                        this.AddTimer(0, () => {
                            if (current_ticks < tick_count) {
                                ApplyDamage({
                                    victim: enemy,
                                    attacker: caster,
                                    ability: this,
                                    damage: damage_tick,
                                    damage_type: damage_type
                                });
                                current_ticks = current_ticks + 1;
                                return tick_interval;
                            }
                        });
                        if (torrent_count == 0) {
                            enemy.AddNewModifier(caster, this, "modifier_imba_torrent_slow", {
                                duration: slow_duration * (1 - enemy.GetStatusResistance())
                            });
                            if (extra_slow) {
                                enemy.AddNewModifier(caster, this, "modifier_imba_torrent_slow_tide", {
                                    duration: slow_duration * (1 - enemy.GetStatusResistance())
                                });
                            }
                        } else {
                            enemy.AddNewModifier(caster, this, "modifier_imba_sec_torrent_slow", {
                                duration: sec_torrent_slow_duration * (1 - enemy.GetStatusResistance())
                            });
                        }
                    }
                    EmitSoundOnLocationWithCaster(target, "Ability.Torrent", caster);
                    let particle = "particles/hero/kunkka/torrent_splash.vpcf";
                    let torrent_fx = ResHelper.CreateParticleEx(particle, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
                    ParticleManager.SetParticleControl(torrent_fx, 0, target);
                    ParticleManager.SetParticleControl(torrent_fx, 1, Vector(radius, 0, 0));
                    ParticleManager.ReleaseParticleIndex(torrent_fx);
                    if (torrent_count == 0 && tsunami) {
                        let torrent_tsunami_fx = ResHelper.CreateParticleEx("particles/econ/items/kunkka/kunkka_weapon_whaleblade/kunkka_spell_torrent_whaleblade_tail.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
                        ParticleManager.SetParticleControl(torrent_tsunami_fx, 0, target);
                        ParticleManager.ReleaseParticleIndex(torrent_tsunami_fx);
                        let count_mini = math.floor(radius / 35);
                        for (let i = 0; i <= count_mini; i += 1) {
                            this.AddTimer(math.random(80) * 0.01, () => {
                                let radius_mini = math.random(50) + 15;
                                let angle = (360 / count_mini) * i;
                                let border = radius - radius_mini;
                                let mini_target = target + Vector(math.cos(angle) * border, math.sin(angle) * border, 0) as Vector;
                                let torrent_fx_mini = ResHelper.CreateParticleEx(particle, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
                                ParticleManager.SetParticleControl(torrent_fx_mini, 0, mini_target);
                                ParticleManager.SetParticleControl(torrent_fx_mini, 1, Vector(radius_mini, 0, 0));
                                ParticleManager.ReleaseParticleIndex(torrent_fx_mini);
                            });
                        }
                    }
                });
            }
        }
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetAOERadius(): number {
        let caster = this.GetCasterPlus();
        let radius = this.GetTalentSpecialValueFor("radius");
        if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_high") || caster.HasModifier("modifier_imba_ebb_and_flow_tsunami")) {
            radius = radius + this.GetSpecialValueFor("tide_high_radius");
        }
        return radius;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        let caster = this.GetCasterPlus();
        let range = super.GetCastRange(location, target);
        if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_low") || caster.HasModifier("modifier_imba_ebb_and_flow_tsunami")) {
            range = range + this.GetSpecialValueFor("tide_low_range");
        }
        return range;
    }
}
@registerModifier()
export class modifier_imba_torrent_handler extends BaseModifier_Plus {
    public bActive: any;
    IsHidden(): boolean {
        return true;
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus().GetAutoCastState() && this.GetAbilityPlus().IsFullyCastable() && !this.GetAbilityPlus().IsInAbilityPhase() && !this.GetCasterPlus().IsHexed() && !this.GetCasterPlus().IsNightmared() && !this.GetCasterPlus().IsOutOfGame() && !this.GetCasterPlus().IsSilenced() && !this.GetCasterPlus().IsStunned() && !this.GetCasterPlus().IsChanneling()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCasterPlus().GetAbsOrigin());
            this.GetAbilityPlus().CastAbility();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ORDER,
            2: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (!IsServer() || keys.unit != this.GetParentPlus()) {
            return;
        }
        if (keys.ability == this.GetAbilityPlus()) {
            if (keys.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION && (keys.new_pos - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D() <= this.GetAbilityPlus().GetCastRange(this.GetCasterPlus().GetCursorPosition(), this.GetCasterPlus()) + this.GetCasterPlus().GetCastRangeBonus()) {
                this.bActive = true;
            } else {
                this.bActive = false;
            }
        } else {
            this.bActive = false;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE)
    CC_GetModifierIgnoreCastAngle(): 0 | 1 {
        if (!IsServer() || this.bActive == false) {
            return;
        }
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING)
    CC_GetModifierDisableTurning(): 0 | 1 {
        if (!IsServer() || this.bActive == false) {
            return;
        }
        return 1;
    }
}
@registerModifier()
export class modifier_imba_torrent_phase extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        }
        return state;
    }
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_torrent_slow_tide extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_torrent_slow extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        let ability = this.GetAbilityPlus();
        let slow = ability.GetSpecialValueFor("main_slow");
        if (this.GetParentPlus().HasModifier("modifier_imba_torrent_slow_tide")) {
            slow = slow + ability.GetSpecialValueFor("tide_red_slow");
        }
        return slow * (-1);
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_sec_torrent_slow extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return (this.GetSpecialValueFor("sec_torrent_slow") * (-1));
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_torrent_cast extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE)
    CC_GetModifierIgnoreCastAngle( /** params */): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING)
    CC_GetModifierDisableTurning( /** params */): 0 | 1 {
        return 1;
    }
    IsHidden(): boolean {
        return false;
    }
    BeDestroy( /** params */): void {
        if (IsServer()) {
            let stopOrder = {
                UnitIndex: this.GetCasterPlus().entindex(),
                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_STOP
            }
            ExecuteOrderFromTable(stopOrder);
        }
    }
}
@registerModifier()
export class modifier_imba_kunkka_torrent_talent_thinker extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: imba_kunkka_torrent;
    public min_interval: number;
    public max_interval: number;
    public tick: any;
    public pos: any;
    public affected_radius: number;
    public sec_torrent_radius: number;
    public sec_torrent_stun: any;
    public sec_torrent_count: number;
    public sec_torrent_damage: number;
    public sec_torrent_slow_duration: number;
    public tick_count: number;
    public torrent_height: any;
    public tsunami: boolean;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.min_interval = this.caster.GetTalentValue("special_bonus_imba_kunkka_4", "min_interval") * 10;
            this.max_interval = this.caster.GetTalentValue("special_bonus_imba_kunkka_4") * 10;
            this.tick = (math.random() + math.random(this.min_interval, this.max_interval)) / 10;
            this.pos = Vector(keys.pos_x, keys.pos_y, keys.pos_z);
            this.affected_radius = keys.affected_radius;
            this.sec_torrent_radius = keys.sec_torrent_radius;
            this.sec_torrent_stun = keys.sec_torrent_stun;
            this.sec_torrent_count = keys.sec_torrent_count;
            this.sec_torrent_damage = keys.sec_torrent_damage;
            this.sec_torrent_slow_duration = keys.sec_torrent_slow_duration;
            this.tick_count = keys.tick_count;
            this.tsunami = keys.tsunami;
            this.torrent_height = keys.torrent_height;
            this.StartIntervalThink(this.tick);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let interval = (math.random() + math.random(this.min_interval, ((this.GetRemainingTime() + this.tick) * 10))) / 10;
            this.tick = (math.random() + math.random(this.min_interval, this.max_interval)) / 10;
            this.AddTimer(interval, () => {
                let random_radius = math.random(0, this.affected_radius);
                let random_vector = this.pos + RandomVector(random_radius);
                let damage_tick = this.sec_torrent_damage / this.tick_count;
                let stun_duration = this.sec_torrent_stun;
                let torrent_height = this.torrent_height / 1.5;
                let radius = this.sec_torrent_radius;
                let tick_interval = stun_duration / this.tick_count;
                let enemies = FindUnitsInRadius(this.caster.GetTeam(), random_vector, undefined, radius, this.ability.GetAbilityTargetTeam(), this.ability.GetAbilityTargetType(), this.ability.GetAbilityTargetFlags(), 0, false);
                if ((GameFunc.GetCount(enemies) > 0) && (this.caster.GetName() == "npc_dota_hero_kunkka")) {
                    if (math.random(1, 10) < 3) {
                        this.caster.EmitSound("kunkka_kunk_ability_torrent_0" + math.random(1, 4));
                    }
                }
                for (const [_, enemy] of ipairs(enemies)) {
                    ApplyDamage({
                        victim: enemy,
                        attacker: this.caster,
                        ability: this.ability,
                        damage: damage_tick,
                        damage_type: this.ability.GetAbilityDamageType()
                    });
                    let current_ticks = 0;
                    let randomness_x = 0;
                    let randomness_y = 0;
                    let torrent_border = (enemy.GetAbsOrigin() - random_vector as Vector).Normalized() * (radius + 100);
                    let distance_from_center = (enemy.GetAbsOrigin() - random_vector as Vector).Length2D();
                    if (!(this.tsunami && this.ability.torrent_count == 0)) {
                        distance_from_center = 0;
                    } else {
                        randomness_x = math.random() * math.random(-30, 30);
                        randomness_y = math.random() * math.random(-30, 30);
                    }
                    let knockback = {
                        should_stun: 1,
                        knockback_duration: stun_duration,
                        duration: stun_duration,
                        knockback_distance: distance_from_center,
                        knockback_height: torrent_height,
                        center_x: (random_vector + torrent_border).x + randomness_x,
                        center_y: (random_vector + torrent_border).y + randomness_y,
                        center_z: (random_vector + torrent_border).z
                    }
                    enemy.RemoveModifierByName("modifier_knockback");
                    enemy.AddNewModifier(this.caster, this.ability, "modifier_knockback", knockback);
                    enemy.AddNewModifier(this.caster, this.ability, "modifier_imba_torrent_phase", {
                        duration: stun_duration
                    });
                    this.AddTimer(0, () => {
                        if (this.tick_count != undefined && current_ticks < this.tick_count) {
                            ApplyDamage({
                                victim: enemy,
                                attacker: this.caster,
                                ability: this.ability,
                                damage: damage_tick,
                                damage_type: this.ability.GetAbilityDamageType()
                            });
                            current_ticks = current_ticks + 1;
                            return tick_interval;
                        }
                    });
                    enemy.AddNewModifier(this.caster, this.ability, "modifier_imba_sec_torrent_slow", {
                        duration: this.sec_torrent_slow_duration * (1 - enemy.GetStatusResistance())
                    });
                }
                EmitSoundOnLocationWithCaster(random_vector, "Ability.Torrent", this.caster);
                let particle = "particles/hero/kunkka/torrent_splash.vpcf";
                let torrent_fx = ResHelper.CreateParticleEx(particle, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.caster);
                ParticleManager.SetParticleControl(torrent_fx, 0, random_vector);
                ParticleManager.SetParticleControl(torrent_fx, 1, Vector(radius, 0, 0));
                ParticleManager.ReleaseParticleIndex(torrent_fx);
            });
        }
    }
}
@registerAbility()
export class imba_kunkka_tidebringer extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "kunkka_tidebringer";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_tidebringer";
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetCasterPlus().Script_GetAttackRange();
    }
    IsStealable(): boolean {
        return false;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            caster.MoveToTargetToAttack(this.GetCursorTarget());
            caster.AddNewModifier(caster, this, "modifier_imba_tidebringer_manual", {});
            this.EndCooldown();
        }
    }
    OnUpgrade(): void {
        if (IsServer()) {
            this.GetCasterPlus().RemoveModifierByName("modifier_imba_tidebringer");
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_tidebringer", {});
            let caster_tidebringer = this.GetCasterPlus().findAbliityPlus<imba_kunkka_tidebringer>("imba_kunkka_tidebringer");
            if (caster_tidebringer && caster_tidebringer.GetLevel() == 1) {
                caster_tidebringer.ToggleAutoCast();
            }
        }
    }
    GetCooldown(nLevel: number): number {
        let cooldown = super.GetCooldown(nLevel);
        let caster = this.GetCasterPlus();
        if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_wave") || caster.HasModifier("modifier_imba_ebb_and_flow_tsunami") || (caster.HasTalent("special_bonus_imba_kunkka_2") && caster.HasModifier("modifier_imba_ghostship_rum"))) {
            cooldown = 0;
        }
        return cooldown;
    }
}
@registerModifier()
export class modifier_imba_tidebringer_sword_particle extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeDestroy(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let cooldown = ability.GetCooldown(ability.GetLevel() - 1);
            caster.EmitSound("Hero_Kunkka.Tidebringer.Attack");
            ParticleManager.DestroyParticle(caster.TempData().tidebringer_weapon_pfx, true);
            ParticleManager.ReleaseParticleIndex(caster.TempData().tidebringer_weapon_pfx);
            caster.TempData().tidebringer_weapon_pfx = 0;
        }
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            caster.TempData().tidebringer_weapon_pfx = caster.TempData().tidebringer_weapon_pfx || 0;
            if (caster.TempData().tidebringer_weapon_pfx == 0) {
                EmitSoundOn("Hero_Kunkaa.Tidebringer", caster);
                caster.TempData().tidebringer_weapon_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_kunkka/kunkka_weapon_tidebringer.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
                ParticleManager.SetParticleControlEnt(caster.TempData().tidebringer_weapon_pfx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_tidebringer", caster.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(caster.TempData().tidebringer_weapon_pfx, 2, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_sword", caster.GetAbsOrigin(), true);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_tidebringer_manual extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_tidebringer extends BaseModifier_Plus {
    public sound_triggered: any;
    public tide_index: any;
    public pass_attack: any;
    public bonus_damage: number;
    public torrent_radius: number;
    public position_center: any;
    public hitCounter: any;
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_START,
            4: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
        });
    } */
    BeCreated(p_0: any,): void {
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        if (IsServer()) {
            if ((!caster.HasModifier("modifier_imba_tidebringer_sword_particle")) && ability.IsCooldownReady()) {
                caster.AddNewModifier(caster, ability, "modifier_imba_tidebringer_sword_particle", {});
            }
        }
    }
    BeRefresh(p_0: any,): void {
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        if (IsServer()) {
            if ((!caster.HasModifier("modifier_imba_tidebringer_sword_particle")) && ability.IsCooldownReady()) {
                caster.AddNewModifier(caster, ability, "modifier_imba_tidebringer_sword_particle", {});
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(params: ModifierAttackEvent): void {
        if (this.GetAbilityPlus()) {
            let parent = this.GetParentPlus();
            let target = params.target;
            if ((parent == params.attacker) && (target.GetTeamNumber() != parent.GetTeamNumber()) && (target.IsCreep || target.IsHero)) {
                if (!target.IsBuilding()) {
                    let ability = this.GetAbilityPlus();
                    this.sound_triggered = false;
                    this.tide_index = 0;
                    if (parent.HasModifier("modifier_imba_ebb_and_flow_tsunami")) {
                        this.tide_index = 1;
                    }
                    if (parent.HasModifier("modifier_imba_ebb_and_flow_tide_low")) {
                        this.tide_index = 2;
                    }
                    if (parent.HasModifier("modifier_imba_ebb_and_flow_tide_red")) {
                        this.tide_index = 3;
                    }
                    if (parent.HasModifier("modifier_imba_ebb_and_flow_tide_flood")) {
                        this.tide_index = 4;
                    }
                    if (parent.HasModifier("modifier_imba_ebb_and_flow_tide_high")) {
                        this.tide_index = 5;
                    }
                    if (parent.HasModifier("modifier_imba_ebb_and_flow_tide_wave")) {
                        this.tide_index = 6;
                    }
                    if (ability.IsCooldownReady() && !(parent.PassivesDisabled())) {
                        if (ability.GetAutoCastState() || parent.HasModifier("modifier_imba_tidebringer_manual")) {
                            this.pass_attack = true;
                            this.bonus_damage = ability.GetSpecialValueFor("bonus_damage");
                            if ((this.tide_index == 4) || (this.tide_index == 1)) {
                                this.bonus_damage = this.bonus_damage + ability.GetSpecialValueFor("tide_flood_damage");
                            }
                        } else {
                            this.pass_attack = false;
                            this.bonus_damage = 0;
                        }
                    }
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        let ability = this.GetAbilityPlus();
        if (this.GetAbilityPlus()) {
            let parent = this.GetParentPlus();
            let tidebringer_bonus_damage = this.bonus_damage;
            if (params.attacker == parent && (!parent.IsIllusion()) && this.pass_attack) {
                this.pass_attack = false;
                this.bonus_damage = 0;
                if (parent.PassivesDisabled()) {
                    return;
                }
                let range = this.GetSpecialValueFor("range");
                let radius_start = this.GetSpecialValueFor("radius_start");
                let radius_end = this.GetSpecialValueFor("radius_end");
                parent.RemoveModifierByName("modifier_imba_tidebringer_sword_particle");
                if ((this.tide_index == 2) || (this.tide_index == 1)) {
                    range = range + ability.GetSpecialValueFor("tide_low_range");
                }
                if ((this.tide_index == 5) || (this.tide_index == 1)) {
                    radius_start = radius_start + ability.GetSpecialValueFor("tide_high_radius");
                    radius_end = radius_end + ability.GetSpecialValueFor("tide_high_radius");
                }
                if (this.tide_index == 1) {
                    this.torrent_radius = radius_end * (math.sqrt(math.pow((radius_end - radius_start), 2) + math.pow(range, 2)) + radius_start - radius_end) / range;
                    this.position_center = parent.GetAbsOrigin() + parent.GetForwardVector() * this.torrent_radius;
                    let torrent_fx_mini = ResHelper.CreateParticleEx("particles/hero/kunkka/torrent_splash.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, parent);
                    ParticleManager.SetParticleControl(torrent_fx_mini, 0, this.position_center);
                    ParticleManager.SetParticleControl(torrent_fx_mini, 1, Vector(this.torrent_radius, 0, 0));
                }
                let target = params.target;
                if (target != undefined && target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
                    this.TidebringerEffects(target, ability);
                    let cleaveDamage = params.damage * (ability.GetTalentSpecialValueFor("cleave_damage") / 100);
                    let enemies_to_cleave = AoiHelper.FindUnitsInCone(this.GetParentPlus().GetTeamNumber(), GFuncVector.CalculateDirection(params.target, this.GetParentPlus()), this.GetParentPlus().GetAbsOrigin(), radius_start, radius_end, range, undefined, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, FindOrder.FIND_ANY_ORDER, false);
                    if (parent.HasTalent("special_bonus_imba_kunkka_7")) {
                        let enemies = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0, false);
                        let hit_enemy = false;
                        for (const [_, enemy] of ipairs(enemies)) {
                            if (enemy.HasModifier("modifier_imba_torrent_slow") || enemy.HasModifier("modifier_imba_torrent_slow_tide") || enemy.HasModifier("modifier_imba_sec_torrent_slow") || enemy.HasModifier("modifier_imba_torrent_phase")) {
                                hit_enemy = true;
                                for (const [_, enemy_hit] of ipairs(enemies_to_cleave)) {
                                    if (enemy == enemy_hit) {
                                        hit_enemy = false;
                                    }
                                }
                                if (hit_enemy) {
                                    let tidebringer_hit_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_kunkka/kunkka_spell_tidebringer.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.GetParentPlus());
                                    ParticleManager.SetParticleControlEnt(tidebringer_hit_fx, 0, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                                    ParticleManager.SetParticleControlEnt(tidebringer_hit_fx, 1, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                                    ParticleManager.SetParticleControlEnt(tidebringer_hit_fx, 2, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                                    ApplyDamage({
                                        attacker: this.GetParentPlus(),
                                        victim: enemy,
                                        ability: ability,
                                        damage: cleaveDamage,
                                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
                                    });
                                }
                            }
                        }
                    }
                    if (parent.HasTalent("special_bonus_imba_kunkka_7")) {
                        if (params.target.HasModifier("modifier_imba_torrent_slow") || params.target.HasModifier("modifier_imba_torrent_slow_tide") || params.target.HasModifier("modifier_imba_sec_torrent_slow") || params.target.HasModifier("modifier_imba_torrent_phase")) {
                            for (const [_, enemy_to_hit] of ipairs(enemies_to_cleave)) {
                                let tidebringer_hit_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_kunkka/kunkka_spell_tidebringer.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.GetParentPlus());
                                ParticleManager.SetParticleControlEnt(tidebringer_hit_fx, 0, enemy_to_hit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy_to_hit.GetAbsOrigin(), true);
                                ParticleManager.SetParticleControlEnt(tidebringer_hit_fx, 1, enemy_to_hit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy_to_hit.GetAbsOrigin(), true);
                                ParticleManager.SetParticleControlEnt(tidebringer_hit_fx, 2, enemy_to_hit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy_to_hit.GetAbsOrigin(), true);
                                let target_cleaved = enemy_to_hit.AddNewModifier(this.GetParentPlus(), ability, "modifier_imba_tidebringer_cleave_hit_target", {
                                    duration: 0.01
                                }) as modifier_imba_tidebringer_cleave_hit_target;
                                if (target_cleaved) {
                                    target_cleaved.cleave_damage = cleaveDamage;
                                }
                            }
                        } else {
                            DoCleaveAttack(params.attacker, params.target, ability, cleaveDamage, radius_start, radius_end, range, "particles/units/heroes/hero_kunkka/kunkka_spell_tidebringer.vpcf");
                        }
                    } else {
                        DoCleaveAttack(params.attacker, params.target, ability, cleaveDamage, radius_start, radius_end, range, "particles/units/heroes/hero_kunkka/kunkka_spell_tidebringer.vpcf");
                    }
                    if (!((this.tide_index == 6) || (this.tide_index == 1))) {
                        let cooldown = ability.GetCooldown(ability.GetLevel() - 1);
                        ability.UseResources(false, false, true);
                        this.AddTimer(cooldown, () => {
                            if (!parent.HasModifier("modifier_imba_tidebringer_sword_particle")) {
                                parent.AddNewModifier(parent, ability, "modifier_imba_tidebringer_sword_particle", {});
                            }
                        });
                    }
                    if (parent.HasModifier("modifier_imba_tidebringer_manual")) {
                        parent.RemoveModifierByName("modifier_imba_tidebringer_manual");
                    }
                    if (parent.HasAbility("imba_kunkka_ebb_and_flow")) {
                        let ability_tide = parent.findAbliityPlus<imba_kunkka_ebb_and_flow>("imba_kunkka_ebb_and_flow");
                        if (this.tide_index >= 1) {
                            ability_tide.CastAbility();
                        }
                        let cooldown = ability_tide.GetCooldownTimeRemaining() - (this.hitCounter * ability.GetSpecialValueFor("cdr_per_hit"));
                        ability_tide.EndCooldown();
                        ability_tide.StartCooldown(cooldown);
                        this.hitCounter = undefined;
                    }
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage( /** params */): number {
        this.bonus_damage = this.bonus_damage || 0;
        return this.bonus_damage;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        if (IsServer()) {
            if (params.attacker == this.GetParentPlus() && (bit.band(params.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_IGNORES_PHYSICAL_ARMOR) == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_IGNORES_PHYSICAL_ARMOR) && params.inflictor.GetAbilityName() == "imba_kunkka_tidebringer") {
                this.TidebringerEffects(params.unit, params.inflictor as IBaseAbility_Plus);
            }
        }
    }
    TidebringerEffects(target: IBaseNpc_Plus, ability: IBaseAbility_Plus) {
        let sound_height = 1000;
        this.hitCounter = this.hitCounter || 0;
        this.hitCounter = this.hitCounter + 1;
        let attacker = this.GetCasterPlus();
        if ((this.tide_index == 1 || this.tide_index == 3) && !target.IsMagicImmune()) {
            target.AddNewModifier(attacker, ability, "modifier_imba_tidebringer_slow", {
                duration: ability.GetSpecialValueFor("tide_red_slow_duration") * (1 - target.GetStatusResistance())
            });
        }
        if (this.tide_index == 1) {
            let location = target.GetAbsOrigin();
            let distance_from_center = (location - this.position_center as Vector).Length2D();
            let knocking_up = ((this.torrent_radius / distance_from_center) * 50) * (attacker.GetAverageTrueAttackDamage(attacker) / 300) + 40;
            let knockback = {
                should_stun: 1,
                knockback_duration: ability.GetSpecialValueFor("tsunami_stun"),
                duration: ability.GetSpecialValueFor("tsunami_stun"),
                knockback_distance: 0,
                knockback_height: knocking_up,
                center_x: location.x,
                center_y: location.y,
                center_z: location.z
            }
            target.EmitSound("Hero_Kunkka.TidebringerDamage");
            if ((knocking_up > sound_height) && !this.sound_triggered) {
                EmitSoundOn("Kunkka.ShootingStar", target);
                this.sound_triggered = true;
            }
            target.RemoveModifierByName("modifier_knockback");
            target.AddNewModifier(this.GetParentPlus(), ability, "modifier_knockback", knockback);
        }
    }
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_tidebringer_slow extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return (this.GetSpecialValueFor("tide_red_slow") * (-1));
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_tidebringer_cleave_hit_target extends BaseModifier_Plus {
    cleave_damage: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    StatusEffectPriority(): modifierpriority {
        return 20;
    }
    BeDestroy(): void {
        if (IsServer()) {
            ApplyDamage({
                attacker: this.GetCasterPlus(),
                victim: this.GetParentPlus(),
                ability: this.GetAbilityPlus(),
                damage: this.cleave_damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
            });
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return -100;
    }
}
@registerAbility()
export class imba_kunkka_x_marks_the_spot extends BaseAbility_Plus {
    public positions: Vector[];
    GetAbilityTextureName(): string {
        return "kunkka_x_marks_the_spot";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let duration = this.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance());
            let sec_duration = this.GetSpecialValueFor("sec_duration") * (1 - target.GetStatusResistance());
            let talent_hits = false;
            if (caster.HasTalent("special_bonus_imba_kunkka_5")) {
                let radius = caster.GetTalentValue("special_bonus_imba_kunkka_5");
                let enemies = FindUnitsInRadius(caster.GetTeam(), target.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, 0, 0, false);
                for (const [_, enemy] of ipairs(enemies)) {
                    if (enemy != target) {
                        talent_hits = true;
                        enemy.AddNewModifier(caster, this, "modifier_imba_x_marks_the_spot", {
                            duration: duration,
                            sec_duration: sec_duration
                        });
                        this.CreateVisibilityNode(enemy.GetAbsOrigin(), 300, 8);
                    }
                }
            }
            if (caster.GetTeam() == target.GetTeam()) {
                duration = this.GetSpecialValueFor("allied_duration");
                sec_duration = 0;
            }
            this.CreateVisibilityNode(target.GetAbsOrigin(), 300, 8);
            if (target.TriggerSpellAbsorb(this)) {
                if (talent_hits) {
                    caster.AddNewModifier(caster, this, "modifier_imba_x_marks_the_spot_return", {
                        duration: duration
                    });
                }
                return undefined;
            }
            caster.AddNewModifier(caster, this, "modifier_imba_x_marks_the_spot_return", {
                duration: duration
            });
            target.AddNewModifier(caster, this, "modifier_imba_x_marks_the_spot", {
                duration: duration,
                sec_duration: sec_duration
            });
        }
    }
    GetAOERadius(): number {
        let caster = this.GetCasterPlus();
        if (caster.HasTalent("special_bonus_imba_kunkka_5")) {
            return caster.GetTalentValue("special_bonus_imba_kunkka_5");
        }
        return 0;
    }
    OnUpgrade(): void {
        let ability_handle = this.GetCasterPlus().findAbliityPlus<imba_kunkka_return>("imba_kunkka_return");
        this.positions = this.positions || []
        if (ability_handle) {
            if (ability_handle.GetLevel() < 1) {
                ability_handle.SetLevel(1);
                ability_handle.SetActivated(false);
            }
        }
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_kunkka_return";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_x_marks_the_spot extends BaseModifier_Plus {
    public position: any;
    public sec_duration: number;
    public position_id: any;
    public x_pfx: any;
    BeCreated(params: any): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus<imba_kunkka_x_marks_the_spot>();
            this.position = parent.GetAbsOrigin();
            this.sec_duration = params.sec_duration;
            this.position_id = params.position_id || 0;
            if (this.position_id == 0) {
                table.insert(ability.positions, this.position);
                this.position_id = GameFunc.GetCount(ability.positions);
            }
            EmitSoundOn("Ability.XMarksTheSpot.Target", caster);
            EmitSoundOn("Ability.XMark.Target_Movement", parent);
            this.x_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_kunkka/kunkka_spell_x_spot.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
            ParticleManager.SetParticleControlEnt(this.x_pfx, 0, parent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(this.x_pfx, 1, parent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
        }
    }
    BeDestroy( /** params */): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus<imba_kunkka_x_marks_the_spot>();
            let position = this.position;
            let duration = this.sec_duration || 0;
            parent.StopSound("Ability.XMark.Target_Movement");
            this.sec_duration = 0;
            EmitSoundOn("Ability.XMarksTheSpot.Return", parent);
            ParticleManager.DestroyParticle(this.x_pfx, false);
            ParticleManager.ReleaseParticleIndex(this.x_pfx);
            if ((math.random(1, 5) < 2) && (caster.GetName() == "npc_dota_hero_kunkka")) {
                caster.EmitSound("kunkka_kunk_ability_xmark_0" + math.random(1, 5));
            }
            if (!(parent.IsMagicImmune() || parent.IsInvulnerable())) {
                let stopOrder = {
                    UnitIndex: parent.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_STOP
                }
                ExecuteOrderFromTable(stopOrder);
                FindClearSpaceForUnit(parent, this.position, true);
                if (duration > 0) {
                    parent.AddNewModifier(caster, ability, "modifier_imba_x_marks_the_spot", {
                        duration: duration,
                        sec_duration: 0,
                        position_id: this.position_id
                    });
                } else {
                    ability.positions[this.position_id] = undefined;
                }
                if (caster.HasTalent("special_bonus_imba_kunkka_3")) {
                    if (caster.GetTeamNumber() != parent.GetTeamNumber()) {
                        parent.AddNewModifier(caster, ability, "modifier_imba_x_marks_the_spot_talent_ms", {
                            duration: ability.GetTalentSpecialValueFor("duration") * (1 - parent.GetStatusResistance())
                        });
                    } else {
                        parent.AddNewModifier(caster, ability, "modifier_imba_x_marks_the_spot_talent_ms", {
                            duration: ability.GetTalentSpecialValueFor("allied_duration")
                        });
                    }
                }
            }
        }
    }
    IsDebuff(): boolean {
        let caster = this.GetCasterPlus();
        let parent = this.GetParentPlus();
        if (caster.GetTeamNumber() != parent.GetTeamNumber()) {
            return true;
        }
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    GetTexture(): string {
        return "kunkka_x_marks_the_spot";
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
}
@registerModifier()
export class modifier_imba_x_marks_the_spot_return extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    GetTexture(): string {
        return "kunkka_x_marks_the_spot";
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            let ability_handle = this.GetCasterPlus().findAbliityPlus<imba_kunkka_return>("imba_kunkka_return");
            if (ability_handle) {
                ability_handle.SetActivated(true);
                this.GetCasterPlus().SwapAbilities("imba_kunkka_x_marks_the_spot", "imba_kunkka_return", false, true);
            }
        }
    }
    BeDestroy( /** params */): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            if (!caster.HasModifier("modifier_imba_x_marks_the_spot_return") && caster.HasAbility("imba_kunkka_return")) {
                caster.findAbliityPlus<imba_kunkka_return>("imba_kunkka_return").SetActivated(false);
                caster.SwapAbilities("imba_kunkka_x_marks_the_spot", "imba_kunkka_return", true, false);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_x_marks_the_spot_talent_ms extends BaseModifier_Plus {
    IsDebuff(): boolean {
        let caster = this.GetCasterPlus();
        let parent = this.GetParentPlus();
        if (caster.GetTeamNumber() != parent.GetTeamNumber()) {
            return true;
        }
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    GetTexture(): string {
        return "kunkka_x_marks_the_spot";
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        let caster = this.GetCasterPlus();
        let parent = this.GetParentPlus();
        if (caster.GetTeamNumber() != parent.GetTeamNumber()) {
            return caster.GetTalentValue("special_bonus_imba_kunkka_3") * (-1);
        }
        return caster.GetTalentValue("special_bonus_imba_kunkka_3");
    }
}
@registerAbility()
export class imba_kunkka_return extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "kunkka_return";
    }
    IsNetherWardStealable() {
        return false;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let targets = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_DEAD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, 0, false);
            for (const [_, target] of ipairs(targets)) {
                if (target.HasModifier("modifier_imba_x_marks_the_spot")) {
                    let modifiers = target.FindAllModifiersByName("modifier_imba_x_marks_the_spot") as modifier_imba_x_marks_the_spot[];
                    for (const [_, modifier] of ipairs(modifiers)) {
                        if (((modifier.GetCasterPlus() == this.GetCasterPlus()) && ((modifier.sec_duration > 0) || (modifier.IsDebuff() == false)))) {
                            modifier.Destroy();
                        }
                    }
                }
            }
            for (const [_, modifier] of ipairs(caster.FindAllModifiersByName("modifier_imba_x_marks_the_spot_return"))) {
                modifier.Destroy();
            }
        }
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsStealable(): boolean {
        return false;
    }
    GetAssociatedPrimaryAbilities(): string {
        return "imba_kunkka_x_marks_the_spot";
    }
}
@registerAbility()
export class imba_kunkka_ghostship extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "kunkka_ghostship";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
                this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
            }
            let caster = this.GetCasterPlus();
            let target = this.GetCursorPosition();
            let scepter = caster.HasScepter();
            let damage = this.GetSpecialValueFor("damage");
            let speed = this.GetSpecialValueFor("ghostship_speed");
            let radius = this.GetSpecialValueFor("ghostship_width");
            let start_distance = this.GetSpecialValueFor("start_distance");
            let crash_distance = this.GetSpecialValueFor("crash_distance");
            let stun_duration = this.GetSpecialValueFor("stun_duration");
            let buff_duration = this.GetSpecialValueFor("buff_duration");
            let crash_delay = 0;
            let caster_pos = caster.GetAbsOrigin();
            let tsunami = caster.HasModifier("modifier_imba_ebb_and_flow_tsunami");
            if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_flood") || tsunami) {
                damage = damage + this.GetSpecialValueFor("tide_flood_damage");
            }
            if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_high") || tsunami) {
                if (scepter) {
                    radius = radius + this.GetSpecialValueFor("scepter_tide_high_radius");
                }
                radius = radius + this.GetSpecialValueFor("tide_high_radius");
            }
            if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_wave") || tsunami) {
                speed = speed + this.GetSpecialValueFor("tide_wave_speed");
            }
            let extra_slow = false;
            if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_red") || tsunami) {
                extra_slow = true;
            }
            if (tsunami) {
                stun_duration = stun_duration + this.GetSpecialValueFor("tsunami_stun");
            }
            let closest_target = true;
            let spawn_pos: Vector;
            let boat_direction: Vector;
            let crash_pos: Vector;
            let travel_time: number;
            if (caster.GetName() == "npc_dota_hero_kunkka") {
                caster.EmitSound("kunkka_kunk_ability_ghostshp_0" + math.random(1, 3));
            }
            if (scepter) {
                let scepter_damage = damage * (this.GetSpecialValueFor("buff_duration") / 100);
                if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_wave") || tsunami) {
                    crash_delay = this.GetSpecialValueFor("scepter_tide_wave_delay");
                } else {
                    crash_delay = this.GetSpecialValueFor("scepter_crash_delay");
                }
                spawn_pos = target;
                boat_direction = (target - caster_pos as Vector).Normalized();
                crash_pos = target + boat_direction * (start_distance + crash_distance) * (-1) as Vector;
            }
            if (caster.HasAbility("imba_kunkka_ebb_and_flow") && !(caster.HasModifier("modifier_imba_ebb_and_flow_tide_low") && !scepter)) {
                let ability_tide = caster.findAbliityPlus<imba_kunkka_ebb_and_flow>("imba_kunkka_ebb_and_flow");
                ability_tide.CastAbility();
            }
            if (!scepter) {
                boat_direction = (target - caster_pos as Vector).Normalized();
                crash_pos = target;
                spawn_pos = target + boat_direction * (start_distance + crash_distance) * (-1) as Vector;
            }
            travel_time = ((start_distance + crash_distance - radius) / speed);
            let bubbles_pfx: ParticleID;
            if (scepter) {
                let height = 1000;
                let ticks = FrameTime();
                let travel = 0;
                let float_boat = spawn_pos + Vector(0, 0, height);
                let height_ticks = height * ticks / crash_delay * (-1);
                this.CreateVisibilityNode(target, radius, crash_delay + 1);
                bubbles_pfx = ResHelper.CreateParticleEx("particles/hero/kunkka/torrent_bubbles.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
                ParticleManager.SetParticleControl(bubbles_pfx, 0, target);
                ParticleManager.SetParticleControl(bubbles_pfx, 1, Vector(radius, 0, 0));
                this.AddTimer((crash_delay + 1), () => {
                    ParticleManager.DestroyParticle(bubbles_pfx, false);
                    ParticleManager.ReleaseParticleIndex(bubbles_pfx);
                });
                let boat_pfx = ResHelper.CreateParticleEx("particles/hero/kunkka/kunkka_ghost_ship.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
                ParticleManager.SetParticleControl(boat_pfx, 0, (spawn_pos - boat_direction * (-1) * crash_distance) as Vector);
                this.AddTimer(ticks, () => {
                    float_boat = float_boat + Vector(0, 0, height_ticks);
                    ParticleManager.SetParticleControl(boat_pfx, 3, float_boat as Vector);
                    travel = travel + ticks;
                    if (travel > crash_delay) {
                        let water_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_kunkka/kunkka_boat_splash_end.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
                        ParticleManager.SetParticleControl(water_fx, 3, target);
                        this.AddTimer(2, () => {
                            ParticleManager.DestroyParticle(water_fx, false);
                            ParticleManager.ReleaseParticleIndex(water_fx);
                        });
                        let enemies = FindUnitsInRadius(caster.GetTeam(), target, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, this.GetAbilityTargetType(), 0, 0, false);
                        for (const [k, enemy] of ipairs(enemies)) {
                            ApplyDamage({
                                victim: enemy,
                                attacker: caster,
                                ability: this,
                                damage: damage,
                                damage_type: this.GetAbilityDamageType()
                            });
                        }
                        ParticleManager.SetParticleControl(boat_pfx, 3, (float_boat - Vector(0, 0, 500)) as Vector);
                        ParticleManager.DestroyParticle(boat_pfx, false);
                        ParticleManager.ReleaseParticleIndex(boat_pfx);
                        return undefined;
                    }
                    return ticks;
                });
            }
            this.AddTimer(crash_delay, () => {
                this.CreateVisibilityNode(crash_pos, radius, travel_time + 2);
                let boat_velocity: Vector;
                if (caster.HasScepter()) {
                    boat_velocity = boat_direction * speed * (-1) as Vector;
                } else {
                    boat_velocity = boat_direction * speed as Vector;
                }
                let boat_projectile: CreateLinearProjectileOptions = {
                    Ability: this,
                    EffectName: "particles/units/heroes/hero_kunkka/kunkka_ghost_ship.vpcf",
                    vSpawnOrigin: spawn_pos,
                    fDistance: start_distance + crash_distance - radius,
                    fStartRadius: radius,
                    fEndRadius: radius,
                    fExpireTime: GameRules.GetGameTime() + travel_time + 2,
                    Source: caster,
                    bHasFrontalCone: false,
                    // bReplaceExisting: false,
                    bProvidesVision: false,
                    iUnitTargetTeam: this.GetAbilityTargetTeam(),
                    iUnitTargetType: this.GetAbilityTargetType(),
                    vVelocity: boat_velocity,
                    ExtraData: {
                        crash_x: crash_pos.x,
                        crash_y: crash_pos.y,
                        crash_z: crash_pos.z,
                        speed: speed,
                        radius: radius
                    }
                }
                ProjectileManager.CreateLinearProjectile(boat_projectile);
                EmitSoundOnLocationWithCaster(spawn_pos, "Ability.Ghostship.bell", caster);
                EmitSoundOnLocationWithCaster(spawn_pos, "Ability.Ghostship", caster);
                let crash_pfx = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_kunkka/kunkka_ghostship_marker.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster, caster.GetTeam());
                ParticleManager.SetParticleControl(crash_pfx, 0, crash_pos);
                this.AddTimer(travel_time, () => {
                    ParticleManager.DestroyParticle(crash_pfx, false);
                    ParticleManager.ReleaseParticleIndex(crash_pfx);
                    EmitSoundOnLocationWithCaster(crash_pos, "Ability.Ghostship.crash", caster);
                    let enemies = FindUnitsInRadius(caster.GetTeam(), crash_pos, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, this.GetAbilityTargetType(), 0, 0, false);
                    if ((!(GameFunc.GetCount(enemies) > 0)) && (caster.GetName() == "npc_dota_hero_kunkka")) {
                        if (math.random(1, 2) == 1) {
                            caster.EmitSound("kunkka_kunk_ability_failure_0" + math.random(1, 2));
                        }
                    }
                    for (const [k, enemy] of ipairs(enemies)) {
                        ApplyDamage({
                            victim: enemy,
                            attacker: caster,
                            ability: this,
                            damage: damage,
                            damage_type: this.GetAbilityDamageType()
                        });
                        if (extra_slow) {
                            enemy.AddNewModifier(caster, this, "modifier_imba_ghostship_tide_slow", {
                                duration: stun_duration + this.GetSpecialValueFor("tide_red_slow_duration") * (1 - enemy.GetStatusResistance())
                            });
                        }
                        enemy.AddNewModifier(caster, this, "modifier_stunned", {
                            duration: stun_duration * (1 - enemy.GetStatusResistance())
                        });
                    }
                });
            });
        }
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        let caster = this.GetCasterPlus();
        let range = super.GetCastRange(location, target);
        if (caster.HasScepter()) {
            range = this.GetSpecialValueFor("scepter_cast_range");
        }
        if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_low") || caster.HasModifier("modifier_imba_ebb_and_flow_tsunami")) {
            range = range + this.GetSpecialValueFor("scepter_tide_low_range");
        }
        return range;
    }
    GetAOERadius(): number {
        let caster = this.GetCasterPlus();
        if ((!caster.HasScepter())) {
            return 0;
        }
        let radius = this.GetSpecialValueFor("ghostship_width");
        if (caster.HasModifier("modifier_imba_ebb_and_flow_tide_high") || caster.HasModifier("modifier_imba_ebb_and_flow_tsunami")) {
            radius = radius + this.GetSpecialValueFor("scepter_high_tide_radius");
        }
        return radius;
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (target) {
            let caster = this.GetCasterPlus();
            if (caster.GetTeam() == target.GetTeam()) {
                let duration = this.GetSpecialValueFor("buff_duration");
                target.AddNewModifier(caster, this, "modifier_imba_ghostship_rum", {
                    duration: duration
                });
                if (caster.HasTalent("special_bonus_imba_kunkka_6")) {
                    if (target == caster) {
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            let crash_pos = Vector(ExtraData.crash_x, ExtraData.crash_y, ExtraData.crash_z);
            let target_pos = target.GetAbsOrigin();
            let knockback_origin = target_pos + (target_pos - crash_pos as Vector).Normalized() * 100 as Vector;
            let distance = (crash_pos - target_pos as Vector).Length2D();
            let duration = ((location - crash_pos as Vector).Length2D() - ExtraData.radius) / ExtraData.speed;
            if (AoiHelper.IsNearFountain(target_pos, 1200) || AoiHelper.IsNearFountain(crash_pos, 1200)) {
                duration = 0;
            }
            let knockback = {
                should_stun: 0,
                knockback_duration: duration,
                duration: duration,
                knockback_distance: distance,
                knockback_height: 0,
                center_x: knockback_origin.x + (math.random() * math.random(-10, 10)),
                center_y: knockback_origin.y + (math.random() * math.random(-10, 10)),
                center_z: knockback_origin.z
            }
            if (target == caster) {
                let ghostship_drag = target.AddNewModifier(caster, this, "modifier_imba_ghostship_drag", {
                    duration: duration
                }) as modifier_imba_ghostship_drag;
                if (ghostship_drag) {
                    ghostship_drag.crash_pos = crash_pos;
                    ghostship_drag.direction = (crash_pos - target_pos as Vector).Normalized();
                    ghostship_drag.ship_width = ExtraData.radius;
                    ghostship_drag.ship_speed = ExtraData.speed;
                }
            } else {
                target.RemoveModifierByName("modifier_knockback");
                target.AddNewModifier(caster, undefined, "modifier_knockback", knockback);
            }
        }
        return false;
    }
}
@registerModifier()
export class modifier_imba_ghostship_drag extends BaseModifierMotionHorizontal_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public current_loc: any;
    public new_loc: any;
    public distance: number;
    public next_loc: any;
    public distance_between_ship: number;
    crash_pos: Vector;
    direction: Vector;
    ship_width: number;
    ship_speed: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }

    StatusEffectPriority(): modifierpriority {
        return 20;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        }
        return state;
    }
    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
        }
    }
    ApplyHorizontalMotionController(): boolean {
        if (this.CheckMotionControllers()) {
            return true;
        }
        else {
            this.Destroy();
            return false;;
        }

    }
    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            this.current_loc = this.caster.GetAbsOrigin();
            this.new_loc = this.current_loc + this.direction * this.ship_speed * dt;
            this.distance = (this.crash_pos - this.current_loc as Vector).Length2D();
            if (!this.IsNull()) {
                this.next_loc = this.caster.GetAbsOrigin();
                this.distance_between_ship = (this.next_loc - this.current_loc as Vector).Length2D();
                if (this.distance_between_ship > (this.ship_width / 2)) {
                    this.Destroy();
                    return;
                }
            }
            if (this.distance > 20) {
                this.caster.SetAbsOrigin(this.new_loc);
            } else {
                this.caster.SetAbsOrigin(this.crash_pos);
                this.caster.SetUnitOnClearGround();
                this.Destroy();
                return;
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.caster.HasModifier("modifier_item_forcestaff_active") || this.caster.HasModifier("modifier_item_hurricane_pike_active") || this.caster.HasModifier("modifier_item_hurricane_pike_active_alternate")) {
            } else {
                this.caster.SetUnitOnClearGround();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_ghostship_rum extends BaseModifier_Plus {
    public damage_counter: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetSpecialValueFor("rum_speed");
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.damage_counter = 0;
        }
    }
    GetCustomIncomingDamagePct() {
        return this.GetSpecialValueFor("rum_reduce_pct") * (-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        if (IsServer()) {
            if (params.unit == this.GetParentPlus()) {
                let rum_reduction = (100 - this.GetSpecialValueFor("rum_reduce_pct")) / 100;
                let gen_reduction = (100 + GPropertyCalculate.GetIncomingDamagePercent(params.unit, params as any)) / 100;
                let prevented_damage = params.damage / rum_reduction - params.damage;
                this.damage_counter = this.damage_counter + prevented_damage;
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            if (!caster.HasTalent("special_bonus_imba_kunkka_8")) {
                this.GetParentPlus().AddNewModifier(caster, ability, "modifier_imba_ghostship_rum_damage", {
                    duration: ability.GetSpecialValueFor("damage_duration"),
                    stored_damage: this.damage_counter
                });
            }
            this.damage_counter = 0;
        }
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_rum.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 10;
    }
    GetTexture(): string {
        return "kunkka_ghostship";
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_ghostship_rum_damage extends BaseModifier_Plus {
    GetCustomIncomingDamagePct() {
        return this.GetSpecialValueFor("rum_reduce_pct");
    }
    IsHidden(): boolean {
        return false;
    }
    GetTexture(): string {
        return "kunkka_ghostship";
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            let parent = this.GetParentPlus();
            let damage_duration = ability.GetSpecialValueFor("damage_duration");
            let damage_interval = ability.GetSpecialValueFor("damage_interval");
            let ticks = damage_duration / damage_interval;
            let damage_amount = params.stored_damage / ticks;
            let current_tick = 0;
            this.AddTimer(damage_interval, () => {
                if (parent.IsAlive()) {
                    let target_hp = parent.GetHealth();
                    if (target_hp - damage_amount < 1) {
                        parent.SetHealth(1);
                    } else {
                        parent.SetHealth(target_hp - damage_amount);
                    }
                    current_tick = current_tick + 1;
                    if (current_tick >= ticks) {
                        return undefined;
                    } else {
                        return damage_interval;
                    }
                } else {
                    return undefined;
                }
            });
        }
    }
}
@registerModifier()
export class modifier_imba_ghostship_tide_slow extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return (this.GetSpecialValueFor("tide_red_slow") * (-1));
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_kunkka_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_kunkka_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_kunkka_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_kunkka_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_kunkka_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_kunkka_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_kunkka_9 extends BaseModifier_Plus {
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
