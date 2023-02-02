import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { ability6_keeper_of_the_light_spirit_form } from "./ability6_keeper_of_the_light_spirit_form";

/** dota原技能数据 */
export const Data_keeper_of_the_light_radiant_bind = { "ID": "532", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_KeeperOfTheLight.ManaLeak.Cast", "AbilityCastPoint": "0.2", "AbilityCooldown": "23 20 17 14", "AbilityManaCost": "60 80 100 120", "AbilityCastRange": "700 750 800 850", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "7" }, "02": { "var_type": "FIELD_FLOAT", "slow": "4 5.5 7 8.5" }, "03": { "var_type": "FIELD_INTEGER", "magic_resistance": "15 20 25 30" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_keeper_of_the_light_radiant_bind extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "keeper_of_the_light_radiant_bind";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_keeper_of_the_light_radiant_bind = Data_keeper_of_the_light_radiant_bind;
    Init() {
        this.SetDefaultSpecialValue("damage_per_second", [100, 250, 400, 600, 800, 1000]);
        this.SetDefaultSpecialValue("mana_leak_pct", [0.5, 1.0, 2.0, 3.0, 4.0, 5.0]);
        this.SetDefaultSpecialValue("duration", 12);
        this.SetDefaultSpecialValue("radius", 500);
        this.SetDefaultSpecialValue("day_time_pct", 2);
        this.SetDefaultSpecialValue("max_stun", 3);

    }

    vLastPosition: Vector;


    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vStartPosition = hCaster.GetAbsOrigin()
        let vPosition = this.GetCursorPosition()
        let duration = this.GetSpecialValueFor("duration")

        let hThinker = modifier_keeper_of_the_light_2_thinker.applyThinker(vPosition, hCaster, this, { duration: duration }, hCaster.GetTeamNumber(), false)
        hThinker.EmitSound(ResHelper.GetSoundReplacement("Hero_KeeperOfTheLight.BlindingLight", hCaster))

        let hAbility = ability6_keeper_of_the_light_spirit_form.findIn(hCaster)
        let hModifier = modifier_keeper_of_the_light_2_thinker.findIn(hThinker)
        if (GameFunc.IsValid(hAbility) && GameFunc.IsValid(hModifier)) {
            // hAbility.SaveModifier(hModifier)
        }

        //  记录上一次释放的位置
        this.vLastPosition = vPosition
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_keeper_of_the_light_2"
    // }

    OnStolen(hSourceAbility: this) {
        this.vLastPosition = hSourceAbility.vLastPosition
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_keeper_of_the_light_2 extends BaseModifier_Plus {
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
            let ability = this.GetAbilityPlus() as ability2_keeper_of_the_light_radiant_bind
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

            let teamFilter = ability.GetAbilityTargetTeam()
            let typeFilter = ability.GetAbilityTargetType()
            let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
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
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_keeper_of_the_light_2_thinker extends modifier_particle_thinker {
    damage_per_second: number;
    radius: number;
    day_time_pct: number;
    IsAura() {
        return true
    }
    GetAuraRadius() {
        return this.radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
    }
    GetAura() {
        return "modifier_special_bonus_unique_keeper_of_the_light_custom_1_buff"
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        this.damage_per_second = this.GetSpecialValueFor("damage_per_second")
        this.radius = this.GetSpecialValueFor("radius")
        this.day_time_pct = this.GetSpecialValueFor("day_time_pct")
        if (IsServer()) {
            this.SetStackCount(1)
            this.StartIntervalThink(1)
            this.OnIntervalThink()
        } else {
            let radius = this.GetSpecialValueFor("radius")
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_blinding_light_area.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.radius, this.radius, this.radius))
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(1, 0, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hCaster)) {
            let hAbility = ability6_keeper_of_the_light_spirit_form.findIn(hCaster)
            // if (GameFunc.IsValid(hAbility) && hAbility.RemoveModifier != null) {
            //     hAbility.RemoveModifier(this)
            // }
            UTIL_Remove(this.GetParentPlus())
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hAbility)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }
            let hModifier = hCaster.FindModifierByName(hAbility.GetIntrinsicModifierName());
            let extra_damage = GameFunc.IsValid(hModifier as IBaseModifier_Plus) && hModifier.GetStackCount() || 0
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), this.radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
            for (let hUnit of (tTargets)) {
                let tDamageTable = {
                    ability: hAbility,
                    victim: hUnit,
                    attacker: hCaster,
                    damage: (this.damage_per_second + extra_damage) * this.GetStackCount(),
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                }
                BattleHelper.GoApplyDamage(tDamageTable)
            }
            // let bDayTime = (Environment.IsBloodmoon() || (Environment.IsDaytime() && !modifier_night_stalker_3_night.exist(hCaster)))
            // let day_time_pct = bDayTime && this.day_time_pct || 1
            // this.SetStackCount(this.GetStackCount() + day_time_pct)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_special_bonus_unique_keeper_of_the_light_custom_1_buff extends BaseModifier_Plus {
    mana_leak_pct: number;
    movespeed: any;
    max_stun: number;
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let extra_mana_leak_pct = this.GetCasterPlus().HasTalent("special_bonus_unique_keeper_of_the_light_custom_6") && this.GetCasterPlus().GetTalentValue("special_bonus_unique_keeper_of_the_light_custom_6") || 0
        this.mana_leak_pct = this.GetSpecialValueFor("mana_leak_pct") + extra_mana_leak_pct
        this.max_stun = this.GetSpecialValueFor("max_stun")
        this.movespeed = this.GetCasterPlus().HasTalent("special_bonus_unique_keeper_of_the_light_custom_1") && this.GetCasterPlus().GetTalentValue("special_bonus_unique_keeper_of_the_light_custom_1") || 0
        if (IsServer()) {
            this.StartIntervalThink(1)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let flStunDuration = math.min((100 - this.GetParentPlus().GetManaPercent()) * 0.01 * this.max_stun, this.max_stun)
            modifier_stunned.apply(this.GetParentPlus(), this.GetCasterPlus(), this.GetAbilityPlus(), { duration: flStunDuration * this.GetParentPlus().GetStatusResistanceFactor(this.GetCasterPlus()) })
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            this.GetParentPlus().SpendMana(this.mana_leak_pct * this.GetParentPlus().GetMaxMana() * 0.01, this.GetAbilityPlus())
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return -this.movespeed
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    tooltip() {
        return this.mana_leak_pct * this.GetParentPlus().GetMaxMana() * 0.01
    }
}
