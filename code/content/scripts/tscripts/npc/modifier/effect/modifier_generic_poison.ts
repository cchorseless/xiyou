import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

/**中毒BUFF */
@registerModifier()
export class modifier_generic_poison extends BaseModifier_Plus {
    GetTexture() {
        return "poison_main"
    }
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
    tPoisonerInfos: { poisoner: IBaseNpc_Plus, ability: IBaseAbility_Plus, stack_count: number }[];
    iParticleID: ParticleID;
    BeCreated(params: IModifierTable) {
        this.iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_venomancer/venomancer_gale_poison_debuff.vpcf",
            resNpc: this.GetParentPlus(),
            level: ResHelper.PARTICLE_DETAIL_LEVEL.PARTICLE_DETAIL_LEVEL_MEDIUM,
            iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
            owner: this.GetParentPlus()
        })
        this.AddParticle(this.iParticleID, false, false, -1, false, false);
        if (IsServer()) {
            let damageInterval = GPropertyConfig.POISON_DAMAGE_INTERVAL * (1 + GPropertyCalculate.GetPoisonActiveTimePercent(this.GetParentPlus()) * 0.01);
            this.AddTimer(damageInterval, () => {
                this.ActivePoisonInterval();
                damageInterval = GPropertyConfig.POISON_DAMAGE_INTERVAL * (1 + GPropertyCalculate.GetPoisonActiveTimePercent(this.GetParentPlus()) * 0.01);
                return damageInterval;
            })
        }
    }

    public BeDestroy(): void {
        this.tPoisonerInfos = null;
    }
    AddPoison(hAbility: IBaseAbility_Plus, hCaster: IBaseNpc_Plus, iCount: number, duration?: number) {
        if (IsServer()) {
            this.tPoisonerInfos = this.tPoisonerInfos || [];
            let info = {
                poisoner: hCaster,
                ability: hAbility,
                stack_count: iCount
            }
            this.tPoisonerInfos.push(info);
            this.ChangeStackCount(iCount);
            GTimerHelper.AddTimer(duration || GPropertyConfig.POISON_DURATION,
                GHandler.create(this, () => {
                    this.ChangeStackCount(-iCount);
                    this.tPoisonerInfos && this.tPoisonerInfos.splice(this.tPoisonerInfos.indexOf(info), 1);
                }))

        }
    }
    ActivePoisonInterval() {
        if (IsServer()) {
            let hParent = this.GetParentPlus();
            if (!hParent.IsAlive() || hParent.IsMagicImmune()) {
                return
            }
            let iTotalDamge = 0
            let lastPoisoner = this.GetParentPlus() // 实在不行的情况下，只能自己打自己
            let _incom = GPropertyCalculate.SumProps(hParent, null, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_POISON_COUNT_PERCENTAGE);
            let fPercent = 1 + _incom / 100 || 1
            for (let tPoisonInfo of this.tPoisonerInfos) {
                // 根据毒来源造成伤害
                let this_poisoner = tPoisonInfo.poisoner
                // 如果这个单位已经不存在了，就用上个单位来造成伤害
                if (IsValid(this_poisoner) && this_poisoner.IsAlive()) {
                    lastPoisoner = this_poisoner
                } else {
                    this_poisoner = lastPoisoner
                }
                let iDamage = tPoisonInfo.stack_count * fPercent
                iTotalDamge = iTotalDamge + iDamage;
                ApplyDamage({
                    ability: tPoisonInfo.ability,
                    attacker: this_poisoner,
                    victim: hParent,
                    damage: iDamage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                    extra_flags: GEBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_POISON + GEBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_DOT + GEBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_NO_SPELL_CRIT,
                })
            }
            //  头顶绿色数字
            if (iTotalDamge > 0) {
                SendOverheadEventMessage(null, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_POISON_DAMAGE, hParent, iTotalDamge, hParent.GetPlayerOwner())
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    OnShowTooltip() {
        return this.GetStackCount()
    }
    /**
     * 激发毒伤害，造成当前毒层数xfPercent的毒伤害
     * @param htarget
     * @param hCaster
     * @param hAbility
     * @param fPercent
     */
    PoisonActive(fPercent: number, hAbility: IBaseAbility_Plus, hCaster: IBaseNpc_Plus,) {
        if (!IsServer()) return;
        let parent = this.GetParentPlus()
        if (!parent.IsAlive() || parent.IsMagicImmune()) {
            return
        }
        let iDamage = fPercent * parent.GetPoisonStackCount();
        if (iDamage > 0) {
            let _incom = GPropertyCalculate.SumProps(parent, null, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_POISON_DAMAGE_PERCENTAGE);
            let fPoisonPercent = (1 + _incom * 0.01) || 1;
            iDamage = iDamage * fPoisonPercent
            ApplyDamage({
                ability: hAbility,
                attacker: hCaster,
                victim: parent,
                damage: iDamage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                extra_flags: GEBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_POISON +
                    GEBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_DOT +
                    GEBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_NO_SPELL_CRIT,
            })
            SendOverheadEventMessage(null, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_POISON_DAMAGE, parent, iDamage, parent.GetPlayerOwner())
        }
    }

}

declare global {
    type Imodifier_generic_poison = modifier_generic_poison;
}