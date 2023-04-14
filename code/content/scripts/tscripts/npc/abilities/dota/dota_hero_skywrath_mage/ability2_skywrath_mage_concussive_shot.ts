
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_skywrath_mage_concussive_shot = { "ID": "5582", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_SkywrathMage.ConcussiveShot.Cast", "HasScepterUpgrade": "1", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityCastRange": "1600", "AbilityCooldown": "15 14 13 12", "AbilityManaCost": "80 85 90 95", "AbilitySpecial": { "10": { "var_type": "FIELD_INTEGER", "creep_damage_pct": "75" }, "01": { "var_type": "FIELD_INTEGER", "launch_radius": "1600" }, "02": { "var_type": "FIELD_INTEGER", "slow_radius": "250" }, "03": { "var_type": "FIELD_INTEGER", "speed": "800 800 800 800" }, "04": { "var_type": "FIELD_INTEGER", "damage": "100 160 220 280" }, "05": { "var_type": "FIELD_FLOAT", "slow_duration": "4.0" }, "06": { "var_type": "FIELD_INTEGER", "movement_speed_pct": "30 35 40 45" }, "07": { "var_type": "FIELD_INTEGER", "shot_vision": "300" }, "08": { "var_type": "FIELD_FLOAT", "vision_duration": "3.34" }, "09": { "var_type": "FIELD_INTEGER", "scepter_radius": "700", "RequiresScepter": "1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_skywrath_mage_concussive_shot extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "skywrath_mage_concussive_shot";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_skywrath_mage_concussive_shot = Data_skywrath_mage_concussive_shot;
    Init() {
        this.SetDefaultSpecialValue("slow_radius", 500);
        this.SetDefaultSpecialValue("speed", 800);
        this.SetDefaultSpecialValue("damage", [1000, 1500, 2000, 2500, 3000, 4000]);
        this.SetDefaultSpecialValue("int_multiplier", [1, 2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("slow_duration", 4);
        this.SetDefaultSpecialValue("movement_speed_pct", [30, 35, 40, 45, 50, 55]);
        this.SetDefaultSpecialValue("resist_debuff", [20, 24, 28, 32, 36, 40]);
        this.SetDefaultSpecialValue("scepter_radius", 700);

    }

    Init_old() {
        this.SetDefaultSpecialValue("slow_radius", 250);
        this.SetDefaultSpecialValue("speed", 800);
        this.SetDefaultSpecialValue("damage", [100, 350, 600, 850, 1100, 1350]);
        this.SetDefaultSpecialValue("int_multiplier", [1, 2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("slow_duration", 4);
        this.SetDefaultSpecialValue("movement_speed_pct", [30, 35, 40, 45, 50, 55]);
        this.SetDefaultSpecialValue("resist_debuff", [20, 24, 28, 32, 36, 40]);
        this.SetDefaultSpecialValue("scepter_radius", 700);

    }


    ConcussiveShot(hTarget: IBaseNpc_Plus, bHasSpecter: boolean) {
        let hCaster = this.GetCasterPlus()
        let speed = this.GetSpecialValueFor("speed")
        let damage = this.GetSpecialValueFor("damage")
        let slow_radius = this.GetSpecialValueFor("slow_radius")
        let int_multiplier = this.GetSpecialValueFor("int_multiplier")
        let tHashtable = HashTableHelper.CreateHashtable()
        tHashtable.hModifier = modifier_skywrath_mage_2_projectile.apply(hCaster, hTarget, this, null)
        let info: CreateTrackingProjectileOptions = {
            Source: hCaster,
            Ability: this,
            EffectName: "",
            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION,
            vSourceLoc: hCaster.GetAbsOrigin(),
            iMoveSpeed: speed,
            Target: hTarget,
            ExtraData: {
                damage: damage + int_multiplier * hCaster.GetIntellect(),
                hashtable_index: tHashtable.__hashuuid__,
                bHasSpecter: bHasSpecter,
            },
        }
        ProjectileManager.CreateTrackingProjectile(info)
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let hCaster = this.GetCasterPlus()
        let slow_radius = this.GetSpecialValueFor("slow_radius")
        let slow_duration = this.GetSpecialValueFor("slow_duration")
        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vLocation, slow_radius, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST)
        for (let hTarget of (tTargets)) {
            let damage_table = {
                ability: this,
                victim: hTarget,
                attacker: hCaster,
                damage: ExtraData.damage,
                damage_type: this.GetAbilityDamageType(),
            }
            BattleHelper.GoApplyDamage(damage_table)
            modifier_skywrath_mage_2_debuff.apply(hTarget, hCaster, this, { duration: slow_duration * hTarget.GetStatusResistanceFactor(hCaster) })
        }

        EmitSoundOnLocationWithCaster(vLocation, ResHelper.GetSoundReplacement("Hero_SkywrathMage.ConcussiveShot.Target", hCaster), hCaster)

        let tHashtable = HashTableHelper.GetHashtableByIndex(ExtraData.hashtable_index || -1)
        if (tHashtable != null && IsValid(tHashtable.hModifier)) {
            tHashtable.hModifier.Destroy()
        }
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        if (!IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        if (!hTarget.TriggerSpellAbsorb(this)) {
            this.ConcussiveShot(hTarget, true)
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_SkywrathMage.ConcussiveShot.Cast", hCaster))
        }
        if (hCaster.HasScepter()) {
            let scepter_radius = this.GetSpecialValueFor("scepter_radius")
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), scepter_radius, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST)
            let extra_count = 1 + hCaster.GetTalentValue("special_bonus_unique_skywrath_mage_custom_7")
            for (let hUnit of (tTargets)) {
                extra_count -= 1;
                if (extra_count < 0) {
                    break
                }
                if (IsValid(hUnit) && hUnit != hTarget) {
                    this.ConcussiveShot(hUnit, false)
                }
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_skywrath_mage_2"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_skywrath_mage_2 extends BaseModifier_Plus {
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
            let ability = this.GetAbilityPlus()
            if (!IsValid(ability)) {
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

            //  优先攻击目标
            let target = caster.GetAttackTarget()
            if (target != null && target.GetClassname() == "dota_item_drop") { target = null }
            if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range)) {
                target = null
            }

            //  搜索范围
            if (target == null) {
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                target = targets[0]
            }

            //  施法命令
            if (target != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_skywrath_mage_2_debuff extends BaseModifier_Plus {
    movement_speed_pct: number;
    resist_debuff: number;
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
    Init(params: IModifierTable) {
        this.movement_speed_pct = this.GetSpecialValueFor("movement_speed_pct")
        this.resist_debuff = this.GetSpecialValueFor("resist_debuff")
        if (params.IsOnCreated && IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_skywrath_mage/skywrath_mage_concussive_shot_slow_debuff.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, true, 10, false, false)
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return -this.movement_speed_pct
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_MAGICAL_DAMAGE_PERCENTAGE)
    G_INCOMING_MAGICAL_DAMAGE_PERCENTAGE() {
        return this.resist_debuff
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip() {
        return this.resist_debuff
    }
}
//  Particle
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_skywrath_mage_2_projectile extends modifier_particle {
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let speed = this.GetSpecialValueFor("speed")
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_skywrath_mage/skywrath_mage_concussive_shot.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(speed, 0, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
}
