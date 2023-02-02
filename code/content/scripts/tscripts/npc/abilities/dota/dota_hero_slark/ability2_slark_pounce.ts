
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_slark_pounce = { "ID": "5495", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_Slark.Pounce.Cast", "HasScepterUpgrade": "1", "AbilityCooldown": "20.0 16.0 12.0 8.0", "AbilityManaCost": "75 75 75 75", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "pounce_distance": "700" }, "02": { "var_type": "FIELD_FLOAT", "pounce_speed": "933.33" }, "03": { "var_type": "FIELD_FLOAT", "pounce_acceleration": "7000.0" }, "04": { "var_type": "FIELD_INTEGER", "pounce_radius": "95" }, "05": { "var_type": "FIELD_FLOAT", "leash_duration": "2.5 2.75 3 3.25", "LinkedSpecialBonus": "special_bonus_unique_slark" }, "06": { "var_type": "FIELD_INTEGER", "leash_radius": "400" }, "07": { "var_type": "FIELD_INTEGER", "max_charges": "2", "RequiresScepter": "1" }, "08": { "var_type": "FIELD_INTEGER", "charge_restore_time": "10", "RequiresScepter": "1" }, "09": { "var_type": "FIELD_INTEGER", "pounce_distance_scepter": "1200", "RequiresScepter": "1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_slark_pounce extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "slark_pounce";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_slark_pounce = Data_slark_pounce;
    Init() {
        this.SetDefaultSpecialValue("radius", 700);
        this.SetDefaultSpecialValue("leash_count", 5);
        this.SetDefaultSpecialValue("leash_duration", [2, 3, 4, 5, 6, 7]);
        this.SetDefaultSpecialValue("leash_radius", 700);
        this.SetDefaultSpecialValue("shard_amplify_damage_pct", 60);

    }

    Init_old() {
        this.SetDefaultSpecialValue("scepter_cd_reduce", 4);
        this.SetDefaultSpecialValue("damage", [200, 400, 600, 800, 1000, 1200]);
        this.SetDefaultSpecialValue("radius", 575);
        this.SetDefaultSpecialValue("leash_count", 5);
        this.SetDefaultSpecialValue("leash_duration", [4, 5, 6, 7, 8, 9]);
        this.SetDefaultSpecialValue("leash_radius", 620);

    }


    GetCastRange() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = hCaster.GetAbsOrigin()
        let radius = this.GetSpecialValueFor("radius")
        let leash_duration = this.GetSpecialValueFor("leash_duration")
        let leash_count = this.GetSpecialValueFor("leash_count")

        modifier_slark_2_particle_slark_pounce_start.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Slark.Pounce.Cast", hCaster))
        let iCount = 0
        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vPosition, radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER)
        for (let hTarget of (tTargets)) {
            EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), "Hero_Slark.Pounce.Impact", hCaster)
            modifier_slark_2_leash.apply(hTarget, hCaster, this, { duration: leash_duration * hTarget.GetStatusResistanceFactor(hCaster), position: vPosition })
            BattleHelper.Attack(hCaster, hTarget, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)
            iCount = iCount + 1
            if (iCount >= leash_count) {
                break
            }
        }
        if (tTargets.length > 0) {
            modifier_slark_2_thinker.applyThinker(vPosition, hCaster, this, { duration: leash_duration, position: vPosition }, hCaster.GetTeamNumber(), false)
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_slark_2"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_slark_2 extends BaseModifier_Plus {
    shard_amplify_damage_pct: number;
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }
    Init(params: IModifierTable) {
        this.shard_amplify_damage_pct = this.GetSpecialValueFor("shard_amplify_damage_pct")
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

            let range = ability.GetSpecialValueFor("radius")
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                        AbilityIndex: ability.entindex()
                    }
                )
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)
    EOM_GetModifierOutgoingDamagePercentage(params: ModifierAttackEvent) {
        if (GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasShard() && params != null && modifier_slark_2_leash.exist(params.target)) {
            return this.shard_amplify_damage_pct
        }
        return 0
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_slark_2_leash extends BaseModifier_Plus {
    vPosition: Vector;
    leash_radius: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
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
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.leash_radius = this.GetSpecialValueFor("leash_radius")
        if (IsServer()) {
            this.vPosition = GameFunc.VectorFunctions.StringToVector(params.position)
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_slark/slark_pounce_leash.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 3, this.vPosition)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT)
    GetMoveSpeed_Limit(params: IModifierTable) {
        if (IsServer() && this.vPosition != null) {
            let hParent = this.GetParentPlus()
            let vDirection = (this.vPosition - hParent.GetAbsOrigin()) as Vector
            vDirection.z = 0
            let fToPositionDistance = vDirection.Length2D()
            let vForward = hParent.GetForwardVector()
            let fCosValue = (vDirection.x * vForward.x + vDirection.y * vForward.y) / (vForward.Length2D() * fToPositionDistance)
            let fDistance = this.leash_radius
            if (fToPositionDistance >= fDistance && fCosValue <= 0) {
                return RemapValClamped(fToPositionDistance, 0, fDistance, 550, 0.00001)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_slark_2_thinker extends BaseModifier_Plus {
    leash_radius: number;
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params)
        this.leash_radius = this.GetSpecialValueFor("leash_radius")
        if (IsClient()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_slark/slark_pounce_ground.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 3, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 4, Vector(this.leash_radius, this.leash_radius, this.leash_radius))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    OnDestroy() {
        super.OnDestroy()
        if (IsServer()) {
            this.GetParentPlus().EmitSound(ResHelper.GetSoundReplacement("Hero_Slark.Pounce.End", this.GetCasterPlus()))
            if (GameFunc.IsValid(this.GetParentPlus())) {
                this.GetParentPlus().SafeDestroy()
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_slark_2_particle_slark_pounce_start extends modifier_particle {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_slark/slark_pounce_start.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
