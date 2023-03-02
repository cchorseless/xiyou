
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_kill } from "../../../modifier/modifier_kill";
import { ability3_shadow_shaman_shackles, modifier_shadow_shaman_3_hex } from "./ability3_shadow_shaman_shackles";

/** dota原技能数据 */
export const Data_shadow_shaman_ether_shock = { "ID": "5078", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_ShadowShaman.EtherShock", "AbilityCastRange": "600", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "14 12 10 8", "AbilityManaCost": "100 120 140 160", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "start_radius": "200 200 200 200" }, "02": { "var_type": "FIELD_INTEGER", "end_radius": "300 300 300 300" }, "03": { "var_type": "FIELD_INTEGER", "end_distance": "500 500 500 500" }, "04": { "var_type": "FIELD_INTEGER", "targets": "1 3 5 7" }, "05": { "var_type": "FIELD_INTEGER", "damage": "140 200 260 320", "LinkedSpecialBonus": "special_bonus_unique_shadow_shaman_3" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_shadow_shaman_ether_shock extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "shadow_shaman_ether_shock";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_shadow_shaman_ether_shock = Data_shadow_shaman_ether_shock;
    Init() {
        this.SetDefaultSpecialValue("interval", 1.75);
        this.SetDefaultSpecialValue("radius", 600);
        this.SetDefaultSpecialValue("damage", [200, 500, 900, 1400, 2000, 3000]);
        this.SetDefaultSpecialValue("int_factor", 8);
        this.SetDefaultSpecialValue("totem_duration", 12);
        this.SetDefaultSpecialValue("damage_pct", 5);

    }

    Init_old() {
        this.SetDefaultSpecialValue("interval", 3);
        this.SetDefaultSpecialValue("radius", 600);
        this.SetDefaultSpecialValue("damage", [200, 500, 900, 1400, 2000, 3000]);
        this.SetDefaultSpecialValue("int_factor", 4);
        this.SetDefaultSpecialValue("totem_duration", 12);
        this.SetDefaultSpecialValue("damage_pct", 5);

    }

    vLastPosition: Vector;

    Precache(context: any) {
        PrecacheUnitByNameSync("npc_dota_shadow_shaman_totem_ether_shock", context, -1)
    }
    GetAOERadius() {
        return this.GetSpecialValueFor("radius") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_shadow_shaman_custom_1")
    }
    GetCooldown(iLevel: number) {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_unique_shadow_shaman_custom_2")
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vLocation = this.GetCursorPosition()
        let totem_duration = this.GetSpecialValueFor("totem_duration")
        let hHero = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID())
        //  图腾
        let hTotem = CreateUnitByName("npc_dota_shadow_shaman_totem_ether_shock", vLocation, false, hHero, hHero, hCaster.GetTeamNumber())
        modifier_shadow_shaman_1_totem.apply(hTotem, hCaster, this, { duration: totem_duration })
        modifier_kill.apply(hTotem, hCaster, this, { duration: totem_duration })
        // hTotem.FireSummonned(hCaster)
        let hAbility = ability3_shadow_shaman_shackles.findIn(hCaster) as ability3_shadow_shaman_shackles;
        if (GFuncEntity.IsValid(hAbility) && hAbility.FireTotem != null) {
            hAbility.FireTotem(hTotem)
        }
        //  记录上一次释放的位置
        this.vLastPosition = vLocation
    }
    EtherShockScepter(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let hAbility_4 = ability3_shadow_shaman_shackles.findIn(hCaster);
        for (let tInfo of hAbility_4.tTotems["ether_shock"]) {
            this.EtherShock(hTarget, tInfo.hHandle)
        }
    }
    EtherShock(hTarget: IBaseNpc_Plus, hSource: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let int_factor = hCaster.HasTalent("special_bonus_unique_shadow_shaman_custom_4") && hCaster.GetTalentValue("special_bonus_unique_shadow_shaman_custom_4") + this.GetSpecialValueFor("int_factor") || this.GetSpecialValueFor("int_factor")
        let damage = this.GetSpecialValueFor("damage") + int_factor * hCaster.GetIntellect()
        //  particle
        let particleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_shadowshaman/shadowshaman_ether_shock.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: null
        });

        if (GFuncEntity.IsValid(hSource)) {
            ParticleManager.SetParticleControlEnt(particleID, 0, hSource, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", hSource.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlForward(particleID, 10, ((hTarget.GetAbsOrigin() - hSource.GetAbsOrigin()) as Vector).Normalized())
        }
        ParticleManager.SetParticleControlEnt(particleID, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(particleID, 11, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
        ParticleManager.ReleaseParticleIndex(particleID)
        //  sound
        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_ShadowShaman.EtherShock.Target", hCaster), hCaster)
        //  damage
        let tDamageTable = {
            ability: this,
            attacker: hCaster,
            victim: hTarget,
            damage: damage,
            damage_type: this.GetAbilityDamageType()
        }
        if (modifier_shadow_shaman_3_hex.exist(tDamageTable.victim) && hCaster.HasShard()) {
            tDamageTable.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PURE
        }
        BattleHelper.GoApplyDamage(tDamageTable)
    }

    GetIntrinsicModifierName() {
        return "modifier_shadow_shaman_1"
    }

    OnStolen(hSourceAbility: ability1_shadow_shaman_ether_shock) {
        this.vLastPosition = hSourceAbility.vLastPosition
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_shadow_shaman_1 extends BaseModifier_Plus {
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

        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus() as ability1_shadow_shaman_ether_shock
            if (!GFuncEntity.IsValid(ability)) {
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
            let teamFilter = ability.GetAbilityTargetTeam()
            let typeFilter = ability.GetAbilityTargetType()
            let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS;
            let order = FindOrder.FIND_CLOSEST
            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()
            if (ability.vLastPosition != null && caster.IsPositionInRange(ability.vLastPosition, range)) {
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), ability.vLastPosition, radius, null, teamFilter, typeFilter, flagFilter, order)
                //  施法命令
                if (targets.length > 0) {
                    ExecuteOrderFromTable({
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        Position: ability.vLastPosition,
                        AbilityIndex: ability.entindex(),
                    })
                }
            } else {
                let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(),
                    range,
                    caster.GetTeamNumber(),
                    radius,
                    null,
                    teamFilter,
                    typeFilter,
                    flagFilter,
                    order)

                //  施法命令
                if (position && position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                    ExecuteOrderFromTable({
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        AbilityIndex: ability.entindex(),
                        Position: position,
                    })
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_shadow_shaman_1_totem extends BaseModifier_Plus {
    interval: number;
    radius: number;
    damage: number;
    int_factor: number;
    damage_pct: number;
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT
    }
    BeCreated(params: IModifierTable) {

        let extra_interval = this.GetCasterPlus().GetTalentValue("special_bonus_unique_shadow_shaman_custom_6")
        this.interval = this.GetSpecialValueFor("interval") - extra_interval
        let extra_radius = this.GetCasterPlus().GetTalentValue("special_bonus_unique_shadow_shaman_custom_1")
        this.radius = this.GetSpecialValueFor("radius") + extra_radius
        this.damage = this.GetSpecialValueFor("damage")
        let extra_int_factor = this.GetCasterPlus().GetTalentValue("special_bonus_unique_shadow_shaman_custom_4")
        this.int_factor = this.GetSpecialValueFor("int_factor") + extra_int_factor
        this.damage_pct = this.GetSpecialValueFor("damage_pct")
        if (IsServer()) {
            this.StartIntervalThink(this.interval)
            this.OnIntervalThink()
        }
    }

    BeDestroy() {

        if (IsServer()) {
            if (GFuncEntity.IsValid(this.GetCasterPlus())) {
                let hAblt = ability3_shadow_shaman_shackles.findIn(this.GetCasterPlus());
                if (GFuncEntity.IsValid(hAblt) && hAblt.RemoveTotem != null) {
                    hAblt.RemoveTotem(this.GetParentPlus())
                }
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            if (!GFuncEntity.IsValid(hCaster) || !hCaster.GetIntellect) {
                hParent.ForceKill(false)
                this.Destroy()
                this.StartIntervalThink(-1)
                return
            }
            let tDamageTable: BattleHelper.DamageOptions = {
                victim: null,
                ability: this.GetAbilityPlus(),
                attacker: hCaster,
                damage: (this.damage + this.int_factor * hCaster.GetIntellect()) * (1 + this.GetStackCount() * this.damage_pct * 0.01),
                damage_type: this.GetAbilityPlus().GetAbilityDamageType()
            }
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), this.radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)
            for (let hUnit of (tTargets)) {
                //  particle
                let particleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_shadowshaman/shadowshaman_ether_shock.vpcf",
                    resNpc: hCaster,
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                    owner: null
                });

                ParticleManager.SetParticleControlEnt(particleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
                ParticleManager.SetParticleControlEnt(particleID, 1, hUnit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hUnit.GetAbsOrigin(), true)
                ParticleManager.SetParticleControlForward(particleID, 10, ((hUnit.GetAbsOrigin() - hParent.GetAbsOrigin()) as Vector).Normalized())
                ParticleManager.SetParticleControlEnt(particleID, 11, hUnit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hUnit.GetAbsOrigin(), true)
                ParticleManager.ReleaseParticleIndex(particleID)
                //  sound
                EmitSoundOnLocationWithCaster(hUnit.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_ShadowShaman.EtherShock.Target", hCaster), hCaster)
                //  damage
                tDamageTable.victim = hUnit
                if (modifier_shadow_shaman_3_hex.exist(tDamageTable.victim) && hCaster.HasShard()) {
                    tDamageTable.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PURE
                }
                BattleHelper.GoApplyDamage(tDamageTable)
            }
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_ShadowShaman.EtherShock", hCaster))
            let hAbility_4 = ability3_shadow_shaman_shackles.findIn(hCaster) as ability3_shadow_shaman_shackles;
            if (this.GetCasterPlus().HasScepter() && hAbility_4.tTotems["ward"].length > 0) {
                this.IncrementStackCount()
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true
        }
    }

}
