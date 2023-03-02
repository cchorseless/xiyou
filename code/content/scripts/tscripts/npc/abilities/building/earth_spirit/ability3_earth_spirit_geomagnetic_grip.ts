import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_earth_spirit_geomagnetic_grip = { "ID": "5610", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_FRIENDLY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_CREEP", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_INVULNERABLE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_EarthSpirit.GeomagneticGrip.Target", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastRange": "1100", "AbilityCastPoint": "0.01", "AbilityCooldown": "13", "AbilityManaCost": "100", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "180" }, "02": { "var_type": "FIELD_INTEGER", "rock_damage": "50 100 150 200" }, "03": { "var_type": "FIELD_FLOAT", "duration": "2 2.5 3 3.5", "LinkedSpecialBonus": "special_bonus_unique_earth_spirit_5" }, "04": { "var_type": "FIELD_FLOAT", "pull_units_per_second_heroes": "600" }, "05": { "var_type": "FIELD_FLOAT", "pull_units_per_second": "900" }, "06": { "var_type": "FIELD_INTEGER", "speed": "800" }, "07": { "var_type": "FIELD_FLOAT", "total_pull_distance": "1400" } } };

@registerAbility()
export class ability3_earth_spirit_geomagnetic_grip extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "earth_spirit_geomagnetic_grip";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_earth_spirit_geomagnetic_grip = Data_earth_spirit_geomagnetic_grip;
    Init() {
        this.SetDefaultSpecialValue("max_count", [1, 2, 3, 4, 5]);
        this.SetDefaultSpecialValue("stone_interval", [4, 3.5, 3, 2.5, 2]);
        this.SetDefaultSpecialValue("scepter_cd_reduce", 1);
        this.SetDefaultSpecialValue("scepter_max_count_add", 1);
        this.OnInit();
    }



    iMaxCount: any;


    GetCooldown(iLevel: number) {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetLevelSpecialValueFor("scepter_cd", iLevel)
        }
    }
    OnInit() {
        GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
            let hCaster = this.GetCasterPlus()
            let hChargeCounter = modifier_earth_spirit_3.findIn(hCaster)
            if (GFuncEntity.IsValid(hChargeCounter)) {
                hChargeCounter.ForceRefresh()
                let iMaxCount = hChargeCounter.GetMaxCount()
                if (this.iMaxCount != null && iMaxCount > this.iMaxCount) {
                    if (hChargeCounter.GetStackCount() == this.iMaxCount) {
                        let charge_restore_time = hChargeCounter.stone_interval
                        hChargeCounter.SetDuration(charge_restore_time, true)
                        hChargeCounter.StartIntervalThink(charge_restore_time)
                    }
                }
                this.iMaxCount = iMaxCount
            }
            return 1
        }))
    }
    // GetIntrinsicModifierName() {
    //     return "modifier_earth_spirit_3"
    // }

}
// // // // // // // // // // // // // // // // // // // -modifier_earth_spirit_3// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earth_spirit_3 extends BaseModifier_Plus {
    initialized: boolean;
    vStonePos: Vector;
    stone_interval: number;
    talent_max_count_add: number;
    scepter_max_count_add: number;
    max_count: number;
    tStones: any[];
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
    DestroyOnExpire() {
        return false
    }
    Init_old() {
        if (IsServer()) {
            if (!this.initialized && this.GetAbilityPlus().GetLevel() != 0) {
                this.initialized = true

                this.SetStackCount(this.GetMaxCount())
            }
        }
    }
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        this.max_count = this.GetSpecialValueFor("max_count")
        this.scepter_max_count_add = this.GetSpecialValueFor("scepter_max_count_add")
        this.talent_max_count_add = hCaster.GetTalentValue("special_bonus_unique_earth_spirit_custom_1")
        this.stone_interval = this.GetSpecialValueFor("stone_interval")
        if (IsServer()) {
            this.tStones = []
            this.vStonePos = RandomVector(128)
            this.Init()
        }
    }
    BeRefresh(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        this.max_count = this.GetSpecialValueFor("max_count")
        this.scepter_max_count_add = this.GetSpecialValueFor("scepter_max_count_add")
        this.talent_max_count_add = hCaster.GetTalentValue("special_bonus_unique_earth_spirit_custom_1")
        this.stone_interval = this.GetSpecialValueFor("stone_interval")
        if (IsServer()) {
            this.Init()
        }

    }
    BeDestroy() {

        if (IsServer()) {
            let hParent = this.GetParentPlus()
            //  移除所有的stone
            if (this.tStones && this.tStones.length > 0) {
                for (let i = this.tStones.length - 1; i >= 0; i--) {
                    let hStone = this.tStones[i]
                    UTIL_Remove(hStone)
                    table.remove(this.tStones, i)
                }
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let iMaxCount = this.GetMaxCount()
            if (this.GetStackCount() < iMaxCount) {
                this.IncrementStackCount()
            }
            if (this.GetStackCount() >= iMaxCount) {
                this.SetDuration(-1, true)
                this.StartIntervalThink(-1)
            } else {
                let charge_restore_time = this.stone_interval
                this.SetDuration(charge_restore_time, true)
                this.StartIntervalThink(charge_restore_time)
            }
        }
    }
    GetMaxCount() {
        let hCaster = this.GetCasterPlus()
        let iMaxCount = this.max_count
        if (hCaster.HasScepter()) {
            iMaxCount = iMaxCount + this.scepter_max_count_add
        }
        if (hCaster.HasTalent("special_bonus_unique_earth_spirit_custom_1")) {
            iMaxCount = iMaxCount + this.talent_max_count_add
        }
        return iMaxCount
    }
    OnStackCountChanged(iStackCount: number) {
        if (!IsServer()) {
            return
        }

        let hAbility = this.GetAbilityPlus()
        if (!GFuncEntity.IsValid(hAbility)) {
            this.Destroy()
            return
        }

        let hParent = this.GetParentPlus()
        let iNewStackCount = this.GetStackCount()
        for (let i = math.max(iNewStackCount, this.tStones.length) - 1; i >= 0; i--) {
            let hStone = this.tStones[i]
            if (i > iNewStackCount) {
                if (GFuncEntity.IsValid(hStone)) {
                    UTIL_Remove(hStone)
                    table.remove(this.tStones, i)
                }
            } else {
                if (!GFuncEntity.IsValid(hStone)) {
                    let hStone = modifier_earth_spirit_3_stone.applyThinker(GetGroundPosition((hParent.GetAbsOrigin() + this.vStonePos) as Vector, hParent), hParent, hAbility, null, hParent.GetTeamNumber(), false)
                    hStone.SetForwardVector(hParent.GetForwardVector())
                    table.insert(this.tStones, hStone)
                }
            }
        }
    }
    GetStoneNoUse() {
        return this.tStones[0]
    }

    GetStone() {
        let hStone = table.remove(this.tStones, 1)

        if (this.GetStackCount() == this.GetMaxCount()) {
            let charge_restore_time = this.stone_interval
            this.SetDuration(charge_restore_time, true)
            this.StartIntervalThink(charge_restore_time)
        }
        this.DecrementStackCount()

        return hStone
    }
    UseStone() {
        if (this.tStones.length > 0) {//  没有指定石头，就移除最远的石头
            let hStone = this.GetStone()
            UTIL_Remove(hStone)
            return true
        }

        return false
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TELEPORTED)
    teleported(params: IModifierTable) {
        if (IsServer() && params.unit == this.GetParentPlus()) {
            let origin = this.GetParentPlus().GetAbsOrigin()
            for (let hStone of (this.tStones)) {
                if (!hStone.bUsing) {
                    hStone.SetAbsOrigin(origin + this.vStonePos)
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_earth_spirit_3_cd// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earth_spirit_3_cd extends BaseModifier_Plus {
    stone_interval: number;
    IsHidden() {
        return false
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
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            this.stone_interval = this.GetSpecialValueFor("stone_interval")
            if (this.GetCasterPlus().HasScepter()) {
                this.stone_interval = this.stone_interval - this.GetSpecialValueFor("scepter_cd_reduce")
            }
            this.SetDuration(this.stone_interval, true)
        }
    }
    BeDestroy() {

        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()

            if (GFuncEntity.IsValid(hAbility)) {
                modifier_earth_spirit_3.apply(hParent, hParent, hAbility, { increase_count: 1 })
            }
        }
    }
}

// // // // // // // // // // // // // // // // // // // -modifier_earth_spirit_3_stone// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earth_spirit_3_stone extends BaseModifier_Plus {
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
    BeCreated(params: IModifierTable) {

        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        if (IsServer()) {
            hParent.EmitSound(ResHelper.GetSoundReplacement("Hero_EarthSpirit.StoneRemnant.Impact", hCaster))
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_earth_spirit/espirit_stoneremnant.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), false)
            ParticleManager.SetParticleControl(iParticleID, 1, hParent.GetAbsOrigin())
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_FROZEN]: true,
        }
    }
}
