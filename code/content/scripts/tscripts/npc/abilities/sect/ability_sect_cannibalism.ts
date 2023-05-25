
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { EnemyConfig } from "../../../shared/EnemyConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

// 食人魔
@registerAbility()
export class ability_sect_cannibalism extends BaseAbility_Plus {

    OnSpellStart() {
        let caster = this.GetCasterPlus();
        caster.EmitSound("Hero_Clinkz.DeathPact.Cast");
        let pact_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_clinkz/clinkz_death_pact.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
        ParticleManager.SetParticleControl(pact_particle, 1, caster.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(pact_particle);
        modifier_sect_cannibalism_eatenemy.apply(caster, caster, this)
    }


    AutoSpellSelf(): boolean {
        let caster = this.GetCasterPlus();
        if (caster.HasCiTiao(this.GetSectCiTiaoName("a"))) {
            return AI_ability.NO_TARGET_if_enemy(this)
        }
        return false;
    }
}


@registerModifier()
export class modifier_sect_cannibalism_eatenemy extends BaseModifier_Plus {

    public Init(params?: IModifierTable): void {
        if (IsServer()) {
            this.AddTimer(RandomFloat(0.1, 0.5), () => {
                let parent = this.GetParentPlus();
                let t = parent.TempData().sect_cannibalism || { prop_pect: 0, count: 0 };
                let prop_pect = t.prop_pect;
                let count = t.count;
                let enemys = parent.FindUnitsInRadiusPlus(500);
                let hpadd = 0;
                let atkadd = 0;
                for (let npc of enemys) {
                    if (npc.IsAlive() && !npc.IsFriendly(parent) &&
                        npc.TempData().sect_cannibalism_eatfriend == null &&
                        npc.GetUnitLabel() != EnemyConfig.EEnemyUnitType.Tower &&
                        npc.GetUnitLabel() != EnemyConfig.EEnemyUnitType.BOSS
                    ) {
                        npc.TempData().sect_cannibalism_eatfriend = true;
                        hpadd += npc.GetMaxHealth() * prop_pect * 0.01;
                        atkadd += npc.GetBaseDamageMax() * prop_pect * 0.01;
                        npc.EmitSound("Hero_Clinkz.DeathPact");
                        npc.Kill(this.GetAbilityPlus(), this.GetCasterPlus());
                        count--;
                        if (count <= 0) {
                            break;
                        }
                    }
                }
                parent.ModifyMaxHealth(hpadd);
                this.IncrementStackCount(math.floor(atkadd));
            })

        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_BASEATTACK_BONUSDAMAGE() {
        return this.GetStackCount();
    }


}