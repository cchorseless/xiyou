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

/** dota原技能数据 */
export const Data_spectre_spectral_dagger = { "ID": "5334", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "FightRecapLevel": "1", "AbilitySound": "Hero_Spectre.DaggerCast", "AbilityCastRange": "1800", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "22 20 18 16", "AbilityManaCost": "130 140 150 160", "AbilityModifierSupportValue": "0.0", "AbilitySpecial": { "10": { "var_type": "FIELD_INTEGER", "vision_radius": "200" }, "11": { "var_type": "FIELD_INTEGER", "speed": "800" }, "12": { "var_type": "FIELD_FLOAT", "dagger_grace_period": "1.0" }, "01": { "var_type": "FIELD_INTEGER", "damage": "75 130 185 240" }, "02": { "var_type": "FIELD_INTEGER", "bonus_movespeed": "10 14 18 22", "LinkedSpecialBonus": "special_bonus_unique_spectre_3" }, "03": { "var_type": "FIELD_FLOAT", "dagger_path_duration": "12.0 12.0 12.0 12.0" }, "04": { "var_type": "FIELD_FLOAT", "hero_path_duration": "7.0 7.0 7.0 7.0" }, "05": { "var_type": "FIELD_FLOAT", "buff_persistence": "4.0 4.0 4.0 4.0" }, "08": { "var_type": "FIELD_INTEGER", "dagger_radius": "125 125 125 125" }, "09": { "var_type": "FIELD_INTEGER", "path_radius": "175 175 175 175" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_spectre_spectral_dagger extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "spectre_spectral_dagger";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_spectre_spectral_dagger = Data_spectre_spectral_dagger;
    Init() {
        this.SetDefaultSpecialValue("health_damage_percent", [40, 50, 60, 70, 80, 90]);
        this.SetDefaultSpecialValue("dagger_path_duration", 7);
        this.SetDefaultSpecialValue("dagger_radius", 125);
        this.SetDefaultSpecialValue("path_radius", 125);
        this.SetDefaultSpecialValue("reduce_movespeed", [20, 22, 24, 26, 28, 30]);
        this.SetDefaultSpecialValue("speed", 1200);
        this.SetDefaultSpecialValue("distance", 2000);
        this.SetDefaultSpecialValue("duration", 7);
        this.SetDefaultSpecialValue("attack_speed", 200);

    }

    Init_old() {
        this.SetDefaultSpecialValue("health_damage_percent", [40, 50, 60, 70, 80, 90]);
        this.SetDefaultSpecialValue("dagger_path_duration", 7);
        this.SetDefaultSpecialValue("dagger_radius", 125);
        this.SetDefaultSpecialValue("path_radius", 125);
        this.SetDefaultSpecialValue("reduce_movespeed", [20, 22, 24, 26, 28, 30]);
        this.SetDefaultSpecialValue("speed", 1200);
        this.SetDefaultSpecialValue("distance", 2000);
        this.SetDefaultSpecialValue("duration", 7);
        this.SetDefaultSpecialValue("attack_speed", 200);

    }



    OnSpellStart() {
        let tHashtable = HashTableHelper.CreateHashtable()
        tHashtable.hCaster = this.GetCasterPlus()
        tHashtable.health_damage_percent = this.GetSpecialValueFor("health_damage_percent") + tHashtable.hCaster.GetTalentValue("special_bonus_unique_spectre_custom_6")
        tHashtable.dagger_path_duration = this.GetSpecialValueFor("dagger_path_duration")
        tHashtable.dagger_radius = this.GetSpecialValueFor("dagger_radius")
        tHashtable.path_radius = this.GetSpecialValueFor("path_radius")
        tHashtable.speed = this.GetSpecialValueFor("speed")

        tHashtable.fDistance = this.GetCastRange(this.GetCursorPosition(), this.GetCursorTarget()) + tHashtable.hCaster.GetCastRangeBonus()
        tHashtable.vStartPosition = tHashtable.hCaster.GetAbsOrigin()

        tHashtable.hCaster.EmitSound("Hero_Spectre.DaggerCast")
        tHashtable.tTargets = []
        tHashtable.tAuraPositions = []
        tHashtable.tAuraPositionsTime = []
        tHashtable.hAura = modifier_spectre_1_path_thinker_aura.applyThinker(tHashtable.vStartPosition, tHashtable.hCaster, this, { hashtable_index: HashTableHelper.GetHashtableIndex(tHashtable) }, tHashtable.hCaster.GetTeamNumber(), false)
        this.AddShadow(tHashtable, tHashtable.vStartPosition, tHashtable.dagger_path_duration)

        if (this.GetCursorTarget() != null) {
            let tInfo = {
                Ability: this,
                EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_spectre/spectre_spectral_dagger_tracking.vpcf", tHashtable.hCaster),
                vSourceLoc: tHashtable.vStartPosition,
                iMoveSpeed: tHashtable.speed,
                Target: this.GetCursorTarget(),
                Source: tHashtable.hCaster,
                bDodgeable: false,
                bProvidesVision: true,
                ExtraData: {
                    hashtable_index: HashTableHelper.GetHashtableIndex(tHashtable),
                }
            }
            ProjectileManager.CreateTrackingProjectile(tInfo)
        } else {
            let vDirection = (this.GetCursorPosition() - tHashtable.vStartPosition) as Vector
            vDirection.z = 0

            let tInfo = {
                Ability: this,
                EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_spectre/spectre_spectral_dagger.vpcf", tHashtable.hCaster),
                vSpawnOrigin: tHashtable.vStartPosition,
                vVelocity: (vDirection.Normalized() * tHashtable.speed) as Vector,
                fDistance: tHashtable.fDistance,
                Source: tHashtable.hCaster,
                bProvidesVision: true,
                ExtraData: {
                    hashtable_index: HashTableHelper.GetHashtableIndex(tHashtable),
                }
            }
            ProjectileManager.CreateLinearProjectile(tInfo)
        }
    }
    OnProjectileHit_ExtraData(hTarget: BaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let tHashtable = HashTableHelper.GetHashtableByIndex(ExtraData.hashtable_index)

        return false
    }
    OnProjectileThink_ExtraData(vLocation: Vector, ExtraData: any) {
        let tHashtable = HashTableHelper.GetHashtableByIndex(ExtraData.hashtable_index)
        this.AddShadow(tHashtable, vLocation, tHashtable.dagger_path_duration)
        let tTargets = FindUnitsInRadius(tHashtable.hCaster.GetTeamNumber(), vLocation, null, tHashtable.dagger_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false)
        for (let hTarget of (tTargets as BaseNpc_Plus[])) {
            if (GameFunc.IsValid(hTarget) && hTarget != tHashtable.hCaster && tHashtable.tTargets.indexOf(hTarget) == null) {
                if (hTarget.IsConsideredHero()) {
                    modifier_spectre_1_path_debuff.apply(hTarget, tHashtable.hCaster, this, { duration: tHashtable.dagger_path_duration * hTarget.GetStatusResistanceFactor(tHashtable.hCaster), hashtable_index: ExtraData.hashtable_index })
                }
                let fDamage = tHashtable.hCaster.GetHealth() * tHashtable.health_damage_percent * 0.01
                let damage_table = {
                    ability: this,
                    attacker: tHashtable.hCaster,
                    victim: hTarget,
                    damage: fDamage,
                    damage_type: this.GetAbilityDamageType()
                }
                BattleHelper.GoApplyDamage(damage_table)

                EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), "Hero_Spectre.DaggerImpact", tHashtable.hCaster)

                table.insert(tHashtable.tTargets, hTarget)
            }
        }
    }
    AddShadow(tHashtable: any, vLocation: Vector, duration: number) {
        let fTime = GameRules.GetGameTime() + duration
        let bUpdate = false
        for (let i = tHashtable.tAuraPositions.length - 1; i >= 0; i--) {
            if (tHashtable.tAuraPositions[i] == vLocation) {
                tHashtable.tAuraPositionsTime[i] = fTime
                bUpdate = true
            }
        }
        if (!bUpdate) {
            table.insert(tHashtable.tAuraPositions, vLocation)
            table.insert(tHashtable.tAuraPositionsTime, fTime)
        }
        if (tHashtable.timer_str == null) {
            tHashtable.timer_str = DoUniqueString("spectre_1")
            this.SetContextThink(tHashtable.timer_str, () => {
                let fTime = GameRules.GetGameTime()
                for (let i = tHashtable.tAuraPositions.length - 1; i >= 0; i--) {
                    if (fTime > tHashtable.tAuraPositionsTime[i]) {
                        table.remove(tHashtable.tAuraPositions, i)
                        table.remove(tHashtable.tAuraPositionsTime, i)
                    }
                }
                if (tHashtable.tAuraPositions.length == 0) {
                    undefined
                    HashTableHelper.RemoveHashtable(tHashtable)
                    return null
                }
                return 0
            }, 0)
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_spectre_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_spectre_1 extends BaseModifier_Plus {
    bonus_damage: number;
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
    Init(params: ModifierTable) {
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage")
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
            let start_width = ability.GetSpecialValueFor("dagger_radius")
            let end_width = ability.GetSpecialValueFor("dagger_radius")

            let position = AoiHelper.GetLinearMostTargetsPosition(caster.GetAbsOrigin(), range, caster.GetTeamNumber(), start_width, end_width, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST)

            if (position && position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position
                })
            }
        }
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_spectre_1_path_thinker_aura extends BaseModifier_Plus {
    tHashtable: any;
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE + DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE + DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT
    }
    IsAura() {
        return true
    }
    GetAuraEntityReject(hEntity: BaseNpc_Plus) {
        if (GameFunc.IsValid(this.GetCasterPlus())) {
            for (let vPosition of (this.tHashtable.tAuraPositions)) {
                if (hEntity.IsPositionInRange(vPosition, this.tHashtable.path_radius)) {
                    if (UnitFilter(hEntity, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                        modifier_spectre_1_debuff.apply(hEntity, this.GetCasterPlus(), this.GetAbilityPlus(), { duration: this.GetSpecialValueFor("duration") * hEntity.GetStatusResistanceFactor(this.GetCasterPlus()) })
                    }
                    return false
                }
            }
        }
        return false
    }
    GetAuraRadius() {
        return -1
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.tHashtable = HashTableHelper.GetHashtableByIndex(params.hashtable_index)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            UTIL_Remove(this.GetParentPlus())
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_spectre_1_path_debuff extends BaseModifier_Plus {
    tHashtable: any;
    vPosition: Vector;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.tHashtable = HashTableHelper.GetHashtableByIndex(params.hashtable_index);
            (this.GetAbilityPlus() as ability1_spectre_spectral_dagger).AddShadow(this.tHashtable, this.GetParentPlus().GetAbsOrigin(), this.tHashtable.dagger_path_duration)
            this.vPosition = this.GetParentPlus().GetAbsOrigin()

            this.StartIntervalThink(0)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_spectre/spectre_shadow_path_owner.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hAbility = this.GetAbilityPlus() as ability1_spectre_spectral_dagger
            if (!GameFunc.IsValid(hAbility)) {
                this.Destroy()
                return
            }
            if (((this.GetParentPlus().GetAbsOrigin() - this.vPosition) as Vector).Length2D() > this.tHashtable.speed / 30) {
                if (hAbility.AddShadow != null) {
                    hAbility.AddShadow(this.tHashtable, this.GetParentPlus().GetAbsOrigin(), this.tHashtable.dagger_path_duration)
                    this.vPosition = this.GetParentPlus().GetAbsOrigin()
                }
            }
        }
    }
    Destroy() {
        if (IsServer()) {
            this.StartIntervalThink(-1)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_PROVIDES_VISION]: true,
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_spectre_1_debuff extends BaseModifier_Plus {
    reduce_movespeed: number;
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
    Init_old() {
        this.reduce_movespeed = this.GetSpecialValueFor("reduce_movespeed")
    }

    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_PURE_DAMAGE_PERCENTAGE)
    g_INCOMING_PURE_DAMAGE_PERCENTAGE() {
        return this.GetCasterPlus().GetTalentValue("special_bonus_unique_spectre_custom_7")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return -this.reduce_movespeed
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    On_AttackStart(params: ModifierAttackEvent) {
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hCaster) && (params.attacker as BaseNpc_Plus).GetSource() == hCaster) {
            modifier_spectre_1_attack_speed.apply(params.attacker, params.attacker, this.GetAbilityPlus(), null)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_spectre_1_attack_speed extends BaseModifier_Plus {
    attack_speed: number;
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
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.attack_speed = this.GetSpecialValueFor("attack_speed") + hCaster.GetTalentValue("special_bonus_unique_spectre_custom_4")
    }


    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: ModifierTable) {
        return this.attack_speed
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.attacker == this.GetParentPlus()) {
            this.Destroy()
        }
    }
}
