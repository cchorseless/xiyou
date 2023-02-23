import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_shredder_whirling_death = { "ID": "5524", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitDamageType": "DAMAGE_TYPE_PURE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_Shredder.WhirlingDeath.Cast", "AbilityCastRange": "300", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityCooldown": "6", "AbilityManaCost": "80", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "whirling_radius": "325" }, "02": { "var_type": "FIELD_INTEGER", "whirling_damage": "80 120 160 200" }, "03": { "var_type": "FIELD_INTEGER", "tree_damage_scale": "12 18 24 30" }, "04": { "var_type": "FIELD_FLOAT", "whirling_tick": "0.3" }, "05": { "var_type": "FIELD_INTEGER", "stat_loss_pct": "13 14 15 16", "LinkedSpecialBonus": "special_bonus_unique_timbersaw" }, "06": { "var_type": "FIELD_FLOAT", "duration": "12 13 14 15" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_shredder_whirling_death extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "shredder_whirling_death";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_shredder_whirling_death = Data_shredder_whirling_death;
    Init() {
        this.SetDefaultSpecialValue("whirling_radius", 700);
        this.SetDefaultSpecialValue("whirling_damage", [400, 600, 800, 1000, 1200, 2400]);
        this.SetDefaultSpecialValue("unit_damage_scale", [120, 160, 200, 240, 320, 480]);
        this.SetDefaultSpecialValue("health_loss_pct", 15);
        this.SetDefaultSpecialValue("duration", 4);

    }

    Init_old() {
        this.SetDefaultSpecialValue("whirling_radius", 700);
        this.SetDefaultSpecialValue("whirling_damage", [400, 600, 800, 1000, 1200, 2400]);
        this.SetDefaultSpecialValue("unit_damage_scale", [120, 160, 200, 240, 320, 480]);
        this.SetDefaultSpecialValue("health_loss_pct", 15);
        this.SetDefaultSpecialValue("duration", 4);

    }



    // [[	particles/units/heroes/hero_shredder/shredder_whirling_death.vpcf
    // 	particles/status_fx/status_effect_shredder_whirl.vpcf
    // particles / units / heroes / hero_shredder / shredder_whirling_death_debuff.vpcf
    // ]]
    //
    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        let fCooldownReduction = hCaster.GetTalentValue("special_bonus_unique_shredder_custom_3")
        return super.GetCooldown(iLevel) - fCooldownReduction
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let whirling_radius = this.GetSpecialValueFor("whirling_radius")
        let whirling_damage = this.GetSpecialValueFor("whirling_damage")
        let unit_damage_scale = this.GetSpecialValueFor("unit_damage_scale")
        let duration = this.GetSpecialValueFor("duration")

        modifier_shredder_1_particle_start.applyThinker(hCaster.GetAbsOrigin(), hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }, hCaster.GetTeamNumber(), false)

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Shredder.WhirlingDeath.Cast", hCaster))

        //  hCaster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1)
        let tAllTargets = [] as IBaseNpc_Plus[][]

        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), whirling_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
        table.insert(tAllTargets, tTargets)

        //  let shredder_3  = shredder_3.findIn(  hCaster )
        //  if ( GameFunc.IsValid(shredder_3) ) {
        //  	for _, iHashtableIndex in pairs(shredder_3.tHashtableIndexes || {}) do
        //  		let tHashtable = GetHashtableByIndex(iHashtableIndex)
        //  		if ( tHashtable.vChakramPosition ) {
        //  			let vPosition = GetGroundPosition(tHashtable.vChakramPosition, hCaster) + Vector(0, 0, 75)

        //			modifier_shredder_1_particle_start.applyThinker(vPosition,hCaster, this,  {
        //  				duration =  BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION,
        //  				flag = 1,
        //  			},  hCaster.GetTeamNumber(), false)

        //  			EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Hero_Shredder.WhirlingDeath.Cast", hCaster), hCaster)

        //  			let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vPosition, whirling_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
        //  			table.insert(tAllTargets, tTargets)
        //  		}
        //  	}
        //  }

        //  let shredder_3_scepter  = shredder_3_scepter.findIn(  hCaster )
        //  if ( GameFunc.IsValid(shredder_3_scepter) ) {
        //  	for _, iHashtableIndex in pairs(shredder_3_scepter.tHashtableIndexes || {}) do
        //  		let tHashtable = GetHashtableByIndex(iHashtableIndex)
        //  		if ( tHashtable.vChakramPosition ) {
        //  			let vPosition = GetGroundPosition(tHashtable.vChakramPosition, hCaster) + Vector(0, 0, 75)

        // 			modifier_shredder_1_particle_start.applyThinker(vPosition,hCaster, this,  {
        //  				duration =  BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION,
        //  				flag = 1,
        //  			},  hCaster.GetTeamNumber(), false)

        //  			EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Hero_Shredder.WhirlingDeath.Cast", hCaster), hCaster)

        //  			let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vPosition, whirling_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
        //  			table.insert(tAllTargets, tTargets)
        //  		}
        //  	}
        //  }

        for (let tTargets of (tAllTargets)) {

            let fDamage = whirling_damage + tTargets.length * unit_damage_scale
            for (let hTarget of (tTargets)) {
                if (!hTarget.IsAncient()) {
                    modifier_shredder_1_debuff.apply(hTarget, hCaster, this, { duration: duration * hTarget.GetStatusResistanceFactor(hCaster) })
                }
                let tDamageTable = {
                    victim: hTarget,
                    attacker: hCaster,
                    damage: fDamage,
                    damage_type: this.GetAbilityDamageType(),
                    ability: this,
                }
                BattleHelper.GoApplyDamage(tDamageTable)
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_shredder_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
//  Modifiers
@registerModifier()
export class modifier_shredder_1 extends BaseModifier_Plus {
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

            let range = ability.GetSpecialValueFor("whirling_radius")
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_shredder_1_debuff extends BaseModifier_Plus {
    health_loss_pct: number;
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_shredder_custom_8"
        this.health_loss_pct = this.GetSpecialValueFor("health_loss_pct") + hCaster.GetTalentValue(sTalentName)
        if (IsClient()) {
            let iPtclID = ResHelper.CreateParticle({
                resPath: 'particles/status_fx/status_effect_shredder_whirl.vpcf',
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iPtclID, false, true, 10, false, false)
            iPtclID = ResHelper.CreateParticle({
                resPath: 'particles/units/heroes/hero_shredder/shredder_whirling_death_debuff.vpcf',
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iPtclID, false, false, -1, false, this.ShouldUseOverheadOffset())
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_PERCENT_ENEMY)
    G_HEALTH_PERCENT_ENEMY() {
        return -this.health_loss_pct
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return -this.health_loss_pct
    }
}

// 特效
@registerModifier()
export class modifier_shredder_1_particle_start extends modifier_particle_thinker {
    BeCreated(params: IModifierTable) {

        let whirling_radius = this.GetSpecialValueFor("whirling_radius")
        if (IsServer()) {
            if (params.flag) {
                this.SetStackCount(params.flag)
            }
        } else {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let EffectName = ResHelper.GetParticleReplacement("particles/units/heroes/hero_shredder/shredder_whirling_death.vpcf", hCaster)
            let iParticleID = ResHelper.CreateParticle({
                resPath: EffectName,
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });


            if (1 == this.GetStackCount()) {
                ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
                ParticleManager.SetParticleControl(iParticleID, 1, hParent.GetAbsOrigin())
            } else {
                ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
                ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            }
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(whirling_radius, whirling_radius, whirling_radius))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
