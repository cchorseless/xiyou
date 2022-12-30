import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { modifier_obsidian_destroyer_3 } from "./ability3_obsidian_destroyer_equilibrium";

/** dota原技能数据 */
export const Data_obsidian_destroyer_astral_imprisonment = { "ID": "5392", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY | DOTA_UNIT_TARGET_TEAM_FRIENDLY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_NOT_MAGIC_IMMUNE_ALLIES", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySound": "Hero_ObsidianDestroyer.AstralImprisonment", "HasScepterUpgrade": "1", "AbilityCooldown": "24 20 16 12", "AbilityCastRange": "650", "AbilityCastPoint": "0.3", "AbilityManaCost": "150", "AbilityModifierSupportValue": "0.5", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "prison_duration": "1.75 2.5 3.25 4" }, "02": { "var_type": "FIELD_INTEGER", "damage": "120 200 280 360", "LinkedSpecialBonus": "special_bonus_unique_outworld_devourer_3" }, "03": { "var_type": "FIELD_INTEGER", "max_charges_scepter": "2", "RequiresScepter": "1" }, "04": { "var_type": "FIELD_INTEGER", "charge_restore_time_scepter": "12", "RequiresScepter": "1" }, "05": { "var_type": "FIELD_INTEGER", "scepter_range_bonus": "0", "RequiresScepter": "1" }, "06": { "var_type": "FIELD_INTEGER", "mana_capacity_steal": "16 18 20 22" }, "07": { "var_type": "FIELD_FLOAT", "mana_capacity_duration": "30 40 50 60" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_obsidian_destroyer_astral_imprisonment extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "obsidian_destroyer_astral_imprisonment";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_obsidian_destroyer_astral_imprisonment = Data_obsidian_destroyer_astral_imprisonment;
    Init() {
        this.SetDefaultSpecialValue("prison_duration", 4);
        this.SetDefaultSpecialValue("damage", [200, 500, 800, 1200, 1600, 2000]);
        this.SetDefaultSpecialValue("radius", 400);
        this.SetDefaultSpecialValue("bonus_max_mana_damage_percent", [50, 65, 80, 100, 120, 150]);
        this.SetDefaultSpecialValue("essence_energy", 3);
        this.SetDefaultSpecialValue("scepter_count", 1);

    }

    Init_old() {
        this.SetDefaultSpecialValue("prison_duration", 4);
        this.SetDefaultSpecialValue("damage", [200, 500, 800, 1200, 1600, 2000]);
        this.SetDefaultSpecialValue("radius", 400);
        this.SetDefaultSpecialValue("bonus_max_mana_damage_percent", [20, 30, 40, 50, 60, 70]);
        this.SetDefaultSpecialValue("essence_energy", 3);
        this.SetDefaultSpecialValue("scepter_count", 1);

    }



    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        let fRange = this.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        if (hTarget.TriggerSpellAbsorb(this)) {
            return
        }
        //  if ( this.tUnit==null ) {
        //  	this.tUnit={}
        //  }
        //  for (let i = this.tUnit.length- 1; i >= 0; i--) {
        //  	let hUnit = this.tUnit[i]
        //  	if (! modifier_obsidian_destroyer_2_debuff.exist(  GameFunc.IsValid(hUnit) || !hUnit.IsAlive() || !hUnit ) ) {
        //  		ArrayRemove(this.tUnit,hUnit)
        //  	}
        //  }
        this.ImprisonmentTarget(hTarget)
        // 神杖效果，星体影响单位+1
        if (hCaster.HasScepter()) {
            let targets = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, fRange, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST, false)
            for (let unit of (targets)) {

                if (GameFunc.IsValid(unit) && unit.IsAlive() && unit != hTarget) {
                    this.ImprisonmentTarget(unit)
                    break
                }
            }
        }
    }
    ImprisonmentTarget(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        let prison_duration = this.GetSpecialValueFor("prison_duration")
        let damage = this.GetSpecialValueFor("damage")
        let radius = this.GetSpecialValueFor("radius")
        let essence_energy = this.GetSpecialValueFor("essence_energy") + hCaster.GetTalentValue("special_bonus_unique_obsidian_destroyer_custom_2")
        let bonus_max_mana_damage_percent = this.GetSpecialValueFor("bonus_max_mana_damage_percent")
        // 如果是肉山或者宝箱，不会禁锢直接炸
        //  if ( hTarget.IsRoshan() || hTarget.IsGoldWave() || hTarget.IsPhantomRoshan() ) {
        //  	hTarget.EmitSound("Hero_ObsidianDestroyer.AstralImprisonment.End")
        //  	// 对周围400范围内的单位照成伤害
        //  	// 特效
        //  	 modifier_obsidian_destroyer_2_particle.apply( hCaster , hTarget, this, {duration= BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION})
        //  	let iCurMaxMana = hCaster.GetMaxMana()
        //  	let iDamage = damage+iCurMaxMana*bonus_max_mana_damage_percent*0.01
        //  	let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO+DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false)
        //  	for (let hTarget of ( tTarget )) {

        //  		if ( GameFunc.IsValid(hTarget) && hTarget.IsAlive() ) {
        //  			let damage_table = {
        //  				ability : this,
        //  				victim : hTarget,
        //  				attacker : hCaster,
        //  				damage : iDamage,
        //  				damage_type : this.GetAbilityDamageType(),
        //  				}
        //  			BattleHelper.GoApplyDamage(damage_table)
        //  		}
        //  	}
        //  } else {
        // 每个星体禁锢目标提供3点精华能量
        let hModifier = modifier_obsidian_destroyer_3.findIn(hCaster) as IBaseModifier_Plus;
        if (GameFunc.IsValid(hModifier)) {
            hModifier.SetStackCount(essence_energy)
        }
        modifier_obsidian_destroyer_2_debuff.remove(hTarget);
        modifier_obsidian_destroyer_2_debuff.apply(hTarget, hCaster, this, { duration: prison_duration * hTarget.GetStatusResistanceFactor(hCaster) })

        //  table.insert( this.tUnit,hTarget )
        //  }
    }

    GetIntrinsicModifierName() {
        return "modifier_obsidian_destroyer_2"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_obsidian_destroyer_2 extends BaseModifier_Plus {
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
// 星体禁锢
// Modifiers
@registerModifier()
export class modifier_obsidian_destroyer_2_debuff extends BaseModifier_Plus {
    radius: number;
    bonus_max_mana_damage_percent: number;
    damage: number;
    sSoundName: string;
    IsHidden() {
        return true
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
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(hCaster)) {
            this.Destroy()
            return
        }
        this.radius = this.GetSpecialValueFor("radius")
        this.damage = this.GetSpecialValueFor("damage")
        this.bonus_max_mana_damage_percent = this.GetSpecialValueFor("bonus_max_mana_damage_percent")
        if (IsServer()) {
            this.sSoundName = ResHelper.GetSoundReplacement("Hero_ObsidianDestroyer.AstralImprisonment", hCaster)
            hParent.EmitSound(this.sSoundName)
            // 被禁锢的怪物不会计入场上怪物数量
            //  let iPlayerID = hCaster.GetPlayerOwnerID()
            //  Spawner.TempRmv(hParent, iPlayerID)
            //  this.GetParentPlus().AddNoDraw()
            //  this.modifier_no_health_bar	 =  modifier_no_health_bar.apply(  hParent , hCaster, hAbility, null)
            //   modifier_obsidian_destroyer_2_invulnerable.apply( hParent , hCaster, hAbility, null)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_prison_start.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_prison.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.GetDuration(), 0, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_prison_ring.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: ModifierTable) {
        this.radius = this.GetSpecialValueFor("radius")
        this.damage = this.GetSpecialValueFor("damage")
        this.bonus_max_mana_damage_percent = this.GetSpecialValueFor("bonus_max_mana_damage_percent")
    }
    OnDestroy() {
        super.OnDestroy();
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            hParent.StopSound(this.sSoundName)
            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive()) {
                return
            }
            //   modifier_obsidian_destroyer_2_invulnerable.remove( hParent );
            //  if ( GameFunc.IsValid(this.modifier_no_health_bar) ) {
            //  	this.modifier_no_health_bar.Destroy()
            //  }
            EmitSoundOnLocationWithCaster(hParent.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_ObsidianDestroyer.AstralImprisonment.End", hCaster), hCaster)
            // 对周围400范围内的单位照成伤害
            // 特效
            modifier_obsidian_destroyer_2_particle.apply(hCaster, hParent, this.GetAbilityPlus(), { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

            let iMaxMana = hCaster.GetMaxMana()
            let iDamage = this.damage + iMaxMana * this.bonus_max_mana_damage_percent * 0.01
            let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), null, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false)
            for (let hTarget of (tTarget)) {

                if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
                    let damage_table = {
                        ability: hAbility,
                        victim: hTarget,
                        attacker: hCaster,
                        damage: iDamage,
                        damage_type: hAbility.GetAbilityDamageType(),
                    }
                    BattleHelper.GoApplyDamage(damage_table)
                }
            }
            //  if ( GameFunc.IsValid(hParent) && hParent.IsAlive() ) {
            //  let iPlayerID = hCaster.GetPlayerOwnerID()
            //  Spawner.TempRmvRec(hParent,iPlayerID)
            //  hParent.RemoveNoDraw()
            //  }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            //  [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR] = true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_FROZEN]: true,
            //  [modifierstate.MODIFIER_STATE_UNSELECTABLE] = true,
            //  [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP] = true,
            //  [modifierstate.MODIFIER_STATE_OUT_OF_GAME] = true,
            //  [modifierstate.MODIFIER_STATE_INVULNERABLE] = true,
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    GetInvisibilityLevel() {
        return 0.99
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_obsidian_destroyer_2_invulnerable extends BaseModifier_Plus {
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
    }


    CheckState() {
        return {
            //  [modifierstate.MODIFIER_STATE_INVULNERABLE] = true,
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_obsidian_destroyer_2_particle extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetParentPlus()
        let hParent = this.GetCasterPlus()
        let hAbility = this.GetAbilityPlus()
        let radius = this.GetSpecialValueFor("radius")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_prison_end_dmg.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(radius, radius, radius))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
