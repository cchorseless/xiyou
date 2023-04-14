import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { modifier_obsidian_destroyer_3 } from "./ability3_obsidian_destroyer_equilibrium";

/** dota原技能数据 */
export const Data_obsidian_destroyer_sanity_eclipse = { "ID": "5394", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityCastRange": "700", "AbilityCastPoint": "0.25 0.25 0.25", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "2", "AbilitySound": "Hero_ObsidianDestroyer.SanityEclipse", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilityCooldown": "160 145 130", "AbilityManaCost": "200 325 450", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "base_damage": "200 300 400" }, "02": { "var_type": "FIELD_INTEGER", "radius": "400 500 600" }, "03": { "var_type": "FIELD_INTEGER", "cast_range": "700" }, "04": { "var_type": "FIELD_FLOAT", "damage_multiplier": "0.4", "LinkedSpecialBonus": "special_bonus_unique_outworld_devourer_4" } } };

@registerAbility()
export class ability6_obsidian_destroyer_sanity_eclipse extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "obsidian_destroyer_sanity_eclipse";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_obsidian_destroyer_sanity_eclipse = Data_obsidian_destroyer_sanity_eclipse;
    Init() {
        this.SetDefaultSpecialValue("mana_damage_multiplier", [1, 1.5, 2, 2.5, 3, 4]);
        this.SetDefaultSpecialValue("radius", 575);
        this.SetDefaultSpecialValue("cast_range", 800);
        this.SetDefaultSpecialValue("essence_energy", 4);

    }

    Init_old() {
        this.SetDefaultSpecialValue("mana_damage_multiplier", [1.0, 1.2, 1.4, 1.6, 1.8, 2.0]);
        this.SetDefaultSpecialValue("radius", 575);
        this.SetDefaultSpecialValue("cast_range", 800);
        this.SetDefaultSpecialValue("essence_energy", 4);

    }


    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_obsidian_destroyer_custom_3")
    }
    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus()
        let position = this.GetCursorPosition()
        let radius = this.GetSpecialValueFor("radius")
        // 需要影响星体禁锢中的目标
        //  let hAbility2  = obsidian_destroyer_2.findIn(  caster )
        //  if ( IsValid(hAbility2) && hAbility2.tUnit!=null ) {
        //  	for (let hUnit of ( hAbility2.tUnit )) {

        //  		if (  IsValid(hUnit) &&.IsAlive() && hUnit.IsPositionInRange(position, radius) && hUnit modifier_obsidian_destroyer_2_debuff.exist(  hUnit ) ) {

        //  			 modifier_obsidian_destroyer_2_invulnerable.remove( hUnit );
        //  			this.HitTarget(hUnit)
        //  			 modifier_obsidian_destroyer_2_invulnerable.apply( hUnit , caster, this, null)
        //  		}
        //  	}
        //  }
        let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), position, radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0)
        for (let target of (targets)) {
            this.HitTarget(target)
        }
        modifier_obsidian_destroyer_6_particle.applyThinker(position, caster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }, caster.GetTeamNumber(), false)

        caster.EmitSound("Hero_ObsidianDestroyer.SanityEclipse.Cast")
        EmitSoundOnLocationWithCaster(position, ResHelper.GetSoundReplacement("Hero_ObsidianDestroyer.SanityEclipse", caster), caster)
    }
    HitTarget(target: IBaseNpc_Plus) {
        let caster = this.GetCasterPlus()
        let essence_energy = this.GetSpecialValueFor("essence_energy")
        let mana_damage_multiplier = this.GetSpecialValueFor("mana_damage_multiplier")
        let iCurMaxMana = caster.GetMaxMana()
        let iDamage = iCurMaxMana * mana_damage_multiplier
        let damage_table = {
            ability: this,
            victim: target,
            attacker: caster,
            damage: iDamage,
            damage_type: this.GetAbilityDamageType()
        }
        BattleHelper.GoApplyDamage(damage_table)
        // 每个目标获得4点能量精华
        let hModifier = modifier_obsidian_destroyer_3.findIn(caster) as IBaseModifier_Plus;
        if (IsValid(hModifier)) {
            hModifier.SetStackCount(essence_energy)
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_obsidian_destroyer_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_obsidian_destroyer_6 extends BaseModifier_Plus {
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
            let radius = ability.GetAOERadius()

            let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(), range, caster.GetTeamNumber(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)

            //  施法命令
            if (position && position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        AbilityIndex: ability.entindex(),
                        Position: position
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_obsidian_destroyer_6_particle extends modifier_particle_thinker {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let radius = this.GetSpecialValueFor("radius")
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_sanity_eclipse_area.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(particleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(particleID, 1, Vector(radius, 1, 1))
            ParticleManager.SetParticleControl(particleID, 2, Vector(radius, 1, radius))
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
}
