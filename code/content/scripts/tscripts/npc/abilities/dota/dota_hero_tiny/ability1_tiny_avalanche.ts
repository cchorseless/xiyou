
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";

/** dota原技能数据 */
export const Data_tiny_avalanche = { "ID": "5106", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "AbilitySound": "Ability.Avalanche", "AbilityCastRange": "600", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityCooldown": "26 22 18 14", "AbilityManaCost": "120 120 120 120", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "325 350 375 400" }, "02": { "var_type": "FIELD_FLOAT", "tick_interval": "0.3" }, "03": { "var_type": "FIELD_FLOAT", "total_duration": "1.4" }, "04": { "var_type": "FIELD_INTEGER", "tick_count": "5" }, "05": { "var_type": "FIELD_FLOAT", "stun_duration": "0.2" }, "06": { "var_type": "FIELD_INTEGER", "projectile_speed": "1200" }, "07": { "var_type": "FIELD_INTEGER", "avalanche_damage": "75 150 225 300", "LinkedSpecialBonus": "special_bonus_unique_tiny" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_tiny_avalanche extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tiny_avalanche";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tiny_avalanche = Data_tiny_avalanche;
    Init() {
        this.SetDefaultSpecialValue("radius", 450);
        this.SetDefaultSpecialValue("tick_interval", 0.3);
        this.SetDefaultSpecialValue("total_duration", 3);
        this.SetDefaultSpecialValue("tick_count", 6);
        this.SetDefaultSpecialValue("stun_duration", 0.2);
        this.SetDefaultSpecialValue("projectile_duration", 0.5);
        this.SetDefaultSpecialValue("avalanche_damage", [600, 1200, 2000, 3000, 4200, 6400]);
        this.SetDefaultSpecialValue("avalanche_damage_per_str", [5, 6, 7, 8, 9, 10]);
        this.SetDefaultSpecialValue("bonus_damage_factor_ptg", 300);

    }

    Init_old() {
        this.SetDefaultSpecialValue("radius", [325, 350, 375, 400, 425, 450]);
        this.SetDefaultSpecialValue("tick_interval", 0.3);
        this.SetDefaultSpecialValue("total_duration", 1.8);
        this.SetDefaultSpecialValue("tick_count", 6);
        this.SetDefaultSpecialValue("stun_duration", 0.2);
        this.SetDefaultSpecialValue("projectile_duration", 0.5);
        this.SetDefaultSpecialValue("avalanche_damage", [300, 400, 800, 1600, 3200, 6400]);
        this.SetDefaultSpecialValue("avalanche_damage_per_str", [1.0, 2.0, 3.0, 4.0, 5.0, 6.0]);

    }


    static tProjParticlePath = [
        "particles/units/heroes/hero_tiny/tiny_avalanche_projectile_lvl1.vpcf",
        "particles/units/heroes/hero_tiny/tiny_avalanche_projectile_lvl2.vpcf",
        "particles/units/heroes/hero_tiny/tiny_avalanche_projectile_lvl3.vpcf",
        "particles/units/heroes/hero_tiny/tiny_avalanche_projectile_lvl4.vpcf",
    ]
    static tParticlePath = [
        "particles/units/heroes/hero_tiny/tiny_avalanche_lvl1.vpcf",
        "particles/units/heroes/hero_tiny/tiny_avalanche_lvl2.vpcf",
        "particles/units/heroes/hero_tiny/tiny_avalanche_lvl3.vpcf",
        "particles/units/heroes/hero_tiny/tiny_avalanche_lvl4.vpcf",
    ]

    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) + hCaster.GetTalentValue("special_bonus_unique_tiny_custom_2")
    }
    GetCastAnimation() {
        return GameActivity_t.ACT_TINY_AVALANCHE
    }
    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnProjectileHitHandle(hTarget: IBaseNpc_Plus, vLocation: Vector, iProjectileHandle: ProjectileID) {
        let hCaster = this.GetCasterPlus() as BaseNpc_Hero_Plus
        let radius = this.GetSpecialValueFor("radius")
        let tick_interval = this.GetSpecialValueFor("tick_interval")
        let stun_duration = this.GetSpecialValueFor("stun_duration")
        let tick_count = this.GetSpecialValueFor("tick_count")
        let avalanche_damage = this.GetSpecialValueFor("avalanche_damage")
        let bonus_damage_factor_ptg = this.GetSpecialValueFor("bonus_damage_factor_ptg") + hCaster.GetTalentValue("special_bonus_unique_tiny_custom_5")
        let avalanche_damage_per_str = this.GetSpecialValueFor("avalanche_damage_per_str") + hCaster.GetTalentValue("special_bonus_unique_tiny_custom_3")
        avalanche_damage = avalanche_damage + avalanche_damage_per_str * hCaster.GetStrength()
        let vDirection = ProjectileManager.GetLinearProjectileVelocity(iProjectileHandle).Normalized()
        let iIndex = math.floor(this.GetLevel() * (ability1_tiny_avalanche.tParticlePath.length / this.GetMaxLevel()))
        let sParticlePath = ability1_tiny_avalanche.tParticlePath[math.max(1, math.min(iIndex, ability1_tiny_avalanche.tParticlePath.length))]
        let iParticleID = ResHelper.CreateParticle({
            resPath: sParticlePath,
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: null
        });

        ParticleManager.SetParticleControl(iParticleID, 0, vLocation)
        ParticleManager.SetParticleControlForward(iParticleID, 0, vDirection)
        ParticleManager.SetParticleControl(iParticleID, 1, Vector(radius, radius, radius))
        let hModifier = modifier_tiny_1.findIn(hCaster)
        if (GameFunc.IsValid(hModifier)) {
            hModifier.AddParticle(iParticleID, false, false, -1, false, false)
        }

        let damageFunc = () => {
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vLocation, radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
            for (let hTarget of (tTargets)) {
                let tDamageTable = {
                    ability: this,
                    victim: hTarget,
                    attacker: hCaster,
                    damage: avalanche_damage / tick_count * /**(modifier_tiny_6_toss.exist(hTarget) && */(1 + bonus_damage_factor_ptg * 0.01) || 1,
                    damage_type: this.GetAbilityDamageType(),
                }
                BattleHelper.GoApplyDamage(tDamageTable)
                modifier_stunned.apply(hTarget, hCaster, this, { duration: stun_duration })
            }
        }

        let count = 1
        damageFunc()
        this.addTimer(tick_interval, () => {
            damageFunc()
            count = count + 1
            if (count < tick_count) {
                return tick_interval
            }
            else {
                ParticleManager.DestroyParticle(iParticleID, false)
            }
        })
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let projectile_duration = this.GetSpecialValueFor("projectile_duration")
        let vStartPosition = hCaster.GetAbsOrigin()
        let vEndPosition = this.GetCursorPosition()

        let iIndex = math.floor(this.GetLevel() * (ability1_tiny_avalanche.tProjParticlePath.length / this.GetMaxLevel()))
        let sParticlePath = ability1_tiny_avalanche.tProjParticlePath[math.max(1, math.min(iIndex, ability1_tiny_avalanche.tProjParticlePath.length))]

        let vDirection = (vEndPosition - vStartPosition) as Vector
        vDirection.z = 0

        let tInfo = {
            Ability: this,
            Source: hCaster,
            EffectName: ResHelper.GetParticleReplacement(sParticlePath, hCaster),
            vSpawnOrigin: vStartPosition,
            vVelocity: (vDirection / projectile_duration) as Vector,
            fDistance: vDirection.Length2D(),
            fExpireTime: GameRules.GetGameTime() + projectile_duration,
        }
        ProjectileManager.CreateLinearProjectile(tInfo)
        EmitSoundOnLocationWithCaster(vEndPosition, ResHelper.GetSoundReplacement("Ability.Avalanche", hCaster), hCaster)
    }

    GetIntrinsicModifierName() {
        return "modifier_tiny_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_tiny_1 extends BaseModifier_Plus {
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

            let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(),
                range,
                caster.GetTeamNumber(),
                radius,
                null,
                DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS,
                FindOrder.FIND_CLOSEST)
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
