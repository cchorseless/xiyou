import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../modifier/modifier_event";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_keeper_of_the_light_spirit_form = { "ID": "5474", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySound": "Hero_KeeperOfTheLight.SpiritForm", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_6", "AbilityDraftPreAbility": "keeper_of_the_light_blinding_light", "AbilityDraftUltScepterAbility": "keeper_of_the_light_will_o_wisp", "AbilityCooldown": "70", "AbilityManaCost": "75 125 175", "AbilityModifierSupportValue": "0.35", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "40.0 40.0 40.0", "LinkedSpecialBonus": "special_bonus_unique_keeper_of_the_light_11" }, "02": { "var_type": "FIELD_INTEGER", "movement_speed": "20 25 30" }, "03": { "var_type": "FIELD_INTEGER", "cast_range": "125 250 375" }, "04": { "var_type": "FIELD_INTEGER", "illuminate_heal": "30 45 60" } } };

@registerAbility()
export class ability6_keeper_of_the_light_spirit_form extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "keeper_of_the_light_spirit_form";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_keeper_of_the_light_spirit_form = Data_keeper_of_the_light_spirit_form;
    Init() {
        this.SetDefaultSpecialValue("scepter_center_pct_tooltip", 50);
        this.SetDefaultSpecialValue("scepter_radius", [225, 475, 725]);
        this.SetDefaultSpecialValue("scepter_center_pct", [50, 25, 0]);
        this.SetDefaultSpecialValue("on_count", [3, 3, 4, 4, 5, 5]);
        this.SetDefaultSpecialValue("radius", 725);
        this.SetDefaultSpecialValue("off_duration", 1.2);
        this.SetDefaultSpecialValue("on_duration", 1.1);
        this.SetDefaultSpecialValue("off_duration_initial", 1);
        this.SetDefaultSpecialValue("fixed_movement_speed", 35);
        this.SetDefaultSpecialValue("scepter_base_damage", 8000);
        this.SetDefaultSpecialValue("scepter_mana_factor", 100);

        this.OnInit()
    }

    tModifiers: Array<any>;
    tWisp: any[];
    bBlingTimer: boolean;


    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_keeper_of_the_light_custom_4")
    }
    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    SaveModifier(hModifier: BaseModifier_Plus) {
        table.insert(this.tModifiers, hModifier)
    }
    RemoveModifier(hModifier: BaseModifier_Plus) {
        GameFunc.ArrayFunc.ArrayRemove(this.tModifiers, hModifier)
    }
    Bling() {
        for (let hModifier of (this.tModifiers)) {
            if (GameFunc.IsValid(hModifier)) {
                let iCount = this.GetCasterPlus().HasTalent("special_bonus_unique_keeper_of_the_light_custom_5") && this.GetCasterPlus().GetTalentValue("special_bonus_unique_keeper_of_the_light_custom_5") || 1
                hModifier.SetStackCount(hModifier.GetStackCount() + iCount)
            }
        }
    }
    OnInit() {
        this.tModifiers = []
        this.tWisp = []
        this.bBlingTimer = false
        // this.addTimer(0, () => {
        //     let hCaster = this.GetCasterPlus()
        // let bDayTime = (Environment.IsBloodmoon() || (Environment.IsDaytime() && !modifier_night_stalker_3_night.exist(hCaster)))
        // if (bDayTime) {
        //     if (! modifier_keeper_of_the_light_6_particle_daytime.exist( hCaster )) {
        //          modifier_keeper_of_the_light_6_particle_daytime.apply( hCaster , hCaster, this, {})
        //     }
        // } else {
        //      modifier_keeper_of_the_light_6_particle_daytime.remove( hCaster );
        // }
        //     return 0
        // })
    }
    BlingTimer() {
        let off_duration_initial = this.GetSpecialValueFor("off_duration_initial")
        let off_duration = this.GetSpecialValueFor("off_duration")
        let on_duration = this.GetSpecialValueFor("on_duration")
        let on = false
        if (this.bBlingTimer == false) {
            this.bBlingTimer = true
            this.GetCasterPlus().addTimer(
                off_duration_initial,
                () => {
                    if (this.tWisp.length > 0) {
                        if (on == false) {
                            on = true
                            for (let hWisp of (this.tWisp)) {
                                undefined
                            }
                            //  减冷却天赋
                            if (this.GetCasterPlus().HasTalent("special_bonus_unique_keeper_of_the_light_custom_7")) {
                                let flCooldownReduce = this.GetCasterPlus().GetTalentValue("special_bonus_unique_keeper_of_the_light_custom_7")
                                // BuildSystem.EachBuilding(
                                //     this.GetCasterPlus().GetPlayerOwnerID(),
                                //     (hBuilding) => {
                                //         let hUnit = hBuilding.GetUnitEntity()
                                //         if (GameFunc.IsValid(hUnit) && hUnit.GetUnitLabel() == "HERO") {
                                //             for (let i = 0; i <= 16; i++) {
                                //                 let hAbility = hBuilding.GetUnitEntity().GetAbilityByIndex(i)
                                //                 if (GameFunc.IsValid(hAbility) && hAbility.GetLevel() > 0 && hAbility.GetCooldownTimeRemaining() > 0) {
                                //                     let flCooldown = hAbility.GetCooldownTimeRemaining() - flCooldownReduce
                                //                     hAbility.EndCooldown()
                                //                     if (flCooldown > 0) {
                                //                         hAbility.StartCooldown(flCooldown)
                                //                     }
                                //                 }
                                //             }
                                //         }
                                //     }
                                // )
                            }
                            return on_duration
                        } else {
                            on = false
                            for (let hWisp of (this.tWisp)) {
                                undefined
                            }
                            return off_duration
                        }
                    } else {
                        this.bBlingTimer = false
                    }
                }
            )
        }
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let off_duration = this.GetSpecialValueFor("off_duration")
        let on_duration = this.GetSpecialValueFor("on_duration")
        let on_count = this.GetSpecialValueFor("on_count")
        let off_duration_initial = this.GetSpecialValueFor("off_duration_initial")
        //  保险时间
        let duration = off_duration_initial + on_duration * on_count + off_duration * on_count

        let hWisp = CreateUnitByName("npc_dota_ignis_fatuus", (vPosition + Vector(0, 0, 350)) as Vector, true, hCaster, hCaster, hCaster.GetTeamNumber())
        modifier_keeper_of_the_light_6_wisp.apply(hWisp, hCaster, this, { duration: duration })

        table.insert(this.tWisp, hWisp)
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_keeper_of_the_light_6"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
//  Modifiers
@registerModifier()
export class modifier_keeper_of_the_light_6 extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }


    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!GameFunc.IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let caster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }

            if (caster.IsTempestDouble() || caster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()

            let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(), range, caster.GetTeamNumber(), radius, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)

            //  施法命令
            if (position && position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        AbilityIndex: ability.entindex(),
                        Position: position
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_keeper_of_the_light_6_wisp extends BaseModifier_Plus {
    radius: number;
    on_duration: number;
    on_count: number;
    scepter_base_damage: number;
    scepter_mana_factor: number;
    on: boolean;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return true
    }
    IsPurgeException() {
        return true
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    OnCreated() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let vParent = hParent.GetAbsOrigin()
        this.radius = this.GetSpecialValueFor("radius")
        this.on_duration = this.GetSpecialValueFor("on_duration")
        this.on_count = this.GetSpecialValueFor("on_count")
        this.scepter_base_damage = this.GetSpecialValueFor("scepter_base_damage")
        this.scepter_mana_factor = this.GetSpecialValueFor("scepter_mana_factor")
        if (IsServer()) {
            hParent.EmitSound("Hero_KeeperOfTheLight.Wisp.Spawn")
            hParent.EmitSound("Hero_KeeperOfTheLight.Wisp.Aura")
            this.on = true;
            //  开启计时器
            (this.GetAbilityPlus() as ability6_keeper_of_the_light_spirit_form).BlingTimer()
            this.StartIntervalThink(0)
        } else {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_keeper_of_the_light/keeper_dazzling.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT, null, (vParent + Vector(0, 0, 350) as Vector), false)
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.radius, this.radius, this.radius))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive()) {
                this.Destroy()
            }
        }
    }
    OnDestroy() {
        super.OnDestroy();
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            this.StartIntervalThink(-1)
            this.GetParentPlus().StopSound("Hero_KeeperOfTheLight.Wisp.Aura")
            this.GetParentPlus().StopSound("Hero_KeeperOfTheLight.Wisp.Destroy")

            if (GameFunc.IsValid(this.GetParentPlus()) && this.GetParentPlus().IsAlive()) {
                this.GetParentPlus().ForceKill(false)
            }
            hParent.EmitSound("Hero_KeeperOfTheLight.BlindingLight")
            if (!GameFunc.IsValid(hCaster)) {
                return
            }
            GameFunc.ArrayFunc.ArrayRemove((this.GetAbilityPlus() as ability6_keeper_of_the_light_spirit_form).tWisp, hParent)
            //  scepter
            if (hCaster.HasScepter()) {
                let tRadius = [
                    this.GetAbilityPlus().GetLevelSpecialValueFor("scepter_radius", 0),
                    this.GetAbilityPlus().GetLevelSpecialValueFor("scepter_radius", 1),
                    this.GetAbilityPlus().GetLevelSpecialValueFor("scepter_radius", 2)
                ]
                let tCenterPct = [
                    this.GetAbilityPlus().GetLevelSpecialValueFor("scepter_center_pct", 0),
                    this.GetAbilityPlus().GetLevelSpecialValueFor("scepter_center_pct", 1),
                    this.GetAbilityPlus().GetLevelSpecialValueFor("scepter_center_pct", 2)
                ]
                let tDamageTable: BattleHelper.DamageOptions = {
                    ability: this.GetAbilityPlus(),
                    attacker: hCaster,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage: 0,
                    victim: null
                }
                let flDamage = this.scepter_base_damage + this.scepter_mana_factor * hCaster.GetMaxMana() * 0.01
                let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), this.radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
                for (let hUnit of (tTargets)) {

                    let flDistance = ((hUnit.GetAbsOrigin() - hParent.GetAbsOrigin()) as Vector).Length2D()
                    if (flDistance < tRadius[0]) {
                        tDamageTable.damage = flDamage * (1 + tCenterPct[0] * 0.01)
                    } else if (flDistance < tRadius[2]) {
                        tDamageTable.damage = flDamage * (1 + tCenterPct[2] * 0.01)
                    }
                    tDamageTable.victim = hUnit
                    BattleHelper.GoApplyDamage(tDamageTable)
                }
            }
        } else {
            if (GameFunc.IsValid(hCaster) && hCaster.HasScepter()) {
                let radius = this.GetSpecialValueFor("radius")
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_blinding_light_aoe.vpcf",
                    resNpc: null,
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                    owner: null
                });

                ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", hCaster.GetAbsOrigin(), true)
                ParticleManager.SetParticleControl(iParticleID, 1, hParent.GetAbsOrigin())
                ParticleManager.SetParticleControl(iParticleID, 2, Vector(radius, radius, radius))
                ParticleManager.ReleaseParticleIndex(iParticleID)
            }
        }
    }
    Bling() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let vParent = hParent.GetAbsOrigin()
        if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hParent)) {
            this.Destroy()
            return
        }
        //  particle
        modifier_keeper_of_the_light_6_particle_bling.apply(hParent, hCaster, this.GetAbilityPlus(), { duration: this.on_duration })
        //  sound
        hParent.EmitSound("Hero_KeeperOfTheLight.Wisp.Active")
        //  add debuff
        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), this.radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
        for (let hUnit of (tTargets)) {
            if (!modifier_keeper_of_the_light_6_slow.exist(hUnit)) {
                modifier_keeper_of_the_light_6_slow.apply(hUnit, hParent, this.GetAbilityPlus(), { duration: this.on_duration })
            }
        }
        //  计数
        this.on_count = this.on_count - 1;
        //  触发闪亮效果
        (this.GetAbilityPlus() as ability6_keeper_of_the_light_spirit_form).Bling()
    }
    UnBling() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hParent)) {
            this.Destroy()
            return
        }
        //  sound
        StopSoundOn("Hero_KeeperOfTheLight.Wisp.Active", hParent)
        if (this.on_count <= 0) {
            this.Destroy()
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // //
@registerModifier()
export class modifier_keeper_of_the_light_6_slow extends BaseModifier_Plus {
    iFixedMovementSpeed: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return true
    }
    IsPurgeException() {
        return true
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init_old() {
        this.iFixedMovementSpeed = this.GetSpecialValueFor("fixed_movement_speed")
        if (IsServer()) {
            this.GetParentPlus().EmitSound("Hero_KeeperOfTheLight.Wisp.Target")
            this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_DISABLED)
            this.GetParentPlus().MoveToPosition(this.GetCasterPlus().GetAbsOrigin())
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_keeper_of_the_light/keeper_dazzling_debuff.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_keeper_dazzle.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, true, 11, false, false)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            // Spawner.MoveOrder(this.GetParentPlus())
            this.GetParentPlus().FadeGesture(GameActivity_t.ACT_DOTA_DISABLED)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true,
            [modifierstate.MODIFIER_STATE_NIGHTMARED]: true,
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_FROZEN]: true
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_ABSOLUTE)
    GetMoveSpeed_Absolute() {
        return this.iFixedMovementSpeed
    }
}
//  Particle
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_keeper_of_the_light_6_particle_bling extends modifier_particle {
    OnCreated() {
        let radius = this.GetSpecialValueFor("radius")
        let hParent = this.GetParentPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_keeper_of_the_light/keeper_dazzling_on.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), false)
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(radius, 0, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_keeper_of_the_light_6_particle_daytime extends modifier_particle {
    IsHidden() {
        return false
    }
    OnCreated() {
        let radius = this.GetSpecialValueFor("radius")
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            hParent.StartGesture(GameActivity_t.ACT_DOTA_SPAWN)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_spirit_form_ambient.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_keeper_spirit_form.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, true, 10, false, false)
        }
    }
}
