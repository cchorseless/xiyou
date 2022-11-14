import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_invisible } from "../../../modifier/modifier_invisible";

/** dota原技能数据 */
export const Data_void_spirit_dissimilate = { "ID": "6470", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_VoidSpirit.Dissimilate.Cast", "HasShardUpgrade": "1", "AbilityCastPoint": "0.2", "AbilityCooldown": "20 17 14 11", "AbilityDamage": "100 180 260 340", "AbilityManaCost": "100 110 120 130", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "phase_duration": "1.3" }, "02": { "var_type": "FIELD_INTEGER", "destination_fx_radius": "183" }, "03": { "var_type": "FIELD_INTEGER", "portals_per_ring": "6" }, "04": { "var_type": "FIELD_INTEGER", "angle_per_ring_portal": "60" }, "05": { "var_type": "FIELD_INTEGER", "first_ring_distance_offset": "520" }, "06": { "var_type": "FIELD_INTEGER", "damage_radius": "275" }, "07": { "var_type": "FIELD_INTEGER", "shard_bonus_damage": "200" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability2_void_spirit_dissimilate extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "void_spirit_dissimilate";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_void_spirit_dissimilate = Data_void_spirit_dissimilate;
    Init() {
        this.SetDefaultSpecialValue("active_count", [2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("active_pct", 70);
        this.SetDefaultSpecialValue("damage_pct", [50, 60, 70, 80, 100]);
        this.SetDefaultSpecialValue("portals_per_ring", 6);
        this.SetDefaultSpecialValue("angle_per_ring_portal", 60);
        this.SetDefaultSpecialValue("first_ring_distance_offset", 400);
        this.SetDefaultSpecialValue("destination_fx_radius", 183);
        this.SetDefaultSpecialValue("damage_radius", 275);
        this.SetDefaultSpecialValue("all_damage_amplify", 20);

    }


    GetIntrinsicModifierName() {
        return "modifier_void_spirit_3"
    }
    OnOwnerDied() {
        this.RemoveIlls()
    }
    RemoveIlls() {
        let hCaster = this.GetCasterPlus() as BaseNpc_Plus & { hParent: BaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActivePct: number };
        if (hCaster && hCaster.tIlls) {
            for (let v of (hCaster.tIlls)) {
                if (GameFunc.IsValid(v)) {
                    UTIL_Remove(v)
                }
            }
        }
    }
    OnUpgrade() {
        let hCaster = this.GetCasterPlus() as BaseNpc_Plus & { hParent: BaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActiveCount: number, iActivePct: number, iDamagePct: number, all_damage_amplify: number };
        //  灵扉相关的属性
        hCaster.iActiveCount = this.GetSpecialValueFor("active_count")
        hCaster.iActivePct = this.GetSpecialValueFor("active_pct")
        hCaster.iDamagePct = this.GetSpecialValueFor("damage_pct")
        hCaster.all_damage_amplify = this.GetSpecialValueFor("all_damage_amplify")
        this.addTimer(0, () => {
            this.ActiveOne()
        })
    }
    //  激活一个灵扉
    ActiveOne() {
        if (!IsServer()) {
            return
        }
        let active_count = this.GetSpecialValueFor("active_count")
        let iTotal = this.GetSpecialValueFor("portals_per_ring")
        let hCaster = this.GetOriCaster() as BaseNpc_Plus & { hParent: BaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActiveCount: number, iActivePct: number, iDamagePct: number, all_damage_amplify: number };
        if (hCaster.tIlls && (hCaster.tIlls.length) > 0) {
            let tInvi = [] as any[]
            let tActiveCount = [] as any[]
            for (let hIll of (hCaster.tIlls)) {
                if (GameFunc.IsValid(hIll)) {
                    if (!hIll.bActive) {
                        table.insert(tInvi, hIll)
                    } else {
                        table.insert(tActiveCount, hIll)
                    }
                }
            }
            let iInviCount = tInvi.length;
            let iActiveCount = iTotal - iInviCount
            if (iActiveCount > active_count) {
                for (let i = 1; i <= iActiveCount - active_count; i++) {
                    let hIll = tActiveCount[i]
                    if (GameFunc.IsValid(hIll)) {
                        modifier_invisible.apply(hIll, hCaster, this, null)
                        hIll.bActive = false
                    }
                }
            } else {
                for (let i = 1; i <= active_count - iActiveCount; i++) {
                    let hIll = GameFunc.ArrayFunc.RandomArray(tInvi)
                    if (GameFunc.IsValid(hIll as any)) {
                        //  modifier_invisible.remove( hIll );
                        // hIll.bActive = true
                    }
                }
            }
        }
    }
    GetOriCaster() {
        let hCaster = this.GetCasterPlus() as BaseNpc_Plus & { hParent: BaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActiveCount: number, iActivePct: number, iDamagePct: number, all_damage_amplify: number };
        if (GameFunc.IsValid(hCaster.hParent)
            || hCaster.IsDummy) {
            hCaster = hCaster.hParent as any
        }
        return hCaster
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_void_spirit_3 extends BaseModifier_Plus {
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
            let hParent = this.GetParentPlus() as BaseNpc_Plus & { hParent: BaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActiveCount: number, iActivePct: number, iDamagePct: number, all_damage_amplify: number };
            let hAbility = this.GetAbilityPlus()

            if (hParent.tIlls && hParent.tIlls.length > 0
                || hAbility.GetLevel() < 1
                || modifier_void_spirit_3_create_ill.exist(hParent)
                || hParent.IsIllusion()
                || hParent.IsDummy) {
                return
            }

            let destination_fx_radius = this.GetSpecialValueFor("destination_fx_radius")
            let portals_per_ring = this.GetSpecialValueFor("portals_per_ring")
            let angle_per_ring_portal = this.GetSpecialValueFor("angle_per_ring_portal")
            let first_ring_distance_offset = this.GetSpecialValueFor("first_ring_distance_offset")
            let damage_radius = this.GetSpecialValueFor("damage_radius")

            hParent.addTimer(0, () => {
                if (!GameFunc.IsValid(hAbility)
                    || !GameFunc.IsValid(hParent)
                    || hParent.tIlls && hParent.tIlls.length > 0
                    || hAbility.GetLevel() < 1
                    || modifier_void_spirit_3_create_ill.exist(hParent)
                    || hParent.IsIllusion()
                    || hParent.IsDummy) {
                    return
                }
                modifier_void_spirit_3_create_ill.apply(hParent, hParent, hAbility, {
                    duration: 2,
                    destination_fx_radius: destination_fx_radius,
                    portals_per_ring: portals_per_ring,
                    angle_per_ring_portal: angle_per_ring_portal,
                    first_ring_distance_offset: first_ring_distance_offset,
                    damage_radius: damage_radius
                })
            }
            )

        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_TELEPORTED)
    OnTeleported(params: ModifierTable) {
        if (IsServer() && params.unit == this.GetParentPlus()) {
            let hAbility = this.GetAbilityPlus() as ability2_void_spirit_dissimilate
            if (hAbility && hAbility.GetOriCaster) {
                let hCaster = hAbility.GetOriCaster()
                let vOrigin = hCaster.GetAbsOrigin()
                if (hCaster.tIlls && (hCaster.tIlls.length > 0)) {
                    for (let hIll of (hCaster.tIlls)) {


                        if (GameFunc.IsValid(hIll) && hIll.vOffset) {
                            let pos = vOrigin + hIll.vOffset
                            hIll.SetAbsOrigin(GetGroundPosition(pos, hIll))
                        }
                    }
                }
            }
        }
    }
}

// // // // // // // // // // // // // // // // // // // -modifier_void_spirit_3_create_ill// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_void_spirit_3_create_ill extends BaseModifier_Plus {
    damage_radius: any;
    tDoorPos: any[];
    tDoorPtclIDs: any[];
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
            let hCaster = this.GetCasterPlus() as BaseNpc_Plus & { hParent: BaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActivePct: number };
            if (hCaster.IsIllusion()
                || hCaster.IsDummy) {
                return
            }
            this.damage_radius = params.damage_radius
            this.tDoorPos = []
            this.tDoorPtclIDs = []
            // 创建灵扉
            let that = this
            let funcCreateDoor = (pos: Vector) => {
                pos = GetGroundPosition(pos, null)
                let iPtclID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_void_spirit/dissimilate/void_spirit_dissimilate.vpcf",
                    resNpc: null,
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN,
                    owner: hCaster
                });

                ParticleManager.SetParticleControl(iPtclID, 0, pos)
                ParticleManager.SetParticleControl(iPtclID, 1, Vector(params.damage_radius, 0, 0))
                ParticleManager.SetParticleControl(iPtclID, 2, Vector(1, 0, 0))
                table.insert(that.tDoorPtclIDs, iPtclID)
            }

            let vPos = hCaster.GetAbsOrigin()
            funcCreateDoor(vPos)
            table.insert(this.tDoorPos, vPos)
            let vDir = hCaster.GetForwardVector()
            let count = 0
            hCaster.addTimer(0, () => {
                let pos = (vPos + vDir * params.first_ring_distance_offset) as Vector
                funcCreateDoor(pos)
                table.insert(this.tDoorPos, pos)
                vDir = RotatePosition(Vector(0, 0, 0), QAngle(0, 60, 0), vDir)
                count = count + 1
                if (count < params.portals_per_ring) {
                    return 0.1
                }
            })
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            //  销毁特效
            if (this.tDoorPtclIDs) {
                for (let v of (this.tDoorPtclIDs)) {


                    if (v) {
                        ParticleManager.DestroyParticle(v, true)
                    }
                }
            }

            let hCaster = this.GetCasterPlus() as BaseNpc_Plus & { hParent: BaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActivePct: number };
            let hAbility = this.GetAbilityPlus() as ability2_void_spirit_dissimilate

            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive() || hCaster.IsIllusion() || hCaster.IsDummy) {
                return
            }

            if (this.tDoorPos) {
                //  生成所有幻象
                let hHero = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID())
                let vOrigin = hCaster.GetAbsOrigin()
                hCaster.tIlls = []
                for (let i = 1; i <= this.tDoorPos.length; i++) {
                    let vPos = this.tDoorPos[i]
                    if (vPos != hCaster.GetAbsOrigin()) {
                        let hIll = CreateUnitByName(hCaster.GetUnitName(), hCaster.GetAbsOrigin(), false, hHero, hHero, hCaster.GetTeamNumber()) as any
                        hIll.IsDummy = true
                        hIll.hParent = hCaster
                        hIll.bActive = false
                        hIll.vOffset = vPos - vOrigin
                        modifier_void_spirit_3_ill.apply(hIll, hCaster, hAbility, {})
                        modifier_invisible.apply(hIll, hCaster, hAbility, {})
                        let vIllPos = vPos
                        hIll.SetAbsOrigin(GetGroundPosition(vIllPos, null))
                        hIll.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_3_END)
                        table.insert(hCaster.tIlls, hIll)
                    }

                    let iPtclID = ResHelper.CreateParticle({
                        resPath: "particles/units/heroes/hero_void_spirit/dissimilate/void_spirit_dissimilate_exit.vpcf",
                        resNpc: null,
                        iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                        owner: null
                    });

                    ParticleManager.ReleaseParticleIndex(iPtclID)
                    iPtclID = ResHelper.CreateParticle({
                        resPath: "particles/units/heroes/hero_void_spirit/dissimilate/void_spirit_dissimilate_dmg.vpcf",
                        resNpc: null,
                        iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                        owner: null
                    });

                    ParticleManager.SetParticleControl(iPtclID, 0, vPos)
                    ParticleManager.SetParticleControl(iPtclID, 1, Vector(this.damage_radius / 1.5, 0, this.damage_radius))
                    ParticleManager.ReleaseParticleIndex(iPtclID)
                }

                let iActiveCount = this.GetSpecialValueFor("active_count")
                if (hAbility.ActiveOne) {
                    hAbility.ActiveOne()
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_void_spirit_3_ill// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_void_spirit_3_ill extends BaseModifier_Plus {
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
    GetStatusEffectName() {
        return 'particles/status_fx/void_spirit_1_aether_remnant.vpcf'
    }
    StatusEffectPriority() {
        return 10
    }
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus() as BaseNpc_Plus & { hParent: BaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActivePct: number };
        hParent.IsDummy = true
        hParent.hParent = hCaster
    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
        }
    }
}
