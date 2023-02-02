
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_viper_nethertoxin = { "ID": "5219", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilityCastPoint": "0.2", "AbilityCastRange": "900", "AbilityCooldown": "14.0", "AbilityManaCost": "85", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "min_damage": "15 20 25 30" }, "02": { "var_type": "FIELD_INTEGER", "max_damage": "80 100 120 140" }, "03": { "var_type": "FIELD_FLOAT", "max_duration": "4" }, "04": { "var_type": "FIELD_INTEGER", "radius": "400" }, "05": { "var_type": "FIELD_FLOAT", "duration": "8" }, "06": { "var_type": "FIELD_INTEGER", "projectile_speed": "2000" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_viper_nethertoxin extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "viper_nethertoxin";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_viper_nethertoxin = Data_viper_nethertoxin;
    Init() {
        this.SetDefaultSpecialValue("damage_sec", [200, 400, 600, 800, 1200, 1600]);
        this.SetDefaultSpecialValue("duration", 8);
        this.SetDefaultSpecialValue("poison_percent", [40, 60, 80, 100, 120, 140]);
        this.SetDefaultSpecialValue("damage_radius", 400);
        this.SetDefaultSpecialValue("shard_incoming_poison_damage_pct", 150);
        this.SetDefaultSpecialValue("poison_stack_pct", 50);

    }

    Init_old() {
        this.SetDefaultSpecialValue("damage_sec", [200, 400, 600, 800, 1200, 1600]);
        this.SetDefaultSpecialValue("duration", 8);
        this.SetDefaultSpecialValue("poison_percent", [40, 60, 80, 100, 120, 140]);
        this.SetDefaultSpecialValue("damage_radius", 400);

    }


    GetAOERadius() {
        return this.GetSpecialValueFor("damage_radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        this.CreateLinearProjectile(vPosition)
        if (hCaster.HasTalent("special_bonus_unique_viper_custom_5")) {
            this.addTimer(
                0.1,
                () => {
                    let tTargets = AoiHelper.FindOneUnitsInRadius(hCaster.GetTeamNumber(),
                        vPosition, this.GetSpecialValueFor("damage_radius"),
                        null,
                        this.GetAbilityTargetTeam(),
                        this.GetAbilityTargetType(),
                        this.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS,
                        FindOrder.FIND_FARTHEST)
                    if (tTargets != null) {
                        vPosition = tTargets.GetAbsOrigin()
                    }
                    this.CreateLinearProjectile(vPosition)
                }
            )
        }
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Viper.Nethertoxin.Cast", hCaster))
    }
    CreateLinearProjectile(vLocation: Vector) {
        let hCaster = this.GetCasterPlus()
        let vCaster = hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_attack1"))
        let vDirection = (vLocation - vCaster) as Vector
        let fDistance = vDirection.Length2D()
        let fSpeed = math.max(2000, fDistance * 2.1)
        vDirection = GameFunc.VectorFunctions.HorizonVector(vDirection)
        ProjectileManager.CreateLinearProjectile(
            {
                Source: hCaster,
                Ability: this,
                vSpawnOrigin: vCaster,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_NONE,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_NONE,
                //  EffectName : ResHelper.GetParticleReplacement("particles/units/heroes/hero_viper/viper_nethertoxin_proj.vpcf", hCaster),
                fDistance: fDistance * 0.96,
                fStartRadius: 0,
                fEndRadius: 0,
                vVelocity: (vDirection * fSpeed) as Vector
            }
        )
        let iParticle = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_viper/viper_nethertoxin_proj.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
            owner: hCaster
        });

        ParticleManager.SetParticleControlEnt(iParticle, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", vCaster, true)
        ParticleManager.SetParticleControl(iParticle, 1, Vector(fSpeed, 0, 0))
        ParticleManager.SetParticleControl(iParticle, 5, vLocation)
        ParticleManager.ReleaseParticleIndex(iParticle)
    }
    OnProjectileHit(hTarget: IBaseNpc_Plus, vLocation: Vector) {
        if (GameFunc.IsValid(hTarget)) {
            return false
        }
        modifier_viper_2_thinker.applyThinker(vLocation, this.GetCasterPlus(), this, { duration: this.GetSpecialValueFor("duration") }, this.GetCasterPlus().GetTeamNumber(), false)
    }
    GetIntrinsicModifierName() {
        return "modifier_viper_2"
    }

}
// // // // // // // // // // // // // // // // // // // -modifier_viper_2// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_viper_2 extends BaseModifier_Plus {
    poison_stack_pct: number;
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
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }
    Init(params: IModifierTable) {
        this.poison_stack_pct = this.GetSpecialValueFor("poison_stack_pct")
    }
    OnIntervalThink() {
        if (!IsServer()) {
            return
        }
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(hAbility)) {
            this.StartIntervalThink(-1)
            this.Destroy()
            return
        }

        let hCaster = hAbility.GetCasterPlus()

        if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
            this.StartIntervalThink(-1)
            return
        }

        if (!hAbility.GetAutoCastState()) {
            return
        }

        if (!hAbility.IsAbilityReady()) {
            return
        }

        let fRange = hAbility.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
        let fRadius = hAbility.GetAOERadius()

        let vPosition = AoiHelper.GetAOEMostTargetsPosition(hCaster.GetAbsOrigin(), fRange, hCaster.GetTeamNumber(), fRadius, null, hAbility.GetAbilityTargetTeam(), hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)

        //  施法命令
        if (vPosition && vPosition != vec3_invalid && hCaster.IsPositionInRange(vPosition, fRange)) {
            ExecuteOrderFromTable(
                {
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: hAbility.entindex(),
                    Position: vPosition
                }
            )
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_POISON_COUNT_PERCENTAGE)
    EOM_GetModifierOutGoingPoisonCountPercentage() {
        if (GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasShard()) {
            return this.poison_stack_pct
        }
        return 0
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_viper_2_thinker// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_viper_2_thinker extends BaseModifier_Plus {
    damage_radius: any;
    IsHidden() {
        return true
    }
    IsDebuff() {
        return true
    }
    IsStunDebuff() {
        return false
    }
    IsAura() {
        return true
    }
    GetModifierAura() {
        return "modifier_viper_2_debuff"
    }
    GetAuraRadius() {
        return this.damage_radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }

    OnCreated(params: IModifierTable) {
        super.OnCreated(params)
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            hParent.EmitSound(ResHelper.GetSoundReplacement("Hero_Viper.NetherToxin", hCaster))
        } else {
            let info: ResHelper.ParticleInfo = {
                resPath: "particles/units/heroes/hero_viper/viper_nethertoxin.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: hParent,
                level: ResHelper.PARTICLE_DETAIL_LEVEL.PARTICLE_DETAIL_LEVEL_MEDIUM
            }
            let iParticle = ResHelper.CreateParticle(info)
            ParticleManager.SetParticleControl(iParticle, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticle, 1, Vector(this.damage_radius, 1, 1))
            this.AddParticle(iParticle, false, false, -1, false, false)
        }
    }
    Init(params: IModifierTable) {
        this.damage_radius = this.GetSpecialValueFor("damage_radius")
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_viper_2_debuff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_viper_2_debuff extends BaseModifier_Plus {
    poison_percent: number;
    damage_sec: any;
    shard_incoming_poison_damage_pct: any;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsStunDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params)
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        if (IsServer()) {
            if (hCaster.HasTalent("special_bonus_unique_viper_custom_4")) {
                modifier_viper_2_talent_root.apply(hParent, hCaster, this.GetAbilityPlus(), { duration: (hCaster.GetTalentValue("special_bonus_unique_viper_custom_4") || 3) * hParent.GetStatusResistanceFactor(hCaster) })
            }
            this.StartIntervalThink(1)
        }
        else {
            let iParticle = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_viper/viper_nethertoxin_debuff.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticle, false, false, -1, false, false)
        }
    }
    Init(params: IModifierTable) {
        this.damage_sec = this.GetSpecialValueFor("damage_sec")
        this.poison_percent = this.GetSpecialValueFor("poison_percent")
        this.shard_incoming_poison_damage_pct = this.GetSpecialValueFor("shard_incoming_poison_damage_pct")

    }

    OnIntervalThink() {
        if (!IsServer()) {
            return
        }
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus() as BaseNpc_Hero_Plus
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hAbility)) {
            this.StartIntervalThink(-1)
            return
        }
        let fDamage = this.damage_sec
        if (hCaster.HasTalent("special_bonus_unique_viper_custom_7") && hCaster.GetAgility) {
            fDamage = fDamage + hCaster.GetAgility() * hCaster.GetTalentValue("special_bonus_unique_viper_custom_7")
        }
        BattleHelper.GoApplyDamage(
            {
                ability: hAbility,
                attacker: hCaster,
                victim: hParent,
                damage: fDamage * 1,
                damage_type: hAbility.GetAbilityDamageType()
            }
        )
        hParent.EmitSound(ResHelper.GetSoundReplacement("Hero_Viper.NetherToxin.Damage", hCaster))
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_POISON_DAMAGE_PERCENTAGE)
    EOM_GetModifierIncomingPoisonDamagePercentage() {
        if (GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasShard()) {
            return this.poison_percent + this.shard_incoming_poison_damage_pct
        }
        return this.poison_percent
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    Tooltip() {
        if (GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasShard()) {
            return this.poison_percent + this.shard_incoming_poison_damage_pct
        }
        return this.poison_percent
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_viper_2_talent_root// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_viper_2_talent_root extends BaseModifier_Plus {
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let info: ResHelper.ParticleInfo = {
                resPath: "particles/particle_sr/viper/viper_2_root.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus(),
            };
            let iParticle = ResHelper.CreateParticle(info)
            this.AddParticle(iParticle, false, false, -1, false, false)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
    }
}
