import { AI_ability } from "../../../ai/AI_ability";
import { EBATTLE_ATTACK_STATE } from "../../../rules/System/BattleSystemComponent";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

@registerAbility()
export class kingkong_3 extends BaseAbility_Plus {
    OnAbilityPhaseStart() {
        this.GetCasterPlus().ApplyTenacity(this, this.GetCasterPlus(), 10);
        return true
    }
    OnAbilityPhaseInterrupted() {
        this.GetCasterPlus().RemoveTenacityed();
    }
    OnSpellStart() {
        this.GetCasterPlus().RemoveTenacityed();
        //  测试
        this.Summon()
    }
    Summon() {
        let hCaster = this.GetCasterPlus()
        //  hCaster.ForcePlayActivityOnce(GameActivity_t.ACT_DOTA_CAST_ABILITY_4)
        let angle = this.GetSpecialValueFor("angle")
        let distance = this.GetSpecialValueFor("distance")
        let boss_health_pct = this.GetSpecialValueFor("boss_health_pct")
        let vDirection = -hCaster.GetForwardVector() as Vector;
        let tPosition: Vector[] = [
            hCaster.GetAbsOrigin() + GFuncVector.Rotation2D(vDirection, math.rad(angle)) * distance as Vector,
            hCaster.GetAbsOrigin() + GFuncVector.Rotation2D(vDirection, math.rad(-angle)) * distance as Vector,
        ]

        let tUnitName = ["kingkong_beasts_boar", "kingkong_telepathy_beast"];
        let tModifier = ["modifier_kingkong_3_1", "modifier_kingkong_3_2"];

        let iPlayerCount = GPlayerEntityRoot.GetAllValidPlayer().length;
        if (iPlayerCount > 2) {
            tPosition = [
                hCaster.GetAbsOrigin() + GFuncVector.Rotation2D(vDirection, math.rad(angle)) * distance as Vector,
                hCaster.GetAbsOrigin() + GFuncVector.Rotation2D(vDirection, math.rad(angle + 180)) * distance as Vector,
                hCaster.GetAbsOrigin() + GFuncVector.Rotation2D(vDirection, math.rad(-angle)) * distance as Vector,
                hCaster.GetAbsOrigin() + GFuncVector.Rotation2D(vDirection, math.rad(-angle + 180)) * distance as Vector,
            ];
            tUnitName = ["kingkong_beasts_boar", "kingkong_telepathy_beast", "kingkong_beasts_boar", "kingkong_telepathy_beast"];
            tModifier = ["modifier_kingkong_3_1", "modifier_kingkong_3_2", "modifier_kingkong_3_1", "modifier_kingkong_3_2"];
        }
        //  
        let tUnit: IBaseNpc_Plus[] = []
        for (let i = 0; i < tUnitName.length; i++) {
            const sUnitName = tUnitName[i];
            let hUnit = hCaster.CreateSummon(sUnitName, tPosition[i], 40, false)
            hUnit.SetControllableByPlayer(hCaster.GetPlayerOwnerID(), true)
            hUnit.AddNewModifier(hCaster, this, tModifier[i], null)
            FindClearSpaceForUnit(hUnit, hUnit.GetAbsOrigin(), true)
            hUnit.SetBaseMaxHealth(hCaster.GetMaxHealth() * boss_health_pct * 0.01)
            hUnit.SetMaxHealth(hUnit.GetBaseMaxHealth())
            hUnit.SetHealth(hUnit.GetBaseMaxHealth())
            tUnit.push(hUnit)
        }
        return tUnit
    }

    AutoSpellSelf(): boolean {
        let trigger_pct = this.GetSpecialValueFor("trigger_pct")
        let hCaster = this.GetCasterPlus();
        if (100 - hCaster.GetHealthLosePect() <= trigger_pct) {
            hCaster.Purge(false, true, false, true, true)
            return AI_ability.NO_TARGET_cast(this)
        }
        return false
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_kingkong_3_1 extends BaseModifier_Plus {
    BeCreated(params: IModifierTable) {
        if (IsClient()) {
            let iParticleID = ParticleManager.CreateParticle("particles/units/heroes/hero_beastmaster/beastmaster_call_boar.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus())
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK,)
    CC_OnAttack(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.PassivesDisabled() && !GBattleSystem.AttackFilter(params.record, EBATTLE_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)) {
            let tTargets = FindUnitsInRadius(params.attacker.GetTeamNumber(), params.attacker.GetAbsOrigin(), null, 900, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false)
            let attack_split = this.GetSpecialValueFor('attack_split') - 1
            for (let hUnit of (tTargets)) {
                let iAttackState = EBATTLE_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB + EBATTLE_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS + EBATTLE_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + EBATTLE_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + EBATTLE_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + EBATTLE_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + EBATTLE_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING
                params.attacker.Attack(hUnit, iAttackState)
                attack_split = attack_split - 1
                if (attack_split <= 0) {
                    break
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -

@registerModifier()
export class modifier_kingkong_3_2 extends BaseModifier_Plus {
    interval: number;
    heal_amount_pct: number;
    BeCreated(params: IModifierTable) {
        this.interval = this.GetSpecialValueFor("interval")
        this.heal_amount_pct = this.GetSpecialValueFor("heal_amount_pct")
        if (IsServer()) {
            this.StartIntervalThink(this.interval)
        } else {
            let iParticleID = ParticleManager.CreateParticle("particles/units/heroes/hero_beastmaster/beastmaster_call_bird.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus())
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    OnIntervalThink() {
        let hParent = this.GetParentPlus()
        let tTargets = FindUnitsInRadius(hParent.GetTeamNumber(), hParent.GetAbsOrigin(), null, -1, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false)
        tTargets.sort((a, b) => { return a.GetHealth() - b.GetHealth() })
        if (IsValid(tTargets[0])) {
            tTargets[0].Heal(this.heal_amount_pct * tTargets[0].GetMaxHealth() * 0.01, this.GetAbilityPlus())
            //  SendOverheadEventMessage(hParent.GetPlayerOwner(), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, tTargets[0], this.heal_amount, hParent.GetPlayerOwner())
        }
    }
}