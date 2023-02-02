import { GameFunc } from "../../../GameFunc";
import { BattleHelper } from "../../../helper/BattleHelper";
import { HashTableHelper } from "../../../helper/HashTableHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_property } from "../../propertystat/modifier_property";

/**中毒BUFF */
@registerModifier()
export class modifier_poison extends BaseModifier_Plus {
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params)
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_venomancer/venomancer_gale_poison_debuff.vpcf",
                resNpc: this.GetParentPlus(),
                level: ResHelper.PARTICLE_DETAIL_LEVEL.PARTICLE_DETAIL_LEVEL_MEDIUM,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            })
            this.AddParticle(iParticleID, false, false, -1, false, false);
        }
    }

    Init(params: IModifierTable) {
        if (IsServer()) {
            this.tPoisonerInfos = this.tPoisonerInfos || [];
            let tPoisonInfo = HashTableHelper.GetHashtableByIndex(params.hashtableUUid) as any;
            if (tPoisonInfo != null) {
                GTimerHelper.AddTimer(params.duration || modifier_poison.POISON_DURATION, GHandler.create(this, () => {
                    this.changeStackCount(-tPoisonInfo.stack_count);
                }))
                this.changeStackCount(tPoisonInfo.stack_count);
                table.insert(this.tPoisonerInfos, tPoisonInfo)
                HashTableHelper.RemoveHashtable(tPoisonInfo)
            }
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let iTotalDamge = 0
            let lastPoisoner = this.GetParentPlus() // 实在不行的情况下，只能自己打自己
            for (let tPoisonInfo of this.tPoisonerInfos) {
                iTotalDamge = iTotalDamge + tPoisonInfo.stack_count
                // 根据毒来源造成伤害
                let this_poisoner = tPoisonInfo.poisoner
                // 如果这个单位已经不存在了，就用上个单位来造成伤害
                if (GameFunc.IsValid(this_poisoner) && this_poisoner.IsAlive()) {
                    lastPoisoner = this_poisoner
                } else {
                    this_poisoner = lastPoisoner
                }
                BattleHelper.GoApplyDamage({
                    ability: tPoisonInfo.ability,
                    attacker: this_poisoner,
                    victim: hParent,
                    damage: tPoisonInfo.stack_count,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                    eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_POISON + BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_DOT + BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NO_DAMAGE_TRANSFORM + BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NO_SPELL_CRIT,
                })
            }
            //  头顶绿色数字
            let _incom = modifier_property.SumProps(hParent, null, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_POISON_COUNT_PERCENTAGE);
            let fPercent = 1 + _incom / 100 || 1
            let iVisualNum = iTotalDamge * fPercent
            if (iVisualNum > 0) {
                SendOverheadEventMessage(null, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_POISON_DAMAGE, hParent, iVisualNum, hParent.GetPlayerOwner())
            }
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    OnShowTooltip() {
        return this.GetStackCount()
    }
    /**最大毒层数 */
    static MAX_POISON_STACK = 2100000000
    /**毒伤害buff的持续时间 */
    static POISON_DURATION = 10
    /**
     * 中毒效果
     * @param htarget 目标
     * @param hCaster 施法者
     * @param hAbility 技能
     * @param iCount 中毒层数
     * @param duration 持续时间
     */
    static Poison(htarget: IBaseNpc_Plus, hCaster: IBaseNpc_Plus, hAbility: IBaseAbility_Plus, iCount: number, duration: number = modifier_poison.POISON_DURATION) {
        if (!IsServer()) { return };
        if (!GameFunc.IsValid(htarget)) return;
        if (iCount > 0) {
            let _out = modifier_property.SumProps(hCaster, null, GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_POISON_COUNT_PERCENTAGE);
            let _incom = modifier_property.SumProps(htarget, null, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_POISON_COUNT_PERCENTAGE);
            iCount = iCount * (1 + _out * 0.01) * (1 + _incom * 0.01)
        }
        let iPoisonStack = math.min(iCount, modifier_poison.MAX_POISON_STACK)   //  毒层数
        let hPoisonModifier = modifier_poison.findIn(htarget);
        if (GameFunc.IsValid(hPoisonModifier)) {
            let iStack = hPoisonModifier.GetStackCount()
            let iTargetStack = modifier_poison.MAX_POISON_STACK - iStack
            iPoisonStack = iTargetStack > iPoisonStack && iPoisonStack || iTargetStack
        }
        let poisonInfo = HashTableHelper.CreateHashtable({
            poisoner: hCaster, //  下毒者
            ability: hAbility, //  技能
            stack_count: iPoisonStack
        });
        modifier_poison.apply(htarget, hCaster, hAbility, { duration: duration, hashtableUUid: poisonInfo.__hashuuid__ })
    }
    /**
     * 激发毒伤害，造成当前毒层数xfPercent的毒伤害
     * @param htarget
     * @param hCaster
     * @param hAbility
     * @param fPercent
     */
    static PoisonActive(htarget: IBaseNpc_Plus, hCaster: IBaseNpc_Plus, hAbility: IBaseAbility_Plus, fPercent: number) {
        let iDamage = fPercent * modifier_poison.GetPoisonStackCount(htarget);
        if (iDamage > 0) {
            BattleHelper.GoApplyDamage({
                ability: hAbility,
                attacker: hCaster,
                victim: htarget,
                damage: iDamage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_POISON +
                    BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_DOT +
                    BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NO_DAMAGE_TRANSFORM +
                    BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NO_SPELL_CRIT,
            })
            let _incom = modifier_property.SumProps(htarget, null, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_POISON_DAMAGE_PERCENTAGE);
            let fPoisonPercent = (1 + _incom * 0.01) || 1;
            let iVisualNum = iDamage * fPoisonPercent
            if (iVisualNum > 0) {
                SendOverheadEventMessage(null, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_POISON_DAMAGE, htarget, iVisualNum, hCaster.GetPlayerOwner())
            }
        }
    }
    /**
     * 获取毒层数
     * @param htarget
     * @returns
     */
    static GetPoisonStackCount(htarget: IBaseNpc_Plus) {
        let modifier = htarget.FindModifierByName(modifier_poison.name) as modifier_poison;
        if (GameFunc.IsValid(modifier)) {
            return modifier.GetStackCount()
        }
        else {
            return 0
        }
    }
    /**todo */
    static RemovePoison(htarget: IBaseNpc_Plus) {

    }
}

