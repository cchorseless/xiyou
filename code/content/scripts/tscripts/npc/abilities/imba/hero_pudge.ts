
import { GameFunc } from "../../../GameFunc";
import { AoiHelper } from "../../../helper/AoiHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";


function UpdateHookStacks(caster: IBaseNpc_Plus) {
    if (!caster.FindAbilityByName("imba_pudge_meat_hook")) {
        let pudge = Entities.FindAllByName("npc_dota_hero_pudge") as IBaseNpc_Plus[];
        for (const main_hero of (pudge)) {
            let borrowed_stacks = main_hero.FindAbilityByName("imba_pudge_meat_hook").GetSpecialValueFor("hook_stacks");
            if (main_hero.HasScepter()) {
                borrowed_stacks = main_hero.FindAbilityByName("imba_pudge_meat_hook").GetSpecialValueFor("hook_stacks") + main_hero.FindAbilityByName("imba_pudge_meat_hook").GetSpecialValueFor("scepter_hook_stacks");
            }
            return borrowed_stacks;
        }
    }
    let stacks = caster.FindAbilityByName("imba_pudge_meat_hook").GetSpecialValueFor("hook_stacks");
    if (caster.HasScepter()) {
        stacks = caster.FindAbilityByName("imba_pudge_meat_hook").GetSpecialValueFor("hook_stacks") + caster.FindAbilityByName("imba_pudge_meat_hook").GetSpecialValueFor("scepter_hook_stacks");
    }
    return stacks;
}
@registerAbility()
export class imba_pudge_meat_hook extends BaseAbility_Plus {
    public launched: any;
    public hook_go: any;
    public RuptureFX: any;
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
    OnUpgrade(): void {
        let ability1 = this.GetCasterPlus().findAbliityPlus<imba_pudge_sharp_hook>("imba_pudge_sharp_hook");
        let ability2 = this.GetCasterPlus().findAbliityPlus<imba_pudge_light_hook>("imba_pudge_light_hook");
        if (ability1) {
            ability1.SetLevel(this.GetLevel());
        }
        if (ability2) {
            ability2.SetLevel(this.GetLevel());
        }
        if (!this.GetCasterPlus().TempData().successful_hooks) {
            this.GetCasterPlus().TempData().successful_hooks = 0;
        }
        let dmg_hook_buff = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), ability1, "modifier_imba_hook_sharp_stack", {});
        let spd_hook_buff = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), ability2, "modifier_imba_hook_light_stack", {});
        dmg_hook_buff.SetStackCount(UpdateHookStacks(this.GetCasterPlus()));
        spd_hook_buff.SetStackCount(UpdateHookStacks(this.GetCasterPlus()));
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        let hook_range = this.GetSpecialValueFor("base_range") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_pudge_5");
        let charges = this.GetCasterPlus().findBuffStack("modifier_imba_hook_light_stack", this.GetCasterPlus());
        return hook_range + (charges * 10);
    }
    OnAbilityPhaseStart(): boolean {
        if (this.launched) {
            return false;
        }
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1);
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        let caster = this.GetCasterPlus();
        caster.RemoveGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1);
        this.launched = false;
    }
    OnOwnerDied(): void {
        this.GetCasterPlus().RemoveGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1);
        this.GetCasterPlus().RemoveGesture(GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_1);
        this.launched = false;
        if (this.IsStolen()) {
            if (this.GetCasterPlus().HasModifier("modifier_imba_hook_sharp_stack")) {
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_hook_sharp_stack");
            }
            if (this.GetCasterPlus().HasModifier("modifier_imba_hook_light_stack")) {
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_hook_light_stack");
            }
        }
    }
    CastFilterResultLocation(vLocation: Vector): UnitFilterResult {
        if (!IsServer()) {
            return;
        }
        if (AoiHelper.IsNearFountain(vLocation, 1700)) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
    }
    GetCustomCastErrorLocation(vLocation: Vector): string {
        return "Cannot Hook Units Located Within Fountain";
    }
    OnSpellStart(): void {
        this.launched = true;
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_pudge_7")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_pudge_meat_hook_caster_root", {});
        }
        let vHookOffset = Vector(0, 0, 96);
        let target_position = GetGroundPosition(this.GetCursorPosition() + vHookOffset as Vector, this.GetCasterPlus());
        if (target_position == this.GetCasterPlus().GetAbsOrigin()) {
            target_position = target_position + this.GetCasterPlus().GetForwardVector() as Vector;
        }
        let dmg_hook_buff = this.GetCasterPlus().findBuff<modifier_imba_hook_sharp_stack>("modifier_imba_hook_sharp_stack");
        let spd_hook_buff = this.GetCasterPlus().findBuff<modifier_imba_hook_light_stack>("modifier_imba_hook_light_stack");
        let hook_width = this.GetSpecialValueFor("hook_width") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_pudge_3");
        let hook_speed = this.GetSpecialValueFor("base_speed") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_pudge_2");
        let stack_speed = 0;
        let stack_range = 0;
        if (this.GetCasterPlus().HasAbility("imba_pudge_light_hook")) {
            stack_speed = this.GetCasterPlus().findAbliityPlus<imba_pudge_light_hook>("imba_pudge_light_hook").GetSpecialValueFor("stack_speed");
            stack_range = this.GetCasterPlus().findAbliityPlus<imba_pudge_light_hook>("imba_pudge_light_hook").GetSpecialValueFor("stack_range");
        }
        let hook_dmg = this.GetSpecialValueFor("base_damage");
        let stack_dmg = 0;
        if (this.GetCasterPlus().HasAbility("imba_pudge_sharp_hook")) {
            stack_dmg = this.GetCasterPlus().findAbliityPlus<imba_pudge_sharp_hook>("imba_pudge_sharp_hook").GetSpecialValueFor("stack_damage");
        }
        if (spd_hook_buff) {
            hook_speed = hook_speed + stack_speed * spd_hook_buff.GetStackCount();
        }
        if (dmg_hook_buff) {
            hook_dmg = hook_dmg + stack_dmg * dmg_hook_buff.GetStackCount();
        }
        let vKillswitch = Vector((((this.GetCastRange(null, null) + GPropertyCalculate.GetCastRangeBonus(this.GetCasterPlus())) / hook_speed) * 2) + 10, 0, 0);
        let hook_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_pudge/pudge_meathook.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined, this.GetCasterPlus());
        ParticleManager.SetParticleAlwaysSimulate(hook_particle);
        ParticleManager.SetParticleControlEnt(hook_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon_chain_rt", this.GetCasterPlus().GetAbsOrigin() + vHookOffset as Vector, true);
        ParticleManager.SetParticleControl(hook_particle, 2, Vector(hook_speed, this.GetCastRange(null, null) + GPropertyCalculate.GetCastRangeBonus(this.GetCasterPlus()), hook_width));
        ParticleManager.SetParticleControl(hook_particle, 3, vKillswitch);
        ParticleManager.SetParticleControl(hook_particle, 4, Vector(1, 0, 0));
        ParticleManager.SetParticleControl(hook_particle, 5, Vector(0, 0, 0));
        ParticleManager.SetParticleControl(hook_particle, 7, Vector(1, 0, 0));
        let projectile_info: CreateLinearProjectileOptions = {
            Ability: this,
            EffectName: undefined,
            vSpawnOrigin: this.GetCasterPlus().GetAbsOrigin(),
            fDistance: this.GetCastRange(null, null) + GPropertyCalculate.GetCastRangeBonus(this.GetCasterPlus()),
            fStartRadius: hook_width,
            fEndRadius: hook_width,
            Source: this.GetCasterPlus(),
            bHasFrontalCone: false,
            // bReplaceExisting: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            fExpireTime: GameRules.GetGameTime() + ((this.GetCastRange(null, null) + GPropertyCalculate.GetCastRangeBonus(this.GetCasterPlus()) / hook_speed)),
            vVelocity: (target_position - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized() * hook_speed * Vector(1, 1, 0) as Vector,
            bProvidesVision: false,
            // bDeleteOnHit: true,
            ExtraData: {
                hook_width: hook_width,
                hook_dmg: hook_dmg,
                hook_spd: hook_speed,
                pfx_index: hook_particle,
                goorback: "go",
                rune: -1
            }
        }
        this.hook_go = ProjectileManager.CreateLinearProjectile(projectile_info);
        if (this.GetCasterPlus() && this.GetCasterPlus().IsHero()) {
            let hHook = this.GetCasterPlus().TempData().hook_wearable;
            if (hHook != undefined && !hHook.IsNull()) {
                hHook.AddEffects(EntityEffects.EF_NODRAW);
            }
        }
        EmitSoundOnLocationWithCaster(this.GetCasterPlus().GetAbsOrigin(), "Hero_Pudge.AttackHookExtend", this.GetCasterPlus());
    }
    OnProjectileThink_ExtraData(vLocation: Vector, ExtraData: any): void {
        if (ExtraData.goorback == "go") {
            ParticleManager.SetParticleControl(ExtraData.pfx_index, 1, vLocation);
            let location = vLocation;
            let radius = ExtraData.hook_width;
            let runes = {
                "1": "models/props_gameplay/rune_goldxp.vmdl",
                "2": "models/props_gameplay/rune_haste01.vmdl",
                "3": "models/props_gameplay/rune_doubledamage01.vmdl",
                "4": "models/props_gameplay/rune_regeneration01.vmdl",
                "5": "models/props_gameplay/rune_arcane.vmdl",
                "6": "models/props_gameplay/rune_invisibility01.vmdl",
                "7": "models/props_gameplay/rune_illusion01.vmdl",
                "8": "models/props_gameplay/rune_frost.vmdl",
                "9": "models/props_gameplay/gold_coin001.vmdl"
            }
            for (const [_, ent] of GameFunc.iPair(Entities.FindAllInSphere(location, radius))) {
                for (const [_, model] of GameFunc.Pair(runes)) {
                    for (const [_, rune] of GameFunc.iPair(Entities.FindAllByModel(model))) {
                        if ((location - rune.GetAbsOrigin() as Vector).Length2D() < radius) {
                            ExtraData.rune = rune.entindex();
                            this.OnProjectileHit_ExtraData(undefined, location, ExtraData);
                        }
                    }
                }
            }
        }
        let hooked_loc: Vector;
        if (ExtraData.goorback != "back") {
            hooked_loc = vLocation;
        } else if (ExtraData.goorback == "back") {
            if (EntIndexToHScript(ExtraData.rune)) {
                let rune = EntIndexToHScript(ExtraData.rune);
                ParticleManager.SetParticleControlEnt(ExtraData.pfx_index, 1, rune, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", rune.GetAbsOrigin() + Vector(0, 0, 96) as Vector, true);
                rune.SetAbsOrigin(GetGroundPosition(vLocation, this.GetCasterPlus()));
            } else {
                let target = EntIndexToHScript(ExtraData.hooked_target) as IBaseNpc_Plus;
                if (!target || !target.IsNull || target.IsNull()) {
                    return;
                }
                let location = vLocation + (this.GetCasterPlus().GetAbsOrigin() - target.GetAbsOrigin() as Vector).Normalized() * (ExtraData.hook_spd / (1 / FrameTime()));
                target.SetAbsOrigin(GetGroundPosition(vLocation, target));
                if (this.GetCasterPlus().GetTeamNumber() != target.GetTeamNumber() /**&& !target.IsRune()*/ && this.GetCasterPlus().HasTalent("special_bonus_imba_pudge_7")) {
                    let damage_cap = this.GetCasterPlus().GetTalentValue("special_bonus_imba_pudge_7", "damage_cap");
                    let rupture_damage = this.GetCasterPlus().GetTalentValue("special_bonus_imba_pudge_7", "movement_damage_pct");
                    let distance_diff = (hooked_loc - target.GetAbsOrigin() as Vector).Length2D();
                    if (distance_diff < damage_cap) {
                        let move_damage = distance_diff * rupture_damage;
                        if (move_damage > 0) {
                            if (!target.TempData().is_ruptured) {
                                target.TempData().is_ruptured = true;
                                this.RuptureFX = ResHelper.CreateParticleEx("particles/units/heroes/hero_bloodseeker/bloodseeker_rupture.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, target, this.GetCasterPlus());
                                EmitSoundOn("hero_bloodseeker.rupture.cast", target);
                                EmitSoundOn("hero_bloodseeker.rupture", target);
                            }
                            ApplyDamage({
                                victim: target,
                                attacker: this.GetCasterPlus(),
                                damage: move_damage,
                                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                                ability: this.GetCasterPlus().findAbliityPlus<imba_pudge_meat_hook>("imba_pudge_meat_hook")
                            });
                        }
                    }
                }
            }
        }
    }
    OnProjectileHit_ExtraData(hTarget: CDOTA_BaseNPC | undefined, vLocation: Vector, ExtraData: any): boolean | void {
        let buff1: modifier_imba_hook_target_enemy;
        let buff2: modifier_imba_hook_target_ally;
        if (hTarget) {
            buff1 = hTarget.findBuff<modifier_imba_hook_target_enemy>("modifier_imba_hook_target_enemy");
            buff2 = hTarget.findBuff<modifier_imba_hook_target_ally>("modifier_imba_hook_target_ally");
        }
        if (hTarget && this.GetCasterPlus().GetTeamNumber() != hTarget.GetTeamNumber() && (AoiHelper.IsNearFountain(hTarget.GetAbsOrigin(), 1700) || AoiHelper.IsNearFountain(this.GetCasterPlus().GetAbsOrigin(), 1700))) {
            return false;
        }
        if (ExtraData.goorback == "go") {
            if (this.GetCasterPlus() == hTarget || buff1 || buff2) {
                return;
            }
            let root_buff = this.GetCasterPlus().findBuff<modifier_imba_pudge_meat_hook_caster_root>("modifier_imba_pudge_meat_hook_caster_root");
            if (root_buff) {
                root_buff.Destroy();
            }
            ParticleManager.SetParticleControl(ExtraData.pfx_index, 4, Vector(0, 0, 0));
            ParticleManager.SetParticleControl(ExtraData.pfx_index, 5, Vector(1, 0, 0));
            let target = hTarget;
            let bVision = false;
            if (!target) {
                target = BaseNpc_Plus.CreateUnitByName("npc_dummy_unit", vLocation, this.GetCasterPlus().GetTeamNumber(), false, this.GetCasterPlus(), this.GetCasterPlus());
            }
            ParticleManager.SetParticleControlEnt(ExtraData.pfx_index, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin() + Vector(0, 0, 96) as Vector, true);
            if (hTarget) {
                EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), "Hero_Pudge.AttackHookImpact", hTarget);
                EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), "Hero_Pudge.AttackHookRetract", hTarget);
                let nFXIndex = ResHelper.CreateParticleEx("particles/units/heroes/hero_pudge/pudge_meathook_impact.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, hTarget, this.GetCasterPlus());
                ParticleManager.SetParticleControlEnt(nFXIndex, 0, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin() + Vector(0, 0, 96) as Vector, true);
                ParticleManager.ReleaseParticleIndex(nFXIndex);
                bVision = true;
                if (hTarget.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
                    let dmg = ExtraData.hook_dmg;
                    let damageTable = {
                        victim: hTarget,
                        attacker: this.GetCasterPlus(),
                        damage: dmg,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        ability: this
                    }
                    let actually_dmg = ApplyDamage(damageTable);
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_DAMAGE, hTarget, actually_dmg, undefined);
                    hTarget.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_hook_target_enemy", {});
                    if (this.GetCasterPlus().HasModifier("modifier_pudge_arcana")) {
                        if (hTarget.IsRealHero()) {
                            this.GetCasterPlus().TempData().successful_hooks = this.GetCasterPlus().TempData().successful_hooks + 1;
                        } else {
                            this.GetCasterPlus().TempData().successful_hooks = 0;
                        }
                        if (this.GetCasterPlus().TempData().successful_hooks >= 2) {
                            EmitSoundOnLocationWithCaster(this.GetCasterPlus().GetAbsOrigin(), "Hero_Pudge.HookDrag.Arcana", this.GetCasterPlus());
                            let pfx = "particles/econ/items/pudge/pudge_arcana/pudge_arcana_red_hook_streak.vpcf";
                            if (this.GetCasterPlus().HasModifier("modifier_pudge_arcana")) {
                                pfx = "particles/econ/items/pudge/pudge_arcana/pudge_arcana_hook_streak.vpcf";
                            }
                            this.GetCasterPlus().EmitSound("Hero.Pudge.Arcana.Streak");
                            let hook_counter = ResHelper.CreateParticleEx(pfx, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
                            let stack_10 = math.floor(this.GetCasterPlus().TempData().successful_hooks / 10);
                            ParticleManager.SetParticleControl(hook_counter, 2, Vector(stack_10, this.GetCasterPlus().TempData().successful_hooks - stack_10 * 10, this.GetCasterPlus().TempData().successful_hooks));
                            ParticleManager.ReleaseParticleIndex(hook_counter);
                        }
                    }
                } else if (hTarget.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
                    hTarget.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_hook_target_ally", {});
                } else {
                    if (this.GetCasterPlus().HasModifier("modifier_pudge_arcana")) {
                        this.GetCasterPlus().TempData().successful_hooks = 0;
                    }
                }
            } else {
                if (this.GetCasterPlus().HasModifier("modifier_pudge_arcana")) {
                    this.GetCasterPlus().TempData().successful_hooks = 0;
                }
            }
            let projectile_info: CreateTrackingProjectileOptions = {
                Target: this.GetCasterPlus(),
                Source: target,
                Ability: this,
                EffectName: undefined,
                iMoveSpeed: ExtraData.hook_spd,
                vSourceLoc: target.GetAbsOrigin(),
                bDrawsOnMinimap: false,
                bDodgeable: false,
                bIsAttack: false,
                bVisibleToEnemies: true,
                bReplaceExisting: false,
                bProvidesVision: bVision,
                iVisionRadius: 400,
                iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
                ExtraData: {
                    hooked_target: target.entindex(),
                    hook_spd: ExtraData.hook_spd,
                    pfx_index: ExtraData.pfx_index,
                    goorback: "back",
                    rune: ExtraData.rune
                }
            }
            ProjectileManager.CreateTrackingProjectile(projectile_info);
            if (this.GetCasterPlus().IsAlive()) {
                this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1);
            }
            if (this.hook_go) {
                ProjectileManager.DestroyLinearProjectile(this.hook_go);
            }
            return true;
        }
        if (ExtraData.goorback == "back") {
            ParticleManager.DestroyParticle(ExtraData.pfx_index, true);
            ParticleManager.ReleaseParticleIndex(ExtraData.pfx_index);
            let target = EntIndexToHScript(ExtraData.hooked_target) as IBaseNpc_Plus;
            if (!target || !target.IsNull || target.IsNull()) {
                this.GetCasterPlus().StopSound("Hero_Pudge.AttackHookExtend");
                this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_1);
                if (this.GetCasterPlus() && this.GetCasterPlus().IsHero()) {
                    let hHook = this.GetCasterPlus().TempData().hook_wearable;
                    if (hHook != undefined && !hHook.IsNull()) {
                        hHook.RemoveEffects(EntityEffects.EF_NODRAW);
                    }
                    StopSoundOn("Hero_Pudge.AttackHookRetract", this.GetCasterPlus());
                    StopSoundOn("Hero_Pudge.AttackHookExtend", this.GetCasterPlus());
                    StopSoundOn("Hero_Pudge.AttackHookRetractStop", this.GetCasterPlus());
                }
                this.launched = false;
                if (this.RuptureFX) {
                    ParticleManager.DestroyParticle(this.RuptureFX, true);
                    ParticleManager.ReleaseParticleIndex(this.RuptureFX);
                }
                return;
            }
            target.SetUnitOnClearGround();
            EmitSoundOnLocationWithCaster(target.GetAbsOrigin(), "Hero_Pudge.AttackHookRetractStop", target);
            this.GetCasterPlus().StopSound("Hero_Pudge.AttackHookExtend");
            if (target.GetUnitName() == "npc_dummy_unit") {
                target.ForceKill(false);
            } else {
                target.StopSound("Hero_Pudge.AttackHookImpact");
                target.StopSound("Hero_Pudge.Hook.Target.TI10");
                target.StopSound("Hero_Pudge.AttackHookRetract");
            }
            this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_1);
            if (this.GetCasterPlus() && this.GetCasterPlus().IsHero()) {
                let hHook = this.GetCasterPlus().TempData().hook_wearable;
                if (hHook != undefined && !hHook.IsNull()) {
                    hHook.RemoveEffects(EntityEffects.EF_NODRAW);
                }
                if (target.TempData().is_ruptured) {
                    target.TempData().is_ruptured = false;
                }
                StopSoundOn("Hero_Pudge.AttackHookRetract", this.GetCasterPlus());
                StopSoundOn("Hero_Pudge.AttackHookExtend", this.GetCasterPlus());
                StopSoundOn("Hero_Pudge.AttackHookRetractStop", this.GetCasterPlus());
            }
            let buff1 = target.findBuff<modifier_imba_hook_target_enemy>("modifier_imba_hook_target_enemy");
            let buff2 = target.findBuff<modifier_imba_hook_target_ally>("modifier_imba_hook_target_ally");
            if (buff1) {
                buff1.Destroy();
            }
            if (buff2) {
                buff2.Destroy();
            }
            this.launched = false;
            if (this.RuptureFX) {
                ParticleManager.DestroyParticle(this.RuptureFX, true);
                ParticleManager.ReleaseParticleIndex(this.RuptureFX);
            }
            return true;
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_pudge_meat_hook_handler";
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_pudge_5") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_pudge_5")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_pudge_5"), "modifier_special_bonus_imba_pudge_5", {});
        }
    }
}
@registerAbility()
export class imba_pudge_sharp_hook extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_hook_sharp_stack";
    }
    OnToggle(): void {
        let toggle = this.GetToggleState();
        let buff = this.GetCasterPlus().findBuff<modifier_imba_hook_sharp_stack>("modifier_imba_hook_sharp_stack");
        let another_ability = this.GetCasterPlus().findAbliityPlus<imba_pudge_light_hook>("imba_pudge_light_hook");
        if (toggle && another_ability.GetToggleState()) {
            another_ability.ToggleAbility();
        }
        if (toggle) {
            buff.StartIntervalThink(this.GetSpecialValueFor("think_interval"));
        } else {
            buff.StartIntervalThink(-1);
        }
    }
    OnInventoryContentsChanged(): void {
        if (IsClient()) {
            return;
        }
        if (this.GetCasterPlus().HasModifier("modifier_imba_hook_sharp_stack")) {
            if (this.GetCasterPlus().findBuff<modifier_imba_hook_sharp_stack>("modifier_imba_hook_sharp_stack").GetStackCount() + this.GetCasterPlus().FindModifierByName("modifier_imba_hook_light_stack").GetStackCount() != UpdateHookStacks(this.GetCasterPlus()) * 2) {
                this.GetCasterPlus().findBuff<modifier_imba_hook_sharp_stack>("modifier_imba_hook_sharp_stack").SetStackCount(UpdateHookStacks(this.GetCasterPlus()));
            }
        }
    }
}
@registerAbility()
export class imba_pudge_light_hook extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_hook_light_stack";
    }
    OnToggle(): void {
        let toggle = this.GetToggleState();
        let buff = this.GetCasterPlus().findBuff<modifier_imba_hook_light_stack>("modifier_imba_hook_light_stack");
        let another_ability = this.GetCasterPlus().findAbliityPlus<imba_pudge_sharp_hook>("imba_pudge_sharp_hook");
        if (toggle && another_ability.GetToggleState()) {
            another_ability.ToggleAbility();
        }
        if (toggle) {
            buff.StartIntervalThink(this.GetSpecialValueFor("think_interval"));
        } else {
            buff.StartIntervalThink(-1);
        }
    }
    OnInventoryContentsChanged(): void {
        if (IsClient()) {
            return;
        }
        if (this.GetCasterPlus().HasModifier("modifier_imba_hook_light_stack")) {
            if (this.GetCasterPlus().findBuff<modifier_imba_hook_sharp_stack>("modifier_imba_hook_sharp_stack").GetStackCount() + this.GetCasterPlus().FindModifierByName("modifier_imba_hook_light_stack").GetStackCount() != UpdateHookStacks(this.GetCasterPlus()) * 2) {
                this.GetCasterPlus().findBuff<modifier_imba_hook_light_stack>("modifier_imba_hook_light_stack").SetStackCount(UpdateHookStacks(this.GetCasterPlus()));
            }
        }
    }
}
@registerModifier()
export class modifier_imba_hook_sharp_stack extends BaseModifier_Plus {
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
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsClient()) {
            return;
        }
        if (this.GetCasterPlus() && this.GetCasterPlus().FindAbilityByName && this.GetCasterPlus().findAbliityPlus<imba_pudge_meat_hook>("imba_pudge_meat_hook")) {
            this.SetStackCount(UpdateHookStacks(this.GetCasterPlus()));
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let buff = this.GetCasterPlus().findBuff<modifier_imba_hook_light_stack>("modifier_imba_hook_light_stack");
            if (!buff) {
                return;
            }
            if (buff.GetStackCount() > 0) {
                buff.SetStackCount(buff.GetStackCount() - 1);
                this.SetStackCount(this.GetStackCount() + 1);
            } else {
                this.GetAbilityPlus().ToggleAbility();
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        if (this.GetAbilityPlus()) {
            return this.GetSpecialValueFor("stack_damage") * this.GetStackCount();
        }
    }
}
@registerModifier()
export class modifier_imba_hook_light_stack extends BaseModifier_Plus {
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
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsClient()) {
            return;
        }
        if (this.GetCasterPlus() && this.GetCasterPlus().FindAbilityByName && this.GetCasterPlus().findAbliityPlus<imba_pudge_meat_hook>("imba_pudge_meat_hook")) {
            this.SetStackCount(UpdateHookStacks(this.GetCasterPlus()));
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let buff = this.GetCasterPlus().findBuff<modifier_imba_hook_sharp_stack>("modifier_imba_hook_sharp_stack");
            if (!buff) {
                return;
            }
            if (buff.GetStackCount() > 0) {
                buff.SetStackCount(buff.GetStackCount() - 1);
                this.SetStackCount(this.GetStackCount() + 1);
            } else {
                this.GetAbilityPlus().ToggleAbility();
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        if (this.GetAbilityPlus()) {
            return this.GetSpecialValueFor("stack_speed") * this.GetStackCount();
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2)
    CC_OnTooltip2(): number {
        if (this.GetAbilityPlus()) {
            return this.GetSpecialValueFor("stack_range") * this.GetStackCount();
        }
    }
}
@registerModifier()
export class modifier_imba_pudge_meat_hook_handler extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS
        }
        return Object.values(funcs);
    } */
    BeCreated(p_0: any,): void {
        if (this.GetCasterPlus().IsIllusion()) {
            this.Destroy();
            return;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        if (this.GetCasterPlus().TempData().successful_hooks == undefined) {
            this.GetCasterPlus().TempData().successful_hooks = 0;
        }
        if (this.GetCasterPlus().TempData().successful_hooks >= 1 && this.GetCasterPlus().TempData().successful_hooks < 3) {
            return "hook_streak_small";
        } else if (this.GetCasterPlus().TempData().successful_hooks >= 3 && this.GetCasterPlus().TempData().successful_hooks < 5) {
            return "hook_streak_medium";
        } else if (this.GetCasterPlus().TempData().successful_hooks >= 5) {
            return "hook_streak_large";
        }
    }
}
@registerModifier()
export class modifier_imba_pudge_meat_hook_caster_root extends BaseModifier_Plus {
    public disable: IBaseItem_Plus[];
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
    RemoveOnDeath(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
        return state;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        let disable_items = {
            "1": "item_tpscroll",
            "2": "item_travel_boots",
            "3": "item_travel_boots_2"
        }
        let caster = this.GetCasterPlus();
        this.disable = []
        for (let i = 0; i <= 8; i++) {
            let item = caster.GetItemInSlot(i);
            for (const [_, check] of GameFunc.Pair(disable_items)) {
                if (item && item.GetAbilityName() == check) {
                    item.SetActivated(false);
                    table.insert(this.disable, item);
                    return;
                }
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        for (const item of (this.disable)) {
            if (item) {
                item.SetActivated(true);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_hook_target_enemy extends BaseModifier_Plus {
    IsDebuff(): boolean {
        if (this.GetCasterPlus().GetTeamNumber() == this.GetParentPlus().GetTeamNumber()) {
            return false;
        } else {
            return true;
        }
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
    RemoveOnDeath(): boolean {
        return false;
    }
    IsMotionController() {
        return true;
    }
    GetMotionControllerPriority() {
        return DOTA_MOTION_CONTROLLER_PRIORITY.DOTA_MOTION_CONTROLLER_PRIORITY_HIGHEST;
    }
    BeCreated(p_0: any,): void {
        this.StartIntervalThink(1);
    }
    OnIntervalThink(): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state_ally = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
        let state_enemy = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        if (this.GetCasterPlus().GetTeamNumber() == this.GetParentPlus().GetTeamNumber()) {
            return state_ally;
        } else {
            return state_enemy;
        }
    }
}
@registerModifier()
export class modifier_imba_hook_target_ally extends BaseModifier_Plus {
    IsDebuff(): boolean {
        if (this.GetCasterPlus().GetTeamNumber() == this.GetParentPlus().GetTeamNumber()) {
            return false;
        } else {
            return true;
        }
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
    RemoveOnDeath(): boolean {
        return false;
    }
    IsMotionController() {
        return true;
    }
    GetMotionControllerPriority() {
        return DOTA_MOTION_CONTROLLER_PRIORITY.DOTA_MOTION_CONTROLLER_PRIORITY_HIGHEST;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state_ally = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
        let state_enemy = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        if (this.GetCasterPlus().GetTeamNumber() == this.GetParentPlus().GetTeamNumber()) {
            return state_ally;
        } else {
            return state_enemy;
        }
    }
}
@registerAbility()
export class imba_pudge_rot extends BaseAbility_Plus {
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
    ResetToggleOnRespawn(): boolean {
        return true;
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        if (this.GetCasterPlus().HasModifier("modifier_imba_flesh_heap_stacks")) {
            return math.min(this.GetSpecialValueFor("rot_radius") + (this.GetCasterPlus().findBuffStack("modifier_imba_flesh_heap_stacks", this.GetCasterPlus()) * this.GetSpecialValueFor("stack_radius")), this.GetSpecialValueFor("max_radius")) - this.GetCasterPlus().GetCastRangeBonus();
        } else {
            return this.GetSpecialValueFor("rot_radius") - this.GetCasterPlus().GetCastRangeBonus();
        }
    }
    OnToggle(): void {
        if (this.GetToggleState()) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_pudge_rot", {});
        } else {
            this.GetCasterPlus().RemoveModifierByName("modifier_imba_pudge_rot");
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_pudge_9") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_pudge_9")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_pudge_9"), "modifier_special_bonus_imba_pudge_9", {});
        }
    }
}
@registerModifier()
export class modifier_imba_pudge_rot extends BaseModifier_Plus {
    public rot_radius: number;
    public rot_tick: any;
    public rot_damage: number;
    public stack_radius: number;
    public max_radius: number;
    public bonus_damage: number;
    public radius: number;
    public damage_per_tick: number;
    public pfx: any;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.rot_radius = this.GetSpecialValueFor("rot_radius");
        this.rot_tick = this.GetSpecialValueFor("rot_tick");
        this.rot_damage = this.GetAbilityPlus().GetTalentSpecialValueFor("rot_damage");
        this.stack_radius = this.GetSpecialValueFor("stack_radius");
        this.max_radius = this.GetSpecialValueFor("max_radius");
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage");
        if (this.GetCasterPlus().HasModifier("modifier_imba_flesh_heap_stacks")) {
            this.radius = math.min(this.rot_radius + (this.GetCasterPlus().findBuffStack("modifier_imba_flesh_heap_stacks", this.GetCasterPlus()) * this.stack_radius), this.max_radius);
        } else {
            this.radius = this.rot_radius;
        }
        this.damage_per_tick = (this.rot_damage + (this.GetCasterPlus().GetMaxHealth() * this.bonus_damage * 0.01)) * this.rot_tick;
        this.pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_pudge/pudge_rot.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.pfx, 1, Vector(this.radius, 0, 0));
        this.AddParticle(this.pfx, false, false, -1, false, false);
        this.StartIntervalThink(this.rot_tick);
        EmitSoundOn("Hero_Pudge.Rot", this.GetParentPlus());
        this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_2);
    }
    OnIntervalThink(): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.rot_radius = this.GetSpecialValueFor("rot_radius");
        this.rot_tick = this.GetSpecialValueFor("rot_tick");
        this.rot_damage = this.GetAbilityPlus().GetTalentSpecialValueFor("rot_damage");
        this.stack_radius = this.GetSpecialValueFor("stack_radius");
        this.max_radius = this.GetSpecialValueFor("max_radius");
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage");
        if (this.GetCasterPlus().HasModifier("modifier_imba_flesh_heap_stacks")) {
            this.radius = math.min(this.rot_radius + (this.GetCasterPlus().findBuffStack("modifier_imba_flesh_heap_stacks", this.GetCasterPlus()) * this.stack_radius), this.max_radius);
        } else {
            this.radius = this.rot_radius;
        }
        this.damage_per_tick = (this.rot_damage + (this.GetCasterPlus().GetMaxHealth() * this.bonus_damage * 0.01)) * this.rot_tick;
        if (this.pfx) {
            ParticleManager.SetParticleControl(this.pfx, 1, Vector(this.radius, 0, 0));
        }
        ApplyDamage({
            victim: this.GetParentPlus(),
            damage: this.damage_per_tick,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        });
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
            if (enemy.FindModifierByNameAndCaster("modifier_imba_pudge_rot_slow", this.GetCasterPlus())) {
                ApplyDamage({
                    victim: enemy,
                    damage: this.damage_per_tick,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this.GetAbilityPlus()
                });
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        StopSoundOn("Hero_Pudge.Rot", this.GetParentPlus());
        this.GetParentPlus().FadeGesture(GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_2);
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        if (this.radius) {
            return this.radius;
        }
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_pudge_rot_slow";
    }
}
@registerModifier()
export class modifier_imba_pudge_rot_slow extends BaseModifier_Plus {
    public rot_slow: any;
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.rot_slow = this.GetAbilityPlus().GetTalentSpecialValueFor("rot_slow");
        return this.rot_slow;
    }
}
@registerAbility()
export class imba_pudge_flesh_heap extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_flesh_heap_stacks";
    }
}
@registerModifier()
export class modifier_imba_pudge_flesh_heap_handler extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
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
            1: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent): void {
        let caster = this.GetCasterPlus();
        let target = params.unit;
        if (this.GetCasterPlus().IsRealHero() && target.IsRealHero() && caster.GetTeamNumber() != target.GetTeamNumber() && (!params.unit.IsReincarnating || !params.unit.IsReincarnating())) {
            let flesh_heap_range = this.GetSpecialValueFor("range");
            if (flesh_heap_range == 0) {
                flesh_heap_range = 2000;
            }
            if ((this.GetAbilityPlus().GetCasterPlus().GetAbsOrigin() - target.GetAbsOrigin() as Vector).Length2D() <= flesh_heap_range) {
                this.SetStackCount(this.GetStackCount() + 1);
                let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_pudge/pudge_fleshheap_count.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
                ParticleManager.ReleaseParticleIndex(pfx);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_flesh_heap_stacks extends BaseModifier_Plus {
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
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let ability = this.GetCasterPlus().findAbliityPlus<imba_pudge_flesh_heap>("imba_pudge_flesh_heap");
            if (!this.GetCasterPlus().HasModifier("modifier_imba_pudge_flesh_heap_handler")) {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), ability, "modifier_imba_pudge_flesh_heap_handler", {});
            }
            if (this.GetParentPlus().IsIllusion() && this.GetParentPlus().GetPlayerOwner().GetAssignedHero().HasModifier("modifier_imba_flesh_heap_stacks")) {
                this.SetStackCount(this.GetParentPlus().GetPlayerOwner().GetAssignedHero().findBuff<modifier_imba_flesh_heap_stacks>("modifier_imba_flesh_heap_stacks").GetStackCount());
            }
            if (!this.GetParentPlus().IsIllusion()) {
                this.StartIntervalThink(0.1);
            }
        }
    }
    OnIntervalThink(): void {
        if (this.GetCasterPlus().HasModifier("modifier_imba_pudge_flesh_heap_handler")) {
            this.SetStackCount(this.GetCasterPlus().findBuff<modifier_imba_pudge_flesh_heap_handler>("modifier_imba_pudge_flesh_heap_handler").GetStackCount());
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (this.GetAbilityPlus() && !this.GetParentPlus().PassivesDisabled()) {
            return this.GetSpecialValueFor("base_magic_resist");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        if (this.GetAbilityPlus()) {
            if (this.GetParentPlus().PassivesDisabled()) {
                return 0;
            } else {
                return this.GetSpecialValueFor("stack_health_regen") * math.min(this.GetStackCount(), this.GetSpecialValueFor("max_stacks") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_pudge_4"));
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.GetAbilityPlus() && !this.GetParentPlus().IsIllusion() && !this.GetParentPlus().PassivesDisabled()) {
            return this.GetSpecialValueFor("stack_str") * this.GetStackCount();
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE)
    CC_GetModifierModelScale(): number {
        if (this.GetAbilityPlus()) {
            if (!this.GetParentPlus().PassivesDisabled()) {
                return math.min(this.GetStackCount(), this.GetSpecialValueFor("max_stacks") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_pudge_4")) * 1.75;
            }
        }
    }
}
@registerAbility()
export class imba_pudge_dismember extends BaseAbility_Plus {
    public swallowed_target: any;
    public target: IBaseNpc_Plus;
    public pfx: any;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_pudge_dismember_handler";
    }
    GetChannelTime(): number {
        return this.GetCasterPlus().findBuffStack("modifier_imba_pudge_dismember_handler", this.GetCasterPlus()) * 0.01;
    }
    CastFilterResultTarget(hTarget: CDOTA_BaseNPC): UnitFilterResult {
        if (hTarget == this.GetCasterPlus()) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        } else if (!this.GetCasterPlus().HasScepter()) {
            return UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, this.GetCasterPlus().GetTeamNumber());
        } else {
            if (hTarget.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
                return UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO, this.GetCasterPlus().GetTeamNumber());
            } else {
                return UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, this.GetCasterPlus().GetTeamNumber());
            }
        }
    }
    GetCustomCastErrorTarget(hTarget: CDOTA_BaseNPC): string {
        return "#dota_hud_error_cant_cast_on_self";
    }
    GetCooldown(iLevel: number): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("scepter_cooldown");
        } else {
            return super.GetCooldown(iLevel);
        }
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget() as IBaseNpc_Plus;
        if (this.GetCasterPlus().GetTeamNumber() != target.GetTeamNumber()) {
            if (target.TriggerSpellAbsorb(this)) {
                this.GetCasterPlus().Interrupt();
                return undefined;
            }
        } else {
            if (this.swallowed_target && !this.swallowed_target.IsNull() && this.swallowed_target.HasModifier("modifier_imba_dismember_scepter")) {
                this.swallowed_target.RemoveModifierByName("modifier_imba_dismember_scepter");
            }
            this.GetCasterPlus().SwapAbilities("imba_pudge_flesh_heap", "imba_pudge_eject", false, true);
            this.swallowed_target = target;
            target.Purge(false, true, false, true, true);
            ProjectileManager.ProjectileDodge(target);
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_dismember_scepter", {});
            return;
        }
        this.target = target;
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_pudge_dismember_buff", {});
        target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_dismember", {
            duration: this.GetChannelTime() - FrameTime()
        });
        if (this.GetCasterPlus().HasModifier("modifier_pudge_arcana")) {
            this.pfx = ResHelper.CreateParticleEx("particles/econ/items/pudge/pudge_arcana/pudge_arcana_dismember_" + target.GetHeroType() + ".vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, target, this.GetCasterPlus());
            ParticleManager.SetParticleControl(this.pfx, 1, target.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.pfx, 8, Vector(1, 1, 1));
            ParticleManager.SetParticleControl(this.pfx, 15, target.GetFittingColor());
        } else {
            this.pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_pudge/pudge_dismember.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, target, this.GetCasterPlus());
            ParticleManager.SetParticleControlEnt(this.pfx, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
        }
    }
    OnChannelFinish(bInterrupted: boolean): void {
        let target_buff: CDOTA_Buff;
        if (this.target) {
            target_buff = this.target.FindModifierByNameAndCaster("modifier_imba_dismember", this.GetCasterPlus());
            if (bInterrupted) {
                this.target.RemoveModifierByName("modifier_imba_dismember");
            }
        }
        let caster_buff = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_pudge_dismember_buff", this.GetCasterPlus());
        if (target_buff) {
            target_buff.Destroy();
        }
        if (caster_buff) {
            caster_buff.Destroy();
        }
        if (this.pfx) {
            ParticleManager.DestroyParticle(this.pfx, false);
            ParticleManager.ReleaseParticleIndex(this.pfx);
        }
    }
}
@registerModifier()
export class modifier_imba_pudge_dismember_handler extends BaseModifier_Plus {
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
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_OnAbilityExecuted(keys: ModifierAbilityEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.ability == this.GetAbilityPlus()) {
            if (keys.target.IsHero()) {
                this.GetCasterPlus().SetModifierStackCount("modifier_imba_pudge_dismember_handler", this.GetCasterPlus(), this.GetAbilityPlus().GetTalentSpecialValueFor("hero_duration") * (1 - keys.target.GetStatusResistance()) * 100);
            } else {
                this.GetCasterPlus().SetModifierStackCount("modifier_imba_pudge_dismember_handler", this.GetCasterPlus(), this.GetAbilityPlus().GetTalentSpecialValueFor("creep_duration") * (1 - keys.target.GetStatusResistance()) * 100);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_dismember extends BaseModifier_Plus {
    public dismember_damage: number;
    public strength_damage: number;
    public standard_tick_interval: number;
    public tick_interval: number;
    IgnoreTenacity() {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.dismember_damage = this.GetSpecialValueFor("dismember_damage");
        this.strength_damage = this.GetSpecialValueFor("strength_damage");
        if (IsServer()) {
            this.standard_tick_interval = this.GetSpecialValueFor("tick_rate");
            this.tick_interval = this.standard_tick_interval * (1 - this.GetParentPlus().GetStatusResistance());
            this.StartIntervalThink(this.tick_interval);
            this.OnIntervalThink();
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_pudge_dismember_pull", {
                duration: this.GetAbilityPlus().GetChannelTime() - FrameTime()
            });
        }
    }
    OnIntervalThink(): void {
        let damageTable = {
            victim: this.GetParentPlus(),
            attacker: this.GetCasterPlus(),
            damage: (this.dismember_damage + this.GetCasterPlus().GetStrength() * this.strength_damage * 0.01) * this.standard_tick_interval,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            ability: this.GetAbilityPlus()
        }
        ApplyDamage(damageTable);
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().IsChanneling()) {
                this.GetAbilityPlus().EndChannel(false);
                this.GetCasterPlus().MoveToPositionAggressive(this.GetParentPlus().GetAbsOrigin());
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
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
export class modifier_imba_pudge_dismember_buff extends BaseModifier_Plus {
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
    GetModifierSpellLifesteal() {
        return this.GetSpecialValueFor("spell_lifesteal");
    }
    /** DeclareFunctions():modifierfunction[] {
        let table = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS
        }
        return Object.values(table);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        if (this.GetCasterPlus().HasItemInInventory("item_imba_aether_lens")) {
            return "long_dismember";
        } else {
            return "";
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_4;
    }
}
@registerModifier()
export class modifier_imba_pudge_dismember_pull extends BaseModifierMotionHorizontal_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public pull_units_per_second: any;
    public pull_distance_limit: number;
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.pull_units_per_second = this.ability.GetSpecialValueFor("pull_units_per_second");
        this.pull_distance_limit = this.ability.GetSpecialValueFor("pull_distance_limit");
        if (this.ApplyHorizontalMotionController() == false) {
            this.Destroy();
            return;
        }
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) {
            return;
        }
        let distance = this.caster.GetOrigin() - me.GetOrigin() as Vector;
        if (distance.Length2D() > this.pull_distance_limit && this.parent.HasModifier("modifier_imba_dismember")) {
            me.SetOrigin(me.GetOrigin() + distance.Normalized() * this.pull_units_per_second * dt as Vector);
        } else {
            this.Destroy();
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.parent.RemoveHorizontalMotionController(this);
    }
}
@registerModifier()
export class modifier_imba_dismember_scepter extends BaseModifierMotionHorizontal_Plus {
    public order_lock_duration: number;
    public pfx: any;
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: this.GetElapsedTime() <= this.order_lock_duration
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ORDER,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE,
            3: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    BeCreated(p_0: any,): void {
        this.order_lock_duration = this.GetSpecialValueFor("order_lock_duration");
        if (!IsServer()) {
            return;
        }
        this.pfx = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_pudge/pudge_swallow.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus().GetTeamNumber());
        this.AddParticle(this.pfx, false, false, -1, true, true);
        this.GetParentPlus().AddNoDraw();
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        this.GetParentPlus().SetAbsOrigin(this.GetCasterPlus().GetAbsOrigin());
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(params: ModifierUnitEvent): void {
        if (!IsServer()) {
            return;
        }
        if (params.unit == this.GetParentPlus()) {
            let valid_orders = {
                1: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION,
                2: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET,
                3: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE,
                4: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
                5: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                6: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                7: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE,
                8: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                9: dotaunitorder_t.DOTA_UNIT_ORDER_DROP_ITEM,
                10: dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM,
                11: dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_ITEM,
                12: dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_RUNE
            }
            for (const [k, v] of GameFunc.Pair(valid_orders)) {
                if (params.order_type == v) {
                    this.Destroy();
                    return;
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE)
    CC_GetModifierHealthRegenPercentage(): number {
        return this.GetSpecialValueFor("scepter_healing_pct");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetCasterPlus()) {
            this.Destroy();
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().RemoveNoDraw();
        this.GetCasterPlus().SwapAbilities("imba_pudge_flesh_heap", "imba_pudge_eject", true, false);
        let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_pudge/pudge_swallow_release.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
        ParticleManager.ReleaseParticleIndex(pfx);
    }
}
@registerAbility()
export class imba_pudge_eject extends BaseAbility_Plus {
    IsInnateAbility() {
        return true;
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let dismember = this.GetCasterPlus().findAbliityPlus<imba_pudge_dismember>("imba_pudge_dismember");
        if (dismember && dismember.swallowed_target) {
            dismember.swallowed_target.RemoveModifierByName("modifier_imba_dismember_scepter");
            dismember.swallowed_target = undefined;
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_pudge_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_pudge_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_pudge_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_pudge_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_pudge_9 extends BaseModifier_Plus {
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
export class modifier_pudge_arcana extends BaseModifier_Plus {
    RemoveOnDeath(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return !IsInToolsMode();
    }
}
