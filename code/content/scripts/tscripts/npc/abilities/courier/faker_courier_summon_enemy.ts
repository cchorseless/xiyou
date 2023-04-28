
import { AI_ability } from "../../../ai/AI_ability";
import { Assert_SpawnEffect } from "../../../assert/Assert_SpawnEffect";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../entityPlus/Base_Plus";

// 召唤怪物
@registerAbility()
export class faker_courier_summon_enemy extends BaseAbility_Plus {

    GetCooldown() {
        return 3
    }

    GetManaCost() {
        return 0
    }


    CastFilterResult(): UnitFilterResult {
        let caster = this.GetCasterPlus();
        let pect = caster.GetHealthLosePect() + this.GetSpecialValueFor("hp_pect_min");
        if (pect > 100) {
            this.errorStr = "cost hp not enough";
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
        return UnitFilterResult.UF_SUCCESS;
    }

    OnSpellStart() {
        let caster = this.GetCasterPlus();
        let playerid = caster.GetPlayerID()
        let root = GPlayerEntityRoot.GetOneInstance(playerid);
        let round = root.RoundManagerComp().getCurrentBoardRound();
        if (round.IsBattle()) {
            let summon_count_min = this.GetSpecialValueFor("summon_count_min");
            let summon_count_max = this.GetSpecialValueFor("summon_count_max");
            let summon_count = RandomInt(summon_count_min, summon_count_max);
            caster.EmitSound("Hero_ShadowShaman.EtherShock");
            caster.SetHealth(caster.GetHealth() - this.GetHealthCost(1));
            let posarr = round.CreateRoundSummonEnemy(summon_count, Assert_SpawnEffect.Effect.Spawn_fall_2021);
            for (let index = 0; index < posarr.length; index++) {
                let lightningBolt = ResHelper.CreateParticleEx("particles/units/heroes/hero_shadowshaman/shadowshaman_ether_shock.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster)
                ParticleManager.SetParticleControl(lightningBolt, 0, caster.GetAbsOrigin() + Vector(0, 0, 280) as Vector);
                ParticleManager.SetParticleControl(lightningBolt, 1, posarr[index] + Vector(0, 0, 100) as Vector);
                ParticleManager.ReleaseParticleIndex(lightningBolt);
            }
        }
    }
    hpcost = 0;
    GetHealthCost(level: number): number {
        if (this.hpcost == 0) {
            let caster = this.GetCasterPlus();
            this.hpcost = math.floor(this.GetSpecialValueFor("cost_hp_pect") * 0.01 * caster.GetMaxHealth())
        }
        return this.hpcost;
    }
    AutoSpellSelf(): boolean {
        let caster = this.GetCasterPlus();
        let pect = caster.GetHealthLosePect() + this.GetSpecialValueFor("hp_pect_min");
        if (pect > 100) {
            return false;
        }
        return AI_ability.NO_TARGET_cast(this);
    }

}



